import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import jsonData from './data/source.json';

import PaginatedTable from './Table.jsx';


const ExportButton = () => {
  const [exportFormat, setExportFormat] = useState('');
  const [exportOptions, setExportOptions] = useState({
    onlyVisibleColumns: false,
  });
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const [showOptions, setShowOptions] = useState(false);
  
  const tableData = jsonData;

  const [columns, setColumns] = useState([
    { title: 'ID', dataIndex: 'id', visible: true },
    { title: 'Name', dataIndex: 'name', visible: true  },
    { title: 'Email', dataIndex: 'email', visible: true  },
    { title: 'Contact', dataIndex: 'contact', visible: true  },
    { title: 'Address', dataIndex: 'address', visible: true  },
    { title: 'Capacity', dataIndex: 'capacity', visible: true  },
    { title: 'Manager', dataIndex: 'manager', visible: true  },
  ]);

  // Toggle column visibility
  const toggleColumnVisibility = (dataIndex) => {
    setColumns(columns.map(col =>
      col.dataIndex === dataIndex ? { ...col, visible: !col.visible } : col
    ));
  };
  const handleExportClick = () => {
    setShowOptions(!showOptions);
    setExportFormat(exportFormat);
    setExportOptions({ onlyVisibleColumns: false });
  };

  const handleExportOptionsChange = (event) => {
    setExportOptions({ onlyVisibleColumns: event.target.checked });
  };

  const getExportColumns = () => {
    let visibleColumns = columns.filter(col => col.visible);
    if (exportOptions.onlyVisibleColumns) {
      return visibleColumns;
    }

    return columns
  }

  const getExportTableData = () => {
    if (exportOptions.onlyVisibleColumns) {
      return tableData.map(row => {
        const formattedRow = {};
        columns.forEach(col => {
          if(col.visible) {
            formattedRow[col.dataIndex] = row[col.dataIndex];
          }
        });
        return formattedRow;
      });
    }
    return tableData;
  }

  const exportAsCSV = () => {
    const exportColumns = getExportColumns();
    const exportTableData = getExportTableData();
    
    const csvData = exportTableData.map(row => exportColumns.map(col => row[col.dataIndex]));
    csvData.unshift(exportColumns.map(col => col.title));

    const csvBlob = new Blob([csvData.join('\n')], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);
    
    setDownloadLink(csvUrl);
  }
  const exportAsPdf = () => {
    const exportColumns = getExportColumns();
    const exportTableData = getExportTableData();
    
    const doc = new jsPDF();
    doc.autoTable({
      head: [exportColumns.map(col => col.title)],
      body: exportTableData.map(row => exportColumns.map(col => row[col.dataIndex]))
    });
    
    const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    setDownloadLink(pdfUrl);
  }

  const exportAsXlsx = () => {
    const exportColumns = getExportColumns();
    const exportTableData = getExportTableData();
    
    const worksheet = XLSX.utils.json_to_sheet(exportTableData, { header: exportColumns.map(col => col.dataIndex) });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const binaryString = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    const buffer = new ArrayBuffer(binaryString.length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < binaryString.length; i++) {
      view[i] = binaryString.charCodeAt(i) & 0xFF;
    }
    const xlsxBlob = new Blob([buffer], { type: 'application/octet-stream' });

    const xlsxUrl = URL.createObjectURL(xlsxBlob);
    setDownloadLink(xlsxUrl);
  }

  const handleOptionClick = (exportFormat) => {
    setExporting(false);
    setExportSuccess(false);
    setShowOptions(!showOptions);
    setExportFormat(exportFormat);
  }
  const handleExport = () => {
    setExporting(true);

    if (exportFormat === 'CSV') {
      exportAsCSV();
    } else if (exportFormat === 'PDF') {
      exportAsPdf();
    } else if (exportFormat === 'XLSX') {
      exportAsXlsx();  
    }

    setExporting(false);
    setExportSuccess(true);
  };

  return (
    <div>  
        <h2>Assignment-1: Export Functionality </h2>
        <div className='table-header'> 
          <div className='select-column-container'>
              <span
                className="select-columns-button"
              >
                Select Columns 
              </span>
            
              <ul className='toggle-columns'>
                {columns.map(col => (
                  <span key={col.dataIndex} onClick={() => toggleColumnVisibility(col.dataIndex)}>
                    <label>
                      <input
                        type="checkbox"
                        checked={col.visible}
                        onChange={() => toggleColumnVisibility(col.dataIndex)}
                      />
                      {col.title}
                    </label>
                  </span>
              ))}
              </ul>

          </div>
          <div className='export-container'>

            {exportFormat && !exporting && !exportSuccess && (
            <div className="export-options-dialog">
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
            <button
              className="export-button"
              onClick={() => handleExportClick()}
            >
              Export As{exportFormat ? ` ${exportFormat}` : '...'} 
            </button>
            {showOptions && (
            
              <ul className='export-options'>
                  <li onClick={() =>handleOptionClick('CSV')}>CSV </li>
                  <li onClick={() =>handleOptionClick('PDF')}>PDF </li>
                  <li onClick={() =>handleOptionClick('XLSX')}>XLSX </li>
              </ul>
            )}
          </div>
        </div>
        <PaginatedTable data={tableData} columns={columns} perPage={10} />
      
    </div>
  );
};

export default ExportButton;
