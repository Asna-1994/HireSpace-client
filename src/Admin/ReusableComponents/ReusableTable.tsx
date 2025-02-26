import React from 'react';

interface Column {
  header: string;
  accessor: string;
  render?: (item: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
}

const ReusableTable = ({ columns, data }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Sl. No</th>
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-2 text-left">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-2">
                  {column.render ? column.render(item) : item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;