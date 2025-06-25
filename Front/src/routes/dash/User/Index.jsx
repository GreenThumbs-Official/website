import React, { useState, useEffect } from 'react';
import { UnifiedDashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Sidebar from '@/components/Nav/Sidebar';
import { Plus, Leaf, Calendar, Droplets, Trash2, CheckCircle } from 'lucide-react';

export default function UserIndex() {
  const [userPlants, setUserPlants] = useState([]);
  const [isAddPlantDialogOpen, setIsAddPlantDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPlant, setNewPlant] = useState({
    name: '',
    type: '',
    lastWatered: '',
    wateringFrequency: 7
  });

  const availablePlants = [
    { id: 'monstera', name: 'Monstera deliciosa', frequency: 7 },
    { id: 'ficus', name: 'Ficus benjamina', frequency: 5 },
    { id: 'cactus', name: 'Cactus', frequency: 21 },
    { id: 'pothos', name: 'Pothos', frequency: 7 },
    { id: 'snake-plant', name: 'Sansevieria', frequency: 14 },
    { id: 'peace-lily', name: 'Spathiphyllum', frequency: 7 },
    { id: 'rubber-tree', name: 'Ficus elastica', frequency: 7 },
    { id: 'philodendron', name: 'Philodendron', frequency: 7 }
  ];

  useEffect(() => {
    setTimeout(() => {
      setUserPlants([]);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateNextWatering = (lastWatered, frequency) => {
    const lastDate = new Date(lastWatered);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + frequency);
    return nextDate.toISOString().split('T')[0];
  };

  const getPlantHealth = (lastWatered, nextWatering) => {
    const today = new Date();
    const nextDate = new Date(nextWatering);
    const daysDiff = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 2) return 'Excellente';
    if (daysDiff >= 0) return 'Bonne';
    return 'Attention';
  };

  const markAsWatered = (plantId) => {
    const today = new Date().toISOString().split('T')[0];
    setUserPlants(prev => prev.map(plant => {
      if (plant.id === plantId) {
        const nextWatering = calculateNextWatering(today, plant.wateringFrequency);
        const health = getPlantHealth(today, nextWatering);
        return {
          ...plant,
          lastWatered: today,
          nextWatering: nextWatering,
          health: health
        };
      }
      return plant;
    }));
  };

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
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => markAsWatered(row.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs"
            title="Marquer comme arrosé"
          >
            <Droplets className="w-3 h-3 mr-1" />
            Arroser
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => manageRemovePlant(row.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs"
            title="Supprimer la plante"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Supprimer
          </Button>
        </div>
      )
    }
  ];

  const manageAddPlant = () => {
    if (!newPlant.name || !newPlant.type || !newPlant.lastWatered) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const selectedPlantType = availablePlants.find(p => p.id === newPlant.type);
    const nextWatering = calculateNextWatering(newPlant.lastWatered, selectedPlantType.frequency);
    const health = getPlantHealth(newPlant.lastWatered, nextWatering);

    const plantToAdd = {
      id: Date.now(),
      name: newPlant.name,
      type: selectedPlantType.name,
      lastWatered: newPlant.lastWatered,
      nextWatering: nextWatering,
      health: health,
      wateringFrequency: selectedPlantType.frequency
    };

    setUserPlants(prev => [...prev, plantToAdd]);
    setNewPlant({ name: '', type: '', lastWatered: '', wateringFrequency: 7 });
    setIsAddPlantDialogOpen(false);
  };

  const manageRemovePlant = (plantId) => {
    setUserPlants(prev => prev.filter(plant => plant.id !== plantId));
  };

  if (loading) {
    return (
      <Sidebar userType="user">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-white">Chargement de votre collection...</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  if (userPlants.length === 0) {
    return (
      <Sidebar userType="user">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Ma Collection de Plantes
            </h1>
            <p className="text-white text-opacity-80 text-base md:text-lg">
              Commencez votre voyage avec les plantes
            </p>
          </div>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="mx-auto w-24 h-24 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Leaf className="w-12 h-12 text-green-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">
                    Votre collection est vide
                  </h2>
                  <p className="text-white text-opacity-70">
                    Ajoutez votre première plante pour commencer à suivre ses besoins d'arrosage et sa santé.
                  </p>
                </div>
                <div className="space-y-4">
                  <Dialog open={isAddPlantDialogOpen} onOpenChange={setIsAddPlantDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg">
                        <Plus className="w-5 h-5 mr-2" />
                        Ajouter ma première plante
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
                      <DialogHeader>
                        <DialogTitle>Ajouter une nouvelle plante</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="plant-name">Nom de votre plante</Label>
                          <Input
                            id="plant-name"
                            placeholder="Ex: Mon Monstera"
                            value={newPlant.name}
                            onChange={(e) => setNewPlant(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plant-type">Type de plante</Label>
                          <Select onValueChange={(value) => setNewPlant(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {availablePlants.map((plant) => (
                                <SelectItem 
                                  key={plant.id} 
                                  value={plant.id}
                                  className="text-white hover:bg-gray-700"
                                >
                                  {plant.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-watered">Dernier arrosage</Label>
                          <Input
                            id="last-watered"
                            type="date"
                            value={newPlant.lastWatered}
                            onChange={(e) => setNewPlant(prev => ({ ...prev, lastWatered: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddPlantDialogOpen(false)}
                          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                        >
                          Annuler
                        </Button>
                        <Button 
                          onClick={manageAddPlant}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Ajouter
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="text-sm text-white text-opacity-60">
                    Ou explorez nos guides pour en apprendre plus sur le soin des plantes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    );
  }

  return (
    <>
      <UnifiedDashboard
        isAdmin={false}
        title="Ma Collection de Plantes"
        description="Suivez vos plantes, leurs besoins d'arrosage et leur état de santé."
        data={userPlants}
        columns={userColumns}
        buttonText="Ajouter une plante"
        onButtonClick={() => setIsAddPlantDialogOpen(true)}
      />
      
      <Dialog open={isAddPlantDialogOpen} onOpenChange={setIsAddPlantDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle plante</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plant-name">Nom de votre plante</Label>
              <Input
                id="plant-name"
                placeholder="Ex: Mon Monstera"
                value={newPlant.name}
                onChange={(e) => setNewPlant(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plant-type">Type de plante</Label>
              <Select 
                value={newPlant.type}
                onValueChange={(value) => setNewPlant(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {availablePlants.map((plant) => (
                    <SelectItem 
                      key={plant.id} 
                      value={plant.id}
                      className="text-white hover:bg-gray-700"
                    >
                      {plant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-watered">Dernier arrosage</Label>
              <Input
                id="last-watered"
                type="date"
                value={newPlant.lastWatered}
                onChange={(e) => setNewPlant(prev => ({ ...prev, lastWatered: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddPlantDialogOpen(false);
                setNewPlant({ name: '', type: '', lastWatered: '', wateringFrequency: 7 });
              }}
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              Annuler
            </Button>
            <Button 
              onClick={manageAddPlant}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}