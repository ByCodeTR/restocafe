# RestoCafe API Dokümantasyonu

## Genel Bilgiler

### Temel URL
```
http://localhost:5000/api
```

### Kimlik Doğrulama
API isteklerinde JWT token kullanılmaktadır. Token, `Authorization` başlığında `Bearer` şeması ile gönderilmelidir:

```
Authorization: Bearer <token>
```

### Hata Yanıtları
Tüm hata yanıtları aşağıdaki formatta döner:
```json
{
  "success": false,
  "error": {
    "message": "Hata mesajı"
  }
}
```

### Sayfalama
Listeleme endpoint'lerinde sayfalama desteklenmektedir:
```
?page=1&limit=10
```

## Auth API

### Kullanıcı Girişi
```http
POST /auth/login
```

**İstek Gövdesi:**
```json
{
  "email": "kullanici@ornek.com",
  "password": "sifre123"
}
```

**Başarılı Yanıt:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "kullanici@ornek.com",
    "role": "ADMIN"
  }
}
```

### Kullanıcı Kaydı (Admin)
```http
POST /auth/register
```

**İstek Gövdesi:**
```json
{
  "email": "yeni@ornek.com",
  "password": "sifre123",
  "role": "WAITER",
  "name": "Ahmet Yılmaz"
}
```

**Başarılı Yanıt:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "yeni@ornek.com",
    "role": "WAITER",
    "name": "Ahmet Yılmaz"
  }
}
```

### Mevcut Kullanıcı Bilgileri
```http
GET /auth/me
```

**Başarılı Yanıt:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "kullanici@ornek.com",
    "role": "ADMIN",
    "name": "Ahmet Yılmaz"
  }
}
```

## Masa API

### Masa Listesi
```http
GET /tables
```

**Sorgu Parametreleri:**
- `status`: Masa durumu filtresi (EMPTY, OCCUPIED, RESERVED)
- `waiterId`: Garson ID'sine göre filtreleme

**Başarılı Yanıt:**
```json
{
  "success": true,
  "tables": [
    {
      "id": "table_id",
      "number": "1",
      "capacity": 4,
      "status": "EMPTY",
      "waiter": {
        "id": "waiter_id",
        "name": "Mehmet"
      }
    }
  ]
}
```

### Masa Detayı
```http
GET /tables/:id
```

**Başarılı Yanıt:**
```json
{
  "success": true,
  "table": {
    "id": "table_id",
    "number": "1",
    "capacity": 4,
    "status": "EMPTY",
    "waiter": {
      "id": "waiter_id",
      "name": "Mehmet"
    },
    "currentOrder": null,
    "qrCode": "base64_encoded_qr"
  }
}
```

### Yeni Masa Oluşturma (Admin)
```http
POST /tables
```

**İstek Gövdesi:**
```json
{
  "number": "1",
  "capacity": 4
}
```

### Masa Güncelleme (Admin)
```http
PUT /tables/:id
```

**İstek Gövdesi:**
```json
{
  "number": "1",
  "capacity": 6
}
```

### Masa Durumu Güncelleme
```http
PATCH /tables/:id/status
```

**İstek Gövdesi:**
```json
{
  "status": "OCCUPIED"
}
```

### Masaya Garson Atama
```http
PATCH /tables/:id/assign
```

**İstek Gövdesi:**
```json
{
  "waiterId": "waiter_id"
}
```

## Sipariş API

### Sipariş Listesi
```http
GET /orders
```

**Sorgu Parametreleri:**
- `status`: Sipariş durumu (PENDING, PREPARING, READY, DELIVERED, PAID)
- `tableId`: Masa ID'si
- `startDate`: Başlangıç tarihi
- `endDate`: Bitiş tarihi

**Başarılı Yanıt:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_id",
      "table": {
        "id": "table_id",
        "number": "1"
      },
      "items": [
        {
          "product": {
            "id": "product_id",
            "name": "Köfte",
            "price": 75.00
          },
          "quantity": 2,
          "status": "PENDING",
          "notes": "Az pişmiş"
        }
      ],
      "status": "PENDING",
      "total": 150.00,
      "createdAt": "2024-03-20T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

### Yeni Sipariş Oluşturma
```http
POST /orders
```

**İstek Gövdesi:**
```json
{
  "tableId": "table_id",
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "notes": "Az pişmiş"
    }
  ]
}
```

### Sipariş Durumu Güncelleme
```http
PATCH /orders/:id/items/:itemId/status
```

**İstek Gövdesi:**
```json
{
  "status": "PREPARING"
}
```

### Siparişe Ödeme Ekleme
```http
POST /orders/:id/payments
```

**İstek Gövdesi:**
```json
{
  "amount": 150.00,
  "method": "CASH",
  "notes": "Bahşiş: 15 TL"
}
```

## Rezervasyon API

### Rezervasyon Listesi
```http
GET /reservations
```

**Sorgu Parametreleri:**
- `status`: Rezervasyon durumu (PENDING, CONFIRMED, CANCELLED)
- `date`: Tarih filtresi
- `tableId`: Masa ID'si

**Başarılı Yanıt:**
```json
{
  "success": true,
  "reservations": [
    {
      "id": "reservation_id",
      "customerName": "Ali Yılmaz",
      "customerPhone": "5551234567",
      "customerEmail": "ali@ornek.com",
      "date": "2024-03-21",
      "time": "19:00",
      "guestCount": 4,
      "table": {
        "id": "table_id",
        "number": "1"
      },
      "status": "CONFIRMED",
      "notes": "Doğum günü kutlaması"
    }
  ]
}
```

### Yeni Rezervasyon
```http
POST /reservations
```

**İstek Gövdesi:**
```json
{
  "customerName": "Ali Yılmaz",
  "customerPhone": "5551234567",
  "customerEmail": "ali@ornek.com",
  "date": "2024-03-21",
  "time": "19:00",
  "guestCount": 4,
  "tableId": "table_id",
  "notes": "Doğum günü kutlaması"
}
```

### Rezervasyon İptali
```http
PATCH /reservations/:id/cancel
```

**İstek Gövdesi:**
```json
{
  "reason": "Müşteri talebi"
}
```

## Socket.IO Olayları

### Sunucu Olayları (Emit)

#### Sipariş Olayları
- `newOrder`: Yeni sipariş oluşturulduğunda
- `orderStatusUpdate`: Sipariş durumu güncellendiğinde
- `orderItemStatusUpdate`: Sipariş kalemi durumu güncellendiğinde
- `orderPayment`: Siparişe ödeme eklendiğinde

#### Masa Olayları
- `tableStatusUpdate`: Masa durumu güncellendiğinde
- `tableAssigned`: Masaya garson atandığında

#### Rezervasyon Olayları
- `newReservation`: Yeni rezervasyon oluşturulduğunda
- `reservationStatusUpdate`: Rezervasyon durumu güncellendiğinde

### İstemci Olayları (Listen)

#### Bağlantı
- `connect`: Bağlantı kurulduğunda
- `disconnect`: Bağlantı koptuğunda

#### Rol Bazlı Olaylar
- `joinRole`: Rol bazlı odalara katılım
  ```json
  {
    "role": "WAITER"
  }
  ```
- `leaveRole`: Rol bazlı odalardan çıkış 