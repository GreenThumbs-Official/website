import React from 'react';
import { Button } from "@/components/ui/button";

const plantOptions = [
  { id: 'monstera', name: 'Monstera Deliciosa', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'ficus', name: 'Ficus Lyrata', image: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'pothos', name: 'Pothos Doré', image: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'snake', name: 'Sansevière', image: 'https://images.unsplash.com/photo-1593482892290-f54927ae2b7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'calathea', name: 'Calathea Orbifolia', image: 'https://images.unsplash.com/photo-1602923668104-8d8f8b9bc7f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80' },
  { id: 'zz', name: 'Plante ZZ', image: 'https://images.unsplash.com/photo-1632207691143-7ee8c82f6e9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80' },
];

export default function Step3Plants({ onNext, onPrevious, formData, setFormData, onComplete }) {
  const togglePlant = (plantId) => {
    setFormData(prev => {
      const currentPlants = prev.favoritePlants || [];
      const newPlants = currentPlants.includes(plantId)
        ? currentPlants.filter(id => id !== plantId)
        : [...currentPlants, plantId];
      
      return {
        ...prev,
        favoritePlants: newPlants
      };
    });
  };

  const manageSubmit = (e) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Plantes qui vous plaisent</h2>
      <p className="text-white text-opacity-80 text-center mb-6">Sélectionnez les plantes que vous trouvez belles</p>
      
      <form onSubmit={manageSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {plantOptions.map((plant) => {
            const isSelected = (formData.favoritePlants || []).includes(plant.id);
            return (
              <div 
                key={plant.id}
                onClick={() => togglePlant(plant.id)}
                className={`relative cursor-pointer rounded-xl overflow-hidden transition-all transform ${isSelected ? 'scale-105 ring-2 ring-white' : 'hover:scale-102'}`}
              >
                <img 
                  src={plant.image} 
                  alt={plant.name} 
                  className="w-full h-36 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                  <p className="text-white text-sm">{plant.name}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex space-x-4 pt-4">
          <Button 
            type="button"
            onClick={onPrevious}
            className="flex-1 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-20 transition-all text-white font-medium py-3"
          >
            Retour
          </Button>
          <Button 
            type="submit"
            className="flex-1 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all transform hover:-translate-y-1 text-white font-medium py-3"
          >
            Terminer
          </Button>
        </div>
      </form>
    </div>
  );
}