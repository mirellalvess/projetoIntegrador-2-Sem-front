import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function EmpenhosPorOrgao() {
  const { state } = useLocation();
  const codOrgaoInicial = state?.codOrgao || "";

  const [dados, setDados] = useState([]);
  const [orgaos, setOrgaos] = useState([]);
  const [orgaoSelecionado, setOrgaoSelecionado] = useState(codOrgaoInicial);
  const [empenhos, setEmpenhos] = useState([]);

  // 🔥 CARREGAMENTO DO JSON — COM CORREÇÃO
  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}assets/resultado.json`;

    fetch(url, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar JSON");
        return res.json();
      })
      .then((data) => {
        setDados(data);

        // coleta órgãos válidos
        const orgs = data
          .map((i) => i.orgao)
          .filter((o) => o && o.codOrgao);

        setOrgaos(orgs);
      })
      .catch((err) => {
        console.error("Erro ao carregar resultado.json:", err);
      });
  }, []);

  // Carrega empenhos ao selecionar órgão
  useEffect(() => {
    if (!orgaoSelecionado || dados.length === 0) return;

    const item = dados.find(
      (x) => x.orgao?.codOrgao === orgaoSelecionado
    );

    const lista = item?.empenhos || [];

    // Só primeiros 50 registros
    setEmpenhos(lista.slice(0, 50));
  }, [orgaoSelecionado, dados]);

  const formatarData = (dataStr) => {
    if (!dataStr) return "-";
    const d = new Date(dataStr);
    if (d.toString() === "Invalid Date") return "-";
    return d.toLocaleDateString("pt-BR");
  };

  const formatarValor = (v) => {
    const n = Number(v) || 0;
    return n.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="tabelaDesp">
      <div className="p-6 max-w-6xl mx-auto space-y-4">

        {/* SELECT */}
        <select
          className="border p-2 rounded w-full mb-20"
          value={orgaoSelecionado}
          onChange={(e) => setOrgaoSelecionado(e.target.value)}
        >
          <option value="">Selecione um órgão...</option>
          {orgaos.map((o) => (
            <option key={o.codOrgao} value={o.codOrgao}>
              {o.txtDescricaoOrgao}
            </option>
          ))}
        </select>

        {/* TABELA */}
        {orgaoSelecionado && (
          <div className="overflow-x-auto bg-white shadow p-4 rounded">
            {empenhos.length === 0 ? (
              <p>Nenhum empenho encontrado.</p>
            ) : (
              <table className="w-full text-left border-separate border-spacing-x-4 border-spacing-y-2 mt-50">
                <thead>
                  <tr>
                    <th>Empenho</th>
                    <th>Razão Social</th>
                    <th>Data</th>
                    <th>Valor Empenhado</th>
                    <th>Valor Liquidado</th>
                  </tr>
                </thead>

                <tbody>
                  {empenhos.map((e) => (
                    <tr key={e.codEmpenho} className="border-b">
                      <td>{e.codEmpenho}</td>
                      <td>{e.txtRazaoSocial}</td>
                      <td>{formatarData(e.datEmpenho)}</td>
                      <td>{formatarValor(e.valTotalEmpenhado)}</td>
                      <td>{formatarValor(e.valLiquidado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
