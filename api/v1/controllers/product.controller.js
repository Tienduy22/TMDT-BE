const Product = require("../models/product.model");
const paginationHelper = require("../../../helpers/pagination.helper");
const searchHelper = require("../../../helpers/search.helper")

// [GET] /api/v1/products
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  if (req.query.material) {
    find.material = req.query.material;
  }
  // Search
  let objectSearch = searchHelper(req.query);

  if(req.query.keyword){
    find.title = objectSearch.regex;
  }
  // Search

  //Pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 4,
  };

  const countProducts = await Product.countDocuments(find);

  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countProducts
  );
  //Pagination

  // Sort
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // Sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.json(products);
};

// [GET] /api/v1/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.find({
      _id: id,
      deleted: false,
    });
    res.json(product);
  } catch (error) {
    res.json("Không tìm thấy");
  }
};

//[PATCH] /api/v1/products/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Product.updateOne({
            _id: id,
        },{
            status: status
        })

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        })
    }
}

//[POST] /api/v1/products/create

module.exports.create = async (req,res) => {
    try {
        const product = new Product(req.body);
        const data = await product.save();

        res.json({
            code: 200,
            message: "Tạo sản phẩm thành công",
            data: data
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo sản phẩm thất bại"
        })
    }
}

//[PATCH] /api/v1/products/edit/:id

module.exports.edit = async (req,res) => {
    try {
        const id = req.params.id;

        await Product.updateOne({
            _id: id
        },req.body)

        res.json({
            code: 200,
            message: "Cập nhật sản phẩm thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật sản phẩm thất bại"
        })
    }
}

//[DELETE] /api/v1/products/delete/:id

module.exports.delete = async (req,res) => {
    try {
        const id = req.params.id;

        await Product.updateOne({
            _id: id
        },{
            deleted: true,
        })

        res.json({
            code: 200,
            message: "Xoá sản phẩm thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Xoá sản phẩm thất bại"
        })
    }
}
