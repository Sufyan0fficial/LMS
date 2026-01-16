"use client";

import { Button, Rate, Table, TableProps, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import ReactTimeAgo from "react-time-ago";
import { GetAllCoursesApi, GetAllUsers } from "@/app/APIs/routes";
import { ICourseData, IUser } from "@/app/types/apifn.types";
import { CourseData } from "@/app/data";
import { MdDeleteOutline, MdOutlineEmail } from "react-icons/md";

try {
  TimeAgo.addDefaultLocale(en);
  TimeAgo.addLocale(ru);
} catch (error) {}

interface DataType {
  key: number;
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  courses: string[];
}
const page = () => {
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [users, setUsers] = useState<IUser[]>([]);
  const [rowData, setRowData] = useState<DataType[]>([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await GetAllUsers();
        if (res.data.success) {
          setUsers(res.data.data);
          const fieldsData = res.data.data.map((item, i) => {
            return {
              key: i,
              _id: item._id,
              name: item.name,
              email: item.email,
              role: item.role,
              createdAt: item.createdAt,
              courses: item.courses,
            };
          });
          setRowData(fieldsData);
        }
      } catch (error) {}
    };
    getAllUsers();
  }, []);

  // Create formatter (English).
  const columns: TableProps<DataType>["columns"] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "_id",
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      render: (text) => (
        <Tooltip title={text} className="cursor-pointer">
          <div className="max-w-36 overflow-x-hidden whitespace-nowrap text-ellipsis">
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
      render: (data) => (data ? <div>{data}</div> : <div>User</div>),
    },
    {
      key: "courses",
      title: "Enrolled Courses",
      dataIndex: "courses",
      render: (courses) =>
        courses.length > 0 ? (
          <div className="flex flex-col oveflow-y-auto">
            {courses.map((course: string, i: number) => {
              return <div key={i}>{course}</div>;
            })}
          </div>
        ) : (
          <div>Not enrolled yet</div>
        ),
    },
    {
      key: "createdAt",
      title: "Registered On",
      dataIndex: "createdAt",
      render: (date) => date && <ReactTimeAgo date={date} locale="en-US" />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (_,{email}) => {
        return (
          <div className="flex gap-3">
            <MdDeleteOutline
              color="red"
              className="cursor-pointer "
              size={screenWidth < 768 ? 20 : 25}
            />
            <a
              href={`mailto:${email}`}
            //   target="_blank"
            >
              <MdOutlineEmail
                color="green"
                className="cursor-pointer "
                size={screenWidth < 768 ? 20 : 25}
              />
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full overflow-x-auto border border-border-light dark:border-border-dark">
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
  );
};

export default page;
