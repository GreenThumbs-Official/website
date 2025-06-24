import React, { useState } from 'react';
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

const registerSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string().min(8, 'Veuillez confirmer votre mot de passe'),
  role: z.enum(['user', 'admin']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export default function Register() {
  const [step, setStep] = useState(1);
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
  });

  const navigate = useNavigate();

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['username', 'email'];
    if (step === 2) fieldsToValidate = [];
    const valid = await form.trigger(fieldsToValidate);
    if (valid) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, username, ...registerData } = data;
      const payload = { ...registerData, name: username };
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      const result = await response.json();
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/profile/onboarding');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white overflow-hidden">
      <Background />
      <Header />
      
      <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-12">
        <div className="max-w-md w-full p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Inscription</h1>
            <p className="text-white text-opacity-80">Créez votre compte GreenThumbs</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Nom d'utilisateur</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Votre nom d'utilisateur"
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
                </>
              )}
              {step === 2 && (
                <>
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirmez votre mot de passe"
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
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Rôle</FormLabel>
                        <FormControl>
                          <select
                            className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 w-full p-2 rounded"
                            {...field}
                          >
                            <option value="user">Utilisateur</option>
                            <option value="admin">Admin</option>
                          </select>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button type="button" onClick={prevStep} className="bg-gray-500 hover:bg-gray-600">Précédent</Button>
                )}
                {step < 2 && (
                  <Button type="button" onClick={nextStep} className="ml-auto">Suivant</Button>
                )}
                {step === 2 && (
                  <Button type="submit" className="ml-auto">S'inscrire</Button>
                )}
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-white text-opacity-80">
              Déjà un compte ?{' '}
              <Link
                to="/auth/login"
                className="text-white font-medium hover:text-opacity-80 underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}