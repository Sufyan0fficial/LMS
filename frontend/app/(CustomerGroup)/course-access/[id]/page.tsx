"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetCourseContentApi } from "@/app/APIs/routes";
import { Button, Collapse, Spin, message, Tabs, Rate, Input } from "antd";
import {
  PlayCircleOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  FileTextOutlined,
  FolderOutlined,
  QuestionCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import VideoPlayer from "@/app/components/AdminComponents/VideoPlayer";
import Link from "next/link";

const { TextArea } = Input;

interface CourseSection {
  sectionName: string;
  data: {
    _id: string;
    name: string;
    description: string;
    url: string;
    videoLength: string;
    link: { title: string; url: string }[];
    questions?: any[];
  }[];
}

interface LessonData {
  _id: string;
  name: string;
  description: string;
  url: string;
  videoLength: string;
  link: { title: string; url: string }[];
  questions?: any[];
}

const CourseAccess = () => {
  const [courseContent, setCourseContent] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState({
    section: 0,
    lesson: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  useEffect(() => {
    if (courseId) {
      fetchCourseContent();
    }
  }, [courseId]);

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      const response = await GetCourseContentApi(courseId);

      if (response.data.success) {
        setCourseContent(response.data.data);
        // Set first video as default
        if (response.data.data[0]?.data[0]) {
          const firstLesson = response.data.data[0].data[0];
          setCurrentVideo(firstLesson.url);
          setCurrentLesson(firstLesson);
          setCurrentLessonIndex({ section: 0, lesson: 0 });
        }
      }
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
          "Access denied. You are not enrolled in this course.",
      );
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (
    lesson: LessonData,
    sectionIndex: number,
    lessonIndex: number,
  ) => {
    setCurrentVideo(lesson.url);
    setCurrentLesson(lesson);
    setCurrentLessonIndex({ section: sectionIndex, lesson: lessonIndex });
  };

  const getAllLessons = () => {
    const allLessons: {
      lesson: LessonData;
      sectionIndex: number;
      lessonIndex: number;
    }[] = [];
    courseContent.forEach((section, sectionIndex) => {
      section.data.forEach((lesson, lessonIndex) => {
        allLessons.push({ lesson, sectionIndex, lessonIndex });
      });
    });
    return allLessons;
  };

  const getCurrentLessonGlobalIndex = () => {
    const allLessons = getAllLessons();
    return allLessons.findIndex(
      (item) =>
        item.sectionIndex === currentLessonIndex.section &&
        item.lessonIndex === currentLessonIndex.lesson,
    );
  };

  const navigateToLesson = (direction: "prev" | "next") => {
    const allLessons = getAllLessons();
    const currentGlobalIndex = getCurrentLessonGlobalIndex();

    let newIndex;
    if (direction === "prev") {
      newIndex = currentGlobalIndex > 0 ? currentGlobalIndex - 1 : 0;
    } else {
      newIndex =
        currentGlobalIndex < allLessons.length - 1
          ? currentGlobalIndex + 1
          : allLessons.length - 1;
    }

    const targetLesson = allLessons[newIndex];
    if (targetLesson) {
      handleLessonClick(
        targetLesson.lesson,
        targetLesson.sectionIndex,
        targetLesson.lessonIndex,
      );
    }
  };

  const canNavigatePrev = () => getCurrentLessonGlobalIndex() > 0;
  const canNavigateNext = () =>
    getCurrentLessonGlobalIndex() < getAllLessons().length - 1;

  const formatDuration = (duration: string) => {
    return duration || "N/A";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark">
        <Spin size="large" />
      </div>
    );
  }

  const collapseItems = courseContent.map((section, sectionIndex) => ({
    key: sectionIndex.toString(),
    label: (
      <div className="flex justify-between items-center">
        <span className="font-semibold text-primary-light dark:text-primary-dark">
          {section.sectionName}
        </span>
        <span className="text-sm text-secondary-light dark:text-secondary-dark">
          {section.data.length} lessons
        </span>
      </div>
    ),
    children: (
      <div className="space-y-2">
        {section.data.map((lesson, lessonIndex) => (
          <div
            key={lesson._id}
            onClick={() => handleLessonClick(lesson, sectionIndex, lessonIndex)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
              currentLesson?._id === lesson._id
                ? "bg-bprimary/10 border-bprimary"
                : "bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark hover:bg-bprimary/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <PlayCircleOutlined
                className={`text-lg ${
                  currentLesson?._id === lesson._id
                    ? "text-bprimary"
                    : "text-secondary-light dark:text-secondary-dark"
                }`}
              />
              <div className="flex-1">
                <h4 className="font-medium text-primary-light dark:text-primary-dark">
                  {lesson.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <ClockCircleOutlined className="text-xs text-secondary-light dark:text-secondary-dark" />
                  <span className="text-xs text-secondary-light dark:text-secondary-dark">
                    {formatDuration(lesson.videoLength)} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  }));

  const tabItems = [
    {
      key: "overview",
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          Overview
        </span>
      ),
      children: (
        <div className=" space-y-4">
          {currentLesson ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">
                  About this lesson
                </h3>
                <p className="text-secondary-light dark:text-secondary-dark leading-relaxed">
                  {currentLesson.description}
                </p>
              </div>

              <div className="border-t border-border-light dark:border-border-dark pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-secondary-light dark:text-secondary-dark">
                      Duration:
                    </span>
                    <p className="font-medium text-primary-light dark:text-primary-dark">
                      {formatDuration(currentLesson.videoLength)} minutes
                    </p>
                  </div>
                  <div>
                    <span className="text-secondary-light dark:text-secondary-dark">
                      Lesson Type:
                    </span>
                    <p className="font-medium text-primary-light dark:text-primary-dark">
                      Video
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-secondary-light dark:text-secondary-dark">
              Select a lesson to view details
            </p>
          )}
        </div>
      ),
    },
    {
      key: "resources",
      label: (
        <span className="flex items-center gap-2">
          <FolderOutlined />
          Resources
        </span>
      ),
      children: (
        <div className="">
          {currentLesson?.link && currentLesson.link.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">
                Lesson Resources
              </h3>
              {currentLesson.link.map((resource, index) => (
                <Link
                  key={index}
                  href={resource.url}
                  target="_blank"
                  className="block p-3 bg-bprimary/5 rounded-lg border border-bprimary/20 hover:bg-bprimary/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileTextOutlined className="text-bprimary" />
                    <div>
                      <h4 className="font-medium text-bprimary">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-secondary-light dark:text-secondary-dark">
                        External Link
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderOutlined className="text-4xl text-secondary-light dark:text-secondary-dark mb-2" />
              <p className="text-secondary-light dark:text-secondary-dark">
                No resources available for this lesson
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "qa",
      label: (
        <span className="flex items-center gap-2">
          <QuestionCircleOutlined />
          Q&A
        </span>
      ),
      children: (
        <div className=" space-y-4">
          <div className="border-b border-border-light dark:border-border-dark pb-4">
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-3">
              Ask a Question
            </h3>
            <TextArea
              rows={3}
              placeholder="Type your question about this lesson..."
              className="mb-3"
            />
            <Button type="primary" className="bg-bprimary mt-3">
              Post Question
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-3">
              Questions & Answers
            </h3>
            <div className="text-center py-8">
              <QuestionCircleOutlined className="text-4xl text-secondary-light dark:text-secondary-dark mb-2" />
              <p className="text-secondary-light dark:text-secondary-dark">
                No questions yet. Be the first to ask!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "reviews",
      label: (
        <span className="flex items-center gap-2">
          <StarOutlined />
          Reviews
        </span>
      ),
      children: (
        <div className=" space-y-4">
          <div className="border-b border-border-light dark:border-border-dark pb-4">
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-3">
              Rate this Course
            </h3>
            <div className="space-y-3">
              <Rate allowHalf defaultValue={0} className="mb-3!" />
              <TextArea
                rows={3}
                placeholder="Share your experience with this course..."
                className="mb-3"
              />
              <Button type="primary" className="bg-bprimary mt-3">
                Submit Review
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-3">
              Course Reviews
            </h3>
            <div className="text-center py-8">
              <StarOutlined className="text-4xl text-secondary-light dark:text-secondary-dark mb-2" />
              <p className="text-secondary-light dark:text-secondary-dark">
                No reviews yet. Be the first to review!
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-body-light dark:bg-body-dark">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="border-border-light dark:border-border-dark"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            Course Content
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
              {currentVideo ? (
                <div className="space-y-0">
                  <div className="aspect-video bg-black">
                    <VideoPlayer demoUrl={currentVideo} />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center p-6 lg:px-10 border-b border-border-light dark:border-border-dark">
                    <Button
                      icon={<LeftOutlined />}
                      onClick={() => navigateToLesson("prev")}
                      disabled={!canNavigatePrev()}
                      className="flex items-center gap-2"
                    >
                      Prev Lesson
                    </Button>
                    <Button
                      icon={<RightOutlined />}
                      iconPosition="end"
                      onClick={() => navigateToLesson("next")}
                      disabled={!canNavigateNext()}
                      className="flex items-center gap-2"
                    >
                      Next Lesson
                    </Button>
                  </div>

                  {/* Current Lesson Title */}
                  {currentLesson && (
                    <div className=" border-b border-border-light dark:border-border-dark  p-6 lg:px-10">
                      <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                        {currentLesson.name}
                      </h2>
                    </div>
                  )}

                  {/* Tabs Section */}
                  <div className="bg-card-light dark:bg-card-dark  p-6 lg:px-10">
                    <Tabs
                      // activeKey={activeTab}
                      // onChange={setActiveTab}
                      defaultActiveKey="1"
                      items={tabItems}
                    />
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <p className="text-secondary-light dark:text-secondary-dark">
                    Select a lesson to start watching
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Course Sections */}
          <div className="lg:col-span-1">
            <div className="bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark">
              <div className="p-4 border-b border-border-light dark:border-border-dark">
                <h3 className="font-semibold text-primary-light dark:text-primary-dark">
                  Course Sections
                </h3>
              </div>
              <div className="p-4">
                <Collapse
                  items={collapseItems}
                  defaultActiveKey={["0"]}
                  ghost
                  styles={{
                    root: {
                      border: "none",
                      marginBottom: "8px",
                    },
                    header: {
                      padding: "12px 0",
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAccess;
