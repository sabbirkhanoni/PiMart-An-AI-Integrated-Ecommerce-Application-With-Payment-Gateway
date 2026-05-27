import axios from "axios";

export const validateSSLPayment = async (val_id) => {

    const response = await axios.get(
        "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
        {
            params: {
                val_id: val_id,
                store_id: process.env.STORE_ID,
                store_passwd: process.env.STORE_PASSWORD,
                format: "json"
            }
        }
    );

    return response.data;
};