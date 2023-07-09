import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import PanelList from '../Common/PanelList';
import Menu from '../Common/Menu';
const Main = () => {

    const [details, setDetails] = useState({})
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [responseMessageD, setResponseMessageD] = useState("");
    //const [responseMessageS, setResponseMessageS] = useState("");
    const [seriale, setSeriale] = useState([{}])
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = '/'
    }


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
                setResponseMessageD(res.message);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.href = '/'
                }
            }
        }
    };
    const handleGetAddedSerials = async (e) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: "get",
                    url: "http://localhost:8080/api/users/addedSerials",
                    headers: { "Content-Type": "application/json", "x-access-token": token },
                };
                const { data: res } = await axios(config);
                console.log(res.data);
                setSeriale(res.data);

                setIsLoading(false);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.href = '/'
                }
            }
        }
    };
    useEffect(() => {

        handleGetAddedSerials();
        handleGetDetails();

    }, []);

    var chosenavatar = "/avatar2.jpg"

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>

                <button
                    className={`${styles.menu_btn} ${isMenuOpen ? styles.active : ''}`}
                    onClick={handleToggleMenu}
                >
                    <img src="menu.svg" alt="SVG logo image" />
                </button>
                <h2>PROFILE</h2>



            </nav>
            <main>

                <Menu isOpen={isMenuOpen} onClose={handleToggleMenu} />
                <div className={styles.all}>
                    <div className={styles.userDetails}>
                        <img src={process.env.PUBLIC_URL + chosenavatar} alt="avatar"></img>
                        <div className={styles.editable}>
                            Nick: {details.nick}<br />
                            Email: {details.email}
                        </div>
                    </div>
                    {isLoading == false ? (
                        <div className={styles.listy}>
                            <PanelList seriale={seriale} tag="All" />
                        </div>
                    ) :
                        (
                            <img style={{ width: '80px', height: '80px', top: '45%', left: '47.5%', position: 'fixed' }} src='loader.gif' />
                        )}

                </div>
                <div className={styles.background}></div>
                <div className={styles.background2}></div>
            </main>
        </div>
    )
}
export default Main
/*
<button className={styles.white_btn} onClick={handleGetUsers}>
                        Show Users
                    </button>
                    <button className={styles.white_btn} onClick={handleGetDetails}>
                        Show Details
                    </button>


<div style={{ display: detailsVisible ? 'block' : 'none' }}>
                    <h2>Message: {responseMessageD}</h2>
                    <p>Nick: {details.nick}</p>
                    <p>Email: {details.email}</p>
                </div>
                <div style={{ display: daneVisible ? 'block' : 'none' }}>
                    <h2>Message: {responseMessageU}</h2>
                    <Users users={dane} />
                </div>
                */