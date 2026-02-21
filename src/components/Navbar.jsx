import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { assets, menuLinks } from "../assets/assets";

import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { setShowLogin, user, logout, isAdmin, axios, setIsAdmin } =
    useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/admin/change-role");
      if (data.success) {
        setIsAdmin(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor
    relative transition-all 
    ${location.pathname === "/" && "bg-light"} `}
    >
      <Link to="/" className="flex items-center">
        <img src={assets.logo} alt="logo" className="h-8" />
        <h1 className="text-xl font-semibold">oRentar</h1>
      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0
      flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 
      ${location.pathname === "/" ? "bg-light" : "bg-white"} 
      ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search..."
          />
          <img src={assets.search_icon} alt="search-icon" />
        </div>
        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          <button
            className="cursor-pointer"
            onClick={() => (isAdmin ? navigate("/admin") : changeRole())}
          >
            {isAdmin ? "Dashboard" : "List cars"}
          </button>
          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>
      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </div>
  );
};

export default Navbar;
