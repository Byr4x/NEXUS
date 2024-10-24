import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps extends TableProps {}

export const Table: React.FC<TableProps> = ({ children }) => (
  <div className="w-full overflow-x-auto">
    <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<TableProps> = ({ children }) => (
  <thead className="bg-gray-200 dark:bg-gray-700">
    <tr>
      {children}
    </tr>
  </thead>
);

export const TableBody: React.FC<TableProps> = ({ children }) => (
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-center">{children}</tbody>
);

export const TableRow: React.FC<TableRowProps> = ({ children }) => (
  <tr>
    {children}
  </tr>
);

export const TableHead: React.FC<TableProps> = ({ children }) => (
  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
    {children}
  </th>
);

export const TableCell: React.FC<TableProps> = ({ children, className }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${className} bg-white dark:bg-gray-800`}>
    {children}
  </td>
);
