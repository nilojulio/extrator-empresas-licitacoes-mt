# extrator-empresas-licitacoes-mt
Extrator de empresas para prospectar - participantes de licitações públicas do Portal de Aquisições de Mato Grosso.
# Extrator de Empresas de Licitações - MT

## 📌 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de identificar empresas participantes de licitações públicas do Estado de Mato Grosso por meio dos dados disponibilizados no Portal de Aquisições (SIAG).

A solução realiza consultas automatizadas nas licitações públicas, extrai informações das empresas participantes e gera planilhas prontas para análise comercial e prospecção.

O projeto nasceu como uma iniciativa prática de aprendizado em automação, coleta de dados públicos e análise de informações governamentais.

---

## 🎯 Objetivo

Automatizar a identificação de empresas que participam de licitações públicas para reduzir o trabalho manual de pesquisa.

O sistema é capaz de:

- Consultar licitações por período.
- Identificar empresas participantes.
- Identificar empresas vencedoras.
- Identificar empresas habilitadas.
- Identificar empresas inabilitadas.
- Identificar empresas desclassificadas.
- Gerar planilhas CSV para análise posterior.

---

## 🚀 Funcionalidades

### Consulta de Licitações

- Busca licitações públicas por período.
- Permite filtrar licitações encerradas.
- Processa grandes volumes de dados automaticamente.

### Extração de Empresas

A partir das mensagens e registros públicos do processo licitatório, o sistema identifica:

- Nome da empresa.
- Situação da empresa.
- Valor vencedor.
- Motivo de inabilitação.
- Motivo de desclassificação.

### Geração de Relatórios

O sistema gera duas planilhas:

#### 1. Relatório Detalhado

Contendo:

- Data de abertura
- Órgão
- Modalidade
- Edital
- Processo
- Objeto
- Lote
- Empresa
- Situação
- Valor
- Motivo
- Link da licitação

#### 2. Relatório Resumido

Contendo:

- Empresa
- Quantidade de licitações
- Quantidade de vitórias
- Inabilitações
- Desclassificações
- Órgãos participantes

---

## 🛠️ Tecnologias Utilizadas

- JavaScript
- API Pública do Portal de Aquisições MT
- CSV
- Navegador Web
- Console do Navegador

---

## 📊 Fluxo do Processo

```text
Portal de Aquisições MT
        ↓
Consulta de Licitações
        ↓
Leitura dos Lotes
        ↓
Identificação das Empresas
        ↓
Tratamento dos Dados
        ↓
Geração dos Arquivos CSV
```

---

## 📁 Estrutura dos Arquivos Gerados

```text
detalhado_empresas_licitacoes_MT.csv

resumo_por_empresa_MT.csv
```

---

## ✅ Resultados Obtidos

Durante os testes do projeto foi possível:

- Identificar empresas participantes.
- Gerar bases de dados consolidadas.
- Localizar CNPJs posteriormente.
- Localizar contatos comerciais.
- Apoiar atividades de prospecção comercial.

O projeto demonstrou a viabilidade da utilização de dados públicos para mapeamento de fornecedores participantes de processos licitatórios.

---

## 📚 Aprendizados

Durante o desenvolvimento foram aplicados conhecimentos de:

- Consumo de APIs
- JavaScript assíncrono
- Manipulação de JSON
- Extração e tratamento de dados
- Geração de arquivos CSV
- Automação de processos
- Dados públicos governamentais

---

## 🔮 Próximas Evoluções

Versão 2.0

- Interface Web
- Dashboard de consultas
- Busca automática de CNPJ
- Busca automática de telefone
- Exportação Excel
- Banco de dados
- Integração com IA para análise de documentos

Versão 3.0

- Sistema SaaS
- Histórico de consultas
- CRM de prospecção
- Monitoramento de novas licitações

---

## 👨‍💻 Autor

Projeto desenvolvido como estudo prático de automação e análise de dados públicos, com foco em aprendizado, prospecção comercial e desenvolvimento de soluções baseadas em dados governamentais.
