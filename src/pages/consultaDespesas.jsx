import TabelaDespesas from "../components/campoPesquisa";

const ConsultaDespesas = () => {
  return (
    <section className="page-wrap">
      <h2 className="page-title">Consulta de Despesas Públicas</h2>
      <p className="page-subtitle">
        Utilize os filtros abaixo para consultar os gastos públicos de forma transparente.
      </p>

      <TabelaDespesas />
    </section>
  );
};

export default ConsultaDespesas;
