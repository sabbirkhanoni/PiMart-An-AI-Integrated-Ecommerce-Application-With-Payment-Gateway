import { Link } from "react-router-dom";
import logo from "../assets/logo-no-background.png";
import Search from "./Search";

import { FaUserCircle  } from "react-icons/fa";
import { PiShoppingCartFill } from "react-icons/pi";
import { FaAnglesDown , FaAnglesUp } from "react-icons/fa6";

import useMobile from "../hooks/useMobile";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import UserMenu from "./userMenu";
import { useEffect } from "react";
import { DisplayPriceInBDT } from "../utils/DisplayPriceInBDT";


const Header = () => {
  const [isMobile] = useMobile();

  
  //find url current location
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((state) => state?.user);

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartProduct = useSelector(state => state?.cart?.cart);

  const [cartProductTotalPrice, setCartProductTotalPrice] = useState(0);
  const [cartProductTotalQuantity, setCartProductTotalQuantity] = useState(0);

  useEffect(() => {
    let totalQuantity = cartProduct.reduce((prev, current) => {
      return prev + current.quantity;
    }, 0);
    setCartProductTotalQuantity(totalQuantity);

    let totalPrice = cartProduct.reduce((prev, current) => {
      return prev + (current.quantity * current.price);
    }, 0);
    setCartProductTotalPrice(totalPrice);

    
  }, [cartProduct])

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
            <button className="text-neutral-950 mt-3 lg:hidden" onClick={handleMobileUsers}>
                <FaUserCircle size={25} />
            </button>

            {/**login and cart dispaly only in desktop view **/}
                  <div className="hidden lg:flex items-center gap-20">

                    {
                      user?._id ? (
                        <div className="relative">
                          <div onClick={()=>setOpenUserMenu(preve => !preve)} className="flex select-none items-center gap-2 cursor-pointer">
                            <p>Account</p>
                            {
                              openUserMenu ? (
                                <FaAnglesUp size={15}/>
                              ) : (
                                <FaAnglesDown size={15}/>
                              )
                            }

                          </div>
                            {
                              openUserMenu && (
                                <div className='absolute right-0 top-12'>
                                  <div className="bg-white shadow-lg rounded p-4 min-w-52">
                                  <UserMenu close={handleCloseUserMenu}/>
                                  </div>
                                </div>
                              )
                            }
                        </div>
                      ) : (

                        <button onClick={redirectToLoginPage} className="text-lg px-3">Login</button>
                      )

                    }
                    
                    
              <button className="flex items-center gap-2 bg-[#098dff] hover:bg-[#1477cd] px-4 py-2 rounded-lg text-white">
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
    </header>
  );
};

export default Header;
