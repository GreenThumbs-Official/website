import React, { useState, useEffect } from 'react';
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/background';
import PlantFilter from '@/components/Sections/PlantFilter';
import config from '@/config.json';

const API_URL = config.api.plants;

function Plants({ filters, onFilterChange }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construire l'URL avec les paramètres de filtre
        const url = new URL(API_URL);
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '') {
            url.searchParams.append(key, value);
          }
        });
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          setPlants(data.data);
        } else {
          throw new Error('Format de données invalide');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des plantes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [filters]);

  if (loading) {
    return (
      <section className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4 text-white">Chargement des plantes...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Erreur de chargement</p>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {plants.map((plant) => (
        <div 
          key={plant.id}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              {plant.name}
            </h3>
            
            {plant.image && (
              <img 
                src={plant.image} 
                alt={plant.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            
            <div className="text-sm text-gray-200 mb-4">
              <p><strong>Origine:</strong> {plant.origin}</p>
              <p><strong>Taille:</strong> {plant.length} cm</p>
              {plant.fruit_production_month && (
                <p><strong>Production:</strong> Mois {plant.fruit_production_month}</p>
              )}
              <p><strong>Température:</strong> {plant.min_temp}°C - {plant.max_temp}°C</p>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{plant.description}</p>
            
            <a 
              href={`plants/${plant.id}`}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Voir les détails de la plante
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function PlantsPage() {
    const [filters, setFilters] = useState({});

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="flex flex-col gap-4 items-start justify-start pt-10 pl-16 min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />
            <h2 className="text-5xl font-light mt-28 ml-12 leading-tight">Les différents types de plantes !</h2>
            <PlantFilter filters={filters} onFilterChange={handleFilterChange} />
            <div className="w-full px-12">
                <Plants filters={filters} onFilterChange={handleFilterChange} />
            </div>
        </div>
    )
}

