import React, { useEffect, useState } from 'react';
import './Panel.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Panel = (props) => {
  const serial = props.serial;

  const [userSerialData, setUserSerialData] = useState({});

  
  useEffect(() => {
    handleCheckSerial();
  }, []);
  if (!serial.title) {
    // Jeśli serial nie jest zdefiniowany, można wyświetlić komponent ładowania danych lub inny komunikat
    return (
      <div className="serial-panel">
        <img className="panel-image" src="" alt="Serial Image" />
        <div className="overlay">
          <h3>SERIAL</h3>
        </div>
      </div>
    );
  }

  const obrazek = getFormattedImageName(serial.title);

  function getFormattedImageName(title) {
    let formattedTitle = title.toLowerCase().replace(/\s/g, '');
    return '/' + formattedTitle + '1.jpg';
  }
  const handleCheckSerial = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/'; // Przekierowanie użytkownika, gdy nie ma tokenu uwierzytelniającego
    }
    if (token) {
      try {
        const config = {
          method: 'get',
          url: `http://localhost:8080/api/users/checkSerial/${serial.title}`,
          headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        };
        const { data: res } = await axios(config);
        setUserSerialData(res.data);
      } catch (error) {
        if (error.response && error.response.status >= 401 && error.response.status <= 500) {
          localStorage.removeItem('token');
          window.location.reload();
        }
      }
    }
  };
  const handleARSerial = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/'; // Przekierowanie użytkownika, gdy nie ma tokenu uwierzytelniającego
    }
    if (token) {
      try {
        const configA = {
          method: 'post',
          url: `http://localhost:8080/api/users/addSerial/${serial.title}`,
          headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        };

        const configR = {
          method: 'delete',
          url: `http://localhost:8080/api/users/removeSerial/${serial.title}`,
          headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        };
        if (!userSerialData.isAdded) {
          await axios(configA);
        } else {
          await axios(configR);
        }

        handleCheckSerial();
      } catch (error) {
        if (error.response && error.response.status >= 401 && error.response.status <= 500) {
          localStorage.removeItem('token');
          window.location.reload();
        }
      }
    }
  };

  
  
  const addButtonLabel = userSerialData.isAdded ? '✓' : '+';

  return (
    <div className="serial-panel">
      <div className="overlay-button">
        <button className="add-button" onClick={handleARSerial}>
          {addButtonLabel}
        </button>
      </div>
      <Link to={`/serial/${serial.title}`}>
        <img className="panel-image" src={process.env.PUBLIC_URL + obrazek} alt="Serial Image" />
        <div className="overlay">
          <h3>{serial.title}</h3>
        </div>
      </Link>
    </div>
  );
};

export default Panel;
