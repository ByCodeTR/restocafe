# RestoCafe - Restoran Adisyon ve Takip Sistemi 🍽️

Modern ve kullanıcı dostu bir restoran yönetim sistemi. Garsonlar, mutfak personeli ve yöneticiler için gerçek zamanlı sipariş takibi ve yönetimi sağlar.

## 🚀 Özellikler

### 💡 Temel Özellikler
- **Masa Yönetimi**: Anlık masa durumu takibi ve garson ataması
- **Sipariş Sistemi**: Detaylı sipariş girişi ve özel notlar
- **Gerçek Zamanlı İletişim**: Anında güncellenen sipariş bildirimleri
- **Stok Takibi**: Otomatik stok düşümü ve uyarı sistemi
- **Raporlama**: Kapsamlı satış ve performans raporları
- **Kullanıcı Yönetimi**: Rol tabanlı erişim sistemi (Garson, Mutfak, Yönetici)

### 📱 Kullanıcı Arayüzleri
- **Garson Paneli**: Tablet uyumlu sipariş yönetimi
- **Mutfak Ekranı**: Anlık sipariş görüntüleme
- **Yönetici Paneli**: Detaylı raporlar ve sistem yönetimi
- **Kasa Ekranı**: Hesap kapama ve ödeme işlemleri

## 🛠️ Teknik Altyapı

### Backend
- Node.js & Express.js
- MongoDB veritabanı
- Socket.io gerçek zamanlı iletişim
- JWT tabanlı kimlik doğrulama

### Frontend
- React.js
- TailwindCSS
- Redux Toolkit (Durum yönetimi)
- Socket.io-client

### Güvenlik
- JWT bazlı oturum yönetimi
- Rol tabanlı yetkilendirme
- Şifrelenmiş veri iletişimi

## 📦 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- MongoDB (v6 veya üzeri)
- npm veya yarn

### Kurulum Adımları

1. Projeyi klonlayın
```bash
git clone https://github.com/kullanici/restocafe.git
cd restocafe
```

2. Backend bağımlılıklarını yükleyin
```bash
cd backend
npm install
```

3. Frontend bağımlılıklarını yükleyin
```bash
cd frontend
npm install
```

4. Gerekli ortam değişkenlerini ayarlayın
```bash
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restocafe
JWT_SECRET=your_jwt_secret

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

5. Uygulamayı başlatın
```bash
# Backend
npm run dev

# Frontend
npm start
```

## 📁 Proje Yapısı

```
restocafe/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   └── utils/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
│
└── README.md
```

## 🔄 Geliştirme Süreci

### Faz 1: Temel Altyapı
- [x] Proje yapısının oluşturulması
  - [x] Backend klasör yapısı
  - [x] Frontend klasör yapısı
  - [x] Gerekli paketlerin kurulumu
  - [x] Temel konfigürasyon dosyaları
- [x] Veritabanı modelleri
  - [x] User modeli
  - [x] Table modeli
  - [x] Product modeli
  - [x] Order modeli
- [x] Socket.io entegrasyonu
  - [x] Backend socket handler
  - [x] Temel socket olayları
- [ ] Kullanıcı kimlik doğrulama sistemi
  - [x] JWT tabanlı auth sistemi
  - [x] Login sayfası
  - [x] Protected Route bileşeni
  - [ ] Auth middleware (backend)
  - [ ] Auth routes (backend)

### Faz 2: Temel Özellikler
- [ ] Masa yönetim sistemi
  - [ ] Masa listesi görünümü
  - [ ] Masa durumu güncelleme
  - [ ] Masa detay sayfası
  - [ ] QR kod entegrasyonu
- [ ] Sipariş alma modülü
  - [ ] Sipariş oluşturma formu
  - [ ] Ürün seçimi ve miktar belirleme
  - [ ] Özel notlar ekleme
  - [ ] Sipariş önizleme
- [ ] Mutfak ekranı
  - [ ] Aktif siparişler listesi
  - [ ] Sipariş detayları görüntüleme
  - [ ] Sipariş durumu güncelleme
  - [ ] Hazırlama süresi takibi
- [ ] Stok takip sistemi
  - [ ] Stok giriş/çıkış işlemleri
  - [ ] Minimum stok uyarıları
  - [ ] Stok geçmişi
  - [ ] Otomatik stok düşüm sistemi

### Faz 3: Gelişmiş Özellikler
- [ ] Raporlama sistemi
  - [ ] Günlük satış raporu
  - [ ] Ürün bazlı satış analizi
  - [ ] Garson performans raporu
  - [ ] Stok hareket raporu
- [ ] Menü yönetimi
  - [ ] Kategori yönetimi
  - [ ] Ürün ekleme/düzenleme
  - [ ] Fiyat güncelleme
  - [ ] Görsel yükleme
- [ ] Kullanıcı yönetimi
  - [ ] Kullanıcı ekleme/düzenleme
  - [ ] Rol yönetimi
  - [ ] Yetkilendirme sistemi
  - [ ] Kullanıcı logları
- [ ] Yazıcı entegrasyonu
  - [ ] Adisyon yazdırma
  - [ ] Mutfak siparişi yazdırma
  - [ ] Günlük rapor yazdırma

### Faz 4: Optimizasyon ve Test
- [ ] Frontend optimizasyonu
  - [ ] Performans iyileştirmeleri
  - [ ] Responsive tasarım kontrolleri
  - [ ] Erişilebilirlik kontrolleri
- [ ] Backend optimizasyonu
  - [ ] API endpoint optimizasyonları
  - [ ] Veritabanı indeksleme
  - [ ] Önbellek sistemi
- [ ] Test yazımı
  - [ ] Unit testler
  - [ ] Integration testler
  - [ ] E2E testler
- [ ] Dokümantasyon
  - [ ] API dokümantasyonu
  - [ ] Kurulum kılavuzu
  - [ ] Kullanım kılavuzu

## 🤝 Katkıda Bulunma
1. Bu depoyu fork edin
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Dalınıza push yapın (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun

## 📝 Lisans
Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim
Proje Sahibi - [@github_username](https://github.com/github_username) 