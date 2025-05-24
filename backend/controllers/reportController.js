const Report = require('../models/Report');
const reportService = require('../services/reportService');

// Rapor Listesi
exports.getReports = async (req, res) => {
  try {
    const { type, timeRange, status } = req.query;
    const query = {};

    if (type) query.type = type;
    if (timeRange) query['config.timeRange'] = timeRange;
    if (status) query.status = status;

    const reports = await Report.find(query)
      .sort('-createdAt')
      .select('-cache.data');

    res.json({ reports });
  } catch (error) {
    res.status(500).json({
      message: 'Raporlar alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Rapor Detayı
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        message: 'Rapor bulunamadı'
      });
    }

    // Önbellek süresi dolmuşsa raporu yeniden oluştur
    if (report.isExpired) {
      const updatedReport = await reportService.generateReport(
        report.type,
        report.config.timeRange,
        report.config.customRange
      );
      return res.json({ report: updatedReport });
    }

    res.json({ report });
  } catch (error) {
    res.status(500).json({
      message: 'Rapor alınırken bir hata oluştu',
      error: error.message
    });
  }
};

// Yeni Rapor Oluştur
exports.createReport = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      config,
      schedule,
      visualization,
      access
    } = req.body;

    // Rapor verisi oluştur
    const reportData = await reportService.generateReport(
      type,
      config.timeRange,
      config.customRange
    );

    const report = new Report({
      name,
      type,
      description,
      config,
      schedule,
      visualization,
      access,
      createdBy: req.user._id
    });

    await report.updateCache(reportData.cache.data);
    await report.save();

    res.status(201).json({
      message: 'Rapor başarıyla oluşturuldu',
      report
    });
  } catch (error) {
    res.status(500).json({
      message: 'Rapor oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

// Rapor Güncelle
exports.updateReport = async (req, res) => {
  try {
    const {
      name,
      description,
      config,
      schedule,
      visualization,
      access,
      status
    } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        message: 'Rapor bulunamadı'
      });
    }

    // Alanları güncelle
    if (name) report.name = name;
    if (description) report.description = description;
    if (config) report.config = { ...report.config, ...config };
    if (schedule) await report.updateSchedule(schedule);
    if (visualization) report.visualization = visualization;
    if (access) report.access = access;
    if (status) report.status = status;

    report.updatedBy = req.user._id;

    // Yapılandırma değişmişse raporu yeniden oluştur
    if (config && (config.timeRange || config.customRange || config.filters)) {
      const reportData = await reportService.generateReport(
        report.type,
        config.timeRange || report.config.timeRange,
        config.customRange || report.config.customRange
      );
      await report.updateCache(reportData.cache.data);
    }

    await report.save();

    res.json({
      message: 'Rapor başarıyla güncellendi',
      report
    });
  } catch (error) {
    res.status(500).json({
      message: 'Rapor güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// Rapor Sil
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        message: 'Rapor bulunamadı'
      });
    }

    await report.remove();

    res.json({
      message: 'Rapor başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Rapor silinirken bir hata oluştu',
      error: error.message
    });
  }
};

// Hızlı Rapor Oluştur
exports.generateQuickReport = async (req, res) => {
  try {
    const { type, timeRange, customRange } = req.body;

    const reportData = await reportService.generateReport(
      type,
      timeRange,
      customRange
    );

    res.json({
      message: 'Rapor başarıyla oluşturuldu',
      report: reportData
    });
  } catch (error) {
    res.status(500).json({
      message: 'Rapor oluşturulurken bir hata oluştu',
      error: error.message
    });
  }
};

// Rapor Önbelleğini Yenile
exports.refreshReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        message: 'Rapor bulunamadı'
      });
    }

    const reportData = await reportService.generateReport(
      report.type,
      report.config.timeRange,
      report.config.customRange
    );

    await report.updateCache(reportData.cache.data);

    res.json({
      message: 'Rapor önbelleği başarıyla yenilendi',
      report
    });
  } catch (error) {
    res.status(500).json({
      message: 'Rapor önbelleği yenilenirken bir hata oluştu',
      error: error.message
    });
  }
}; 