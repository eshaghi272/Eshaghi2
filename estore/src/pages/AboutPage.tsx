// src/pages/AboutPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart, 
  Shield, 
  Truck, 
  RefreshCw,
  Star,
  TrendingUp,
  CheckCircle,
  Clock,
  ShoppingBag,
  Leaf,
  HeartHandshake,
  Building2,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  // تیم اجرایی
  const teamMembers = [
    {
      name: 'محمد احمدی',
      role: 'مدیرعامل و بنیان‌گذار',
      image: '👨‍💼',
      description: '۱۵ سال سابقه در تجارت الکترونیک',
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'فاطمه کریمی',
      role: 'مدیر فنی',
      image: '👩‍💻',
      description: 'متخصص توسعه وب و اپلیکیشن',
      color: 'from-purple-500 to-purple-700'
    },
    {
      name: 'علی رضایی',
      role: 'مدیر بازاریابی',
      image: '👨‍💼',
      description: '۱۰ سال تجربه در دیجیتال مارکتینگ',
      color: 'from-green-500 to-green-700'
    },
    {
      name: 'سارا محمدی',
      role: 'مدیر خدمات مشتریان',
      image: '👩‍💼',
      description: 'متخصص CRM و پشتیبانی مشتریان',
      color: 'from-pink-500 to-pink-700'
    }
  ];

  // ارزش‌های شرکت
  const companyValues = [
    {
      icon: Heart,
      title: 'رضایت مشتری',
      description: 'اولویت اول ما رضایت کامل شماست',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Shield,
      title: 'امنیت و اعتماد',
      description: 'اطلاعات شما نزد ما امن است',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Leaf,
      title: 'پایداری',
      description: 'به محیط زیست احترام می‌گذاریم',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: HeartHandshake,
      title: 'انصاف',
      description: 'با همه شرکا و مشتریان منصفانه رفتار می‌کنیم',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  // آمار و ارقام
  const stats = [
    { number: '۵۰,۰۰۰+', label: 'مشتری راضی', icon: Users, color: 'from-blue-500 to-blue-600' },
    { number: '۱۰,۰۰۰+', label: 'محصول متنوع', icon: ShoppingBag, color: 'from-green-500 to-green-600' },
    { number: '۱۵۰+', label: 'همکار متخصص', icon: Users, color: 'from-purple-500 to-purple-600' },
    { number: '۹۸٪', label: 'رضایت مشتریان', icon: Star, color: 'from-yellow-500 to-yellow-600' }
  ];

  // خط زمانی رشد
  // اصلاح خطوط timeline در AboutPage.tsx
const timeline = [
  { year: 2018, event: 'تأسیس eStore با ۳ نفر', milestone: 'شروع' },
  { year: 2019, event: 'رسیدن به ۱۰۰۰ مشتری', milestone: 'رشد' },
  { year: 2020, event: 'راه‌اندازی اپلیکیشن موبایل', milestone: 'نوآوری' },
  { year: 2021, event: 'افتتاح مرکز لجستیک', milestone: 'توسعه' },
  { year: 2022, event: 'کسب گواهینامه ISO', milestone: 'تضمین کیفیت' },
  { year: 2023, event: 'رسیدن به ۵۰,۰۰۰ مشتری', milestone: 'تثبیت' }
];
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-blue-600 transition flex items-center"
            >
              <ChevronLeft className="w-4 h-4 ml-1" />
              خانه
            </button>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">درباره ما</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-white/20 rounded-3xl flex items-center justify-center">
              <Building2 className="w-12 h-12" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              درباره <span className="text-yellow-300">eStore</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
              داستان ما، مأموریت ما و ارزش‌هایی که به آن‌ها باور داریم
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => navigate('/products')}
                className="group bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl flex items-center"
              >
                <span>مشاهده محصولات</span>
                <ArrowRight className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/contact')}
                className="group bg-transparent border-2 border-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover:scale-105 flex items-center"
              >
                <span>تماس با ما</span>
                <Phone className="w-5 h-5 mr-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* مأموریت و چشم‌انداز */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-10 border border-blue-200">
            <div className="flex items-center gap-4 mb-8">
              <Target className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">مأموریت ما</h3>
                <div className="w-20 h-1 bg-blue-500 mt-2"></div>
              </div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              مأموریت ما ایجاد تجربه‌ای استثنایی از خرید آنلاین است. ما با ارائه محصولات باکیفیت، 
              قیمت‌های منصفانه و خدمات پس از فروش بی‌نظیر، اعتماد شما را جلب کرده و رابطه‌ای پایدار ایجاد می‌کنیم.
            </p>
            <ul className="space-y-4">
              {[
                'ارائه بهترین قیمت‌ها در بازار',
                'تضمین کیفیت تمامی محصولات',
                'پشتیبانی ۲۴ ساعته',
                'تحویل سریع و رایگان'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-10 border border-purple-200">
            <div className="flex items-center gap-4 mb-8">
              <Globe className="w-12 h-12 text-purple-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">چشم‌انداز ما</h3>
                <div className="w-20 h-1 bg-purple-500 mt-2"></div>
              </div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              چشم‌انداز ما تبدیل شدن به برترین پلتفرم خرید آنلاین در منطقه است. 
              می‌خواهیم eStore به اولین انتخاب هر ایرانی برای خرید آنلاین تبدیل شود.
            </p>
            <ul className="space-y-4">
              {[
                'رتبه اول فروش آنلاین تا ۲۰۲۵',
                'توسعه به ۱۰ کشور منطقه',
                'ایجاد ۱۰۰۰ شغل مستقیم',
                'کاهش ۵۰٪ی ردپای کربن'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* آمار و ارقام */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">در اعداد و ارقام</h2>
            <p className="text-gray-300 text-lg">داستان موفقیت ما در اعداد</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl p-8 text-center shadow-xl`}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-white/90">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ارزش‌های شرکت */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">ارزش‌های ما</h2>
          <p className="text-gray-600 text-lg">اصولی که به آن‌ها پایبندیم</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <div 
                key={index}
                className={`${value.bgColor} border border-gray-200 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300`}
              >
                <div className={`w-20 h-20 mx-auto mb-6 ${value.bgColor} rounded-2xl flex items-center justify-center`}>
                  <Icon className={`w-10 h-10 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* خط زمانی */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">مسیر رشد ما</h2>
            <p className="text-gray-600 text-lg">از ابتدا تا امروز</p>
          </div>
          
          <div className="relative">
            {/* خط وسط */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 hidden md:block"></div>
            
            {timeline.map((item, index) => (
              <div 
                key={index}
                className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-1/2 md:pl-0 md:text-right' : 'md:pl-1/2 md:pr-0 md:text-left'}`}
              >
                {/* نقطه روی خط */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-white shadow-xl hidden md:block"></div>
                
                <div className={`bg-white border border-gray-200 rounded-2xl p-8 shadow-lg ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">{item.year-621}</span>
                    </div>
                    <div>
                      <span className="px-4 py-1.5 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full text-sm font-bold">
                        {item.milestone}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.event}</h3>
                  <p className="text-gray-600">گام مهمی در مسیر رشد eStore</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* تیم اجرایی */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">تیم اجرایی</h2>
          <p className="text-gray-600 text-lg">مغزهای متفکر پشت eStore</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="group bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300`}>
                {member.image}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
              <div className="px-4 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm font-medium inline-block mb-3">
                {member.role}
              </div>
              <p className="text-gray-600">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* فراخوان اقدام */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">به خانواده eStore بپیوندید</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            چه به دنبال خرید هستید یا می‌خواهید با ما همکاری کنید، 
            ما بهترین تجربه را برای شما ایجاد می‌کنیم.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/products')}
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl flex items-center"
            >
              <ShoppingBag className="w-6 h-6 ml-3" />
              شروع خرید
            </button>
            
            <button 
              onClick={() => navigate('/contact')}
              className="bg-transparent border-2 border-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover:scale-105 flex items-center"
            >
              <Phone className="w-6 h-6 ml-3" />
              تماس برای همکاری
            </button>
          </div>
        </div>
      </section>

      {/* اطلاعات تماس */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <MapPin className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">آدرس</h3>
                  <div className="w-12 h-1 bg-blue-500 mt-2"></div>
                </div>
              </div>
              <p className="text-gray-600">
                تهران، خیابان ولیعصر، پلاک ۱۰۰۰
                <br />
                ساختمان eStore، طبقه ۵
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <Phone className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">تماس</h3>
                  <div className="w-12 h-1 bg-green-500 mt-2"></div>
                </div>
              </div>
              <p className="text-gray-600 space-y-2">
                <div>☎️ ۰۲۱-۵۵۵۵۵۵۵۵</div>
                <div>📱 ۰۹۱۲-۵۵۵-۵۵۵۵</div>
                <div>🕗 ۸ صبح تا ۱۲ شب</div>
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <Mail className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">شبکه‌های اجتماعی</h3>
                  <div className="w-12 h-1 bg-purple-500 mt-2"></div>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;