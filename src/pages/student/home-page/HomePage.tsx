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
      {userName !== "" && <h1>嗨！{userName}，你好啊！</h1>}
      <h1>歡迎來到首頁</h1>
    </>
  );
};

export default HomePage; //?
