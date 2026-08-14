// Path: frontend/src/components/admin/AddEditInventory.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { 
  FaBoxes, 
  FaSave, 
  FaTimes, 
  FaTag, 
  FaLayerGroup, 
  FaHashtag, 
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaTruck,
  FaCalendarAlt,
  FaEdit
} from 'react-icons/fa'

interface InventoryFormData {
  productName: string
  category: string
  quantity: number
  minThreshold: number
  unitPrice: number | null
  supplier: string
  fdate: string
}

export default function AddEditInventory() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [categories, setCategories] = useState<string[]>([])
  const [formData, setFormData] = useState<InventoryFormData>({
    productName: '',
    category: '',
    quantity: 0,
    minThreshold: 5,
    unitPrice: null,
    supplier: '',
    fdate: ''
  })

  useEffect(() => {
    fetchCategories()
    if (isEdit) {
      fetchInventoryItem()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/v1/inventory/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // اگر خطا داشت، لیست پیش‌فرض
      setCategories(['تزریقات', 'تجهیزات لیزر', 'مراقبتی', 'محصولات پزشکی', 'سایر'])
    }
  }

  const fetchInventoryItem = async () => {
    try {
      setFetchLoading(true)
      const response = await axios.get(`/api/v1/inventory/${id}`)
      const data = response.data
      setFormData({
        productName: data.productName || '',
        category: data.category || '',
        quantity: data.quantity || 0,
        minThreshold: data.minThreshold || 5,
        unitPrice: data.unitPrice || null,
        supplier: data.supplier || '',
        fdate: data.fdate || ''
      })
    } catch (error: any) {
      console.error('Error fetching inventory item:', error)
      toast.error('خطا در دریافت اطلاعات کالا')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // اعتبارسنجی
      if (!formData.productName.trim()) {
        toast.error('نام محصول الزامی است')
        setLoading(false)
        return
      }

      if (formData.quantity < 0) {
        toast.error('موجودی نمی‌تواند منفی باشد')
        setLoading(false)
        return
      }

      if (formData.minThreshold < 0) {
        toast.error('حداقل موجودی نمی‌تواند منفی باشد')
        setLoading(false)
        return
      }

      const submitData = {
        ...formData,
        unitPrice: formData.unitPrice || null,
        supplier: formData.supplier || null,
        fdate: formData.fdate || null
      }

      if (isEdit) {
        await axios.put(`/api/v1/inventory/${id}`, submitData)
        toast.success('قلم موجودی با موفقیت بروزرسانی شد')
      } else {
        await axios.post('/api/v1/inventory', submitData)
        toast.success('قلم موجودی با موفقیت اضافه شد')
      }

      navigate('/admin/inventory')
    } catch (error: any) {
      console.error('Error saving inventory:', error)
      toast.error(error.response?.data?.message || 'خطا در ذخیره اطلاعات')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-darkblue dark:text-white">
            {isEdit ? 'ویرایش قلم موجودی' : 'افزودن قلم موجودی جدید'}
          </h1>
          <FaBoxes className="text-4xl text-gold" />
        </div>

        <div className="card dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* نام محصول */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaTag className="inline ml-1 text-gold" />
                نام محصول *
              </label>
              <input
                type="text"
                name="productName"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.productName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="نام محصول را وارد کنید"
              />
            </div>

            {/* دسته‌بندی */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaLayerGroup className="inline ml-1 text-gold" />
                دسته‌بندی
              </label>
              <div className="flex gap-3">
                <select
                  name="category"
                  className="input-field flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">انتخاب دسته‌بندی...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="category"
                  className="input-field flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="یا دسته‌بندی جدید"
                  disabled={loading}
                />
              </div>
            </div>

            {/* موجودی و حداقل موجودی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                  <FaHashtag className="inline ml-1 text-gold" />
                  موجودی *
                </label>
                <input
                  type="number"
                  name="quantity"
                  className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min={0}
                  placeholder="۰"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                  <FaExclamationTriangle className="inline ml-1 text-gold" />
                  حداقل موجودی *
                </label>
                <input
                  type="number"
                  name="minThreshold"
                  className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={formData.minThreshold}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min={0}
                  placeholder="۵"
                />
                <p className="text-xs text-gray-400 mt-1">
                  در صورت رسیدن موجودی به این مقدار، هشدار نمایش داده می‌شود
                </p>
              </div>
            </div>

            {/* قیمت واحد و تامین‌کننده */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                  <FaMoneyBillWave className="inline ml-1 text-gold" />
                  قیمت واحد (تومان)
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={formData.unitPrice || ''}
                  onChange={handleChange}
                  disabled={loading}
                  min={0}
                  placeholder="مثال: ۲۵۰۰۰۰۰"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                  <FaTruck className="inline ml-1 text-gold" />
                  تامین‌کننده
                </label>
                <input
                  type="text"
                  name="supplier"
                  className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={formData.supplier}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="نام تامین‌کننده"
                />
              </div>
            </div>

            {/* تاریخ انقضا */}
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaCalendarAlt className="inline ml-1 text-gold" />
                تاریخ انقضا (شمسی)
              </label>
              <input
                type="text"
                name="fdate"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.fdate}
                onChange={handleChange}
                disabled={loading}
                placeholder="مثال: ۱۴۰۴۰۵۱۵"
              />
              <p className="text-xs text-gray-400 mt-1">فرمت: ۱۴۰۴۰۵۱۵ (سال ۱۴۰۴، ماه ۰۵، روز ۱۵)</p>
            </div>

            {/* خلاصه اطلاعات */}
            {formData.productName && (
              <div className="bg-gold-light/20 dark:bg-gold-dark/10 rounded-xl p-4 border border-gold/20">
                <p className="text-sm font-semibold text-darkblue dark:text-white mb-2">📋 خلاصه:</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>نام: {formData.productName}</p>
                  <p>دسته‌بندی: {formData.category || 'تعیین نشده'}</p>
                  <p>موجودی: {formData.quantity}</p>
                  <p>حداقل موجودی: {formData.minThreshold}</p>
                  {formData.unitPrice && <p>قیمت: {formData.unitPrice.toLocaleString()} تومان</p>}
                  {formData.supplier && <p>تامین‌کننده: {formData.supplier}</p>}
                  {formData.fdate && <p>تاریخ انقضا: {formData.fdate}</p>}
                </div>
              </div>
            )}

            {/* دکمه‌ها */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <FaSave />
                    {isEdit ? 'ذخیره تغییرات' : 'افزودن کالا'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/inventory')}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
              >
                <FaTimes />
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    
  )
}