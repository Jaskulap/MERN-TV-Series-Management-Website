import React, { useState, useEffect } from 'react';
import Panel from './Panel';
import './PanelList.css';

const PanelList = ({ seriale, tag }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [panelsPerPage, setPanelsPerPage] = useState(5);

  const filteredSeriale = Array.isArray(seriale) && tag !== "All" ? seriale.filter(serial => serial.tag === tag) : seriale;
  
  var panelsToRender = filteredSeriale.slice(startIndex, startIndex + panelsPerPage).map(serial => (
    <Panel key={serial._id} serial={serial} />
  ));

  const handlePreviousPage = () => {
    setStartIndex(Math.max(startIndex - panelsPerPage, 0));
  };

  const handleNextPage = () => {
    setStartIndex(Math.min(startIndex + panelsPerPage, filteredSeriale.length - panelsPerPage));
  };
  const debounce = (func, delay) => {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  useEffect(() => {
    const handleResize = debounce(() => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 600) {
        setPanelsPerPage(2);
      } else if (windowWidth < 800) {
        setPanelsPerPage(3);
      } else if (windowWidth < 1200) {
        setPanelsPerPage(4);
      } else {
        setPanelsPerPage(5);
      }
      setStartIndex(Math.max(startIndex - panelsPerPage, 0));
    }, 150);
  
    const handleResizeAndOpen = () => {
      handleResize();
      // Dodaj tutaj kod, który ma zostać wykonany przy otwarciu widoku
    };
  
    window.addEventListener('resize', handleResizeAndOpen);
    handleResizeAndOpen(); // Wywołanie funkcji przy otwarciu widoku
  
    return () => {
      window.removeEventListener('resize', handleResizeAndOpen);
    };
  }, []);
  

  const showButtons = filteredSeriale.length > panelsPerPage;

  return (
    <div className="list-all">
      <h2 className="list-tag">{tag}</h2>
      <div className="panel-list">

        {showButtons && (<button onClick={handlePreviousPage} disabled={startIndex === 0}>
          &lt;
        </button>)}
        {panelsToRender}
        {showButtons && (<button onClick={handleNextPage} disabled={startIndex + panelsPerPage >= filteredSeriale.length}>
          &gt;
        </button>)}

      </div>
    </div>
  );
};

export default PanelList;
