import Axios from './Axios';
import SummaryApi from '../common/SummaryApi';

const fetchUserDetails = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return null;
        }
        const response = await Axios({
            ...SummaryApi.userDetails
        });
        return response?.data || null;
    } catch {
        return null;
    }
};

export default fetchUserDetails;