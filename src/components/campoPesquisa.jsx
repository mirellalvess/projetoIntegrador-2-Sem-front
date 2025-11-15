import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ⬅️ IMPORTANTE
import "../styles/style.css";

const TabelaDespesas = () => {
  const navigate = useNavigate(); // ⬅️ PARA REDIRECIONAR
  const LS_FAV_KEY = "sof_favoritos_v1";

  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [favoritos, setFavoritos] = useState({});

  // Carrega favoritos
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LS_FAV_KEY)) || {};
      setFavoritos(stored);
    } catch {
      setFavoritos({});
    }
  }, []);

  // Busca dados JSON
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const res = await fetch("/assets/resultado.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        const data = await res.json();

        const lista = data.map((item) => {
          const org = item.orgao || {};
          const despesas = Array.isArray(item.despesas) ? item.despesas : [];
          const empenhos = Array.isArray(item.empenhos) ? item.empenhos : [];

          const codOrgao = org.codOrgao || "(sem código)";
          const nomeOrgao = org.txtDescricaoOrgao || "(sem nome)";

          const totalDespesas = despesas.reduce((s, d) => {
            const val = parseFloat(d.valLiquidado) || 0;
            return s + val;
          }, 0);

          return {
            id: `${codOrgao}-${nomeOrgao}`,
            codOrgao,
            orgao: nomeOrgao,
            valorTotal: totalDespesas,
            qtdEmpenhos: empenhos.length,
          };
        });

        const agrupado = lista.reduce((acc, item) => {
          const chave = `${item.codOrgao}-${item.orgao}`.toLowerCase().trim();
          if (!acc[chave]) {
            acc[chave] = {
              id: chave,
              codOrgao: item.codOrgao,
              orgao: item.orgao,
              valorTotal: 0,
              qtdEmpenhos: 0,
            };
          }
          acc[chave].valorTotal += item.valorTotal;
          acc[chave].qtdEmpenhos += item.qtdEmpenhos;
          return acc;
        }, {});

        setDados(Object.values(agrupado));
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar dados: " + e.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const salvarFavoritos = (novos) => {
    setFavoritos(novos);
    localStorage.setItem(LS_FAV_KEY, JSON.stringify(novos));
  };

  const alternarFavorito = (item) => {
    const novos = { ...favoritos };
    if (novos[item.id]) delete novos[item.id];
    else novos[item.id] = item;
    salvarFavoritos(novos);
  };

  const formatarMoeda = (valor) =>
    isNaN(valor)
      ? "—"
      : valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const favoritosArray = Object.values(favoritos);

  // Totais gerais
  const totalEmpenhos = dados.reduce((s, it) => s + it.qtdEmpenhos, 0);
  const totalGeral = dados.reduce((s, it) => s + it.valorTotal, 0);

  if (carregando) return <div>Carregando...</div>;
  if (erro) return <div>{erro}</div>;

  return (
    <section className="main-container">
      {/* tabela */}
      <section className="tabela-container">

      <br />

        <table className="tabela-despesas">
          <thead>
            <tr>
              <th>Órgão</th>
              <th>Total de Despesas</th>
              <th>Qtd Empenhos</th>
              <th>Favorito</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((it) => {
              const isFav = !!favoritos[it.id];
              return (
                <tr key={it.id}>
                  <td>{it.orgao}</td>
                  <td>{formatarMoeda(it.valorTotal)}</td>
                  <td>{it.qtdEmpenhos}</td>
                  <td>
                    <button
                      className={`fav-btn ${isFav ? "fav" : ""}`}
                      onClick={() => alternarFavorito(it)}
                    >
                      {isFav ? "★" : "☆"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* FAVORITOS */}
      <section className="favoritos-section">
        <h3 className="tituloFav">Favoritos ({favoritosArray.length})</h3>

        {favoritosArray.length === 0 ? (
          <p>Nenhum favorito.</p>
        ) : (
          <ul className="lista-favoritos">
            {favoritosArray.map((fav) => (
              <li key={fav.id}>
                <button
                  className="link-fav"
                  onClick={() =>
                    navigate("/consulta-empenhos", {
                      state: { codOrgao: fav.codOrgao }, // ⬅️ envia o filtro
                    })
                  }
                >
                  {fav.orgao}
                </button>

                <button
                  className="fav-btn fav" id="removeFav"
                  onClick={() => alternarFavorito(fav)}
                >
                  ★
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default TabelaDespesas;
