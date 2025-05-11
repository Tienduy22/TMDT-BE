const ProductCategory = require("../../models/product-category.model");
const paginationHelper = require("../../../../helpers/pagination.helper");
const searchHelper = require("../../../../helpers/search.helper")

//[GET] api/v1/product-category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    const productCategories = await ProductCategory.find(find);

    res.json(productCategories);
}

//[POST] api/v1/product-category/detail/:id
module.exports.detail = async (req,res) => {
    try {
        const id = req.params.id;

        const find = {
            deleted: false,
            _id: id,
        }

        const productCategory = await ProductCategory.findOne(find);
        if (!productCategory) {
            return res.json({
                code: 200,
                message: "không tìm thấy danh mục sản phẩm",
            })
        }

        res.json({
            code: 200,
            message: "Tim thấy danh mục sản phẩm",
            data: productCategory,
        })
    } catch (error) {
        res.json({
            code: 200,
            message: "không tìm thấy danh mục sản phẩm",
        })
    }
}

//[POST] api/v1/product-category/create
module.exports.create = async (req,res) => {
    try {
        const {title, parent_id, description} = req.body;
    
        const productCategory = new ProductCategory({
            title: title,
            parent_id: parent_id,
            description: description,
        });
    
        await productCategory.save();
    
        res.json({
            code: 200,
            message: "Tạo danh mục sản phẩm thành công",
            data: productCategory,
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo danh mục sản phẩm thất bại",
        })
        
    }
}

//[PATCH] api/v1/product-category/edit/:id
module.exports.edit = async (req,res) => {
    try {
        const id = req.params.id;
        await ProductCategory.updateOne({
            _id: id,
        }, {
            $set: req.body,
        })

        res.json({
            code: 200,
            message: "Cập nhật danh mục sản phẩm thành công",
        })
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật danh mục sản phẩm thất bại",
        })
        
    }
}

//[DELETE] api/v1/product-category/delete/:id
module.exports.delete = async (req,res) => {
    try {
        const id = req.params.id;
        await ProductCategory.updateOne({
            _id: id,
        },{
            deleted: true
        })

        res.json({
            code: 200,
            message: "Xóa sản phẩm thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa sản phẩm thất bại" 
        })
    }
}