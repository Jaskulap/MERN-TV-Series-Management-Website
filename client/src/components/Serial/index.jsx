import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import Menu from '../Common/Menu';
import { useParams } from 'react-router-dom';

const Serial = () => {
  const { title } = useParams();
  const [serial, setSerial] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [userSerialData, setUserSerialData] = useState({});
  const [episodeNumber, setEpisodeNumber] = useState(-1);
  const [tablicaPM, setTablicaPM] = useState([]);
  useEffect(() => {
    if (serial.episodes && userSerialData.watchedEpisodes) {
      const newTablicaPM = Array(serial.episodes.length).fill('+');

      userSerialData.watchedEpisodes.forEach((episodeNumberr) => {
        if (episodeNumberr >= 0 && episodeNumberr <= serial.episodes.length - 1) {
          newTablicaPM[episodeNumberr] = '-';
        }
      });

      setTablicaPM(newTablicaPM);
    }
  }, [serial.episodes, userSerialData.watchedEpisodes]);


  useEffect(() => {
    if (episodeNumber !== -1) {
      handleAREpisode();
    }
  }, [episodeNumber]);


  useEffect(() => {
    handleGetSerial();
    handleCheckSerial();
  }, []);
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleToggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  

  const handleGetSerial = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/"; // Przekierowanie użytkownika, gdy nie ma tokenu uwierzytelniającego
    }
    if (token) {
      try {
        const config = {
          method: "get",
          url: `http://localhost:8080/api/serials/${title}`,
          headers: { "Content-Type": "application/json", "x-access-token": token },
        };
        const { data: res } = await axios(config);

        setSerial(res.data);
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          localStorage.removeItem("token");
          window.location.reload()
        }
      }
    }
  };

  const handleARSerial = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/"; // Przekierowanie użytkownika, gdy nie ma tokenu uwierzytelniającego
    }
    if (token) {
      try {
        const configA = {
          method: "post",
          url: `http://localhost:8080/api/users/addSerial/${title}`,
          headers: { "Content-Type": "application/json", "x-access-token": token },
        };

        const configR = {
          method: "delete",
          url: `http://localhost:8080/api/users/removeSerial/${title}`,
          headers: { "Content-Type": "application/json", "x-access-token": token },
        };
        if (!userSerialData.isAdded) {
          await axios(configA);
        }
        else {
          await axios(configR);
        }
        
        handleCheckSerial();
      } catch (error) {
        if (error.response && error.response.status >= 401 && error.response.status <= 500) {
          localStorage.removeItem("token");
          window.location.reload()
        }
      }
    }
  };
  const handleAREpisode = async () => {
    console.log("HANDLE AR EPISODE")
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
          url: `http://localhost:8080/api/users/removeEpisode/${serial.title}/${episodeNumber}`,
          headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        };
        if (tablicaPM[episodeNumber] == '+') {
          await axios(configA);
        } else {
          await axios(configR);
        }
        setEpisodeNumber(-1);
        handleCheckSerial();

      } catch (error) {
        if (error.response && error.response.status >= 401 && error.response.status <= 500) {
          localStorage.removeItem('token');
          window.location.reload();
        }
      }
    }
  };


  const handleCheckSerial = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/"; // Przekierowanie użytkownika, gdy nie ma tokenu uwierzytelniającego
    }
    if (token) {
      try {
        const config = {
          method: "get",
          url: `http://localhost:8080/api/users/checkSerial/${title}`,
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



  function getFormattedImageName(title) {
    let formattedTitle = title.toLowerCase().replace(/\s/g, '');
    return '/' + formattedTitle + '2.jpg';
  }

  const obrazek = serial.title ? getFormattedImageName(serial.title) : "";
  const infoButtonLabel = isInfoOpen ? 'Show Info' : 'Hide Info';
  const serialAddedLabel = userSerialData.isAdded ? 'Remove Serial' : 'Add Serial';
  var isAddedLabel = userSerialData?.isAdded ? "ADDED" : "NOT ADDED"
  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>


        <button
          className={`${styles.menu_btn} ${isMenuOpen ? styles.active : ''}`}
          onClick={handleToggleMenu}
        >
          <img src={process.env.PUBLIC_URL + "/menu.svg"} alt="SVG logo image" />
        </button>


        <div className={styles.to_center}>
          <button className={`${styles.white_btn} ${isInfoOpen ? styles.active : ''}`}
            onClick={handleToggleInfo}>
            {infoButtonLabel}
          </button>
          <button className={styles.white_btn} onClick={handleARSerial} >
            {serialAddedLabel}
          </button>
        </div>

      </nav>

      <main>
        <Menu isOpen={isMenuOpen} onClose={handleToggleMenu} />



        <div className={`${styles.info} ${isInfoOpen ? styles.open : ''}`}>
          <ul className={styles.info_list}>
            <li>
              <h3>{serial.title} </h3>
              {userSerialData.isAdded && (<h4>WATCHED: {userSerialData.watchedEpisodes && userSerialData.watchedEpisodes.length}/{serial.episodes && serial.episodes.length} EPISODES</h4>)}
            </li>
            <li>
              <h4>DESCRIPTION:</h4>
              <p>{serial.description}</p>
            </li>
            <li>
              <h4>IMDB: {serial.imdb}</h4>

            </li>
            <li>
              <h4>EPISODES:</h4>
              <ul>
                {serial.episodes ? (
                  serial.episodes.map((episode, index) => (
                    <li key={index}>

                      {userSerialData.isAdded && (
                        <button className={`${styles.add_episode} ${tablicaPM[index] === '+' ? styles.red_button : styles.green_button}`} onClick={() => { setEpisodeNumber(index); }}>
                          {tablicaPM[index]}
                        </button>

                      )}
                      {index+1+". "}
                      {episode.episodeTitle}

                    </li>

                  ))
                ) : (
                  <li>No episodes available</li>
                )}
              </ul>
            </li>
          </ul>
        </div>



        <div className={styles.main_panel}>
          <img src={process.env.PUBLIC_URL + obrazek} alt="Serial Main Image" />
        </div>
      </main>
    </div>
  );
};

export default Serial;

/*<Info serial={serial} isInfoOpen={isInfoOpen} handleToggleInfo={handleToggleInfo} userSerialData={userSerialData} />*/