"use client";

import { GetCourseAnalyticsApi } from "@/app/APIs/routes";
import { message } from "antd";
import axios from "axios";
import { div } from "motion/react-client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid, Tooltip } from "recharts";

// #region Sample data


// #endregion
const TinyBarChart = () => {
  const [courseAnalytics, setCourseAnalytics] =
    useState<{ count: number; month: string }[]>();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getCourseAnalytics = async () => {
      try {
        const res = await GetCourseAnalyticsApi();
        if (res.data.success) {
          setCourseAnalytics(res.data.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          messageApi.error(
            error.response?.data?.message ||
              "Please check your internet connection Or Try again later"
          );
        }
      }
    };
    getCourseAnalytics();
  }, []);
  return (
    <div className="w-full flex flex-col items-center">
      {contextHolder}

      {/* 1. The Scroll Container: handles the overflow */}
      <div className="w-full overflow-x-auto pb-4">
        {/* 2. The Width Enforcer: Ensures the chart maintains its size */}
        <div className="min-w-300!">
          <BarChart
            width={1150} // Set width as a prop, not just style
            height={500}
            data={courseAnalytics}  
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
            <Bar dataKey="count" fill="#8884d8" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default TinyBarChart;
