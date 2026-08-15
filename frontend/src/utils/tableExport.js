/**
 * Data Table Export Utilities (CSV & JSON)
 */

export function exportTableToCsv(columns, data, filename = 'erp_export.csv') {
  if (!data || data.length === 0) return;

  // Filter columns that have a key (exclude pure action/checkbox columns)
  const exportableCols = columns.filter((col) => col.key && col.key !== 'actions');

  // Build CSV Header
  const headers = exportableCols.map((col) => `"${col.label || col.key}"`).join(',');

  // Build CSV Rows
  const rows = data.map((row) =>
    exportableCols
      .map((col) => {
        let val = row[col.key];
        if (val === null || val === undefined) {
          val = '';
        } else if (typeof val === 'object') {
          val = JSON.stringify(val);
        } else {
          val = String(val);
        }
        // Escape quotes
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = [headers, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportTableToJson(data, filename = 'erp_export.json') {
  if (!data || data.length === 0) return;

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
