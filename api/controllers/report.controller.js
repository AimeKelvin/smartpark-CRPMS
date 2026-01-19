import Payment from '../models/Payment.js';
import PDFDocument from 'pdfkit';

export const generateMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) return res.status(400).json({ message: 'Month and year are required' });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    // Fetch payments for the given month
    const payments = await Payment.find({
      paymentDate: { $gte: start, $lte: end }
    }).populate({ path: 'record', populate: ['car', 'service'] });

    // Initialize PDF document
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    let filename = `Monthly_Report_${month}-${year}.pdf`;
    filename = encodeURIComponent(filename);

    // Set headers to return PDF
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.fontSize(20).text('CRPMS Monthly Payment Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Month: ${month} / Year: ${year}`);
    doc.moveDown();

    // Table headers
    doc.font('Helvetica-Bold');
    doc.text('Car Plate', 50, doc.y, { continued: true });
    doc.text('Service', 150, doc.y, { continued: true });
    doc.text('Amount Paid', 300, doc.y, { continued: true });
    doc.text('Payment Date', 400, doc.y);
    doc.moveDown();
    doc.font('Helvetica');

    let totalAmount = 0;

    payments.forEach((p) => {
      const carPlate = p.record.car.plateNumber;
      const serviceName = p.record.service.name;
      const amount = p.amountPaid;
      const date = p.paymentDate.toISOString().split('T')[0];

      totalAmount += amount;

      doc.text(carPlate, 50, doc.y, { continued: true });
      doc.text(serviceName, 150, doc.y, { continued: true });
      doc.text(`${amount} RWF`, 300, doc.y, { continued: true });
      doc.text(date, 400, doc.y);
      doc.moveDown();
    });

    doc.moveDown();
    doc.font('Helvetica-Bold').text(`Total Amount: ${totalAmount} RWF`, { align: 'right' });

    doc.end();
    doc.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error generating report' });
  }
};
