import { useEffect } from "react";

type loginResponseData = {
  name: string;
  id: string;
  email: string;
  phoneNumber: string;
  role: string;
};

export const InstructorInfoPage: React.FC = () => {
  // const [userName, setUserName] = useState("");

  // 從 localStorage 取出資料並解析
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo: loginResponseData = userInfoString
    ? JSON.parse(userInfoString)
    : null;

  useEffect(() => {
    if (userInfo) {
      // setUserName(userInfo.name);
    }
  }, [userInfo]);

  return (
    <>
      <h1>講師資訊</h1>
    </>
  );
};

export default InstructorInfoPage; //?
