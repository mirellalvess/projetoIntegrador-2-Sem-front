import EmpenhosPorOrgao from "../components/tabelaEmpenhos";

const ConsultaEmpenhos = () => {
  return (
    <section className="page-wrap">
      <h2 className="page-title">Consulta de Empenhos</h2>
      
      <p className="page-subtitle">
        Pesquise os empenhos registrados e acompanhe a destinação dos recursos públicos.
      </p>
      
      <EmpenhosPorOrgao />
    </section>
  );
};

export default ConsultaEmpenhos;
