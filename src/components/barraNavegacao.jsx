import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/style.css";

const BarraNavegacao = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav aria-label="Menu principal" role="navigation" className="main-nav">
      <div className="nav-left">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Home
        </NavLink>
        <NavLink to="/consulta-despesas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Consultar Despesas
        </NavLink>
        <NavLink to="/consulta-empenhos" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Consultar Empenhos
        </NavLink>
      </div>

      <div className="nav-right">
        <button
          onClick={toggleTheme}
          className="themeButton"
          aria-label="Alternar tema claro ou escuro"
        >
          {theme === "light" ? "☀️ Claro" : "🌙 Escuro"}
        </button>
      </div>
    </nav>
  );
};

export default BarraNavegacao;
