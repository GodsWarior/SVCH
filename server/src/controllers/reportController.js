const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } = require('docx');
const { Op } = require('sequelize');
const { Order, OrderItem, Product } = require('../models');

const downloadSalesReport = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.from || req.query.to) {
      where.createdAt = {};
      if (req.query.from) where.createdAt[Op.gte] = new Date(req.query.from);
      if (req.query.to) where.createdAt[Op.lte] = new Date(req.query.to);
    }

    const orders = await Order.findAll({ where, include: [OrderItem], order: [['createdAt', 'DESC']] });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="sales-report.pdf"');

    const doc = new PDFDocument({ margin: 48 });
    doc.pipe(res);
    doc.fontSize(20).text('FreshMarket Sales Report');
    doc.moveDown();
    doc.fontSize(12).text(`Orders: ${orders.length}`);
    doc.text(`Revenue: ${orders.reduce((sum, order) => sum + Number(order.total), 0).toFixed(2)}`);
    doc.moveDown();
    orders.forEach((order) => {
      doc.text(`#${order.id} | ${order.status} | ${Number(order.total).toFixed(2)} | ${order.createdAt.toLocaleDateString()}`);
    });
    doc.end();
  } catch (error) {
    next(error);
  }
};

const downloadStockReport = async (req, res, next) => {
  try {
    const products = await Product.findAll({ order: [['stock', 'ASC']] });
    const rows = [
      new TableRow({
        children: ['Product', 'Price', 'Stock'].map((text) => new TableCell({ children: [new Paragraph(text)] })),
      }),
      ...products.map((product) => new TableRow({
        children: [
          product.name,
          String(product.price),
          String(product.stock),
        ].map((text) => new TableCell({ children: [new Paragraph(text)] })),
      })),
    ];

    const document = new Document({
      sections: [{
        children: [
          new Paragraph('FreshMarket Stock Report'),
          new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(document);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="stock-report.docx"');
    return res.send(buffer);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  downloadSalesReport,
  downloadStockReport,
};
