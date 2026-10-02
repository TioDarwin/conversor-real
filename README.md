# Conversor Real

Aplicação web responsiva para converter um valor em reais (BRL) para dólar americano (USD), euro (EUR), iene japonês (JPY), libra esterlina (GBP) e yuan chinês (CNY), consultando cotações reais da API [Frankfurter](https://api.frankfurter.dev/).

## Stack

- React + TypeScript
- Vite
- Tailwind CSS via `@tailwindcss/vite`
- Lucide React
- Fetch API com timeout e `Promise.allSettled`

Não é necessário backend: a API Frankfurter permite a consulta direta pelo navegador e não exige chave secreta. O frontend valida o payload, trata respostas HTTP inválidas, falhas de rede e timeout, e mantém o resultado das demais moedas quando uma cotação individual falha.

## Instalação e desenvolvimento

Requer Node.js 20+ e pnpm 10+.

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

## Produção

```bash
pnpm build
pnpm preview
```

O build estático é gerado em `dist/`.

## Publicação no GitHub Pages

O projeto inclui o workflow `.github/workflows/deploy-pages.yml`. Depois de cada `git push` na branch `main`, o GitHub instala as dependências, executa `pnpm build` e publica automaticamente a pasta `dist/`.

Endereço público: <https://tiodarwin.github.io/conversor-real/>

## Estrutura

```text
src/
├── components/       # Header, formulário, cards, estados visuais, rodapé e tema
├── services/         # Cliente da API Frankfurter e mapeamento de erros
├── utils/            # Validação, parsing pt-BR e formatação de moedas/datas
├── App.tsx           # Estado da página e orquestração da conversão
├── types.ts          # Tipos e contrato das cotações
├── main.tsx          # Entrada React
└── styles.css        # Tokens visuais, responsividade e animações
public/manus-routes.json
```

### Fluxo de conversão

1. O formulário aceita `150`, `150,50`, `1.234,56` e equivalentes com ponto decimal.
2. O valor é validado contra vazio, texto inválido, zero e números negativos.
3. Cinco requisições são executadas em paralelo com timeout de 8 segundos.
4. Para cada resposta válida, o cálculo é `valor_em_reais / cotacao_em_reais`.
5. Resultados e data da cotação são formatados para pt-BR.
6. Falhas são comunicadas na interface; uma moeda indisponível não impede as outras de aparecerem.

## Testes manuais

- **Conversão válida:** informe `150,50`, clique em Converter e confirme cinco cartões com valores, cotação, data e horário da consulta.
- **Campo vazio:** deixe o campo vazio e envie; deve aparecer `Digite um valor em reais.`.
- **Texto inválido:** informe `abc`; deve aparecer `Digite um número válido. Exemplo: 150 ou 150,50.`.
- **Zero:** informe `0`; deve aparecer `Digite um valor maior que zero.`.
- **Negativo:** informe `-10`; deve aparecer `Digite um valor maior que zero.`, preservando o formulário.
- **Falta de internet/API indisponível:** bloqueie as requisições ou desligue a rede; deve aparecer uma mensagem visual e os cartões indisponíveis, sem quebrar a página.
- **Tema:** alterne claro/escuro; recarregue e confirme que a preferência foi preservada no `localStorage`.
- **Tela pequena:** teste uma largura de 320–390px; confirme coluna única, botão confortável, textos legíveis e foco visível.
- **Acessibilidade:** use Tab/Shift+Tab, confirme foco, label do campo, botão nomeado e mensagens em regiões `aria-live`.
