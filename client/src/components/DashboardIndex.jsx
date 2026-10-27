import { useSelector } from "react-redux";
import isAdmin from "../utils/checkIsAdmin";
import AnalyticsDashboardPage from "../pages/AnalyticsDashboardPage";
import PersonalDetails from "../pages/PersonalDetails";

const DashboardIndex = () => {
  const user = useSelector((state) => state.user);
  return isAdmin(user?.role) ? <AnalyticsDashboardPage /> : <PersonalDetails />;
};

export default DashboardIndex;
