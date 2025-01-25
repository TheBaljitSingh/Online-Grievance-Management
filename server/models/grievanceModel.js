import mongoose from "mongoose";

const grievanceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    grievanceNumber:{
        type: String,
        unique: true
    },
    grievanceDescription: { // Fixed typo
        type: String,

        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now // Default to the current date
    },
    updatedAt: {
        type: Date
    },
    relatedDepartment: {
        type: String,
        enum: ['HR', 'Engineering', 'Marketing'], // Enum for predefined departments
        // required: true
    },
    supportingDocument: {
        type: String // Store the file path or URL
    },
    response: {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Reference to the User model (admin role)
        },
        responseText: {
            type: String
        },
        responseDate: {
            type: Date
        }
    }
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields

const Grievance = mongoose.model("Grievance", grievanceSchema);

export default Grievance;