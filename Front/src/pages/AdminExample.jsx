import React from 'react';
import Sidebar from '../components/Nav/Sidebar';
import AdminDashboard from '../components/AdminDashboard';

const AdminExample = () => {
  // Exemple de données pour le tableau
  const sampleData = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      category: 'Plante d\'intérieur',
      price: '29.99€',
      stock: 15,
      status: 'En stock'
    },
    {
      id: 2,
      name: 'Ficus Benjamina',
      category: 'Plante d\'intérieur',
      price: '19.99€',
      stock: 8,
      status: 'En stock'
    },
    {
      id: 3,
      name: 'Cactus Barrel',
      category: 'Succulente',
      price: '12.99€',
      stock: 0,
      status: 'Rupture'
    }
  ];

  // Configuration des colonnes du tableau
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
      header: 'Prix',
      accessor: 'price'
    },
    {
      header: 'Stock',
      accessor: 'stock'
    },
    {
      header: 'Statut',
      accessor: 'status',
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'En stock'
              ? 'bg-green-500 bg-opacity-20 text-green-200'
              : 'bg-red-500 bg-opacity-20 text-red-200'
          }`}
        >
          {row.status}
        </span>
      )
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

  const handleAddPlant = () => {
    alert('Ajouter une nouvelle plante');
  };

  return (
    <Sidebar>
      <AdminDashboard
        title="Gestion des Plantes"
        description="Gérez votre inventaire de plantes, ajoutez de nouveaux produits et suivez les stocks."
        data={sampleData}
        columns={columns}
        buttonText="Ajouter une plante"
        onButtonClick={handleAddPlant}
      />
    </Sidebar>
  );
};

export default AdminExample;