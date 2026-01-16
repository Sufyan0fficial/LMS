import { AsyncWrapper } from "../MiddleWare/AsyncWrapper.js";
import {
  CourseModel,
  ICourseDataSchema,
  ICourseSchema,
} from "../Model/course.model.js";
import cloudinary from "cloudinary";
import { customError } from "../Utils/customError.js";
import { redisClient } from "../Redis/init.redis.js";
import mongoose from "mongoose";
import { __dirname } from "./authuser.controller.js";
import path from "path";
import ejs from "ejs";
import { sendMail } from "../Utils/sendActivationEmail.js";
import { NotificationModel } from "../Model/notification.model.js";
import axios from "axios";

export const Upload_Course = AsyncWrapper(async (req, res, next) => {
  const courseData = req?.body;
  const thumbnail = req.body?.thumbnail;
    const Cloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });
    courseData.thumbnail = {
      public_id: Cloud.public_id,
      url: Cloud.secure_url,
  }
  const response = await CourseModel.create(courseData);
  return res.status(200).json({
    message: "Course Uploaded successfully",
    success: true,
    data: response,
  });
});

export const Edit_Course = AsyncWrapper(async (req, res, next) => {
  const id = req.params?.id;
  console.log("id is", id);
  let RequestedChanges = req.body;
  const thumbnail = req.body?.thumbnail;
  if (!thumbnail) {
    delete RequestedChanges.thumbnail;
  }
  console.log("hi");
  const isCourseAvailable = await CourseModel.findOne({ _id: id });
  console.log("course is", isCourseAvailable);
  if (!isCourseAvailable) {
    return next(customError(400, "Course does not exist"));
  }
  if (thumbnail && isCourseAvailable?.thumbnail.public_id) {
    cloudinary.v2.uploader.destroy(isCourseAvailable?.thumbnail.public_id);
    const cloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });
    RequestedChanges.thumbnail = {
      public_id: cloud.public_id,
      url: cloud.secure_url,
    };
  }
  if (thumbnail && !isCourseAvailable?.thumbnail.public_id) {
    const cloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });
    RequestedChanges.thumbnail = {
      public_id: cloud.public_id,
      url: cloud.secure_url,
    };
  }

  const updatedCourse = await CourseModel.findByIdAndUpdate(
    id,
    RequestedChanges,
    { new: true }
  );
  return res.status(201).json({
    success: true,
    message: "Course updated successfully",
    data: updatedCourse,
  });
});

export const Get_Single_Course = AsyncWrapper(
  async (req, res, next) => {
    const id = req.params?.id;
    if (!id) {
      return next(customError(400, "Failed to fetch requested Course"));
    }
    const isRedisAvailable = (await redisClient.get(id)) as any;
    if (isRedisAvailable) {
      const parsedData = JSON.parse(isRedisAvailable);
      if (Object.keys(parsedData).length > 0) {
        console.log("redis hitting");
        return res.status(200).json({
          data: parsedData,
          success: true,
        });
      }
    } else {
      console.log("db hitting");
    const Course = await CourseModel.findById(id).select(
      "-courseData.links -courseData.suggestion -courseData.questions -courseData.video.url"
    );
    await redisClient.set(id, JSON.stringify(Course));
    return res.status(200).json({
      data: Course,
      success: true,
    });
  }
  }
);

export const Get_Courses = AsyncWrapper(async (req, res, next) => 
  {
  const isRedisAvailable = (await redisClient.get("allCourses")) as any;
  const parsedData = JSON.parse(isRedisAvailable);
  if (parsedData?.length > 0) {
    console.log("redis hitting");
    return res.status(200).json({
      data: parsedData,
      success: true,
    });
  }
   else {
    console.log("db hitting");
  const Courses = await CourseModel.find().select(
    "-courseData.links -courseData.suggestion -courseData.questions -courseData.video.url"
  );
  await redisClient.set("allCourses", JSON.stringify(Courses));
  return res.status(200).json({
    data: Courses,
    success: true,
  });
  }})

export const Access_Course_Content = AsyncWrapper(async (req, res, next) => {
  const courseId = req.params?.id;
  const userEnrolledCourses: string[] = req.user?.courses;
  console.log("courses ", userEnrolledCourses);
  const isRequestedCourseEnrolled = userEnrolledCourses.find(
    (course: any) => course === courseId
  );

  if (!isRequestedCourseEnrolled) {
    return next(
      customError(400, "Course Content is Protected ! Use is not enrolled")
    );
  }
  const course = await CourseModel.findById(courseId);
  const courseContent = course?.courseData;
  return res.status(200).json({
    success: true,
    message: "Course Content fetched successfully",
    data: courseContent,
  });
});

export const Ask_Question = AsyncWrapper(async (req, res, next) => {
  const { courseId, contentId, question } = req.body;
  const user = req.user;
  // 1️⃣ Validate ObjectIds
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(contentId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid courseId or contentId",
    });
  }

  const Question = {
    question,
    user,
    answer: [],
    createdAt: new Date(),
  };

  // 2️⃣ Push question into specific courseData object
  const updatedCourse = await CourseModel.findOneAndUpdate(
    {
      _id: courseId,
      "courseData._id": contentId,
    },
    {
      $push: {
        "courseData.$.questions": Question,
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatedCourse) {
    return res.status(404).json({
      success: false,
      message: "Course or content not found",
    });
  }

  const courseContent = updatedCourse?.courseData.find(
    (obj: any) => obj._id === contentId
  ) as ICourseDataSchema;
  await NotificationModel.create({
    title: "New Question Asked",
    userId: user?._id,
    message: `${user?.name} just asked a new question about ${courseContent?.name}`,
  });
  res.status(200).json({
    success: true,
    message: "Question added successfully",
    data: updatedCourse,
  });
});

export const Answer_Question = AsyncWrapper(async (req, res, next) => {
  const { answer, courseId, contentId, questionId } = req.body;
  if (!courseId || !contentId || !questionId) {
    return next(customError(400, "Required Id is missing"));
  }
  const Course = await CourseModel.findOneAndUpdate(
    { _id: courseId, "courseData._id": contentId },
    {
      $push: {
        "courseData.$.questions.$[q].answer": {
          answer,
          user: req.user,
          timeStamp: new Date(),
        },
      },
    },
    {
      new: true,
      runValidators: true,
      arrayFilters: [
        {
          "q._id": questionId,
        },
      ],
    }
  );
  const TargetedQuestion = await CourseModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $unwind: "$courseData",
    },
    {
      $unwind: "$courseData.questions",
    },
    {
      $match: {
        "courseData.questions._id": new mongoose.Types.ObjectId(questionId),
      },
    },
    {
      $match: {
        "courseData._id": new mongoose.Types.ObjectId(contentId),
      },
    },
    {
      $project: {
        data: "$courseData.questions",
        courseContent: "$courseData",
        _id: 0,
      },
    },
  ]);
  const targetQuestionData = TargetedQuestion[0]?.data;
  const emailTemplate = await ejs.renderFile(
    path.join(__dirname, "../Templates/NewAnswer.ejs"),
    {
      userName: targetQuestionData?.user?.name,
      questionText: targetQuestionData?.question,
      answerText: answer,
      questionUrl: "question url",
      replier: req.user?.name,
      courseContent: TargetedQuestion[0]?.courseContent?.name,
    }
  );
  await sendMail({
    to: targetQuestionData?.user?.email,
    subject: `${req.user?.name} answered to your question`,
    html: emailTemplate,
  });
  console.log("targeted question is", TargetedQuestion);
  if (!Course) {
    return next(customError(400, "Failed to post answer"));
  }
  return res.status(201).json({
    success: true,
    message: "Answer posted successfully",
    data: Course,
  });
});

export const Add_Review = AsyncWrapper(async (req, res, next) => {
  const courseId = req.params?.id;
  const comment = req.body?.comment;
  const rating = req.body?.rating;
  const user = req.user;
  const enrolledCourses = user?.courses;
  const isUserEligible = enrolledCourses.some(
    (course: string) => course === courseId
  );
  if (!isUserEligible) {
    return next(
      customError(400, "You are not eligible to add review to this course")
    );
  }
  const reviewData = {
    comment,
    rating,
    user,
    createdAt: new Date(),
  };

  const addReview = await CourseModel.findOneAndUpdate(
    {
      _id: courseId,
    },
    {
      $push: {
        reviews: reviewData,
      },
    },
    { new: true, runValidators: true }
  );
  if (!addReview) {
    return next(customError(400, "Failed to add review"));
  }
  const allReveiws = addReview?.reviews;
  console.log("all reviews are", allReveiws);
  let totalSum: number = 0;

  allReveiws?.forEach((rev: any) => {
    const rating = Number(rev?.rating);
    if (!isNaN(rating)) {
      totalSum += rating;
    }
  });

  console.log("total sum is", totalSum);

  const avgRating = totalSum / allReveiws?.length;
  console.log("avg Rating", avgRating);
  const Course = await CourseModel.findOneAndUpdate(
    {
      _id: courseId,
    },
    {
      ratings: avgRating,
    },
    { new: true, runValidators: true }
  );

  if (!addReview) {
    return next(customError(400, "Failed to add review"));
  }
  return res.status(200).json({
    success: true,
    message: "Review added successfully",
    data: Course,
  });
});

export const Reply_Review = AsyncWrapper(async (req, res, next) => {
  const { reply, courseId, reviewId } = req.body;
  if (!courseId || !reviewId) {
    return next(customError(400, "Failed to post your reply"));
  }
  const AdminReply = {
    reply,
    user: req.user,
    createdAt: new Date(),
  };
  const Course = await CourseModel.findOneAndUpdate(
    {
      _id: courseId,
      "reviews._id": reviewId,
    },
    {
      $push: {
        "reviews.$.reviewReplies": AdminReply,
      },
    },
    { new: true, runValidators: true }
  );
  if (!Course) {
    return next(customError(400, "Failed to post your reply!"));
  }
  return res.status(200).json({
    messsage: "Your reply has been posted successfully",
    success: true,
    data: Course,
  });
});

export const Get_All_Courses = AsyncWrapper(async (req, res, next) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    data: courses,
  });
});

export const Delete_Course = AsyncWrapper(async (req, res, next) => {
  const courseId = req.params?.id;
  console.log("course id is", courseId);
  const courseDeleted = await CourseModel.findByIdAndDelete(courseId);
  await redisClient.del(courseId);
  if (!courseDeleted) {
    return next(customError(400, "Failed to delete requested Course"));
  }
  const courses = await CourseModel.find({});
  return res.status(200).json({
    success: true,
    message: "Course Deleted successfully",
    data: courses,
  });
});

export const VdoCipher_Video_Data = AsyncWrapper(async (req, res, next) => {
  const { videoUrl } = req.body;
  const response = await axios.post(
    `https://dev.vdocipher.com/api/videos/${videoUrl}/otp`,
    { ttl: 300 },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRETS}`,
      },
    }
  );
  if (!response.data) {
    return next(customError(400, "Failed to fetch Requested Video"));
  }
  return res.status(200).json({ success: true, data: response.data });
});
