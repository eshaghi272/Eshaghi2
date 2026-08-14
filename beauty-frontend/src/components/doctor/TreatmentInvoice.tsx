// Path: frontend/src/components/doctor/TreatmentInvoice.tsx
import { forwardRef } from 'react'

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

    const today = new Date()
    const persianDate = today.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const persianTime = today.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    })

    // محاسبه مالیات (۹%)
    const taxRate = 0.09
    const taxAmount = Math.round(summary.total * taxRate)
    const totalWithTax = summary.total + taxAmount

    return (
      <div ref={ref} className="bg-white p-6 max-w-2xl mx-auto font-sans" dir="rtl" style={{ fontFamily: 'IRANSans, Tahoma, sans-serif' }}>
        
        {/* ===== هدر فاکتور ===== */}
        <div className="text-center border-b-2 border-gray-300 pb-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gold">💎 کلینیک زیبایی</h1>
              <p className="text-xs text-gray-500">مرکز تخصصی پوست، مو و زیبایی</p>
            </div>
            <div className="text-left text-xs">
              <p className="text-gray-600">{persianTime} - {persianDate}</p>
              <p className="text-gray-600">شماره: <span className="font-bold">{treatmentId}</span></p>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-bold text-gray-700">فاکتور درمان</p>
            <p className="text-xs text-gray-500">مشتری: {patientName}</p>
            <p className="text-xs text-gray-500">پزشک: {doctorName}</p>
          </div>
        </div>

        {/* ===== جدول اقلام ===== */}
        <div className="mb-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-right py-2 px-2 text-xs text-gray-600">#</th>
                <th className="text-right py-2 px-2 text-xs text-gray-600">شرح</th>
                <th className="text-right py-2 px-2 text-xs text-gray-600">تعداد</th>
                <th className="text-right py-2 px-2 text-xs text-gray-600">قیمت</th>
                <th className="text-right py-2 px-2 text-xs text-gray-600">جمع</th>
              </tr>
            </thead>
            <tbody>
              {/* سرویس اصلی */}
              <tr className="border-b border-gray-100">
                <td className="py-2 px-2 text-xs">1</td>
                <td className="py-2 px-2 text-xs">{serviceName}</td>
                <td className="py-2 px-2 text-xs">1</td>
                <td className="py-2 px-2 text-xs">{formatPrice(summary.servicePrice)}</td>
                <td className="py-2 px-2 text-xs font-bold">{formatPrice(summary.servicePrice)}</td>
              </tr>

              {/* مواد مصرفی */}
              {items.filter(item => item.itemType === 'material').map((item, index) => (
                <tr key={`material-${index}`} className="border-b border-gray-100">
                  <td className="py-2 px-2 text-xs">{index + 2}</td>
                  <td className="py-2 px-2 text-xs">{item.itemName || item.materialName}</td>
                  <td className="py-2 px-2 text-xs">{item.quantityUsed}</td>
                  <td className="py-2 px-2 text-xs">{formatPrice(item.pricePerUnit)}</td>
                  <td className="py-2 px-2 text-xs font-bold">{formatPrice(item.totalPrice)}</td>
                </tr>
              ))}

              {/* داروها */}
              {items.filter(item => item.itemType === 'medicine').map((item, index) => (
                <tr key={`medicine-${index}`} className="border-b border-gray-100">
                  <td className="py-2 px-2 text-xs">{items.filter(i => i.itemType === 'material').length + index + 2}</td>
                  <td className="py-2 px-2 text-xs">{item.itemName || item.medicineName}</td>
                  <td className="py-2 px-2 text-xs">{item.quantityUsed}</td>
                  <td className="py-2 px-2 text-xs">{formatPrice(item.pricePerUnit)}</td>
                  <td className="py-2 px-2 text-xs font-bold">{formatPrice(item.totalPrice)}</td>
                </tr>
              ))}

              {/* هزینه‌های اضافی */}
              {extraCosts.map((cost, index) => (
                <tr key={`extra-${index}`} className="border-b border-gray-100">
                  <td className="py-2 px-2 text-xs">{items.length + index + 2}</td>
                  <td className="py-2 px-2 text-xs">{cost.description}</td>
                  <td className="py-2 px-2 text-xs">1</td>
                  <td className="py-2 px-2 text-xs">{formatPrice(cost.amount)}</td>
                  <td className="py-2 px-2 text-xs font-bold">{formatPrice(cost.amount)}</td>
                </tr>
              ))}

              {items.length === 0 && extraCosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400 text-xs">
                    هیچ قلمی ثبت نشده است
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== جمع کل ===== */}
        <div className="border-t-2 border-gray-300 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">جمع کل:</span>
            <span className="font-bold">{formatPrice(summary.total)} تومان</span>
          </div>
          
          {/* تخفیف (اگر وجود داشته باشد) */}
          {summary.discount > 0 && (
            <div className="flex justify-between text-sm text-red-500">
              <span>تخفیف:</span>
              <span>-{formatPrice(summary.discount)} تومان</span>
            </div>
          )}

          {/* مالیات ارزش افزوده (۹%) */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">مالیات ارزش افزوده (۹%):</span>
            <span>{formatPrice(taxAmount)} تومان</span>
          </div>

          {/* جمع نهایی */}
          <div className="flex justify-between text-lg font-bold border-t-2 border-gold mt-2 pt-2">
            <span className="text-gold">قابل پرداخت:</span>
            <span className="text-gold">{formatPrice(totalWithTax)} تومان</span>
          </div>
        </div>

        {/* ===== پیام تشکر ===== */}
        <div className="text-center mt-4 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-700 font-medium">با تشکر از اعتماد شما</p>
          <p className="text-xs text-gray-400 mt-1">ساخته شده با 💖 | کلینیک زیبایی</p>
          <p className="text-[10px] text-gray-300 mt-1">تمامی حقوق محفوظ است © ۱۴۰۳</p>
        </div>
      </div>
    )
  }
)

TreatmentInvoice.displayName = 'TreatmentInvoice'

export default TreatmentInvoice