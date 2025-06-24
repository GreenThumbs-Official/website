import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step1Profile({ onNext, formData, setFormData }) {
  const manageChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value
      }
    }));
  };

  const manageSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Vos informations</h2>
      <form onSubmit={manageSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ville" className="text-white font-medium">Ville</Label>
          <Input
            type="text"
            id="ville"
            name="ville"
            value={formData.profile?.ville || ''}
            onChange={manageChange}
            placeholder="Votre ville"
            className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pays" className="text-white font-medium">Pays</Label>
          <Input
            type="text"
            id="pays"
            name="pays"
            value={formData.profile?.pays || ''}
            onChange={manageChange}
            placeholder="Votre pays"
            className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
            required
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit"
            className="w-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all transform hover:-translate-y-1 text-white font-medium py-3"
          >
            Continuer
          </Button>
        </div>
      </form>
    </div>
  );
}