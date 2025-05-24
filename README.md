# RestoCafe - Restoran Yönetim Sistemi

RestoCafe, modern restoranlar için geliştirilmiş kapsamlı bir adisyon ve sipariş takip sistemidir. QR kod entegrasyonu, gerçek zamanlı sipariş takibi ve detaylı raporlama özellikleri ile restoran operasyonlarını dijitalleştirmeyi amaçlar.

## Özellikler

### Temel Özellikler
- [ ] JWT tabanlı kullanıcı yetkilendirme sistemi
- [ ] Rol bazlı erişim kontrolü (Admin, Garson, Mutfak, Kasiyer)
- [ ] QR kodlu masa yönetim sistemi
- [ ] Gerçek zamanlı masa durumu takibi
- [ ] Kategori ve ürün yönetimi
  - [ ] Hiyerarşik kategori yapısı
  - [ ] Ürün varyasyonları
  - [ ] Stok takibi
  - [ ] Fiyat geçmişi
- [ ] Sipariş sistemi
  - [ ] Sipariş oluşturma
  - [ ] Sipariş düzenleme
  - [ ] Sipariş takibi
  - [ ] Ödeme sistemi entegrasyonu
  - [ ] Stok yönetimi entegrasyonu
- [ ] Gerçek zamanlı bildirim sistemi
  - [ ] Socket.IO entegrasyonu
  - [ ] Rol bazlı bildirimler
  - [ ] Sipariş durumu bildirimleri
  - [ ] Stok uyarıları
  - [ ] Masa durumu güncellemeleri
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

### Faz 1: Temel Altyapı
- [ ] Proje yapısı ve klasör organizasyonu
- [ ] Veritabanı modelleri (User, Table, Product, Order)
- [ ] Socket.io entegrasyonu
- [ ] JWT tabanlı auth sistemi
- [ ] Login sayfası
- [ ] Protected Route bileşeni
- [ ] Masa yönetim sistemi
  - [ ] Masa CRUD işlemleri
  - [ ] QR kod entegrasyonu
  - [ ] Gerçek zamanlı masa durumu takibi
  - [ ] Garson atama sistemi

### Faz 2: Temel Özellikler (Devam Ediyor)
- [ ] Ürün yönetim sistemi
  - [ ] Kategori CRUD işlemleri
  - [ ] Ürün CRUD işlemleri
  - [ ] Fiyat ve stok yönetimi
  - [ ] Varyasyon sistemi
  - [ ] Besin değerleri ve alerjen takibi
- [ ] Sipariş sistemi
  - [ ] Sipariş oluşturma
  - [ ] Sipariş düzenleme
  - [ ] Sipariş takibi
  - [ ] Ödeme sistemi entegrasyonu
  - [ ] Stok yönetimi entegrasyonu
- [ ] Gerçek zamanlı iletişim
  - [ ] Socket.IO backend servisi
  - [ ] Socket.IO frontend entegrasyonu
  - [ ] Bildirim sistemi
  - [ ] Olay (event) yönetimi
- [ ] Mutfak ekranı
  - [ ] Sipariş listesi
  - [ ] Sipariş detayları
  - [ ] Durum güncelleme
  - [ ] Bildirimler
- [ ] Garson ekranı
  - [ ] Sipariş yönetimi
  - [ ] Masa takibi
  - [ ] Bildirimler
- [ ] Rezervasyon sistemi (Frontend)
  - [ ] Takvim görünümü
  - [ ] Liste görünümü
  - [ ] Rezervasyon oluşturma formu
  - [ ] Müsait masa kontrolü
  - [ ] Rezervasyon durumu takibi
  - [ ] Gerçek zamanlı güncellemeler

### Faz 3: Gelişmiş Özellikler (Devam Ediyor)
- [ ] Rezervasyon sistemi (Backend)
  - [ ] Rezervasyon modeli
  - [ ] API endpoint'leri
  - [ ] Müsait masa kontrolü algoritması
  - [ ] Socket.IO event'leri
  - [ ] E-posta bildirimleri
- [ ] Müşteri yönetimi
  - [ ] Müşteri profilleri
  - [ ] Rezervasyon geçmişi
  - [ ] Sipariş geçmişi
  - [ ] Sadakat programı
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
  - [ ] Kod bölme (Code splitting) - React.lazy ve Suspense implementasyonu
  - [ ] Lazy loading - LoadingSpinner bileşeni
  - [ ] Önbellek stratejileri - CacheService implementasyonu
  - [ ] API optimizasyonu - CRACO webpack yapılandırması
  - [ ] Gzip sıkıştırma
  - [ ] Bundle analizi
  - [ ] Module concatenation
  - [ ] Chunk optimizasyonu
- [ ] Güvenlik testleri
  - [ ] Güvenlik test planı
  - [ ] Helmet middleware entegrasyonu
  - [ ] Rate limiting
  - [ ] CORS yapılandırması
  - [ ] Error handling middleware
  - [ ] Winston logger entegrasyonu
  - [ ] Güvenlik başlıkları
  - [ ] API koruması
- [ ] Yük testleri
  - [ ] k6 test senaryoları (auth ve orders)
  - [ ] Docker Compose test ortamı
  - [ ] InfluxDB metrik depolama
  - [ ] Grafana dashboard'ları
  - [ ] Kademeli kullanıcı artışı senaryoları
- [ ] End-to-end testler
  - [ ] Cypress test ortamı
  - [ ] Auth akışları
  - [ ] Sipariş yönetimi
  - [ ] Rezervasyon sistemi
  - [ ] Test komutları ve yardımcıları
  - [ ] Test veri yönetimi
  - [ ] CI/CD hazır test scriptleri
- [ ] Dokümantasyon
  - [ ] API dokümantasyonu
  - [ ] Kullanıcı kılavuzu
  - [ ] Geliştirici kılavuzu
- [ ] Deployment kılavuzu
  - [ ] Kurulum adımları
  - [ ] Yapılandırma
  - [ ] Bakım ve güncelleme

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