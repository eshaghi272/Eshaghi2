// Path: frontend/src/components/common/NotFound.tsx
import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900">
      <div className="text-center max-w-md p-8">
        <div className="text-8xl font-bold text-gold mb-4">۴۰۴</div>
        <h1 className="text-3xl font-bold text-darkblue dark:text-white mb-2">
          صفحه‌ای که دنبال آن هستید پیدا نشد!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه حذف شده باشد.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white rounded-xl hover:bg-gold-dark transition-colors"
        >
          <FaHome />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  )
}