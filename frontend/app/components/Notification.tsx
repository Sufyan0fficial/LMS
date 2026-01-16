import { Dropdown, MenuProps } from "antd";
import React from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "4",
    danger: true,
    label: "a danger item",
  },
];

const Notification = () => {
  return (
    <div>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <div className="relative cursor-pointer">
          <div>
            <IoMdNotificationsOutline className="text-2xl md:text-3xl" />
          </div>
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 absolute top-0 right-1"></div>
        </div>
      </Dropdown>
    </div>
    
  );
};

export default Notification;
