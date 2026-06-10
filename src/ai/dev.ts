
import { config } from 'dotenv';
config();

import '@/ai/flows/daily-stock-anomaly-report.ts';
import '@/ai/flows/proactive-restock-recommendations.ts';
import '@/ai/flows/parse-stock-report-flow.ts';
