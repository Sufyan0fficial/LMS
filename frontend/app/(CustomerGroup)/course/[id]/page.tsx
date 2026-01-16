import React, { useEffect, useState } from "react";

const CourseDetails = async({ params }: { params: Promise<{ id: string }> }) => {
    const courseId = (await params).id
    const [loading, setloading] = useState(false)
    useEffect(()=>{
        const getCourseData = async()=>{
            try {
                setloading(true)
                
            } catch (error) {
                
            }
            finally{
                setloading(false)
            }
        }
        getCourseData()
    },[])
  return <div>CourseDetails</div>;
};

export default CourseDetails;
