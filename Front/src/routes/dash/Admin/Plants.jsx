import React from 'react';
import Sidebar from '@/components/Nav/Sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function AdminPlants() {
  const Data = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      category: 'Plante d\'intérieur',
    },
    {
      id: 2,
      name: 'Ficus Benjamina',
      category: 'Plante d\'intérieur',
    },
    {
      id: 3,
      name: 'Cactus Barrel',
      category: 'Succulente',
    },
    {
      id: 4,
      name: 'Pothos Doré',
      category: 'Plante d\'intérieur',
    },
    {
      id: 5,
      name: 'Calathea Orbifolia',
      category: 'Plante d\'intérieur',
    }
  ];

  const columns = [
    {
      header: 'ID',
      accessor: 'id'
    },
    {
      header: 'Nom',
      accessor: 'name'
    },
    {
      header: 'Catégorie',
      accessor: 'category'
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button className="text-blue-300 hover:text-blue-200 text-sm">
            Modifier
          </button>
          <button className="text-red-300 hover:text-red-200 text-sm">
            Supprimer
          </button>
        </div>
      )
    }
  ];

  const manageAddPlant = () => {
    alert('Ajouter une nouvelle plante');
  };

  return (
    <Sidebar userType="admin">
      <div className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Gestion des Plantes</h1>
          <p className="text-white text-opacity-80 text-base md:text-lg">Gérez votre inventaire de plantes, ajoutez de nouvelles plantes et suivez le stock.</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-white border-opacity-20 p-4 md:p-6">
          <div className="flex justify-between md:justify-end items-center mb-4">
            <h2 className="text-lg font-semibold text-white md:hidden">Données</h2>
            <Button
              onClick={manageAddPlant}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-3 md:px-4 rounded-lg transition-all duration-200 border border-white border-opacity-30 text-sm md:text-base"
            >
              Ajouter une plante
            </Button>
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
                {Data.length > 0 ? (
                  Data.map((row, rowIndex) => (
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
            {Data.length > 0 ? (
              Data.map((row, rowIndex) => (
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
    </Sidebar>
  );
};