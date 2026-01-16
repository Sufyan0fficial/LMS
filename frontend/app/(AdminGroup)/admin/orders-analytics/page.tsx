"use client";

import {
  GetCourseAnalyticsApi,
  GetOrdersAnalyticsApi,
} from "@/app/APIs/routes";
import { message } from "antd";
import axios from "axios";
import { div } from "motion/react-client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  AreaChart,
  Tooltip,
  Area,
  LineChart,
  Line,
} from "recharts";

// #region Sample data

// #endregion
const OrderAnalytics = () => {
  const [orderAnalytics, setOrderAnalytics] =
    useState<{ count: number; month: string }[]>();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getOrderAnalytics = async () => {
      try {
        const res = await GetOrdersAnalyticsApi();
        if (res.data.success) {
          setOrderAnalytics(res.data.data);
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
    getOrderAnalytics();
  }, []);
  return (
    <div className="w-full flex flex-col items-center">
      {contextHolder}

      {/* 1. The Scroll Container: handles the overflow */}
      <div className="w-full overflow-x-auto pb-4 ">
        {/* 2. The Width Enforcer: Ensures the chart maintains its size */}
        <div className="min-w-300! ">
          <LineChart
            width={1150} // Set width as a prop, not just style
            height={500}
            data={orderAnalytics}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis width="auto" />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;
