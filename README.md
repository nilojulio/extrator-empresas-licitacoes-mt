# Extrator de Empresas Contratadas em Licitações – MT (PNCP)

Script em JavaScript que levanta, a partir dos dados públicos do **PNCP – Portal Nacional de Contratações Públicas**, as empresas que assinaram contratos com órgãos públicos de **Mato Grosso** num período, e gera planilhas prontas para prospecção comercial.

---

## 📌 Sobre o projeto

Na prospecção B2B, os leads mais valiosos são as empresas que já vendem para o governo. Essa informação é pública e fica no PNCP, mas está espalhada por milhares de contratos de centenas de órgãos. Pesquisar um por um levaria dias.

Este script automatiza a pesquisa: ele consulta a API pública do PNCP, reúne os contratos dos órgãos de MT no período escolhido e entrega duas planilhas CSV com as empresas contratadas, já com CNPJ.

O projeto nasceu de uma necessidade real do meu trabalho como SDR em uma consultoria jurídica especializada em licitações. Também foi um estudo prático de automação, APIs e dados públicos, desenvolvido com apoio de IA.

---

## 🚀 O que o script faz

**Etapa 1 – Lista os órgãos**
- Consulta as contratações publicadas no período, em Mato Grosso, nas modalidades **Pregão Eletrônico, Pregão Presencial, Concorrência Eletrônica e Concorrência Presencial**.
- Monta a lista de órgãos **municipais e federais** de MT que tiveram contratações no período.

**Etapa 2 – Lê os contratos de cada órgão**
- Busca os contratos assinados por cada órgão no período.
- Mantém apenas fornecedores **pessoa jurídica** e unidades localizadas em MT.

**Etapa 3 – Gera as planilhas**
- Baixa automaticamente dois arquivos CSV (separados por `;`, compatíveis com Excel).

### Recursos de robustez

- Até 3 consultas simultâneas, para não sobrecarregar a API.
- Novas tentativas automáticas em caso de falha, com espera maior quando a API responde "muitas requisições" (erro 429).
- Painel de progresso na própria página.
- Botão **"Parar e baixar o que já tem"**, para interromper e salvar os dados já coletados.
- Lista dos órgãos que não responderam, para rodar de novo depois.

---

## 📊 Planilhas geradas

### 1. `pncp_contratos_MT_<início>_a_<fim>.csv` (detalhado, um contrato por linha)

| Coluna | Descrição |
| --- | --- |
| Empresa | Razão social do fornecedor |
| CNPJ | CNPJ formatado |
| Órgão | Órgão contratante |
| Esfera | Municipal ou Federal |
| Município do órgão | Município da unidade contratante |
| Objeto | Objeto do contrato (até 300 caracteres) |
| Valor global | Valor do contrato |
| Data assinatura | Data de assinatura |
| Tipo | Tipo de contrato |
| Controle PNCP | Número de controle no PNCP |

### 2. `pncp_resumo_por_empresa_MT_<início>_a_<fim>.csv` (uma empresa por linha)

| Coluna | Descrição |
| --- | --- |
| Empresa | Razão social |
| CNPJ | CNPJ formatado |
| Contratos | Quantidade de contratos no período |
| Valor total (R$) | Soma dos valores dos contratos |
| Esferas | Esferas dos órgãos contratantes |
| Municípios dos órgãos | Municípios atendidos |
| Órgãos | Órgãos contratantes |

O resumo sai ordenado pelas empresas com mais contratos, o que ajuda a priorizar a prospecção.

---

## ▶️ Como usar

1. Abra o site **https://pncp.gov.br** no navegador (Chrome ou Edge).
2. Edite a configuração no início do `script.js`:
   ```js
   const DATA_INICIO = '2026-01-01';
   const DATA_FIM    = '2026-10-28';
   const UF = 'MT';
   ```
3. Pressione **F12**, abra a aba **Console**, cole o script inteiro e pressione **Enter**.
4. Acompanhe o painel no canto inferior direito da página.
5. Ao final, as duas planilhas são baixadas automaticamente.

> O script precisa rodar com a página do PNCP aberta, porque faz as consultas à API a partir do próprio site.

---

## 🛠️ Tecnologias

- JavaScript (async/await, `fetch`, `Promise.all`)
- API pública de consulta do PNCP
- Console do navegador
- CSV

---

## 📚 Aprendizados

- Consumo de API pública com paginação
- Controle de concorrência e novas tentativas
- Tratamento de limite de requisições (HTTP 429)
- Manipulação de JSON e geração de CSV no navegador
- Uso de dados públicos governamentais para prospecção comercial
- Uso de IA como apoio no desenvolvimento

---

## ⚠️ Limitações

- Considera apenas órgãos **municipais e federais**. Órgãos do governo estadual de MT usam o portal próprio de aquisições (SIAG).
- Traz as empresas que **assinaram contrato**, não todas as que participaram das licitações.
- Telefones e e-mails não estão no PNCP; precisam ser buscados à parte pelo CNPJ.

---

## 🔮 Próximas evoluções

- Incluir os órgãos estaduais de MT (portal SIAG)
- Busca automática de contatos pelo CNPJ
- Interface simples para escolher período e filtros
- Remoção de duplicados e filtro por cidade
- Exportação direta para Excel

---

## 👨‍💻 Autor

**Nilo Julio** – SDR e consultor comercial, estudando automação e IA aplicadas a vendas B2B.

Projeto feito com fins de estudo e prospecção, usando exclusivamente dados públicos.
