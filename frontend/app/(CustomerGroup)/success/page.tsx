"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SessionVerificationApi } from "@/app/APIs/routes";
import { Spin, Button, Result } from "antd";
import Lottie from "lottie-react";
import { useDispatch } from "react-redux";
import { GetProfileData } from "@/app/APIs/routes";
import { dispatchUserData } from "@/app/Redux/UserSlice";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'failed' | null>(null);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true);
        const sessionId = searchParams.get("session_id");
        
        if (!sessionId) {
          setVerificationStatus('failed');
          setMessage("Invalid payment session");
          return;
        }

        const response = await SessionVerificationApi({ id: sessionId });
        
        if (response.data.success) {
          setVerificationStatus('success');
          setMessage("Payment successful! Course access granted.");
          
          // Refresh user data to update purchased courses
          try {
            const userResponse = await GetProfileData();
            if (userResponse.data.success) {
              dispatch(dispatchUserData(userResponse.data.data));
            }
          } catch (error) {
            console.error("Error refreshing user data:", error);
          }
        } else {
          setVerificationStatus('failed');
          setMessage("Payment verification failed");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setVerificationStatus('failed');
        setMessage(error.response?.data?.message || "Payment verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, dispatch]);

  const handleGoToCourses = () => {
    router.replace("/");
  };

  const handleRetry = () => {
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-lg text-secondary-light dark:text-secondary-dark">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 border border-border-light dark:border-border-dark shadow-lg">
          {/* Success/Failure Icon */}
          <div className="mb-6 flex justify-center">
            {verificationStatus === 'success' ? (
              <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-24 h-24 bg-error rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Status Content */}
          {verificationStatus === 'success' ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-success mb-4">Payment Successful!</h1>
              <p className="text-secondary-light dark:text-secondary-dark mb-6">
                {message}
              </p>
              <Button
                type="primary"
                size="large"
                onClick={handleGoToCourses}
                className="bg-bprimary hover:bg-bprimary-hover border-none w-full"
              >
                Go to My Courses
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-error mb-4">Payment Failed</h1>
              <p className="text-secondary-light dark:text-secondary-dark mb-6">
                {message}
              </p>
              <Button
                type="primary"
                size="large"
                onClick={handleRetry}
                className="bg-bprimary hover:bg-bprimary-hover border-none w-full"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;
