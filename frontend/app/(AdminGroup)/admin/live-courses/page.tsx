"use client";

import { Button, message, Modal, Rate, Table, TableProps, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import ReactTimeAgo from "react-time-ago";
import { DeleteCourseApi, GetAllCoursesApi } from "@/app/APIs/routes";
import { ICourseData } from "@/app/types/apifn.types";
import { CourseData } from "@/app/data";
import axios from "axios";
import { useRouter } from "next/navigation";

try {
  TimeAgo.addDefaultLocale(en);
  TimeAgo.addLocale(ru);
} catch (error) {}

interface DataType {
  key: number;
  _id: string;
  name: string;
  price: number;
  ratings: number;
  createdAt: Date;
  purchased: number;
}
const page = () => {
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [courses, setCourses] = useState<ICourseData[]>([]);
  const [rowData, setRowData] = useState<DataType[]>([]);
  const [deleteCourseDialog, setDeleteCourseDialog] = useState(false)
  const [courseTobeDeleted, setCourseTobeDeleted] = useState<{_id:string , name:string}>({_id:'',name:''})
  const [loading, setloading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const router = useRouter()

  useEffect(() => {
    const getAllCourses = async () => {
      try {
        const res = await GetAllCoursesApi();
        if (res.data.success) {
          setCourses(res.data.data);
          const fieldsData = res.data.data.map((item, i) => {
            return {
              _id: item._id,
              name: item.name,
              key: i,
              purchased: item.purchased,
              price: item.price,
              ratings: item.ratings,
              createdAt: item.createdAt,
            };
          });
          setRowData(fieldsData);
        }
      } catch (error) {}
    };
    getAllCourses();
  }, []);

  // Create formatter (English).
  const columns: TableProps<DataType>["columns"] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "_id",
    },
    {
      key: "title",
      title: "Title",
      dataIndex: "name",
      render: (text) => (
        <Tooltip title={text} className="cursor-pointer">
          <div className="max-w-24 overflow-x-hidden whitespace-nowrap text-ellipsis">
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "price",
      title: "Price",
      dataIndex: "price",
    },
    {
      key: "puchased",
      title: "Purchased",
      dataIndex: "purchased",
      render: (data) => (data ? <div>{data}</div> : <div>0</div>),
    },
    {
      key: "rating",
      title: "Rating",
      dataIndex: "ratings",
      render: (content) =>
        content ? (
          <Rate
            size={screenWidth < 768 ? "small" : "small"}
            disabled
            value={content}
          />
        ) : (
          <div>No Review Found</div>
        ),
    },
    {
      key: "createdAt",
      title: "Created At",
      dataIndex: "createdAt",
      render: (date) => date && <ReactTimeAgo date={date} locale="en-US" />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (_,{_id,name}) => {
        return (
          <div className="flex gap-3">
            <Button
              size={screenWidth < 768 ? "small" : "middle"}
              type="default"
              variant="outlined"
              color="blue"
              onClick={()=>router.push(`/admin/create-courses?edit=${_id}`)}
            >
              Edit
            </Button>
            <Button
              size={screenWidth < 768 ? "small" : "middle"}
              type="default"
              variant="filled"
              color="red"
              onClick={()=>{
                setDeleteCourseDialog(true)
                setCourseTobeDeleted({_id,name})
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const handleDeleteCourse = async () => {
      try {
        setloading(true);
        const res = await DeleteCourseApi(courseTobeDeleted._id);
        if (res.data.success) {
          messageApi.success('Deleted Successfully');
          setDeleteCourseDialog(false);
          setCourses(res.data.data);
          const fieldsData = res.data.data.map((item, i) => {
            return {
              _id: item._id,
              name: item.name,
              key: i,
              purchased: item.purchased,
              price: item.price,
              ratings: item.ratings,
              createdAt: item.createdAt,
            };
          });
          setRowData(fieldsData);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          messageApi.error(
            error.response?.data.message ||
              "Something went wrong , Please try again later"
          );
        }
      } finally {
        setloading(false);
        setDeleteCourseDialog(false);
        setCourseTobeDeleted({_id:'',name:''})
      }
    };
  return (
    <div className="w-full overflow-x-auto border border-border-light dark:border-border-dark">
      {
        contextHolder
      }
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
      <Modal
        open={deleteCourseDialog}
        onCancel={() => setDeleteCourseDialog(false)}
        footer={false}
        closeIcon={true}
        title={
          <div className="text-title text-center">
            Delete<span className="text-error"> User !</span>
          </div>
        }
        centered={true}
      >
        <div className="flex flex-col mt-4 w-full">
          <div className="text-center">
            Are you sure to delete selected Course under the Name:
          </div>
          <div className="text-center text-accent mb-6 mt-2">
            {courseTobeDeleted?.name}
          </div>
          <div className="flex justify-end gap-x-4">
            <Button
              variant="outlined"
              onClick={() => setDeleteCourseDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="red"
              loading={loading}
              icon
              iconPlacement={"end"}
              onClick={handleDeleteCourse}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default page;
