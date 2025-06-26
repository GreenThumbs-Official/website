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
import Sidebar from '@/components/Nav/Sidebar';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function WateringCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plants, setPlants] = useState([]);
  const [wateringSchedule, setWateringSchedule] = useState([]);
  const [isPlantDialogOpen, setIsPlantDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          const formattedPlants = data.map(plant => ({
            id: plant.id,
            name: plant.name,
            wateringFrequency: plant.watering_frequency || 7,
            lastWatered: plant.last_watered || new Date().toISOString().split('T')[0],
            image: plant.image || '/api/placeholder/150/150',
            growthProgress: plant.growth_progress || Math.floor(Math.random() * 100),
            growthStage: plant.growth_stage || (plant.growth_progress < 30 ? 'Jeune' : plant.growth_progress < 70 ? 'En croissance' : 'Mature')
          }));
          
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
          last_watered: today
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Mettre à jour l'état local
      setWateringSchedule(prev => 
        prev.map(scheduleEvent => 
          scheduleEvent.id === eventId 
            ? { ...scheduleEvent, watered: true }
            : scheduleEvent
        )
      );
      
      if (selectedPlant && selectedPlant.id === event.plantId) {
        setPlants(prev => 
          prev.map(plant => {
            if (plant.id === selectedPlant.id) {
              const newProgress = Math.min(plant.growthProgress + 5, 100);
              
              let growthStage = plant.growthStage;
              if (newProgress < 30) growthStage = 'Jeune';
              else if (newProgress < 70) growthStage = 'En croissance';
              else growthStage = 'Mature';
              
              return {
                ...plant,
                lastWatered: today,
                growthProgress: newProgress,
                growthStage: growthStage
              };
            }
            return plant;
          })
        );
        
        setSelectedPlant(prev => ({
          ...prev,
          lastWatered: today,
          growthProgress: Math.min(prev.growthProgress + 5, 100),
          growthStage: prev.growthProgress + 5 < 30 ? 'Jeune' : 
                      prev.growthProgress + 5 < 70 ? 'En croissance' : 
                      'Mature'
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
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-sm font-medium">Progression de croissance</span>
                    <span className="text-white text-sm font-medium">{selectedPlant.growthProgress}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{
                        width: `${selectedPlant.growthProgress}%`,
                        backgroundColor: selectedPlant.growthProgress < 30 ? '#60a5fa' : 
                                        selectedPlant.growthProgress < 70 ? '#10b981' : 
                                        '#84cc16'
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-white text-opacity-70 text-xs">Stade: {selectedPlant.growthStage}</span>
                    <span className="text-white text-opacity-70 text-xs">
                      {selectedPlant.growthProgress < 30 ? 'Jeune' : 
                       selectedPlant.growthProgress < 70 ? 'En croissance' : 
                       'Mature'}
                    </span>
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
          <div className="grid md:grid-cols-2 gap-6">
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
                          {!event.watered && (
                            <Button
                              size="sm"
                              onClick={() => markAsWatered(event.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Marquer comme arrosé
                            </Button>
                          )}
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
          </div>
        )}
      </div>
    </Sidebar>
  );
}