import axios from 'axios';
import SummaryApi, { baseURL } from '../common/SummaryApi';

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

// For sending the token in the header
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Refresh access token helper
const refreshAccessToken = async (token) => {
    try {
        const response = await axios({
            url: `${baseURL}${SummaryApi.refreshToken.url}`,
            method: SummaryApi.refreshToken.method,
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });

        const accessToken = response?.data?.data?.accessToken;
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            return accessToken;
        }
        return null;
    } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return null;
    }
};

// Extend the life span of access token with refresh token
Axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error?.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const refreshTokenVal = localStorage.getItem("refreshToken");

            if (refreshTokenVal) {
                const newAccessToken = await refreshAccessToken(refreshTokenVal);

                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return Axios(originalRequest);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default Axios;

