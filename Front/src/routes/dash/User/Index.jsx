import React from 'react';
import { UnifiedDashboard } from '@/components/Dashboard';

export default function UserIndex() {
  const userData = [
    {
      id: 1,
      name: 'Mon Monstera',
      lastWatered: '2024-01-15',
      nextWatering: '2024-01-22',
      health: 'Excellente'
    },
    {
      id: 2,
      name: 'Mon Ficus',
      lastWatered: '2024-01-14',
      nextWatering: '2024-01-21',
      health: 'Bonne'
    },
    {
      id: 3,
      name: 'Mon Cactus',
      lastWatered: '2024-01-10',
      nextWatering: '2024-01-24',
      health: 'Excellente'
    }
  ];

  const userColumns = [
    {
      header: 'Plante',
      accessor: 'name'
    },
    {
      header: 'Dernier arrosage',
      accessor: 'lastWatered'
    },
    {
      header: 'Prochain arrosage',
      accessor: 'nextWatering'
    },
    {
      header: 'Santé',
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.health === 'Excellente' ? 'bg-green-500 bg-opacity-20 text-green-300' :
          row.health === 'Bonne' ? 'bg-yellow-500 bg-opacity-20 text-yellow-300' :
          'bg-red-500 bg-opacity-20 text-red-300'
        }`}>
          {row.health}
        </span>
      )
    }
  ];

  const manageAddToCollection = () => {
    alert('Ajouter à ma collection');
  };

  return (
    <UnifiedDashboard
      isAdmin={false}
      title="Ma Collection de Plantes"
      description="Suivez vos plantes, leurs besoins d'arrosage et leur état de santé."
      data={userData}
      columns={userColumns}
      buttonText="Ajouter à ma collection"
      onButtonClick={manageAddToCollection}
    />
  );
}