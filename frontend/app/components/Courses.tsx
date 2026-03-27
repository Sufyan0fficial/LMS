"use client";

import React, { useEffect, useState } from 'react'
import CourseCard from './CourseCard'
import { GetCoursesApi } from '../APIs/routes'
import { ICourseData } from '../types/apifn.types'
import { message, Empty, Button } from 'antd'
import { useRouter } from 'next/navigation'
import CardSkeleton from './CardSkeleton';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import AnimatedWrapper from '@/utils/AnimatedWrapper';

const Courses = () => {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<ICourseData[]>([])
  const [error, setError] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const router = useRouter()

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(false)
      const res = await GetCoursesApi()
      if (res.data.success) {
        setCourses(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      setError(true)
      messageApi.error('Failed to load courses. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRetry = () => {
    fetchData()
  }

  // Limit to 9 courses for home page
  const displayedCourses = courses.slice(0, 9);
  const hasMoreCourses = courses.length > 9;

  if (loading) {
    return (
      <div className="py-12">
        <div className='text-display text-center mb-4'>
          Explore Our <span className='text-accent'>Popular Courses</span>
        </div>
        <p className="text-center text-body text-secondary-light dark:text-secondary-dark mb-12 max-w-2xl mx-auto">
          Discover industry-leading courses designed by experts to help you master in-demand skills
        </p>
        
        {/* Skeleton Loading */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {Array(9).fill(0).map((_, i) => (
            <div key={i}>
              <CardSkeleton />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12">
        <div className='text-display text-center mb-4'>
          Explore Our <span className='text-accent'>Popular Courses</span>
        </div>
        <p className="text-center text-body text-secondary-light dark:text-secondary-dark mb-12 max-w-2xl mx-auto">
          Discover industry-leading courses designed by experts to help you master in-demand skills
        </p>
        
        {/* Error State */}
        <div className="flex flex-col items-center justify-center py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-muted-light dark:text-muted-dark mb-4">
                  Unable to load courses at the moment
                </p>
                <Button 
                  type="primary" 
                  onClick={handleRetry}
                  className="bg-bprimary hover:bg-bprimary-hover"
                >
                  Try Again
                </Button>
              </div>
            }
          />
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="py-12">
        <div className='text-display text-center mb-4'>
          Explore Our <span className='text-accent'>Popular Courses</span>
        </div>
        <p className="text-center text-body text-secondary-light dark:text-secondary-dark mb-12 max-w-2xl mx-auto">
          Discover industry-leading courses designed by experts to help you master in-demand skills
        </p>
        
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-12">
          <Empty
            description={
              <div className="text-center">
                <p className="text-muted-light dark:text-muted-dark mb-4">
                  No courses available at the moment
                </p>
                <p className="text-sm text-muted-light dark:text-muted-dark">
                  Check back soon for exciting new courses!
                </p>
              </div>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      {contextHolder}
      
      {/* Section Header */}
      <AnimatedWrapper from="bottom">
        <div className='text-display text-center mb-4'>
          Explore Our <span className='text-accent'>Popular Courses</span>
        </div>
        <p className="text-center text-body text-secondary-light dark:text-secondary-dark mb-12 max-w-2xl mx-auto">
          Discover industry-leading courses designed by experts to help you master in-demand skills
        </p>
      </AnimatedWrapper>

      {/* Courses Grid - Limited to 9 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12'>
        {displayedCourses.map((item, i) => (
          <AnimatedWrapper key={item._id || i} from="bottom" delay={i * 0.1}>
            <div 
              onClick={() => router.push(`/course/${item._id}`)}
              className="cursor-pointer h-full"
            >
              <CourseCard course={item} />
            </div>
          </AnimatedWrapper>
        ))}
      </div>

      {/* View All Courses Button */}
      {hasMoreCourses && (
        <AnimatedWrapper from="bottom">
          <div className="flex justify-center mt-8">
            <Link href="/courses">
              <Button 
                type="primary"
                size="large"
                className="bg-bprimary hover:bg-bprimary-hover border-bprimary hover:border-bprimary-hover text-white font-semibold px-10 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                icon={<FiArrowRight className="text-lg mt-2" />}
                iconPlacement='end'
              >
                View All Courses
              </Button>
            </Link>
          </div>
        </AnimatedWrapper>
      )}
    </div>
  )
}

export default Courses
