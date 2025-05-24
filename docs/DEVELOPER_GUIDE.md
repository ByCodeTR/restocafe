# RestoCafe Geliştirici Kılavuzu

## İçindekiler
1. [Geliştirme Ortamı Kurulumu](#geliştirme-ortamı-kurulumu)
2. [Proje Yapısı](#proje-yapısı)
3. [Geliştirme Standartları](#geliştirme-standartları)
4. [Test Yazımı](#test-yazımı)
5. [CI/CD Pipeline](#cicd-pipeline)

## Geliştirme Ortamı Kurulumu

### Gereksinimler
- Node.js (v18 veya üzeri)
- MongoDB (v6 veya üzeri)
- Git
- VS Code (önerilen IDE)
- Docker (opsiyonel)

### Önerilen VS Code Eklentileri
- ESLint
- Prettier
- GitLens
- MongoDB for VS Code
- Docker
- Jest Runner
- Tailwind CSS IntelliSense

### Yerel Geliştirme Ortamı Kurulumu

1. Depoyu klonlayın:
```bash
git clone https://github.com/username/restocafe.git
cd restocafe
```

2. Backend kurulumu:
```bash
cd backend
npm install
cp .env.example .env
```

3. Frontend kurulumu:
```bash
cd frontend
npm install
cp .env.example .env
```

4. MongoDB kurulumu:
```bash
# Docker ile
docker run --name mongodb -d -p 27017:27017 mongo:latest

# Yerel kurulum için MongoDB websitesinden indirin
```

### Ortam Değişkenleri

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restocafe
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Proje Yapısı

### Backend Yapısı
```
backend/
├── src/
│   ├── config/         # Yapılandırma dosyaları
│   ├── controllers/    # İş mantığı kontrolcüleri
│   ├── middleware/     # Express middleware'leri
│   ├── models/         # Mongoose modelleri
│   ├── routes/         # API route tanımları
│   ├── services/       # İş mantığı servisleri
│   ├── utils/          # Yardımcı fonksiyonlar
│   └── app.js          # Express uygulaması
├── tests/              # Test dosyaları
└── package.json
```

### Frontend Yapısı
```
frontend/
├── public/            # Statik dosyalar
├── src/
│   ├── components/    # React bileşenleri
│   ├── contexts/      # React context'leri
│   ├── hooks/         # Özel React hook'ları
│   ├── pages/         # Sayfa bileşenleri
│   ├── services/      # API servisleri
│   ├── store/         # Redux store
│   ├── styles/        # CSS/SCSS dosyaları
│   └── utils/         # Yardımcı fonksiyonlar
└── package.json
```

## Geliştirme Standartları

### Kod Formatı
- ESLint ve Prettier kullanımı zorunludur
- Her dosya sonunda yeni satır bırakılmalıdır
- Maksimum satır uzunluğu: 100 karakter
- Girintileme: 2 boşluk

### Git Akışı
1. Feature branch oluşturma:
```bash
git checkout -b feature/özellik-adı
```

2. Commit mesajları:
```
feat: Yeni özellik eklendi
fix: Hata düzeltmesi
docs: Dokümantasyon güncellendi
style: Kod formatı düzeltmesi
refactor: Kod iyileştirmesi
test: Test eklendi/güncellendi
chore: Yapılandırma değişikliği
```

3. Pull Request açma:
- PR başlığı açıklayıcı olmalı
- Değişiklikleri açıklayan detaylı açıklama
- İlgili issue numarası
- Test sonuçları

### Kod İnceleme Süreci
1. PR açıldığında otomatik testler çalışır
2. En az bir onay gereklidir
3. Çakışmalar çözülmelidir
4. CI/CD kontrolleri başarılı olmalıdır

## Test Yazımı

### Backend Testleri

#### Unit Testler
```javascript
describe('Auth Service', () => {
  it('should create JWT token', () => {
    // Test kodu
  });
});
```

#### Integration Testler
```javascript
describe('Auth API', () => {
  it('should login user', async () => {
    // Test kodu
  });
});
```

### Frontend Testleri

#### Component Testleri
```javascript
describe('Login Component', () => {
  it('should render login form', () => {
    // Test kodu
  });
});
```

#### E2E Testleri
```javascript
describe('Login Flow', () => {
  it('should login successfully', () => {
    // Test kodu
  });
});
```

## CI/CD Pipeline

### GitHub Actions Yapılandırması
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Deployment adımları
```

### Kalite Kontrolleri
- SonarQube kod analizi
- Test coverage kontrolü (minimum %80)
- Güvenlik taraması
- Performans testleri

## Hata Ayıklama

### Backend Hata Ayıklama
1. Debug modunu etkinleştirin:
```bash
DEBUG=app:* npm run dev
```

2. Winston logger kullanımı:
```javascript
logger.info('İşlem başarılı', { data });
logger.error('Hata oluştu', { error });
```

### Frontend Hata Ayıklama
1. React Developer Tools kullanımı
2. Redux DevTools kullanımı
3. Performance profiling
4. Network analizi

## Performans Optimizasyonu

### Backend Optimizasyonu
- MongoDB indeksleri
- Query optimizasyonu
- Caching stratejileri
- Rate limiting

### Frontend Optimizasyonu
- Code splitting
- Lazy loading
- Bundle analizi
- Image optimizasyonu

## Güvenlik Kontrolleri

### Backend Güvenlik
- JWT doğrulama
- Rate limiting
- CORS yapılandırması
- Input validasyonu
- XSS koruması
- CSRF koruması

### Frontend Güvenlik
- HTTPS zorunluluğu
- Token yönetimi
- Form validasyonu
- Güvenli depolama
- API güvenliği

## Yardımcı Kaynaklar

### Dokümantasyon
- API dokümantasyonu
- Komponent kütüphanesi
- Akış şemaları
- Veritabanı şeması

### Araçlar
- Postman koleksiyonları
- VS Code snippets
- Git hooks
- Deployment scriptleri 