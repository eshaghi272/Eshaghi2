// Path: frontend/src/components/admin/Inventory.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { 
  FaBoxes, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa'

interface InventoryItem {
  id: number
  productName: string
  category: string
  quantity: number
  minThreshold: number
  unitPrice: number | null
  supplier: string | null
  fdate: string | null
  lastUpdated: string
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [showLowStock, setShowLowStock] = useState(false)
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalQuantity: 0,
    lowStockItems: 0,
    totalCategories: 0
  })

  useEffect(() => {
    fetchInventory()
    fetchCategories()
    fetchSummary()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/v1/inventory')
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching inventory:', error)
      toast.error('خطا در دریافت لیست موجودی')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/v1/inventory/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await axios.get('/api/v1/inventory/summary')
      setSummary(response.data)
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const deleteItem = async (id: number) => {
    if (!confirm('آیا از حذف این قلم موجودی مطمئن هستید؟')) return

    try {
      await axios.delete(`/api/v1/inventory/${id}`)
      toast.success('قلم موجودی با موفقیت حذف شد')
      fetchInventory()
      fetchSummary()
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('خطا در حذف قلم موجودی')
    }
  }

  const filteredItems = items.filter(item => {
    const matchSearch = 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchCategory = selectedCategory ? item.category === selectedCategory : true
    const matchStock = showLowStock ? item.quantity <= item.minThreshold : true

    return matchSearch && matchCategory && matchStock
  })

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return { color: 'text-red-500', bg: 'bg-red-100', label: 'تمام شده' }
    } else if (item.quantity <= item.minThreshold) {
      return { color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'کم' }
    } else {
      return { color: 'text-green-500', bg: 'bg-green-100', label: 'موجود' }
    }
  }

  if (loading) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">مدیریت موجودی</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {summary.totalItems} قلم کالا - {summary.totalCategories} دسته‌بندی
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/admin/inventory/add'}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus />
            افزودن کالا
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">کل کالاها</p>
            <p className="text-2xl font-bold text-darkblue dark:text-white">{summary.totalItems}</p>
          </div>
          <div className="card dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">کل موجودی</p>
            <p className="text-2xl font-bold text-darkblue dark:text-white">{summary.totalQuantity}</p>
          </div>
          <div className="card dark:bg-gray-800 border-2 border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">کمبود موجودی</p>
            <p className="text-2xl font-bold text-yellow-500">{summary.lowStockItems}</p>
          </div>
          <div className="card dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">دسته‌بندی‌ها</p>
            <p className="text-2xl font-bold text-darkblue dark:text-white">{summary.totalCategories}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="جستجو بر اساس نام، دسته‌بندی یا تامین‌کننده..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            className="input-field max-w-[200px]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">همه دسته‌بندی‌ها</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
              showLowStock 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setShowLowStock(!showLowStock)}
          >
            <FaExclamationTriangle />
            کمبود موجودی
          </button>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('')
              setShowLowStock(false)
              fetchInventory()
            }}
            className="btn-secondary text-sm py-2 px-4"
          >
            🔄 بروزرسانی
          </button>
        </div>

        {/* Inventory List */}
        {filteredItems.length === 0 ? (
          <div className="card dark:bg-gray-800 text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">هیچ قلم موجودی یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">نام کالا</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">دسته‌بندی</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">موجودی</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">وضعیت</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">قیمت واحد</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const status = getStockStatus(item)
                  return (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-darkblue dark:text-white">{item.productName}</p>
                        {item.supplier && (
                          <p className="text-xs text-gray-400">تامین‌کننده: {item.supplier}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {item.category || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-darkblue dark:text-white">
                        {item.quantity}
                        <span className="text-xs text-gray-400 block">حداقل: {item.minThreshold}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                        {item.fdate && (
                          <p className="text-xs text-gray-400 mt-1">انقضا: {item.fdate}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {item.unitPrice ? `${item.unitPrice.toLocaleString()} تومان` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.location.href = `/admin/inventory/edit/${item.id}`}
                            className="btn-secondary text-xs py-1 px-3 flex items-center gap-1"
                          >
                            <FaEdit className="text-sm" />
                            ویرایش
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="btn-danger text-xs py-1 px-3 flex items-center gap-1"
                          >
                            <FaTrash className="text-sm" />
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    
  )
}