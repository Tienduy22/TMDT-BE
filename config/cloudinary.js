const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'tienduy2003',  
    api_key: '225841868995845',       // Thay bằng api_key của bạn
    api_secret: 'vFg_IUlqLAfHXTsW3LHCDzfgqOA', // Thay bằng api_secret của bạn
});

module.exports = cloudinary;
