// Path: backend/src/controllers/financial.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class FinancialController {
  // ============================================
  // ===== گزارش مالی جامع =====
  // ============================================

  // دریافت گزارش مالی کلی
  static async getFinancialReport(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { startDate, endDate, period = 'monthly' } = req.query;

      let dateFilter = '';
      const params: any[] = [clinicId];

      if (startDate && endDate) {
        dateFilter = ' AND date(t.createdAt) BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }

      // ===== 1. خلاصه کلی =====
      const overview = db.prepare(`
        SELECT 
          COUNT(*) as totalTreatments,
          COALESCE(SUM(t.finalTotal), 0) as totalRevenue,
          COALESCE(SUM(t.doctorWage), 0) as totalDoctorWage,
          COALESCE(SUM(t.clinicProfit), 0) as totalClinicProfit,
          COALESCE(SUM(t.totalMaterialsCost), 0) as totalMaterialsCost,
          COALESCE(SUM(t.totalMedicinesCost), 0) as totalMedicinesCost,
          COALESCE(SUM(t.totalExtraCosts), 0) as totalExtraCosts,
          COALESCE(AVG(t.finalTotal), 0) as averageTreatmentPrice,
          COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completedTreatments,
          COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pendingTreatments,
          COUNT(CASE WHEN t.status = 'cancelled' THEN 1 END) as cancelledTreatments,
          COUNT(CASE WHEN t.paymentStatus = 'paid' THEN 1 END) as paidTreatments,
          COUNT(CASE WHEN t.paymentStatus = 'pending' THEN 1 END) as unpaidTreatments
        FROM tbl_treatments t
        WHERE t.clinicId = ? ${dateFilter}
      `).get(...params);

      // ===== 2. درآمد روزانه/ماهانه/سالانه =====
      let groupBy = '';
      let dateFormat = '';

      switch (period) {
        case 'daily':
          groupBy = 'DATE(t.createdAt)';
          dateFormat = '%Y-%m-%d';
          break;
        case 'monthly':
          groupBy = "strftime('%Y-%m', t.createdAt)";
          dateFormat = '%Y-%m';
          break;
        case 'yearly':
          groupBy = "strftime('%Y', t.createdAt)";
          dateFormat = '%Y';
          break;
        default:
          groupBy = "strftime('%Y-%m', t.createdAt)";
          dateFormat = '%Y-%m';
      }

      const revenueByPeriod = db.prepare(`
        SELECT 
          strftime('${dateFormat}', t.createdAt) as period,
          COUNT(*) as treatmentCount,
          COALESCE(SUM(t.finalTotal), 0) as revenue,
          COALESCE(SUM(t.doctorWage), 0) as doctorWage,
          COALESCE(SUM(t.clinicProfit), 0) as clinicProfit,
          COALESCE(AVG(t.finalTotal), 0) as averagePrice
        FROM tbl_treatments t
        WHERE t.clinicId = ? ${dateFilter}
        GROUP BY ${groupBy}
        ORDER BY t.createdAt DESC
        LIMIT 12
      `).all(...params);

      // ===== 3. آمار خدمات =====
      const serviceStats = db.prepare(`
        SELECT 
          t.serviceName,
          COUNT(*) as count,
          COALESCE(SUM(t.finalTotal), 0) as totalRevenue,
          COALESCE(AVG(t.finalTotal), 0) as averagePrice,
          COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completedCount
        FROM tbl_treatments t
        WHERE t.clinicId = ? ${dateFilter}
        GROUP BY t.serviceName
        ORDER BY totalRevenue DESC
        LIMIT 10
      `).all(...params);

      // ===== 4. آمار پزشکان =====
      const doctorStats = db.prepare(`
        SELECT 
          u.fullName as doctorName,
          COUNT(t.id) as treatmentCount,
          COALESCE(SUM(t.finalTotal), 0) as totalRevenue,
          COALESCE(SUM(t.doctorWage), 0) as totalWage,
          COALESCE(AVG(t.finalTotal), 0) as averagePrice,
          COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completedCount
        FROM tbl_treatments t
        LEFT JOIN tbl_users u ON t.doctorId = u.id
        WHERE t.clinicId = ? ${dateFilter}
        GROUP BY t.doctorId
        ORDER BY totalRevenue DESC
      `).all(...params);

      // ===== 5. روند درآمد =====
      const revenueTrend = db.prepare(`
        SELECT 
          strftime('%Y-%m', t.createdAt) as month,
          COALESCE(SUM(t.finalTotal), 0) as revenue,
          COUNT(*) as count
        FROM tbl_treatments t
        WHERE t.clinicId = ? ${dateFilter}
        GROUP BY strftime('%Y-%m', t.createdAt)
        ORDER BY t.createdAt ASC
        LIMIT 12
      `).all(...params);

      // ===== 6. وضعیت پرداخت‌ها =====
      const paymentStatus = db.prepare(`
        SELECT 
          t.paymentStatus,
          COUNT(*) as count,
          COALESCE(SUM(t.finalTotal), 0) as totalAmount,
          COALESCE(SUM(t.paidAmount), 0) as paidAmount,
          COALESCE(SUM(t.remainingAmount), 0) as remainingAmount
        FROM tbl_treatments t
        WHERE t.clinicId = ? ${dateFilter}
        GROUP BY t.paymentStatus
      `).all(...params);

      // ===== 7. هزینه‌های جاری =====
      const currentCosts = db.prepare(`
        SELECT 
          'مواد مصرفی' as category,
          COALESCE(SUM(totalMaterialsCost), 0) as amount
        FROM tbl_treatments
        WHERE clinicId = ? ${dateFilter}
        UNION ALL
        SELECT 
          'داروها' as category,
          COALESCE(SUM(totalMedicinesCost), 0) as amount
        FROM tbl_treatments
        WHERE clinicId = ? ${dateFilter}
        UNION ALL
        SELECT 
          'هزینه‌های اضافی' as category,
          COALESCE(SUM(totalExtraCosts), 0) as amount
        FROM tbl_treatments
        WHERE clinicId = ? ${dateFilter}
        UNION ALL
        SELECT 
          'دستمزد پزشکان' as category,
          COALESCE(SUM(doctorWage), 0) as amount
        FROM tbl_treatments
        WHERE clinicId = ? ${dateFilter}
      `).all(...params, ...params, ...params, ...params);

      res.json({
        overview,
        revenueByPeriod,
        serviceStats,
        doctorStats,
        revenueTrend,
        paymentStatus,
        currentCosts,
        summary: {
          totalRevenue: overview?.totalRevenue || 0,
          totalProfit: overview?.totalClinicProfit || 0,
          totalCosts: (overview?.totalMaterialsCost || 0) + 
                      (overview?.totalMedicinesCost || 0) + 
                      (overview?.totalExtraCosts || 0) +
                      (overview?.totalDoctorWage || 0),
          successRate: overview?.totalTreatments > 0 
            ? Math.round((overview?.completedTreatments / overview?.totalTreatments) * 100)
            : 0
        }
      });
    } catch (error) {
      console.error('❌ Financial report error:', error);
      res.status(500).json({ message: 'خطا در دریافت گزارش مالی' });
    }
  }

  // ============================================
  // ===== گزارش درآمد پزشکان =====
  // ============================================

  static async getDoctorEarnings(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { startDate, endDate } = req.query;

      let dateFilter = '';
      const params: any[] = [clinicId];

      if (startDate && endDate) {
        dateFilter = ' AND date(t.createdAt) BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }

      const doctors = db.prepare(`
        SELECT 
          u.id as doctorId,
          u.fullName as doctorName,
          COUNT(t.id) as treatmentCount,
          COALESCE(SUM(t.finalTotal), 0) as totalRevenue,
          COALESCE(SUM(t.doctorWage), 0) as totalWage,
          COALESCE(AVG(t.finalTotal), 0) as averagePrice,
          COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completedCount,
          COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pendingCount,
          COUNT(CASE WHEN t.status = 'cancelled' THEN 1 END) as cancelledCount
        FROM tbl_treatments t
        LEFT JOIN tbl_users u ON t.doctorId = u.id
        WHERE t.clinicId = ? ${dateFilter}
        GROUP BY t.doctorId
        ORDER BY totalRevenue DESC
      `).all(...params);

      res.json(doctors);
    } catch (error) {
      console.error('❌ Doctor earnings error:', error);
      res.status(500).json({ message: 'خطا در دریافت درآمد پزشکان' });
    }
  }

  // ============================================
  // ===== گزارش خدمات پرفروش =====
  // ============================================

  static async getTopServices(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { limit = 10, startDate, endDate } = req.query;

      let dateFilter = '';
      const params: any[] = [clinicId];

      if (startDate && endDate) {
        dateFilter = ' AND date(t.createdAt) BETWEEN ? AND ?';
        params.push(startDate, endDate);
      }

      const services = db.prepare(`
        SELECT 
          t.serviceName,
          COUNT(*) as count,
          COALESCE(SUM(t.finalTotal), 0) as totalRevenue,
          COALESCE(AVG(t.finalTotal), 0) as averagePrice,
          COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completedCount
        FROM tbl_treatments t
        WHERE t.clinicId = ? ${dateFilter}
        GROUP BY t.serviceName
        ORDER BY totalRevenue DESC
        LIMIT ?
      `).all(...params, Number(limit));

      res.json(services);
    } catch (error) {
      console.error('❌ Top services error:', error);
      res.status(500).json({ message: 'خطا در دریافت خدمات پرفروش' });
    }
  }

  // ============================================
  // ===== گزارش روزانه/ماهانه =====
  // ============================================

  static async getDailyReport(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const date = req.query.date || new Date().toISOString().split('T')[0];

      const report = db.prepare(`
        SELECT 
          COUNT(*) as totalTreatments,
          COALESCE(SUM(finalTotal), 0) as totalRevenue,
          COALESCE(SUM(doctorWage), 0) as totalDoctorWage,
          COALESCE(SUM(clinicProfit), 0) as totalClinicProfit,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN paymentStatus = 'paid' THEN 1 END) as paid,
          COUNT(CASE WHEN paymentStatus = 'pending' THEN 1 END) as unpaid
        FROM tbl_treatments
        WHERE clinicId = ? AND date(createdAt) = ?
      `).get(clinicId, date);

      res.json({
        date,
        ...report
      });
    } catch (error) {
      console.error('❌ Daily report error:', error);
      res.status(500).json({ message: 'خطا در دریافت گزارش روزانه' });
    }
  }
}