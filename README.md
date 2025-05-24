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
- [x] Raporlama sistemi
  - [x] Satış raporları
    - [x] Günlük/haftalık/aylık satış analizleri
    - [x] Ürün bazlı satış raporları
    - [x] Kategori bazlı satış raporları
    - [x] Garson performans raporları
  - [x] Müşteri analizleri
    - [x] Müşteri segmentasyonu
    - [x] Sadakat programı analizleri
    - [x] Müşteri davranış analizleri
  - [x] Rezervasyon analizleri
    - [x] Doluluk oranları
    - [x] İptal/No-show analizleri
    - [x] Peak saat analizleri
  - [x] Stok raporları
    - [x] Stok tüketim analizleri
    - [x] Tedarik önerileri
    - [x] Fire raporları
  - [x] Finansal raporlar
    - [x] Gelir/gider analizleri
    - [x] Kar/zarar raporları
    - [x] Nakit akış raporları
- [x] Analitik dashboard
  - [x] Gerçek zamanlı istatistikler
  - [x] Grafik ve tablolar
  - [x] Özelleştirilebilir görünüm
- [x] Çoklu dil desteği
  - [x] Türkçe
  - [x] İngilizce
  - [x] Dil dosyaları yönetimi
- [x] Tema özelleştirme
  - [x] Renk şemaları
  - [x] Logo ve marka ayarları
  - [x] Özel CSS desteği

### Faz 4: Optimizasyon ve Test
- [x] Performans optimizasyonu
  - [x] Kod bölme (Code splitting) - React.lazy ve Suspense implementasyonu
  - [x] Lazy loading - LoadingSpinner bileşeni
  - [x] Önbellek stratejileri - CacheService implementasyonu
  - [x] API optimizasyonu - CRACO webpack yapılandırması
  - [x] Gzip sıkıştırma
  - [x] Bundle analizi
  - [x] Module concatenation
  - [x] Chunk optimizasyonu
- [x] Güvenlik testleri
  - [x] Güvenlik test planı
  - [x] Helmet middleware entegrasyonu
  - [x] Rate limiting
  - [x] CORS yapılandırması
  - [x] Error handling middleware
  - [x] Winston logger entegrasyonu
  - [x] Güvenlik başlıkları
  - [x] API koruması
- [x] Yük testleri
  - [x] k6 test senaryoları (auth ve orders)
  - [x] Docker Compose test ortamı
  - [x] InfluxDB metrik depolama
  - [x] Grafana dashboard'ları
  - [x] Kademeli kullanıcı artışı senaryoları
- [x] End-to-end testler
  - [x] Cypress test ortamı
  - [x] Auth akışları
  - [x] Sipariş yönetimi
  - [x] Rezervasyon sistemi
  - [x] Test komutları ve yardımcıları
  - [x] Test veri yönetimi
  - [x] CI/CD hazır test scriptleri
- [ ] Dokümantasyon
  - [x] API dokümantasyonu
  - [x] Kullanıcı kılavuzu
  - [x] Geliştirici kılavuzu
- [x] Deployment kılavuzu
  - [x] Kurulum adımları
  - [x] Yapılandırma
  - [x] Bakım ve güncelleme

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
- `