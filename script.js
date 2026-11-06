(async () => {
  // ====== CONFIGURAÇÃO ======
  const DATA_INICIO = '2026-01-01';
  const DATA_FIM    = '2026-10-28';
  const UF = 'MT';
  const ESFERAS = ['M', 'F', 'N'];
  const MODALIDADES = [6, 7, 4, 5];
  const SIMULTANEAS = 3;
  // ==========================

  const esperar = ms => new Promise(r => setTimeout(r, ms));
  const di = DATA_INICIO.replace(/-/g, ''), df = DATA_FIM.replace(/-/g, '');
  const ESF = { M: 'Municipal', F: 'Federal', N: 'Federal', E: 'Estadual', D: 'Distrital' };

  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:999999;background:#1f2937;color:#fff;font:14px/1.4 Arial,sans-serif;padding:14px 16px;border-radius:10px;max-width:360px;box-shadow:0 4px 16px rgba(0,0,0,.3)';
  document.body.appendChild(box);
  let parar = false;
  const status = t => {
    box.innerHTML = '<b>Extrator PNCP</b><br>' + t + '<br><button id="pn-stop" style="margin-top:8px;padding:4px 10px;cursor:pointer">Parar e baixar o que já tem</button>';
    const b = document.getElementById('pn-stop');
    if (b) b.onclick = () => { parar = true; };
  };

  let ativas = 0;
  const fila = [];
  const vaga = () => new Promise(r => {
    if (ativas < SIMULTANEAS) { ativas++; r(); }
    else fila.push(r);
  });
  const solta = () => {
    const p = fila.shift();
    if (p) p();
    else ativas--;
  };

  async function buscar(url, tentativas = 6) {
    await vaga();
    try {
      for (let i = 0; i < tentativas; i++) {
        try {
          const r = await fetch(url);
          if (r.status === 204) return { data: [], totalPaginas: 0, totalRegistros: 0 };
          if (r.status === 429) { await esperar(15000 * (i + 1)); continue; }
          const t = await r.text();
          if (r.ok) return t ? JSON.parse(t) : { data: [], totalPaginas: 0 };
        } catch (e) {}
        await esperar(2000 * (i + 1));
      }
      return null;
    } finally {
      solta();
    }
  }

  // ETAPA 1: órgãos de MT com licitação no período
  const orgaos = {};
  let falhasPag = 0;

  for (const mod of MODALIDADES) {
    if (parar) break;

    const url = p => `/api/consulta/v1/contratacoes/publicacao?dataInicial=${di}&dataFinal=${df}&codigoModalidadeContratacao=${mod}&uf=${UF}&pagina=${p}&tamanhoPagina=50`;
    const pri = await buscar(url(1));
    if (!pri) { falhasPag++; continue; }

    const total = pri.totalPaginas || 1;
    const guarda = j => (j && j.data || []).forEach(x => {
      const o = x.orgaoEntidade || {}, u = x.unidadeOrgao || {};
      if (!o.cnpj || !ESFERAS.includes(o.esferaId)) return;
      if (!orgaos[o.cnpj]) {
        orgaos[o.cnpj] = {
          nome: o.razaoSocial,
          esfera: ESF[o.esferaId] || o.esferaId,
          municipio: u.municipioNome || ''
        };
      }
    });

    guarda(pri);
    let feitas = 1;
    const paginas = [];
    for (let p = 2; p <= total; p++) paginas.push(p);

    await Promise.all(paginas.map(async p => {
      if (parar) return;
      const j = await buscar(url(p));
      if (!j) falhasPag++;
      else guarda(j);
      feitas++;
      status(`Etapa 1 de 2: listando órgãos<br>Modalidade ${mod}: página ${feitas} de ${total}<br>Órgãos encontrados: ${Object.keys(orgaos).length}`);
    }));
  }

  // ETAPA 2: contratos de cada órgão
  const contratos = [];
  const listaOrg = Object.entries(orgaos);
  let feitasOrg = 0, falhasOrg = [];

  async function contratosDoOrgao([cnpj, o]) {
    const url = p => `/api/consulta/v1/contratos?dataInicial=${di}&dataFinal=${df}&cnpjOrgao=${cnpj}&pagina=${p}&tamanhoPagina=500`;
    let p = 1, total = 1;

    do {
      if (parar) return;
      const j = await buscar(url(p));
      if (!j) { falhasOrg.push(o.nome); return; }

      total = j.totalPaginas || 1;
      for (const c of (j.data || [])) {
        if (!c.niFornecedor || (c.tipoPessoa && c.tipoPessoa !== 'PJ')) continue;

        const u = c.unidadeOrgao || {};
        if (u.ufSigla && u.ufSigla !== UF) continue;

        contratos.push({
          'Empresa': (c.nomeRazaoSocialFornecedor || '').trim().toUpperCase(),
          'CNPJ': c.niFornecedor,
          'Órgão': o.nome,
          'Esfera': o.esfera,
          'Município do órgão': u.municipioNome || o.municipio,
          'Objeto': (c.objetoContrato || '').replace(/\s+/g, ' ').slice(0, 300),
          'Valor global': c.valorGlobal != null ? String(c.valorGlobal).replace('.', ',') : '',
          'Data assinatura': c.dataAssinatura || '',
          'Tipo': (c.tipoContrato && c.tipoContrato.nome) || '',
          'Controle PNCP': c.numeroControlePNCP || ''
        });
      }
      p++;
    } while (p <= total);
  }

  const filaOrg = listaOrg.slice();
  await Promise.all(Array.from({ length: SIMULTANEAS }, async () => {
    while (filaOrg.length && !parar) {
      await contratosDoOrgao(filaOrg.shift());
      feitasOrg++;
      status(`Etapa 2 de 2: lendo contratos<br>Órgãos: ${feitasOrg} de ${listaOrg.length}<br>Contratos encontrados: ${contratos.length}<br>Órgãos sem resposta: ${falhasOrg.length}`);
    }
  }));

  // GERAÇÃO DAS PLANILHAS CSV
  const cel = v => '"' + String(v ?? '').replace(/"/g, '""').replace(/[\r\n]+/g, ' ') + '"';
  const fmtCnpj = c => c.length === 14 ? `${c.slice(0,2)}.${c.slice(2,5)}.${c.slice(5,8)}/${c.slice(8,12)}-${c.slice(12)}` : c;

  const baixar = (conteudo, nome) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + conteudo], { type: 'text/csv;charset=utf-8' }));
    a.download = nome;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const col1 = ['Empresa', 'CNPJ', 'Órgão', 'Esfera', 'Município do órgão', 'Objeto', 'Valor global', 'Data assinatura', 'Tipo', 'Controle PNCP'];

  baixar(
    col1.map(cel).join(';') + '\n' +
    contratos.map(r => col1.map(c => cel(c === 'CNPJ' ? fmtCnpj(r[c]) : r[c])).join(';')).join('\n'),
    `pncp_contratos_${UF}_${DATA_INICIO}_a_${DATA_FIM}.csv`
  );

  const res = {};
  for (const r of contratos) {
    const e = res[r.CNPJ] = res[r.CNPJ] || {
      nome: r['Empresa'],
      n: 0,
      valor: 0,
      orgaos: new Set(),
      muns: new Set(),
      esf: new Set()
    };
    e.n++;
    e.valor += parseFloat(String(r['Valor global']).replace(',', '.')) || 0;
    e.orgaos.add(r['Órgão']);
    e.muns.add(r['Município do órgão']);
    e.esf.add(r['Esfera']);
  }

  const col2 = ['Empresa', 'CNPJ', 'Contratos', 'Valor total (R$)', 'Esferas', 'Municípios dos órgãos', 'Órgãos'];

  const linhas2 = Object.entries(res).map(([c, e]) => ({
    'Empresa': e.nome,
    'CNPJ': fmtCnpj(c),
    'Contratos': e.n,
    'Valor total (R$)': e.valor.toFixed(2).replace('.', ','),
    'Esferas': [...e.esf].join(', '),
    'Municípios dos órgãos': [...e.muns].join(', '),
    'Órgãos': [...e.orgaos].join(' | ')
  })).sort((a, b) => b['Contratos'] - a['Contratos']);

  await esperar(800);

  baixar(
    col2.map(cel).join(';') + '\n' +
    linhas2.map(r => col2.map(c => cel(r[c])).join(';')).join('\n'),
    `pncp_resumo_por_empresa_${UF}_${DATA_INICIO}_a_${DATA_FIM}.csv`
  );

  status(`<b>Pronto!</b><br>Órgãos lidos: ${feitasOrg} de ${listaOrg.length}<br>Contratos: ${contratos.length}<br>Empresas diferentes: ${linhas2.length}<br>Órgãos sem resposta: ${falhasOrg.length}${falhasOrg.length ? ' (rode de novo mais tarde para completar)' : ''}<br>As duas planilhas foram baixadas.`);

  window.__extratorPNCP = { orgaos, contratos, falhasOrg };
})();
