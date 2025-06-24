import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Nav/Header";
import Background from "@/components/ui/background";

export default function CreatePlant() {
    const manageSubmit = (e) => {
        e.preventDefault();
        console.log("Plant created");
    };

    return (
        <div className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
            <Background />
            <Header />
            <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-12">
                <div className="max-w-xl w-full p-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-2xl shadow-lg">
                    <h2 className="text-3xl font-bold mb-8 text-center text-white">Créer une plante</h2>
                    <form onSubmit={manageSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white font-medium">Nom</Label>
                            <Input 
                                type="text" 
                                name="name" 
                                id="name" 
                                placeholder="Nom de la plante"
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-white font-medium">Description</Label>
                            <Textarea 
                                name="description" 
                                id="description" 
                                rows={3}
                                placeholder="Description de la plante"
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500 resize-none"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-white font-medium">Image (URL)</Label>
                            <Input 
                                type="url" 
                                name="image" 
                                id="image" 
                                placeholder="https://exemple.com/image.jpg"
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="origin" className="text-white font-medium">Origine</Label>
                            <Input 
                                type="text" 
                                name="origin" 
                                id="origin" 
                                placeholder="Origine de la plante"
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="length" className="text-white font-medium">Taille (cm)</Label>
                            <Input 
                                type="number" 
                                name="length" 
                                id="length" 
                                placeholder="Taille en centimètres"
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="fruit_production_month" className="text-white font-medium">Mois de production du fruit</Label>
                            <Input 
                                type="text" 
                                name="fruit_production_month" 
                                id="fruit_production_month" 
                                placeholder="ex: mars, avril"
                                className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="max_temp" className="text-white font-medium">Température max (°C)</Label>
                                <Input 
                                    type="number" 
                                    name="max_temp" 
                                    id="max_temp" 
                                    placeholder="Temp. max"
                                    className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="min_temp" className="text-white font-medium">Température min (°C)</Label>
                                <Input 
                                    type="number" 
                                    name="min_temp" 
                                    id="min_temp" 
                                    placeholder="Temp. min"
                                    className="bg-white bg-opacity-90 border-white border-opacity-30 text-gray-900 placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-30 transition-all transform hover:-translate-y-1 text-white font-medium py-3"
                        >
                            Créer la plante
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

