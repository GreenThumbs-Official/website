import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";


export default function CreatePlant() {
    const navigate = useNavigate();

    const manageSubmit = (e) => {
        e.preventDefault();
        console.log("Plant created");
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Créer une plante</h2>
            <form onSubmit={manageSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input 
                        type="text" 
                        name="name" 
                        id="name" 
                        placeholder="Nom de la plante"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                        name="description" 
                        id="description" 
                        rows={3}
                        placeholder="Description de la plante"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="image">Image (URL)</Label>
                    <Input 
                        type="url" 
                        name="image" 
                        id="image" 
                        placeholder="https://exemple.com/image.jpg"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="origin">Origine</Label>
                    <Input 
                        type="text" 
                        name="origin" 
                        id="origin" 
                        placeholder="Origine de la plante"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="length">Taille (cm)</Label>
                    <Input 
                        type="number" 
                        name="length" 
                        id="length" 
                        placeholder="Taille en centimètres"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="fruit_production_month">Mois de production du fruit</Label>
                    <Input 
                        type="text" 
                        name="fruit_production_month" 
                        id="fruit_production_month" 
                        placeholder="ex: mars, avril"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="max_temp">Température max (°C)</Label>
                        <Input 
                            type="number" 
                            name="max_temp" 
                            id="max_temp" 
                            placeholder="Temp. max"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="min_temp">Température min (°C)</Label>
                        <Input 
                            type="number" 
                            name="min_temp" 
                            id="min_temp" 
                            placeholder="Temp. min"
                        />
                    </div>
                </div>
                
                <Button type="submit" className="w-full">
                    Créer la plante
                </Button>
            </form>
        </div>
    );
}

