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

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxa9VzpWU36--sZv8ZUfVTZk2fDxL65zClbHgR5PHANDJulf-bmh2WS4ariZvHrddoF/exec';

/**
 * Calls the Google Apps Script API endpoint.
 * @param action The action to perform (e.g., 'getBarangHabis', 'getStatistik').
 * @param data Optional payload for the request.
 * @returns The JSON response from the Apps Script.
 */
async function callAppsScript(action: string, data: any = {}): Promise<any> {
  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `action=${action}&${new URLSearchParams({ contents: JSON.stringify(data) }).toString()}`,
  });
  if (!response.ok) {
    throw new Error(`Apps Script call failed: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Parses a date string in 