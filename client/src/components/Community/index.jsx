import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import Menu from '../Common/Menu';

const Community = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const [tresc, setTresc] = useState('');
  const [placeholderT, setPlaceholderT] = useState('ENTER YOUR COMMENT HERE')
  const [details, setDetails] = useState({})
  const [comments, setComments] = useState([{}]);
  const [quantity, setQuantity] = useState(20);
  const [message, setMessage] = useState();
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
      } catch (error) {
        if (error.response && error.response.status >= 401 && error.response.status <= 500) {
          localStorage.removeItem("token");
          window.location.href = '/'
        }

      }
    }
  };


  const handleGetComments = async (e) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "get",
          url: `http://localhost:8080/api/comments/${quantity}`,
          headers: { "Content-Type": "application/json", "x-access-token": token },
        };
        const { data: res } = await axios(config);
        setComments(res.data)
        console.log("RES DATA:" + res.data)
        console.log("COMMENTS" + comments)
      } catch (error) {
        console.log("ERROR TO:" + error);
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          localStorage.removeItem("token");
          window.location.href = '/'
        }
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token");
    const tresc = e.target.tresc.value.trim();
    setMessage("")
    if (token) {
      try {
        const config = {
          method: "post",
          url: "http://localhost:8080/api/comments",
          headers: { "Content-Type": "application/json", "x-access-token": token },
          data: { tresc }
        };
        const { data: res } = await axios(config);
        setPlaceholderT('ENTER YOUR COMMENT HERE')
        handleToggleInfo();

      } catch (error) {
        if (error.response && error.response.status >= 401 && error.response.status <= 500) {
          localStorage.removeItem("token");
          window.location.href = '/'
        }
        if (error.response.status === 400) {
          setMessage(error.response.data.message)
          console.log(message)
          setTresc("")
          setPlaceholderT("!Content is required (spaces and enters are not content)!")

        }
      }

    }
  };
  const handleDeleteComment = async (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "delete",
          url: `http://localhost:8080/api/comments/${id}`,
          headers: { "Content-Type": "application/json", "x-access-token": token },
        };
        const { data: res } = await axios(config);
        console.log(res.message)
        handleGetComments();
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          //localStorage.removeItem("token");
          //window.location.href = '/'
        }
      }

    }
  };


  useEffect(() => {

    handleGetDetails();
    handleGetComments();
    // Wywołaj funkcję handleGetComments co 5 sekund
    const interval = setInterval(handleGetComments, 5000);

    // Czyszczenie interwału po zakończeniu komponentu
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleToggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
    setTresc("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = '/';
  };




  const infoButtonLabel = isInfoOpen ? 'Cancel' : 'Add Comment';
  return (
    <div className={styles.main_container}>


      <nav className={styles.navbar}>

        <button
          className={`${styles.menu_btn} ${isMenuOpen ? styles.active : ''}`}
          onClick={handleToggleMenu}
        >
          <img src="menu.svg" alt="SVG logo image" />
        </button>
        <h2>COMMUNITY</h2>
        <button className={`${styles.white_btn} ${isInfoOpen ? styles.active : ''}`} style={{ marginLeft: '30.3%' }} onClick={handleToggleInfo}>
          {infoButtonLabel}
        </button>





      </nav>

      <main>

        <div className={`${styles.info} ${isInfoOpen ? styles.open : ''}`}>
          <ul className={styles.info_list}>
            <form onSubmit={handleSubmit}>


              <label htmlFor="tresc"><h2>YOUR COMMENT</h2></label>
              <textarea
                id="tresc"
                placeholder={placeholderT}
                value={tresc}
                onChange={(e) => setTresc(e.target.value)}
                required
              ></textarea>

              <button className={styles.white_btn} type="submit">Dodaj Komentarz</button>
            </form>
          </ul>
        </div>


        <Menu isOpen={isMenuOpen} onClose={handleToggleMenu} />
        <div className={`${styles.komsy} ${isInfoOpen ? '' : styles.open}`}>
          <div className={styles.all}>
            {comments.length > 0 ? (
              <div className={styles.comments}>
                <h2>COMMENTS:</h2>
                <ul>
                  {comments.map((comment) => (
                    <div className={styles.comment}>
                      <li key={comment._id}>
                        <div className={styles.comment_top}>
                          <p className={styles.nick}>{comment.nick}</p>
                          <div className={styles.top_right}>
                            {comment.nick === details.nick && (
                              <button onClick={() => handleDeleteComment(comment._id)} className={styles.delete_button}>
                                <img src={process.env.PUBLIC_URL + "/delete.svg"} alt="SVG logo image" />
                                </button>
                            )}
                            <p className={styles.date}>{new Date(comment.createdAt).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}</p>
                          </div>
                        </div>
                        <p>{comment.content}</p>
                      </li>
                    </div>
                  ))}
                </ul>
              </div>

            )
              : (<img style={{ width: '80px', height: '80px', top: '45%', left: '47.5%', position: 'fixed' }} src='loader.gif' />)}
          </div>
        </div>

        <div className={styles.background}></div>
        <div className={styles.background2}></div>
      </main>


    </div>
  );
};

export default Community;

/*<Info serial={serial} isInfoOpen={isInfoOpen} handleToggleInfo={handleToggleInfo} userSerialData={userSerialData} />*/