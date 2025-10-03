import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { IoArrowBackCircle } from "react-icons/io5";
import useMobile from "../hooks/useMobile";

const Search = () => {
  //function which help me to redirect to search page
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile] = useMobile();

  const [isSearchPage, setIsSearchPage] = useState(false);

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  return (

    <div className="w-full min-w-[300px] lg:min-w-[420px] rounded-lg border overflow-hidden flex items-center lg:h-12 h-10 text-neutral-500 bg-slate-50 group focus-within:border-blue-500">
      <div>

        {
          (isMobile && isSearchPage) ? (
            <Link to={"/"} className="flex justify-center items-center h-full p-3 text-gray-800 group-focus-within:text-blue-800">
              <IoArrowBackCircle size={23} />
            </Link>
          ) : (
            <button className="flex justify-center items-center h-full p-3 text-gray-800 group-focus-within:text-blue-800">
              <IoMdSearch size={23} />
            </button>
          )
        }

      </div>

      <div className="w-full h-full">
        {!isSearchPage ? (
          //not in search Page
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center px-3"
          >
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed once, initially
                "Search anything",
                1000,
                "Search food",
                1000,
                "Search for Electronics",
                1000,
                "Search for Accessories",
                1000,
                "Search for Clothes",
                1000,
                "Search for Shoes",
                1000,
                "Search for Mobile Phones",
                1000,
                "Search for Laptops",
                1000,
                "Search for Books",
                1000,
                "Search for Home Appliances",
                1000,
                "Search for Watches",
                1000,
                "Search for Furniture",
                1000,
                "Search for Beauty Products",
                1000,
                "Search for Sports Equipment",
                1000,
                "Search for Grocery Items",
                1000,
                "Search for Toys",
                1000,
                "Search for Cameras",
                1000,
                "Search for Smartwatches",
                1000,
                "Search for Gaming Consoles",
                1000,
                "Search for Headphones",
                1000,
                "Search for Office Supplies",
                1000,
              ]}
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          //Else When in search Page
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search Anything"
              autoFocus
              className="bg-transparent w-full h-full outline-none px-3"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
