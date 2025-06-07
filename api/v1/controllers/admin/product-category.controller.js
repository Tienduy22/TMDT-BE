const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const paginationHelper = require("../../../../helpers/pagination.helper");
const searchHelper = require("../../../../helpers/search.helper");

//[GET] api/v1/product-category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    const productCategories = await ProductCategory.find(find);

    for(const category of productCategories){
        category.quantity = await Product.countDocuments({product_category_id: category._id})
    }

    res.json(productCategories);
};

//[POST] api/v1/product-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const find = {
            deleted: false,
            _id: id,
        };

        const productCategory = await ProductCategory.findOne(find);
        if (!productCategory) {
            return res.json({
                code: 200,
                message: "không tìm thấy danh mục sản phẩm",
            });
        }

        res.json({
            code: 200,
            message: "Tim thấy danh mục sản phẩm",
            data: productCategory,
        });
    } catch (error) {
        res.json({
            code: 200,
            message: "không tìm thấy danh mục sản phẩm",
        });
    }
};

//[POST] api/v1/product-category/create
module.exports.create = async (req, res) => {
    try {
        const count = await ProductCategory.countDocuments();

        if (req.body.position) {
            req.body.position = count + 1;
        }

        const productCategory = new ProductCategory({
            thumbnail: req.body.image,
            ...req.body,
        });

        await productCategory.save();

        res.json({
            code: 200,
            message: "Tạo danh mục sản phẩm thành công",
            data: productCategory,
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo danh mục sản phẩm thất bại",
        });
    }
};

//[PATCH] api/v1/product-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        if (req.body.image) {
            await ProductCategory.updateOne(
                {
                    _id: id,
                },
                {
                    title: req.body.title,
                    position: req.body.position,
                    thumbnail: req.body.image,
                }
            );
        } else {
            await ProductCategory.updateOne(
                {
                    _id: id,
                },
                {
                    title: req.body.title,
                    position: req.body.position,
                }
            );
        }
        

        res.json({
            code: 200,
            message: "Cập nhật danh mục sản phẩm thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật danh mục sản phẩm thất bại",
        });
        console.log(error);
    }
};

//[DELETE] api/v1/product-category/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await ProductCategory.deleteOne({ _id: id });

        res.json({
            code: 200,
            message: "Xóa sản phẩm thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa sản phẩm thất bại",
        });
    }
};
