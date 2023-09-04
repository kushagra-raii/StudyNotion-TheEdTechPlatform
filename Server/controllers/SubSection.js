const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req,res) =>{
    try {
        const {sectionId,title,timeDuration,description} = req.body;
        if(!sectionId || !title || !timeDuration || !description ){
            return res.status(400).json({
                success:"false",
                message:"All fields are required",
            });
        }
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl: uploadDetails.secure_url,
        })
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                $push:{
                subSection:subSectionDetails._id, 
                }
            },
            { new: true }
          );

          return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            updatedSection,
          });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Something went wrong while creating sub-section.",
        });
    }
}