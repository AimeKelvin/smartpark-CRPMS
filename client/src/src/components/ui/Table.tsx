import React, { Children } from 'react';
interface TableProps {
  headers: string[];
  children: React.ReactNode;
  emptyMessage?: string;
}
export const Table: React.FC<TableProps> = ({
  headers,
  children,
  emptyMessage = 'No data available'
}) => {
  return <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => <th key={index} className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                {header}
              </th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
      </table>
      {Children.count(children) === 0 && <div className="p-8 text-center text-gray-500">{emptyMessage}</div>}
    </div>;
};
export const TableRow: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => <tr className="hover:bg-gray-50 transition-colors">{children}</tr>;
export const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className = ''
}) => <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>;