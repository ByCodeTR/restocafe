# RestoCafe Backend

RestoCafe uygulamasının backend (sunucu) tarafı. Node.js, Express.js ve MySQL teknolojilerini kullanır.

## Teknolojiler

- [ ] Node.js
- [ ] Express.js
- [ ] MySQL
- [ ] Sequelize ORM
- [ ] Socket.IO
- [ ] JWT Authentication
- [ ] Express Rate Limit
- [ ] CORS
- [ ] Helmet

## Kurulum

1. Gerekli bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun:
```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=restocafe

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

3. MySQL veritabanını oluşturun:
```sql
CREATE DATABASE restocafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Uygulamayı başlatın:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
- [ ] POST `/api/auth/register` - Yeni kullanıcı kaydı
- [ ] POST `/api/auth/login` - Kullanıcı girişi
- [ ] GET `/api/auth/me` - Mevcut kullanıcı bilgileri
- [ ] PUT `/api/auth/profile` - Profil güncelleme

### Tables
- [ ] GET `/api/tables` - Tüm masaları listele
- [ ] POST `/api/tables` - Yeni masa ekle
- [ ] GET `/api/tables/:id` - Masa detayı
- [ ] PUT `/api/tables/:id` - Masa güncelle
- [ ] DELETE `/api/tables/:id` - Masa sil
- [ ] PATCH `/api/tables/:id/status` - Masa durumu güncelle

### Categories
- [ ] GET `/api/categories` - Tüm kategorileri listele
- [ ] POST `/api/categories` - Yeni kategori ekle
- [ ] GET `/api/categories/:id` - Kategori detayı
- [ ] PUT `/api/categories/:id` - Kategori güncelle
- [ ] DELETE `/api/categories/:id` - Kategori sil

### Products
- [ ] GET `/api/products` - Tüm ürünleri listele
- [ ] POST `/api/products` - Yeni ürün ekle
- [ ] GET `/api/products/:id` - Ürün detayı
- [ ] PUT `/api/products/:id` - Ürün güncelle
- [ ] DELETE `/api/products/:id` - Ürün sil

### Orders
- [ ] GET `/api/orders` - Tüm siparişleri listele
- [ ] POST `/api/orders` - Yeni sipariş oluştur
- [ ] GET `/api/orders/:id` - Sipariş detayı
- [ ] PATCH `/api/orders/:id/status` - Sipariş durumu güncelle
- [ ] POST `/api/orders/:id/payment` - Sipariş ödemesi ekle

### Reservations
- [ ] GET `/api/reservations` - Tüm rezervasyonları listele
- [ ] POST `/api/reservations` - Yeni rezervasyon oluştur
- [ ] GET `/api/reservations/:id` - Rezervasyon detayı
- [ ] PUT `/api/reservations/:id` - Rezervasyon güncelle
- [ ] DELETE `/api/reservations/:id` - Rezervasyon sil
- [ ] PATCH `/api/reservations/:id/status` - Rezervasyon durumu güncelle

### Reports
- [ ] GET `/api/reports/daily` - Günlük rapor
- [ ] GET `/api/reports/monthly` - Aylık rapor
- [ ] GET `/api/reports/sales` - Satış raporu
- [ ] GET `/api/reports/products` - Ürün raporu
- [ ] GET `/api/reports/waiters` - Garson performans raporu

## Real-time Events (Socket.IO)

- [ ] `tableStatusChange` - Masa durumu değişikliği
- [ ] `newOrder` - Yeni sipariş
- [ ] `orderStatusChange` - Sipariş durumu değişikliği
- [ ] `newReservation` - Yeni rezervasyon
- [ ] `reservationStatusChange` - Rezervasyon durumu değişikliği

## Yapılacaklar

- [ ] Controller implementasyonları
- [ ] Validation middleware'leri
- [ ] JWT token işlemleri
- [ ] Dosya yükleme servisi
- [ ] Test dosyaları
- [ ] API dokümantasyonu 