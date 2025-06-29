import React from "react";
import { useCourseDetailStore } from "../courseDetailStore";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import logo from "@/assets/catschool_logo.svg";
import { Skeleton } from "@/components/ui/skeleton";

const HeroComponent: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
  const { courseDetail } = useCourseDetailStore();

  if (isLoading) {
    return (
      <div className="mt-16 hidden sm:block">
        <div className="relative w-full h-[596px] overflow-hidden">
          <Skeleton className="absolute inset-0 w-full h-full object-cover blur-md scale-125" />
          <div className="absolute inset-0 bg-black opacity-[.70]" />
          <div className="relative z-10 h-full foreground-content flex items-center">
            <div className="container">
              <div className="grid grid-cols-2 gap-8 items-center">
                <Skeleton className="rounded-lg w-full h-[320px]" />
                <div className="text-content text-white flex flex-col justify-center space-y-6">
                  <Skeleton className="h-12 w-2/3 mb-2" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <div className="logo-section flex items-center mt-4">
                    <Skeleton className="w-10 h-10 rounded-full me-2" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 hidden sm:block">
      <div className="relative w-full h-[596px] overflow-hidden">
        {/* 背景圖模糊 */}
        <img
          src={courseDetail?.coverUrl}
          alt="Background"
          className="absolute inset-0 w-full object-cover blur-md scale-125"
        />

        {/* 遮罩 */}
        <div className="absolute inset-0 bg-black opacity-[.70]"></div>

        {/* 前景內容（壓在最上層） */}
        <div className="relative z-10 h-full foreground-content flex items-center">
          <div className="container">
            <div className="grid grid-cols-2 gap-8 items-center">
              <img
                src={courseDetail?.coverUrl}
                alt="課程圖片"
                className="rounded-lg w-full self-center"
              />
              <div className="text-content text-white flex flex-col justify-center justify-center space-y-6">
                <h1 className="text-5xl font-black leading-snug">
                  {courseDetail?.title ?? ""}
                </h1>
                <h2>
                  {courseDetail?.subtitle.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </h2>
                {/* LOGO */}
                <div className="logo-section flex items-center">
                  <Avatar className="cursor-pointer p-1 ring-1 ring-gray-300 me-2 bg-white rounded-full">
                    <AvatarImage className="scale-x-[-1] w-8 h-8" src={logo} />
                  </Avatar>
                  <p className="text-md font-base">{courseDetail?.instructor.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
