import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Car, BillData, DailyReportData } from '../types';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { formatCurrency, formatDate, formatDateForInput } from '../utils/formatters';
import { Printer } from 'lucide-react';
export const Reports = () => {
  const [activeTab, setActiveTab] = useState<'bill' | 'daily'>('bill');
  const [cars, setCars] = useState<Car[]>([]);
  // Bill State
  const [selectedPlate, setSelectedPlate] = useState('');
  const [billData, setBillData] = useState<BillData | null>(null);
  // Daily Report State
  const [reportDate, setReportDate] = useState(formatDateForInput(new Date().toISOString()));
  const [dailyReport, setDailyReport] = useState<DailyReportData | null>(null);
  useEffect(() => {
    const fetchCars = async () => {
      const res = await api.get('/cars');
      setCars(res.data);
    };
    fetchCars();
  }, []);
  const generateBill = async () => {
    if (!selectedPlate) return;
    try {
      const res = await api.get(`/reports/bill/${selectedPlate}`);
      setBillData(res.data);
    } catch (err) {
      console.error('Error generating bill');
    }
  };
  const generateDailyReport = async () => {
    try {
      const res = await api.get(`/reports/daily?date=${reportDate}`);
      setDailyReport(res.data);
    } catch (err) {
      console.error('Error generating daily report');
    }
  };
  const handlePrint = () => {
    window.print();
  };
  return <div className="space-y-8">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Billing</h1>
        <div className="flex space-x-2">
          <Button variant={activeTab === 'bill' ? 'primary' : 'outline'} onClick={() => setActiveTab('bill')}>
            Bill Generator
          </Button>
          <Button variant={activeTab === 'daily' ? 'primary' : 'outline'} onClick={() => setActiveTab('daily')}>
            Daily Report
          </Button>
        </div>
      </div>

      {/* Bill Generator Section */}
      {activeTab === 'bill' && <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:hidden">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Select label="Select Car for Bill" options={cars.map(c => ({
              value: c.PlateNumber,
              label: `${c.PlateNumber} - ${c.Model}`
            }))} value={selectedPlate} onChange={e => setSelectedPlate(e.target.value)} />
              </div>
              <Button onClick={generateBill} disabled={!selectedPlate}>
                Generate Bill
              </Button>
            </div>
          </div>

          {billData && <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-3xl mx-auto print:shadow-none print:border-none">
              <div className="text-center border-b pb-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  SmartPark CRPMS
                </h2>
                <p className="text-gray-500">
                  Rubavu District, Western Province
                </p>
                <h3 className="text-xl font-semibold mt-4">OFFICIAL INVOICE</h3>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase">
                    Customer Details
                  </h4>
                  <p className="font-semibold">{billData.car.PlateNumber}</p>
                  <p>
                    {billData.car.Model} ({billData.car.Type})
                  </p>
                  <p>{billData.car.DriverPhone}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-gray-500 uppercase">
                    Date
                  </h4>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-800">
                    <th className="text-left py-2">Service Description</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {billData.services.map((s, i) => <tr key={i} className="border-b border-gray-200">
                      <td className="py-2">{s.ServiceName}</td>
                      <td className="py-2">{formatDate(s.ServiceDate)}</td>
                      <td className="py-2 text-right">
                        {formatCurrency(s.ServicePrice)}
                      </td>
                    </tr>)}
                </tbody>
              </table>

              <div className="border-t-2 border-gray-800 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Total Service Cost:</span>
                  <span className="font-bold">
                    {formatCurrency(billData.summary.totalServiceCost)}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Amount Paid:</span>
                  <span className="font-bold">
                    -{formatCurrency(billData.summary.totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                  <span>Balance Due:</span>
                  <span className={billData.summary.balance > 0 ? 'text-red-600' : 'text-gray-900'}>
                    {formatCurrency(billData.summary.balance)}
                  </span>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500 print:hidden">
                <Button onClick={handlePrint} variant="secondary" className="mx-auto">
                  <Printer className="mr-2 h-4 w-4" /> Print Invoice
                </Button>
              </div>
            </div>}
        </div>}

      {/* Daily Report Section */}
      {activeTab === 'daily' && <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:hidden">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Input label="Report Date" type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} />
              </div>
              <Button onClick={generateDailyReport}>Generate Report</Button>
            </div>
          </div>

          {dailyReport && <div className="space-y-8 print:space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">
                  Services Offered on {formatDate(dailyReport.date)}
                </h3>
                <Table headers={['Car', 'Service', 'Price']}>
                  {dailyReport.services.map((s, i) => <TableRow key={i}>
                      <TableCell>
                        {s.PlateNumber} ({s.Model})
                      </TableCell>
                      <TableCell>{s.ServiceName}</TableCell>
                      <TableCell>{formatCurrency(s.ServicePrice)}</TableCell>
                    </TableRow>)}
                </Table>
                <div className="mt-4 text-right font-bold">
                  Total Value:{' '}
                  {formatCurrency(dailyReport.totals.totalServiceValue)}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">
                  Payments Received on {formatDate(dailyReport.date)}
                </h3>
                <Table headers={['Car', 'Amount']}>
                  {dailyReport.payments.map((p, i) => <TableRow key={i}>
                      <TableCell>
                        {p.PlateNumber} ({p.Model})
                      </TableCell>
                      <TableCell>{formatCurrency(p.AmountPaid)}</TableCell>
                    </TableRow>)}
                </Table>
                <div className="mt-4 text-right font-bold text-green-600">
                  Total Revenue:{' '}
                  {formatCurrency(dailyReport.totals.totalRevenue)}
                </div>
              </div>

              <div className="text-center print:hidden">
                <Button onClick={handlePrint} variant="secondary">
                  <Printer className="mr-2 h-4 w-4" /> Print Report
                </Button>
              </div>
            </div>}
        </div>}
    </div>;
};