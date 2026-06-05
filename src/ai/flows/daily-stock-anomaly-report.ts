'use server';
/**
 * @fileOverview A Genkit flow to generate a natural language summary of daily or weekly stock events.
 *
 * - generateDailyStockAnomalyReport - The main function to trigger the report generation.
 * - DailyStockAnomalyReportInput - The input type for the report, specifying the date range.
 * - DailyStockAnomalyReportOutput - The output type for the report, containing the summary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { APPS_SCRIPT_URL } from '@/lib/constants';

const DailyStockAnomalyReportInputSchema = z.object({
  dateRange: z.string().describe('The date range for the report (e.g., "today", "last 7 days").'),
});
export type DailyStockAnomalyReportInput = z.infer<typeof DailyStockAnomalyReportInputSchema>;

const DailyStockAnomalyReportOutputSchema = z.object({
  summary: z.string().describe('A natural language summary of stock anomalies and events.'),
  anomaliesFound: z.boolean().describe('Whether any significant anomalies were identified.'),
});
export type DailyStockAnomalyReportOutput = z.infer<typeof DailyStockAnomalyReportOutputSchema>;

/**
 * Calls the Google Apps Script API endpoint.
 */
async function callAppsScript(action: string, data: any = {}): Promise<any> {
  const params = new URLSearchParams();
  params.append('action', action);
  params.append('contents', JSON.stringify(data));

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Apps Script call failed: ${response.statusText}`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON from Apps Script: ${text.substring(0, 100)}`);
  }
}

const anomalyReportPrompt = ai.definePrompt({
  name: 'anomalyReportPrompt',
  input: {
    schema: z.object({
      dateRange: z.string(),
      stockData: z.string(),
    }),
  },
  output: {
    schema: DailyStockAnomalyReportOutputSchema,
  },
  prompt: `You are an inventory analyst for Dragon Bowl. 
Analyze the following stock data for the period: {{{dateRange}}}.
Data: {{{stockData}}}

Identify any anomalies such as:
1. Items running out unusually fast.
2. Items that have been "Habis" for more than 2 days.
3. Sudden spikes in "Sedang Dibeli" items.

Generate a concise, professional summary in Indonesian. If no anomalies are found, state that stock levels are normal.`,
});

export async function generateDailyStockAnomalyReport(input: DailyStockAnomalyReportInput): Promise<DailyStockAnomalyReportOutput> {
  return generateDailyStockAnomalyReportFlow(input);
}

const generateDailyStockAnomalyReportFlow = ai.defineFlow(
  {
    name: 'generateDailyStockAnomalyReportFlow',
    inputSchema: DailyStockAnomalyReportInputSchema,
    outputSchema: DailyStockAnomalyReportOutputSchema,
  },
  async (input) => {
    // Fetch data from backend
    const stockRes = await callAppsScript('getBarangHabis', { limit: 100 });
    const stockData = JSON.stringify(stockRes.data || []);

    const { output } = await anomalyReportPrompt({
      dateRange: input.dateRange,
      stockData,
    });

    return output!;
  }
);
