import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export default function Home() {
    const navigate = useNavigate();

    return (
<div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
  <h2 class="text-2xl font-bold mb-6 text-gray-800">Créer une plante</h2>
  <form class="space-y-4" action="" method="post">
    <div>
      <label class="block text-sm font-medium text-gray-700">Nom</label>
      <input type="text" name="name" class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" required/>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea name="description" rows="3" class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"></textarea>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Image (URL)</label>
      <input type="url" name="image" class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"/>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Origine</label>
      <input type="text" name="origin" class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"/>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Taille (cm)</label>
      <input type="number" name="length" class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"/>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Mois de production du fruit</label>
      <input type="text" name="fruit_production_month" placeholder="ex: mars, avril" class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"/>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Température max (°C)</label>
        <input type="number" name="max_temp" class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Température min (°C)</label>
        <input type="number" name="min_temp" class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"/>
      </div>
    </div>
    <div class="pt-4">
      <input type="submit" value="Create" class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"/>
    </div>
  </form>
</div>
    )

    
}

