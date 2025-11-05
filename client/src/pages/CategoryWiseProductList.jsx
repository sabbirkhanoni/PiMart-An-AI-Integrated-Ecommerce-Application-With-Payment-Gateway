import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxioxToastError";
import Loading from "../components/Mini/Loading";
import ProductDisplayCard from "../components/DesignModel/ProductDisplayCard";
import { useSelector } from "react-redux";
import { all } from "axios";
import { URLvalidation } from "../utils/URLValidation";
import NoData from "../components/Mini/NoData";

const CategoryWiseProductList = () => {
  const [productListData, setProductListData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [displaySubCategoryList, setDisplaySubCategoryList] = useState([]);

  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const params = useParams();

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  //get subcategory Name
  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    .join(" ");
  console.log("SubCategory Name:", subCategoryName);

  const fetchProductByCategoryAndSubCategoryData = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategoryParams,
        data: {
          categoryId: [categoryId],
          subCategoryId: [subCategoryId],
          page: page || 1,
          limit: 10,
        },
      });
      const { data: responseData } = response;
      console.log("Response Data:", responseData);

      if (responseData.success) {
        if (responseData.page == 1) {
          setProductListData(responseData.data);
        } else {
          setProductListData((prevData) => [...prevData, ...responseData.data]);
        }
        setTotalPages(responseData.totalCount);
      } else {
        console.log("API call not successful:", responseData);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductByCategoryAndSubCategoryData();
  }, [params]);

  useEffect(() => {
    const subCategory = allSubCategory.filter((subCat) => {
      const filteredData = subCat.category.some((element) => {
        return element._id == categoryId;
      });
      return filteredData ? filteredData : null;
    });
    setDisplaySubCategoryList(subCategory);
  }, [params, allSubCategory]);

  return (
    <section className="top-h-20 sticky">
      <div className="container mx-auto grid grid-cols-[140px_1fr] md:grid-cols-[130px_1fr] lg:grid-cols-[210px_1fr] p-3">
        {/* SubCategory List  */}
        <div className="bg-white min-h-[86vh] max-h-[80vh] overflow-y-scroll">
          {displaySubCategoryList.length > 0 &&
            displaySubCategoryList.map((subCatItem, index) => {
              const url = `/${URLvalidation(subCatItem?.category[0]?.name)}-${
                subCatItem?.category[0]?._id
              }/${URLvalidation(subCatItem.name)}-${subCatItem._id}`;
              return (
                <Link
                  to={url}
                  key={
                    subCatItem._id +
                    index +
                    "subCategoryListInCategoryWiseProductList"
                  }
                  className={`border-1 grid border-gray-300 shadow-lg rounded h-40 lg:h-35 hover:bg-blue-100 ${
                    subCatItem._id === subCategoryId
                      ? "bg-green-200"
                      : "bg-white"
                  } cursor-pointer`}
                >
                  <div className="w-full p-3 lg:p-1 flex justify-center items-center text-center">
                    <img
                      src={subCatItem.image}
                      alt={subCatItem.name}
                      className="w-18 h-full object-scale-down"
                    />
                  </div>
                  <div className="text-center p-2">
                    <p className="text-sm font-semibold">{subCatItem.name}</p>
                  </div>
                </Link>
              );
            })}
        </div>

        {/* Product List  */}
        <div className="">
          <div className="bg-white px-3 py-2">
            <h2 className="text-lg font-bold">{subCategoryName}</h2>
          </div>

          {/* Move product list inside the grid column */}
          <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 bg-white p-2 gap-2 place-items-center">
              {productListData.length > 0
                ? productListData.map((product, index) => {
                    return (
                      <ProductDisplayCard
                        productData={product}
                        key={
                          product._id +
                          index +
                          "productDisplayCardForSubCategoryWise"
                        }
                      />
                    );
                  })
                : !loading && (
                    <div className="flex col-span-full justify-center items-center w-full h-full">
                      <NoData />
                    </div>
                  )}
            </div>
          </div>

          {loading && <Loading />}
        </div>
      </div>
    </section>
  );
};

export default CategoryWiseProductList;
