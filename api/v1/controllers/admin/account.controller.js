const Account = require("../../models/account.model");
const searchHelper = require("../../../../helpers/search.helper");
const generateHelper = require("../../../../helpers/generate");
const md5 = require("md5");

// [GET] /api/v1/admin/accounts
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    // Search
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.fullName = objectSearch.regex;
    }
    // Search

    const accounts = await Account.find(find);

    res.json(accounts);
};

// [POST] /api/v1/admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const account = await Account.find({
            _id: id,
            deleted: false,
        });
        res.json(account);
    } catch (error) {
        res.json({
            code: 400,
            message: "không tìm thấy tài khoản",
        });
    }
};

// [POST] /api/v1/admin/accounts/create
module.exports.create = async (req,res) =>{
    try {
        const password = md5(req.body.password);

        const existEmail = await Account.findOne({
            email: req.body.email,
            deleted: false,
        })

        if(existEmail){
            res.json({
                code: 400,
                message: "Email đã tồn tại"
            })          
        }
        else{
            const account = new Account({
                fullName: req.body.fullName,
                email: req.body.email,
                password: password,
                phone: req.body.phone,
                role_id: req.body.role_id,
                avatar: req.body.avatar,
                token: generateHelper.generateRandomString(30),
            });

            await account.save();

            res.json({
                code: 200,
                message: "Tạo tài khoản thành công",
                data: account,
                token: account.token
            })
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo tài khoản thất bại",
        })
    }
}

// [PATCH] /api/v1/admin/accounts/edit/:id
module.exports.edit = async (req,res) =>{
    try {
        const id = req.params.id;

        await Account.updateOne({   
            _id: id,
            deleted: false,
        },req.body)

        res.json({
            code: 200,
            message: "Cập nhật tài khoản thành công",
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật tài khoản thất bại",
        })
    }
}

// [DELETE] /api/v1/admin/accounts/delete/:id
module.exports.delete = async (req,res) =>{
    try {
        const id = req.params.id;

        await Account.updateOne({
            _id: id,
            deleted: false,
        },{
            deleted: true
        })

        res.json({
            message: "Xóa tài khoản thành công",
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa tài khoản thất bại",
        })
    }
}

