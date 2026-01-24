import React, { useState, createElement } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { downloadMonthlyReport } from '../api/reports';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
export function Reports() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const {
    showToast
  } = useToast();
  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const blob = await downloadMonthlyReport(month, year);
      // Check if blob is valid (sometimes errors return as JSON blobs)
      if (blob.type === 'application/json') {
        throw new Error('Failed to generate report');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Monthly_Report_${month}-${year}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Report downloaded successfully', 'success');
    } catch (error) {
      console.error('Failed to download report', error);
      showToast('Failed to download report. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Reports
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Generate and download financial reports.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-2xl transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mr-4 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monthly Financial Report
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download a detailed PDF report of all services and payments for
                a specific month.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Month
              </label>
              <div className="relative">
                <select className="block w-full pl-3 pr-10 py-2 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[44px] sm:min-h-[38px]
                  bg-white dark:bg-gray-800 
                  border-gray-300 dark:border-gray-600 
                  text-gray-900 dark:text-white" value={month} onChange={e => setMonth(parseInt(e.target.value))}>
                  {months.map((m, i) => <option key={i + 1} value={i + 1}>
                      {m}
                    </option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>

            <Input label="Year" type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} min="2000" max="2100" />
          </div>

          <div className="flex justify-end pt-4 ">
            <Button onClick={handleDownload} isLoading={isLoading} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download PDF Report
            </Button>
          </div>
        </div>
      </div>
    </div>;
}