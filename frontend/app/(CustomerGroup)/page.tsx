"use client";

import { FC, useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Courses from "../components/Courses";
import Reviews from "../components/Reviews";
import { useDispatch } from "react-redux";
import { dispatchscreenWidth } from "../Redux/UtilSlice";
import Faqs from "./faqs/page";
import Footer from "../components/Footer";

interface IProps {}

const Page: FC<IProps> = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkInnerWidth = () => {
      console.log("inner Widht is", innerWidth);
      dispatch(dispatchscreenWidth(innerWidth));
    };
    checkInnerWidth();
    window.addEventListener("resize", checkInnerWidth);
    return () => window.removeEventListener("resize", checkInnerWidth);
  }, [dispatch]);

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
