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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function AdminPlants() {
  const [plantsData, setPlantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPlant, setCurrentPlant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    origin: '',
    length: '',
    fruit_production_month: '',
    max_temp: '',
    min_temp: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/plants');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const responseData = await response.json();
      const data = responseData.data || responseData;
      const plantsArray = Array.isArray(data) ? data : [];
      
      setPlantsData(plantsArray);
      setTotalPages(Math.ceil(plantsArray.length / itemsPerPage));
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      setPlantsData([]);
      setLoading(false);
    }
  };

  const manageInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddPlant = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Vous devez être connecté pour ajouter une plante');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/plants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout de la plante');
      }

      await fetchPlants();
      setAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  };

  const manageEditPlant = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Vous devez être connecté pour modifier une plante');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/plants/${currentPlant.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification de la plante');
      }

      await fetchPlants();
      setEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  };

  const handleDeletePlant = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette plante ?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Vous devez être connecté pour supprimer une plante');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/plants/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la plante');
      }

      await fetchPlants();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  };

  const openEditDialog = (plant) => {
    setCurrentPlant(plant);
    setFormData({
      name: plant.name || '',
      description: plant.description || '',
      image: plant.image || '',
      origin: plant.origin || '',
      length: plant.length || '',
      fruit_production_month: plant.fruit_production_month || '',
      max_temp: plant.max_temp || '',
      min_temp: plant.min_temp || ''
    });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      origin: '',
      length: '',
      fruit_production_month: '',
      max_temp: '',
      min_temp: ''
    });
  };

  const manageAddPlant = () => {
    resetForm();
    setAddDialogOpen(true);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id'
    },
    {
      header: 'Nom',
      accessor: 'name'
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (row) => (
        <div className="max-w-xs truncate">
          {row.description ? row.description.substring(0, 50) + '...' : 'N/A'}
        </div>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button 
            className="text-blue-300 hover:text-blue-200 text-sm"
            onClick={() => openEditDialog(row)}
          >
            Modifier
          </button>
          <button 
            className="text-red-300 hover:text-red-200 text-sm"
            onClick={() => handleDeletePlant(row.id)}
          >
            Supprimer
          </button>
        </div>
      )
    }
  ];

  const managePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginatedData = () => {
    if (!Array.isArray(plantsData)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return plantsData.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <Sidebar userType="admin">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-white">Chargement des plantes...</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar userType="admin">
      <div className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Gestion des Plantes</h1>
          <p className="text-white text-opacity-80 text-base md:text-lg">Gérez votre inventaire de plantes, ajoutez de nouvelles plantes et suivez le stock.</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-100 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg border border-white border-opacity-20 p-4 md:p-6">
          <div className="flex justify-between md:justify-end items-center mb-4">
            <h2 className="text-lg font-semibold text-white md:hidden">Données</h2>
            <Button
              onClick={manageAddPlant}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-3 md:px-4 rounded-lg transition-all duration-200 border border-white border-opacity-30 text-sm md:text-base"
            >
              Ajouter une plante
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
                {Array.isArray(plantsData) && plantsData.length > 0 ? (
                  getPaginatedData().map((row, rowIndex) => (
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

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30 hover:text-black cursor-pointer" 
                        onClick={() => managePageChange(currentPage - 1)} 
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        className={`bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30 hover:text-black cursor-pointer ${currentPage === page ? 'bg-white bg-opacity-30 font-bold' : ''}`}
                        onClick={() => managePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30 hover:text-black cursor-pointer" 
                        onClick={() => managePageChange(currentPage + 1)} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="md:hidden space-y-3 mt-4">
            {Array.isArray(plantsData) && plantsData.length > 0 ? (
              getPaginatedData().map((row, rowIndex) => (
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
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30 hover:text-black cursor-pointer" 
                          onClick={() => managePageChange(currentPage - 1)} 
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          className={`bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30 hover:text-black cursor-pointer ${currentPage === page ? 'bg-white bg-opacity-30 font-bold' : ''}`}
                          onClick={() => managePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30 hover:text-black cursor-pointer" 
                          onClick={() => managePageChange(currentPage + 1)} 
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Ajouter une plante</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origin" className="text-right">
                Origine
              </Label>
              <Input
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="length" className="text-right">
                Taille (cm)
              </Label>
              <Input
                id="length"
                name="length"
                type="number"
                value={formData.length}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fruit_production_month" className="text-right">
                Mois de production
              </Label>
              <Select 
                name="fruit_production_month" 
                value={formData.fruit_production_month.toString()} 
                onValueChange={(value) => setFormData({...formData, fruit_production_month: value})}
              >
                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Sélectionner un mois" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="1">Janvier</SelectItem>
                  <SelectItem value="2">Février</SelectItem>
                  <SelectItem value="3">Mars</SelectItem>
                  <SelectItem value="4">Avril</SelectItem>
                  <SelectItem value="5">Mai</SelectItem>
                  <SelectItem value="6">Juin</SelectItem>
                  <SelectItem value="7">Juillet</SelectItem>
                  <SelectItem value="8">Août</SelectItem>
                  <SelectItem value="9">Septembre</SelectItem>
                  <SelectItem value="10">Octobre</SelectItem>
                  <SelectItem value="11">Novembre</SelectItem>
                  <SelectItem value="12">Décembre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_temp" className="text-right">
                Temp. max (°C)
              </Label>
              <Input
                id="max_temp"
                name="max_temp"
                type="number"
                value={formData.max_temp}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min_temp" className="text-right">
                Temp. min (°C)
              </Label>
              <Input
                id="min_temp"
                name="min_temp"
                type="number"
                value={formData.min_temp}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                Annuler
              </Button>
            </DialogClose>
            <Button onClick={handleAddPlant} className="bg-green-600 hover:bg-green-700 text-white">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier une plante */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Modifier la plante</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nom
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image" className="text-right">
                Image URL
              </Label>
              <Input
                id="edit-image"
                name="image"
                value={formData.image}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-origin" className="text-right">
                Origine
              </Label>
              <Input
                id="edit-origin"
                name="origin"
                value={formData.origin}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-length" className="text-right">
                Taille (cm)
              </Label>
              <Input
                id="edit-length"
                name="length"
                type="number"
                value={formData.length}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-fruit_production_month" className="text-right">
                Mois de production
              </Label>
              <Select 
                name="fruit_production_month" 
                value={formData.fruit_production_month.toString()} 
                onValueChange={(value) => setFormData({...formData, fruit_production_month: value})}
              >
                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Sélectionner un mois" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="1">Janvier</SelectItem>
                  <SelectItem value="2">Février</SelectItem>
                  <SelectItem value="3">Mars</SelectItem>
                  <SelectItem value="4">Avril</SelectItem>
                  <SelectItem value="5">Mai</SelectItem>
                  <SelectItem value="6">Juin</SelectItem>
                  <SelectItem value="7">Juillet</SelectItem>
                  <SelectItem value="8">Août</SelectItem>
                  <SelectItem value="9">Septembre</SelectItem>
                  <SelectItem value="10">Octobre</SelectItem>
                  <SelectItem value="11">Novembre</SelectItem>
                  <SelectItem value="12">Décembre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-max_temp" className="text-right">
                Temp. max (°C)
              </Label>
              <Input
                id="edit-max_temp"
                name="max_temp"
                type="number"
                value={formData.max_temp}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-min_temp" className="text-right">
                Temp. min (°C)
              </Label>
              <Input
                id="edit-min_temp"
                name="min_temp"
                type="number"
                value={formData.min_temp}
                onChange={manageInputChange}
                className="col-span-3 bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                Annuler
              </Button>
            </DialogClose>
            <Button onClick={manageEditPlant} className="bg-blue-600 hover:bg-blue-700 text-white">
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
};