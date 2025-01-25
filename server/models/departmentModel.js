import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: { // Fixed typo
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;

