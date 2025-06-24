import React from 'react';
import { Button } from "@/components/ui/button";

const interestIcons = {
  'indoor': '🏠',
  'outdoor': '🌳',
  'succulents': '🌵',
  'flowers': '🌸',
  'vegetables': '🥬',
  'fruits': '🍎',
  'herbs': '🌿',
  'exotic': '🌴',
  'default': '🌱' 
};

export default function Step2Interests({ onNext, onPrevious, formData, setFormData, interestOptions = [] }) {
  const displayOptions = interestOptions.length > 0 ? 
    interestOptions.map(interest => ({
      id: interest.id,
      icon: interestIcons[interest.name.toLowerCase()] || interestIcons.default,
      label: interest.name
    })) : [
      { id: 'indoor', icon: '🏠', label: 'Plantes d\'intérieur' },
      { id: 'outdoor', icon: '🌳', label: 'Plantes d\'extérieur' },
      { id: 'succulents', icon: '🌵', label: 'Succulentes' },
      { id: 'flowers', icon: '🌸', label: 'Fleurs' },
      { id: 'vegetables', icon: '🥬', label: 'Légumes' },
      { id: 'fruits', icon: '🍎', label: 'Fruits' },
      { id: 'herbs', icon: '🌿', label: 'Herbes aromatiques' },
      { id: 'exotic', icon: '🌴', label: 'Plantes exotiques' },
    ];
  const toggleInterest = (interestId) => {
    setFormData(prev => {
      const currentInterests = prev.interests || [];
      const newInterests = currentInterests.includes(interestId)
        ? currentInterests.filter(id => id !== interestId)
        : [...currentInterests, interestId];
      
      return {
        ...prev,
        interests: newInterests
      };
    });
  };

  const manageSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Vos centres d'intérêt</h2>
      <p className="text-white text-opacity-80 text-center mb-6">Sélectionnez les types de plantes qui vous intéressent</p>
      
      <form onSubmit={manageSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {displayOptions.map((option) => {
            const isSelected = (formData.interests || []).includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleInterest(option.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${isSelected 
                  ? 'bg-white bg-opacity-30 border-2 border-white' 
                  : 'bg-white bg-opacity-10 border border-white border-opacity-20'}`}
              >
                <span className="text-3xl mb-2">{option.icon}</span>
                <span className="text-white text-sm">{option.label}</span>
              </button>
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
            Continuer
          </Button>
        </div>
      </form>
    </div>
  );
}