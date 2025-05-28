import { Link } from "react-router-dom";
import catschool_logotype from "@/assets/homepage/catschool_logotype.svg";

interface LogoProps {
  className?: string;
}

const LOGO: React.FC<LogoProps> = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/">
      <img src={catschool_logotype} alt="程式喵學院" className={className} />
    </Link>
  );
};

export default LOGO;
