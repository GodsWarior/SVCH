import { http } from './http';

export const reportApi = {
  download: async (path: 'sales.pdf' | 'stock.docx') => {
    const response = await http.get(`/reports/${path}`, { responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = path === 'sales.pdf' ? 'sales-report.pdf' : 'stock-report.docx';
    link.click();
    URL.revokeObjectURL(url);
  },
};
