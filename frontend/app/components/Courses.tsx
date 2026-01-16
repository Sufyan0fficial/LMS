import React, { useEffect, useState } from 'react'
import CourseCard from './CourseCard'
import { GetCoursesApi } from '../APIs/routes'
import { ICourseData } from '../types/apifn.types'
import { message } from 'antd'
import { useRouter } from 'next/navigation'

const Courses = () => {
  const [loading, setloading] = useState(false)
  const [courses,setCourses] = useState<ICourseData[]>([])
  const [messageApi,contextHolder] = message.useMessage()
  const router = useRouter()
  useEffect(()=>{
    const fetchData = async()=>{
      try {
        setloading(true)
        const res = await GetCoursesApi()
        if(res.data.success){
          setCourses(res.data.data)
        }
      } catch (error) {
        messageApi.error('Something went wrong, Please try again later')
      }
      finally{
        setloading(false)
      }
    }
    fetchData()
  },[])
  return (
    <div>
      {
        contextHolder
      }
        <div className='text-display text-center mb-10 lg:mb-16'>
            Upgrade Your <span className='text-accent'>Skills</span>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6'>
          {
            courses?.length > 0 ? 
            courses.map((item,i)=>{
              return (
                <div key={i} onClick={()=>router.push(`/course/${item?._id}`)}>
                  <CourseCard course={item}/>
                </div>
              )
            }) :
            ''
          }
        </div>
    </div>
  )
}

export default Courses