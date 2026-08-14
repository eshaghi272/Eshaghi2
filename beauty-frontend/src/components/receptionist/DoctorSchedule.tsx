// Path: frontend/src/components/receptionist/DoctorSchedule.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../layout/Layout'
import { FaSave, FaTimes, FaArrowLeft, FaClock, FaCalendarAlt } from 'react-icons/fa'

interface ScheduleItem {
  dayOfWeek: number
  dayName: string
  isWorking: boolean
  startTime: string | null
  endTime: string | null
  slotDuration: number
}

export default function DoctorSchedule() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [doctorName, setDoctorName] = useState('')

  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

  useEffect(() => {
    fetchDoctorInfo()
    fetchSchedule()
  }, [doctorId])

  const fetchDoctorInfo = async () => {
    try {
      const response = await axios.get(`/api/v1/users/${doctorId}`)
      setDoctorName(response.data.fullName || 'پزشک')
    } catch (error) {
      console.error('Error fetching doctor:', error)
    }
  }

  const fetchSchedule = async () => {
    try {
      setFetchLoading(true)
      const response = await axios.get(`/api/v1/working-hours/schedule/${doctorId}`)
      setSchedule(response.data)
    } catch (error: any) {
      console.error('Error fetching schedule:', error)
      toast.error('خطا در دریافت برنامه کاری')
      
      // تنظیم مقدار پیش‌فرض
      const defaultSchedule: ScheduleItem[] = weekDays.map((day, index) => ({
        dayOfWeek: index,
        dayName: day,
        isWorking: index < 5,
        startTime: index < 5 ? '09:00' : null,
        endTime: index < 5 ? '18:00' : null,
        slotDuration: 30
      }))
      setSchedule(defaultSchedule)
    } finally {
      setFetchLoading(false)
    }
  }

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule]
    newSchedule[index].isWorking = !newSchedule[index].isWorking
    if (!newSchedule[index].isWorking) {
      newSchedule[index].startTime = null
      newSchedule[index].endTime = null
    } else {
      newSchedule[index].startTime = '09:00'
      newSchedule[index].endTime = '18:00'
    }
    setSchedule(newSchedule)
  }

  const updateTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newSchedule = [...schedule]
    newSchedule[index][field] = value
    setSchedule(newSchedule)
  }

  const updateSlotDuration = (index: number, value: number) => {
    const newSchedule = [...schedule]
    newSchedule[index].slotDuration = value
    setSchedule(newSchedule)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await axios.post(`/api/v1/working-hours/schedule/${doctorId}`, { schedule })
      toast.success('برنامه کاری با موفقیت ذخیره شد')
      navigate('/receptionist/select-doctor-schedule')
    } catch (error: any) {
      console.error('Error saving schedule:', error)
      toast.error('خطا در ذخیره برنامه کاری')
    } finally {
      setLoading(false)
    }
  }

  // بررسی اینکه آیا روز تعطیل است (جمعه = 6)
  const isHoliday = (dayOfWeek: number) => dayOfWeek === 6

  if (fetchLoading) {
    return (
      
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
        </div>
      
    )
  }

  return (
    
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/receptionist/select-doctor-schedule')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaArrowLeft className="text-xl text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-darkblue dark:text-white">
              برنامه کاری {doctorName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              تنظیم روزها و ساعات کاری پزشک
            </p>
          </div>
        </div>

        <div className="card dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    روز هفته
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    وضعیت
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    ساعت شروع
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    ساعت پایان
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    مدت هر بازه (دقیقه)
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, index) => {
                  const isHolidayDay = isHoliday(item.dayOfWeek)
                  const isWeekend = item.dayOfWeek === 5 // پنجشنبه
                  
                  return (
                    <tr key={item.dayOfWeek} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          isHolidayDay 
                            ? 'text-red-500 dark:text-red-400' 
                            : isWeekend
                            ? 'text-orange-500 dark:text-orange-400'
                            : 'text-darkblue dark:text-white'
                        }`}>
                          {item.dayName}
                        </span>
                        {isWeekend && (
                          <span className="text-xs text-orange-400 mr-2">(پایان هفته)</span>
                        )}
                        {isHolidayDay && (
                          <span className="text-xs text-red-400 mr-2">(تعطیل)</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleDay(index)}
                          disabled={isHolidayDay}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isHolidayDay
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                              : item.isWorking
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {isHolidayDay 
                            ? '🔒 تعطیل' 
                            : item.isWorking 
                            ? '✅ فعال' 
                            : '❌ غیرفعال'
                          }
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="time"
                          className={`input-field max-w-[130px] dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                            !item.isWorking || isHolidayDay ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                          value={item.startTime || ''}
                          onChange={(e) => updateTime(index, 'startTime', e.target.value)}
                          disabled={!item.isWorking || isHolidayDay}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="time"
                          className={`input-field max-w-[130px] dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                            !item.isWorking || isHolidayDay ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                          value={item.endTime || ''}
                          onChange={(e) => updateTime(index, 'endTime', e.target.value)}
                          disabled={!item.isWorking || isHolidayDay}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <select
                          className={`input-field max-w-[100px] dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                            !item.isWorking || isHolidayDay ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                          value={item.slotDuration}
                          onChange={(e) => updateSlotDuration(index, Number(e.target.value))}
                          disabled={!item.isWorking || isHolidayDay}
                        >
                          <option value="15">۱۵</option>
                          <option value="20">۲۰</option>
                          <option value="30">۳۰</option>
                          <option value="45">۴۵</option>
                          <option value="60">۶۰</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* خلاصه */}
          <div className="mt-6 p-4 bg-gold-light/20 dark:bg-gold-dark/10 rounded-xl border border-gold/20">
            <h3 className="text-sm font-semibold text-darkblue dark:text-white mb-2">📋 خلاصه برنامه</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">روزهای کاری:</span>
                <span className="font-bold text-green-500 mr-2">
                  {schedule.filter(s => s.isWorking).length} روز
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">روزهای تعطیل:</span>
                <span className="font-bold text-red-500 mr-2">
                  {schedule.filter(s => !s.isWorking).length} روز
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">ساعت شروع:</span>
                <span className="font-bold text-darkblue dark:text-white mr-2">
                  {schedule.find(s => s.isWorking)?.startTime || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">ساعت پایان:</span>
                <span className="font-bold text-darkblue dark:text-white mr-2">
                  {schedule.find(s => s.isWorking)?.endTime || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSubmit}
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
                  ذخیره برنامه
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/receptionist/select-doctor-schedule')}
              className="btn-secondary flex items-center gap-2"
              disabled={loading}
            >
              <FaTimes />
              انصراف
            </button>
          </div>
        </div>
      </div>
    
  )
}