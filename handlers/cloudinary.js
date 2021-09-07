const cloudinary = require('cloudinary');
const multer = require('multer');
require('dotenv/config');
const {Readable} = require("stream");

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

var imageFilter = function (req, file, cb) {
  
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-theQuoteByAtif-' + Math.round(Math.random() * 1E9)
      console.log('filename',file.fieldname);
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage : storage , fileFilter : imageFilter});

//========================================================================

// GETTING ANGLE OF IMAGE(ORIENTATION OF IMAGE)
const getAngle = (number) => {
	switch(number){
		case "1" :
			return(0);
			
		case "8" :
			return(270);
			
		case "3" :
			return(180);
			
		case "6" :
			return(90);
	}	
}

const fileUpload = async (file) => {
  try{
    let imgobj = {
      secure_url : null,
      public_id : null
    };
     if(file){
             if(file.size > 2000000){
               //compression of image => gices buffer data | hencse upload using uploadFromBuffer
                 let buffdata;
                 let dimensions = sizeOf(file.path);
                 await sharp(file.path)
                 .resize({
                     width: Math.floor(dimensions.width*0.5),
                     height: Math.floor(dimensions.height*0.5),
                     fit: sharp.fit.cover,
                     position: sharp.strategy.entropy
                 })
                 .withMetadata()
                 .toFormat("jpeg")
                 .jpeg({ quality: 95 })
                 .toBuffer({ resolveWithObject: true })
                 .then(({ data, info }) => { 
                     buffdata = data;
                  })
                 .catch(err => {
                     console.error(err.message);
                     return next({
                         message : err.message
                     });
                 });

                 var result = await uploadFromBuffer(buffdata);
             }
             
             else{
                 var result = await uploadToCloud(file.path);
                }

             imgobj.secure_url = result.secure_url;
             imgobj.public_id = result.public_id;
     }
     return imgobj;
    }catch(error){
      console.log(error);
    }
}


//bufer upload
  // Upload buffer image to cloudinary 
  const uploadFromBuffer = (req) => {
    return new Promise((resolve, reject) => {
      let cld_upload_stream = cloudinary.v2.uploader.upload_stream({exif : true},
       (error, result) => {
         if (result) {
           resolve(result);
         } else {
           reject(error);
          }
        }
      );
      streamifier.createReadStream(req).pipe(cld_upload_stream);
    });
 };

const uploadToCloud = (filePath) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(filePath ,
         (err, url) => {
        if (err) return reject(err);
        return resolve(url);
      });
    });
}

const uploadFromURL = (image_url) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(image_url,
    (err, url) => {
      if(err)
      return reject(err);
      return resolve(url);
  });
});
}



module.exports.fileUpload = fileUpload;
module.exports.uploadFromURL = uploadFromURL;
module.exports.upload = upload;
module.exports.uploadToCloud = uploadToCloud;


