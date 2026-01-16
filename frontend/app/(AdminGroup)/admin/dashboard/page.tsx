"use client";

import {
  GetAllOrders,
  GetAllUsers,
  GetOrdersAnalyticsApi,
  GetUsersAnalyticsApi,
} from "@/app/APIs/routes";
import { message, Table, TableProps, Tooltip as Tooltap } from "antd";
import axios from "axios";
import TimeAgo from "javascript-time-ago";
import React, { useEffect, useState } from "react";
import { MdOutlineMailOutline, MdOutlineSell } from "react-icons/md";
import ReactTimeAgo from "react-time-ago";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { FaUsers } from "react-icons/fa6";
import Link from "next/link";

try {
  TimeAgo.addDefaultLocale(en);
  TimeAgo.addLocale(ru);
} catch (error) {}

interface DataType {
  _id: string;
  name: string;
  email: string;
  price: string;
  createdAt: Date;
  key: number;
  CourseName: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    key: "id",
    title: "ID",
    dataIndex: "_id",
  },
  {
    key: "name",
    title: "User Name",
    dataIndex: "name",
    render: (text) => (
      <Tooltap title={text} className="cursor-pointer">
        <div className="max-w-36 overflow-x-hidden whitespace-nowrap text-ellipsis">
          {text}
        </div>
      </Tooltap>
    ),
  },
  {
    key: "name",
    title: "Course Name",
    dataIndex: "CourseName",
    render: (text) => (
      <Tooltap title={text} className="cursor-pointer">
        <div className="max-w-36 overflow-x-hidden whitespace-nowrap text-ellipsis">
          {text}
        </div>
      </Tooltap>
    ),
  },
  {
    key: "email",
    title: "Email",
    dataIndex: "email",
  },
  {
    key: "price",
    title: "Price",
    dataIndex: "price",
  },
  {
    key: "createdAt",
    title: "Created At",
    dataIndex: "createdAt",
    render: (date) =>
      date ? (
        <ReactTimeAgo date={date} locale="en-US" />
      ) : (
        "Order Date not found"
      ),
  },
  {
    key: "actions",
    title: "Email",
    render: (_, { email }) =>
      email ? (
          <MdOutlineMailOutline
            size={25}
            color="#f59e0b"
            className="cursor-pointer"
            onClick={(e)=>{
                e.stopPropagation()
                window.location.href = `mailto:${email}`
            }}
          />
      ) : (
        // Optional: Render something else or null if no email exists
        <span className="text-gray-400">N/A</span>
      ),
  },
];

const Dashboard = () => {
  const [usersAnalytics, setUsersAnalytics] =
    useState<{ count: number; month: string }[]>();
  const [ordersAnalytics, setOrdersAnalytics] =
    useState<{ count: number; month: string }[]>();
  const [rowData, setRowData] = useState<DataType[]>();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  console.log("row data is", rowData);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const getUsersAnalytics = async () => {
      try {
        const res = await GetUsersAnalyticsApi();
        const ordersRes = await GetAllOrders();
        const ordersAna = await GetOrdersAnalyticsApi();
        if (res.data.success) {
          setUsersAnalytics(res.data.data);
          const users = res.data.data.reduce(
            (acc, current) => acc + current.count,
            0
          );
          setTotalUsers(users);
        }
        if (ordersAna.data.success) {
          setOrdersAnalytics(ordersAna.data.data);
          const orders = ordersAna.data.data.reduce(
            (acc, current) => acc + current.count,
            0
          );
          setTotalOrders(orders);
        }
        if (ordersRes.data.success) {
          const data =
            ordersRes.data.data.length > 0
              ? ordersRes.data.data.map((item, i) => {
                  const name = item?.userId?.name;
                  const email = item?.userId?.email;
                  const price = item?.courseId?.price;
                  const CourseName = item?.courseId?.name;
                  return {
                    key: i,
                    name,
                    email,
                    price,
                    CourseName,
                    createdAt: item?.createdAt,
                    _id: item._id,
                  };
                })
              : [];
          setRowData(data);
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
    getUsersAnalytics();
  }, []);
  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex flex-col lg:flex-row gap-6 w-full lg:items-stretch">
        <div className="w-full lg:w-[75%]! lg:max-w-[75%] ">
          <div className="font-josefin text-accent mb-4 text-lg lg:text-xl font-medium lg:font-bold">
            Users Analytics
          </div>
          <div className="overflow-x-auto!">
            <AreaChart
              width={1150} // Set width as a prop, not just style
              height={300}
              data={usersAnalytics}
              margin={{ top: 5, right: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis width="auto" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </div>
        </div>
        <div className="lg:grow gap-y-6 flex flex-col lg:justify-center lg:mt-10">
          <div className="dark:bg-card-dark bg-card-light px-6 py-6 flex w-full items-center rounded-md border border-border-light dark:border-border-dark lg:text-lg lg:font-bold font-medium">
            <div>
              <MdOutlineSell size={25} color="#f59e0b" />
              <div className="py-2 text-bprimary">{totalOrders}</div>
              <div className="">Sales Obtained</div>
            </div>
          </div>
          <div className="dark:bg-card-dark bg-card-light px-6 py-6 flex w-full items-center rounded-md border border-border-light dark:border-border-dark lg:text-lg lg:font-bold font-medium">
            <div>
              <FaUsers size={25} color="#f59e0b" />
              <div className="py-2 text-bprimary">{totalUsers}</div>
              <div className="">New Users</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-10 gap-6 w-full lg:items-stretch">
        <div className="w-full lg:w-[60%]! lg:max-w-[60%]">
          <div className="font-josefin text-accent mb-4 text-lg lg:text-xl font-medium lg:font-bold">
            Orders Analytics
          </div>
          <div className="overflow-x-auto">
            <LineChart
              width={1150} // Set width as a prop, not just style
              height={300}
              data={ordersAnalytics}
              margin={{ top: 5, right: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis width="auto" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </div>
        </div>
        <div className="w-full lg:w-[37%] lg:max-w-[37%]!">
          <div className="font-josefin text-accent mb-4 text-lg lg:text-xl font-medium lg:font-bold">
            Recent Transactions
          </div>
          <div className="overflow-x-auto border border-border-light dark:border-border-dark h-78">
            <Table<DataType>
              columns={columns}
              dataSource={rowData}
              classNames={{
                body: {
                  wrapper: "w-full!  border-red-600! dark:bg-[#282727]",
                  cell: "min-w-max! text-nowrap!",
                },
                header: {
                  cell: "min-w-max! text-nowrap!",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
