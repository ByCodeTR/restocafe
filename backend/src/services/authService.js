const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('../utils/email');
const crypto = require('crypto');

class AuthService {
  /**
   * Kullanıcı girişi
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{user: User, token: string}>}
   */
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Geçersiz e-posta veya şifre');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'Hesabınız devre dışı bırakılmış');
    }

    // Son giriş zamanını güncelle
    user.lastLoginAt = new Date();
    await user.save();

    const token = user.generateAuthToken();

    return { user, token };
  }

  /**
   * Yeni kullanıcı kaydı
   * @param {Object} userData
   * @returns {Promise<{user: User, token: string}>}
   */
  async register(userData) {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    
    if (existingUser) {
      throw new ApiError(400, 'Bu e-posta adresi zaten kullanımda');
    }

    // Sadece admin yeni admin oluşturabilir
    if (userData.roles && userData.roles.includes('admin') && (!userData.currentUser || !userData.currentUser.hasRole('admin'))) {
      throw new ApiError(403, 'Admin rolü atama yetkiniz yok');
    }

    const user = await User.create(userData);
    const token = user.generateAuthToken();

    return { user, token };
  }

  /**
   * Şifre sıfırlama talebi
   * @param {string} email 
   * @returns {Promise<void>}
   */
  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new ApiError(404, 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı');
    }

    const { resetToken, hash } = await User.generatePasswordResetToken();
    
    user.passwordResetToken = hash;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 saat
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const message = `
      Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:
      ${resetURL}
      
      Bu bağlantı 1 saat sonra geçerliliğini yitirecektir.
      
      Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı dikkate almayın.
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'RestoCafe - Şifre Sıfırlama',
        text: message
      });
    } catch (error) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();
      throw new ApiError(500, 'E-posta gönderimi başarısız oldu');
    }
  }

  /**
   * Şifre sıfırlama
   * @param {string} token 
   * @param {string} newPassword 
   * @returns {Promise<void>}
   */
  async resetPassword(token, newPassword) {
    const hashedToken = await bcrypt.hash(token, 10);
    
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      throw new ApiError(400, 'Geçersiz veya süresi dolmuş token');
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
  }

  /**
   * Şifre değiştirme
   * @param {User} user 
   * @param {string} currentPassword 
   * @param {string} newPassword 
   * @returns {Promise<void>}
   */
  async changePassword(user, currentPassword, newPassword) {
    if (!(await user.comparePassword(currentPassword))) {
      throw new ApiError(401, 'Mevcut şifre yanlış');
    }

    user.password = newPassword;
    await user.save();
  }

  /**
   * Profil güncelleme
   * @param {User} user 
   * @param {Object} updateData 
   * @returns {Promise<User>}
   */
  async updateProfile(user, updateData) {
    // Güvenlik için bazı alanların güncellenmesini engelle
    delete updateData.password;
    delete updateData.roles;
    delete updateData.isActive;
    delete updateData.email; // E-posta değişimi ayrı bir süreç olmalı

    Object.assign(user, updateData);
    await user.save();

    return user;
  }

  /**
   * Kullanıcı devre dışı bırakma/aktifleştirme
   * @param {number} userId 
   * @param {boolean} isActive 
   * @returns {Promise<User>}
   */
  async toggleUserStatus(userId, isActive) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new ApiError(404, 'Kullanıcı bulunamadı');
    }

    user.isActive = isActive;
    await user.save();

    return user;
  }

  /**
   * Kullanıcı rollerini güncelleme
   * @param {number} userId 
   * @param {string[]} roles 
   * @param {User} currentUser 
   * @returns {Promise<User>}
   */
  async updateUserRoles(userId, roles, currentUser) {
    if (!currentUser.hasRole('admin')) {
      throw new ApiError(403, 'Rol güncelleme yetkiniz yok');
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new ApiError(404, 'Kullanıcı bulunamadı');
    }

    user.roles = roles;
    await user.save();

    return user;
  }
}

module.exports = new AuthService(); 