import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const monthNames = {
  1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril',
  5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août',
  9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'
};

export default function PlantFilter({ onFilterChange, filters }) {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <h2 className="text-3xl font-light text-white">Filtrer vos plantes</h2>
          
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-all"
            >
              <Filter size={20} />
              Filtres
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 bg-opacity-80 rounded-lg text-white hover:bg-opacity-100 transition-all"
              >
                <X size={20} />
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une plante..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          />
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Origine */}
              <div>
                <label className="block text-white font-medium mb-2">Origine</label>
                <input
                  type="text"
                  placeholder="Ex: Asie, Europe..."
                  value={filters.origin || ''}
                  onChange={(e) => handleFilterChange('origin', e.target.value)}
                  className="w-full px-3 py-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>

              {/* Mois de production de fruits */}
              <div>
                <label className="block text-white font-medium mb-2">Mois de production</label>
                <select
                  value={filters.fruit_production_month || ''}
                  onChange={(e) => handleFilterChange('fruit_production_month', e.target.value)}
                  className="w-full px-3 py-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  <option value="">Tous les mois</option>
                  {Object.entries(monthNames).map(([num, name]) => (
                    <option key={num} value={num} className="text-black">{name}</option>
                  ))}
                </select>
              </div>

              {/* Température minimale */}
              <div>
                <label className="block text-white font-medium mb-2">Température min (°C)</label>
                <input
                  type="number"
                  placeholder="Ex: 15"
                  value={filters.min_temp || ''}
                  onChange={(e) => handleFilterChange('min_temp', e.target.value)}
                  className="w-full px-3 py-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>

              {/* Température maximale */}
              <div>
                <label className="block text-white font-medium mb-2">Température max (°C)</label>
                <input
                  type="number"
                  placeholder="Ex: 30"
                  value={filters.max_temp || ''}
                  onChange={(e) => handleFilterChange('max_temp', e.target.value)}
                  className="w-full px-3 py-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>

              {/* Taille minimale */}
              <div>
                <label className="block text-white font-medium mb-2">Taille min (cm)</label>
                <input
                  type="number"
                  placeholder="Ex: 50"
                  value={filters.length_min || ''}
                  onChange={(e) => handleFilterChange('length_min', e.target.value)}
                  className="w-full px-3 py-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>

              {/* Taille maximale */}
              <div>
                <label className="block text-white font-medium mb-2">Taille max (cm)</label>
                <input
                  type="number"
                  placeholder="Ex: 200"
                  value={filters.length_max || ''}
                  onChange={(e) => handleFilterChange('length_max', e.target.value)}
                  className="w-full px-3 py-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}