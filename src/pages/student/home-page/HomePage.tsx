import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/AuthStore";

export const HomePage: React.FC = () => {
  const [userName, setUserName] = useState("");

  const { userInfo } = useAuthStore();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.name);
    }
  }, [userInfo]);

  return (
    <>
      <div className="container">
        <div className="title mt-36">
        {userName !== "" && (
          <p className="text-2xl text-orange-600">
            嗨！{userName}，你好啊！
          </p>
        )}
        <h1 className="text-4xl">歡迎來到首頁</h1>
        </div>
    
      </div>
    </>
  );
};

export default HomePage; //?
