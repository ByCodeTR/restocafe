# RestoCafe Frontend

Modern restoran yönetim sistemi frontend uygulaması - React, TypeScript ve TailwindCSS ile geliştirilmiştir.

## ✅ Tamamlanan Özellikler

### Kimlik Doğrulama Sistemi
- [x] JWT tabanlı kimlik doğrulama
- [x] Form doğrulamalı Giriş ve Kayıt sayfaları
- [x] Korumalı rotalar
- [x] Kullanıcı oturum yönetimi
- [x] Rol tabanlı erişim kontrolü

### Arayüz ve Tasarım
- [x] Responsive kenar çubuğu ile ana düzen
- [x] Giriş/kayıt sayfaları için Auth düzeni
- [x] İstatistik kartları ile Dashboard düzeni
- [x] TailwindCSS ile modern arayüz
- [x] Özel tema yapılandırması

### Durum Yönetimi
- [x] Redux Toolkit kurulumu
- [x] Auth slice implementasyonu
- [x] Özel auth hook'ları

### Proje Yapısı
- [x] Özellik bazlı organizasyon
- [x] Tip tanımlamaları
- [x] API çağrıları için servis katmanı
- [x] Yeniden kullanılabilir bileşenler

## 🚧 Yapılacak Özellikler

### Masa Yönetimi
- [ ] Masa listesi görünümü
- [ ] Masa durumu yönetimi
- [ ] QR kod oluşturma
- [ ] Masa rezervasyon sistemi

### Sipariş Yönetimi
- [ ] Sipariş oluşturma/düzenleme
- [ ] Gerçek zamanlı sipariş durumu güncellemeleri
- [ ] Sipariş geçmişi
- [ ] Mutfak ekranı sistemi

### Menü Yönetimi
- [ ] Menü kategorileri
- [ ] Resimli menü öğeleri
- [ ] Fiyat yönetimi
- [ ] Özel teklifler/kombinasyonlar

### Rezervasyon Sistemi
- [ ] Takvim görünümü
- [ ] Rezervasyon oluşturma/yönetimi
- [ ] E-posta bildirimleri
- [ ] Kapasite yönetimi

### Raporlar ve Analitik
- [ ] Satış raporları
- [ ] Popüler ürünler
- [ ] Yoğun saat analizi
- [ ] Gelir istatistikleri

### Ek Özellikler
- [ ] Gerçek zamanlı bildirimler
- [ ] Personel yönetimi
- [ ] Stok takibi
- [ ] Müşteri geri bildirim sistemi

## Başlangıç

1. Projeyi klonlayın
2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Kök dizinde `.env` dosyası oluşturun ve ekleyin:
```
REACT_APP_API_URL=http://localhost:3000/api
```

4. Geliştirme sunucusunu başlatın:
```bash
npm start
```

## Teknoloji Yığını

- React 18
- TypeScript
- Redux Toolkit
- TailwindCSS
- Formik & Yup
- Socket.IO Client
- React Router v6
- Axios

## Proje Yapısı

```
src/
├── components/        # Ortak bileşenler
├── features/         # Özellik bazlı modüller
│   ├── auth/        # Kimlik doğrulama özelliği
│   ├── dashboard/   # Dashboard özelliği
│   └── ...         # Diğer özellikler
├── layouts/         # Düzen bileşenleri
├── services/        # API servisleri
├── store/          # Redux store
├── types/          # TypeScript tipleri
└── utils/          # Yardımcı fonksiyonlar
```

## Katkıda Bulunma

1. Bir özellik dalı oluşturun
2. Değişikliklerinizi commit edin
3. Dalınıza push yapın
4. Pull Request oluşturun

## Lisans

MIT 