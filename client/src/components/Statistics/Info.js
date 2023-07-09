import React, { useEffect, useRef,useState } from 'react';
import './Info.css';
import axios from 'axios';

const Info = ({ serial, isOpen, onClose }) => {
  const infoRef = useRef(null);

  const [userSerialData,setUserSerialData] = useState({});
  useEffect(() => {
    handleCheckSerial();
}, []);

const handleCheckSerial = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href="/"; // Przekierowanie użytkownika, gdy nie ma tokenu uwierzytelniającego
  }
  if (token) {
      try {
          const config = {
              method: "get",
              url: `http://localhost:8080/api/users/checkSerial/${serial.title}`,
              headers: { "Content-Type": "application/json", "x-access-token": token },
          };
          const { data: res } = await axios(config);
          setUserSerialData(res.data)
      } catch (error) {
          if (error.response && error.response.status >= 401 && error.response.status <= 500) {
              localStorage.removeItem("token");
              window.location.reload()
          }
      }
  }
};
var episodeNumber = -1;
const handleAREpisode = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/'; // Przekierowanie użytkownika, gdy nie ma tokenu uwierzytelniającego
  }
  if (token) {
    try {
      const configA = {
        method: 'post',
        url: `http://localhost:8080/api/users/addEpisode/${serial.title}/${episodeNumber}`,
        headers: { 'Content-Type': 'application/json', 'x-access-token': token },
      };

      const configR = {
        method: 'delete',
        url: `http://localhost:8080/api/users/removeSerial/${serial.title}/${episodeNumber}`,
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

const addEpisodeLabel = userSerialData.isAdded ? '✓' : '+';
  return (
    <div className={`info ${isOpen ? 'open' : ''}`} ref={infoRef}>
      <ul className="info-list">
        <li>
          <h3>{serial.title}</h3>
        </li>
        <li>
          <h4>Description:</h4>
          <p>{serial.description}</p>
        </li>
        <li>
          <h4>IMDB Rating: {serial.imdb}</h4>
          
        </li>
        <li>
          <h4>Episodes:</h4>
          <ul>
            {serial.episodes ? (
              serial.episodes.map((episode, index) => (
                <li key={index}>
                  {episode.episodeTitle}
                  {userSerialData.isAdded && <button className='add-episode' onClick={handleAREpisode}>{addEpisodeLabel}</button>}
                </li>
              ))
            ) : (
              <li>No episodes available</li>
            )}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Info;
