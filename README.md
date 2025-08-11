# 🎓 Okul Yönetim Platformu

Bu proje, çevrimiçi okul yönetimi için geliştirilmiş modern bir web uygulamasıdır. Next.js 14, TypeScript ve Tailwind CSS kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### 👨‍💼 Admin Paneli

- **Dashboard**: Sistem genel durumu ve istatistikler
- **Kurs Yönetimi**: Kurs ekleme, düzenleme ve görüntüleme
- **Öğretmen Yönetimi**: Öğretmen ekleme ve yönetimi
- **Öğrenci Yönetimi**: Öğrenci kayıtları ve takibi
- **Ödeme Takibi**: Öğrenci ve öğretmen ödemeleri

### 👩‍🏫 Öğretmen Paneli

- **Dashboard**: Kişisel kurs ve ders istatistikleri
- **Kurslarım**: Atanan kursları görüntüleme
- **Ders Yönetimi**: Ders planlama ve yönetimi
- **İlerleme Takibi**: Kurs ve öğrenci ilerlemesi

## 🔧 Teknik Detaylar

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Dil**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios (interceptor ile token yönetimi)

### Backend Entegrasyonu

- **Base URL**: `https://online-school-backend-gumy.onrender.com`
- **Authentication**: JWT token tabanlı
- **API Endpoints**: RESTful API

### Veri Yapısı

- **Courses**: Kurs bilgileri ve öğretmen atamaları
- **Sessions**: Ders oturumları ve detayları
- **Users**: Kullanıcı bilgileri ve rolleri
- **Teachers**: Öğretmen profilleri ve kurs atamaları
- **Students**: Öğrenci bilgileri ve kurs kayıtları

## 📁 Proje Yapısı

```
school/
├── app/                    # Next.js App Router sayfaları
│   ├── admin/             # Admin paneli sayfaları
│   ├── teacher/           # Öğretmen paneli sayfaları
│   └── layout.tsx         # Ana layout
├── components/             # React bileşenleri
│   ├── AuthGuard.tsx      # Kimlik doğrulama koruması
│   ├── DashboardLayout.tsx # Dashboard layout
│   └── Sidebar.tsx        # Yan menü
├── lib/                    # Yardımcı kütüphaneler
│   ├── services/          # API servisleri
│   │   ├── courseService.ts
│   │   ├── sessionService.ts
│   │   └── studentService.ts
│   ├── auth.ts            # Kimlik doğrulama servisi
│   ├── axiosClient.ts     # HTTP istemcisi
│   ├── types.ts           # TypeScript tip tanımları
│   └── jwt.ts             # JWT yardımcıları
└── public/                 # Statik dosyalar
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18+
- npm veya yarn

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

### Ortam Değişkenleri

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_API_BASE_URL=https://online-school-backend-gumy.onrender.com
```

## 🔐 Kimlik Doğrulama

### Admin Girişi

- **URL**: `/admin/login`
- **Demo**: `admin@example.com` / `123456`

### Öğretmen Girişi

- **URL**: `/teacher/login`
- **Demo**: `teacher@example.com` / `123456`

## 📊 API Entegrasyonu Durumu

### ✅ Tamamlanan

- [x] Kurs listeleme (`GET /courses`)
- [x] Kurs detayları (`GET /courses/:id`)
- [x] Session yönetimi (tamamlandı/iptal)
- [x] Kimlik doğrulama ve yetkilendirme
- [x] Axios interceptor ile token yönetimi
- [x] Öğrenci listeleme (`GET /students`)
- [x] Öğrenci detayları (`GET /students/:id`)
- [x] Öğrenci kursları (`GET /students/:id/courses`)
- [x] Öğrenci CRUD işlemleri (ekleme, silme, güncelleme)

### 🔄 Devam Eden

- [ ] Ödeme sistemi API'leri
- [ ] Kurs ekleme/düzenleme API'leri
- [ ] Session ekleme API'leri
- [ ] Teacher management API'leri

### 📝 TODO

- [ ] Student enrollment endpoint'leri
- [ ] Payment tracking API'leri
- [ ] Course creation/editing API'leri
- [ ] Session creation API'leri
- [ ] Teacher listing/management API'leri

## 🎯 Kullanım Senaryoları

### Admin İş Akışı

1. `/admin/login` ile giriş yap
2. Dashboard'da sistem genel durumunu gör
3. Kurslar sekmesinde mevcut kursları yönet
4. Öğrenciler sekmesinde öğrenci kayıtlarını yönet
5. Öğretmen ve öğrenci kayıtlarını takip et

### Öğretmen İş Akışı

1. `/teacher/login` ile giriş yap
2. Dashboard'da kişisel istatistikleri gör
3. Kurslarım sekmesinde atanan kursları incele
4. Dersler sekmesinde ders planlaması yap

## 🛠️ Geliştirme

### Yeni API Endpoint Ekleme

1. `lib/services/` altında yeni servis oluştur
2. `lib/types.ts`'e tip tanımları ekle
3. İlgili sayfada servisi kullan

### Yeni Sayfa Ekleme

1. `app/` altında yeni klasör oluştur
2. `page.tsx` dosyası ekle
3. `DashboardLayout` ile sarmala

## 📝 Notlar

- Proje şu anda **API entegrasyonu aşamasında** bulunmaktadır
- Mock veriler kaldırılmış, gerçek API'ler kullanılmaktadır
- Bazı özellikler henüz API'ye bağlanmamıştır (TODO olarak işaretlenmiştir)
- Authentication sistemi tamamen çalışır durumdadır
- Student management sistemi tamamen API'ye bağlanmıştır

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue açabilir veya pull request gönderebilirsiniz.
