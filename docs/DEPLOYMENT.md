# RestoCafe Deployment Kılavuzu

## İçindekiler
1. [Sistem Gereksinimleri](#sistem-gereksinimleri)
2. [Kurulum Adımları](#kurulum-adımları)
3. [Yapılandırma](#yapılandırma)
4. [Bakım ve Güncelleme](#bakım-ve-güncelleme)
5. [Yedekleme ve Kurtarma](#yedekleme-ve-kurtarma)

## Sistem Gereksinimleri

### Minimum Donanım Gereksinimleri
- CPU: 2 çekirdek
- RAM: 4GB
- Disk: 20GB SSD
- Ağ: 100Mbps

### Yazılım Gereksinimleri
- Ubuntu Server 22.04 LTS
- Node.js 18.x
- MongoDB 6.x
- Nginx
- PM2
- Docker (opsiyonel)
- Docker Compose (opsiyonel)

## Kurulum Adımları

### 1. Sistem Hazırlığı

```bash
# Sistem güncellemesi
sudo apt update
sudo apt upgrade -y

# Gerekli paketlerin kurulumu
sudo apt install -y curl git build-essential nginx

# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# MongoDB kurulumu
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod

# PM2 kurulumu
sudo npm install -g pm2
```

### 2. Uygulama Kurulumu

```bash
# Uygulama dizini oluşturma
sudo mkdir -p /var/www/restocafe
sudo chown -R $USER:$USER /var/www/restocafe

# Kaynak kodun indirilmesi
cd /var/www/restocafe
git clone https://github.com/username/restocafe.git .

# Backend kurulumu
cd backend
npm install --production
cp .env.example .env
# .env dosyasını düzenleyin

# Frontend kurulumu
cd ../frontend
npm install --production
npm run build
cp .env.example .env
# .env dosyasını düzenleyin
```

### 3. Nginx Yapılandırması

```nginx
# /etc/nginx/sites-available/restocafe.conf

server {
    listen 80;
    server_name restocafe.com www.restocafe.com;

    # Frontend
    location / {
        root /var/www/restocafe/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Nginx yapılandırmasını etkinleştirme
sudo ln -s /etc/nginx/sites-available/restocafe.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kurulumu
sudo apt install -y certbot python3-certbot-nginx

# SSL sertifikası alma
sudo certbot --nginx -d restocafe.com -d www.restocafe.com
```

### 5. PM2 ile Uygulama Başlatma

```bash
# Backend için PM2 yapılandırması
cd /var/www/restocafe/backend
pm2 start npm --name "restocafe-backend" -- start

# PM2 otomatik başlatma
pm2 startup
pm2 save
```

## Yapılandırma

### Ortam Değişkenleri

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restocafe
JWT_SECRET=güvenli_bir_token_buraya
JWT_EXPIRE=30d
CORS_ORIGIN=https://restocafe.com
```

#### Frontend (.env)
```env
REACT_APP_API_URL=https://restocafe.com/api
REACT_APP_SOCKET_URL=https://restocafe.com
```

### MongoDB Güvenlik Yapılandırması

```bash
# MongoDB için kullanıcı oluşturma
mongosh

use admin
db.createUser({
  user: "admin",
  pwd: "güvenli_şifre",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

use restocafe
db.createUser({
  user: "restocafe_user",
  pwd: "güvenli_şifre",
  roles: [ { role: "readWrite", db: "restocafe" } ]
})
```

### Güvenlik Duvarı Yapılandırması

```bash
# UFW kurulumu ve yapılandırması
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

## Bakım ve Güncelleme

### Günlük Bakım Kontrolleri

1. Sistem durumu kontrolü:
```bash
# Disk kullanımı
df -h

# Bellek kullanımı
free -h

# Sistem yükü
top

# Servis durumları
systemctl status nginx
systemctl status mongod
pm2 status
```

2. Log kontrolü:
```bash
# Nginx logları
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Uygulama logları
pm2 logs
```

### Güncelleme Prosedürü

1. Yedekleme:
```bash
# MongoDB yedekleme
mongodump --db restocafe --out /backup/$(date +%Y%m%d)

# Uygulama dosyaları yedekleme
tar -czf /backup/restocafe_$(date +%Y%m%d).tar.gz /var/www/restocafe
```

2. Kod güncelleme:
```bash
cd /var/www/restocafe

# Değişiklikleri çek
git pull origin main

# Backend güncelleme
cd backend
npm install --production
pm2 restart restocafe-backend

# Frontend güncelleme
cd ../frontend
npm install --production
npm run build
```

## Yedekleme ve Kurtarma

### Otomatik Yedekleme Scripti

```bash
#!/bin/bash
# /usr/local/bin/backup_restocafe.sh

BACKUP_DIR="/backup/restocafe"
DATE=$(date +%Y%m%d)
RETENTION_DAYS=7

# Yedekleme dizini oluştur
mkdir -p $BACKUP_DIR

# MongoDB yedekleme
mongodump --db restocafe --out $BACKUP_DIR/$DATE

# Uygulama dosyaları yedekleme
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/restocafe

# Eski yedekleri temizle
find $BACKUP_DIR -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \;
find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -exec rm -f {} \;
```

```bash
# Scripti çalıştırılabilir yap
sudo chmod +x /usr/local/bin/backup_restocafe.sh

# Cron görevi ekle
echo "0 2 * * * /usr/local/bin/backup_restocafe.sh" | sudo tee -a /etc/crontab
```

### Yedekten Geri Yükleme

1. MongoDB geri yükleme:
```bash
# Veritabanını geri yükle
mongorestore --db restocafe /backup/20240320/restocafe
```

2. Uygulama dosyalarını geri yükleme:
```bash
# Mevcut dosyaları yedekle
mv /var/www/restocafe /var/www/restocafe_old

# Yedekten geri yükle
tar -xzf /backup/app_20240320.tar.gz -C /var/www/

# Servisleri yeniden başlat
pm2 restart restocafe-backend
sudo systemctl restart nginx
```

## Sorun Giderme

### Yaygın Sorunlar ve Çözümleri

1. Bağlantı Hataları:
```bash
# Nginx durumu
sudo nginx -t
sudo systemctl status nginx

# Backend durumu
pm2 logs restocafe-backend
```

2. Veritabanı Sorunları:
```bash
# MongoDB durumu
sudo systemctl status mongod
tail -f /var/log/mongodb/mongod.log
```

3. SSL Sertifika Sorunları:
```bash
# Sertifika yenileme
sudo certbot renew --dry-run
sudo certbot renew
```

### Performans İyileştirme

1. Nginx önbellek yapılandırması:
```nginx
# /etc/nginx/sites-available/restocafe.conf

location /static {
    expires 30d;
    add_header Cache-Control "public, no-transform";
}

location /api {
    proxy_cache my_cache;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    proxy_cache_valid 200 60m;
}
```

2. MongoDB indeks optimizasyonu:
```javascript
// Sık kullanılan sorgular için indeksler
db.orders.createIndex({ "createdAt": 1 });
db.orders.createIndex({ "status": 1 });
db.products.createIndex({ "category": 1 });
```

## Güvenlik Kontrolleri

### Güvenlik Taraması

1. SSL yapılandırması kontrolü:
```bash
# SSL Labs test
curl https://ssllabs.com/ssltest/analyze.html?d=restocafe.com
```

2. Güvenlik başlıkları kontrolü:
```bash
# Security Headers test
curl -I https://restocafe.com
```

### Güvenlik İzleme

1. Fail2ban kurulumu:
```bash
sudo apt install -y fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

2. Log izleme:
```bash
# Şüpheli aktivite kontrolü
tail -f /var/log/auth.log
tail -f /var/log/nginx/access.log | grep 404
``` 