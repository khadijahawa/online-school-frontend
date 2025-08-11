# 🎓 Çevrimiçi Okul Yönetim Platformu

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir okul yönetim sistemidir. Next.js, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler

#### 🔐 Kimlik Doğrulama ve Yetkilendirme

- **Admin ve Öğretmen** rolleri için ayrı giriş sistemi
- JWT token tabanlı kimlik doğrulama
- Role-based access control (RBAC)
- Güvenli route koruması

#### 📚 Kurs Yönetimi

- **API Entegrasyonu**: Kurs listeleme, detay görüntüleme
- **Kurs Oluşturma**: Yeni kurs ekleme (POST `/admin/courses`)
- **Kurs Durumları**: Aktif, tamamlanmış, iptal edilmiş
- **Öğretmen Atama**: Kurslara öğretmen atama
- **Ders Sayısı**: Her kurs için toplam ders sayısı

#### 👨‍🏫 Öğretmen Yönetimi

- **API Entegrasyonu**: Öğretmen listeleme, detay görüntüleme
- **Öğretmen Ekleme**: Yeni öğretmen ekleme (POST `/admin/teachers`)
- **Öğretmen Silme**: Öğretmen hesabı silme
- **Kurs Atama**: Öğretmenlere kurs atama

#### 👨‍🎓 Öğrenci Yönetimi

- **API Entegrasyonu**: Öğrenci listeleme, detay görüntüleme
- **Öğrenci Ekleme**: Yeni öğrenci ekleme (POST `/students`)
- **Öğrenci Silme**: Öğrenci kaydı silme
- **Öğrenci Filtreleme**: Yeni/Mevcut öğrenci filtreleme
- **Öğrenci Kursları**: Öğrencinin kayıtlı olduğu kursları görüntüleme

#### 📝 Ders (Session) Yönetimi

- **API Entegrasyonu**: Ders listeleme, detay görüntüleme
- **Ders Durumları**: Tamamlanmış, iptal edilmiş, planlanmış
- **Ders Tamamlama**: Dersleri tamamlandı olarak işaretleme
- **Ders İptal**: Dersleri iptal etme

### 🔄 Devam Eden Geliştirmeler

#### 💰 Ödeme Sistemi

- **Öğrenci Ödemeleri**: Kurs ücretleri ve ödeme durumları
- **Öğretmen Ödemeleri**: Öğretmen maaş ödemeleri
- **Ödeme Takibi**: Ödeme geçmişi ve raporlama

#### 🔗 Öğrenci-Kurs Kayıt Sistemi

- **Kurs Kayıt**: Öğrencileri kurslara kaydetme
- **Kayıt Durumu**: Aktif/pasif kayıt yönetimi
- **Katılım Takibi**: Ders katılım durumları

#### 📊 Detaylı Raporlama

- **Kurs İstatistikleri**: Öğrenci sayısı, tamamlanan dersler
- **Öğretmen Performansı**: Verilen ders sayısı, öğrenci memnuniyeti
- **Finansal Raporlar**: Gelir-gider analizi

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Authentication**: JWT tokens
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router

## 📁 Proje Yapısı

```
school/
├── app/                          # Next.js App Router
│   ├── admin/                   # Admin paneli sayfaları
│   │   ├── dashboard/          # Admin ana sayfa
│   │   ├── courses/            # Kurs yönetimi
│   │   ├── teachers/           # Öğretmen yönetimi
│   │   ├── students/           # Öğrenci yönetimi
│   │   └── payments/           # Ödeme yönetimi
│   ├── teacher/                # Öğretmen paneli sayfaları
│   │   ├── dashboard/          # Öğretmen ana sayfa
│   │   ├── courses/            # Öğretmen kursları
│   │   └── sessions/           # Ders yönetimi
│   ├── layout.tsx              # Ana layout
│   └── page.tsx                # Ana sayfa
├── components/                  # Yeniden kullanılabilir bileşenler
│   ├── AuthGuard.tsx           # Route koruma bileşeni
│   ├── DashboardLayout.tsx     # Dashboard layout
│   └── Sidebar.tsx             # Yan menü
├── lib/                        # Yardımcı kütüphaneler
│   ├── services/               # API servisleri
│   │   ├── courseService.ts    # Kurs API işlemleri
│   │   ├── sessionService.ts   # Ders API işlemleri
│   │   ├── studentService.ts   # Öğrenci API işlemleri
│   │   └── teacherService.ts   # Öğretmen API işlemleri
│   ├── auth.ts                 # Kimlik doğrulama servisi
│   ├── axiosClient.ts          # HTTP client konfigürasyonu
│   ├── jwt.ts                  # JWT yardımcı fonksiyonları
│   └── types.ts                # TypeScript tip tanımları
└── public/                     # Statik dosyalar
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18+
- npm veya yarn

### Kurulum Adımları

1. **Projeyi klonlayın**

```bash
git clone <repository-url>
cd school
```

2. **Bağımlılıkları yükleyin**

```bash
npm install
```

3. **Geliştirme sunucusunu başlatın**

```bash
npm run dev
```

4. **Tarayıcıda açın**

```
http://localhost:3000
```

## 🔌 API Entegrasyonu

### Base URL

```
https://online-school-backend-gumy.onrender.com
```

### Endpoint'ler

#### 📚 Kurslar

- `GET /courses` - Tüm kursları listele
- `GET /courses/:id` - Belirli kursu getir
- `POST /admin/courses` - Yeni kurs oluştur

#### 👨‍🏫 Öğretmenler

- `GET /admin/teachers` - Tüm öğretmenleri listele
- `POST /admin/teachers` - Yeni öğretmen ekle
- `DELETE /admin/teachers/:id` - Öğretmen sil

#### 👨‍🎓 Öğrenciler

- `GET /students` - Tüm öğrencileri listele
- `GET /students/:id` - Belirli öğrenciyi getir
- `POST /students` - Yeni öğrenci ekle
- `PATCH /students/:id` - Öğrenci bilgilerini güncelle
- `DELETE /students/:id` - Öğrenci sil
- `GET /students/:id/courses` - Öğrencinin kurslarını getir

#### 📝 Dersler (Sessions)

- `PATCH /sessions/:id` - Ders durumunu güncelle
- `POST /sessions` - Yeni ders oluştur

## 🔐 Kimlik Doğrulama

### Admin Girişi

- **Email**: admin@school.com
- **Şifre**: admin123

### Öğretmen Girişi

- **Email**: mehmet@okul.com
- **Şifre**: mehmet123

## 📱 Kullanım Senaryoları

### 👨‍💼 Admin Kullanıcısı

1. **Dashboard**: Sistem genel durumunu görüntüleme
2. **Kurs Yönetimi**: Kurs ekleme, düzenleme, silme
3. **Öğretmen Yönetimi**: Öğretmen ekleme, atama, silme
4. **Öğrenci Yönetimi**: Öğrenci kayıt, bilgi güncelleme
5. **Ödeme Takibi**: Ödeme durumları ve raporlama

### 👨‍🏫 Öğretmen Kullanıcısı

1. **Dashboard**: Kendi kursları ve istatistikleri
2. **Kurs Yönetimi**: Atanan kursları görüntüleme
3. **Ders Yönetimi**: Ders planlama, tamamlama, iptal
4. **Öğrenci Takibi**: Kurs öğrencilerini görüntüleme

## 🔧 Geliştirme

### Yeni Özellik Ekleme

1. **API Service**: `lib/services/` altında yeni servis oluştur
2. **Types**: `lib/types.ts` altında tip tanımları ekle
3. **Component**: Gerekli UI bileşenlerini oluştur
4. **Page**: Sayfa bileşenini `app/` altında oluştur

### Test Etme

```bash
# Lint kontrolü
npm run lint

# Type check
npm run type-check

# Build test
npm run build
```

## 📋 TODO Listesi

### 🔴 Yüksek Öncelik

- [ ] Ödeme sistemi API entegrasyonu
- [ ] Öğrenci-kurs kayıt sistemi
- [ ] Ders katılım takibi
- [ ] Finansal raporlama

### 🟡 Orta Öncelik

- [ ] Email bildirimleri
- [ ] Dosya yükleme sistemi
- [ ] Mobil uyumluluk iyileştirmeleri
- [ ] Performance optimizasyonları

### 🟢 Düşük Öncelik

- [ ] Dark mode
- [ ] Çoklu dil desteği
- [ ] Advanced filtering
- [ ] Export/import özellikleri

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Proje Sahibi**: [İsim]
- **Email**: [email@example.com]
- **GitHub**: [github-username]

---

**Not**: Bu proje sürekli geliştirilmektedir. Güncel özellikler için README'yi kontrol edin.
