import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const uploadImage = async(image) =>{
    try {
        const formData = new FormData();
        formData.append('image', image);

        const response = await Axios({
            ...SummaryApi.uploadImage,
            data : formData,
        })
        
        return response.data;

    } catch (error) {
        return error
    }
}

export default uploadImage;