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
- [x] Mutfak ekranı
  - [x] Aktif siparişleri görüntüleme
  - [x] Sipariş durumu güncelleme
  - [x] Bildirim sistemi
- [x] Garson ekranı
  - [x] Masa bazlı sipariş yönetimi
  - [x] Sipariş oluşturma arayüzü
  - [x] Ödeme alma

### Gelişmiş Özellikler
- [x] Rezervasyon sistemi
- [x] Müşteri sadakat programı
- [x] Stok takibi
- [x] Raporlama ve analiz
- [ ] Mobil uygulama
- [ ] Çoklu şube desteği

## Teknolojiler

### Backend
- [x] Node.js
- [x] Express.js
- [x] MongoDB
- [x] Socket.IO
- [x] JWT Authentication

### Frontend
- [x] React.js
- [x] Redux
- [x] TailwindCSS
- [x] Socket.IO Client

## Geliştirme Fazları

### Faz 1: Temel Altyapı
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

### Faz 2: Temel Özellikler
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

### Faz 3: Gelişmiş Özellikler
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
- [ ] Performans optimizasyonu
  - [ ] Kod bölme (Code splitting)
  - [ ] Lazy loading
  - [ ] Önbellek stratejileri
  - [ ] API optimizasyonu
  - [ ] Bundle analizi
  - [ ] Module concatenation
  - [ ] Chunk optimizasyonu
- [ ] Güvenlik testleri
  - [ ] Güvenlik test planı
  - [ ] Helmet middleware
  - [ ] Rate limiting
  - [ ] CORS yapılandırması
  - [ ] Error handling
  - [ ] Winston logger
  - [ ] Güvenlik başlıkları
  - [ ] API koruması
- [ ] Yük testleri
  - [ ] k6 test senaryoları
  - [ ] Docker Compose test ortamı
  - [ ] InfluxDB metrik depolama
  - [ ] Grafana dashboard'ları
  - [ ] Kademeli kullanıcı artışı senaryoları
- [ ] End-to-end testler
  - [ ] Cypress test ortamı
  - [ ] Auth akışları
  - [ ] Sipariş yönetimi
  - [ ] Rezervasyon sistemi
  - [ ] Test komutları
  - [ ] Test veri yönetimi
  - [ ] CI/CD test scriptleri
- [ ] Dokümantasyon
  - [ ] Kullanıcı kılavuzu
  - [ ] Geliştirici kılavuzu
  - [ ] Deployment kılavuzu
  - [ ] Kurulum adımları
  - [ ] Yapılandırma
  - [x] API dokümantasyonu
    - [x] Auth Endpoints
      - [x] POST /api/auth/register - Yeni kullanıcı kaydı (Admin)
      - [x] POST /api/auth/login - Kullanıcı girişi
      - [x] GET /api/auth/me - Mevcut kullanıcı bilgileri
      - [x] PUT /api/auth/profile - Profil güncelleme
    - [x] Masa Endpoints
      - [x] GET /api/tables - Tüm masaları listele
      - [x] GET /api/tables/:id - Masa detayı
      - [x] POST /api/tables - Yeni masa oluştur (Admin)
      - [x] PUT /api/tables/:id - Masa güncelle (Admin)
      - [x] DELETE /api/tables/:id - Masa sil (Admin)
      - [x] PATCH /api/tables/:id/status - Masa durumu güncelle
      - [x] PATCH /api/tables/:id/assign - Masaya garson ata
    - [x] Kategori Endpoints
      - [x] GET /api/categories - Tüm kategorileri listele
      - [x] GET /api/categories?tree=true - Kategori ağacını getir
      - [x] GET /api/categories/:id - Kategori detayı
      - [x] POST /api/categories - Yeni kategori oluştur (Admin)
      - [x] PUT /api/categories/:id - Kategori güncelle (Admin)
      - [x] DELETE /api/categories/:id - Kategori sil (Admin)
      - [x] PATCH /api/categories/reorder - Kategorileri yeniden sırala (Admin)
    - [x] Ürün Endpoints
      - [x] GET /api/products - Tüm ürünleri listele (Filtreleme & Sayfalama)
      - [x] GET /api/products/low-stock - Düşük stoklu ürünleri listele
      - [x] GET /api/products/:id - Ürün detayı
      - [x] POST /api/products - Yeni ürün oluştur (Admin)
      - [x] PUT /api/products/:id - Ürün güncelle (Admin)
      - [x] DELETE /api/products/:id - Ürün sil (Admin)
      - [x] PATCH /api/products/:id/stock - Ürün stok güncelle
    - [x] Sipariş Endpoints
      - [x] GET /api/orders - Tüm siparişleri listele (Filtreleme & Sayfalama)
      - [x] GET /api/orders/summary/daily - Günlük sipariş özeti (Admin & Yönetici)
      - [x] GET /api/orders/:id - Sipariş detayı
      - [x] POST /api/orders - Yeni sipariş oluştur (Garson & Admin)
      - [x] PATCH /api/orders/:id/items/:itemId/status - Sipariş kalemi durumunu güncelle
      - [x] POST /api/orders/:id/payments - Siparişe ödeme ekle
      - [x] PATCH /api/orders/:id/cancel - Sipariş iptal et
    - [x] Rezervasyon Endpoints
      - [x] GET /api/reservations - Rezervasyonları listele (Filtreleme & Sayfalama)
      - [x] GET /api/reservations/:id - Rezervasyon detayı
      - [x] POST /api/reservations - Yeni rezervasyon oluştur
      - [x] PATCH /api/reservations/:id - Rezervasyon güncelle
      - [x] PATCH /api/reservations/:id/cancel - Rezervasyon iptal et
      - [x] GET /api/tables/available - Müsait masaları kontrol et
    - [x] Socket.IO Events
      - [x] newOrder - Yeni sipariş bildirimi
      - [x] orderStatusUpdate - Sipariş durumu güncelleme