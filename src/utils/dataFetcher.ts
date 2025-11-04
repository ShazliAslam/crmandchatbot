export interface ClientData {
  client: string;
  numberOfHeadshots: number;
  amountPrice: number;
  email: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalClients: number;
  totalHeadshots: number;
  averageOrderValue: number;
  revenueByClient: Array<{ client: string; revenue: number }>;
  headshotDistribution: Array<{ count: number; clients: number }>;
  revenueTimeline: Array<{ index: number; revenue: number }>;
}

const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1yaLxo3K5YElmFQvJ0iC6ttMD-RH0NyBdvAFFYFSryew/export?format=csv&gid=0';

function parsePrice(priceString: string): number {
  const cleanedPrice = priceString.replace(/[^\d.]/g, '');
  return parseFloat(cleanedPrice) || 0;
}

export async function fetchGoogleSheetsData(): Promise<ClientData[]> {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    const csvText = await response.text();

    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    const data: ClientData[] = lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        client: values[0]?.trim() || '',
        numberOfHeadshots: parseInt(values[1]) || 0,
        amountPrice: parsePrice(values[2] || '0'),
        email: values[3]?.trim() || ''
      };
    }).filter(item => item.client);

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export function calculateMetrics(data: ClientData[]): DashboardMetrics {
  const totalRevenue = data.reduce((sum, item) => sum + item.amountPrice, 0);
  const totalClients = data.length;
  const totalHeadshots = data.reduce((sum, item) => sum + item.numberOfHeadshots, 0);
  const averageOrderValue = totalClients > 0 ? totalRevenue / totalClients : 0;

  const revenueByClient = data.map(item => ({
    client: item.client,
    revenue: item.amountPrice
  })).sort((a, b) => b.revenue - a.revenue);

  const headshotMap = new Map<number, number>();
  data.forEach(item => {
    const count = item.numberOfHeadshots;
    headshotMap.set(count, (headshotMap.get(count) || 0) + 1);
  });

  const headshotDistribution = Array.from(headshotMap.entries())
    .map(([count, clients]) => ({ count, clients }))
    .sort((a, b) => a.count - b.count);

  const revenueTimeline = data.map((item, index) => ({
    index: index + 1,
    revenue: item.amountPrice
  }));

  return {
    totalRevenue,
    totalClients,
    totalHeadshots,
    averageOrderValue,
    revenueByClient,
    headshotDistribution,
    revenueTimeline
  };
}
