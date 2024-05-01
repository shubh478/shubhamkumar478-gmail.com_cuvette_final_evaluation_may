import React, { useState } from "react";
import axios from "axios";
import CrossIcon from "../../assets/CrossIcon.svg";
import ShowPasswordIcon from "../../assets/ShowPasswordIcon.svg";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";

const Login = ({ toggleLogin, handleLogin, loginInStory }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/login",
        formData
      );

      if (response.data.success) {
        const { token, name, userId } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("userId", userId);
        handleClose();
        dispatch(login());

        if (loginInStory) {
          navigate("/", { state: { loginThroughStory: true } });
        } else {
          navigate("/");
        }
        toast.success("Logged in successfully");
      } else {
        setError("Please enter valid username and password");
      }
    } catch (err) {
      toast.error("An error occurred while logging in");
    }
  };
  const handleClose = () => {
    toggleLogin();
    handleLogin();
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.closeIcon}>
        <img src={CrossIcon} alt="" onClick={handleClose} />
      </div>
      <h2 className={styles.title}>Login</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.group}>
          <label className={styles.label}>Username:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter username"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.group}>
          <label className={styles.label}>Password:</label>
          <div className={`${styles.passwordContainer} ${styles.input}`}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <img
              src={ShowPasswordIcon}
              alt=""
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
