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
import { User, Mail, Calendar, MapPin, Edit, Save, X, Camera } from 'lucide-react';

const profileSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  email: z.string().email('Adresse email invalide'),
  bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional(),
  location: z.string().max(100, 'La localisation ne peut pas dépasser 100 caractères').optional(),
});

export default function ProfileMe() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    id: 1,
    username: 'JohnDoe',
    email: 'john.doe@example.com',
    bio: 'Passionné de jardinage et de plantes vertes. J\'adore partager mes conseils et découvertes avec la communauté GreenThumbs !',
    location: 'Lyon, France',
    avatar: null,
    joinedDate: '2025-06-23',
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(prev => {
        const updatedUser = { ...prev, ...userData };
        form.reset({
          username: userData.username || prev.username,
          email: userData.email || prev.email,
          bio: userData.bio || prev.bio,
          location: userData.location || prev.location,
        });
        return updatedUser;
      });
    }
  }, [form]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
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
                    <Badge variant="secondary" className="w-fit">
                      <User className="w-3 h-3 mr-1" />
                      Membre
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
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <span>🌱</span>
                Mes plantes
              </CardTitle>
              <CardDescription>
                Gérez votre collection de plantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🌿</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aucune plante pour le moment
                </h3>
                <p className="text-muted-foreground mb-4">
                  Commencez à ajouter vos plantes pour suivre leur croissance !
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  Ajouter ma première plante
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <span>📊</span>
                Activité récente
              </CardTitle>
              <CardDescription>
                Vos dernières interactions sur GreenThumbs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aucune activité récente
                </h3>
                <p className="text-muted-foreground">
                  Votre activité apparaîtra ici une fois que vous commencerez à interagir avec la communauté.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}