import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface AnalyticsData {
    revenue: number;
    growth: number;
    users: number;
    conversion: number;
}

export interface MonthlyData {
    month: string;
    revenue: number;
    projects: number;
}

export interface ParseResult {
    summary: any;
    monthly: any[];
}

// Helper to normalize keys: remove spaces, lowercase, remove special chars
const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

// Helper to find value by fuzzy key match
const getValue = (obj: any, targetKey: string) => {
    if (!obj) return undefined;
    const normalizedTarget = normalizeKey(targetKey);
    const key = Object.keys(obj).find(k => normalizeKey(k) === normalizedTarget);
    return key ? obj[key] : undefined;
};

// Helper: Check if row looks like it has summary data
const isSummaryRow = (row: any) => {
    return getValue(row, 'totalRevenue') !== undefined ||
        getValue(row, 'revenue') !== undefined;
    // simplistic check, might overlap with monthly if not careful
};

export const parseCSV = (file: File): Promise<ParseResult> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as any[];

                let summary = {};
                let monthly = [];

                // Strategy: 
                // 1. Look for a row that has 'totalRevenue' or similar.
                // 2. Look for rows that have 'month' and 'revenue'.

                const summaryRow = data.find(r => getValue(r, 'totalRevenue') !== undefined);
                if (summaryRow) summary = summaryRow;

                const monthlyRows = data.filter(r =>
                    getValue(r, 'month') !== undefined &&
                    getValue(r, 'revenue') !== undefined
                );
                monthly = monthlyRows;

                resolve({ summary, monthly });
            },
            error: (err: Error) => reject(err)
        });
    });
};

export const parseExcel = async (file: File): Promise<ParseResult> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    let summaryData: any = {};
    let monthlyData: any[] = [];

    const summarySheetName = workbook.SheetNames.find(n => n.toLowerCase().includes('summary'));
    const monthlySheetName = workbook.SheetNames.find(n => n.toLowerCase().includes('month'));

    if (summarySheetName) {
        const sheet = workbook.Sheets[summarySheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        if (json.length > 0) {
            // Check if row 1 is key-value or headers
            const firstRow: any = json[0];
            if (getValue(firstRow, 'totalRevenue') !== undefined) {
                summaryData = firstRow;
            } else {
                // Assume Key | Value pairs
                json.forEach((row: any) => {
                    const values = Object.values(row);
                    if (values.length >= 2) {
                        const key = String(values[0]);
                        const val = values[1];
                        // Add to summary data using a normalized key approach? 
                        // Better to just store as is, and let processData normalize retrieval.
                        // But we want a flat object { totalRevenue: 123, ... }
                        // Let's rely on flexible key matching later, but we need to construct a decent object.
                        // If key matches our targets, assign it.
                        const normKey = normalizeKey(key);
                        if (['totalrevenue', 'growthrate', 'activeusers', 'conversionrate'].includes(normKey)) {
                            summaryData[key] = val; // Store orig key or normalized?
                            // Actually, let's store with a clean key if we match
                            if (normKey === 'totalrevenue') summaryData['totalRevenue'] = val;
                            if (normKey === 'growthrate') summaryData['growthRate'] = val;
                            if (normKey === 'activeusers') summaryData['activeUsers'] = val;
                            if (normKey === 'conversionrate') summaryData['conversionRate'] = val;
                        }
                    }
                });
            }
        }
    } else {
        // Fallback: Try first sheet for summary
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        if (json.length > 0) {
            const firstRow: any = json[0];
            if (getValue(firstRow, 'totalRevenue') !== undefined) {
                summaryData = firstRow;
            }
        }
    }

    if (monthlySheetName) {
        const sheet = workbook.Sheets[monthlySheetName];
        monthlyData = XLSX.utils.sheet_to_json(sheet);
    } else {
        const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
        const json1 = XLSX.utils.sheet_to_json(sheet1);

        // Maybe sheet 1 has monthly data?
        const potentialMonthly = json1.filter((r: any) => getValue(r, 'month') !== undefined && getValue(r, 'revenue') !== undefined);
        if (potentialMonthly.length > 0) {
            monthlyData = potentialMonthly;
        } else if (workbook.SheetNames.length > 1) {
            // Try sheet 2
            const sheet2 = workbook.Sheets[workbook.SheetNames[1]];
            monthlyData = XLSX.utils.sheet_to_json(sheet2);
        }
    }

    return { summary: summaryData, monthly: monthlyData };
};

export const processAnalyticsData = (summary: any, monthly: any[]): { kpis: AnalyticsData, chartData: MonthlyData[] } => {
    // If no summary found (empty object), do we fail?
    // The user prompt says "Populate KPI cards from parsed summary data... If parsing fails, show an error state"
    // If we found NO matching keys, we can consider that a fail or just 0s.
    // Let's implement robust retrieval.

    const revenue = Number(getValue(summary, 'totalRevenue') || 0);
    const growth = Number(getValue(summary, 'growthRate') || 0);
    const users = Number(getValue(summary, 'activeUsers') || 0);
    const conversion = Number(getValue(summary, 'conversionRate') || 0);

    // If all are 0, and summary was not empty but had no matching keys, maybe it's the wrong file structure?
    // Or maybe the values are actually 0.

    const kpis = {
        revenue,
        growth,
        users,
        conversion
    };

    const chartData = monthly.map(m => ({
        month: String(getValue(m, 'month') || ''),
        revenue: Number(getValue(m, 'revenue') || 0),
        projects: Number(getValue(m, 'projects') || 0)
    })).filter(item => item.month); // Filter out rows without month

    return { kpis, chartData };
};
