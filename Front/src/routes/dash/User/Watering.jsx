import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Sidebar from '@/components/Nav/Sidebar';
import { format, addDays, isSameDay, parseISO, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Droplets, TrendingUp, Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function WateringCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plants, setPlants] = useState([]);
  const [wateringSchedule, setWateringSchedule] = useState([]);
  const [isPlantDialogOpen, setIsPlantDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wateringStats, setWateringStats] = useState({
    totalWaterings: 0,
    weeklyWaterings: 0,
    averageGrowth: 0,
    plantsNeedingWater: 0
  });
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' ou 'table'

  useEffect(() => {
    const fetchUserPlants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          console.error('Aucun token trouvé');
          setError('Aucun token d\'authentification trouvé');
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
          const formattedPlants = data.map(plant => {
            const lastWateredDate = plant.last_watered ? parseISO(plant.last_watered) : new Date();
            const daysSinceWatering = differenceInDays(new Date(), lastWateredDate);
            const wateringFreq = plant.watering_frequency || 7;
            
            // Calculer la progression basée sur l'arrosage régulier
            let growthProgress = plant.growth_progress || 0;
            if (daysSinceWatering <= wateringFreq) {
              growthProgress = Math.min(growthProgress + (5 * (wateringFreq - daysSinceWatering)), 100);
            } else {
              growthProgress = Math.max(growthProgress - (2 * (daysSinceWatering - wateringFreq)), 0);
            }
            
            return {
              id: plant.id,
              name: plant.name,
              type: plant.type || 'Plante',
              wateringFrequency: wateringFreq,
              lastWatered: plant.last_watered || new Date().toISOString().split('T')[0],
              image: plant.image || '/api/placeholder/150/150',
              growthProgress: Math.round(growthProgress),
              growthStage: growthProgress < 30 ? 'Jeune' : growthProgress < 70 ? 'En croissance' : 'Mature',
              needsWater: daysSinceWatering >= wateringFreq,
              daysUntilNextWatering: Math.max(0, wateringFreq - daysSinceWatering),
              health: daysSinceWatering <= wateringFreq / 2 ? 'Excellente' : daysSinceWatering <= wateringFreq ? 'Bonne' : daysSinceWatering <= wateringFreq + 2 ? 'Moyenne' : 'Faible'
            };
          });
          
          setPlants(formattedPlants);
          generateWateringSchedule(formattedPlants);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des plantes:', error);
        setError('Erreur lors du chargement des plantes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserPlants();
  }, []);
  
  // Charger les statistiques après que les plantes soient chargées
  useEffect(() => {
    if (plants.length > 0) {
      calculateStats();
    }
  }, [plants]);

  const calculateStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }
      
      const response = await fetch('http://127.0.0.1:8000/api/watering-stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422) {
          // Erreur de validation (date future ou plante déjà arrosée)
          console.error('Erreur de validation:', errorData.message);
          setError(errorData.message || 'Impossible d\'arroser cette plante');
          return;
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const stats = await response.json();
      
      // Calculer la croissance moyenne depuis les plantes locales
      const averageGrowth = plants.length > 0 
        ? Math.round(plants.reduce((sum, plant) => sum + plant.growthProgress, 0) / plants.length)
        : 0;
      
      setWateringStats({
        totalWaterings: stats.weekly_waterings,
        weeklyWaterings: stats.weekly_waterings,
        averageGrowth: averageGrowth,
        plantsNeedingWater: stats.plants_needing_water
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const generateWateringSchedule = (plantsData) => {
    const schedule = [];
    const today = new Date();
    
    plantsData.forEach(plant => {
      const lastWateredDate = parseISO(plant.lastWatered);
      
      for (let i = 0; i < 60; i++) {
        const nextWateringDate = addDays(lastWateredDate, plant.wateringFrequency * (i + 1));
        
        schedule.push({
          id: `${plant.id}-${i}`,
          plantId: plant.id,
          plantName: plant.name,
          date: nextWateringDate,
          watered: false
        });
      }
    });
    
    setWateringSchedule(schedule);
  };

  const managePlantSelect = (plantId) => {
    console.log('managePlantSelect appelée avec plantId:', plantId);
    const plant = plants.find(p => p.id.toString() === plantId);
    console.log('Plante trouvée:', plant);
    
    if (plant) {
      setSelectedPlant(plant);
      
      generateWateringSchedule(plants);
      console.log('Planning d\'arrosage regénéré');
      
      setTimeout(() => {
        setIsPlantDialogOpen(false);
      }, 100);
    }
  };

  const getWateringEventsForDate = (date) => {
    if (!selectedPlant) return [];
    
    return wateringSchedule.filter(event => 
      event.plantId === selectedPlant.id && 
      isSameDay(event.date, date)
    );
  };

  const waterPlantDirect = async (plantId) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }
      
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(`http://127.0.0.1:8000/api/user-plants/${plantId}/water`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          last_watered: today,
          notes: `Arrosage effectué via le tableau`
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422) {
          // Erreur de validation (plante déjà arrosée aujourd'hui)
          setError(errorData.message || 'Cette plante a déjà été arrosée aujourd\'hui');
          return;
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const responseData = await response.json();
      const newProgress = responseData.growth_progress;
      
      // Mettre à jour l'état des plantes
      setPlants(prev => {
        const updatedPlants = prev.map(plant => {
          if (plant.id === plantId) {
            let growthStage = plant.growthStage;
            if (newProgress < 30) growthStage = 'Jeune';
            else if (newProgress < 70) growthStage = 'En croissance';
            else growthStage = 'Mature';
            
            return {
              ...plant,
              lastWatered: today,
              growthProgress: newProgress,
              growthStage: growthStage,
              needsWater: false,
              daysUntilNextWatering: plant.wateringFrequency,
              health: 'Excellente'
            };
          }
          return plant;
        });
        
        // Recalculer les statistiques et le calendrier après l'arrosage
        setTimeout(() => {
          calculateStats();
        }, 100);
        
        // Mettre à jour le calendrier avec les nouvelles données
        generateWateringSchedule(updatedPlants);
        
        return updatedPlants;
      });
      
      // Mettre à jour la plante sélectionnée si c'est celle qui a été arrosée
      if (selectedPlant && selectedPlant.id === plantId) {
        setSelectedPlant(prev => ({
          ...prev,
          lastWatered: today,
          growthProgress: newProgress,
          growthStage: newProgress < 30 ? 'Jeune' : 
                      newProgress < 70 ? 'En croissance' : 
                      'Mature',
          needsWater: false,
          daysUntilNextWatering: prev.wateringFrequency,
          health: 'Excellente'
        }));
      }
    } catch (error) {
      console.error('Erreur lors de l\'arrosage:', error);
      setError('Erreur lors de l\'arrosage');
    }
  };

  const markAsWatered = async (eventId) => {
    try {
      const event = wateringSchedule.find(e => e.id === eventId);
      if (!event) return;
      
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }
      
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(`http://127.0.0.1:8000/api/user-plants/${event.plantId}/water`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          last_watered: today,
          notes: `Arrosage effectué via le calendrier`
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422) {
          // Erreur de validation (plante déjà arrosée aujourd'hui)
          setError(errorData.message || 'Cette plante a déjà été arrosée aujourd\'hui');
          return;
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const responseData = await response.json();
      const newProgress = responseData.growth_progress;
      
      // Mettre à jour l'état local
      setWateringSchedule(prev => 
        prev.map(scheduleEvent => 
          scheduleEvent.id === eventId 
            ? { ...scheduleEvent, watered: true }
            : scheduleEvent
        )
      );
      
      if (selectedPlant && selectedPlant.id === event.plantId) {
        setPlants(prev => {
          const updatedPlants = prev.map(plant => {
            if (plant.id === selectedPlant.id) {
              let growthStage = plant.growthStage;
              if (newProgress < 30) growthStage = 'Jeune';
              else if (newProgress < 70) growthStage = 'En croissance';
              else growthStage = 'Mature';
              
              return {
                ...plant,
                lastWatered: today,
                growthProgress: newProgress,
                growthStage: growthStage,
                needsWater: false,
                daysUntilNextWatering: plant.wateringFrequency,
                health: 'Excellente'
              };
            }
            return plant;
          });
        
        // Recalculer les statistiques et le calendrier après l'arrosage
        setTimeout(() => {
          calculateStats();
        }, 100);
        
        // Mettre à jour le calendrier avec les nouvelles données
        generateWateringSchedule(updatedPlants);
        
        return updatedPlants;
        });
        
        setSelectedPlant(prev => ({
          ...prev,
          lastWatered: today,
          growthProgress: newProgress,
          growthStage: newProgress < 30 ? 'Jeune' : 
                      newProgress < 70 ? 'En croissance' : 
                      'Mature',
          needsWater: false,
          daysUntilNextWatering: prev.wateringFrequency,
          health: 'Excellente'
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'arrosage:', error);
      setError('Erreur lors de la mise à jour de l\'arrosage');
    }
  };

  const getUpcomingWaterings = () => {
    if (!selectedPlant) return [];
    
    const today = new Date();
    return wateringSchedule
      .filter(event => 
        event.plantId === selectedPlant.id && 
        event.date >= today && 
        !event.watered
      )
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);
  };

  const getTodayWaterings = () => {
    if (!selectedPlant) return [];
    
    const today = new Date();
    return wateringSchedule.filter(event => 
      event.plantId === selectedPlant.id && 
      isSameDay(event.date, today) && 
      !event.watered
    );
  };

  const hasWateringEvent = (date) => {
    if (!selectedPlant) return false;
    
    return wateringSchedule.some(event => 
      event.plantId === selectedPlant.id && 
      isSameDay(event.date, date) && 
      !event.watered
    );
  };

  if (loading) {
    return (
      <Sidebar userType="user">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-white">Chargement du calendrier...</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar userType="user">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Calendrier d'Arrosage
            </h1>
            <p className="text-white text-opacity-80 text-base md:text-lg">
              Planifiez et suivez l'arrosage de vos plantes
            </p>
          </div>
          <div className="bg-red-500 bg-opacity-20 text-red-100 p-4 rounded-lg">
            <p>{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </Sidebar>
    );
  }

  if (plants.length === 0) {
    return (
      <Sidebar userType="user">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Calendrier d'Arrosage
            </h1>
            <p className="text-white text-opacity-80 text-base md:text-lg">
              Planifiez et suivez l'arrosage de vos plantes
            </p>
          </div>
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="mx-auto w-24 h-24 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">
                    Aucune plante à suivre
                  </h2>
                  <p className="text-white text-opacity-70">
                    Ajoutez des plantes à votre collection pour commencer à planifier leur arrosage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar userType="user">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Calendrier d'Arrosage
          </h1>
          <p className="text-white text-opacity-80 text-base md:text-lg">
            Planifiez et suivez l'arrosage de vos plantes
          </p>
        </div>

        {/* Statistiques d'arrosage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Droplets className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{wateringStats.weeklyWaterings}</p>
                  <p className="text-xs text-white text-opacity-70">Arrosages cette semaine</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{wateringStats.averageGrowth}%</p>
                  <p className="text-xs text-white text-opacity-70">Croissance moyenne</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{wateringStats.plantsNeedingWater}</p>
                  <p className="text-xs text-white text-opacity-70">Plantes à arroser</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{plants.length}</p>
                  <p className="text-xs text-white text-opacity-70">Total plantes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sélecteur de vue */}
        <div className="flex justify-center space-x-2">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
            className={viewMode === 'calendar' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30'}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Vue Calendrier
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30'}
          >
            <Table className="w-4 h-4 mr-2" />
            Vue Tableau
          </Button>
        </div>

        <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Plante sélectionnée</span>
              <Dialog open={isPlantDialogOpen} onOpenChange={setIsPlantDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
                  >
                    {selectedPlant ? 'Changer de plante' : 'Choisir une plante'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Sélectionner une plante</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                     <p className="text-gray-300">
                       Choisissez une plante pour voir son calendrier d'arrosage :
                    </p>
                    <Select onValueChange={managePlantSelect}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Sélectionner une plante" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {plants.map((plant) => (
                          <SelectItem 
                           key={plant.id} 
                           value={plant.id.toString()}
                           className="text-white hover:bg-gray-700"
                         >
                            {plant.name} (arrosage tous les {plant.wateringFrequency} jours)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsPlantDialogOpen(false)}
                      className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                    >
                      Annuler
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPlant ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedPlant.image} 
                    alt={selectedPlant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{selectedPlant.name}</h3>
                    <p className="text-white text-opacity-70">
                      Arrosage tous les {selectedPlant.wateringFrequency} jours
                    </p>
                    <p className="text-white text-opacity-70 text-sm">
                      Dernier arrosage : {format(parseISO(selectedPlant.lastWatered), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-sm font-medium">Progression de croissance</span>
                    <span className="text-white text-sm font-medium">{selectedPlant.growthProgress}%</span>
                  </div>
                  <Progress 
                    value={selectedPlant.growthProgress} 
                    className="w-full h-3 bg-white bg-opacity-20"
                  />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="text-white text-opacity-70">Stade</p>
                      <Badge variant="outline" className="text-white border-white border-opacity-30">
                        {selectedPlant.growthStage}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-white text-opacity-70">Santé</p>
                      <Badge 
                        variant="outline" 
                        className={`border-opacity-30 ${
                          selectedPlant.health === 'Excellente' ? 'text-emerald-400 border-emerald-400' :
                selectedPlant.health === 'Bonne' ? 'text-green-400 border-green-400' :
                selectedPlant.health === 'Moyenne' ? 'text-yellow-400 border-yellow-400' :
                          'text-red-400 border-red-400'
                        }`}
                      >
                        {selectedPlant.health}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-white text-opacity-70">Prochain arrosage</p>
                      <Badge variant="outline" className="text-white border-white border-opacity-30">
                        {selectedPlant.daysUntilNextWatering === 0 ? 'Aujourd\'hui' : `${selectedPlant.daysUntilNextWatering}j`}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-white text-opacity-70">
                Aucune plante sélectionnée. Cliquez sur "Choisir une plante" pour commencer.
              </p>
            )}
           </CardContent>
        </Card>

        {selectedPlant && (
          <div className={viewMode === 'calendar' ? 'grid md:grid-cols-2 gap-6' : 'space-y-6'}>
            {viewMode === 'calendar' ? (
              <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
                <CardHeader>
                  <CardTitle className="text-white">Calendrier</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={fr}
                    className="text-black [&_.rdp-day_button]:bg-white [&_.rdp-day_button]:bg-opacity-20 [&_.rdp-day_button]:border [&_.rdp-day_button]:border-white [&_.rdp-day_button]:border-opacity-30 [&_.rdp-day_button]:rounded-md [&_.rdp-button_previous]:bg-white [&_.rdp-button_previous]:bg-opacity-20 [&_.rdp-button_next]:bg-white [&_.rdp-button_next]:bg-opacity-20 [&_.rdp-weekday]:text-black [&_.rdp-caption]:text-black"
                    modifiers={{
                      watering: (date) => hasWateringEvent(date)
                    }}
                    modifiersStyles={{
                      watering: {
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    }}
                  />
                  <div className="mt-4 text-sm text-white text-opacity-70">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 bg-opacity-50 rounded"></div>
                      <span>Jours d'arrosage</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
                <CardHeader>
                  <CardTitle className="text-white">Tableau de suivi des plantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white border-opacity-20">
                        <TableHead className="text-white">Plante</TableHead>
                        <TableHead className="text-white">Progression</TableHead>
                        <TableHead className="text-white">Santé</TableHead>
                        <TableHead className="text-white">Dernier arrosage</TableHead>
                        <TableHead className="text-white">Prochain arrosage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plants.map((plant) => (
                        <TableRow key={plant.id} className="border-white border-opacity-10">
                          <TableCell className="text-white">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={plant.image} 
                                alt={plant.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium">{plant.name}</p>
                                <p className="text-sm text-white text-opacity-70">{plant.type}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{plant.growthProgress}%</span>
                                <span className="text-white text-opacity-70">{plant.growthStage}</span>
                              </div>
                              <Progress value={plant.growthProgress} className="w-full h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`border-opacity-30 ${
                                plant.health === 'Excellente' ? 'text-emerald-400 border-emerald-400' :
                plant.health === 'Bonne' ? 'text-green-400 border-green-400' :
                plant.health === 'Moyenne' ? 'text-yellow-400 border-yellow-400' :
                                'text-red-400 border-red-400'
                              }`}
                            >
                              {plant.health}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white text-opacity-70">
                            {format(parseISO(plant.lastWatered), 'dd/MM/yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`border-opacity-30 ${
                                plant.needsWater ? 'text-red-400 border-red-400' : 'text-green-400 border-green-400'
                              }`}
                            >
                              {plant.needsWater ? 'Maintenant' : `${plant.daysUntilNextWatering}j`}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => {
                                waterPlantDirect(plant.id);
                              }}
                              disabled={!plant.needsWater}
                              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Droplets className="w-4 h-4 mr-1" />
                              {plant.needsWater ? 'Arroser' : 'Arrosé'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {viewMode === 'calendar' && (
              <div className="space-y-4">
                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
                <CardHeader>
                  <CardTitle className="text-white">
                    {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getWateringEventsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-2">
                      {getWateringEventsForDate(selectedDate).map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg">
                          <span className="text-white">{event.plantName}</span>
                          {(() => {
                            const plant = plants.find(p => p.id === event.plantId);
                            const canWater = plant && plant.needsWater;
                            
                            return (
                              <Button
                                size="sm"
                                onClick={() => canWater ? markAsWatered(event.id) : null}
                                disabled={!canWater}
                                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {canWater ? 'Marquer comme arrosé' : 'Déjà arrosé'}
                              </Button>
                            );
                          })()}
                          {event.watered && (
                            <span className="text-green-400 text-sm">✅ Arrosé</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white text-opacity-70">
                      Aucun arrosage prévu pour cette date.
                    </p>
                  )}
                </CardContent>
              </Card>

              {getTodayWaterings().length > 0 && (
                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
                  <CardHeader>
                    <CardTitle className="text-white">À arroser aujourd'hui</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getTodayWaterings().map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
                          <span className="text-white">{event.plantName}</span>
                          <Button
                            size="sm"
                            onClick={() => markAsWatered(event.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Arroser
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
                <CardHeader>
                  <CardTitle className="text-white">Prochains arrosages</CardTitle>
                </CardHeader>
                <CardContent>
                  {getUpcomingWaterings().length > 0 ? (
                    <div className="space-y-2">
                      {getUpcomingWaterings().map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg">
                          <div>
                            <span className="text-white block">{event.plantName}</span>
                            <span className="text-white text-opacity-70 text-sm">
                              {format(event.date, 'dd MMMM yyyy', { locale: fr })}
                            </span>
                          </div>
                          <span className="text-blue-400 text-sm">
                            Dans {Math.ceil((event.date - new Date()) / (1000 * 60 * 60 * 24))} jour(s)
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white text-opacity-70">
                      Aucun arrosage prévu prochainement.
                    </p>
                  )}
                </CardContent>
              </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </Sidebar>
  );
}