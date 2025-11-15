import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home-section" role="region" aria-label="Página inicial">
      <div className="home-content">
        <h2>Consulta de Despesas Públicas</h2>
        <p>
          Veja como os recursos públicos são aplicados de forma transparente e acessível.
        </p>
      </div>

      <div className="section2">
        <h2>Importancia da visibilidade dos gastos governamentais</h2>
        <p>A transparência nas despesas governamentais não é apenas um princípio ético.</p>
        <p className="text2">Sendo uma ferramenta poderosa de controle social, combate à corrupção e promoção da eficiência na gestão pública.</p>
      </div>

      <div className="home-buttons">
        <Link to="/consulta-despesas" className="btn-acesso">
          Consultar Despesas
        </Link>
        <Link to="/consulta-empenhos" className="btn-acesso">
          Consultar Empenhos
        </Link>
      </div>
    </section>
  );
};

export default Home;
