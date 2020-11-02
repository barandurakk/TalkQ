const cloudinary = require("cloudinary");
const keys = require("../util/keys");


    const uploadImage = (req,res) => {

        if(!req.file){
            res.status(204);
        }else {
    
            try{
                cloudinary.config({
                    cloud_name: keys.cloudinary_cloud_name,
                    api_key: keys.cloudinary_api_key,
                    api_secret: keys.cloudinary_secret_key
                });
    
                cloudinary.uploader.upload_stream((result) => {
                    res.status(201).json({user_avatar_url: result.secure_url});
                }).end(req.file.buffer);
            }catch(e){
                res.status(500).json({status:e});
            }
    
        }
    
    };

   module.exports = uploadImage;



