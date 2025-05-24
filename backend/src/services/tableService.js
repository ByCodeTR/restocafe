const Table = require('../models/Table');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

class TableService {
  /**
   * Tüm masaları listele
   * @param {Object} filters - Filtre parametreleri
   * @returns {Promise<Table[]>}
   */
  async getTables(filters = {}) {
    const where = { isActive: true };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.section) {
      where.section = filters.section;
    }

    if (filters.floor) {
      where.floor = filters.floor;
    }

    if (filters.capacity) {
      where.capacity = {
        [Op.gte]: filters.capacity
      };
    }

    if (filters.waiterId) {
      where.currentWaiterId = filters.waiterId;
    }

    const tables = await Table.findAll({
      where,
      include: [{
        model: User,
        as: 'currentWaiter',
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['number', 'ASC']]
    });

    return tables;
  }

  /**
   * Masa detayını getir
   * @param {number} tableId 
   * @returns {Promise<Table>}
   */
  async getTableById(tableId) {
    const table = await Table.findByPk(tableId, {
      include: [{
        model: User,
        as: 'currentWaiter',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });

    if (!table) {
      throw new ApiError(404, 'Masa bulunamadı');
    }

    return table;
  }

  /**
   * Yeni masa oluştur
   * @param {Object} tableData 
   * @returns {Promise<Table>}
   */
  async createTable(tableData) {
    // Masa numarası kontrolü
    const existingTable = await Table.findOne({
      where: { number: tableData.number }
    });

    if (existingTable) {
      throw new ApiError(400, 'Bu masa numarası zaten kullanımda');
    }

    const table = await Table.create(tableData);
    return this.getTableById(table.id);
  }

  /**
   * Masa güncelle
   * @param {number} tableId 
   * @param {Object} updateData 
   * @returns {Promise<Table>}
   */
  async updateTable(tableId, updateData) {
    const table = await this.getTableById(tableId);

    // Masa numarası değişiyorsa kontrol et
    if (updateData.number && updateData.number !== table.number) {
      const existingTable = await Table.findOne({
        where: { 
          number: updateData.number,
          id: { [Op.ne]: tableId }
        }
      });

      if (existingTable) {
        throw new ApiError(400, 'Bu masa numarası zaten kullanımda');
      }
    }

    await table.update(updateData);
    return this.getTableById(tableId);
  }

  /**
   * Masa sil (soft delete)
   * @param {number} tableId 
   * @returns {Promise<void>}
   */
  async deleteTable(tableId) {
    const table = await this.getTableById(tableId);
    
    // Aktif siparişi veya rezervasyonu olan masa silinemez
    if (table.status === 'occupied' || table.status === 'reserved') {
      throw new ApiError(400, 'Aktif siparişi veya rezervasyonu olan masa silinemez');
    }

    await table.update({ isActive: false });
  }

  /**
   * Masa durumunu güncelle
   * @param {number} tableId 
   * @param {string} status 
   * @param {number} waiterId 
   * @returns {Promise<Table>}
   */
  async updateTableStatus(tableId, status, waiterId = null) {
    const table = await this.getTableById(tableId);
    await table.updateStatus(status, waiterId);
    return this.getTableById(tableId);
  }

  /**
   * Masaya garson ata
   * @param {number} tableId 
   * @param {number} waiterId 
   * @returns {Promise<Table>}
   */
  async assignWaiter(tableId, waiterId) {
    const table = await this.getTableById(tableId);
    
    // Garson kontrolü
    const waiter = await User.findByPk(waiterId);
    if (!waiter || !waiter.hasRole('waiter')) {
      throw new ApiError(400, 'Geçersiz garson ID');
    }

    await table.assignWaiter(waiterId);
    return this.getTableById(tableId);
  }

  /**
   * Masadan garson kaldır
   * @param {number} tableId 
   * @returns {Promise<Table>}
   */
  async removeWaiter(tableId) {
    const table = await this.getTableById(tableId);
    await table.removeWaiter();
    return this.getTableById(tableId);
  }

  /**
   * Yeni QR kod oluştur
   * @param {number} tableId 
   * @returns {Promise<string>}
   */
  async regenerateQRCode(tableId) {
    const table = await this.getTableById(tableId);
    return table.generateNewQRCode();
  }

  /**
   * QR kod doğrula
   * @param {number} tableId 
   * @param {string} secret 
   * @returns {Promise<boolean>}
   */
  async verifyQRCode(tableId, secret) {
    const table = await this.getTableById(tableId);
    return table.qrCodeSecret === secret;
  }

  /**
   * Müsait masaları getir
   * @param {Object} filters - Filtre parametreleri
   * @returns {Promise<Table[]>}
   */
  async getAvailableTables(filters = {}) {
    const where = {
      isActive: true,
      status: 'available'
    };

    if (filters.capacity) {
      where.capacity = {
        [Op.gte]: filters.capacity
      };
    }

    if (filters.section) {
      where.section = filters.section;
    }

    if (filters.floor) {
      where.floor = filters.floor;
    }

    const tables = await Table.findAll({
      where,
      order: [['number', 'ASC']]
    });

    return tables;
  }
}

module.exports = new TableService(); 