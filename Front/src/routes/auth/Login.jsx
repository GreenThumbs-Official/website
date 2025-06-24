import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Header from '@/components/Nav/Header';
import Background from '@/components/ui/background';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
        console.log('Connexion réussie:', result);
        
        if (!result.onboarding_completed) {
          navigate('/profile/onboarding');
        } else {
          navigate('/dash/user');
        }
      } else {
        console.error('Erreur de connexion:', result.message);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white overflow-hidden">
      <Background />
      <Header />
      
      <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-12">
        <div className="max-w-md w-full p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-white text-opacity-80">Connectez-vous à votre compte GreenThumbs</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Votre mot de passe"
                        className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all transform hover:-translate-y-1 text-white font-medium py-3"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-white text-opacity-80">
              Pas encore de compte ?{' '}
              <Link
                to="/auth/register"
                className="text-white font-medium hover:text-opacity-80 underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}