"use client";
import React, { useEffect, useState } from "react";
import { GetSingleCourseApi } from "@/app/APIs/routes";
import { ICourseData, IUser } from "@/app/types/apifn.types";
import { Rate, Button, Spin } from "antd";
import {
  FaPlay,
  FaCheck,
  FaClock,
  FaUsers,
  FaCertificate,
  FaLifeRing,
} from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import VideoPlayer from "@/app/components/AdminComponents/VideoPlayer";
import { useSelector } from "react-redux";

const CourseDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const [courseId, setCourseId] = useState<string>("");
  const [course, setCourse] = useState<ICourseData | null>(null);
  const [loading, setLoading] = useState(false);
  const { user }: { user: IUser } = useSelector(
    (state: any) => state.UserReducer
  );
  const [isEnrolled, setisEnrolled] = useState(false);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setCourseId(resolvedParams.id);
      setisEnrolled(user.courses.includes(resolvedParams.id));
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!courseId) return;

    const getCourseData = async () => {
      try {
        setLoading(true);
        const response = await GetSingleCourseApi(courseId);
        setCourse(response.data.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    getCourseData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark">
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark">
        <div className="text-primary-light dark:text-primary-dark">
          Course not found
        </div>
      </div>
    );
  }

  const discountPercentage =
    course.estimatedPrice > 0
      ? Math.round(
          ((course.estimatedPrice - course.price) / course.estimatedPrice) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-body-light dark:bg-body-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="bg-card-light dark:bg-bprimary rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-light dark:text-primary-dark mb-4">
                {course.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4 justify-between">
                <div className="flex items-center gap-4">
                  <Rate disabled value={course.ratings} size="small" />
                  <span className="text-secondary-light dark:text-secondary-dark">
                    {course.reviews?.length || 0} Reviews
                  </span>
                </div>
                <span className="text-accent ">
                  {course.purchased} Students
                </span>
              </div>
            </div>

            {/* What you will learn */}
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                What you will learn from this course?
              </h2>
              <div className="space-y-3">
                {course.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FaCheck className="text-success mt-1 shrink-0" size={16} />
                    <span className="text-secondary-light dark:text-secondary-dark">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                What are the prerequisites for starting this course?
              </h2>
              <div className="space-y-3">
                {course.preRequisits?.map((prerequisite, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FaCheck
                      className="text-success mt-1 flex-shrink-0"
                      size={16}
                    />
                    <span className="text-secondary-light dark:text-secondary-dark">
                      {prerequisite}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Overview */}
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                Course Overview
              </h2>
              <div className="space-y-4">
                {course.courseData?.map((lesson, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-section-light dark:bg-section-dark"
                  >
                    <MdOutlineOndemandVideo
                      className="text-bprimary"
                      size={20}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-primary-light dark:text-primary-dark">
                        {lesson.name}
                      </h3>
                      <p className="text-sm text-muted-light dark:text-muted-dark">
                        {lesson.description}
                      </p>
                    </div>
                    <span className="text-sm text-muted-light dark:text-muted-dark">
                      {lesson.videoLength} min
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                Course Details
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Video Preview */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
                <div className="relative aspect-video bg-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <VideoPlayer demoUrl={course?.demoUrl} />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
                {isEnrolled ? (
                  <span className="text-3xl font-bold text-primary-light dark:text-primary-dark">
                      Enrolled
                    </span>
                ) : (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-primary-light dark:text-primary-dark">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    {course.estimatedPrice > 0 && (
                      <>
                        <span className="text-lg line-through text-muted-light dark:text-muted-dark">
                          ${course.estimatedPrice}
                        </span>
                        <span className="bg-success text-white px-2 py-1 rounded text-sm">
                          {discountPercentage}% Off
                        </span>
                      </>
                    )}
                  </div>
                )}

                <Button
                  type="primary"
                  size="large"
                  block
                  className="w-full border-none mb-4"
                >
                  {isEnrolled ? "Get Into Course" : `Buy Now ${course.price}`}
                </Button>

                {/* Course Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-secondary-light dark:text-secondary-dark">
                    <FaClock className="text-bprimary" />
                    <span>Source code included</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-light dark:text-secondary-dark">
                    <FaUsers className="text-bprimary" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-light dark:text-secondary-dark">
                    <FaCertificate className="text-bprimary" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-light dark:text-secondary-dark">
                    <FaLifeRing className="text-bprimary" />
                    <span>Premium Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
