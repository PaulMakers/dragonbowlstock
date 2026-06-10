
'use server';
/**
 * @fileOverview Genkit flow to parse unstructured stock text into structured report entries.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ParseStockReportInputSchema = z.object({
  text: z.string().describe('The unstructured text containing stock items and their quantities/status.'),
});
export type ParseStockReportInput = z.infer<typeof ParseStockReportInputSchema>;

const StockEntrySchema = z.object({
  namaBarang: z.string().describe('The identified name of the item.'),
  kategori: z.string().describe('The category of the item (Dapur/Kitchen, Beverage/Minuman, Depan/Kulkas, Dll/Perlengkapan).'),
  jumlah: z.string().describe('The quantity value.'),
  satuan: z.string().describe('The unit of measurement.'),
  status: z.enum(['Habis', 'Tersedia']).describe('Status based on description (e.g., "0 stock" is Habis, anything else is Tersedia).'),
  catatan: z.string().optional().describe('Additional details from the text.'),
});

const ParseStockReportOutputSchema = z.object({
  entries: z.array(StockEntrySchema).describe('List of structured stock report entries.'),
});
export type ParseStockReportOutput = z.infer<typeof ParseStockReportOutputSchema>;

const parseReportPrompt = ai.definePrompt({
  name: 'parseReportPrompt',
  input: { schema: ParseStockReportInputSchema },
  output: { schema: ParseStockReportOutputSchema },
  prompt: `You are an expert data assistant for Dragon Bowl Restaurant. 
Extract stock information from the following unstructured text:
"""
{{{text}}}
"""

Rules:
1. Map items to their correct categories: 
   - Items like juices, syrups, fruits, ronde, angsle ingredients belong to "Beverage/Minuman".
   - Packaged drinks (Cimory, Indomilk, Air Mineral) and snacks (Kacang, Kepang, Tini Wini Biti) belong to "Depan/Kulkas".
   - Packaging (Cup, Plastic) and cleaning items belong to "Dll/Perlengkapan".
   - Core food ingredients belong to "Dapur/Kitchen".
2. If the text says "0 stock" or "Habis", set status to "Habis". Otherwise, set to "Tersedia".
3. Clean the item names (remove hyphens, extra spaces).
4. Extract numerical quantities and units (e.g., "2 Pack", "1/2 Buah").`,
});

export async function parseStockReport(input: ParseStockReportInput): Promise<ParseStockReportOutput> {
  const { output } = await parseReportPrompt(input);
  return output!;
}
