const cloudinary = require('../config/cloudinary'); 
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  
    }
});

const upload = multer({ storage: storage }).single('image'); 

const uploadToCloudinary = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Lỗi khi tải ảnh lên." });
        }

        if (!req.file) {
            return next();
        }

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'products',  
                    use_filename: true,  
                    unique_filename: false,
                });

                req.body.image = result.secure_url;  
                next();
            } catch (error) {
                return res.status(500).json({ message: "Lỗi khi tải ảnh lên Cloudinary." });
            }
        } else {
            return res.status(400).json({ message: "Vui lòng chọn ảnh sản phẩm." });
        }
    });
};

module.exports = uploadToCloudinary;
