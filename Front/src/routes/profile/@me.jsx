import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/background';
import { User, Mail, Calendar, MapPin, Edit, Save, X, Camera, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const profileSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Adresse email invalide'),
  bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional(),
  location: z.string().max(100, 'La localisation ne peut pas dépasser 100 caractères').optional(),
});

export default function ProfileMe() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plants, setPlants] = useState([]);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [plantsError, setPlantsError] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isPlantDialogOpen, setIsPlantDialogOpen] = useState(false);
  const [isAddPlantDialogOpen, setIsAddPlantDialogOpen] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    description: '',
    origin: '',
    wateringFrequency: 7,
    image: null
  });
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    avatar: null,
    joinedDate: '',
    role: 'user',
    plantsCount: 0,
  });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
    },
  });

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/auth/login');
        return;
      }
      
      const response = await fetch('http://127.0.0.1:8000/api/user-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          navigate('/auth/login');
          return;
        }
        throw new Error(`Error: ${response.status}`);
      }
      
      const userData = await response.json();
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(prev => {
        const updatedUser = {
          id: userData.id || prev.id,
          username: userData.name || prev.username,
          email: userData.email || prev.email,
          bio: userData.bio || prev.bio,
          location: `${userData.ville || ''}, ${userData.pays || ''}`.trim(),
          avatar: userData.avatar || prev.avatar,
          joinedDate: userData.created_at || prev.joinedDate,
          role: userData.role || 'user',
          plantsCount: prev.plantsCount || 0, 
        };
        
        form.reset({
          username: updatedUser.username,
          email: updatedUser.email,
          bio: updatedUser.bio || '',
          location: updatedUser.location || '',
        });
        
        return updatedUser;
      });
    } catch (error) {
      console.error('Error while fetcing user data:', error);
      setError('Impossible to fetch user data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchUserPlants = async () => {
    setPlantsLoading(true);
    setPlantsError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const response = await fetch('/api/user-plants', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('L\'endpoint /api/user-plants n\'existe pas. Vérifiez que le serveur backend est démarré.');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Vérifier le type de contenu avant de parser en JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Le serveur a retourné du HTML au lieu de JSON. Vérifiez que l\'API backend est accessible et que l\'endpoint existe.');
      }
      
      const data = await response.json();
      
      // Vérifier si la réponse est un tableau ou contient un tableau
      const plantsArray = Array.isArray(data) ? data : (data.data || data.plants || []);
      
      // Formater les données pour l'affichage
      const formattedPlants = plantsArray.map(plant => ({
        id: plant.id,
        name: plant.name,
        type: plant.type || '',
        description: plant.description || '',
        origin: plant.origin || '',
        image: plant.image || null,
        length: plant.length || null,
        fruitProductionMonth: plant.fruit_production_month || null,
        maxTemp: plant.max_temp || null,
        minTemp: plant.min_temp || null,
        wateringFrequency: plant.watering_frequency || 7,
        lastWatered: plant.last_watered || null,
        plantedDate: plant.planted_date || null,
        nextWatering: plant.next_watering || calculateNextWatering(plant.last_watered, plant.watering_frequency),
        growthProgress: calculateGrowthProgress(plant.planted_date, plant.last_watered),
        growthStage: getGrowthStage(calculateGrowthProgress(plant.planted_date, plant.last_watered))
      }));
      
      setPlants(formattedPlants);
      
      setUser(prev => ({
        ...prev,
        plantsCount: formattedPlants.length,
      }));
    } catch (error) {
      console.error('Error while fetching plants:', error);
      
      // Messages d'erreur plus spécifiques
      if (error.message.includes('DOCTYPE')) {
        setPlantsError('Le serveur backend ne répond pas correctement. Vérifiez qu\'il est démarré sur le port 8000.');
      } else if (error.message.includes('Failed to fetch')) {
        setPlantsError('Impossible de contacter le serveur. Vérifiez votre connexion et que le serveur backend est démarré.');
      } else {
        setPlantsError(error.message || 'Impossible de récupérer vos plantes. Veuillez réessayer plus tard.');
      }
    } finally {
      setPlantsLoading(false);
    }
  };
  
  const calculateGrowthProgress = (plantedDate, lastWatered) => {
    if (!plantedDate) {
      // Si pas de date de plantation, utiliser l'arrosage comme indicateur
      if (!lastWatered) return 0;
      const lastWateredDate = parseISO(lastWatered);
      const today = new Date();
      const daysSinceLastWatered = Math.floor((today - lastWateredDate) / (1000 * 60 * 60 * 24));
      return Math.min(daysSinceLastWatered * 2, 100); // Croissance basée sur l'arrosage
    }
    
    const plantedDateObj = parseISO(plantedDate);
    const today = new Date();
    const daysSincePlanted = Math.floor((today - plantedDateObj) / (1000 * 60 * 60 * 24));
    
    // Calcul basé sur une croissance progressive sur 365 jours (1 an)
    return Math.min(Math.floor((daysSincePlanted / 365) * 100), 100);
  };

  const getGrowthStage = (progress) => {
    if (progress < 30) return 'Jeune';
    if (progress < 70) return 'En croissance';
    return 'Mature';
  };
  
  const calculateNextWatering = (lastWatered, frequency) => {
    if (!lastWatered || !frequency) return null;
    
    const lastWateredDate = parseISO(lastWatered);
    const nextWateringDate = new Date(lastWateredDate);
    nextWateringDate.setDate(nextWateringDate.getDate() + frequency);
    
    return nextWateringDate.toISOString();
  };
  
  const handleAddPlant = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const response = await fetch('/api/user-plants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlant.name,
          description: newPlant.description,
          origin: newPlant.origin,
          watering_frequency: newPlant.wateringFrequency,
          image: newPlant.image
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      fetchUserPlants();
      
      setNewPlant({
        name: '',
        description: '',
        origin: '',
        wateringFrequency: 7,
        image: null
      });
      
      // Fermer la boîte de dialogue
      setIsAddPlantDialogOpen(false);
      
    } catch (error) {
      console.error('Error while adding plant:', error);
      setPlantsError('Impossible d\'ajouter la plante. Veuillez réessayer plus tard.');
    }
  };
  
  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
    setIsPlantDialogOpen(true);
  };
  
  const formatPlantDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatFruitProductionMonth = (monthString) => {
    if (!monthString) return 'Non spécifié';
    
    const months = {
      '1': 'Janvier', '2': 'Février', '3': 'Mars', '4': 'Avril',
      '5': 'Mai', '6': 'Juin', '7': 'Juillet', '8': 'Août',
      '9': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre'
    };
    
    // Si c'est une plage de mois (ex: "5-8" pour Mai à Août)
    if (monthString.includes('-')) {
      const [start, end] = monthString.split('-');
      return `${months[start]} à ${months[end]}`;
    }
    
    // Si c'est plusieurs mois séparés par des virgules
    if (monthString.includes(',')) {
      return monthString.split(',').map(m => months[m.trim()]).join(', ');
    }
    
    // Si c'est un seul mois
    return months[monthString] || monthString;
  };

  useEffect(() => {
    const loadUserData = async () => {
      await fetchUserProfile();
      await fetchUserPlants();
    };
    
    loadUserData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setUser(prev => ({ ...prev, ...data }));
        localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
        setIsEditing(false);
        console.log('Profil mis à jour:', result);
      } else {
        console.error('Erreur de mise à jour:', result.message);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  const manageCancel = () => {
    form.reset({
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen  bg-[#6fbc29] text-white overflow-hidden">
      <Background />
      <Header />
      
      {isLoading ? (
        <div className="container mx-auto px-4 pt-24 pb-12 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="ml-3 text-xl">Chargement de votre profil...</span>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col justify-center items-center min-h-[50vh]">
          <div className="text-destructive text-center mb-4">{error}</div>
          <Button onClick={fetchUserProfile}>Réessayer</Button>
        </div>
      ) : (
        <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-primary hover:bg-primary/90"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-foreground">{user.username}</h1>
                    <Badge 
                      variant={user.role === 'admin' ? "destructive" : "secondary"} 
                      className="w-fit"
                    >
                      <User className="w-3 h-3 mr-1" />
                      {user.role === 'admin' ? 'Administrateur' : 'Membre'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Membre depuis {formatDate(user.joinedDate)}</span>
                    </div>
                  </div>

                  <div className="flex justify-center md:justify-start gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{user.plantsCount}</div>
                      <div className="text-sm text-muted-foreground">Plantes</div>
                    </div>
                  </div>

                  {user.bio && (
                    <p className="text-foreground leading-relaxed">{user.bio}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="bg-primary hover:bg-primary/90"
                        disabled={form.formState.isSubmitting}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button
                        onClick={manageCancel}
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Modifier le profil</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom d'utilisateur</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Votre nom d'utilisateur"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="votre@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localisation</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Votre ville, pays"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Parlez-nous de vous et de votre passion pour les plantes..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-primary flex items-center gap-2">
                  <span>🌱</span>
                  Mes plantes ({plants.length})
                </CardTitle>
                <CardDescription>
                  Gérez votre collection de plantes
                </CardDescription>
                {plants.length > 0 && (
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>🚨 {plants.filter(p => p.nextWatering && new Date(p.nextWatering) <= new Date()).length} à arroser</span>
                    <span>⚠️ {plants.filter(p => p.nextWatering && new Date(p.nextWatering) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && new Date(p.nextWatering) > new Date()).length} bientôt</span>
                    <span>🌿 {plants.filter(p => p.growthStage === 'Mature').length} matures</span>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => navigate('/dash/user')}
                className="bg-primary hover:bg-primary/90"
              >
                Gérer mes plantes
              </Button>
            </CardHeader>
            <CardContent>
              {plantsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Chargement de vos plantes...</span>
                </div>
              ) : plantsError ? (
                <div className="text-center py-8 text-destructive">
                  <p>{plantsError}</p>
                  <Button 
                    onClick={fetchUserPlants} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Réessayer
                  </Button>
                </div>
              ) : plants.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🌿</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Aucune plante pour le moment
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez à ajouter vos plantes pour suivre leur croissance !
                  </p>
                  <Button 
                    onClick={() => navigate('/dash/user')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Gérer mes plantes
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plants.map((plant) => (
                    <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => handlePlantClick(plant)}>
                      <div className="aspect-square relative bg-muted">
                        {plant.image ? (
                          <img 
                            src={plant.image} 
                            alt={plant.name} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-4xl">
                            🌱
                          </div>
                        )}
                        {plant.lastWatered && (
                          <div className={`absolute bottom-2 right-2 text-white text-xs px-2 py-1 rounded-full ${
                            plant.nextWatering && new Date(plant.nextWatering) <= new Date() 
                              ? 'bg-red-500' 
                              : plant.nextWatering && new Date(plant.nextWatering) <= new Date(Date.now() + 24 * 60 * 60 * 1000)
                              ? 'bg-orange-500'
                              : 'bg-primary'
                          }`}>
                            {plant.nextWatering ? (
                              new Date(plant.nextWatering) <= new Date() 
                                ? '🚨 À arroser maintenant'
                                : new Date(plant.nextWatering) <= new Date(Date.now() + 24 * 60 * 60 * 1000)
                                ? '⚠️ Arroser bientôt'
                                : `Arrosage: ${formatPlantDate(plant.nextWatering)}`
                            ) : `Dernier: ${formatPlantDate(plant.lastWatered)}`}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{plant.name}</h3>
                        {plant.type && (
                          <p className="text-xs text-primary font-medium mb-1">{plant.type}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {plant.description || 'Aucune description'}
                        </p>
                        
                        {/* Informations environnementales */}
                        {(plant.minTemp || plant.maxTemp) && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground">🌡️</span>
                            <span className="text-xs">
                              {plant.minTemp && plant.maxTemp 
                                ? `${plant.minTemp}°C - ${plant.maxTemp}°C`
                                : plant.minTemp 
                                ? `Min: ${plant.minTemp}°C`
                                : `Max: ${plant.maxTemp}°C`
                              }
                            </span>
                          </div>
                        )}
                        
                        {plant.length && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground">📏</span>
                            <span className="text-xs">Taille: {plant.length}cm</span>
                          </div>
                        )}
                        
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">Croissance</span>
                            <span className="text-xs font-medium">{plant.growthProgress || 0}%</span>
                          </div>
                          <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full" 
                              style={{
                                width: `${plant.growthProgress || 0}%`,
                                backgroundColor: plant.growthProgress < 30 ? '#60a5fa' : 
                                                plant.growthProgress < 70 ? '#10b981' : 
                                                '#84cc16'
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {plant.origin || 'Origine inconnue'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {plant.growthStage || 'Stade inconnu'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Dialogue de détails de plante */}
          <Dialog open={isPlantDialogOpen} onOpenChange={setIsPlantDialogOpen}>
            <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl">
              {selectedPlant && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{selectedPlant.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
                      {selectedPlant.image ? (
                        <img 
                          src={selectedPlant.image} 
                          alt={selectedPlant.name} 
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl">
                          🌱
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {selectedPlant.type && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Type</h3>
                          <p className="mt-1">{selectedPlant.type}</p>
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Description</h3>
                        <p className="mt-1">{selectedPlant.description || 'Aucune description disponible'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Origine</h3>
                        <p className="mt-1">{selectedPlant.origin || 'Origine inconnue'}</p>
                      </div>
                      
                      {/* Informations botaniques */}
                      {selectedPlant.length && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Taille</h3>
                          <p className="mt-1">{selectedPlant.length} cm</p>
                        </div>
                      )}
                      
                      {(selectedPlant.minTemp || selectedPlant.maxTemp) && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Température optimale</h3>
                          <p className="mt-1">
                            {selectedPlant.minTemp && selectedPlant.maxTemp 
                              ? `${selectedPlant.minTemp}°C - ${selectedPlant.maxTemp}°C`
                              : selectedPlant.minTemp 
                              ? `Minimum: ${selectedPlant.minTemp}°C`
                              : `Maximum: ${selectedPlant.maxTemp}°C`
                            }
                          </p>
                        </div>
                      )}
                      
                      {selectedPlant.fruitProductionMonth && (
                         <div>
                           <h3 className="text-sm font-medium text-gray-400">Mois de production de fruits</h3>
                           <p className="mt-1">{formatFruitProductionMonth(selectedPlant.fruitProductionMonth)}</p>
                         </div>
                       )}
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Fréquence d'arrosage</h3>
                        <p className="mt-1">Tous les {selectedPlant.wateringFrequency} jours</p>
                      </div>
                      
                      {selectedPlant.plantedDate && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Date de plantation</h3>
                          <p className="mt-1">{formatPlantDate(selectedPlant.plantedDate)}</p>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Dernier arrosage</h3>
                        <p className="mt-1">{selectedPlant.lastWatered ? formatPlantDate(selectedPlant.lastWatered) : 'Jamais'}</p>
                      </div>
                      <div>
                         <h3 className="text-sm font-medium text-gray-400">Prochain arrosage</h3>
                         <p className="mt-1">{selectedPlant.nextWatering ? formatPlantDate(selectedPlant.nextWatering) : 'Non planifié'}</p>
                         {selectedPlant.nextWatering && (
                           <div className="mt-2">
                             {new Date(selectedPlant.nextWatering) <= new Date() ? (
                               <div className="flex items-center gap-2 text-red-400">
                                 <span>🚨</span>
                                 <span className="text-sm font-medium">Cette plante a besoin d'eau maintenant !</span>
                               </div>
                             ) : new Date(selectedPlant.nextWatering) <= new Date(Date.now() + 24 * 60 * 60 * 1000) ? (
                               <div className="flex items-center gap-2 text-orange-400">
                                 <span>⚠️</span>
                                 <span className="text-sm font-medium">Arrosage recommandé dans les 24h</span>
                               </div>
                             ) : (
                               <div className="flex items-center gap-2 text-green-400">
                                 <span>✅</span>
                                 <span className="text-sm font-medium">Pas d'arrosage nécessaire pour le moment</span>
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Stade de croissance</h3>
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs">{selectedPlant.growthStage}</span>
                            <span className="text-xs">{selectedPlant.growthProgress}%</span>
                          </div>
                          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{
                                width: `${selectedPlant.growthProgress}%`,
                                backgroundColor: selectedPlant.growthProgress < 30 ? '#60a5fa' : 
                                                selectedPlant.growthProgress < 70 ? '#10b981' : 
                                                '#84cc16'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsPlantDialogOpen(false)}
                      className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                    >
                      Fermer
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Dialogue d'ajout de plante */}
          <Dialog open={isAddPlantDialogOpen} onOpenChange={setIsAddPlantDialogOpen}>
            <DialogContent className="bg-gray-900 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle plante</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plantName">Nom de la plante</Label>
                  <Input 
                    id="plantName" 
                    value={newPlant.name} 
                    onChange={(e) => setNewPlant({...newPlant, name: e.target.value})} 
                    placeholder="Monstera Deliciosa"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plantDescription">Description</Label>
                  <Textarea 
                    id="plantDescription" 
                    value={newPlant.description} 
                    onChange={(e) => setNewPlant({...newPlant, description: e.target.value})} 
                    placeholder="Une description de votre plante..."
                    className="bg-gray-800 border-gray-700 min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plantOrigin">Origine</Label>
                  <Input 
                    id="plantOrigin" 
                    value={newPlant.origin} 
                    onChange={(e) => setNewPlant({...newPlant, origin: e.target.value})} 
                    placeholder="Amérique du Sud"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wateringFrequency">Fréquence d'arrosage (jours)</Label>
                  <Input 
                    id="wateringFrequency" 
                    type="number" 
                    min="1" 
                    max="30" 
                    value={newPlant.wateringFrequency} 
                    onChange={(e) => setNewPlant({...newPlant, wateringFrequency: parseInt(e.target.value)})} 
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plantImage">Image (URL)</Label>
                  <Input 
                    id="plantImage" 
                    value={newPlant.image || ''} 
                    onChange={(e) => setNewPlant({...newPlant, image: e.target.value})} 
                    placeholder="https://example.com/image.jpg"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddPlantDialogOpen(false)}
                  className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleAddPlant}
                  className="bg-primary hover:bg-primary/90"
                  disabled={!newPlant.name}
                >
                  Ajouter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      )}
    </div>
  );
}