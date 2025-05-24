# RestoCafe - Restoran Yönetim Sistemi

RestoCafe, modern restoranlar için geliştirilmiş kapsamlı bir adisyon ve sipariş takip sistemidir. QR kod entegrasyonu, gerçek zamanlı sipariş takibi ve detaylı raporlama özellikleri ile restoran operasyonlarını dijitalleştirmeyi amaçlar.

## Özellikler

### Temel Özellikler
- [x] JWT tabanlı kullanıcı yetkilendirme sistemi
- [x] Rol bazlı erişim kontrolü (Admin, Garson, Mutfak, Kasiyer)
- [x] QR kodlu masa yönetim sistemi
- [x] Gerçek zamanlı masa durumu takibi
- [x] Kategori ve ürün yönetimi
  - [x] Hiyerarşik kategori yapısı
  - [x] Ürün varyasyonları
  - [x] Stok takibi
  - [x] Fiyat geçmişi
- [x] Sipariş sistemi
  - [x] Sipariş oluşturma
  - [x] Sipariş düzenleme
  - [x] Sipariş takibi
  - [x] Ödeme sistemi entegrasyonu
  - [x] Stok yönetimi entegrasyonu
- [x] Gerçek zamanlı bildirim sistemi
  - [x] Socket.IO entegrasyonu
  - [x] Rol bazlı bildirimler
  - [x] Sipariş durumu bildirimleri
  - [x] Stok uyarıları
  - [x] Masa durumu güncellemeleri
- [ ] Mutfak ekranı
  - [ ] Aktif siparişleri görüntüleme
  - [ ] Sipariş durumu güncelleme
  - [ ] Bildirim sistemi
- [ ] Garson ekranı
  - [ ] Masa bazlı sipariş yönetimi
  - [ ] Sipariş oluşturma arayüzü
  - [ ] Ödeme alma

### Gelişmiş Özellikler (Planlanan)
- [ ] Rezervasyon sistemi
- [ ] Müşteri sadakat programı
- [ ] Stok takibi
- [ ] Raporlama ve analiz
- [ ] Mobil uygulama
- [ ] Çoklu şube desteği

## Teknolojiler

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication

### Frontend
- React.js
- Redux
- TailwindCSS
- Socket.IO Client

## Kurulum

1. Depoyu klonlayın:
```bash
git clone https://github.com/ByCodeTR/adisyonson.git
cd adisyonson
```

2. Backend kurulumu:
```bash
cd backend
npm install
cp .env.example .env  # .env dosyasını oluşturun ve gerekli değişkenleri ayarlayın
npm run dev
```

3. Frontend kurulumu:
```bash
cd frontend
npm install
cp .env.example .env  # .env dosyasını oluşturun ve gerekli değişkenleri ayarlayın
npm start
```

## Geliştirme Fazları

### Faz 1: Temel Altyapı ✓
- [x] Proje yapısı ve klasör organizasyonu
- [x] Veritabanı modelleri (User, Table, Product, Order)
- [x] Socket.io entegrasyonu
- [x] JWT tabanlı auth sistemi
- [x] Login sayfası
- [x] Protected Route bileşeni
- [x] Masa yönetim sistemi
  - [x] Masa CRUD işlemleri
  - [x] QR kod entegrasyonu
  - [x] Gerçek zamanlı masa durumu takibi
  - [x] Garson atama sistemi

### Faz 2: Temel Özellikler (Devam Ediyor)
- [x] Ürün yönetim sistemi
  - [x] Kategori CRUD işlemleri
  - [x] Ürün CRUD işlemleri
  - [x] Fiyat ve stok yönetimi
  - [x] Varyasyon sistemi
  - [x] Besin değerleri ve alerjen takibi
- [x] Sipariş sistemi
  - [x] Sipariş oluşturma
  - [x] Sipariş düzenleme
  - [x] Sipariş takibi
  - [x] Ödeme sistemi entegrasyonu
  - [x] Stok yönetimi entegrasyonu
- [x] Gerçek zamanlı iletişim
  - [x] Socket.IO backend servisi
  - [x] Socket.IO frontend entegrasyonu
  - [x] Bildirim sistemi
  - [x] Olay (event) yönetimi
- [x] Mutfak ekranı
  - [x] Sipariş listesi
  - [x] Sipariş detayları
  - [x] Durum güncelleme
  - [x] Bildirimler
- [x] Garson ekranı
  - [x] Sipariş yönetimi
  - [x] Masa takibi
  - [x] Bildirimler
- [x] Rezervasyon sistemi (Frontend)
  - [x] Takvim görünümü
  - [x] Liste görünümü
  - [x] Rezervasyon oluşturma formu
  - [x] Müsait masa kontrolü
  - [x] Rezervasyon durumu takibi
  - [x] Gerçek zamanlı güncellemeler

### Faz 3: Gelişmiş Özellikler (Devam Ediyor)
- [x] Rezervasyon sistemi (Backend)
  - [x] Rezervasyon modeli
  - [x] API endpoint'leri
  - [x] Müsait masa kontrolü algoritması
  - [x] Socket.IO event'leri
  - [x] E-posta bildirimleri
- [x] Müşteri yönetimi
  - [x] Müşteri profilleri
  - [x] Rezervasyon geçmişi
  - [x] Sipariş geçmişi
  - [x] Sadakat programı
- [ ] Raporlama sistemi
  - [ ] Satış raporları
    - [ ] Günlük/haftalık/aylık satış analizleri
    - [ ] Ürün bazlı satış raporları
    - [ ] Kategori bazlı satış raporları
    - [ ] Garson performans raporları
  - [ ] Müşteri analizleri
    - [ ] Müşteri segmentasyonu
    - [ ] Sadakat programı analizleri
    - [ ] Müşteri davranış analizleri
  - [ ] Rezervasyon analizleri
    - [ ] Doluluk oranları
    - [ ] İptal/No-show analizleri
    - [ ] Peak saat analizleri
  - [ ] Stok raporları
    - [ ] Stok tüketim analizleri
    - [ ] Tedarik önerileri
    - [ ] Fire raporları
  - [ ] Finansal raporlar
    - [ ] Gelir/gider analizleri
    - [ ] Kar/zarar raporları
    - [ ] Nakit akış raporları
- [ ] Analitik dashboard
  - [ ] Gerçek zamanlı istatistikler
  - [ ] Grafik ve tablolar
  - [ ] Özelleştirilebilir görünüm
- [ ] Çoklu dil desteği
  - [ ] Türkçe
  - [ ] İngilizce
  - [ ] Dil dosyaları yönetimi
- [ ] Tema özelleştirme
  - [ ] Renk şemaları
  - [ ] Logo ve marka ayarları
  - [ ] Özel CSS desteği

### Faz 4: Optimizasyon ve Test
- [ ] Performans optimizasyonu
- [ ] Güvenlik testleri
- [ ] Yük testleri
- [ ] End-to-end testler
- [ ] Dokümantasyon
- [ ] Deployment kılavuzu

## API Dokümantasyonu

### Auth Endpoints
- `POST /api/auth/register` - Yeni kullanıcı kaydı (Admin)
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgileri
- `PUT /api/auth/profile` - Profil güncelleme

### Masa Endpoints
- `GET /api/tables` - Tüm masaları listele
- `GET /api/tables/:id` - Masa detayı
- `POST /api/tables` - Yeni masa oluştur (Admin)
- `PUT /api/tables/:id` - Masa güncelle (Admin)
- `DELETE /api/tables/:id` - Masa sil (Admin)
- `PATCH /api/tables/:id/status` - Masa durumu güncelle
- `PATCH /api/tables/:id/assign` - Masaya garson ata

### Kategori Endpoints
- `GET /api/categories` - Tüm kategorileri listele
- `GET /api/categories?tree=true` - Kategori ağacını getir
- `GET /api/categories/:id` - Kategori detayı
- `POST /api/categories` - Yeni kategori oluştur (Admin)
- `PUT /api/categories/:id` - Kategori güncelle (Admin)
- `DELETE /api/categories/:id` - Kategori sil (Admin)
- `PATCH /api/categories/reorder` - Kategorileri yeniden sırala (Admin)

### Ürün Endpoints
- `GET /api/products` - Tüm ürünleri listele (Filtreleme & Sayfalama)
- `GET /api/products/low-stock` - Düşük stoklu ürünleri listele
- `GET /api/products/:id` - Ürün detayı
- `POST /api/products` - Yeni ürün oluştur (Admin)
- `PUT /api/products/:id` - Ürün güncelle (Admin)
- `DELETE /api/products/:id` - Ürün sil (Admin)
- `PATCH /api/products/:id/stock` - Ürün stok güncelle

### Sipariş Endpoints
- `GET /api/orders` - Tüm siparişleri listele (Filtreleme & Sayfalama)
- `GET /api/orders/summary/daily` - Günlük sipariş özeti (Admin & Yönetici)
- `GET /api/orders/:id` - Sipariş detayı
- `POST /api/orders` - Yeni sipariş oluştur (Garson & Admin)
- `PATCH /api/orders/:id/items/:itemId/status` - Sipariş kalemi durumunu güncelle (Garson, Mutfak & Admin)
- `POST /api/orders/:id/payments` - Siparişe ödeme ekle (Garson, Kasiyer & Admin)
- `PATCH /api/orders/:id/cancel` - Sipariş iptal et (Garson & Admin)

### Rezervasyon Endpoints
- `GET /api/reservations` - Rezervasyonları listele (Filtreleme & Sayfalama)
- `GET /api/reservations/:id` - Rezervasyon detayı
- `POST /api/reservations` - Yeni rezervasyon oluştur
- `PATCH /api/reservations/:id` - Rezervasyon güncelle
- `PATCH /api/reservations/:id/cancel` - Rezervasyon iptal et
- `GET /api/tables/available` - Müsait masaları kontrol et

### Socket.IO Events

#### Sunucu Events (Emit)
- `newOrder` - Yeni sipariş bildirimi
- `orderStatusUpdate` - Sipariş durumu güncelleme
- `orderCompleted` - Sipariş tamamlama
- `orderCancelled` - Sipariş iptal
- `tableUpdate` - Masa durumu güncelleme
- `lowStockAlert` - Düşük stok uyarısı
- `newReservation` - Yeni rezervasyon bildirimi
- `reservationUpdate` - Rezervasyon durumu güncelleme
- `reservationCancel` - Rezervasyon iptal

#### İstemci Events (Listen)
- `authenticate` - Kullanıcı kimlik doğrulama
- `joinKitchen` - Mutfak odasına katılma
- `joinTable` - Masa odasına katılma
- `disconnect` - Bağlantı kesme
- `joinReservations` - Rezervasyon odasına katılma

### Bildirim Türleri
- `

### Müşteri Endpoints
- `GET /api/customers` - Müşterileri listele (Filtreleme & Sayfalama)
- `GET /api/customers/:id` - Müşteri detayı
- `POST /api/customers` - Yeni müşteri oluştur
- `PATCH /api/customers/:id` - Müşteri güncelle
- `GET /api/customers/:id/stats` - Müşteri istatistikleri

### Raporlama Endpoints
- `GET /api/reports/sales/daily` - Günlük satış raporu
- `GET /api/reports/sales/weekly` - Haftalık satış raporu
- `GET /api/reports/sales/monthly` - Aylık satış raporu
- `GET /api/reports/products` - Ürün satış raporu
- `GET /api/reports/categories` - Kategori satış raporu
- `GET /api/reports/waiters` - Garson performans raporu
- `GET /api/reports/customers` - Müşteri analiz raporu
- `GET /api/reports/reservations` - Rezervasyon analiz raporu
- `GET /api/reports/inventory` - Stok raporu
- `GET /api/reports/financial` - Finansal rapor