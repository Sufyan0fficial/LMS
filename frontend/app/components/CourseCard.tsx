"use client";

import React, { useState } from "react";
import { ICourseData } from "../types/apifn.types";
import Image from "next/image";
import { Rate, Tag } from "antd";
import { useSelector } from "react-redux";
import { VscThreeBars } from "react-icons/vsc";
import { FiUsers, FiClock, FiAward } from "react-icons/fi";

const CourseCard = ({ course }: { course: ICourseData }) => {
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [imageError, setImageError] = useState(false);
  
  const fallbackImage = "/placeholder-course.jpg";
  const displayImage = imageError || !course.thumbnail?.url ? fallbackImage : course.thumbnail.url;
  
  const totalLessons = course.courseData?.reduce((total, section) => total + (section.data?.length || 0), 0) || 0;

  return (
    <div className="group rounded-2xl border-2 border-border-light dark:border-border-dark cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden bg-card-light dark:bg-card-dark h-full flex flex-col hover:border-bprimary/50">
      {/* Image Container with Overlay */}
      <div className="relative w-full h-52 overflow-hidden">
        <Image
          src={displayImage}
          alt={course?.name || "Course"}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <Tag 
            color={course.level === 'advanced' ? 'red' : course.level === 'intermediate' ? 'orange' : 'green'}
            className="font-semibold capitalize px-3 py-1 rounded-full border-0"
          >
            {course.level || "Beginner"}
          </Tag>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg">
          <span className="text-lg font-bold text-bprimary dark:text-accent">
            {course.price === 0 ? "Free" : `$${course.price || 0}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <Rate
            size="small"
            disabled
            value={course.ratings || 0}
            className="text-sm"
          />
          <span className="text-meta text-muted-light dark:text-muted-dark">
            ({course.ratings || 0})
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-primary-light dark:text-primary-dark mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-bprimary transition-colors">
          {course.name || "Untitled Course"}
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-meta">
          <div className="flex items-center gap-2 text-secondary-light dark:text-secondary-dark">
            <FiUsers className="text-bprimary" />
            <span>{course.purchased || 0} Students</span>
          </div>
          <div className="flex items-center gap-2 text-secondary-light dark:text-secondary-dark">
            <VscThreeBars className="text-accent" />
            <span>{totalLessons} Lessons</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border-light dark:border-border-dark my-3"></div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          {course.estimatedPrice && course.estimatedPrice !== 0 && course.price !== 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-muted-light dark:text-muted-dark">
                ${course.estimatedPrice}
              </span>
              <span className="text-sm font-semibold text-success">
                Save ${Math.round(course.estimatedPrice - (course.price || 0))}
              </span>
            </div>
          )}
          {(course.price === 0 || !course.estimatedPrice) && (
            <div className="flex items-center gap-1 text-accent">
              <FiAward />
              <span className="text-sm font-medium">Certificate Included</span>
            </div>
          )}
        </div>

        {/* Hover CTA */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-full text-center py-2 bg-bprimary/10 dark:bg-bprimary/20 text-bprimary font-semibold rounded-lg">
            View Details →
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
