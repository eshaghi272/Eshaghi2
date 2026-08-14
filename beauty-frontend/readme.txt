frontend/src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx      ✅ هدر کامل
│   │   ├── Sidebar.tsx     ✅ سایدبار با دو حالت
│   │   ├── Footer.tsx      ✅ فوتر
│   │   └── Layout.tsx      ✅ لایوت اصلی
│   ├── auth/
│   │   ├── Login.tsx       ✅ ورود
│   │   └── Register.tsx    ✅ ثبت‌نام
│   ├── patient/
│   │   ├── Dashboard.tsx   ✅ داشبورد بیمار
│   │   ├── Appointments.tsx ✅ نوبت‌های من
│   │   ├── BookAppointment.tsx ✅ رزرو نوبت
│   │   └── Profile.tsx     ✅ پروفایل
│   ├── admin/
│   │   └── AdminDashboard.tsx ✅ پنل مدیریت
│   └── common/
│       └── ProtectedRoute.tsx ✅ محافظت از مسیرها
├── context/
│   ├── AuthContext.tsx     ✅ احراز هویت
│   ├── ThemeContext.tsx    ✅ تم
│   └── NotificationContext.tsx ✅ اعلان‌ها
├── pages/
│   ├── Home.tsx            ✅ صفحه اصلی
│   ├── Services.tsx        ✅ خدمات
│   ├── Gallery.tsx         ✅ گالری
│   └── Contact.tsx         ✅ تماس با ما
├── utils/
│   └── persianDate.ts      ✅ توابع تاریخ شمسی
├── services/
│   └── mockData.ts         ✅ داده‌های نمونه
├── App.tsx                 ✅ کامپوننت اصلی
├── main.tsx                ✅ نقطه ورود
└── index.css               ✅ استایل‌های کامل (RTL + تم)










اطلاعات ورود به سیستم (داده‌های دیتابیس):
کاربران نمونه (Seed Data):
نقش	موبایل	کد ملی	رمز عبور
ادمین	09120000001	1234567890	admin123
پزشک ۱	09120000002	1234567891	doctor123
پزشک ۲	09120000003	1234567892	doctor123
پزشک ۳	09120000004	1234567893	doctor123
پزشک ۴	09120000005	1234567894	doctor123
بیمار ۱	09120000006	1234567895	patient123
بیمار ۲	09120000007	1234567896	patient123
بیمار ۳	09120000008	1234567897	patient123
بیمار ۴	09120000009	1234567898	patient123
بیمار ۵	09120000010	1234567899	patient123
بیمار ۶	09120000011	1234567900	patient123
خلاصه برای ورود سریع:
نقش	موبایل	رمز عبور
👑 ادمین	09120000001	admin123
👨‍⚕️ پزشک	09120000002	doctor123
👤 بیمار	09120000006	patient123
اگر رمزها را فراموش کردید، می‌توانید از اسکریپت seed دوباره استفاده کنید:
powershell
cd D:\clinics\beauty-clinic\backend
npx ts-node seed.ts
این کار دیتابیس را با داده‌های نمونه پر می‌کند و رمزها ریست می‌شوند. 🚀

