# SISTEMA JP EMBALAGENS — regras do projeto

Sistema de controle de produção de embalagens corrugadas (caixas de papelão) da
JP Embalagens. Tudo em **HTML + JS puro + Firebase** (Firestore + Auth + Storage),
hospedado no **GitHub Pages**. Responder sempre em **português informal**.

## Arquivos (7) — todos standalone, na raiz do repositório
- `index.html` — menu/hub que abre cada painel
- `sistema.html` — PCP/desktop, sistema principal (grande, ~990 KB). Módulos:
  produção, comercial, cadastros, expedição, análises
- `painel_operador.html` — PWA dos operadores (chão de fábrica)
- `painel_expedicao.html` — PWA de expedição/carregamento
- `painel_laudo.html` — PWA de laudo/qualidade
- `painel_escala.html` — escala diária de caminhões/viagens
- `painel_motorista.html` — app do motorista (login PIN, rota, aviso de carga)

## Versão atual: v2.5.0
- Versionamento semântico. **Sempre dizer quais arquivos mudaram.**
- **Manter o selo de versão IGUAL em todos os 7 arquivos** (o usuário confere isso).
  Locais do selo: `sistema.html` (badge "Ver changelog" + headline 24px do changelog),
  `painel_operador.html` ("Ver versão"), `painel_expedicao.html` (title+texto),
  `painel_laudo.html` (2 badges + `const VERSAO`), `painel_escala.html` (.badge),
  `index.html` (.versao), `painel_motorista.html` (.badge no login).

## Firebase
- Projeto: `jpproducao-6b59f` · Storage bucket `jpproducao-6b59f.firebasestorage.app`.
- A config fica no topo de cada arquivo (SDK compat 10.12.2).
- Documentos no Firestore (coleção `jp_sistema`, cada um com um array):
  `operadores`, `caixas`, `clientes`, `motoristas`, `caminhoes`, `escalas`,
  `cargas`, `ocorrencias`, `manutencoes`, `entregas_status`, `chat_mensagens`, `config`.

## Padrões de código (seguir sempre)
- **Salvamento robusto**: 1) salva LOCAL primeiro (localStorage, chaves `PK_*`) —
  nunca perde, mesmo offline; 2) sincroniza nuvem sem travar o botão; 3) feedback
  sempre via `toast()`.
- **Fotos vão pro Firebase Storage** (gravar só a URL no documento). NUNCA base64
  dentro de documento do Firestore (limite de 1 MB por doc estoura).
- Helpers que já existem: `toast(msg,tipo)`, `nowIso()`, `nowTime()`, `load(k,def)`,
  `save(k,v)`, `comprimirImagem(file)`, `escapeHtml()`.
- Tema **dark**, cor primária **#009FE3**. Fontes Oswald + JetBrains Mono.
- Antes de entregar, **validar o JS** de cada arquivo (ex.: `node --check`) e conferir
  que não há funções/IDs duplicados.

## Pessoas e termos
- **Tulio** — gerente do PCP (referir como "o Tulio", nunca "Tuliza").
- Operadores: Arnaldo, Carlos, Gildo, Miller, Fabricio.
- PCP = Planejamento e Controle da Produção (o painel `sistema.html`).

## Como publicar
- Fazer **commit + push** no Git → o GitHub Pages atualiza sozinho.
  (Não precisa mais subir arquivo na mão nem gerar ZIP.)
- Depois de publicar, dar **refresh forçado** nos aparelhos pra pegar a versão nova.

## Estilo de trabalho
- Mudanças vão surgindo soltas (geralmente com print + a "dor" de cada uma).
- Explicar de forma simples e direta; o usuário não é programador.
- Quando mexer em algo, dizer o porquê em 1–2 frases e o que testar.
