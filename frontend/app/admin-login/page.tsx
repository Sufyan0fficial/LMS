"use client";

import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { dispatchUserData } from "../Redux/UserSlice";
import axios from "axios";
import { MdAdminPanelSettings } from "react-icons/md";
import { AdminLoginApi } from "../APIs/routes";

type FieldType = {
  email: string;
  password: string;
};

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setLoading(true);
      const res = await AdminLoginApi(values)
      if (res.data.success) {
        dispatch(dispatchUserData(res.data?.data));
        messageApi.success("Admin authenticated successfully!");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Authentication failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen items-stretch">
      {contextHolder}
      
      {/* Left Side - Login Form */}
      <div className="w-full px-4 md:px-10 md:w-1/2 flex flex-col items-center lg:justify-center max-h-screen overflow-y-auto hide-scrollbar py-10">
        <Image
          src={require("@/public/logo.png")}
          alt="logo"
          width={100}
          height={100}
          className="-ml-5 md:ml-0 mb-9"
        />
        
        <div className="flex flex-col items-center mb-9 -mt-2 md:mt-0">
         
          <div className="text-display text-center">
            Admin <span className="text-accent">Portal</span>
          </div>
          <div className="text-title text-center mt-2">
            Secure Access Only
          </div>
        </div>

        <Form
          name="admin-login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="lg:w-4/5 w-full"
        >
          <Form.Item<FieldType>
            label="Admin Email"
            name="email"
            rules={[
              { required: true, message: "Please input admin email!" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="admin email" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Admin Password"
            name="password"
            rules={[
              { required: true, message: "Please input admin password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter secure password" />
          </Form.Item>

          <Form.Item label={null}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              iconPlacement="end"
            >
              {loading ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg max-w-md">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm text-center">
            ⚠️ Authorized personnel only. All access is logged.
          </p>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div
        className="hidden md:w-1/2 bg-bprimary max-h-screen md:flex items-center justify-center"
        style={{
          backgroundImage: `url('/auth-img.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};

export default AdminLogin;
