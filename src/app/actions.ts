'use server'

import type { Product } from '@/lib/types';

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "mañana";
    if (hour >= 12 && hour < 18) return "tarde";
    return "noche";
}

export async function fetchAIRecommendations(products: Product[]) {
    try {
        if (!products.length) return [];
        
        // Por ahora devolver recomendaciones mock para evitar errores
        const mockRecommendations = [
            "Pizza Margherita",
            "Hamburguesa Clásica", 
            "Ensalada César"
        ];
        
        return mockRecommendations.slice(0, 3);
        
        // TODO: Reactivar AI cuando esté funcionando
        /*
        const menu = products.map(p => ({ name: p.name, description: p.description, price: p.salePrice }));

        const result = await getMenuRecommendations({
            timeOfDay: getTimeOfDay(),
            menu: JSON.stringify(menu),
        });

        const recommendedNames = result.recommendations || [];
        
        return recommendedNames.slice(0, 3);
        */
    } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        return ["Pizza Margherita", "Hamburguesa Clásica", "Ensalada César"];
    }
}