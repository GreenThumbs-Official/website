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

export default function AdminDashboard ({
  title,
  description,
  data = [],
  columns = [],
  buttonText = 'Ajouter',
  onButtonClick,
  className,
  ...props
}) {
  return (
    <div className={cn('space-y-4 md:space-y-6 p-4 md:p-0', className)} {...props}>
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-white text-opacity-80 text-base md:text-lg">{description}</p>
        )}
      </div>

      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-white border-opacity-20 p-4 md:p-6">
        <div className="flex justify-between md:justify-end items-center mb-4">
          <h2 className="text-lg font-semibold text-white md:hidden">Plantes</h2>
          <button
            onClick={onButtonClick}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-3 md:px-4 rounded-lg transition-all duration-200 border border-white border-opacity-30 text-sm md:text-base"
          >
            {buttonText}
          </button>
        </div>

        <div className="hidden md:block bg-white bg-opacity-20 rounded-lg overflow-hidden">
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

        <div className="md:hidden space-y-3">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="bg-white bg-opacity-20 rounded-lg p-4 space-y-2"
              >
                {columns.map((column, colIndex) => (
                  <div key={colIndex} className="flex justify-between items-center">
                    <span className="text-white text-opacity-80 text-sm font-medium">
                      {column.header}:
                    </span>
                    <span className="text-white text-sm">
                      {column.accessor ? row[column.accessor] : column.cell?.(row)}
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="bg-white bg-opacity-20 rounded-lg p-8 text-center">
              <p className="text-white text-opacity-60">Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};