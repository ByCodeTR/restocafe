const sequelize = require('./config/db');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Veritabanı bağlantısı başarılı');
    
    // Tabloları senkronize et
    await sequelize.sync({ alter: true });
    console.log('Tablolar senkronize edildi');
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection(); 