// Path: backend/src/controllers/contact.controller.ts
import { Request, Response } from 'express';
import { db } from '../config/database';

export class ContactController {
  static async getContactInfo(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const contactInfo = db.prepare(`
        SELECT 
          id, address, addressLink, phone1, phone2,
          email1, email2, workingHours, workingHoursDescription, mapUrl
        FROM tbl_contact_info 
        WHERE clinicId = ? AND isActive = 1
        ORDER BY id DESC LIMIT 1
      `).get(clinicId) as any;

      if (!contactInfo) {
        return res.status(404).json({ message: 'اطلاعات تماس یافت نشد' });
      }

      res.json(contactInfo);
    } catch (error) {
      console.error('❌ Get contact info error:', error);
      res.status(500).json({ message: 'خطا در دریافت اطلاعات تماس' });
    }
  }

  static async getContactSettings(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;

      const settings = db.prepare(`
        SELECT contactTitle, contactSubtitle, responseTime, supportMessage,
               socialInstagram, socialTelegram, socialWhatsapp
        FROM tbl_contact_settings 
        WHERE clinicId = ? AND isActive = 1 LIMIT 1
      `).get(clinicId) as any;

      res.json(settings || {});
    } catch (error) {
      console.error('❌ Get contact settings error:', error);
      res.status(500).json({ message: 'خطا در دریافت تنظیمات تماس' });
    }
  }

  static async getUserMessages(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const clinicId = req.user?.clinicId || 1;

      if (!userId) {
        return res.status(401).json({ message: 'احراز هویت لازم است' });
      }

      const messages = db.prepare(`
        SELECT id, name, email, phone, subject, message, reply,
               status, isReply, parentId, createdAt, repliedAt
        FROM tbl_contact_messages 
        WHERE userId = ? AND clinicId = ?
        ORDER BY createdAt DESC
      `).all(userId, clinicId) as any[];

      res.json(messages);
    } catch (error) {
      console.error('❌ Get user messages error:', error);
      res.status(500).json({ message: 'خطا در دریافت پیام‌های کاربر' });
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const { name, email, phone, subject, message, parentId } = req.body;
      const userId = req.user?.id || null;
      const clinicId = req.user?.clinicId || 1;

      if (!name || !phone || !subject || !message) {
        return res.status(400).json({ message: 'تمامی فیلدهای الزامی را پر کنید' });
      }

      if (parentId) {
        const parent = db.prepare(
          'SELECT * FROM tbl_contact_messages WHERE id = ? AND clinicId = ?'
        ).get(parentId, clinicId) as any;
        
        if (!parent) {
          return res.status(404).json({ message: 'پیام والد یافت نشد' });
        }
      }

      const stmt = db.prepare(`
        INSERT INTO tbl_contact_messages (
          clinicId, userId, name, email, phone, subject, message, 
          parentId, isReply, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        clinicId, userId, name, email || null, phone,
        subject, message, parentId || null, parentId ? 1 : 0, 'pending'
      );

      const contactMessage = db.prepare(
        'SELECT * FROM tbl_contact_messages WHERE id = ?'
      ).get(result.lastInsertRowid) as any;

      res.status(201).json({
        message: 'پیام شما با موفقیت ارسال شد. در اسرع وقت پاسخ داده می‌شود.',
        data: contactMessage
      });
    } catch (error) {
      console.error('❌ Send message error:', error);
      res.status(500).json({ message: 'خطا در ارسال پیام' });
    }
  }

  static async getMessages(req: Request, res: Response) {
    try {
      const clinicId = req.user?.clinicId || 1;
      const { status, userId } = req.query;

      let query = `
        SELECT id, userId, name, email, phone, subject, message, reply,
               status, isReply, parentId, createdAt, repliedAt
        FROM tbl_contact_messages WHERE clinicId = ?
      `;
      const params: any[] = [clinicId];

      if (status) { query += ' AND status = ?'; params.push(status); }
      if (userId) { query += ' AND userId = ?'; params.push(userId); }

      query += ' ORDER BY createdAt DESC';

      const messages = db.prepare(query).all(...params) as any[];
      res.json(messages);
    } catch (error) {
      console.error('❌ Get messages error:', error);
      res.status(500).json({ message: 'خطا در دریافت پیام‌ها' });
    }
  }

  static async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clinicId = req.user?.clinicId || 1;

      const existing = db.prepare(
        'SELECT * FROM tbl_contact_messages WHERE id = ? AND clinicId = ?'
      ).get(id, clinicId) as any;

      if (!existing) {
        return res.status(404).json({ message: 'پیام یافت نشد' });
      }

      db.prepare(`
        UPDATE tbl_contact_messages SET status = 'read', updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND clinicId = ?
      `).run(id, clinicId);

      const message = db.prepare('SELECT * FROM tbl_contact_messages WHERE id = ?').get(id) as any;
      res.json({ message: 'وضعیت پیام با موفقیت بروزرسانی شد', data: message });
    } catch (error) {
      console.error('❌ Mark as read error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی وضعیت پیام' });
    }
  }

  static async updateMessageStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const clinicId = req.user?.clinicId || 1;

      const existing = db.prepare(
        'SELECT * FROM tbl_contact_messages WHERE id = ? AND clinicId = ?'
      ).get(id, clinicId) as any;

      if (!existing) {
        return res.status(404).json({ message: 'پیام یافت نشد' });
      }

      db.prepare(`
        UPDATE tbl_contact_messages SET status = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND clinicId = ?
      `).run(status, id, clinicId);

      const message = db.prepare('SELECT * FROM tbl_contact_messages WHERE id = ?').get(id) as any;
      res.json({ message: 'وضعیت پیام با موفقیت بروزرسانی شد', data: message });
    } catch (error) {
      console.error('❌ Update message status error:', error);
      res.status(500).json({ message: 'خطا در بروزرسانی وضعیت پیام' });
    }
  }

  static async replyMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reply } = req.body;
      const clinicId = req.user?.clinicId || 1;

      if (!reply) {
        return res.status(400).json({ message: 'متن پاسخ را وارد کنید' });
      }

      const existing = db.prepare(
        'SELECT * FROM tbl_contact_messages WHERE id = ? AND clinicId = ?'
      ).get(id, clinicId) as any;

      if (!existing) {
        return res.status(404).json({ message: 'پیام یافت نشد' });
      }

      db.prepare(`
        UPDATE tbl_contact_messages SET reply = ?, status = 'replied',
          repliedAt = CURRENT_TIMESTAMP, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND clinicId = ?
      `).run(reply, id, clinicId);

      const message = db.prepare('SELECT * FROM tbl_contact_messages WHERE id = ?').get(id) as any;
      res.json({ message: 'پاسخ با موفقیت ارسال شد', data: message });
    } catch (error) {
      console.error('❌ Reply message error:', error);
      res.status(500).json({ message: 'خطا در ارسال پاسخ' });
    }
  }
}