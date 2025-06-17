import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Contact() {
    const navigate = useNavigate();

    const manageSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted");
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Contactez-nous</h1>
            <form onSubmit={manageSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input 
                        type="text" 
                        name="nom" 
                        id="nom" 
                        placeholder="Votre nom"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input 
                        type="text" 
                        name="prenom" 
                        id="prenom" 
                        placeholder="Votre prénom"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="votre.email@exemple.com"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="tel">Téléphone</Label>
                    <Input 
                        type="tel" 
                        name="tel" 
                        id="tel" 
                        placeholder="Votre numéro de téléphone"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                        name="message" 
                        id="message" 
                        rows={4}
                        placeholder="Votre message..."
                        required
                    />
                </div>
                
                <Button type="submit" className="w-full">
                    Envoyer
                </Button>
            </form>
        </div>
    );
}