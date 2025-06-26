import React, { useState, useEffect } from 'react';

// Fonction pour formater les dates en français
const formatDateToFrench = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
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
import { Plus, Leaf, Calendar, Droplets, Trash2, CheckCircle, Edit } from 'lucide-react';
import ChatBot from '@/components/ui/chatbot';

export default function UserIndex() {
  const [userPlants, setUserPlants] = useState([]);
  const [isAddPlantDialogOpen, setIsAddPlantDialogOpen] = useState(false);
  const [isEditPlantDialogOpen, setIsEditPlantDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState(null);
  const [plantToEdit, setPlantToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availablePlantsLoading, setAvailablePlantsLoading] = useState(false);
  const [availablePlants, setAvailablePlants] = useState([]);
  const [newPlant, setNewPlant] = useState({
    name: '',
    type: '',
    lastWatered: '',
    plantedDate: '',
    description: '',
    origin: '',
    wateringFrequency: 7,
    image: ''
  });

  useEffect(() => {
    const fetchUserPlants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          console.error('Aucun token trouvé');
          setLoading(false);
          return;
        }
        
        const response = await fetch('http://127.0.0.1:8000/api/user-plants', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
          const formattedPlants = data.map(plant => ({
            id: plant.id,
            name: plant.name,
            type: plant.type || plant.name, 
            lastWatered: plant.last_watered || new Date().toISOString().split('T')[0],
            plantedDate: plant.planted_date || new Date().toISOString().split('T')[0],
            wateringFrequency: plant.watering_frequency || 7,
            nextWatering: calculateNextWatering(plant.last_watered || new Date().toISOString().split('T')[0], plant.watering_frequency || 7),
            health: getPlantHealth(plant.last_watered || new Date().toISOString().split('T')[0], 
                      calculateNextWatering(plant.last_watered || new Date().toISOString().split('T')[0], plant.watering_frequency || 7))
          }));
          
          setUserPlants(formattedPlants);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des plantes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserPlants();
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
  
  useEffect(() => {
    if (plantToEdit) {
      const plantType = availablePlants.find(p => p.name === plantToEdit.type);
      setNewPlant({
        name: plantToEdit.name || '',
        type: plantType ? plantType.id : '',
        lastWatered: plantToEdit.lastWatered || '',
        plantedDate: plantToEdit.plantedDate || '',
        description: plantToEdit.description || '',
        origin: plantToEdit.origin || '',
        wateringFrequency: plantToEdit.wateringFrequency || 7,
        image: plantToEdit.image || ''
      });
    }
  }, [plantToEdit, availablePlants]);

  useEffect(() => {
    const fetchAvailablePlants = async () => {
      try {
        setAvailablePlantsLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          console.error('Aucun token trouvé');
          return;
        }
        
        const response = await fetch('http://127.0.0.1:8000/api/plants', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.data && Array.isArray(data.data)) {
          const apiPlants = data.data.map(plant => ({
            id: plant.id,
            name: plant.name,
            frequency: plant.watering_frequency || 7,
            image: plant.image
          }));
          
          if (apiPlants.length > 0) {
            setAvailablePlants(apiPlants);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des plantes disponibles:', error);
      } finally {
        setAvailablePlantsLoading(false);
      }
    };
    
    fetchAvailablePlants();
  }, []);

  const userColumns = [
    {
      header: 'Plante',
      accessor: 'name'
    },
    {
      header: 'Date de plantation',
      cell: (row) => formatDateToFrench(row.plantedDate)
    },
    {
      header: 'Dernier arrosage',
      cell: (row) => formatDateToFrench(row.lastWatered)
    },
    {
      header: 'Prochain arrosage',
      cell: (row) => formatDateToFrench(row.nextWatering)
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
            onClick={() => {
              setPlantToEdit(row);
              setIsEditPlantDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 hover:text-white text-white px-2 py-1 text-xs"
            title="Modifier la plante"
          >
            <Edit className="w-3 h-3 mr-1" />
            Modifier
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setPlantToDelete(row);
              setIsDeleteDialogOpen(true);
            }}
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

  const manageAddPlant = async () => {
    if (!newPlant.name || !newPlant.type || !newPlant.lastWatered || !newPlant.plantedDate || !newPlant.description || !newPlant.origin) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const selectedPlantType = availablePlants.find(p => p.id === newPlant.type);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }
      
      const plantData = {
        name: newPlant.name,
        type: selectedPlantType.name,
        last_watered: newPlant.lastWatered,
        planted_date: newPlant.plantedDate,
        description: newPlant.description,
        origin: newPlant.origin,
        watering_frequency: newPlant.wateringFrequency,
        image: newPlant.image
      };
      
      const response = await fetch('http://127.0.0.1:8000/api/user-plants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plantData)
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      const nextWatering = calculateNextWatering(newPlant.lastWatered, selectedPlantType.frequency);
      const health = getPlantHealth(newPlant.lastWatered, nextWatering);

      const plantToAdd = {
        id: data.id || Date.now(),
        name: newPlant.name,
        type: selectedPlantType.name,
        lastWatered: newPlant.lastWatered,
        plantedDate: newPlant.plantedDate,
        nextWatering: nextWatering,
        health: health,
        wateringFrequency: selectedPlantType.frequency
      };

      setUserPlants(prev => [...prev, plantToAdd]);
      setNewPlant({ name: '', type: '', lastWatered: '', plantedDate: '', description: '', origin: '', wateringFrequency: 7, image: '' });
      setIsAddPlantDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la plante:', error);
      alert('Une erreur est survenue lors de l\'ajout de la plante. Veuillez réessayer.');
    }
  };

  const manageEditPlant = async () => {
    if (!plantToEdit || !newPlant.name || !newPlant.type || !newPlant.lastWatered || !newPlant.plantedDate || !newPlant.description || !newPlant.origin) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const selectedPlantType = availablePlants.find(p => p.id === newPlant.type);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }
      
      const plantData = {
        name: newPlant.name,
        type: selectedPlantType.name,
        last_watered: newPlant.lastWatered,
        planted_date: newPlant.plantedDate,
        description: newPlant.description,
        origin: newPlant.origin,
        watering_frequency: newPlant.wateringFrequency,
        image: newPlant.image
      };
      
      const response = await fetch(`http://127.0.0.1:8000/api/user-plants/${plantToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plantData)
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const nextWatering = calculateNextWatering(newPlant.lastWatered, selectedPlantType.frequency);
      const health = getPlantHealth(newPlant.lastWatered, nextWatering);

      const updatedPlant = {
        ...plantToEdit,
        name: newPlant.name,
        type: selectedPlantType.name,
        lastWatered: newPlant.lastWatered,
        plantedDate: newPlant.plantedDate,
        nextWatering: nextWatering,
        health: health,
        wateringFrequency: selectedPlantType.frequency
      };

      setUserPlants(prev => prev.map(plant => 
        plant.id === plantToEdit.id ? updatedPlant : plant
      ));
      setNewPlant({ name: '', type: '', lastWatered: '', plantedDate: '', description: '', origin: '', wateringFrequency: 7, image: '' });
      setIsEditPlantDialogOpen(false);
      setPlantToEdit(null);
    } catch (error) {
      console.error('Erreur lors de la modification de la plante:', error);
      alert('Une erreur est survenue lors de la modification de la plante. Veuillez réessayer.');
    }
  };

  const manageRemovePlant = async (plantId) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api/user-plants/${plantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      setUserPlants(prev => prev.filter(plant => plant.id !== plantId));
      setIsDeleteDialogOpen(false);
      setPlantToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de la plante:', error);
      alert('Une erreur est survenue lors de la suppression de la plante. Veuillez réessayer.');
    }
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
                          <Select 
                            value={newPlant.type}
                            onValueChange={(value) => setNewPlant(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {availablePlantsLoading ? (
                                <div className="text-center p-2 text-white">Chargement...</div>
                              ) : availablePlants.length > 0 ? (
                                availablePlants.map((plant) => (
                                  <SelectItem 
                                    key={plant.id} 
                                    value={plant.id}
                                    className="text-white hover:bg-gray-700"
                                  >
                                    {plant.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="text-center p-2 text-white">Aucune plante disponible</div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="planted-date">Date de plantation</Label>
                          <Input
                            id="planted-date"
                            type="date"
                            value={newPlant.plantedDate}
                            onChange={(e) => setNewPlant(prev => ({ ...prev, plantedDate: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white"
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            placeholder="Ex: Belle plante verte d'intérieur"
                            value={newPlant.description}
                            onChange={(e) => setNewPlant(prev => ({ ...prev, description: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="origin">Origine</Label>
                          <Input
                            id="origin"
                            placeholder="Ex: Amérique du Sud"
                            value={newPlant.origin}
                            onChange={(e) => setNewPlant(prev => ({ ...prev, origin: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="watering-frequency">Fréquence d'arrosage (jours)</Label>
                          <Input
                            id="watering-frequency"
                            type="number"
                            min="1"
                            max="30"
                            value={newPlant.wateringFrequency}
                            onChange={(e) => setNewPlant(prev => ({ ...prev, wateringFrequency: parseInt(e.target.value) || 7 }))}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="image">Image (optionnel)</Label>
                          <Input
                            id="image"
                            type="url"
                            placeholder="Ex: https://exemple.com/image.jpg"
                            value={newPlant.image}
                            onChange={(e) => setNewPlant(prev => ({ ...prev, image: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-watered">Dernier arrosage</Label>
                          <Input
                            id="last-watered"
                            type="date"
                            value={newPlant.lastWatered}
                            onChange={(e) => setNewPlant(prev => ({ ...prev, lastWatered: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white"
                            max={new Date().toISOString().split('T')[0]}
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
                  {availablePlantsLoading ? (
                    <div className="text-center p-2 text-white">Chargement...</div>
                  ) : availablePlants.length > 0 ? (
                    availablePlants.map((plant) => (
                      <SelectItem 
                        key={plant.id} 
                        value={plant.id}
                        className="text-white hover:bg-gray-700"
                      >
                        {plant.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="text-center p-2 text-white">Aucune plante disponible</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="planted-date">Date de plantation</Label>
              <Input
                id="planted-date"
                type="date"
                value={newPlant.plantedDate}
                onChange={(e) => setNewPlant(prev => ({ ...prev, plantedDate: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Ex: Belle plante verte d'intérieur"
                value={newPlant.description}
                onChange={(e) => setNewPlant(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origine</Label>
              <Input
                id="origin"
                placeholder="Ex: Amérique du Sud"
                value={newPlant.origin}
                onChange={(e) => setNewPlant(prev => ({ ...prev, origin: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="watering-frequency">Fréquence d'arrosage (jours)</Label>
              <Input
                id="watering-frequency"
                type="number"
                min="1"
                max="30"
                value={newPlant.wateringFrequency}
                onChange={(e) => setNewPlant(prev => ({ ...prev, wateringFrequency: parseInt(e.target.value) || 7 }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image (optionnel)</Label>
              <Input
                id="image"
                type="url"
                placeholder="Ex: https://exemple.com/image.jpg"
                value={newPlant.image}
                onChange={(e) => setNewPlant(prev => ({ ...prev, image: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-watered">Dernier arrosage</Label>
              <Input
                id="last-watered"
                type="date"
                value={newPlant.lastWatered}
                onChange={(e) => setNewPlant(prev => ({ ...prev, lastWatered: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddPlantDialogOpen(false);
                setNewPlant({ name: '', type: '', lastWatered: '', plantedDate: '', description: '', origin: '', wateringFrequency: 7, image: '' });
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

      <Dialog open={isEditPlantDialogOpen} onOpenChange={setIsEditPlantDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la plante</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom de la plante</Label>
              <Input
                id="edit-name"
                placeholder="Ex: Mon Monstera"
                value={newPlant.name}
                onChange={(e) => setNewPlant(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type de plante</Label>
              <Select 
                value={newPlant.type} 
                onValueChange={(value) => {
                  const selectedPlant = availablePlants.find(p => p.id === value);
                  setNewPlant(prev => ({ 
                    ...prev, 
                    type: value,
                    wateringFrequency: selectedPlant ? selectedPlant.frequency : 7
                  }));
                }}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {availablePlants.map((plant) => (
                    <SelectItem key={plant.id} value={plant.id} className="text-white hover:bg-gray-700">
                      {plant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-last-watered">Dernier arrosage</Label>
              <Input
                id="edit-last-watered"
                type="date"
                value={newPlant.lastWatered}
                onChange={(e) => setNewPlant(prev => ({ ...prev, lastWatered: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-planted-date">Date de plantation</Label>
              <Input
                id="edit-planted-date"
                type="date"
                value={newPlant.plantedDate}
                onChange={(e) => setNewPlant(prev => ({ ...prev, plantedDate: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Ex: Belle plante verte d'intérieur"
                value={newPlant.description}
                onChange={(e) => setNewPlant(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-origin">Origine</Label>
              <Input
                id="edit-origin"
                placeholder="Ex: Amérique du Sud"
                value={newPlant.origin}
                onChange={(e) => setNewPlant(prev => ({ ...prev, origin: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-watering-frequency">Fréquence d'arrosage (jours)</Label>
              <Input
                id="edit-watering-frequency"
                type="number"
                min="1"
                max="30"
                value={newPlant.wateringFrequency}
                onChange={(e) => setNewPlant(prev => ({ ...prev, wateringFrequency: parseInt(e.target.value) || 7 }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image (optionnel)</Label>
              <Input
                id="edit-image"
                type="url"
                placeholder="Ex: https://exemple.com/image.jpg"
                value={newPlant.image}
                onChange={(e) => setNewPlant(prev => ({ ...prev, image: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditPlantDialogOpen(false);
                setPlantToEdit(null);
                setNewPlant({ name: '', type: '', lastWatered: '', plantedDate: '', description: '', origin: '', wateringFrequency: 7, image: '' });
              }}
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              Annuler
            </Button>
            <Button 
              onClick={manageEditPlant}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-white text-opacity-90">
              Êtes-vous sûr de vouloir supprimer {plantToDelete?.name} de votre collection ?
            </p>
            <p className="text-white text-opacity-70 text-sm mt-2">
              Cette action est irréversible et toutes les données associées à cette plante seront perdues.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setPlantToDelete(null);
              }}
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              Annuler
            </Button>
            <Button 
              onClick={() => plantToDelete && manageRemovePlant(plantToDelete.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ChatBot />
    </>
  );
}