import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ExportButton = () => {
  const [exportFormat, setExportFormat] = useState('');
  const [exportOptions, setExportOptions] = useState({
    onlyVisibleColumns: false,
  });
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const tableData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '098-765-4321',
      address: '456 Elm St',
      city: 'Othertown',
      state: 'NY',
      zip: '67890'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '555-123-4567',
      address: '789 Oak St',
      city: 'Thistown',
      state: 'TX',
      zip: '34567'
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      phone: '234-567-8901',
      address: '901 Maple St',
      city: 'Thatown',
      state: 'FL',
      zip: '56789'
    }
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'City', dataIndex: 'city' },
    { title: 'State', dataIndex: 'state' },
    { title: 'Zip', dataIndex: 'zip' }
  ];

  const handleExportClick = (format) => {
    setExportFormat(format);
    setExportOptions({ onlyVisibleColumns: false });
  };

  const handleExportOptionsChange = (event) => {
    setExportOptions({ onlyVisibleColumns: event.target.checked });
  };

  const handleExport = () => {
    setExporting(true);

    if (exportFormat === 'CSV') {
      const csvData = tableData.map(row => columns.map(col => row[col.dataIndex]));
      csvData.unshift(columns.map(col => col.title));
      const csvBlob = new Blob([csvData.join('\n')], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);
      setDownloadLink(csvUrl);
    } else if (exportFormat === 'PDF') {
      const doc = new jsPDF();
      doc.autoTable({
        head: [columns.map(col => col.title)],
        body: tableData.map(row => columns.map(col => row[col.dataIndex]))
      });
      const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setDownloadLink(pdfUrl);
    } else if (exportFormat === 'XLSX') {
      const worksheet = XLSX.utils.json_to_sheet(tableData, { header: columns.map(col => col.dataIndex) });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const xlsxBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'blob' });
      const xlsxUrl = URL.createObjectURL(xlsxBlob);
      setDownloadLink(xlsxUrl);
    }

    setExporting(false);
    setExportSuccess(true);
  };

  return (
    <div>
      <button
        className="export-button"
        onClick={() => handleExportClick('')}
      >
        Export As...
      </button>
      {exportFormat && (
        <div className="export-options-dialog">
          <h2>Export Options</h2>
          <label>
            <input
              type="checkbox"
              checked={exportOptions.onlyVisibleColumns}
              onChange={handleExportOptionsChange}
            />
            Export only visible columns
          </label>
          <button
            className="ok-button"
            onClick={handleExport}
          >
            Ok
          </button>
          <button
            className="cancel-button"
            onClick={() => setExportFormat('')}
          >
            Cancel
          </button>
        </div>
      )}
      {exporting && (
        <div className="progress-indicator">
          Exporting...
        </div>
      )}
      {exportSuccess && (
        <div className="export-success">
          Export successful! <a href={downloadLink} download={`table_data.${exportFormat.toLowerCase()}`}>Download {exportFormat} file</a>
        </div>
      )}
      {exportFormat === 'CSV' && (
        <CSVLink
          data={tableData}
          headers={columns.map(col => ({ label: col.title, key: col.dataIndex }))}
          filename="table_data.csv"
          className="hidden"
          target="_blank"
        />
      )}
    </div>
  );
};

export default ExportButton;
