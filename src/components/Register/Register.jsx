import React, { useState } from "react";
import axios from "axios";
import styles from "./Register.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CrossIcon from "../../assets/CrossIcon.svg";
import ShowPasswordIcon from "../../assets/ShowPasswordIcon.svg";
import { useNavigate } from "react-router-dom";
const Register = ({ toggleRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState("");

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
        "http://localhost:3000/api/v1/users/register",
        formData
      );
      if (response.data.success) {
        toast.success("Registered successfully");
        const token = response.data.token;
        const name = response.data.name;

        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        handleClose();
        navigate("/");

        // Redirect or handle success
      }
    } catch (err) {
      setError(err.response.data.message);
      toast.error(err.response.data.message);
    }
  };

  const handleClose = () => {
    toggleRegister();
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.closeIcon}>
        <img src={CrossIcon} alt="" onClick={handleClose} />
      </div>
      <h2 className={styles.title}>Register to SwipTory</h2>
      {error && <p className={styles.error}>{error}</p>}
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
              onClick={togglePasswordVisibility}
              alt=""
            />
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
