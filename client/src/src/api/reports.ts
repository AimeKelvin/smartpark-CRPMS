import client from './client';
export const downloadMonthlyReport = async (month: number, year: number) => {
  const response = await client.get(`/reports/monthly`, {
    params: {
      month,
      year
    },
    responseType: 'blob'
  });
  return response.data;
};
export const getDashboardStats = async () => {
  // Assuming there's an endpoint for this, or we calculate it.
  // Based on prompt, we might need to fetch individual lists or a specific stats endpoint.
  // I'll assume a stats endpoint exists or I'll handle it in the component by fetching lists.
  // For now, let's assume a stats endpoint for efficiency if backend supports it,
  // otherwise we'll fetch counts in the component.
  // The prompt says "Fetch data using corresponding endpoints", implying we might need to hit /cars, /payments etc.
  // I'll leave this empty and handle in Dashboard component.
  return {};
};