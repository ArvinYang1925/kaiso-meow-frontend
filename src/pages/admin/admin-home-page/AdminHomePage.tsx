import { useEffect, useState } from "react";

type loginResponseData = {
  name: string;
  id: string;
  email: string;
  phoneNumber: string;
  role: string;
};

export const AdminHomePage: React.FC = () => {
  const [userName, setUserName] = useState("");

  // 從 localStorage 取出資料並解析
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo: loginResponseData = userInfoString
    ? JSON.parse(userInfoString)
    : null;

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.name);
    }
  }, [userInfo]);

  return (
    <>
      {userName !== "" && <h1>嗨！{userName}，你好啊！</h1>}
      <h1>歡迎來到後台首頁</h1>
    </>
  );
};

export default AdminHomePage; //?
