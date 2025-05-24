const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token doğrulama middleware'i
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Token'ı header'dan al
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Lütfen giriş yapın' });
    }

    try {
      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Kullanıcıyı bul
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Geçersiz token' });
      }

      // Kullanıcı aktif değilse
      if (!user.isActive) {
        return res.status(401).json({ message: 'Hesabınız devre dışı bırakılmış' });
      }

      // Kullanıcıyı request'e ekle
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Geçersiz token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Rol bazlı erişim kontrolü
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Bu işlemi yapmak için yetkiniz yok'
      });
    }
    next();
  };
}; 