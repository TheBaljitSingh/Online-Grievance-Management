import Grievance from "../models/grievanceModel.js"
import generateGrievanceNumber from "../utils/grievanceNumber.js"
import {sendEmail} from "../utils/sendEmail.js"




export const grievanceDetails = async (req, res)=>{
    
    const {grievanceNumber} = req.params;

    console.log(grievanceNumber);

    try {

         const grievance = await Grievance.find({grievanceNumber});

        if(!grievance){
            req.status(404).json({seccess: fasle, message: "not found grievance" });

        }


        res.status(200).json({success:true, grievance});

    
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        
    }

}

export const createGrievance = async (req, res)=>{
    
    const {user} = req;
    
    const {grievanceDescription, relatedDepartment, supportingDocument} = req.body;

    if(!grievanceDescription){
        return res.status(400).json({message: "Grievance Descricption is mandatory"});

    }

    const grievanceNumber = generateGrievanceNumber();

    const grievance = await Grievance.create({
        user,
        grievanceDescription, relatedDepartment, supportingDocument, grievanceNumber
    })


    await sendEmail({email:user.email, subject: "Grievance Registration", message:`Your Grievance is Registered Successfylly. Your Grievance No. ${grievance.grievanceNumber}`});

    return res.status(201).json({
        success: true,
        message: "Grievance created successfully",
        grievanceNumber,
        grievance
    })



   
}

export const grievanceStatus = async (req, res) => {
    const { grievanceNumber } = req.params; // Corrected to req.params
    console.log(grievanceNumber); // Logging grievanceNumber

    try {
        const grievance = await Grievance.findOne({ grievanceNumber });

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found",
            });
        }

        return res.status(200).json({
            success: true,
            grievanceNumber: grievance.grievanceNumber,
            status: grievance.status,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getSingleGrievanceDetails = async (req, res)=>{
    const { grievanceNumber } = req.params;
    try {
        const grievance = await Grievance.findOne({ grievanceNumber });

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found",
            });
        }

        return res.status(200).json({
            success: true,
            grievance
           
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

}

export const updateGrievance = async (req, res) => {
    const { grievanceNumber } = req.params; // Extract grievance number from URL
    const { grievanceDescription, relatedDepartment, supportingDocument } = req.body; // Data to update

    try {
        // Find the grievance by number
        const grievance = await Grievance.findOne({ grievanceNumber });

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found",
            });
        }

        // Check if the grievance status is "pending"
        if (grievance.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending grievances can be updated",
            });
        }

        // Update fields
        if (grievanceDescription) grievance.grievanceDescription = grievanceDescription;
        if (relatedDepartment) grievance.relatedDepartment = relatedDepartment;
        if (supportingDocument) grievance.supportingDocument = supportingDocument;

        grievance.updatedAt = new Date(); // Update the `updatedAt` timestamp

        // Save the updated grievance
        await grievance.save();

        return res.status(200).json({
            success: true,
            message: "Grievance updated successfully",
            grievance,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

