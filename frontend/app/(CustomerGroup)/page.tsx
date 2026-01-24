"use client";

import { FC, useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Courses from "../components/Courses";
import Reviews from "../components/Reviews";
import { useDispatch } from "react-redux";
import { dispatchscreenWidth } from "../Redux/UtilSlice";
import Faqs from "./faqs/page";
import Footer from "../components/Footer";
import { removeCourses } from "../Redux/UserSlice";
import { socket } from "@/socketio";
import { Button } from "antd";
import Lottie from "lottie-react";
import lottieAnimation from '@/public/loader.json'

interface IProps {}

const Page: FC<IProps> = () => {
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkInnerWidth = () => {
      console.log("inner Width is", innerWidth);
      dispatch(dispatchscreenWidth(innerWidth));
    };
    checkInnerWidth();
    window.addEventListener("resize", checkInnerWidth);

    // Simulate initial page load time
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener("resize", checkInnerWidth);
      clearTimeout(timer);
    };
  }, [dispatch]);

  if (initialLoading) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-body-light dark:bg-body-dark">
        <div className="text-center">
          <div className="h-80 lg:h-100 mx-auto aspect-square ">
            <Lottie 
              animationData={lottieAnimation} 
              loop={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full px-6 md:px-10 mx-auto flex flex-col gap-y-10 lg:gap-y-20">
      <Hero />
      <Courses />
      <Reviews />
      <Faqs />
    </div>
  );
};

export default Page;
