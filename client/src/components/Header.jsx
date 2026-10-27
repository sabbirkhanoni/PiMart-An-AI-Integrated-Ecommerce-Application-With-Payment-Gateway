import { Link } from "react-router-dom";
import logo from "../assets/logo-no-background.png";
import Search from "./Search";

import { FaUserCircle, FaHeart } from "react-icons/fa";
import { PiShoppingCartFill } from "react-icons/pi";
import { FaAnglesDown , FaAnglesUp } from "react-icons/fa6";

import useMobile from "../hooks/useMobile";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import UserMenu from "./UserMenu";
import { DisplayPriceInBDT } from "../utils/DisplayPriceInBDT";
import { useGlobalContext } from "../contexts/GlobalContext";
import CartModel from "./DesignModel/CartModel";


const Header = () => {
  const [isMobile] = useMobile();

  
  //find url current location
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((state) => state?.user);
  const wishlistItems = useSelector((state) => state?.wishlist?.wishlistItems || []);

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCartModel, setOpenCartModel] = useState(false);

  const {cartProductTotalPrice, cartProductTotalQuantity, cartProduct} = useGlobalContext();

  const redirectToLoginPage = () => {
    navigate("/login");
  };


  const handleCloseUserMenu = ()=>{
    setOpenUserMenu(false)
  }

  //handle mobile user icon click
  const handleMobileUsers = () => {
    if(!user?._id){
      navigate("/login");
      return;
    }
    navigate("/user");
  }

  



  const isSearchPage = location.pathname === "/search";

  return (
    <header className="h-30 lg:h-20 lg:shadow-md sticky z-40 top-0 flex flex-col justify-center bg-white gap-1">
      {!(isMobile && isSearchPage) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/**logo */}
          <div className="h-full">
            <Link to="/" className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={100}
                height={40}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={80}
                height={40}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          {/**search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/**login and my cart */}
          <div className="">

           {/**user icones dispaly only in mobile view **/}
            <div className="flex items-center gap-3 mt-3 lg:hidden">
              <Link
                to={user?._id ? "/dashboard/wishlist" : "/login"}
                title="My Wishlist"
                className="relative text-neutral-800 p-1 cursor-pointer"
              >
                <FaHeart
                  size={20}
                  className={wishlistItems.length > 0 ? "text-rose-500" : "text-gray-600"}
                />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <button className="text-neutral-950 cursor-pointer" onClick={handleMobileUsers}>
                <FaUserCircle size={25} />
              </button>
            </div>

            {/**login, wishlist and cart dispaly only in desktop view **/}
            <div className="hidden lg:flex items-center gap-8">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((preve) => !preve)}
                    className="flex select-none items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors font-medium"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <FaAnglesUp size={15} />
                    ) : (
                      <FaAnglesDown size={15} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12 z-50">
                      <div className="bg-white shadow-xl rounded-2xl p-4 min-w-56 border border-gray-100">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="text-base font-semibold px-3 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Login
                </button>
              )}

              {/* Wishlist Link in Desktop Header */}
              <Link
                to={user?._id ? "/dashboard/wishlist" : "/login"}
                title="My Wishlist"
                className="relative flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-gray-700 hover:text-rose-600 hover:bg-rose-50/50 transition-all cursor-pointer font-medium text-sm"
              >
                <div className="relative">
                  <FaHeart
                    size={19}
                    className={
                      wishlistItems.length > 0 ? "text-rose-500" : "text-gray-500"
                    }
                  />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {wishlistItems.length}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline">Wishlist</span>
              </Link>

              <button
                onClick={() => setOpenCartModel(true)}
                className="flex items-center gap-2 bg-[#098dff] hover:bg-[#1477cd] px-4 py-2 rounded-xl text-white font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >

                    {/**cart icon */}
                <div className="animate-pulse ">
                  <PiShoppingCartFill size={20}/>
                </div>

                <div className="font-semibold">
                  {
                    cartProduct[0] ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <span className="text-sm">{`Cart (${cartProductTotalQuantity})`}</span>
                        <span className="text-sm">{`${DisplayPriceInBDT(cartProductTotalPrice)}`}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-300">Cart</span>
                    )
                  }
                </div>

              </button>

              

            </div>

          </div>


        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {openCartModel && (
        <CartModel close={setOpenCartModel}/>
      )}

    </header>
  );
};

export default Header;
