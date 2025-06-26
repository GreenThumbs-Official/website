import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-400 bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-teal-400 bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-300 bg-opacity-10 rounded-full blur-xl"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <Leaf className="absolute top-1/4 left-1/4 w-6 h-6 text-green-400 opacity-30 animate-bounce" style={{animationDelay: '0s'}} />
        <Leaf className="absolute top-1/2 right-1/3 w-4 h-4 text-emerald-400 opacity-40 animate-bounce" style={{animationDelay: '1s'}} />
        <Leaf className="absolute bottom-1/3 left-1/2 w-5 h-5 text-teal-400 opacity-35 animate-bounce" style={{animationDelay: '2s'}} />
        <Leaf className="absolute top-3/4 right-1/4 w-7 h-7 text-green-300 opacity-25 animate-bounce" style={{animationDelay: '0.5s'}} />
      </div>

      <Card className="relative z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 shadow-2xl max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
                404
              </h1>
              <div className="absolute inset-0 text-8xl font-bold text-white opacity-10 blur-sm">
                404
              </div>
            </div>

            <div className="mx-auto w-20 h-20 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <Leaf className="w-10 h-10 text-green-400" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white">
                Page non trouvée
              </h2>
              <p className="text-white text-opacity-80 leading-relaxed">
                Oups ! La page que vous recherchez semble avoir disparu dans la nature. 
                Elle a peut-être été transplantée ailleurs !
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex-1 bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 transition-all duration-200 hover:scale-105 transform"
              >
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
            </div>

            <p className="text-white text-opacity-60 text-sm pt-4">
              Si le problème persiste, contactez notre équipe.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}