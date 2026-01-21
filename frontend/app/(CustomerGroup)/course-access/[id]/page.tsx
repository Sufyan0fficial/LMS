"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetCourseContentApi } from "@/app/APIs/routes";
import { Button, Collapse, Spin, message } from "antd";
import { PlayCircleOutlined, ArrowLeftOutlined, ClockCircleOutlined } from "@ant-design/icons";
import VideoPlayer from "@/app/components/AdminComponents/VideoPlayer";
import Link from "next/link";

interface CourseSection {
  sectionName: string;
  data: {
    _id: string;
    name: string;
    description: string;
    url: string;
    videoLength: string;
    link: { title: string; url: string }[];
  }[];
}

const CourseAccess = () => {
  const [courseContent, setCourseContent] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  useEffect(() => {
    fetchCourseContent();
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
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Access denied. You are not enrolled in this course.");
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson: any) => {
    setCurrentVideo(lesson.url);
    setCurrentLesson(lesson);
  };

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

  const collapseItems = courseContent.map((section, index) => ({
    key: index.toString(),
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
        {section.data.map((lesson) => (
          <div
            key={lesson._id}
            onClick={() => handleLessonClick(lesson)}
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
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              {currentVideo ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                   <VideoPlayer demoUrl={currentVideo}/>
                  </div>
                  
                  {currentLesson && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                        {currentLesson.name}
                      </h2>
                      <p className="text-secondary-light dark:text-secondary-dark">
                        {currentLesson.description}
                      </p>
                      
                      {currentLesson.link && currentLesson.link.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-primary-light dark:text-primary-dark">
                            Resources:
                          </h3>
                          {currentLesson.link.map((resource: any, index: number) => (
                            <Link
                              key={index}
                              href={resource.url}
                              target="_blank"
                              className="block p-2 bg-bprimary/10 rounded border border-bprimary/20 hover:bg-bprimary/20 transition-colors"
                            >
                              <span className="text-bprimary font-medium">
                                {resource.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
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
                  className="course-collapse"
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
