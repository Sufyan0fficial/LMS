import { Rate } from "antd";
import Image from "next/image";
import React from "react";
import ReviewCard from "./ReviewCard";

const Reviews = () => {
  return (
    <div className="mt-8">
      <div className="mb-16 lg:mb-20">
        <div className="text-display text-center ">
          Real Stories, <span className="text-accent">Real Results</span>
        </div>
        <div className=" text-center text-title font-medium! text-bprimary">
          Hear how our courses helped students launch their careers.
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {Array(6)
          .fill(0)
          .map((item, i) => {
            return (
              <div key={i}>
                <ReviewCard />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Reviews;
