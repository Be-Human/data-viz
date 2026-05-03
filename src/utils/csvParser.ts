export interface ParsedData {
  headers: string[];
  labels: string[];
  datasets: Dataset[];
  rowCount: number;
  columnCount: number;
}

export interface Dataset {
  label: string;
  data: number[];
}

export function parseCSV(csvContent: string): ParsedData | null {
  if (!csvContent || csvContent.trim().length === 0) {
    return null;
  }

  const lines = csvContent
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length < 2) {
    return null;
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const headers = parseCSVLine(lines[0]);
  
  if (headers.length < 2) {
    return null;
  }

  const labels: string[] = [];
  const datasets: Dataset[] = [];

  for (let i = 1; i < headers.length; i++) {
    datasets.push({
      label: headers[i],
      data: []
    });
  }

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length !== headers.length) {
      continue;
    }

    labels.push(values[0]);

    for (let j = 1; j < values.length; j++) {
      const numValue = parseFloat(values[j]);
      if (!isNaN(numValue)) {
        datasets[j - 1].data.push(numValue);
      } else {
        datasets[j - 1].data.push(0);
      }
    }
  }

  if (labels.length === 0 || datasets.every(d => d.data.length === 0)) {
    return null;
  }

  return {
    headers,
    labels,
    datasets,
    rowCount: labels.length,
    columnCount: headers.length
  };
}

export const defaultSampleData = `月份,销售额,利润,订单数
1月,12000,3000,150
2月,15000,4500,180
3月,18000,5400,220
4月,14000,3500,160
5月,20000,6000,250
6月,22000,6600,280
7月,19000,5700,230
8月,25000,7500,300
9月,23000,6900,270
10月,21000,6300,240
11月,27000,8100,320
12月,30000,9000,350`;
