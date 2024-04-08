import { NavLink, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Modal from "../../components/UI/modal/Modal";
import Loader from "../../components/UI/loader/Loader";
import "./register.css";

interface UserData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface ModalState {
  userExistsModal: boolean;
  failedRegisterModal: boolean;
}

const Register = () => {
  const navigate = useNavigate();

  const [registerUserData, setRegisterUserData] = useState<UserData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isConfirmPasswordEmpty, setIsConfirmPasswordEmpty] = useState(false);

  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<ModalState>({
    userExistsModal: false,
    failedRegisterModal: false,
  });

  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const [isLoaderShow, setIsLoaderShow] = useState(false);

  const passwordShow = () => {
    setIsPasswordShow(!isPasswordShow);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRegisterUserData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const isFieldsNotEmpty = () => {
    const usernameEmpty = registerUserData.username.trim() === "";
    const emailEmpty = registerUserData.email.trim() === "";
    const passwordEmpty = registerUserData.password.trim() === "";
    const confirmPasswordEmpty =
      registerUserData.confirmPassword?.trim() === "";

    setIsUsernameEmpty(usernameEmpty);
    setIsEmailEmpty(emailEmpty);
    setIsPasswordEmpty(passwordEmpty);
    setIsConfirmPasswordEmpty(confirmPasswordEmpty);
    setIsPasswordMatch(true);

    return !(
      usernameEmpty ||
      emailEmpty ||
      passwordEmpty ||
      confirmPasswordEmpty
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (isFieldsNotEmpty()) {
        if (registerUserData.password === registerUserData.confirmPassword) {
          setIsLoaderShow(true);
          setIsPasswordMatch(true);

          const userData = { ...registerUserData };

          delete userData.confirmPassword;

          const response = await axios.post(
            "http://localhost:3000/register",
            userData
          );

          if (response.status === 200) {
            const { jwt, userData } = response.data.user;

            Cookies.set("token", jwt, { expires: 30 });
            Cookies.set("user_id", userData.user_id, { expires: 30 });
            Cookies.set("username", userData.username, { expires: 30 });
            Cookies.set("email", userData.email, { expires: 30 });

            navigate("/tasks");
          } else {
            setIsModalOpen((prevState) => ({
              ...prevState,
              failedRegisterModal: true,
            }));
            throw new Error("Failed to register user");
          }
        } else {
          setIsPasswordMatch(false);
          setIsUsernameEmpty(false);
          setIsEmailEmpty(false);
          setIsPasswordEmpty(false);
          setIsConfirmPasswordEmpty(false);
        }
      }
    } catch (error) {
      setIsModalOpen((prevState) => ({
        ...prevState,
        userExistsModal: true,
      }));
      console.error("Error registering user:", error);
    } finally {
      setIsLoaderShow(false);
    }
  };
  return (
    <div className="register">
      <div className="regContainer">
        <h1 className="regTitle">Регистрация</h1>

        <form className="regForm" onSubmit={handleSubmit}>
          <label className="inputLabel">
            <span className="validationText">
              {isUsernameEmpty && "Введите имя пользователя"}
            </span>
            <input
              placeholder="Имя пользователя"
              type="text"
              className="regInput"
              name="username"
              value={registerUserData.username}
              onChange={handleChange}
            />
          </label>

          <label className="inputLabel">
            <span className="validationText">
              {isEmailEmpty && "Введите email"}
            </span>
            <input
              placeholder="Email"
              type="email"
              className="regInput"
              name="email"
              value={registerUserData.email}
              onChange={handleChange}
            />
          </label>

          <label className="inputLabel">
            <span className="validationText">
              {isPasswordEmpty && "Введите пароль"}

              {!isPasswordMatch && "Пароль не совпадает"}
            </span>
            <input
              placeholder="Пароль"
              type={isPasswordShow ? "text" : "password"}
              className="regInput"
              name="password"
              value={registerUserData.password}
              onChange={handleChange}
            />
          </label>

          <label className="inputLabel">
            <span className="validationText">
              {isConfirmPasswordEmpty && "Подтвердите пароль"}
              {!isPasswordMatch && "Пароль не совпадает"}
            </span>
            <input
              placeholder="Подтверждение пароля"
              type={isPasswordShow ? "text" : "password"}
              className="regInput"
              name="confirmPassword"
              value={registerUserData.confirmPassword}
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

          <NavLink to={"/auth"} className="authLink">
            Авторизация
          </NavLink>
        </form>
      </div>
      {isModalOpen.failedRegisterModal && (
        <Modal
          onClose={() => {
            setIsModalOpen((prevState) => ({
              ...prevState,
              failedRegisterModal: false,
            }));
          }}
        >
          <p className="registerModalText">Не удалось зарегистрироваться</p>
          <button
            className="registerModalBtn"
            onClick={() => {
              setIsModalOpen((prevState) => ({
                ...prevState,
                failedRegisterModal: false,
              }));
            }}
          >
            Ок
          </button>
        </Modal>
      )}
      {isModalOpen.userExistsModal && (
        <Modal
          onClose={() => {
            setIsModalOpen((prevState) => ({
              ...prevState,
              userExistsModal: false,
            }));
          }}
        >
          <p className="registerModalText">Пользователь уже существует</p>
          <button
            className="registerModalBtn"
            onClick={() => {
              setIsModalOpen((prevState) => ({
                ...prevState,
                userExistsModal: false,
              }));
            }}
          >
            Ок
          </button>
        </Modal>
      )}
      {isLoaderShow && <Loader />}
    </div>
  );
};

export default Register;
