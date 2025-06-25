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

export default function AdminIndex() {
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [plantsData, setPlantsData] = useState([]);

  useEffect(() => {
    setUsersData([
      {
        id: 1,
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        role: 'Utilisateur',
      },
      {
        id: 2,
        name: 'Marie Martin',
        email: 'marie.martin@example.com',
        role: 'Administrateur',
      },
      {
        id: 3,
        name: 'Pierre Durand',
        email: 'pierre.durand@example.com',
        role: 'Utilisateur',
      }
    ]);

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
  }, []);

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
                    {usersData.slice(0, 3).map((user) => (
                      <TableRow key={user.id} className="border-b border-white border-opacity-10">
                        <TableCell className="text-white">{user.name}</TableCell>
                        <TableCell className="text-white">{user.email}</TableCell>
                        <TableCell className="text-white">{user.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button 
                onClick={() => navigate('/dash/admin/users')} 
                className="mt-4 w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30"
              >
                Voir tous les utilisateurs
              </Button>
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