"use client";

import React from 'react';
import { FiAward, FiUsers, FiClock, FiTrendingUp, FiVideo, FiBookOpen } from 'react-icons/fi';
import AnimatedWrapper from '@/utils/AnimatedWrapper';

const Features = () => {
  const features = [
    {
      icon: <FiVideo className="text-3xl" />,
      title: "HD Video Lessons",
      description: "Learn from high-quality video content created by industry experts",
      color: "text-bprimary",
      bgColor: "bg-bprimary/10"
    },
    {
      icon: <FiAward className="text-3xl" />,
      title: "Certified Courses",
      description: "Earn recognized certificates upon course completion",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: <FiUsers className="text-3xl" />,
      title: "Expert Instructors",
      description: "Learn from professionals with real-world experience",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: <FiClock className="text-3xl" />,
      title: "Lifetime Access",
      description: "Access your courses anytime, anywhere, forever",
      color: "text-info",
      bgColor: "bg-info/10"
    },
    {
      icon: <FiTrendingUp className="text-3xl" />,
      title: "Career Growth",
      description: "Advance your career with in-demand skills",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: <FiBookOpen className="text-3xl" />,
      title: "Rich Resources",
      description: "Access downloadable resources and practice materials",
      color: "text-error",
      bgColor: "bg-error/10"
    }
  ];

  return (
    <div className="py-12">
      <AnimatedWrapper from="bottom">
        <div className="text-center mb-12">
          <h2 className="text-display mb-4">
            Why Choose <span className="text-accent">Our Platform</span>
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark max-w-2xl mx-auto">
            Everything you need to succeed in your learning journey
          </p>
        </div>
      </AnimatedWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <AnimatedWrapper key={index} from="bottom" delay={index * 0.1}>
            <div className="group p-6 rounded-2xl border-2 border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:border-bprimary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
              <div className={`${feature.bgColor} ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-title mb-2 text-primary-light dark:text-primary-dark">
                {feature.title}
              </h3>
              <p className="text-meta text-secondary-light dark:text-secondary-dark">
                {feature.description}
              </p>
            </div>
          </AnimatedWrapper>
        ))}
      </div>
    </div>
  );
};

export default Features;
