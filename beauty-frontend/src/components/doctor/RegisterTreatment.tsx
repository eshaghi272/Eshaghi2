// Path: frontend/src/components/doctor/RegisterTreatment.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useReactToPrint } from 'react-to-print'
import TreatmentInvoice from './TreatmentInvoice'
import { 
  FaUser, 
  FaUserMd, 
  FaSyringe, 
  FaMoneyBillWave, 
  FaSave, 
  FaTimes,
  FaPlus,
  FaTrash,
  FaBoxes,
  FaPills,
  FaPercent,
  FaCalculator,
  FaPrint,
  FaCheckCircle,
  FaRedo,
  FaSpinner,
  FaStethoscope,
  FaEye
} from 'react-icons/fa'

interface Patient {
  id: number
  fullName: string
  mobile: string
}

interface Doctor {
  id: number
  fullName: string
  specialty: string
  consultationFee: number
}

interface Service {
  id: number
  name: string
  price: number
  durationMinutes: number
}

interface Material {
  id: number
  name: string
  unit: string
  pricePerUnit: number
  quantity: number
}

interface Medicine {
  id: number
  name: string
  unit: string
  pricePerUnit: number
  quantity: number
}

interface TreatmentMaterial {
  materialId: number
  materialName: string
  quantityUsed: number
  pricePerUnit: number
  totalPrice: number
}

interface TreatmentMedicine {
  medicineId: number
  medicineName: string
  quantityUsed: number
  pricePerUnit: number
  totalPrice: number
  dosage: string
  instructions: string
}

interface ExtraCost {
  description: string
  amount: number
}

export default function RegisterTreatment() {
  const navigate = useNavigate()
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [lastTreatmentId, setLastTreatmentId] = useState<number | null>(null)
  const [showInvoice, setShowInvoice] = useState(false)
  const [lastTreatmentData, setLastTreatmentData] = useState<any>(null)
  
  // داده‌های فرم
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  
  // فرم اصلی
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    serviceId: '',
    servicePrice: 0,
    discountAmount: 0,
    discountPercent: 0,
    description: ''
  })
  
  // آیتم‌های فرم
  const [selectedMaterials, setSelectedMaterials] = useState<TreatmentMaterial[]>([])
  const [selectedMedicines, setSelectedMedicines] = useState<TreatmentMedicine[]>([])
  const [extraCosts, setExtraCosts] = useState<ExtraCost[]>([])
  
  // آیتم جدید
  const [newMaterial, setNewMaterial] = useState({ materialId: '', quantityUsed: 1 })
  const [newMedicine, setNewMedicine] = useState({ medicineId: '', quantityUsed: 1, dosage: '', instructions: '' })
  const [newExtraCost, setNewExtraCost] = useState({ description: '', amount: 0 })
  
  // محاسبات
  const [calculations, setCalculations] = useState({
    servicePrice: 0,
    discount: 0,
    finalPrice: 0,
    materialsCost: 0,
    medicinesCost: 0,
    extraCosts: 0,
    total: 0,
    doctorWage: 0,
    clinicProfit: 0
  })

  // تابع پرینت - فقط چاپ
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `فاکتور_درمان_${lastTreatmentData?.id || Date.now()}`,
    onBeforeGetContent: () => {
      setIsPrinting(true)
    },
    onAfterPrint: () => {
      setIsPrinting(false)
    }
  })

  useEffect(() => {
    fetchFormData()
  }, [])

  useEffect(() => {
    calculateAll()
  }, [formData, selectedMaterials, selectedMedicines, extraCosts])

  const fetchFormData = async () => {
    try {
      setLoadingData(true)

      const token = localStorage.getItem('access_token')
      if (!token) {
        toast.error('لطفاً وارد سیستم شوید')
        return
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      const userStr = localStorage.getItem('user')
      let currentDoctorId = ''
      if (userStr) {
        const user = JSON.parse(userStr)
        currentDoctorId = String(user.id)
        setDoctors([{
          id: user.id,
          fullName: user.fullName,
          specialty: user.specialty || 'متخصص',
          consultationFee: user.consultationFee || 0
        }])
        setFormData(prev => ({ ...prev, doctorId: currentDoctorId }))
      }

      // 1. دریافت بیماران
      try {
        const patientsRes = await axios.get('/api/v1/doctors/patients')
        setPatients(patientsRes.data.map((p: any) => ({
          id: p.id,
          fullName: p.fullName,
          mobile: p.mobile
        })))
      } catch (err) {
        console.warn('Could not fetch patients:', err)
        setPatients([])
      }

      // 2. دریافت خدمات
      try {
        const servicesRes = await axios.get('/api/v1/services')
        setServices(servicesRes.data || [])
      } catch (err) {
        console.warn('Could not fetch services:', err)
        setServices([])
      }

      // 3. دریافت مواد مصرفی
      try {
        const materialsRes = await axios.get('/api/v1/treatments/materials')
        setMaterials(materialsRes.data || [])
      } catch (err) {
        console.warn('Could not fetch materials:', err)
        setMaterials([])
      }

      // 4. دریافت داروها
      try {
        const medicinesRes = await axios.get('/api/v1/treatments/medicines')
        setMedicines(medicinesRes.data || [])
      } catch (err) {
        console.warn('Could not fetch medicines:', err)
        setMedicines([])
      }

    } catch (error: any) {
      console.error('Error fetching form data:', error)
      
      if (error.response?.status === 401) {
        toast.error('لطفاً وارد سیستم شوید')
        return
      }
      
      toast.error('خطا در دریافت اطلاعات فرم')
    } finally {
      setLoadingData(false)
    }
  }

  const calculateAll = () => {
    const servicePrice = formData.servicePrice || 0
    const discount = formData.discountAmount || 0
    const finalPrice = servicePrice - discount
    
    const materialsCost = selectedMaterials.reduce((sum, m) => sum + m.totalPrice, 0)
    const medicinesCost = selectedMedicines.reduce((sum, m) => sum + m.totalPrice, 0)
    const extraCostsTotal = extraCosts.reduce((sum, e) => sum + e.amount, 0)
    
    const total = finalPrice + materialsCost + medicinesCost + extraCostsTotal
    const doctorWage = Math.round(finalPrice * 0.6)
    const clinicProfit = finalPrice - doctorWage
    
    setCalculations({
      servicePrice,
      discount,
      finalPrice,
      materialsCost,
      medicinesCost,
      extraCosts: extraCostsTotal,
      total,
      doctorWage,
      clinicProfit
    })
  }

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === parseInt(serviceId))
    if (service) {
      setFormData(prev => ({
        ...prev,
        serviceId,
        servicePrice: service.price
      }))
    }
  }

  const addMaterial = () => {
    if (!newMaterial.materialId) {
      toast.error('لطفاً ماده مصرفی را انتخاب کنید')
      return
    }
    
    const material = materials.find(m => m.id === parseInt(newMaterial.materialId))
    if (!material) return
    
    if (material.quantity < newMaterial.quantityUsed) {
      toast.error(`موجودی کافی نیست. موجودی: ${material.quantity}`)
      return
    }
    
    const totalPrice = newMaterial.quantityUsed * material.pricePerUnit
    
    setSelectedMaterials(prev => [...prev, {
      materialId: material.id,
      materialName: material.name,
      quantityUsed: newMaterial.quantityUsed,
      pricePerUnit: material.pricePerUnit,
      totalPrice
    }])
    
    setNewMaterial({ materialId: '', quantityUsed: 1 })
  }

  const removeMaterial = (index: number) => {
    setSelectedMaterials(prev => prev.filter((_, i) => i !== index))
  }

  const addMedicine = () => {
    if (!newMedicine.medicineId) {
      toast.error('لطفاً دارو را انتخاب کنید')
      return
    }
    
    const medicine = medicines.find(m => m.id === parseInt(newMedicine.medicineId))
    if (!medicine) return
    
    if (medicine.quantity < newMedicine.quantityUsed) {
      toast.error(`موجودی کافی نیست. موجودی: ${medicine.quantity}`)
      return
    }
    
    const totalPrice = newMedicine.quantityUsed * medicine.pricePerUnit
    
    setSelectedMedicines(prev => [...prev, {
      medicineId: medicine.id,
      medicineName: medicine.name,
      quantityUsed: newMedicine.quantityUsed,
      pricePerUnit: medicine.pricePerUnit,
      totalPrice,
      dosage: newMedicine.dosage,
      instructions: newMedicine.instructions
    }])
    
    setNewMedicine({ medicineId: '', quantityUsed: 1, dosage: '', instructions: '' })
  }

  const removeMedicine = (index: number) => {
    setSelectedMedicines(prev => prev.filter((_, i) => i !== index))
  }

  const addExtraCost = () => {
    if (!newExtraCost.description.trim()) {
      toast.error('لطفاً توضیح هزینه را وارد کنید')
      return
    }
    
    if (newExtraCost.amount <= 0) {
      toast.error('مبلغ هزینه باید بیشتر از صفر باشد')
      return
    }
    
    setExtraCosts(prev => [...prev, { ...newExtraCost }])
    setNewExtraCost({ description: '', amount: 0 })
  }

  const removeExtraCost = (index: number) => {
    setExtraCosts(prev => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    const userStr = localStorage.getItem('user')
    let doctorId = ''
    if (userStr) {
      const user = JSON.parse(userStr)
      doctorId = String(user.id)
    }

    setFormData({
      patientId: '',
      doctorId: doctorId,
      serviceId: '',
      servicePrice: 0,
      discountAmount: 0,
      discountPercent: 0,
      description: ''
    })
    setSelectedMaterials([])
    setSelectedMedicines([])
    setExtraCosts([])
    setNewMaterial({ materialId: '', quantityUsed: 1 })
    setNewMedicine({ medicineId: '', quantityUsed: 1, dosage: '', instructions: '' })
    setNewExtraCost({ description: '', amount: 0 })
    setCalculations({
      servicePrice: 0,
      discount: 0,
      finalPrice: 0,
      materialsCost: 0,
      medicinesCost: 0,
      extraCosts: 0,
      total: 0,
      doctorWage: 0,
      clinicProfit: 0
    })
    setIsSuccess(false)
    setLastTreatmentId(null)
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setIsSuccess(false)

    try {
      const treatmentData = {
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        serviceId: parseInt(formData.serviceId),
        serviceName: services.find(s => s.id === parseInt(formData.serviceId))?.name || '',
        servicePrice: formData.servicePrice,
        discountAmount: formData.discountAmount,
        discountPercent: formData.discountPercent,
        description: formData.description,
        materials: selectedMaterials,
        medicines: selectedMedicines,
        extraCosts: extraCosts
      }

      const response = await axios.post('/api/v1/treatments', treatmentData)
      
      const treatment = response.data.treatment
      setLastTreatmentId(treatment?.id || null)
      setIsSuccess(true)
      
      toast.success('درمان با موفقیت ثبت شد', {
        icon: '✅',
        duration: 3000
      })
      
      const treatmentWithDetails = {
        ...treatment,
        patientName: patients.find(p => p.id === parseInt(formData.patientId))?.fullName || '',
        doctorName: doctors.find(d => d.id === parseInt(formData.doctorId))?.fullName || '',
        serviceName: services.find(s => s.id === parseInt(formData.serviceId))?.name || '',
        items: [
          ...selectedMaterials.map(m => ({ ...m, itemType: 'material' })),
          ...selectedMedicines.map(m => ({ ...m, itemType: 'medicine' }))
        ],
        extraCosts: extraCosts,
        summary: calculations,
        fdate: new Date().toISOString().split('T')[0]
      }
      
      setLastTreatmentData(treatmentWithDetails)
      setShowInvoice(true)
      
    } catch (error: any) {
      console.error('Error registering treatment:', error)
      setIsSuccess(false)
      
      if (error.response?.status === 401) {
        toast.error('لطفاً وارد سیستم شوید')
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('خطا در ثبت درمان')
      }
    } finally {
      setLoading(false)
    }
  }

  const printAgain = () => {
    handlePrint()
  }

  const closeInvoice = () => {
    setShowInvoice(false)
    resetForm()
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-darkblue dark:text-white flex items-center gap-3">
            <FaStethoscope className="text-gold" />
            ثبت درمان جدید
          </h1>
          {lastTreatmentId && (
            <p className="text-sm text-green-500 mt-1">
              ✅ آخرین درمان ثبت شده: کد {lastTreatmentId}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="btn-secondary flex items-center gap-2"
          >
            <FaRedo />
            فرم جدید
          </button>
        </div>
      </div>

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 animate-fadeIn">
          <FaCheckCircle className="text-green-500 text-2xl" />
          <div>
            <p className="text-green-700 dark:text-green-400 font-semibold">درمان با موفقیت ثبت شد!</p>
            <p className="text-sm text-green-600 dark:text-green-300">
              فاکتور آماده نمایش است
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* اطلاعات اصلی */}
        <div className="card dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaUser className="inline ml-1 text-gold" />
                بیمار *
              </label>
              <select
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                required
                disabled={loading}
              >
                <option value="">انتخاب بیمار...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.fullName} - {p.mobile}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaUserMd className="inline ml-1 text-gold" />
                پزشک *
              </label>
              <select
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.doctorId}
                disabled={true}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.fullName} - {d.specialty}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">پزشک جاری به طور خودکار انتخاب شده است</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaSyringe className="inline ml-1 text-gold" />
                خدمت *
              </label>
              <select
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.serviceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">انتخاب خدمت...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} - {s.price.toLocaleString()} تومان</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaMoneyBillWave className="inline ml-1 text-gold" />
                قیمت خدمت (تومان)
              </label>
              <input
                type="number"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.servicePrice}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                <FaPercent className="inline ml-1 text-gold" />
                تخفیف (درصد)
              </label>
              <input
                type="number"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.discountPercent}
                onChange={(e) => {
                  const percent = Number(e.target.value)
                  const discount = (formData.servicePrice * percent) / 100
                  setFormData({...formData, discountPercent: percent, discountAmount: Math.round(discount)})
                }}
                min={0}
                max={100}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
                مبلغ تخفیف (تومان)
              </label>
              <input
                type="number"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={formData.discountAmount}
                onChange={(e) => {
                  const amount = Number(e.target.value)
                  const percent = formData.servicePrice > 0 ? (amount / formData.servicePrice) * 100 : 0
                  setFormData({...formData, discountAmount: amount, discountPercent: Math.round(percent)})
                }}
                min={0}
                disabled={loading}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-darkblue dark:text-white">
              توضیحات
            </label>
            <textarea
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={2}
              placeholder="توضیحات اضافی..."
              disabled={loading}
            />
          </div>
        </div>

        {/* مواد مصرفی */}
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-bold text-darkblue dark:text-white mb-4 flex items-center gap-2">
            <FaBoxes className="text-gold" />
            مواد مصرفی
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <select
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={newMaterial.materialId}
              onChange={(e) => setNewMaterial({...newMaterial, materialId: e.target.value})}
              disabled={loading}
            >
              <option value="">انتخاب ماده...</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.pricePerUnit.toLocaleString()} تومان ({m.quantity} {m.unit})
                </option>
              ))}
            </select>
            <input
              type="number"
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={newMaterial.quantityUsed}
              onChange={(e) => setNewMaterial({...newMaterial, quantityUsed: Number(e.target.value)})}
              placeholder="تعداد"
              min={1}
              disabled={loading}
            />
            <button
              type="button"
              onClick={addMaterial}
              className="btn-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              <FaPlus />
              افزودن
            </button>
          </div>
          {selectedMaterials.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-right py-2 px-3">نام</th>
                    <th className="text-right py-2 px-3">تعداد</th>
                    <th className="text-right py-2 px-3">قیمت واحد</th>
                    <th className="text-right py-2 px-3">جمع</th>
                    <th className="text-center py-2 px-3">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMaterials.map((m, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 px-3">{m.materialName}</td>
                      <td className="py-2 px-3">{m.quantityUsed}</td>
                      <td className="py-2 px-3">{m.pricePerUnit.toLocaleString()}</td>
                      <td className="py-2 px-3 font-bold">{m.totalPrice.toLocaleString()}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeMaterial(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* داروها */}
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-bold text-darkblue dark:text-white mb-4 flex items-center gap-2">
            <FaPills className="text-gold" />
            داروها
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <select
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600 md:col-span-1"
              value={newMedicine.medicineId}
              onChange={(e) => setNewMedicine({...newMedicine, medicineId: e.target.value})}
              disabled={loading}
            >
              <option value="">انتخاب دارو...</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.pricePerUnit.toLocaleString()} تومان ({m.quantity} {m.unit})
                </option>
              ))}
            </select>
            <input
              type="number"
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={newMedicine.quantityUsed}
              onChange={(e) => setNewMedicine({...newMedicine, quantityUsed: Number(e.target.value)})}
              placeholder="تعداد"
              min={1}
              disabled={loading}
            />
            <input
              type="text"
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={newMedicine.dosage}
              onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
              placeholder="دوز مصرفی"
              disabled={loading}
            />
            <button
              type="button"
              onClick={addMedicine}
              className="btn-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              <FaPlus />
              افزودن
            </button>
          </div>
          {selectedMedicines.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-right py-2 px-3">نام</th>
                    <th className="text-right py-2 px-3">تعداد</th>
                    <th className="text-right py-2 px-3">قیمت واحد</th>
                    <th className="text-right py-2 px-3">جمع</th>
                    <th className="text-center py-2 px-3">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMedicines.map((m, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 px-3">
                        {m.medicineName}
                        {m.dosage && <span className="text-xs text-gray-400 block">دوز: {m.dosage}</span>}
                        {m.instructions && <span className="text-xs text-gray-400 block">{m.instructions}</span>}
                      </td>
                      <td className="py-2 px-3">{m.quantityUsed}</td>
                      <td className="py-2 px-3">{m.pricePerUnit.toLocaleString()}</td>
                      <td className="py-2 px-3 font-bold">{m.totalPrice.toLocaleString()}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeMedicine(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* هزینه‌های اضافی */}
        <div className="card dark:bg-gray-800">
          <h3 className="text-lg font-bold text-darkblue dark:text-white mb-4">هزینه‌های اضافی</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={newExtraCost.description}
              onChange={(e) => setNewExtraCost({...newExtraCost, description: e.target.value})}
              placeholder="توضیح هزینه"
              disabled={loading}
            />
            <input
              type="number"
              className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={newExtraCost.amount}
              onChange={(e) => setNewExtraCost({...newExtraCost, amount: Number(e.target.value)})}
              placeholder="مبلغ (تومان)"
              min={0}
              disabled={loading}
            />
            <button
              type="button"
              onClick={addExtraCost}
              className="btn-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              <FaPlus />
              افزودن
            </button>
          </div>
          {extraCosts.length > 0 && (
            <div className="space-y-2">
              {extraCosts.map((c, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span>{c.description}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{c.amount.toLocaleString()} تومان</span>
                    <button
                      type="button"
                      onClick={() => removeExtraCost(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* محاسبات */}
        <div className="card dark:bg-gray-800 bg-gold-light/10 dark:bg-gold-dark/5">
          <h3 className="text-lg font-bold text-darkblue dark:text-white mb-4 flex items-center gap-2">
            <FaCalculator className="text-gold" />
            خلاصه محاسبات
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">قیمت خدمت</p>
              <p className="text-lg font-bold text-darkblue dark:text-white">{calculations.servicePrice.toLocaleString()} تومان</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">تخفیف</p>
              <p className="text-lg font-bold text-red-500">{calculations.discount.toLocaleString()} تومان</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">قیمت نهایی</p>
              <p className="text-lg font-bold text-gold">{calculations.finalPrice.toLocaleString()} تومان</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">دستمزد پزشک (۶۰%)</p>
              <p className="text-lg font-bold text-blue-500">{calculations.doctorWage.toLocaleString()} تومان</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">مواد مصرفی</p>
              <p className="text-lg font-bold text-purple-500">{calculations.materialsCost.toLocaleString()} تومان</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">داروها</p>
              <p className="text-lg font-bold text-indigo-500">{calculations.medicinesCost.toLocaleString()} تومان</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">هزینه‌های اضافی</p>
              <p className="text-lg font-bold text-orange-500">{calculations.extraCosts.toLocaleString()} تومان</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">جمع کل</p>
              <p className="text-2xl font-bold text-gold">{calculations.total.toLocaleString()} تومان</p>
            </div>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                در حال ثبت...
              </>
            ) : (
              <>
                <FaSave />
                ثبت و نمایش فاکتور
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/doctor/dashboard')}
            className="btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <FaTimes />
            بازگشت
          </button>
        </div>
      </form>

      {/* مودال فاکتور */}
      {showInvoice && lastTreatmentData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-darkblue flex items-center gap-2">
                <FaPrint className="text-gold" />
                فاکتور درمان
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={printAgain}
                  className="btn-primary text-sm py-1 px-3 flex items-center gap-1"
                  disabled={isPrinting}
                >
                  <FaPrint />
                  {isPrinting ? 'در حال چاپ...' : 'چاپ'}
                </button>
                <button
                  onClick={closeInvoice}
                  className="btn-secondary text-sm py-1 px-3"
                >
                  <FaTimes className="ml-1" />
                  بستن
                </button>
              </div>
            </div>
            <div className="p-4">
              <TreatmentInvoice
                ref={invoiceRef}
                treatment={lastTreatmentData}
                patientName={lastTreatmentData.patientName}
                doctorName={lastTreatmentData.doctorName}
                serviceName={lastTreatmentData.serviceName}
                items={lastTreatmentData.items || []}
                extraCosts={lastTreatmentData.extraCosts || []}
                summary={lastTreatmentData.summary}
                treatmentId={lastTreatmentData.id}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}