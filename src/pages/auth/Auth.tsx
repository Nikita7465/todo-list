import { ChangeEvent, FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import {
  displayAllTasks,
  updateTasks,
} from "../../store/reducers/tasks.reducer";
import Loader from "../../components/UI/loader/Loader";
import Modal from "../../components/UI/modal/Modal";
import "./auth.css";

interface UserData {
  email: string;
  password: string;
}

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userData, setRegisterUserData] = useState<UserData>({
    email: "",
    password: "",
  });

  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);

  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isUserDataCorrect, setIsUserDataCorrect] = useState(true);

  const [isLoaderShow, setIsLoaderShow] = useState(false);

  const passwordShow = () => {
    setIsPasswordShow(!isPasswordShow);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRegisterUserData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const isFieldsNotEmpty = () => {
    const emailEmpty = userData.email.trim() === "";
    const passwordEmpty = userData.password.trim() === "";

    setIsEmailEmpty(emailEmpty);
    setIsPasswordEmpty(passwordEmpty);

    return !(emailEmpty || passwordEmpty);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (isFieldsNotEmpty()) {
        setIsLoaderShow(true);
        setIsUserDataCorrect(true);

        const response = await axios.post(
          "http://localhost:3000/auth",
          userData
        );

        if (response.status === 200) {
          const { jwt, userData, tasks } = response.data.user;

          dispatch(updateTasks(tasks));
          dispatch(displayAllTasks());

          Cookies.set("token", jwt, { expires: 30 });
          Cookies.set("user_id", userData.user_id, { expires: 30 });
          Cookies.set("username", userData.username, { expires: 30 });
          Cookies.set("email", userData.email, { expires: 30 });

          navigate("/tasks");
        } else {
          toggleModal();
          throw new Error("Failed to authorization user");
        }
      } else {
        setIsUserDataCorrect(true);
      }
    } catch (error) {
      setIsUserDataCorrect(false);
      console.error("Error authorization user:", error);
    } finally {
      setIsLoaderShow(false);
    }
  };
  return (
    <div className="auth">
      <div className="authContainer">
        <h1 className="authTitle">Авторизация</h1>

        <form className="authForm" onSubmit={handleSubmit}>
          <label className="inputLabel">
            <span className="validationText">
              {isEmailEmpty && "Введите email"}
              {!isUserDataCorrect && "Неверный email или пароль"}
            </span>
            <input
              placeholder="Email"
              type="email"
              className="authInput"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          </label>

          <label className="inputLabel">
            <span className="validationText">
              {isPasswordEmpty && "Введите пароль"}
              {!isUserDataCorrect && "Неверный email или пароль"}
            </span>
            <input
              placeholder="Пароль"
              type={isPasswordShow ? "text" : "password"}
              className="authInput"
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
          </label>

          <label className="passwordShowLabel">
            <input
              type="checkbox"
              checked={isPasswordShow}
              onChange={passwordShow}
              className="passwordShowCheck"
            />
            <div className="passwordShowCustomCheck"></div>
            Показать пароль
          </label>

          <button className="submitBtn">Войти</button>

          <NavLink to={"/register"} className="regLink">
            Регистрация
          </NavLink>
        </form>
      </div>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <p className="authModalText">Не удалось авторизоваться</p>
          <button className="authModalBtn" onClick={toggleModal}>
            Ок
          </button>
        </Modal>
      )}
      {isLoaderShow && <Loader />}
    </div>
  );
};

export default Auth;
