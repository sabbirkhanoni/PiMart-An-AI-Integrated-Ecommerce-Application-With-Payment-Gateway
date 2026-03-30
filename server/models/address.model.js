
import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    homeName : {
        type: String,
        default: ""
    },
    roadName : {
        type: String,
        default: ""
    },
    zipCode : {
        type: String,
    },
    city : {
        type: String,
        default: ""
    },
    country : {
        type: String,
    },
    mobile : {
        type: Number,
        default: null
    },
    status : {
        type : Boolean,
        default: true
    },
    userId : {
        type: mongoose.Schema.ObjectId,
        default: "",
    }
}, {
    timestamps: true
});

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;