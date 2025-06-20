import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { cn } from '@/lib/utils';

const AdminDashboard = ({
  title,
  description,
  data = [],
  columns = [],
  buttonText = 'Ajouter',
  onButtonClick,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-white text-opacity-80 text-lg">{description}</p>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-white border-opacity-20 p-6">
        {/* Button above table */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onButtonClick}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-white border-opacity-30"
          >
            {buttonText}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white bg-opacity-20 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white border-opacity-20">
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className="text-white font-semibold bg-white bg-opacity-10"
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-10"
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className="text-white">
                        {column.accessor ? row[column.accessor] : column.cell?.(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-white text-opacity-60 py-8"
                  >
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;