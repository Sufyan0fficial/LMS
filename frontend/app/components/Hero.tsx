"use client";
import React, { useState } from "react";
import { SearchIcon } from "./ReactIcons";
import Link from "next/link";
import { Avatar, Button } from "antd";
import Image from "next/image";
import AnimatedWrapper from "@/utils/AnimatedWrapper";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FiPlay, FiAward, FiUsers, FiTrendingUp } from "react-icons/fi";

function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { hero } = useSelector((state: any) => state.LayoutReducer);
  const heroImage = hero?.image ? hero?.image : '/hero-main.png';
  const heroTitle = hero?.title ? hero?.title : 'Transform Your Future with Expert-Led Online Courses';
  const herosubtitle = hero?.subtitle ? hero?.subtitle : 'Join thousands of learners advancing their careers with industry-relevant skills. Start your learning journey today with our comprehensive course library.';
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/courses');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };
  
  return (
    <section className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center py-12 lg:pb-20 pt-10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-bprimary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full relative z-10">
        
        {/* Content Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <AnimatedWrapper from="left">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-bprimary/10 dark:bg-bprimary/20 rounded-full border border-bprimary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bprimary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-bprimary"></span>
                </span>
                <span className="text-meta font-medium text-bprimary">🚀 #1 Learning Platform</span>
              </div>

              <h1 className="text-display text-primary-light dark:text-primary-dark max-w-2xl">
                {heroTitle}
              </h1>
              <p className="text-body text-secondary-light dark:text-secondary-dark max-w-xl">
                {herosubtitle}
              </p>
            </div>
          </AnimatedWrapper>

          {/* Search Bar */}
          <AnimatedWrapper from="left" delay={0.2}>
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="relative flex items-center bg-card-light dark:bg-card-dark border-2 border-input-border-light dark:border-input-border-dark rounded-2xl shadow-lg hover:shadow-xl hover:border-bprimary/50 transition-all duration-300">
                <input
                  type="text"
                  placeholder="Search Courses..."
                  className="input-field w-full rounded-l-2xl bg-transparent border-0 focus:ring-0 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button 
                  type="submit"
                  className="bg-bprimary hover:bg-bprimary-hover text-white px-6 py-4 rounded-r-2xl transition-all duration-300 flex items-center justify-center hover:scale-105"
                  aria-label="Search courses"
                >
                  <SearchIcon />
                </button>
              </div>
            </form>
          </AnimatedWrapper>

          {/* Stats Grid */}
          <AnimatedWrapper from="left" delay={0.3}>
            <div className="grid grid-cols-3 gap-6 w-full max-w-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-bprimary">500K+</div>
                <div className="text-meta text-muted-light dark:text-muted-dark">Students</div>
              </div>
              <div className="text-center border-x border-border-light dark:border-border-dark">
                <div className="text-2xl font-bold text-accent">1000+</div>
                <div className="text-meta text-muted-light dark:text-muted-dark">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">4.9★</div>
                <div className="text-meta text-muted-light dark:text-muted-dark">Rating</div>
              </div>
            </div>
          </AnimatedWrapper>

          {/* CTA Buttons */}
          <AnimatedWrapper from="left" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/courses">
                <Button 
                  type="primary" 
                  size="large"
                  className="bg-bprimary hover:bg-bprimary-hover border-bprimary hover:border-bprimary-hover text-white font-semibold px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  icon={<FiPlay className="text-lg" />}
                >
                  Start Learning Now
                </Button>
              </Link>
              <Link href="/#faq">
                <Button 
                  size="large"
                  className="border-2 border-input-border-light dark:border-input-border-dark text-primary-light dark:text-primary-dark hover:border-bprimary hover:text-bprimary font-semibold px-8 py-6 h-auto rounded-xl hover:scale-105 transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </AnimatedWrapper>

          {/* Trust Badges */}
          <AnimatedWrapper from="left" delay={0.5}>
            <div className="flex flex-wrap items-center gap-4 text-meta text-muted-light dark:text-muted-dark">
              <div className="flex items-center gap-2">
                <FiAward className="text-accent text-lg" />
                <span>Certified Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="text-bprimary text-lg" />
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-success text-lg" />
                <span>Career Growth</span>
              </div>
            </div>
          </AnimatedWrapper>
        </div>

        {/* Image Section */}
        <div className="flex justify-center lg:justify-end">
          <AnimatedWrapper from="right">
            <div className="relative">
              {/* Background Gradient Orbs */}
              <div className="absolute inset-0 bg-gradient-to-br from-bprimary/20 via-accent/10 to-transparent rounded-full blur-3xl scale-110 animate-pulse-slow"></div>
              
              {/* Main Image Container */}
              <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px]">
                <div className="absolute inset-0 bg-gradient-to-br from-bprimary via-bprimary-hover to-accent rounded-3xl p-1 shadow-2xl animate-gradient">
                  <div className="w-full h-full bg-card-light dark:bg-card-dark rounded-3xl p-6 overflow-hidden">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
                      <Image
                        src={heroImage}
                        alt="Online Learning Platform"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Achievement Cards */}
              <div className="absolute -top-6 -right-2 bg-gradient-to-br from-accent to-warning text-white px-5 py-3 rounded-2xl text-meta font-bold shadow-2xl animate-float border-2 border-white/20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <FiAward className="text-xl" />
                  <div>
                    <div className="text-xs opacity-90">Expert Led</div>
                    <div className="text-sm">Certified</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-success to-info text-white px-5 py-3 rounded-2xl text-meta font-bold shadow-2xl animate-float-delayed border-2 border-white/20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">⭐</div>
                  <div>
                    <div className="text-xs opacity-90">Top Rated</div>
                    <div className="text-sm">4.9/5.0</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-2 bg-gradient-to-br from-bprimary to-bprimary-hover text-white px-4 py-3 rounded-2xl text-meta font-bold shadow-2xl animate-bounce-slow border-2 border-white/20 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">500K+</div>
                  <div className="text-xs opacity-90">Students</div>
                </div>
              </div>
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </section>
  );
}

export default Hero;
