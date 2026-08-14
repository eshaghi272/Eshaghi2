// Path: backend/src/controllers/treatment.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class TreatmentController {
  // ========== دریافت لیست درمان‌ها ==========
  static async getTreatments(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { patientId, doctorId, status } = req.query;
      
      let query = `
        SELECT 
          t.*,
          u.fullName as patientName,
          d.fullName as doctorName
        FROM tbl_treatments t
        LEFT JOIN tbl_users u ON t.patientId = u.id
        LEFT JOIN tbl_users d ON t.doctorId = d.id
        WHERE t.clinicId = ?
      `;
      const params: any[] = [clinicId];

      if (patientId) {
        query += ' AND t.patientId = ?';
        params.push(patientId);
      }
      if (doctorId) {
        query += ' AND t.doctorId = ?';
        params.push(doctorId);
      }
      if (status) {
        query += ' AND t.status = ?';
        params.push(status);
      }

      query += ' ORDER BY t.createdAt DESC';

      const treatments = db.prepare(query).all(...params) as any[];
      
      // دریافت اقلام برای هر درمان
      for (const treatment of treatments) {
        const items = db.prepare(`
          SELECT * FROM tbl_treatment_items WHERE treatmentId = ?
        `).all(treatment.id) as any[];
        treatment.items = items;
        
        const extraCosts = db.prepare(`
          SELECT * FROM tbl_treatment_extra_costs WHERE treatmentId = ?
        `).all(treatment.id) as any[];
        treatment.extraCosts = extraCosts;
      }

      res.json(treatments);
    } catch (error) {
      console.error('Get treatments error:', error);
      res.status(500).json({ message: 'خطا در دریافت لیست درمان‌ها' });
    }
  }

  // ========== دریافت یک درمان ==========
  static async getTreatmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;
      
      const treatment = db.prepare(`
        SELECT 
          t.*,
          u.fullName as patientName,
          d.fullName as doctorName
        FROM tbl_treatments t
        LEFT JOIN tbl_users u ON t.patientId = u.id
        LEFT JOIN tbl_users d ON t.doctorId = d.id
        WHERE t.id = ? AND t.clinicId = ?
      `).get(id, clinicId) as any;

      if (!treatment) {
        return res.status(404).json({ message: 'درمان یافت نشد' });
      }

      const items = db.prepare(`
        SELECT * FROM tbl_treatment_items WHERE treatmentId = ?
      `).all(id) as any[];
      treatment.items = items;

      const extraCosts = db.prepare(`
        SELECT * FROM tbl_treatment_extra_costs WHERE treatmentId = ?
      `).all(id) as any[];
      treatment.extraCosts = extraCosts;

      res.json(treatment);
    } catch (error) {
      console.error('Get treatment error:', error);
      res.status(500).json({ message: 'خطا در دریافت درمان' });
    }
  }

  // ========== دریافت اطلاعات فرم ==========
  static async getTreatmentFormData(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const patients = db.prepare(`
        SELECT id, fullName, mobile 
        FROM tbl_users 
        WHERE role = 'patient' AND isActive = 1 AND clinicId = ?
        ORDER BY fullName
      `).all(clinicId) as any[];

      const doctors = db.prepare(`
        SELECT 
          u.id, u.fullName,
          d.specialty, d.consultationFee
        FROM tbl_users u
        LEFT JOIN tbl_doctors d ON d.userId = u.id
        WHERE u.role = 'doctor' AND u.isActive = 1 AND u.clinicId = ?
        ORDER BY u.fullName
      `).all(clinicId) as any[];

      const services = db.prepare(`
        SELECT id, name, price, durationMinutes
        FROM tbl_services 
        WHERE isActive = 1 AND clinicId = ?
        ORDER BY name
      `).all(clinicId) as any[];

      const materials = db.prepare(`
        SELECT id, name, unit, pricePerUnit, quantity
        FROM tbl_materials 
        WHERE isActive = 1 AND quantity > 0 AND clinicId = ?
        ORDER BY name
      `).all(clinicId) as any[];

      const medicines = db.prepare(`
        SELECT id, name, unit, pricePerUnit, quantity
        FROM tbl_medicines 
        WHERE isActive = 1 AND quantity > 0 AND clinicId = ?
        ORDER BY name
      `).all(clinicId) as any[];

      res.json({
        patients,
        doctors,
        services,
        materials,
        medicines
      });
    } catch (error) {
      console.error('Get treatment form data error:', error);
      res.status(500).json({ message: 'خطا در دریافت اطلاعات فرم' });
    }
  }

  // ========== ثبت درمان جدید ==========
  static async createTreatment(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { 
        patientId, doctorId, serviceId, serviceName, servicePrice,
        discountAmount, discountPercent, description,
        materials, medicines, extraCosts 
      } = req.body;

      if (!patientId || !doctorId || !serviceId) {
        return res.status(400).json({ message: 'اطلاعات بیمار، پزشک و خدمت الزامی است' });
      }

      let finalPrice = servicePrice || 0;
      let discount = 0;

      if (discountAmount) {
        discount = discountAmount;
        finalPrice = servicePrice - discountAmount;
      } else if (discountPercent) {
        discount = Math.round((servicePrice * discountPercent) / 100);
        finalPrice = servicePrice - discount;
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_treatments (
          clinicId, patientId, doctorId, serviceId, serviceName, servicePrice,
          discountAmount, discountPercent, finalPrice, description,
          totalMaterialsCost, totalMedicinesCost, totalExtraCosts,
          doctorWage, clinicProfit, finalTotal,
          paymentStatus, paidAmount, remainingAmount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const doctorWage = Math.round(finalPrice * 0.6);
      const clinicProfit = finalPrice - doctorWage;
      let totalMaterialsCost = 0;
      let totalMedicinesCost = 0;
      let totalExtraCosts = 0;
      const finalTotal = finalPrice;

      const result = stmt.run(
        clinicId,
        patientId, doctorId, serviceId,
        serviceName || 'خدمت',
        servicePrice || 0,
        discount || 0,
        discountPercent || 0,
        finalPrice,
        description || null,
        totalMaterialsCost, totalMedicinesCost, totalExtraCosts,
        doctorWage, clinicProfit, finalTotal,
        'pending', 0, finalTotal
      );

      const treatmentId = result.lastInsertRowid;

      let finalMaterialsCost = 0;
      if (materials && Array.isArray(materials) && materials.length > 0) {
        const itemStmt = db.prepare(`
          INSERT INTO tbl_treatment_items (
            clinicId, treatmentId, itemType, itemId, itemName, unit,
            quantityUsed, pricePerUnit, totalPrice
          )
          VALUES (?, ?, 'material', ?, ?, ?, ?, ?, ?)
        `);
        for (const mat of materials) {
          const totalPrice = mat.quantityUsed * mat.pricePerUnit;
          const material = db.prepare('SELECT unit FROM tbl_materials WHERE id = ?').get(mat.materialId) as any;
          itemStmt.run(
            clinicId,
            treatmentId,
            mat.materialId,
            mat.materialName,
            material?.unit || '',
            mat.quantityUsed,
            mat.pricePerUnit,
            totalPrice
          );
          finalMaterialsCost += totalPrice;
        }
      }

      let finalMedicinesCost = 0;
      if (medicines && Array.isArray(medicines) && medicines.length > 0) {
        const itemStmt = db.prepare(`
          INSERT INTO tbl_treatment_items (
            clinicId, treatmentId, itemType, itemId, itemName, unit,
            quantityUsed, pricePerUnit, totalPrice, dosage, instructions
          )
          VALUES (?, ?, 'medicine', ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const med of medicines) {
          const totalPrice = med.quantityUsed * med.pricePerUnit;
          const medicine = db.prepare('SELECT unit FROM tbl_medicines WHERE id = ?').get(med.medicineId) as any;
          itemStmt.run(
            clinicId,
            treatmentId,
            med.medicineId,
            med.medicineName,
            medicine?.unit || '',
            med.quantityUsed,
            med.pricePerUnit,
            totalPrice,
            med.dosage || '',
            med.instructions || ''
          );
          finalMedicinesCost += totalPrice;
        }
      }

      let finalExtraCosts = 0;
      if (extraCosts && Array.isArray(extraCosts) && extraCosts.length > 0) {
        const extraStmt = db.prepare(`
          INSERT INTO tbl_treatment_extra_costs (clinicId, treatmentId, description, amount)
          VALUES (?, ?, ?, ?)
        `);
        for (const cost of extraCosts) {
          extraStmt.run(clinicId, treatmentId, cost.description, cost.amount);
          finalExtraCosts += cost.amount;
        }
      }

      const finalTotalWithItems = finalPrice + finalMaterialsCost + finalMedicinesCost + finalExtraCosts;
      const newDoctorWage = Math.round(finalPrice * 0.6);
      const newClinicProfit = finalPrice - newDoctorWage;

      db.prepare(`
        UPDATE tbl_treatments SET
          totalMaterialsCost = ?,
          totalMedicinesCost = ?,
          totalExtraCosts = ?,
          doctorWage = ?,
          clinicProfit = ?,
          finalTotal = ?
        WHERE id = ?
      `).run(
        finalMaterialsCost, finalMedicinesCost, finalExtraCosts,
        newDoctorWage, newClinicProfit, finalTotalWithItems,
        treatmentId
      );

      const treatment = db.prepare(`
        SELECT 
          t.*,
          u.fullName as patientName,
          d.fullName as doctorName
        FROM tbl_treatments t
        LEFT JOIN tbl_users u ON t.patientId = u.id
        LEFT JOIN tbl_users d ON t.doctorId = d.id
        WHERE t.id = ?
      `).get(treatmentId) as any;

      const items = db.prepare(`SELECT * FROM tbl_treatment_items WHERE treatmentId = ?`).all(treatmentId) as any[];
      treatment.items = items;

      const extraCostsList = db.prepare(`SELECT * FROM tbl_treatment_extra_costs WHERE treatmentId = ?`).all(treatmentId) as any[];
      treatment.extraCosts = extraCostsList;

      res.status(201).json({ message: 'درمان با موفقیت ثبت شد', treatment });
    } catch (error) {
      console.error('Create treatment error:', error);
      res.status(500).json({ message: 'خطا در ثبت درمان: ' + (error as Error).message });
    }
  }

  // ========== بروزرسانی وضعیت پرداخت ==========
  static async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;
      const { paymentStatus, paidAmount, paymentMethod } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_treatments WHERE id = ? AND clinicId = ?').get(id, clinicId) as any;
      if (!existing) {
        return res.status(404).json({ message: 'درمان یافت نشد' });
      }

      let newPaidAmount = paidAmount || existing.paidAmount;
      let newRemainingAmount = existing.finalTotal - newPaidAmount;
      let newPaymentStatus = paymentStatus || existing.paymentStatus;

      if (newPaidAmount >= existing.finalTotal) {
        newPaymentStatus = 'paid';
        newRemainingAmount = 0;
      }

      db.prepare(`
        UPDATE tbl_treatments 
        SET paymentStatus = ?, paidAmount = ?, remainingAmount = ?, paymentMethod = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND clinicId = ?
      `).run(newPaymentStatus, newPaidAmount, newRemainingAmount, paymentMethod || null, id, clinicId);

      if (newPaymentStatus === 'paid') {
        db.prepare('UPDATE tbl_treatments SET status = "completed" WHERE id = ? AND clinicId = ?').run(id, clinicId);
      }

      const treatment = db.prepare('SELECT * FROM tbl_treatments WHERE id = ?').get(id) as any;
      res.json({ message: 'وضعیت پرداخت با موفقیت بروزرسانی شد', treatment });
    } catch (error) {
      console.error('Update payment status error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی وضعیت پرداخت' });
    }
  }

  // ========== گزارش مالی ==========
  static async getFinancialReport(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { startDate, endDate } = req.query;

      let query = `
        SELECT 
          COUNT(*) as totalTreatments,
          SUM(finalTotal) as totalRevenue,
          SUM(doctorWage) as totalDoctorWage,
          SUM(clinicProfit) as totalClinicProfit,
          SUM(totalMaterialsCost) as totalMaterialsCost,
          SUM(totalMedicinesCost) as totalMedicinesCost,
          SUM(totalExtraCosts) as totalExtraCosts,
          SUM(CASE WHEN paymentStatus = 'paid' THEN finalTotal ELSE 0 END) as paidRevenue,
          SUM(CASE WHEN paymentStatus = 'pending' THEN finalTotal ELSE 0 END) as pendingRevenue
        FROM tbl_treatments
        WHERE clinicId = ? AND status = 'completed'
      `;

      const params: any[] = [clinicId];
      if (startDate) {
        query += ' AND performedAt >= ?';
        params.push(startDate);
      }
      if (endDate) {
        query += ' AND performedAt <= ?';
        params.push(endDate);
      }

      const report = db.prepare(query).get(...params) as any;
      res.json(report || {
        totalTreatments: 0,
        totalRevenue: 0,
        totalDoctorWage: 0,
        totalClinicProfit: 0,
        totalMaterialsCost: 0,
        totalMedicinesCost: 0,
        totalExtraCosts: 0,
        paidRevenue: 0,
        pendingRevenue: 0
      });
    } catch (error) {
      console.error('Get financial report error:', error);
      res.status(500).json({ message: 'خطا در دریافت گزارش مالی' });
    }
  }

  // ========== مواد مصرفی ==========
  static async getMaterials(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const materials = db.prepare(`
        SELECT id, name, unit, pricePerUnit, quantity
        FROM tbl_materials 
        WHERE isActive = 1 AND quantity > 0 AND clinicId = ?
        ORDER BY name
      `).all(clinicId) as any[];
      
      res.json(materials);
    } catch (error) {
      console.error('Get materials error:', error);
      res.status(500).json({ message: 'خطا در دریافت مواد مصرفی' });
    }
  }

  // ========== بروزرسانی درمان ==========
  static async updateTreatment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;
      const { status, description } = req.body;

      const existing = db.prepare('SELECT * FROM tbl_treatments WHERE id = ? AND clinicId = ?').get(id, clinicId) as any;
      if (!existing) {
        return res.status(404).json({ message: 'درمان یافت نشد' });
      }

      let updateFields: string[] = [];
      let params: any[] = [];

      if (status) {
        updateFields.push('status = ?');
        params.push(status);
      }
      if (description !== undefined) {
        updateFields.push('description = ?');
        params.push(description);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'اطلاعاتی برای بروزرسانی ارسال نشده است' });
      }

      updateFields.push('updatedAt = CURRENT_TIMESTAMP');
      params.push(id);

      const query = `UPDATE tbl_treatments SET ${updateFields.join(', ')} WHERE id = ? AND clinicId = ?`;
      db.prepare(query).run(...params, clinicId);

      const treatment = db.prepare('SELECT * FROM tbl_treatments WHERE id = ?').get(id) as any;
      res.json({ message: 'درمان با موفقیت بروزرسانی شد', treatment });
    } catch (error) {
      console.error('Update treatment error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی درمان' });
    }
  }

  // ========== حذف درمان ==========
  static async deleteTreatment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;

      const existing = db.prepare('SELECT * FROM tbl_treatments WHERE id = ? AND clinicId = ?').get(id, clinicId) as any;
      if (!existing) {
        return res.status(404).json({ message: 'درمان یافت نشد' });
      }

      db.prepare('DELETE FROM tbl_treatment_items WHERE treatmentId = ? AND clinicId = ?').run(id, clinicId);
      db.prepare('DELETE FROM tbl_treatment_extra_costs WHERE treatmentId = ? AND clinicId = ?').run(id, clinicId);
      db.prepare('DELETE FROM tbl_treatments WHERE id = ? AND clinicId = ?').run(id, clinicId);

      res.json({ message: 'درمان با موفقیت حذف شد' });
    } catch (error) {
      console.error('Delete treatment error:', error);
      res.status(500).json({ message: 'خطا در حذف درمان' });
    }
  }

  // ========== داروها ==========
  static async getMedicines(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const medicines = db.prepare(`
        SELECT id, name, unit, pricePerUnit, quantity
        FROM tbl_medicines 
        WHERE isActive = 1 AND quantity > 0 AND clinicId = ?
        ORDER BY name
      `).all(clinicId) as any[];
      
      res.json(medicines);
    } catch (error) {
      console.error('Get medicines error:', error);
      res.status(500).json({ message: 'خطا در دریافت داروها' });
    }
  }
}