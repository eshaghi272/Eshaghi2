// src/pages/ContactPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  User,
  Building2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Instagram,
  Twitter,
  Linkedin,
//   Whatsapp,
  Headphones,
  Shield,
  Truck,
  RefreshCw
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });

  // دسته‌بندی‌های تماس
  const contactCategories = [
    { id: 'general', label: 'عمومی', icon: '💬' },
    { id: 'order', label: 'پیگیری سفارش', icon: '📦' },
    { id: 'return', label: 'بازگشت کالا', icon: '🔄' },
    { id: 'technical', label: 'پشتیبانی فنی', icon: '🔧' },
    { id: 'business', label: 'همکاری تجاری', icon: '🤝' },
    { id: 'complaint', label: 'شکایات', icon: '⚠️' }
  ];

  // اطلاعات تماس شرکت
  const contactInfo = [
    {
      icon: Phone,
      title: 'تلفن تماس',
      details: ['۰۲۱-۵۵۵۵۵۵۵۵', '۰۹۱۲-۵۵۵-۵۵۵۵'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      action: 'tel:02155555555'
    },
    {
      icon: Mail,
      title: 'ایمیل',
      details: ['support@estore.com', 'info@estore.com'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      action: 'mailto:support@estore.com'
    },
    {
      icon: MapPin,
      title: 'آدرس',
      details: ['تهران، خیابان ولیعصر', 'پلاک ۱۰۰۰، ساختمان eStore'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      action: 'https://maps.google.com/?q=تهران+ولیعصر'
    },
    {
      icon: Clock,
      title: 'ساعات کاری',
      details: ['شنبه تا چهارشنبه: ۸ تا ۲۰', 'پنج‌شنبه: ۸ تا ۱۴'],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      action: null
    }
  ];

  // سوالات متداول
  const faqs = [
    {
      question: 'چگونه سفارش خود را پیگیری کنم؟',
      answer: 'می‌توانید از طریق پنل کاربری در بخش "سفارشات من" یا با استفاده از کد پیگیری ارسال شده، وضعیت سفارش را بررسی کنید.',
      icon: '📦'
    },
    {
      question: 'سیاست بازگشت کالا چگونه است؟',
      answer: 'تا ۷ روز پس از دریافت کالا می‌توانید آن را بازگردانید. کالا باید سالم و بدون استفاده باشد.',
      icon: '🔄'
    },
    {
      question: 'هزینه ارسال چقدر است؟',
      answer: 'برای خریدهای بالای ۲۰۰ هزار تومان در تهران ارسال رایگان است. سایر موارد بر اساس وزن و مسافت محاسبه می‌شود.',
      icon: '🚚'
    },
    {
      question: 'چگونه می‌توانم حساب کاربری خود را حذف کنم؟',
      answer: 'از طریق بخش تنظیمات حساب کاربری می‌توانید درخواست حذف حساب را ارسال کنید.',
      icon: '👤'
    }
  ];

  // مزایای پشتیبانی
  const supportBenefits = [
    {
      icon: Headphones,
      title: 'پشتیبانی ۲۴/۷',
      description: 'در تمام ساعات شبانه‌روز پاسخگوی شما هستیم',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'تضمین امنیت',
      description: 'اطلاعات شما کاملاً محرمانه باقی می‌ماند',
      color: 'text-green-600'
    },
    {
      icon: Truck,
      title: 'پیگیری لحظه‌ای',
      description: 'پیگیری آنلاین سفارش از لحظه ثبت تا تحویل',
      color: 'text-purple-600'
    },
    {
      icon: RefreshCw,
      title: 'حل سریع',
      description: 'متعهد به حل مشکلات در کوتاه‌ترین زمان',
      color: 'text-orange-600'
    }
  ];

  // هندل تغییر فرم
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ارسال فرم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // در حالت واقعی اینجا API را فراخوانی می‌کنیم
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Contact form submitted:', formData);
      setSubmitSuccess(true);
      
      // ریست فرم
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
      
      // بعد از ۵ ثانیه پیام موفقیت را پاک کن
      setTimeout(() => setSubmitSuccess(false), 5000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      alert('خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <ChevronLeft className="w-5 h-5 ml-1" />
            بازگشت
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-white/20 rounded-3xl flex items-center justify-center">
              <MessageSquare className="w-12 h-12" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              با ما در <span className="text-yellow-300">تماس</span> باشید
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
              تیم پشتیبانی eStore آماده پاسخگویی به سوالات و حل مشکلات شماست
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* پیام موفقیت */}
          {submitSuccess && (
            <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-bold text-green-800 text-lg">پیام شما ارسال شد!</h3>
                  <p className="text-green-600">
                    همکاران ما در اسرع وقت با شما تماس خواهند گرفت.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* فرم تماس سمت چپ */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center gap-4 mb-8">
                  <Send className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">ارسال پیام</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* دسته‌بندی‌ها */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-bold mb-4">
                      موضوع پیام شما چیست؟
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {contactCategories.map((category) => (
                        <label 
                          key={category.id}
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.category === category.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category.id}
                            checked={formData.category === category.id}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                          <div className="text-2xl mb-2">{category.icon}</div>
                          <div className="font-medium">{category.label}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* اطلاعات تماس */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        نام و نام خانوادگی <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pr-12 pl-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all"
                          required
                          placeholder="مثلاً: علی محمدی"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        ایمیل <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pr-12 pl-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all"
                          required
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        شماره تماس
                      </label>
                      <div className="relative">
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Phone className="w-5 h-5" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pr-12 pl-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all"
                          placeholder="۰۹۱۲-XXX-XXXX"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        موضوع
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all"
                        placeholder="موضوع پیام خود را وارد کنید"
                      />
                    </div>
                  </div>
                  
                  {/* پیام */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2">
                      پیام شما <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute right-4 top-4 text-gray-400">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all"
                        required
                        placeholder="پیام خود را با جزئیات کامل بنویسید..."
                      />
                    </div>
                  </div>
                  
                  {/* دکمه ارسال */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        ارسال پیام
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* سوالات متداول */}
              <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  ❓ سوالات متداول
                </h2>
                
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{faq.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <button
                    onClick={() => navigate('/faq')}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center justify-center gap-2"
                  >
                    مشاهده تمامی سوالات متداول
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* سایدبار سمت راست */}
            <div className="lg:col-span-1 space-y-8">
              {/* اطلاعات تماس */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={index}
                      href={info.action || '#'}
                      target={info.action ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className={`block ${info.bgColor} border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{info.title}</h3>
                      </div>
                      <div className="space-y-2">
                        {info.details.map((detail, idx) => (
                          <div key={idx} className="text-gray-700">
                            {detail}
                          </div>
                        ))}
                      </div>
                    </a>
                  );
                })}
              </div>
              
              {/* مزایای پشتیبانی */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
                <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
                  <Headphones className="w-6 h-6 text-blue-600" />
                  مزایای پشتیبانی eStore
                </h3>
                
                <div className="space-y-6">
                  {supportBenefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Icon className={`w-6 h-6 ${benefit.color}`} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{benefit.title}</div>
                          <div className="text-gray-600 text-sm">{benefit.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* شبکه‌های اجتماعی */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8">
                <h3 className="font-bold text-xl mb-6">ما را دنبال کنید</h3>
                
                <div className="flex gap-4 mb-6">
                  <a 
                    href="https://instagram.com/estore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  
                  <a 
                    href="https://twitter.com/estore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                  
                  <a 
                    href="https://linkedin.com/company/estore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  
                  <a 
                    href="https://wa.me/989125555555" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    {/* <Whatsapp className="w-6 h-6" /> */}
                  </a>
                </div>
                
                <p className="text-gray-300 text-sm">
                  آخرین تخفیف‌ها و اخبار را در شبکه‌های اجتماعی دنبال کنید
                </p>
              </div>
              
              {/* شماره اضطراری */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">پشتیبانی اضطراری</h3>
                    <div className="text-gray-600 text-sm">۲۴ ساعته، ۷ روز هفته</div>
                  </div>
                </div>
                
                <a 
                  href="tel:02155555555" 
                  className="block text-center py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
                >
                  📞 ۰۲۱-۵۵۵۵۵۵۵۵
                </a>
                
                <p className="text-gray-600 text-sm text-center mt-4">
                  برای موارد اضطراری و مشکلات فوری
                </p>
              </div>
              
              {/* نقشه */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="font-bold text-gray-900 text-lg mb-4">موقعیت ما روی نقشه</h3>
                
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <div className="font-bold text-gray-900">تهران، ولیعصر</div>
                      <div className="text-gray-600 text-sm">ساختمان eStore</div>
                    </div>
                  </div>
                  
                  <a 
                    href="https://maps.google.com/?q=تهران+ولیعصر"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                  >
                    مشاهده در نقشه
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;