(function () {
  const API_BASE = 'https://api.exemplo.prefeitura.sp/sof-v4'; // ajuste aqui
  const qOrgao = document.getElementById('qOrgao');
  const qAno = document.getElementById('qAno');
  const btnSearch = document.getElementById('btnSearch');
  const btnClear = document.getElementById('btnClear');
  const resultsArea = document.getElementById('resultsArea'); // Mantido por compatibilidade
  const totalCountEl = document.getElementById('totalCount');
  const favList = document.getElementById('favList');
  const onlyFavorites = document.getElementById('onlyFavorites');
  const lastSync = document.getElementById('lastSync');
  const toggleTheme = document.getElementById('toggleTheme');
  const rootDiv = document.getElementById('root'); // ✅ Novo container de renderização

  const LS_FAV_KEY = 'sof_favorites_v1';
  const LS_THEME_KEY = 'sof_theme_v1';

  let favorites = loadFavorites();
  let currentResults = [];

  populateYears();
  renderFavorites();
  applySavedTheme();

  btnSearch.addEventListener('click', doSearch);
  btnClear.addEventListener('click', clearSearch);
  onlyFavorites.addEventListener('change', () => renderResults(currentResults));
  toggleTheme.addEventListener('click', toggleThemeHandler);

  // ===== Helpers de formatação =====
  function formatCurrency(value) {
    const n = parseFloat(value);
    if (isNaN(n)) return '—';
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function shortText(str, len = 80) {
    if (!str) return '';
    return str.length > len ? str.slice(0, len - 1) + '…' : str;
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ===== Funções de tema (NÃO MODIFICAR) =====
  function applySavedTheme() {
    const saved = localStorage.getItem(LS_THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    toggleTheme.textContent = saved === 'light' ? 'Ir para Dark' : 'Ir para Light';
  }
  function toggleThemeHandler() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(LS_THEME_KEY, next);
    toggleTheme.textContent = next === 'light' ? 'Ir para Dark' : 'Ir para Light';
  }

  // ===== Funções de utilidade e estado =====
  function populateYears() {
    const currentYear = new Date().getFullYear();
    if (!qAno) return;
    qAno.innerHTML = '<option value="">Todos</option>';
    for (let y = currentYear; y >= currentYear - 10; y--) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      qAno.appendChild(opt);
    }
  }

  function loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem(LS_FAV_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveFavorites() {
    localStorage.setItem(LS_FAV_KEY, JSON.stringify(favorites));
    renderFavorites();
  }

  function toggleFavorite(key, item) {
    if (favorites[key]) {
      delete favorites[key];
    } else if (item) {
      favorites[key] = item;
    } else {
      console.warn('toggleFavorite: item ausente ao tentar adicionar favorito', key);
      return;
    }
    saveFavorites();
    renderResults(currentResults);
  }

  function renderFavorites() {
    favList.innerHTML = '';
    const keys = Object.keys(favorites);
    if (keys.length === 0) {
      favList.innerHTML = '<div class="empty">Nenhum favorito salvo.</div>';
      return;
    }
    const ul = document.createElement('div');
    ul.style.display = 'grid';
    ul.style.gap = '8px';
    keys.forEach(k => {
      const it = favorites[k];
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.innerHTML = `
        <div><div style="font-weight:600">${shortText(it.orgao || 'Órgão')}</div><div class="small">${shortText(it.descricao || '')}</div></div>
        <button class="fav-btn fav" data-key="${k}" title="Remover favorito">★</button>`;
      ul.appendChild(div);
    });
    favList.appendChild(ul);
    favList.querySelectorAll('.fav-btn').forEach(btn => btn.addEventListener('click', () => toggleFavorite(btn.dataset.key)));
  }

  // ===== Renderização principal =====
  async function renderResults(dataList = null) {
    // ✅ Agora a renderização ocorre na div #root
    rootDiv.innerHTML = '<div class="loading">Carregando dados...</div>';
    resultsArea.innerHTML = ''; // limpa a área antiga

    try {
      let rawData;
      if (Array.isArray(dataList) && dataList.length > 0) {
        rawData = dataList;
      } else if (Array.isArray(dataList) && dataList.length === 0) {
        rootDiv.innerHTML = '<div class="empty">Nenhum resultado encontrado.</div>';
        totalCountEl.textContent = 0;
        return;
      } else {
        const res = await fetch('assets/resultado.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Erro ao carregar JSON (${res.status})`);
        rawData = await res.json();
        if (!Array.isArray(rawData)) throw new Error('Formato inesperado no JSON.');
      }

      // Normalização dos dados
      let list;
      if (rawData.length > 0 && rawData[0].descricao !== undefined && rawData[0].valor !== undefined) {
        list = rawData;
      } else {
        list = rawData.slice(0, 20).map((item) => {
          const org = item.orgao || {};
          const despesas = Array.isArray(item.despesas) ? item.despesas : [];

          const codOrgao = org.codOrgao || '(sem código)';
          const nomeOrgao = org.txtDescricaoOrgao || '(sem nome)';
          const ano = despesas[0]?.anoDotacao || (item.ano || '2024');

          let totalValor = 0;
          despesas.forEach((d) => {
            const rawVal = d.valor || d.valorDespesa || d.valorTotal || d.vlrEmpenho || '0';
            const valor = parseFloat(String(rawVal).replace(',', '.'));
            if (!isNaN(valor)) totalValor += valor;
          });

          return {
            id: codOrgao,
            orgao: codOrgao,
            descricao: nomeOrgao,
            valor: totalValor,
            ano,
          };
        });
      }

      const filtered = onlyFavorites.checked ? list.filter((it) => favorites[it.id]) : list;

      if (!filtered.length) {
        rootDiv.innerHTML = '<div class="empty">Nenhum resultado encontrado.</div>';
        totalCountEl.textContent = 0;
        return;
      }

      // Gera tabela na div #root
      const table = document.createElement('table');
      table.innerHTML = `
      <thead>
        <tr>
          <th>Órgão</th>
          <th>Descrição</th>
          <th>Total de Despesas</th>
          <th>Ano</th>
          <th>Ações</th>
        </tr>
      </thead>
    `;
      const tbody = document.createElement('tbody');

      filtered.forEach((it) => {
        const isFav = !!favorites[it.id];
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${escapeHtml(it.orgao)}</td>
        <td class="small">${escapeHtml(shortText(it.descricao, 110))}</td>
        <td>${formatCurrency(it.valor)}</td>
        <td>${escapeHtml(it.ano)}</td>
        <td>
          <button class="fav-btn ${isFav ? 'fav' : ''}" data-id="${it.id}" title="${isFav ? 'Remover favorito' : 'Adicionar aos favoritos'}">
            ${isFav ? '★' : '☆'}
          </button>
        </td>
      `;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      rootDiv.innerHTML = ''; // limpa e adiciona a nova tabela
      rootDiv.appendChild(table);

      // eventos de favoritar
      rootDiv.querySelectorAll('.fav-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const item = filtered.find((x) => x.id == id);
          toggleFavorite(id, item);
        });
      });

      totalCountEl.textContent = filtered.length;
      lastSync.textContent = 'Última consulta: ' + new Date().toLocaleString();
      currentResults = list;
    } catch (err) {
      console.error(err);
      rootDiv.innerHTML = `<div class="error">Erro ao carregar resultados: ${escapeHtml(err.message)}</div>`;
      totalCountEl.textContent = 0;
    }
  }

  // ===== Função de busca =====
  async function doSearch() {
    const orgaoTerm = (qOrgao && qOrgao.value) ? qOrgao.value.trim().toLowerCase() : '';
    const anoTerm = (qAno && qAno.value) ? qAno.value.trim() : '';

    try {
      rootDiv.innerHTML = '<div class="small">Buscando e filtrando…</div>';
      const res = await fetch('assets/resultado.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Erro ao carregar JSON (${res.status})`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Formato inesperado no JSON.');

      const normalized = data.map((item) => {
        const org = item.orgao || {};
        const despesas = Array.isArray(item.despesas) ? item.despesas : [];
        const codOrgao = org.codOrgao || '(sem código)';
        const nomeOrgao = org.txtDescricaoOrgao || '(sem nome)';
        const ano = despesas[0]?.anoDotacao || (item.ano || '2024');
        let totalValor = 0;
        despesas.forEach((d) => {
          const rawVal = d.valor || d.valorDespesa || d.valorTotal || d.vlrEmpenho || '0';
          const valor = parseFloat(String(rawVal).replace(',', '.'));
          if (!isNaN(valor)) totalValor += valor;
        });
        return { id: codOrgao, orgao: codOrgao, descricao: nomeOrgao, valor: totalValor, ano };
      });

      const filtered = normalized.filter((it) => {
        const matchOrgao = orgaoTerm ? (String(it.orgao).toLowerCase().includes(orgaoTerm) || String(it.descricao).toLowerCase().includes(orgaoTerm)) : true;
        const matchAno = anoTerm ? String(it.ano) === anoTerm : true;
        return matchOrgao && matchAno;
      });

      currentResults = normalized;
      renderResults(filtered);
    } catch (e) {
      rootDiv.innerHTML = `<div class="empty">Erro: ${escapeHtml(e.message)}</div>`;
      console.error(e);
    }
  }

  // ===== Limpa pesquisa =====
  function clearSearch() {
    if (qOrgao) qOrgao.value = '';
    if (qAno) qAno.value = '';
    if (onlyFavorites) onlyFavorites.checked = false;
    rootDiv.innerHTML = '<div class="empty">Nenhuma consulta realizada ainda.</div>';
    totalCountEl.textContent = 0;
    currentResults = [];
    lastSync.textContent = '';
  }

  // Mantém histórico dos comentários originais (não removidos)
  /*
  // async function doSearch(){ ... }
  // function normalizeItem(raw){ ... }
  */

  // Exposição global
  window.__SOF_PROTOTYPE = { doSearch, favorites, renderResults, clearSearch };
})();
