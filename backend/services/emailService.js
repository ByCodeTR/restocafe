const nodemailer = require('nodemailer');
const { format } = require('date-fns');
const { tr } = require('date-fns/locale');

// E-posta gönderici yapılandırması
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// HTML şablonları
const getConfirmationTemplate = (reservation) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563eb;">Rezervasyon Onayı</h2>
    <p>Sayın ${reservation.customerName},</p>
    <p>Rezervasyonunuz başarıyla oluşturulmuştur. Detaylar aşağıdaki gibidir:</p>
    
    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Rezervasyon No:</strong> #${reservation._id.toString().slice(-6)}</p>
      <p><strong>Tarih:</strong> ${format(new Date(reservation.time), 'PPP', { locale: tr })}</p>
      <p><strong>Saat:</strong> ${format(new Date(reservation.time), 'HH:mm')}</p>
      <p><strong>Masa:</strong> ${reservation.table.number}</p>
      <p><strong>Kişi Sayısı:</strong> ${reservation.partySize}</p>
    </div>

    <p>Önemli Notlar:</p>
    <ul>
      <li>Lütfen rezervasyon saatinize uygun gelmeye özen gösteriniz.</li>
      <li>Gelemeyecek olmanız durumunda en az 2 saat öncesinden haber veriniz.</li>
      <li>Rezervasyonunuzla ilgili değişiklik yapmak için bizi arayabilirsiniz.</li>
    </ul>

    <p style="color: #6b7280; font-size: 14px;">
      Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
    </p>
  </div>
`;

const getCancellationTemplate = (reservation) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #dc2626;">Rezervasyon İptali</h2>
    <p>Sayın ${reservation.customerName},</p>
    <p>Rezervasyonunuz iptal edilmiştir. Detaylar aşağıdaki gibidir:</p>
    
    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Rezervasyon No:</strong> #${reservation._id.toString().slice(-6)}</p>
      <p><strong>Tarih:</strong> ${format(new Date(reservation.time), 'PPP', { locale: tr })}</p>
      <p><strong>Saat:</strong> ${format(new Date(reservation.time), 'HH:mm')}</p>
      <p><strong>İptal Nedeni:</strong> ${reservation.cancelReason || 'Belirtilmemiş'}</p>
    </div>

    <p>
      Yeni bir rezervasyon yapmak için bizi arayabilir veya web sitemizi ziyaret edebilirsiniz.
    </p>

    <p style="color: #6b7280; font-size: 14px;">
      Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
    </p>
  </div>
`;

// Rezervasyon onay e-postası gönder
exports.sendReservationConfirmation = async (reservation) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: reservation.customerEmail,
      subject: 'Rezervasyon Onayı',
      html: getConfirmationTemplate(reservation)
    });
  } catch (error) {
    console.error('Rezervasyon onay e-postası gönderilemedi:', error);
  }
};

// Rezervasyon iptal e-postası gönder
exports.sendReservationCancellation = async (reservation) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: reservation.customerEmail,
      subject: 'Rezervasyon İptali',
      html: getCancellationTemplate(reservation)
    });
  } catch (error) {
    console.error('Rezervasyon iptal e-postası gönderilemedi:', error);
  }
}; 