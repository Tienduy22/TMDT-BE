const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401); // Không có token thì trả lỗi
  

  jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token không hợp lệ hoặc hết hạn
    req.user = user; // Lưu thông tin user vào request
    next(); // Tiếp tục với request kế tiếp
  });
};

module.exports = authenticateToken;