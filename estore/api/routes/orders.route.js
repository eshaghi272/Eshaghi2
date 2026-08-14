// routes/orders.route.js
import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();
const db = new Database('./estore.db');

// Initialize database tables if they don't exist
const initializeDB = () => {
  // Create orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tbl_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT,
      customer_address TEXT,
      total_amount REAL NOT NULL,
      discount_amount REAL DEFAULT 0.0,
      final_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_method TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create order_items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tbl_order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES tbl_orders(id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON tbl_orders(customer_email);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON tbl_orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON tbl_orders(created_at);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON tbl_order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON tbl_order_items(product_id);
  `);
};

initializeDB();

// Generate unique order number
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}${month}-${random}`;
};

// GET all orders with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      customer_email,
      start_date,
      end_date,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClauses = [];
    let params = [];

    if (status) {
      whereClauses.push('status = ?');
      params.push(status);
    }

    if (customer_email) {
      whereClauses.push('customer_email LIKE ?');
      params.push(`%${customer_email}%`);
    }

    if (start_date) {
      whereClauses.push('DATE(created_at) >= ?');
      params.push(start_date);
    }

    if (end_date) {
      whereClauses.push('DATE(created_at) <= ?');
      params.push(end_date);
    }

    if (search) {
      whereClauses.push('(order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Get total count
    const countStmt = db.prepare(`SELECT COUNT(*) as total FROM tbl_orders ${whereSQL}`);
    const countResult = countStmt.get(...params);
    const total = countResult.total;

    // Get orders
    const ordersStmt = db.prepare(`
      SELECT * FROM tbl_orders 
      ${whereSQL}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    const orders = ordersStmt.all(...params, limit, offset);

    // Get order items for each order
    const ordersWithItems = orders.map(order => {
      const itemsStmt = db.prepare('SELECT * FROM tbl_order_items WHERE order_id = ?');
      const items = itemsStmt.all(order.id);
      return { ...order, items };
    });

    res.json({
      success: true,
      message: 'لیست سفارشات با موفقیت دریافت شد',
      data: ordersWithItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست سفارشات',
      error: error.message
    });
  }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const orderStmt = db.prepare('SELECT * FROM tbl_orders WHERE id = ?');
    const order = orderStmt.get(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش مورد نظر یافت نشد'
      });
    }

    const itemsStmt = db.prepare('SELECT * FROM tbl_order_items WHERE order_id = ?');
    const items = itemsStmt.all(id);

    res.json({
      success: true,
      message: 'سفارش با موفقیت دریافت شد',
      data: { ...order, items }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سفارش',
      error: error.message
    });
  }
});

// GET order by order number
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const orderStmt = db.prepare('SELECT * FROM tbl_orders WHERE order_number = ?');
    const order = orderStmt.get(orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش با شماره مورد نظر یافت نشد'
      });
    }

    const itemsStmt = db.prepare('SELECT * FROM tbl_order_items WHERE order_id = ?');
    const items = itemsStmt.all(order.id);

    res.json({
      success: true,
      message: 'سفارش با موفقیت دریافت شد',
      data: { ...order, items }
    });
  } catch (error) {
    console.error('Error fetching order by number:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سفارش',
      error: error.message
    });
  }
});

// POST create new order
router.post('/', async (req, res) => {
  const transaction = db.transaction(() => {
    try {
      const {
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        total_amount,
        discount_amount = 0,
        payment_method,
        notes,
        items
      } = req.body;

      if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
        throw new Error('اطلاعات مشتری و آیتم‌های سفارش الزامی است');
      }

      // Calculate final amount
      const finalAmount = total_amount - discount_amount;

      // Generate order number
      const orderNumber = generateOrderNumber();

      // Insert order
      const orderStmt = db.prepare(`
        INSERT INTO tbl_orders (
          order_number, customer_name, customer_email, customer_phone, 
          customer_address, total_amount, discount_amount, final_amount,
          payment_method, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const orderResult = orderStmt.run(
        orderNumber,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        total_amount,
        discount_amount,
        finalAmount,
        payment_method,
        notes
      );

      const orderId = orderResult.lastInsertRowid;

      // Insert order items
      const itemStmt = db.prepare(`
        INSERT INTO tbl_order_items (
          order_id, product_id, product_name, quantity, 
          unit_price, total_price
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        if (!item.product_id || !item.product_name || !item.quantity || !item.unit_price) {
          throw new Error('اطلاعات آیتم سفارش ناقص است');
        }
        itemStmt.run(
          orderId,
          item.product_id,
          item.product_name,
          item.quantity,
          item.unit_price,
          item.quantity * item.unit_price
        );
      }

      // Get created order with items
      const createdOrderStmt = db.prepare('SELECT * FROM tbl_orders WHERE id = ?');
      const createdOrder = createdOrderStmt.get(orderId);

      const createdItemsStmt = db.prepare('SELECT * FROM tbl_order_items WHERE order_id = ?');
      const createdItems = createdItemsStmt.all(orderId);

      return { order: createdOrder, items: createdItems };
    } catch (error) {
      throw error;
    }
  });

  try {
    const result = transaction();
    
    res.status(201).json({
      success: true,
      message: 'سفارش با موفقیت ایجاد شد',
      data: { ...result.order, items: result.items }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({
      success: false,
      message: 'خطا در ایجاد سفارش',
      error: error.message
    });
  }
});

// PUT update order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      status,
      payment_method,
      notes
    } = req.body;

    // Check if order exists
    const checkStmt = db.prepare('SELECT id FROM tbl_orders WHERE id = ?');
    const existingOrder = checkStmt.get(id);

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'سفارش مورد نظر یافت نشد'
      });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (customer_name !== undefined) {
      updates.push('customer_name = ?');
      params.push(customer_name);
    }

    if (customer_email !== undefined) {
      updates.push('customer_email = ?');
      params.push(customer_email);
    }

    if (customer_phone !== undefined) {
      updates.push('customer_phone = ?');
      params.push(customer_phone);
    }

    if (customer_address !== undefined) {
      updates.push('customer_address = ?');
      params.push(customer_address);
    }

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (payment_method !== undefined) {
      updates.push('payment_method = ?');
      params.push(payment_method);
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    // Always update the updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');

    if (updates.length === 1) { // Only updated_at was added
      return res.status(400).json({
        success: false,
        message: 'هیچ فیلدی برای به‌روزرسانی ارسال نشده است'
      });
    }

    params.push(id);

    const updateStmt = db.prepare(`
      UPDATE tbl_orders 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    updateStmt.run(...params);

    // Get updated order
    const orderStmt = db.prepare('SELECT * FROM tbl_orders WHERE id = ?');
    const order = orderStmt.get(id);

    const itemsStmt = db.prepare('SELECT * FROM tbl_order_items WHERE order_id = ?');
    const items = itemsStmt.all(id);

    res.json({
      success: true,
      message: 'سفارش با موفقیت به‌روزرسانی شد',
      data: { ...order, items }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی سفارش',
      error: error.message
    });
  }
});

// PATCH update order status only
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'وضعیت جدید الزامی است'
      });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'وضعیت نامعتبر است',
        validStatuses
      });
    }

    const checkStmt = db.prepare('SELECT id FROM tbl_orders WHERE id = ?');
    const existingOrder = checkStmt.get(id);

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'سفارش مورد نظر یافت نشد'
      });
    }

    const updateStmt = db.prepare(`
      UPDATE tbl_orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    updateStmt.run(status, id);

    const orderStmt = db.prepare('SELECT * FROM tbl_orders WHERE id = ?');
    const order = orderStmt.get(id);

    res.json({
      success: true,
      message: 'وضعیت سفارش با موفقیت به‌روزرسانی شد',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی وضعیت سفارش',
      error: error.message
    });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if order exists
    const checkStmt = db.prepare('SELECT * FROM tbl_orders WHERE id = ?');
    const existingOrder = checkStmt.get(id);

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'سفارش مورد نظر یافت نشد'
      });
    }

    // Delete order (cascade will delete order items)
    const deleteStmt = db.prepare('DELETE FROM tbl_orders WHERE id = ?');
    deleteStmt.run(id);

    res.json({
      success: true,
      message: 'سفارش با موفقیت حذف شد',
      data: existingOrder
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف سفارش',
      error: error.message
    });
  }
});

// GET order statistics
router.get('/statistics/summary', async (req, res) => {
  try {
    const { period = 'today' } = req.query;
    let dateCondition = '';

    switch (period) {
      case 'today':
        dateCondition = 'DATE(created_at) = DATE("now")';
        break;
      case 'week':
        dateCondition = 'created_at >= DATE("now", "-7 days")';
        break;
      case 'month':
        dateCondition = 'created_at >= DATE("now", "-1 month")';
        break;
      case 'year':
        dateCondition = 'created_at >= DATE("now", "-1 year")';
        break;
      default:
        dateCondition = '1=1';
    }

    // Total orders and revenue
    const summaryStmt = db.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(final_amount) as total_revenue,
        AVG(final_amount) as average_order_value,
        MIN(final_amount) as min_order_value,
        MAX(final_amount) as max_order_value
      FROM tbl_orders 
      WHERE ${dateCondition}
    `);

    const summary = summaryStmt.get();

    // Orders by status
    const statusStmt = db.prepare(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(final_amount) as revenue
      FROM tbl_orders 
      WHERE ${dateCondition}
      GROUP BY status
    `);

    const byStatus = statusStmt.all();

    // Daily revenue for last 7 days
    const dailyStmt = db.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(final_amount) as daily_revenue
      FROM tbl_orders 
      WHERE created_at >= DATE("now", "-7 days")
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    const dailyStats = dailyStmt.all();

    res.json({
      success: true,
      message: 'آمار سفارشات با موفقیت دریافت شد',
      data: {
        summary,
        byStatus,
        dailyStats,
        period
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار سفارشات',
      error: error.message
    });
  }
});

export default router;