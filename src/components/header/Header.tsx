import { ChangeEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ThemeContext } from "../../providers/ThemeProvider";
import { useNavigate } from "react-router-dom";
import Modal from "../UI/modal/Modal";
import Loader from "../UI/loader/Loader";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();
  const username = Cookies.get("username");
  const [theme, setTheme] = useContext(ThemeContext);
  const [newUsername, setNewUsername] = useState(username);
  const [usernameInvalid, setUsernameInvalid] = useState(true);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [
    isChangeUsernameConfirmModalOpen,
    setIsChangeUsernameConfirmModalOpen,
  ] = useState(false);
  const [isLogoutConfirmModalOpen, setIsLogoutConfirmModalOpen] =
    useState(false);
  const [isLoaderShow, setIsLoaderShow] = useState(false);

  useEffect(() => {
    if (newUsername?.trim() != "" && newUsername?.trim() != username) {
      setUsernameInvalid(false);
    } else {
      setUsernameInvalid(true);
    }
  }, [username, newUsername]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleUserModal = () => {
    setIsUserModalOpen(!isUserModalOpen);
  };

  const toggleChangeUsernameConfirmModal = () => {
    setIsChangeUsernameConfirmModalOpen(!isChangeUsernameConfirmModalOpen);
  };

  const toggleLogoutConfirmModal = () => {
    setIsLogoutConfirmModalOpen(!isLogoutConfirmModalOpen);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  };

  const changeUsername = async () => {
    try {
      setIsLoaderShow(true);
      const response = await axios.post(
        "http://localhost:3000/change-username",
        {
          userId: Cookies.get("user_id"),
          newUsername: newUsername,
        }
      );

      if (response.status === 200) {
        Cookies.set("username", response.data.newUsername);
      }
    } catch (error) {
      throw new Error("Error change username");
    } finally {
      setIsLoaderShow(false);
      setIsChangeUsernameConfirmModalOpen(false);
    }
  };

  const logout = () => {
    const cookies = Cookies.get();

    for (const cookie in cookies) {
      Cookies.remove(cookie);
    }

    navigate("/auth");
  };

  return (
    <div className="header">
      <div className="headerContainer">
        <div className="wrap">
          <span className="username" onClick={toggleUserModal}>
            {username}
          </span>

          <button
            className="toggleTheme"
            title="Сменить тему"
            onClick={toggleTheme}
          ></button>
        </div>
      </div>
      {isUserModalOpen && (
        <Modal onClose={toggleUserModal}>
          <button className="closeModalBtn" onClick={toggleUserModal}></button>
          <input
            type="text"
            placeholder={username}
            className="usernameInput"
            value={newUsername}
            onChange={handleChange}
          />
          <button
            className="headerUserModalBtn"
            disabled={usernameInvalid}
            onClick={toggleChangeUsernameConfirmModal}
          >
            Изменить имя пользователя
          </button>
          <button
            className="headerUserModalBtn"
            onClick={toggleLogoutConfirmModal}
          >
            Выйти из аккаунта
          </button>
        </Modal>
      )}
      {isLogoutConfirmModalOpen && (
        <Modal onClose={toggleLogoutConfirmModal}>
          <span className="headerModalText">Выйти из аккаунта?</span>
          <div className="headerBtnsWrap">
            <button
              className="headerConfirmModalBtn"
              onClick={toggleLogoutConfirmModal}
            >
              Отмена
            </button>
            <button className="headerConfirmModalBtn" onClick={logout}>
              Выйти
            </button>
          </div>
        </Modal>
      )}

      {isChangeUsernameConfirmModalOpen && (
        <Modal onClose={toggleChangeUsernameConfirmModal}>
          <span className="headerModalText">
            Изменить имя пользователя на {newUsername}?
          </span>
          <div className="headerBtnsWrap">
            <button
              className="headerConfirmModalBtn"
              onClick={toggleChangeUsernameConfirmModal}
            >
              Отмена
            </button>
            <button className="headerConfirmModalBtn" onClick={changeUsername}>
              Изменить
            </button>
          </div>
        </Modal>
      )}
      {isLoaderShow && <Loader />}
    </div>
  );
};

export default Header;
