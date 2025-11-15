import {
  toggleHighContrast,
  increaseFontSize,
  decreaseFontSize,
  startScreenReader,
} from "../utils/acessibilidade";

const Footer = () => {
  return (
    <footer role="contentinfo" className="site-footer">
      <div className="container footer-grid" role="navigation" aria-label="Rodapé">
        <div className="footer-column">
          <h3>Acessibilidade</h3>
          <ul>
            <li><a href="#" onClick={toggleHighContrast}>Modo Alto Contraste</a></li>
            <li><a href="#" onClick={increaseFontSize}>Aumentar Fonte</a></li>
            <li><a href="#" onClick={decreaseFontSize}>Diminuir Fonte</a></li>
            <li><a href="#" onClick={startScreenReader}>Leitor de Tela</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Consulta</h3>
          <ul>
            <li><a href="/consulta-despesas">Despesas</a></li>
            <li><a href="/consulta-empenhos">Empenhos</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contato</h3>
          <ul>
            <li><a href="#">Suporte</a></li>
            <li><a href="#">Privacidade</a></li>
            <li><a href="#">Termos de Uso</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 — Portal de Transparência Pública Orçamentária — Uso acadêmico.
        <br />
        Desenvolvido para fins educacionais, com foco na Transparência Pública de Dados Orçamentários.
      </div>
    </footer>
  );
};

export default Footer;
