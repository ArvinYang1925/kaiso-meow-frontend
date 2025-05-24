import { Link } from "react-router-dom";
import catschool_logotype from "@/assets/homepage/catschool_logotype.svg";

const LOGO = () => {
  return (
    <Link to="/">
      <img src={catschool_logotype} alt="程式喵學院" className="h-10 mr-4" />
    </Link>
  );
};

export default LOGO;
