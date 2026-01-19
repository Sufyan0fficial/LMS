import React, { useEffect, useState } from 'react'

const Success = () => {
    const [loading, setloading] = useState(false)
    useEffect(()=>{
        const verifyPayment = async()=>{
            try {
                setloading(true)
            } catch (error) {
                
            }
            finally{
                setloading(false)
            }
        }
    },[])
  return (
    <div>Success</div>
  )
}

export default Success