import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
    <div class="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
        <form action="" method="post" class="space-y-6">
            <div>
                <input type="text" name="nom" id="nom" placeholder="Nom"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <input type="text" name="prenom" id="prenom" placeholder="Prénom"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <input type="email" name="email" id="email" placeholder="Email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <input type="text" name="tel" id="tel" placeholder="Téléphone"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label for="message" class="block mb-2 font-medium text-gray-700">Message :</label>
                <textarea name="message" id="message" rows="4"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
                <input type="submit" value="Envoyer"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer" />
            </div>
        </form>
    </div>
    )
}