// Path: frontend/src/components/receptionist/TreatmentInvoice.tsx
import { forwardRef } from 'react'
import { formatPersianDate } from '../../utils/persianDate'

interface TreatmentInvoiceProps {
  treatment: any
  patientName: string
  doctorName: string
  serviceName: string
  items: any[]
  extraCosts: any[]
  summary: {
    servicePrice: number
    discount: number
    finalPrice: number
    materialsCost: number
    medicinesCost: number
    extraCosts: number
    total: number
    doctorWage: number
    clinicProfit: number
  }
  treatmentId: number
}

const TreatmentInvoice = forwardRef<HTMLDivElement, TreatmentInvoiceProps>(
  ({ treatment, patientName, doctorName, serviceName, items, extraCosts, summary, treatmentId }, ref) => {
    
    const formatPrice = (price: number) => {
      return price.toLocaleString('fa-IR')
    }

    const getItemTypeLabel = (type: string) => {
      return type === 'material' ? 'مواد مصرفی' : 'دارو'
    }

    return (
      <div ref={ref} className="bg-white p-8 max-w-3xl mx-auto font-sans" dir="rtl">
        {/* هدر فاکتور */}
        <div className="text-center border-b-2 border-gold pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gold">💎 کلینیک زیبایی</h1>
              <p className="text-sm text-gray-500">مرکز تخصصی پوست، مو و زیبایی</p>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-600">شماره فاکتور: <span className="font-bold">{treatmentId}</span></p>
              <p className="text-sm text-gray-600">تاریخ: <span className="font-bold">{formatPersianDate(treatment?.fdate || new Date().toISOString().split('T')[0])}</span></p>
            </div>
          </div>
        </div>

        {/* اطلاعات بیمار و پزشک */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm font-bold text-gray-700 mb-2">👤 اطلاعات بیمار</p>
            <p className="text-sm">نام: <span className="font-bold">{patientName}</span></p>
            <p className="text-sm">پزشک معالج: <span className="font-bold">{doctorName}</span></p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm font-bold text-gray-700 mb-2">💊 اطلاعات درمان</p>
            <p className="text-sm">خدمت: <span className="font-bold">{serviceName}</span></p>
            <p className="text-sm">وضعیت: <span className="font-bold text-green-600">انجام شده</span></p>
          </div>
        </div>

        {/* جدول اقلام */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-darkblue mb-3">📋 اقلام مصرفی</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gold text-white">
                <th className="text-right py-2 px-3 text-sm">ردیف</th>
                <th className="text-right py-2 px-3 text-sm">نام کالا</th>
                <th className="text-right py-2 px-3 text-sm">نوع</th>
                <th className="text-right py-2 px-3 text-sm">تعداد</th>
                <th className="text-right py-2 px-3 text-sm">قیمت واحد</th>
                <th className="text-right py-2 px-3 text-sm">جمع</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-3 text-sm">{index + 1}</td>
                  <td className="py-2 px-3 text-sm">{item.itemName}</td>
                  <td className="py-2 px-3 text-sm">{getItemTypeLabel(item.itemType)}</td>
                  <td className="py-2 px-3 text-sm">{item.quantityUsed}</td>
                  <td className="py-2 px-3 text-sm">{formatPrice(item.pricePerUnit)}</td>
                  <td className="py-2 px-3 text-sm font-bold">{formatPrice(item.totalPrice)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400 text-sm">
                    هیچ قلمی ثبت نشده است
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* هزینه‌های اضافی */}
        {extraCosts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-darkblue mb-3">💰 هزینه‌های اضافی</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="text-right py-2 px-3 text-sm">ردیف</th>
                  <th className="text-right py-2 px-3 text-sm">توضیحات</th>
                  <th className="text-right py-2 px-3 text-sm">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                {extraCosts.map((cost, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-3 text-sm">{index + 1}</td>
                    <td className="py-2 px-3 text-sm">{cost.description}</td>
                    <td className="py-2 px-3 text-sm font-bold">{formatPrice(cost.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* خلاصه محاسبات */}
        <div className="border-t-2 border-gold pt-4">
          <div className="grid grid-cols-2 gap-2 max-w-md mr-auto">
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">قیمت خدمت:</span>
              <span className="text-sm font-bold">{formatPrice(summary.servicePrice)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">تخفیف:</span>
              <span className="text-sm font-bold text-red-500">-{formatPrice(summary.discount)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-sm text-gray-600">قیمت نهایی:</span>
              <span className="text-sm font-bold text-gold">{formatPrice(summary.finalPrice)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">مواد مصرفی:</span>
              <span className="text-sm font-bold text-purple-600">{formatPrice(summary.materialsCost)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">داروها:</span>
              <span className="text-sm font-bold text-indigo-600">{formatPrice(summary.medicinesCost)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">هزینه‌های اضافی:</span>
              <span className="text-sm font-bold text-orange-600">{formatPrice(summary.extraCosts)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-gold">
              <span className="text-base font-bold text-darkblue">جمع کل:</span>
              <span className="text-xl font-bold text-gold">{formatPrice(summary.total)}</span>
            </div>
          </div>
        </div>

        {/* امضا */}
        <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500">
          <div>
            <p>امضا پزشک: ________________</p>
          </div>
          <div>
            <p>امضا بیمار: ________________</p>
          </div>
          <div>
            <p>تاریخ چاپ: {new Date().toLocaleDateString('fa-IR')}</p>
          </div>
        </div>

        {/* فوتر */}
        <div className="mt-4 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
          <p>کلینیک زیبایی - تلفن: ۰۲۱-۱۲۳۴۵۶۷۸ - آدرس: تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
          <p className="mt-1">این فاکتور به صورت سیستمی صادر شده است</p>
        </div>
      </div>
    )
  }
)

TreatmentInvoice.displayName = 'TreatmentInvoice'

export default TreatmentInvoice