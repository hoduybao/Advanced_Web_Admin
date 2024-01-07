import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

function Header() {

  return (
    <div className="flex justify-center w-full h-[56px] bg-[#210035] fixed z-10">
      <div className="w-main flex justify-between items-center h-full">
        <Link to={`/`}>
          <img src={logo} alt="logo" className="cursor-pointer w-[58px]" />
        </Link>
      </div>
    </div>
  );
}

export default Header;
