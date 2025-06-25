import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Nav/Sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminIndex() {
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [plantsData, setPlantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
    password_confirmation: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchPlants();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Vous devez être connecté pour accéder à cette page');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      
      const data = await response.json();
      setUsersData(data.data.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchPlants = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/plants');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des plantes');
      }
      const data = await response.json();
      setPlantsData(data.slice(0, 3));
    } catch (error) {
      console.error('Erreur:', error);
      setPlantsData([
        {
          id: 1,
          name: 'Monstera Deliciosa',
          category: 'Plante d\'intérieur',
        },
        {
          id: 2,
          name: 'Ficus Benjamina',
          category: 'Plante d\'intérieur',
        },
        {
          id: 3,
          name: 'Cactus Barrel',
          category: 'Succulente',
        }
      ]);
    }
  };

  const manageAddUser = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      password: '',
      password_confirmation: ''
    });
    setAddDialogOpen(true);
  };
  
  const manageInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const manageRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value
    });
  };
  
  const manageAddSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://127.0.0.1:8000/api/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de l\'utilisateur');
      }
      
      setAddDialogOpen(false);
      fetchUsers();
      alert('Utilisateur créé avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message);
    }
  };

  return (
    <Sidebar userType="admin">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
            <p className="text-white text-opacity-80 mt-1">Bienvenue sur le tableau de bord administrateur</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/dash/admin/users')} 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30"
            >
              Gérer les utilisateurs
            </Button>
            <Button 
              onClick={() => navigate('/dash/admin/plants')} 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30"
            >
              Gérer les plantes
            </Button>
          </div>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="bg-gray-800 text-white border border-gray-700 w-full max-w-md rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Ajouter un utilisateur</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={manageAddSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="add-name" className="text-white">Nom</Label>
                <Input
                  id="add-name"
                  name="name"
                  value={formData.name}
                  onChange={manageInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-email" className="text-white">Email</Label>
                <Input
                  id="add-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={manageInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-password" className="text-white">Mot de passe</Label>
                <Input
                  id="add-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={manageInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-password-confirmation" className="text-white">Confirmer le mot de passe</Label>
                <Input
                  id="add-password-confirmation"
                  name="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={manageInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-role" className="text-white">Rôle</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={manageRoleChange}
                >
                  <SelectTrigger id="add-role" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5} className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="bg-transparent border-gray-500 text-white hover:bg-gray-700">
                    Annuler
                  </Button>
                </DialogClose>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Créer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 text-white">
            <CardHeader>
              <CardTitle>Utilisateurs récents</CardTitle>
              <CardDescription className="text-white text-opacity-60">Liste des derniers utilisateurs inscrits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white border-opacity-20">
                      <TableHead className="text-white">Nom</TableHead>
                      <TableHead className="text-white">Email</TableHead>
                      <TableHead className="text-white">Rôle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-white text-opacity-60 py-4">
                          Chargement des données...
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-white text-opacity-60 py-4">
                          Erreur: {error}
                        </TableCell>
                      </TableRow>
                    ) : usersData.length > 0 ? (
                      usersData.map((user) => (
                        <TableRow key={user.id} className="border-b border-white border-opacity-10">
                          <TableCell className="text-white">{user.name}</TableCell>
                          <TableCell className="text-white">{user.email}</TableCell>
                          <TableCell className="text-white">{user.role}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-white text-opacity-60 py-4">
                          Aucun utilisateur trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => navigate('/dash/admin/users')} 
                  className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30"
                >
                  Voir tous
                </Button>
                <Button 
                  onClick={manageAddUser} 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  Ajouter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 text-white">
            <CardHeader>
              <CardTitle>Plantes populaires</CardTitle>
              <CardDescription className="text-white text-opacity-60">Les plantes les plus consultées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white border-opacity-20">
                      <TableHead className="text-white">Nom</TableHead>
                      <TableHead className="text-white">Catégorie</TableHead>
                      <TableHead className="text-white">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plantsData.slice(0, 3).map((plant) => (
                      <TableRow key={plant.id} className="border-b border-white border-opacity-10">
                        <TableCell className="text-white">{plant.name}</TableCell>
                        <TableCell className="text-white">{plant.category}</TableCell>
                        <TableCell className="text-white">{plant.stock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button 
                onClick={() => navigate('/dash/admin/plants')} 
                className="mt-4 w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30"
              >
                Voir toutes les plantes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Sidebar>
  );
}