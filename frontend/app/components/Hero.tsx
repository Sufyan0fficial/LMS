"use client";
import React, { useEffect } from "react";
import { SearchIcon } from "./ReactIcons";
import Link from "next/link";
import { Avatar, Button } from "antd";
import Image from "next/image";
import AnimatedWrapper from "@/utils/AnimatedWrapper";
import { useSelector } from "react-redux";

function Hero() {
  const {hero} = useSelector((state:any)=>state.LayoutReducer)
  const heroImage = hero?.image ? hero?.image : '/hero-main.png'
  const heroTitle = hero?.title ? hero?.title : 'Improve Your Online Learning Experience Better Instantly'
  
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col md:flex-row md:items-center md:justify-center items-center mt-10 lg:mt-0">
      <div className="w-60 h-60 md:min-w-120 md:min-h-120 relative   rounded-full bg-linear-to-b  dark:from-bprimary dark:to-black from-accent to-body-light flex justify-center items-center">
        <AnimatedWrapper from="bottom">
          <Image
            src={heroImage}
            alt="lms image"
            className="object-cover rounded-full"
            fill
            
          />
        </AnimatedWrapper>
      </div>
      <div className="w-full  flex flex-col items-center mt-6">
        <div className=" w-4/5 md:w-3/4 flex flex-col gap-y-4 md:gap-y-6 items-center">
        <div className="text-wrap text-display block text-center">
            {heroTitle}
        </div>
          <div className="flex border border-input-border-light dark:border-input-border-dark rounded-md w-full">
            <input
              type="text"
              placeholder="Search Courses ..."
              className="input-field w-full text-ui"
            />
            <div className="bg-bprimary-hover flex items-center px-2.5 md:px-3">
              <SearchIcon />
            </div>
          </div>
          <div className="flex flex-col md:flex-row  gap-4 items-center">
            <Avatar.Group shape="circle">
              <Avatar style={{ backgroundColor: "#fde3cf" }}>A</Avatar>
              <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
              <Avatar style={{ backgroundColor: "#87d068" }} />
              <Avatar style={{ backgroundColor: "#1677ff" }} />
            </Avatar.Group>
            <span className="font-medium leading-tight text-muted-light dark:text-secondary-dark">
              500K+ People already trusted us
            </span>
          </div>
          <Link
            href={"/courses"}
            className=""
          >
            <Button variant="filled" color="green">View Courses</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
