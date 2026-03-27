"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SessionVerificationApi, CreateOrderApi } from "@/app/APIs/routes";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { dispatchUserData } from "@/app/Redux/UserSlice";

const PaymentVerification = () => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      console.log('⚠️ Payment already processed, skipping...');
      return;
    }

    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          router.replace("/success?status=failed&message=Invalid payment session");
          return;
        }

        console.log('🔍 Verifying payment session:', sessionId);

        hasProcessed.current = true;

        const response = await SessionVerificationApi({ id: sessionId });

        if (response.data.success) {
          const { userId, courseId } = response.data.data;
          
          console.log('✅ Payment verified, creating order...');

          // Create order
          const orderRes = await CreateOrderApi({
            courseId,
            payment_info: { session_id: sessionId }
          });

          // Update user profile
          if (orderRes.data.success) {
            dispatch(dispatchUserData(orderRes.data.data));
            console.log('✅ Order created successfully');
          }

          router.replace("/success?status=success&message=Payment successful! Course access granted.");
        } else {
          router.replace("/success?status=failed&message=Payment verification failed");
        }
      } catch (error: any) {
        router.replace(`/success?status=failed&message=${error.response?.data?.message || "Payment verification failed"}`);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, router, dispatch]); // Proper dependencies

  return (
    <div className="min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-lg text-secondary-light dark:text-secondary-dark">
          Verifying your payment...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please do not close this window
        </p>
      </div>
    </div>
  );
};

export default PaymentVerification;
