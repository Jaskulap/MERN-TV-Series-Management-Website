import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import PanelList from '../Common/PanelList';
import Menu from '../Common/Menu';
const Main = () => {
    const [dane, ustawDane] = useState([])
    const [daneVisible, setDaneVisible] = useState(false)
    const [details, setDetails] = useState({})
    const [detailsVisible, setDetailsVisible] = useState(false)
    const [responseMessageU, setResponseMessageU] = useState("");
    const [responseMessageD, setResponseMessageD] = useState("");
    //const [responseMessageS, setResponseMessageS] = useState("");
    const [seriale, setSeriale] = useState([{}])
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    
    const handleGetUsers = async (e) => {
        e.preventDefault()
        //pobierz token z localStorage:
        const token = localStorage.getItem("token")
        //jeśli jest token w localStorage to:
        if (token) {
            try {
                //konfiguracja zapytania asynchronicznego z tokenem w nagłówku:
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/users',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                }
                //wysłanie żądania o dane:
                const { data: res } = await axios(config)
                //ustaw dane w komponencie za pomocą hooka useState na listę z danymi przesłanymi
                //z serwera – jeśli został poprawnie zweryfikowany token
                ustawDane(res.data) // `res.data` - zawiera sparsowane dane – listę
                setDaneVisible(true)
                setDetailsVisible(false)
                setResponseMessageU(res.message);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token")
                    window.location.reload()
                }
            }
        }
    }
    const handleGetSerials = async (e) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: "get",
                    url: "http://localhost:8080/api/serials",
                    headers: { "Content-Type": "application/json", "x-access-token": token },
                };
                const { data: res } = await axios(config);

                res.data.forEach((serial) => {
                    console.log("Title:", serial.title);
                    console.log("Description:", serial.description);
                    console.log("Imdb:", serial.imdb);
                    console.log("Tag:", serial.tag);
                    console.log("Average Minutes:", serial.averageMinutes);
                    //console.log("Image Panel:", serial.imagePanel.data);
                    //console.log("Image Main:", serial.imageMain);
                    console.log("Episodes:", serial.episodes);
                    console.log("--------------------");
                });
                setSeriale(res.data);
                setTimeout(() => {

                    setIsLoading(false);
                }, 100);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            }
        }
    };


    const handleGetDetails = async (e) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: "get",
                    url: "http://localhost:8080/api/users/detail",
                    headers: { "Content-Type": "application/json", "x-access-token": token },
                };
                const { data: res } = await axios(config);
                setDetails(res.data);
                setDetailsVisible(true);
                setDaneVisible(false);
                setResponseMessageD(res.message);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            }
        }
    };

    useEffect(() => {
        handleGetSerials(); // Wywołanie handleGetSerials przy montowaniu komponentu
    }, []);



    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                
                    <button
                        className={`${styles.menu_btn} ${isMenuOpen ? styles.active : ''}`}
                        onClick={handleToggleMenu}
                    >
                        <img src="menu.svg" alt="SVG logo image" />
                    </button>
                    <h2>MAIN</h2>
                
                

            </nav>
            <main>

                <Menu isOpen={isMenuOpen} onClose={handleToggleMenu} />
                {isLoading == false ? (
                    <div className={styles.listy}>
                        <PanelList seriale={seriale} tag="Popular" />
                        <PanelList seriale={seriale} tag="New" />
                        <PanelList seriale={seriale} tag="Classic" />
                    </div>
                ) :
                    (
                        <img style={{ width: '80px', height: '80px', top: '45%', left: '47.5%', position: 'fixed' }} src='loader.gif' />
                    )}

                
                <div className={styles.background}></div>
                <div className={styles.background2}></div>
            </main>
        </div>
    )
}
export default Main
/*



                */