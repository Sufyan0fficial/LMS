"use client";

import { GetLayoutDataApi } from "@/app/APIs/routes";
import { Collapse, CollapseProps, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Faqs = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetLayoutDataApi({ type: "faq" });
        if (res.data.success) {
          setFaqs(res.data.data.faq);
        }
      } catch (error) {
        messageApi.error("Failed to fetch Categoires, Please refresh the page");
      }
    };
    fetchCategories();
  }, []);
  const items: CollapseProps["items"] = faqs?.map(
    (item: { question: string; answer: string }, i: number) => {
      return {
        key: i,
        label: item?.question,
        children: item?.answer,
      };
    }
  );
  return (
    <div className="">
      {contextHolder}
      <div className="text-display text-center mb-10 lg:mb-16">
        FA<span className="text-accent">Qs</span>
      </div>
      <Collapse
        accordion
        items={items}
        classNames={{ title: "text-lg!", body: "text-lg!", root:'',header:'dark:bg-card-dark bg-card-light'}}
      />
    </div>
  );
};

export default Faqs;
