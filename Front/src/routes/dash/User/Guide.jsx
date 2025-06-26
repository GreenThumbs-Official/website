import React, { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Sidebar from '@/components/Nav/Sidebar';
import { Droplets, Sun, Thermometer, Scissors, Bug, Heart } from 'lucide-react';
import ChatBot from '@/components/ui/chatbot';

export default function PlantCareGuide() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [guide, setGuide] = useState(null);
  const [plants, setPlants] = useState([]);
  const [isPlantDialogOpen, setIsPlantDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/api/user-plants', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          }
        });
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des plantes');
        }
        const data = await response.json();
        setPlants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const fetchGuide = async () => {
    setLoading(true);
    setError(null);

    const responseFormat = `{
      id: 1,
      name: 'Mon Monstera',
      scientificName: 'Monstera deliciosa',
      difficulty: 'Facile',
      category: 'Plante d\\'intérieur',
      care: {
        watering: {
          frequency: 'Une fois par semaine',
          amount: 'Modéré',
          tips: 'Laissez sécher le sol entre les arrosages. Vérifiez l\\'humidité en enfonçant votre doigt dans la terre.',
          signs: {
            overwatering: 'Feuilles jaunissantes, sol détrempé',
            underwatering: 'Feuilles tombantes, sol très sec'
          }
        },
        light: {
          type: 'Lumière indirecte vive',
          duration: '6-8 heures par jour',
          tips: 'Évitez la lumière directe du soleil qui peut brûler les feuilles. Une fenêtre orientée est idéale.',
          signs: {
            tooMuch: 'Feuilles brûlées, jaunissement',
            tooLittle: 'Croissance lente, feuilles plus petites'
          }
        },
        temperature: {
          ideal: '18-27°C',
          minimum: '15°C',
          tips: 'Évitez les courants d\\'air froids et les sources de chaleur directes.',
          humidity: '40-60%'
        },
        fertilizer: {
          frequency: 'Une fois par mois au printemps/été',
          type: 'Engrais liquide équilibré',
          tips: 'Réduisez la fertilisation en automne/hiver. Diluez l\\'engrais à la moitié de la concentration recommandée.'
        },
        pruning: {
          when: 'Printemps et été',
          how: 'Coupez les feuilles jaunies ou abîmées à la base',
          tips: 'Utilisez des outils propres et désinfectés. Vous pouvez bouturer les tiges coupées.'
        },
        commonProblems: [
          {
            problem: 'Feuilles jaunissantes',
            causes: ['Arrosage excessif', 'Manque de lumière', 'Vieillissement naturel'],
            solutions: ['Réduire l\\'arrosage', 'Déplacer vers plus de lumière', 'Retirer les feuilles jaunes']
          },
          {
            problem: 'Taches brunes sur les feuilles',
            causes: ['Lumière directe', 'Eau sur les feuilles', 'Maladie fongique'],
            solutions: ['Déplacer la plante', 'Arroser au niveau du sol', 'Traiter avec fongicide']
          }
        ]
      }
    }`
    const prompt = `Tu dois generer UNIQUEMENT un objet JSON valide pour un guide de soin de plante, sans aucun texte supplementaire avant ou apres. DONNEES DE LA PLANTE: ${JSON.stringify(selectedPlant)} STRUCTURE EXACTE A SUIVRE: Voir response_format ci-dessous. Genere le JSON maintenant:`;

    const body = {
      prompt: prompt,
      response_syntax: 'json',
      response_format: JSON.stringify(responseFormat)
    };

    try {
        const response = await fetch('http://localhost:8000/api/handle-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la génération du guide');
        }

        const guide = await response.json();
        setGuide(guide.response);
    } catch (err) {
        setError(err.message);
    }
  }



  const managePlantSelect = (plantId) => {
    const plant = plants.find(p => p.id === plantId);
    setSelectedPlant(plant);
    console.log(selectedPlant, plants)
    fetchGuide();
    setIsPlantDialogOpen(false);
    setActiveTab('general');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Très facile':
        return 'bg-green-500 bg-opacity-20 text-green-300';
      case 'Facile':
        return 'bg-blue-500 bg-opacity-20 text-blue-300';
      case 'Modéré':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-300';
      case 'Difficile':
        return 'bg-red-500 bg-opacity-20 text-red-300';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-300';
    }
  };

  if (loading) {
    return (
      <Sidebar userType="user">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-white">Chargement du guide...</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar userType="user">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Guide de Soin des Plantes
          </h1>
          <p className="text-white text-opacity-80 text-base md:text-lg">
            Découvrez comment prendre soin de vos plantes avec des conseils détaillés
          </p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-100 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}

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
                      Choisissez une plante pour voir son guide de soin détaillé :
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
                            {plant.name} - {plant.scientificName}
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
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedPlant.image}
                  alt={selectedPlant.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{selectedPlant.name}</h3>
                  <p className="text-white text-opacity-70 italic">{selectedPlant.scientificName}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getDifficultyColor(selectedPlant.difficulty)}>
                      {selectedPlant.difficulty}
                    </Badge>
                    <Badge className="bg-purple-500 bg-opacity-20 text-purple-300">
                      {selectedPlant.category}
                    </Badge>
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

        {guide && (
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
            <CardHeader>
              <CardTitle className="text-white">Guide de soin détaillé</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-gray-800">
                  <TabsTrigger value="general" className="text-white data-[state=active]:bg-white">
                    <Droplets className="w-4 h-4 mr-1" />
                    Général
                  </TabsTrigger>
                  <TabsTrigger value="watering" className="text-white data-[state=active]:bg-white">
                    <Droplets className="w-4 h-4 mr-1" />
                    Arrosage
                  </TabsTrigger>
                  <TabsTrigger value="light" className="text-white data-[state=active]:bg-white">
                    <Sun className="w-4 h-4 mr-1" />
                    Lumière
                  </TabsTrigger>
                  <TabsTrigger value="temperature" className="text-white data-[state=active]:bg-white">
                    <Thermometer className="w-4 h-4 mr-1" />
                    Climat
                  </TabsTrigger>
                  <TabsTrigger value="care" className="text-white data-[state=active]:bg-white">
                    <Scissors className="w-4 h-4 mr-1" />
                    Entretien
                  </TabsTrigger>
                  <TabsTrigger value="problems" className="text-white data-[state=active]:bg-white">
                    <Bug className="w-4 h-4 mr-1" />
                    Problèmes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold text-lg flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-red-400" />
                        Résumé des soins
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg">
                          <span className="text-white flex items-center">
                            <Droplets className="w-4 h-4 mr-2 text-blue-400" />
                            Arrosage
                          </span>
                          <span className="text-white text-opacity-70">{guide.care.watering.frequency}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg">
                          <span className="text-white flex items-center">
                            <Sun className="w-4 h-4 mr-2 text-yellow-400" />
                            Lumière
                          </span>
                          <span className="text-white text-opacity-70">{guide.care.light.type}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg">
                          <span className="text-white flex items-center">
                            <Thermometer className="w-4 h-4 mr-2 text-red-400" />
                            Température
                          </span>
                          <span className="text-white text-opacity-70">{guide.care.temperature.ideal}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold text-lg">Informations générales</h3>
                      <div className="space-y-2 text-white text-opacity-80">
                        <p><strong>Nom scientifique :</strong> {guide.scientificName}</p>
                        <p><strong>Difficulté :</strong> {guide.difficulty}</p>
                        <p><strong>Catégorie :</strong> {guide.category}</p>
                        <p><strong>Humidité idéale :</strong> {guide.care.temperature.humidity}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="watering" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-white bg-opacity-5">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Fréquence et quantité</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-white"><strong>Fréquence :</strong> {guide.care.watering.frequency}</p>
                          <p className="text-white"><strong>Quantité :</strong> {guide.care.watering.amount}</p>
                          <p className="text-white text-opacity-80 text-sm">{guide.care.watering.tips}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white bg-opacity-5">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Signes à surveiller</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-red-300 font-semibold">Arrosage excessif :</p>
                            <p className="text-white text-opacity-80 text-sm">{guide.care.watering.signs.overwatering}</p>
                          </div>
                          <div>
                            <p className="text-yellow-300 font-semibold">Manque d'eau :</p>
                            <p className="text-white text-opacity-80 text-sm">{guide.care.watering.signs.underwatering}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="light" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-white bg-opacity-5">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Besoins lumineux</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-white"><strong>Type :</strong> {guide.care.light.type}</p>
                          <p className="text-white"><strong>Durée :</strong> {guide.care.light.duration}</p>
                          <p className="text-white text-opacity-80 text-sm">{guide.care.light.tips}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white bg-opacity-5">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Signes lumineux</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-red-300 font-semibold">Trop de lumière :</p>
                            <p className="text-white text-opacity-80 text-sm">{guide.care.light.signs.tooMuch}</p>
                          </div>
                          <div>
                            <p className="text-blue-300 font-semibold">Pas assez de lumière :</p>
                            <p className="text-white text-opacity-80 text-sm">{guide.care.light.signs.tooLittle}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="temperature" className="mt-6">
                  <div className="space-y-6">
                    <Card className="bg-white bg-opacity-5">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Conditions climatiques</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-white"><strong>Température idéale :</strong> {guide.care.temperature.ideal}</p>
                            <p className="text-white"><strong>Température minimum :</strong> {guide.care.temperature.minimum}</p>
                          </div>
                          <div>
                            <p className="text-white"><strong>Humidité :</strong> {guide.care.temperature.humidity}</p>
                          </div>
                        </div>
                        <p className="text-white text-opacity-80 text-sm">{guide.care.temperature.tips}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="care" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-white bg-opacity-5">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Fertilisation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-white"><strong>Fréquence :</strong> {guide.care.fertilizer.frequency}</p>
                          <p className="text-white"><strong>Type :</strong> {guide.care.fertilizer.type}</p>
                          <p className="text-white text-opacity-80 text-sm">{guide.care.fertilizer.tips}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-white bg-opacity-5">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Taille et entretien</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-white"><strong>Quand :</strong> {guide.care.pruning.when}</p>
                          <p className="text-white"><strong>Comment :</strong> {guide.care.pruning.how}</p>
                          <p className="text-white text-opacity-80 text-sm">{guide.care.pruning.tips}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="problems" className="mt-6">
                  <div className="space-y-6">
                    <h3 className="text-white font-semibold text-lg">Problèmes courants et solutions</h3>
                    <div className="space-y-4">
                      {guide.care.commonProblems.map((problem, index) => (
                        <Card key={index} className="bg-white bg-opacity-5">
                          <CardHeader>
                            <CardTitle className="text-lg text-red-300">{problem.problem}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="text-white font-semibold mb-2">Causes possibles :</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {problem.causes.map((cause, causeIndex) => (
                                  <li key={causeIndex} className="text-white text-opacity-80 text-sm">{cause}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-white font-semibold mb-2">Solutions :</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {problem.solutions.map((solution, solutionIndex) => (
                                  <li key={solutionIndex} className="text-green-300 text-sm">{solution}</li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
      <ChatBot />
    </Sidebar>
  );
}