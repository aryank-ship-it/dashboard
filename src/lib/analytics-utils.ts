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

export const parseCSV = (file: File): Promise<ParseResult> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as any[];

                let summary = {};
                let monthly = [];

                // Heuristic: row has 'totalRevenue' -> summary
                const summaryRow = data.find(r => r.totalRevenue !== undefined || r.TotalRevenue !== undefined);
                if (summaryRow) summary = summaryRow;

                // Heuristic: row has 'month' and 'revenue' -> monthly data
                const monthlyRows = data.filter(r =>
                    (r.month !== undefined || r.Month !== undefined) &&
                    (r.revenue !== undefined || r.Revenue !== undefined)
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
            const firstRow: any = json[0];
            if ('totalRevenue' in firstRow || 'growthRate' in firstRow) {
                summaryData = firstRow;
            } else {
                json.forEach((row: any) => {
                    const values = Object.values(row);
                    if (values.length >= 2) {
                        summaryData[String(values[0])] = values[1];
                    }
                });
            }
        }
    } else {
        // Fallback: Try first sheet
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        if (json.length > 0) {
            summaryData = json[0];
        }
    }

    if (monthlySheetName) {
        const sheet = workbook.Sheets[monthlySheetName];
        monthlyData = XLSX.utils.sheet_to_json(sheet);
    } else {
        if (workbook.SheetNames.length > 1) {
            const sheet = workbook.Sheets[workbook.SheetNames[1]];
            monthlyData = XLSX.utils.sheet_to_json(sheet);
        } else if (workbook.SheetNames.length === 1) {
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json: any[] = XLSX.utils.sheet_to_json(sheet);
            const potentialSummary = json.find(r => 'totalRevenue' in r);
            if (potentialSummary) summaryData = potentialSummary;
            monthlyData = json.filter(r => 'month' in r && 'revenue' in r);
        }
    }

    // Refined check for single sheet mixed content
    // If we haven't found distinct summary/monthly data in single sheet yet via sheet names
    if (Object.keys(summaryData).length === 0 && monthlyData.length === 0 && workbook.SheetNames.length === 1) {
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json: any[] = XLSX.utils.sheet_to_json(sheet);
        const potentialSummary = json.find(r => 'totalRevenue' in r);
        if (potentialSummary) summaryData = potentialSummary;
        monthlyData = json.filter(r => 'month' in r && 'revenue' in r);
    }

    return { summary: summaryData, monthly: monthlyData };
};

export const processAnalyticsData = (summary: any, monthly: any[]): { kpis: AnalyticsData, chartData: MonthlyData[] } => {
    if (!summary || !monthly || !Array.isArray(monthly)) {
        throw new Error("Invalid file structure");
    }

    const revenue = Number(summary.totalRevenue || summary.TotalRevenue || 0);
    const growth = Number(summary.growthRate || summary.GrowthRate || 0);
    const users = Number(summary.activeUsers || summary.ActiveUsers || 0);
    const conversion = Number(summary.conversionRate || summary.ConversionRate || 0);

    const kpis = {
        revenue,
        growth,
        users,
        conversion
    };

    const chartData = monthly.map(m => ({
        month: String(m.month || m.Month || ''),
        revenue: Number(m.revenue || m.Revenue || 0),
        projects: Number(m.projects || m.Projects || 0)
    })).filter(item => item.month);

    return { kpis, chartData };
};
