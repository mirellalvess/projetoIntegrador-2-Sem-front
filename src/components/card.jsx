import React from "react";
import "../styles/style.css";

const Card = ({ children, style = {} }) => {
  return (
    <section className="card" style={style} role="region" aria-label="Painel">
      {children}
    </section>
  );
};

export default Card;
