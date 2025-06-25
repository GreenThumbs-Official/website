import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Nav/Sidebar';
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

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    password_confirmation: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setLoggedInUser(user);
      } catch (e) {
        console.error('Erreur lors du parsing :', e);
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Vous devez être connecté pour accéder à cette page');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api/users?page=${currentPage}`, {
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
      setUsers(data.data);
      setTotalPages(data.last_page);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: (row) => row.id.substring(0, 8) + '...' 
    },
    {
      header: 'Nom',
      accessor: 'name'
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Rôle',
      accessor: 'role'
    },
    {
      header: 'Actions',
      cell: (row) => {
        const isCurrentUser = loggedInUser && loggedInUser.id === row.id;
        return (
          <div className="flex gap-2">
            <button 
              className="text-blue-300 hover:text-blue-200 text-sm"
              onClick={() => manageEdit(row.id)}
            >
              Modifier
            </button>
            <button 
              className={`text-sm ${
                isCurrentUser 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-red-300 hover:text-red-200'
              }`}
              onClick={() => !isCurrentUser && manageDelete(row.id)}
              disabled={isCurrentUser}
              title={isCurrentUser ? 'Vous ne pouvez pas vous supprimer vous-même' : 'Supprimer cet utilisateur'}
            >
              Supprimer
            </button>
          </div>
        );
      }
    }
  ];

  const manageAddUser = () => {
    setCurrentUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      password: '',
      password_confirmation: ''
    });
    setAddDialogOpen(true);
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

  const manageEdit = async (userId) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails de l\'utilisateur');
      }
      
      const userData = await response.json();
      setCurrentUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      setEditDialogOpen(true);
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message);
    }
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
  
  const manageSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://127.0.0.1:8000/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
      }
      
      setEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message);
    }
  };

  const manageDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const token = localStorage.getItem('access_token');
        
        const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la suppression de l\'utilisateur');
        }
        
        fetchUsers();
        alert('Utilisateur supprimé avec succès');
      } catch (error) {
        console.error('Erreur:', error);
        alert(error.message);
      }
    }
  };

  return (
    <Sidebar userType="admin">
      <div className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Gestion des Utilisateurs</h1>
          <p className="text-white text-opacity-80 text-base md:text-lg">Gérez les utilisateurs de la plateforme, ajoutez de nouveaux utilisateurs et modifiez leurs rôles.</p>
        </div>
        
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-gray-800 text-white border border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Modifier l'utilisateur</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={manageSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={manageInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={manageInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">Rôle</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={manageRoleChange}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
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
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="bg-gray-800 text-white border border-gray-700">
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
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
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

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-white border-opacity-20 p-4 md:p-6">
          <div className="flex justify-between md:justify-end items-center mb-4">
            <h2 className="text-lg font-semibold text-white md:hidden">Données</h2>
            <Button
              onClick={manageAddUser}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-3 md:px-4 rounded-lg transition-all duration-200 border border-white border-opacity-30 text-sm md:text-base"
            >
              Ajouter un utilisateur
            </Button>
          </div>

          <div className="hidden md:block bg-white bg-opacity-20 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white border-opacity-20">
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className="text-white font-semibold bg-white bg-opacity-10"
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center text-white text-opacity-60 py-8">
                      Chargement des données...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center text-white text-opacity-60 py-8">
                      Erreur: {error}
                    </TableCell>
                  </TableRow>
                ) : users.length > 0 ? (
                  users.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-10"
                    >
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex} className="text-white">
                          {column.accessor ? row[column.accessor] : column.cell?.(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center text-white text-opacity-60 py-8"
                    >
                      Aucune donnée disponible
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3">
            {loading ? (
              <div className="bg-white bg-opacity-20 rounded-lg p-8 text-center">
                <p className="text-white text-opacity-60">Chargement des données...</p>
              </div>
            ) : error ? (
              <div className="bg-white bg-opacity-20 rounded-lg p-8 text-center">
                <p className="text-white text-opacity-60">Erreur: {error}</p>
              </div>
            ) : users.length > 0 ? (
              users.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="bg-white bg-opacity-20 rounded-lg p-4 space-y-2"
                >
                  {columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex justify-between items-center">
                      <span className="text-white text-opacity-80 text-sm font-medium">
                        {column.header}:
                      </span>
                      <span className="text-white text-sm">
                        {column.accessor ? row[column.accessor] : column.cell?.(row)}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="bg-white bg-opacity-20 rounded-lg p-8 text-center">
                <p className="text-white text-opacity-60">Aucune donnée disponible</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
              >
                Précédent
              </Button>
              <span className="text-white self-center">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};