// src/components/PaginatedTable.js
import React, { useState } from 'react';

const PaginatedTable = ({ data, columns, perPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the indices for the current page
  const indexOfLastRow = currentPage * perPage;
  const indexOfFirstRow = indexOfLastRow - perPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / perPage);
  // Handle page change
  const handleClick = (page) => {
    if(page === 'Prev') {
        setCurrentPage(currentPage - 1 < 1 ? 1 : currentPage - 1);
    }
    else if(page === 'Next') {
        setCurrentPage(currentPage + 1 > totalPages ? totalPages : currentPage + 1);
    }
    else {
        setCurrentPage(page);
    }
  } 

  const pages = [];

  let startPoint = currentPage - 2;
  let endPoint = currentPage + 2;
  if(startPoint < 1){
    startPoint = 1;
    endPoint += 1;
  }

  if(endPoint >= totalPages){
    endPoint = totalPages;
  }

  for (let i = startPoint; i <= endPoint; i++) {
    pages.push(i);  
  }

 
  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            {columns.filter((column) => column.visible).map((column) => (
              <th key={column.dataIndex}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index}>
              {columns.filter((column) => column.visible).map((column) => (
                <td key={column.dataIndex}>{row[column.dataIndex]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='pagination'>
        {currentPage !== 1 && (
        <span className='page-number' key={'Prev'} onClick={() => handleClick('Prev')}>
            {'Prev'}
        </span>    
        )}
        
        {startPoint > 1 && (
            <span className='page-number' key={1} onClick={() => handleClick(1)}>
                {1}
            </span>
        )}
        
        {startPoint > 1 && (<span> .  .  . </span>)}
        
        {pages.map((number) => (
          <span className={'page-number'+(number === currentPage ? ' active' : '')} key={number} onClick={() => handleClick(number)}>
            {number}
          </span>
        ))}
        
        {endPoint < totalPages && currentPage + 3 < totalPages && (<span> .  .  . </span>)}
        {endPoint < totalPages && (
            <span className='page-number' key={totalPages} onClick={() => handleClick(totalPages)}>
            {totalPages}
        </span>
        )}
        {currentPage != totalPages && (
            <span className='page-number' key={'Next'} onClick={() => handleClick('Next')}>
                {'Next'}
            </span>
        )}
      </div>
    </div>
  );
};

export default PaginatedTable;
