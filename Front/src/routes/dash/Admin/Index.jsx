import React from 'react';
import { UnifiedDashboard } from '@/components/Dashboard';

export default function AdminIndex() {
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
    <UnifiedDashboard
      isAdmin={true}
      title="Gestion des Plantes"
      description="Gérez votre inventaire de plantes, ajoutez de nouvelles plantes et suivez les."
      data={Data}
      columns={columns}
      buttonText="Ajouter une plante"
      onButtonClick={manageAddPlant}
    />
  );
};