// Path: frontend/src/utils/persianDate.ts
import moment from 'moment-jalaali'

// تبدیل تاریخ میلادی به شمسی
export function toPersianDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return moment(d).format('jYYYYjMMjDD')
}

// تبدیل تاریخ شمسی به میلادی
export function fromPersianDate(persianDate: string): Date {
  const year = parseInt(persianDate.substring(0, 4))
  const month = parseInt(persianDate.substring(4, 6))
  const day = parseInt(persianDate.substring(6, 8))
  const momentObj = moment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD')
  return momentObj.toDate()
}

// بررسی معتبر بودن تاریخ شمسی
export function isValidPersianDate(date: string): boolean {
  if (!date || date.length !== 8) return false
  if (!/^[0-9]{8}$/.test(date)) return false
  const year = parseInt(date.substring(0, 4))
  const month = parseInt(date.substring(4, 6))
  const day = parseInt(date.substring(6, 8))
  if (year < 1300 || year > 1500) return false
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  return true
}

// فرمت تاریخ شمسی برای نمایش
export function formatPersianDate(date: string): string {
  if (!isValidPersianDate(date)) return date
  const year = date.substring(0, 4)
  const month = date.substring(4, 6)
  const day = date.substring(6, 8)
  const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
  return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${year}`
}

// دریافت تاریخ امروز به شمسی
export function getTodayPersian(): string {
  return toPersianDate(new Date())
}

// دریافت نام ماه شمسی
export function getPersianMonthName(month: number): string {
  const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
  return monthNames[month - 1] || ''
}

// دریافت تعداد روزهای ماه شمسی
export function getPersianMonthDays(year: number, month: number): number {
  if (month <= 6) return 31
  if (month <= 11) return 30
  // اسفند: ۲۹ یا ۳۰ روز (کبیسه)
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  return isLeap ? 30 : 29
}

// دریافت اولین روز ماه شمسی (۰=شنبه)
export function getFirstDayOfPersianMonth(year: number, month: number): number {
  // ۱ فروردین ۱۴۰۰ = ۲۱ مارس ۲۰۲۱ (یکشنبه = ۱)
  const baseDate = new Date(2021, 2, 21)
  const targetDate = moment(`${year}/${month}/1`, 'jYYYY/jMM/jDD').toDate()
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000))
  const firstDay = (1 + diffDays) % 7
  return firstDay // ۰=شنبه, ۱=یکشنبه, ...
}