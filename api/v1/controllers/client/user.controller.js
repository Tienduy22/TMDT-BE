const User = require("../../models/user.model")
const md5 = require("md5");
const generateHelper = require("../../../../helpers/generate")
const ForgotPassword = require("../../models/forgot-password.model")
const sendMail = require("../../../../helpers/sendMail")
const jwtHelper = require("../../../../helpers/jwt.helper")
const jwt = require("jsonwebtoken");


// [POST] api/v1/user/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (existEmail) {
        res.json({
            code: 400,
            message: "Email đã tồn tại"
        })
    } else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: ""
        });

        await user.save();
        user.token = await jwtHelper.accessToken({
            id: user.id
        })

        await user.save();
        res.json({
            code: 200,
            message: "Đăng ký thành công",
        })
    }
}

// [POST] api/v1/user/login
module.exports.login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    res.cookie('refreshToken', "1156564");

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại"
        })
        return;
    }

    if (md5(req.body.password) !== user.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu"
        })
        return;
    }

    user.token = await jwtHelper.accessToken({
        id: user._id
    })

    user.refreshToken = await jwtHelper.refreshToken({
        id: user._id
    })

    await user.save();

    res.cookie('refreshToken', user.refreshToken,{ httpOnly: true, secure: false });

    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: user.token,
    })
}

//[POST] api/v1/user/refresh_token
module.exports.refreshToken = async (req,res) => {
    const refresh_token = req.cookies.refreshToken;
    if(!refresh_token) return res.json({
        code: 400,
        message: "Không có refresh_token"
    })

    jwt.verify(refresh_token,process.env.REFRESH_SECRET,(err,user) => {
        if(err) return res.sendStatus(400);

        const newAccessToken = jwt.sign({
            id: user.id
        },process.env.REFRESH_SECRET,{expiresIn:"1h"})

        res.json({
            token: newAccessToken
        })
    })
}

//[GET] api/v1/user/profile/:id
module.exports.profile = async (req,res) => {
    // Lấy userId từ request (đã được xác thực qua JWT)
    res.cookie('token', 'nfkhsakjfhkjsa', { httpOnly: true, secure: false });
    console.log("ketnoi")
    const userId = req.params.id;

    // Lấy thông tin người dùng từ DB (bạn có thể thay đổi theo model của mình)
    const user = await User.findOne({
        _id: userId
    });
    if (!user) return res.status(404).json({ error: 'Tài khoản không tồn tại' });

    // Trả về thông tin profile
    res.json({
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
    });
}

//[POST] api/v1/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại"
        })
        return;
    }

    const otp = generateHelper.generateRandomNumber(6);

    const objForgotPassword = {
        email: user.email,
        otp: otp,
        expireAt: Date.now() + 5 * 60 * 1000 // 5 phút
    }

    const forgotPassword = new ForgotPassword(objForgotPassword);
    await forgotPassword.save();

    //Gửi OTP qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";

    const html = `
        Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút
    `;

    sendMail.sendMail(user.email, subject, html);
    //Gửi OTP qua email

    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email",
    })
}

//[POST] api/v1/user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const forgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    })

    if(!forgotPassword){
        res.json({
            code: 400,
            message: "Mã OTP không tồn tại"
        })
        return;
    }

    const user = await User.findOne({
        email: email
    })

    const tokenUser = user.tokenUser;

    res.json({
        code: 200,
        message: "Mã OTP hợp lệ",
        tokenUser: tokenUser
    })
}

//[POST] api/v1/user/password/reset
module.exports.resetPassword = async (req, res) => {
    const token = req.body.tokenUser;
    const password = req.body.password;

    const user = await User.findOne({
        tokenUser: token
    })

    if(md5(password) === user.password){
        res.json({
            code: 400,
            message: "Mật khẩu mới không được giống mật khẩu cũ"
        })
        return;
    }

    await User.updateOne({
        tokenUser: token
    },{
        password: md5(password)
    })

    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công"
    })

}