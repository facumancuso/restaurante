'use server';

/**
 * @fileOverview Menu item recommendation AI agent.
 *
 * - getMenuRecommendations - A function that handles the menu recommendation process.
 * - MenuRecommendationsInput - The input type for the getMenuRecommendations function.
 * - MenuRecommendationsOutput - The return type for the getMenuRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MenuRecommendationsInputSchema = z.object({
  timeOfDay: z.string().describe('The time of day (e.g., morning, afternoon, evening).'),
  menu: z.string().describe('The current menu items, as a JSON string.'),
});
export type MenuRecommendationsInput = z.infer<typeof MenuRecommendationsInputSchema>;

const MenuRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of recommended menu items based on the time of day and menu.'),
});
export type MenuRecommendationsOutput = z.infer<typeof MenuRecommendationsOutputSchema>;

export async function getMenuRecommendations(input: MenuRecommendationsInput): Promise<MenuRecommendationsOutput> {
  return menuRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'menuRecommendationsPrompt',
  input: {schema: MenuRecommendationsInputSchema},
  output: {schema: MenuRecommendationsOutputSchema},
  prompt: `Eres un experto en restaurantes especializado en recomendaciones de menú.

Utilizarás la hora del día y el menú disponible para recomendar artículos al cliente.

Hora del Día: {{{timeOfDay}}}
Menú: {{{menu}}}

Recomienda 3 artículos del menú que un cliente podría disfrutar basándose en la hora del día.
Devuelve solo los nombres de los artículos recomendados.
`,
});

const menuRecommendationsFlow = ai.defineFlow(
  {
    name: 'menuRecommendationsFlow',
    inputSchema: MenuRecommendationsInputSchema,
    outputSchema: MenuRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
