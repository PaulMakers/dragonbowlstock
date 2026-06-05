'use server';
/**
 * @fileOverview A Genkit flow for providing proactive restock recommendations.
 *
 * - proactiveRestockRecommendations - A function that analyzes historical stock-out patterns
 *                                     and suggests a prioritized list of items for restocking.
 * - ProactiveRestockRecommendationsInput - The input type for the proactiveRestockRecommendations function.
 * - ProactiveRestockRecommendationsOutput - The return type for the proactiveRestockRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Zod schemas
const ProactiveRestockRecommendationsInputSchema = z.object({
  daysToLookBack: z.number().int().positive().describe('Number of days to look back for historical stock-out data analysis.'),
});
export type ProactiveRestockRecommendationsInput = z.infer<typeof ProactiveRestockRecommendationsInputSchema>;

const RestockItemSchema = z.object({
  itemName: z.string().describe('The name of the item to restock.'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority level for restocking this item.'),
  estimatedQuantity: z.number().int().positive().describe('The estimated quantity needed for restocking.'),
  unit: z.string().describe('The unit of measurement for the estimated quantity (e.g., "Butir", "Botol", "Pack", "Pcs").'),
  reason: z.string().describe('A brief explanation for the recommendation, based on historical patterns.'),
});

const ProactiveRestockRecommendationsOutputSchema = z.object({
  recommendations: z.array(RestockItemSchema).describe('A prioritized list of items recommended for restocking.'),
});
export type ProactiveRestockRecommendationsOutput = z.infer<typeof ProactiveRestockRecommendationsOutputSchema>;

// Helper type for historical data entries, mirroring the GAS output
type BarangHabisEntry = {
  id: string;
  timestamp: string;
  tanggal: string; // e.g., "05 Juni 2024"
  namaBarang: string;
  jumlah: string | number;
  satuan: string;
  status: string; // "Habis", "Sedang Dibeli", "Sudah Tersedia", "Belum Dicek"
  catatan: string;
  inputOleh: string;
};

// Mock function to simulate fetching historical data from Google Apps Script
// In a real application, this would involve an actual fetch call to the GAS endpoint.
async function fetchHistoricalBarangHabis(daysToLookBack: number): Promise<BarangHabisEntry[]> {
  console.log(`Simulating fetch of historical data for the last ${daysToLookBack} days.`);

  // Calculate start and end dates based on daysToLookBack
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - daysToLookBack);

  // Mock data for demonstration, assuming current date is around '08 Juni 2024' for relevance.
  const mockData: BarangHabisEntry[] = [
    { id: '1', timestamp: '10:00', tanggal: '01 Juni 2024', namaBarang: 'Telur', jumlah: '30', satuan: 'Butir', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Andi' },
    { id: '2', timestamp: '11:00', tanggal: '01 Juni 2024', namaBarang: 'Saus Sambal', jumlah: '5', satuan: 'Botol', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Andi' },
    { id: '3', timestamp: '12:00', tanggal: '02 Juni 2024', namaBarang: 'Telur', jumlah: '25', satuan: 'Butir', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Budi' },
    { id: '4', timestamp: '13:00', tanggal: '02 Juni 2024', namaBarang: 'Mie Rainbow', jumlah: '10', satuan: 'Pack', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Budi' },
    { id: '5', timestamp: '14:00', tanggal: '03 Juni 2024', namaBarang: 'Telur', jumlah: '35', satuan: 'Butir', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Andi' },
    { id: '6', timestamp: '15:00', tanggal: '03 Juni 2024', namaBarang: 'Cup 16 Oz', jumlah: '100', satuan: 'Pcs', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Andi' },
    { id: '7', timestamp: '16:00', tanggal: '04 Juni 2024', namaBarang: 'Saus Sambal', jumlah: '8', satuan: 'Botol', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Budi' },
    { id: '8', timestamp: '17:00', tanggal: '04 Juni 2024', namaBarang: 'Plastik Es', jumlah: '200', satuan: 'Pcs', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Budi' },
    { id: '9', timestamp: '18:00', tanggal: '05 Juni 2024', namaBarang: 'Telur', jumlah: '40', satuan: 'Butir', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Andi' },
    { id: '10', timestamp: '19:00', tanggal: '05 Juni 2024', namaBarang: 'Mie Rainbow', jumlah: '12', satuan: 'Pack', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Andi' },
    { id: '11', timestamp: '09:00', tanggal: '06 Juni 2024', namaBarang: 'Telur', jumlah: '30', satuan: 'Butir', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Novia' },
    { id: '12', timestamp: '10:00', tanggal: '06 Juni 2024', namaBarang: 'Saus Sambal', jumlah: '6', satuan: 'Botol', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Novia' },
    { id: '13', timestamp: '11:00', tanggal: '07 Juni 2024', namaBarang: 'Telur', jumlah: '28', satuan: 'Butir', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Indri' },
    { id: '14', timestamp: '12:00', tanggal: '07 Juni 2024', namaBarang: 'Plastik Es', jumlah: '150', satuan: 'Pcs', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Indri' },
    { id: '15', timestamp: '13:00', tanggal: '08 Juni 2024', namaBarang: 'Telur', jumlah: '32', satuan: 'Butir', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Lidia' },
    { id: '16', timestamp: '14:00', tanggal: '08 Juni 2024', namaBarang: 'Cup 16 Oz', jumlah: '80', satuan: 'Pcs', status: 'Habis', catatan: 'Stok habis', inputOleh: 'Lidia' },
  ];

  const filteredData = mockData.filter(entry => {
    // Parse date from "DD Bulan YYYY" format
    const [day, monthName, year] = entry.tanggal.split(' ');
    const monthMap: {[key: string]: number} = {
      'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
      'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
    };
    const entryDate = new Date(parseInt(year), monthMap[monthName], parseInt(day));

    return entryDate >= startDate && entryDate <= endDate && entry.status === 'Habis';
  });

  return filteredData;
}


const proactiveRestockPrompt = ai.definePrompt({
  name: 'proactiveRestockPrompt',
  input: { schema: z.object({
    analysisPeriodDescription: z.string().describe('A human-readable description of the period for which the analysis was performed (e.g., "last 30 days").'),
    historicalStockOuts: z.string().describe('A JSON string representing historical stock-out data. Each item should have "namaBarang", "tanggal", "jumlah", and "satuan". Only "Habis" status items are included.'),
  })},
  output: { schema: ProactiveRestockRecommendationsOutputSchema },
  prompt: `You are an intelligent inventory management assistant for "Dragon Bowl", an F&B business.\nYour task is to analyze historical stock-out patterns from the provided data and provide proactive restocking recommendations.\n\nAnalyze the following historical stock-out data for the period: {{{analysisPeriodDescription}}}.\nHistorical Stock-out Data (JSON array of objects with namaBarang, tanggal, jumlah, satuan):\n{{{historicalStockOuts}}}\n\nBased on this data, identify items that frequently run out or have significant depletion quantities, and suggest a prioritized list for restocking.\nFor each item, you must provide:\n- itemName: The name of the item.\n- priority: 'High', 'Medium', or 'Low' based on frequency and quantity of depletion over the period. Items that ran out most often or in largest quantities should be High priority.\n- estimatedQuantity: An estimated quantity to restock, considering the average past depletion amounts and frequency. Try to suggest a reasonable, common purchase quantity that makes sense for an F&B business (e.g., 30 Butir for Telur, 10 Botol for Saus Sambal, 100 Pcs for Cup 16 Oz).\n- unit: The unit of measurement (e.g., "Butir", "Botol", "Pack", "Pcs") as found in the historical data.\n- reason: A concise explanation for the recommendation, explicitly referencing the historical patterns (e.g., "Ran out 5 times in the last 30 days, average depletion 30 Butir.").\n\nEnsure your output is a JSON object with a single key 'recommendations' containing an array of these item objects.\nIf no specific patterns are found for stock-outs, return an empty array for 'recommendations'.\nFocus only on items that appear in the 'historicalStockOuts' data with an implied 'Habis' status.\n`
});

export async function proactiveRestockRecommendations(input: ProactiveRestockRecommendationsInput): Promise<ProactiveRestockRecommendationsOutput> {
  return proactiveRestockRecommendationsFlow(input);
}

const proactiveRestockRecommendationsFlow = ai.defineFlow(
  {
    name: 'proactiveRestockRecommendationsFlow',
    inputSchema: ProactiveRestockRecommendationsInputSchema,
    outputSchema: ProactiveRestockRecommendationsOutputSchema,
  },
  async (input) => {
    const historicalData = await fetchHistoricalBarangHabis(input.daysToLookBack);

    // Prepare data for the prompt. The prompt only needs namaBarang, tanggal, jumlah, satuan
    const historicalDataForPrompt = historicalData.map(item => ({
      namaBarang: item.namaBarang,
      tanggal: item.tanggal,
      jumlah: item.jumlah,
      satuan: item.satuan,
    }));

    const analysisPeriodDescription = `the last ${input.daysToLookBack} days`;

    const { output } = await proactiveRestockPrompt({
      analysisPeriodDescription,
      historicalStockOuts: JSON.stringify(historicalDataForPrompt, null, 2), // Pretty print for better LLM parsing
    });

    return output!;
  }
);