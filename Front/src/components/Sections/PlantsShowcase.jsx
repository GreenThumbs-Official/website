import React, { useState, useEffect } from 'react';

export default function PlantsShowcase() {
  const [randomPlants, setRandomPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://127.0.0.1:8000/api/plants');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          const allPlants = data.data;
          const shuffled = [...allPlants].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 4);
          setRandomPlants(selected);
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
  }, []);
  
  return (
    <section id="products" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-light text-center mb-12">Vos plantes recommandées</h2>
        
        {loading && <p className="text-center">Chargement des plantes...</p>}
        
        {error && <p className="text-center text-red-500">Erreur: {error}</p>}
        
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {randomPlants.map((plant) => (
              <div
                key={plant.id}
                className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl overflow-hidden transition-transform hover:-translate-y-2"
              >
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-normal mb-2">{plant.name}</h3>
                  <button className="w-full py-2 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all">
                    Voir la plante
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}