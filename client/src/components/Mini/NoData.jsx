import noDataImage from "../../assets/no-data.png";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-content-center p-10 gap-2">
      <img src={noDataImage} alt="No Data" className="w-40 h-40 object-cover" />
      <h3 className="text-center text-2xl font-semibold">No Data Found</h3>
    </div>
  );
};

export default NoData;
