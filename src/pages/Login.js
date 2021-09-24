import React, { useState, useEffect, useContext } from 'react';
import { Input, Button } from '../components';
import AppContext from '../context/AppContext';
import verifyLogin from '../helpers/verifyLogin';
import './css/Login.css';
import iconJetFood from '../images/iconJetFood.png';

export default function Login() {
  const { setUser } = useContext(AppContext);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [btnDisable, setBtnDisable] = useState(true);

  function checkValid() {
    const { email, password } = loginForm;
    setBtnDisable(!verifyLogin(email, password));
  }

  function handleChange({ target: { name, value } }) {
    setLoginForm({ ...loginForm, [name]: value });
  }

  function handleClick() {
    const { email } = loginForm;
    setUser({ email });
    localStorage.setItem('user', JSON.stringify({ email }));
  }

  useEffect(checkValid, [loginForm]);

  return (
    <>
      <div className="login-title-container">
        <img className="icon-img" src={ iconJetFood } alt="JetFood icon" />
        <h1 className="login-title">JetFood</h1>
      </div>
      <form className="login-form">
        <div className="mb-3">
          <Input
            labelText="Email:"
            type="email"
            id="email-input"
            name="email"
            className="form-control"
            onChange={ handleChange }
          />
        </div>
        <div className="mb-3">
          <Input
            labelText="Senha:"
            type="password"
            id="password-input"
            name="password"
            className="form-control"
            onChange={ handleChange }
          />
        </div>
        <div className="mb-3">
          <Button
            className="login-submit-btn btn btn-primary"
            type="button"
            buttonText="Entrar"
            pathname="/comidas"
            isDisable={ btnDisable }
            onClick={ handleClick }
          />
        </div>
      </form>
    </>
  );
}
