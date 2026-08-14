// Path: frontend/src/components/layout/Footer.tsx
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-darkblue dark:bg-gray-900 text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gold mb-4">کلینیک زیبایی</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              مرکز تخصصی پوست، مو و زیبایی با کادری مجرب و به‌روزترین تجهیزات
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">تماس با ما</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <FaPhone className="text-gold" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-gold" />
                <span>info@beautyclinic.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gold" />
                <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/services" className="hover:text-gold transition-colors">خدمات</a></li>
              <li><a href="/gallery" className="hover:text-gold transition-colors">گالری</a></li>
              <li><a href="/contact" className="hover:text-gold transition-colors">تماس با ما</a></li>
              <li><a href="/book-appointment" className="hover:text-gold transition-colors">رزرو نوبت</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">شبکه‌های اجتماعی</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gold flex items-center justify-center transition-colors">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gold flex items-center justify-center transition-colors">
                <FaTelegram className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gold flex items-center justify-center transition-colors">
                <FaWhatsapp className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          تمامی حقوق محفوظ است &copy; {new Date().getFullYear()} کلینیک زیبایی
        </div>
      </div>
    </footer>
  )
}