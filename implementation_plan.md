# Bu Country Tours — MVP Implementation Plan

Plataforma de experiências turísticas construída com React 19 + Vite 8, utilizando TailwindCSS v4 para estilização e Context API para gerenciamento de estado.

---

## Contexto do Projeto

O projeto `bu-country-tours` já existe em `d:\User\Documents\CodesProjects\desafio_frontend\bu-country-tours\` com uma estrutura Vite + React scaffold padrão. O arquivo [tours.json](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/tours.json) contém **8 tours** com as categorias: `"Aventura e Natureza"` (4), `"Gastronomia"` (2), `"Cultural e Histórico"` (2). Preços nativos em BRL, com conversão dinâmica para USD (1 USD = 5.00 BRL).

> [!IMPORTANT]
> **Data do sistema fixa**: `2026-05-22` — usada como `min` do calendário e referência para testes unitários.

---

## User Review Required

> [!WARNING]
> **TailwindCSS v4**: O SkeletonLoader exige classes `animate-pulse` e `bg-gray-200` do Tailwind. O Tailwind **não está instalado** no projeto `bu-country-tours`. Vou instalá-lo como `tailwindcss@4` + `@tailwindcss/vite` e configurar via plugin Vite, que é a abordagem recomendada para TailwindCSS v4. A diretiva `@import "tailwindcss"` será adicionada ao `index.css`.

> [!IMPORTANT]
> **Dependências de teste**: Jest + React Testing Library estão no `package.json` raiz, mas **NÃO** no projeto `bu-country-tours`. Vou instalar `jest`, `@jest/globals`, `@testing-library/react`, `@testing-library/jest-dom`, `jest-environment-jsdom`, `@babel/preset-env`, `@babel/preset-react`, e `identity-obj-proxy` como devDependencies no projeto correto, além de configurar Babel + Jest para transformação JSX.

> [!IMPORTANT]
> **Google Fonts**: Vou adicionar a fonte **Inter** via `<link>` no `index.html` para tipografia moderna e premium.

---

## Open Questions

> [!IMPORTANT]
> **Fluxo de navegação**: A spec descreve `TourDetails` com galeria + badges e `BookingWidget` como painel lateral. O fluxo será:
> 1. **Topo**: Header com logo + seletor de moeda (BRL/USD)
> 2. **Seção de Filtros**: Barra de busca + 3 botões de categoria + slider de preço máximo
> 3. **Listagem**: Grid de cards de tours filtrados (clicável → seleciona tour ativo)
> 4. **Detalhes + Widget**: Layout 2 colunas em desktop (detalhes à esquerda, widget à direita/fixado no fundo em mobile)
> 5. **Checkout**: Formulário inline abaixo do widget ao clicar "Reservar Agora"
> 6. **Modal**: Sucesso pós-checkout
>
> É este o fluxo pretendido? Vou proceder com essa arquitetura a menos que indique o contrário.

---

## Análise do Modelo de Dados

Cada tour em [tours.json](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/tours.json) possui:

| Campo | Tipo | Uso |
|---|---|---|
| `id`, `slug` | string | Identificação |
| `title` | string | Busca + exibição |
| `category` | string | Filtro (3 valores fixos) |
| `rating`, `reviewsCount` | number | Badge de avaliação |
| `location` | string | Busca + exibição |
| `duration` | string | Badge |
| `languages` | string[] | Badges individuais |
| `freeCancellation` | boolean | Badge condicional |
| `cancellationPolicy` | string | Texto de política |
| `highlights` | string[] | Lista de destaques |
| `prices.adult`, `prices.child` | number | Motor de cálculo |
| `prices.currency` | string | Sempre "BRL" |
| `unavailableDates` | string[] | Restrição do calendário |
| `maxCapacityPerSlot` | number | Limite adultos + crianças |
| `images` | string[] | Galeria (1-2 URLs Unsplash) |
| `description` | string | Texto descritivo |

---

## Proposed Changes

### 0. Setup & Configuração

#### [MODIFY] [package.json](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/package.json)

Adicionar dependências:
- **dependencies**: `lucide-react` (ícones SVG premium)
- **devDependencies**: `tailwindcss@^4`, `@tailwindcss/vite`, `jest`, `@jest/globals`, `@testing-library/react`, `@testing-library/jest-dom`, `jest-environment-jsdom`, `@babel/preset-env`, `@babel/preset-react`, `identity-obj-proxy`
- **scripts**: adicionar `"test": "jest"`

#### [MODIFY] [vite.config.js](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/vite.config.js)

Adicionar plugin `@tailwindcss/vite` ao array de plugins do Vite.

#### [MODIFY] [index.html](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/index.html)

- Adicionar `<link>` para Google Fonts (Inter 400, 500, 600, 700)
- Atualizar `<title>` para "Bu Country Tours — Experiências Únicas pelo Mundo"
- Adicionar meta description para SEO
- Definir `lang="pt-BR"`

#### [NEW] [babel.config.cjs](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/babel.config.cjs)

Configuração Babel para Jest transformar JSX:
```js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
```

#### [NEW] [jest.config.cjs](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/jest.config.cjs)

Configuração Jest com `jsdom` environment, transform de JSX, e moduleNameMapper para CSS.

---

### 1. Estado Global & Persistência

#### [NEW] [src/context/AppContext.jsx](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/context/AppContext.jsx)

**AppContextProvider** gerencia:

- **`tours`**: Importação direta de `../tours.json`
- **`activeTour`**: O tour selecionado (default: `tours[0]`)
- **`searchTerm`** (string): Busca concorrente em `title` e `location` (case-insensitive)
- **`selectedCategory`** (string | null): Uma das 3 categorias exatas ou `null` para "Todas"
- **`maxPrice`** (number): Valor máximo do slider (range: 0 a preço max do JSON)
- **`currency`** ("BRL" | "USD"): Moeda ativa, com conversão `1 USD = 5.00 BRL`
- **`filteredTours`**: Computed via `useMemo` aplicando todos os filtros
- **`checkoutData`**: Dados do formulário sincronizados com `localStorage`
- **`showCheckout`** (boolean): Controla exibição do formulário
- **`showSuccessModal`** (boolean): Controla modal de sucesso
- **`bookingDetails`**: Dados da reserva confirmada para o modal

Lógica de persistência:
```
useEffect → ao montar, ler localStorage('bu_checkout_data')
useEffect → ao alterar checkoutData, gravar em localStorage
```

Exports: `AppContextProvider`, `useAppContext` (hook com `useContext`).

---

### 2. Hook de Regra de Negócio

#### [NEW] [src/hooks/useTourBooking.js](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/hooks/useTourBooking.js)

**Parâmetros**: recebe `tour` (objeto do JSON) e `currency` ("BRL" | "USD").

**Estado interno**:
- `adults` (number, min: 1, default: 1)
- `children` (number, min: 0, default: 0)
- `selectedDate` (string, default: "")

**Regras de negócio**:
1. **Capacidade**: `adults + children <= tour.maxCapacityPerSlot`. Incremento bloqueado quando atingir o limite.
2. **Calendário `min`**: Fixo em `"2026-05-22"`.
3. **Datas indisponíveis**: `tour.unavailableDates` — Validação no `onChange` do input date; se data selecionada estiver no array, resetar para `""` e mostrar alerta.
4. **Cálculo de preço**:
   ```
   totalBRL = (adults * tour.prices.adult) + (children * tour.prices.child)
   totalConverted = currency === "USD" ? (totalBRL / 5.00).toFixed(2) : totalBRL.toFixed(2)
   ```
5. **Formatação**: Retorna string formatada `"R$ 450.00"` ou `"$ 90.00"`.

**Retorno**:
```js
{ adults, children, selectedDate, totalPrice, formattedTotal,
  adultSubtotal, childSubtotal,
  incrementAdults, decrementAdults, incrementChildren, decrementChildren,
  setSelectedDate, canIncrement, minDate, isDateUnavailable }
```

---

### 3. Skeleton Loader

#### [NEW] [src/components/SkeletonLoader.jsx](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/components/SkeletonLoader.jsx)

Componente com variantes:
- **`card`**: Simula card de tour (imagem retangular + 3 linhas de texto)
- **`gallery`**: Simula galeria de imagens (retângulo grande + thumbnails)
- **`widget`**: Simula painel de reservas

Usa classes TailwindCSS `animate-pulse bg-gray-200 rounded-lg` com diferentes alturas/larguras. Aceita prop `variant` e `count` (número de skeletons a renderizar).

---

### 4. Tour Details & Descoberta

#### [NEW] [src/components/TourDetails.jsx](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/components/TourDetails.jsx)

**Seção de Filtros (topo)**:
- Input de busca com ícone `Search` (lucide-react), placeholder "Buscar por nome ou localização..."
- 3 botões de categoria: `"Aventura e Natureza"`, `"Gastronomia"`, `"Cultural e Histórico"` + botão "Todas"
- Input `range` para preço máximo com label dinâmica mostrando valor atual na moeda ativa

**Grid de Cards** (tours filtrados):
- Card com imagem principal, título, localização, rating (estrelas), duração, preço por adulto
- Hover com elevação (`shadow-lg`) e escala (`scale-[1.02]`)
- Click → `setActiveTour(tour)`
- Estado de loading com `SkeletonLoader variant="card"`

**Detalhes do Tour Ativo**:
- Galeria responsiva: imagem principal grande + thumbnails clicáveis (com transição suave)
- Estado de loading com `SkeletonLoader variant="gallery"`
- Título (h1), localização, rating com estrelas preenchidas
- **Badges WCAG alto contraste**:
  - Duração: fundo azul escuro, texto branco
  - Idiomas: cada idioma em badge separado, fundo teal
  - Cancelamento: badge verde (gratuito) ou vermelho (não reembolsável)
- Lista de `highlights` com ícone ✓
- Texto de `cancellationPolicy`
- Descrição completa

---

### 5. Booking Widget

#### [NEW] [src/components/BookingWidget.jsx](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/components/BookingWidget.jsx)

**Layout responsivo**:
- **Desktop**: `sticky top-4` na coluna direita, card com sombra
- **Mobile**: `fixed bottom-0` full-width, barra compacta com preço + botão "Reservar", expandível para widget completo

**Conteúdo**:
- Preço por adulto e por criança na moeda ativa
- Input `type="date"` com `min="2026-05-22"` + validação de datas indisponíveis
- Seletores +/- para Adultos (min 1) e Crianças (min 0)
- Indicador de capacidade restante: `"X vagas restantes"` ou `"Capacidade máxima atingida"` em vermelho
- Subtotal discriminado: `Adultos: X × R$ Y = R$ Z` e `Crianças: X × R$ Y = R$ Z`
- **Preço total** em destaque (fonte grande, peso bold)
- Botão `"Reservar Agora"` — estilo primário, gradiente, hover com brightness
- Desabilitado se data não selecionada

Consome `useTourBooking(activeTour, currency)` e `useAppContext()`.

---

### 6. Checkout Form

#### [NEW] [src/components/CheckoutForm.jsx](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/components/CheckoutForm.jsx)

**Campos** (controlados via context `checkoutData` + localStorage sync):
- Nome Completo (text, required)
- E-mail (text, validação manual: contém `@`)
- Telefone (tel, validação: apenas caracteres numéricos após strip)
- Tipo de Documento: select (Passaporte | CNI)
- Número do Documento (text, required)

**Validação no submit**:
1. Todos campos preenchidos (trim)
2. E-mail contém `@`
3. Telefone contém apenas dígitos (após remover espaços/hífens)
4. Se inválido: mensagem `text-red-600` abaixo do campo, com `aria-live="polite"`

**Fluxo de sucesso**:
1. Exibir spinner de loading por 1.5s (`setTimeout`) simulando autorização financeira
2. Após timer: chamar `setShowSuccessModal(true)` com dados da reserva
3. Limpar localStorage

**Resumo da reserva** visível acima do formulário (tour, data, pessoas, total).

---

### 7. Success Modal

#### [NEW] [src/components/SuccessModal.jsx](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/components/SuccessModal.jsx)

**Transição**: Fade-in + scale do modal (CSS `transition` + `opacity`/`transform`).

**Conteúdo**:
- Ícone grande de check (lucide-react `CheckCircle`, tamanho 64px, cor verde `#22c55e`)
- Título: "Reserva Confirmada!"
- **Resumo discriminado**:
  - Passageiro: nome completo
  - Tour: título exato do JSON
  - Data: data confirmada formatada
  - Adultos: X | Crianças: Y
  - Valor Total Pago: formatado com símbolo (`R$ 450.00` ou `$ 90.00`)
- Botão "Fechar" que reseta estado e volta para a listagem
- Backdrop escuro clicável para fechar

Acessibilidade: `role="dialog"`, `aria-modal="true"`, focus trap básico.

---

### 8. Testes Unitários

#### [NEW] [src/components/BookingWidget.test.js](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/components/BookingWidget.test.js)

**Setup**: Importa tour do `../tours.json`, monta `BookingWidget` dentro de um wrapper com `AppContextProvider`.

**Testes**:
1. Renderiza com dados iniciais (1 adulto, 0 crianças)
2. Simula click em "+" para crianças → verifica contagem = 1
3. Altera moeda do contexto para "USD" → verifica preço recalculado:
   - Tour `tour-001`: `(1 × 180 + 1 × 90) / 5.00 = 54.00` → expect `"$ 54.00"`
4. Verifica que botão "Reservar Agora" existe e está desabilitado sem data

---

### 9. App Orchestration

#### [MODIFY] [src/App.jsx](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/App.jsx)

Substituição completa. Nova estrutura:

```jsx
<AppContextProvider>
  <Header />          {/* Logo + seletor moeda */}
  <main>
    <TourDetails />   {/* Filtros + cards + detalhes */}
    <aside>
      <BookingWidget />
      {showCheckout && <CheckoutForm />}
    </aside>
  </main>
  {showSuccessModal && <SuccessModal />}
</AppContextProvider>
```

O `Header` será inline no App.jsx (componente simples, não justifica arquivo separado):
- Logo "Bu Country Tours" com ícone `MapPin` (lucide-react)
- Toggle BRL/USD com indicador visual da moeda ativa

#### [MODIFY] [src/index.css](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/index.css)

Substituição completa:
- `@import "tailwindcss"` (TailwindCSS v4)
- CSS custom properties para a paleta de turismo:
  - Primary: `#0f766e` (teal-700) — confiança/natureza
  - Secondary: `#0e7490` (cyan-700) — aventura/água
  - Accent: `#f59e0b` (amber-500) — energia/destaque
  - Background: `#f8fafc` (slate-50)
  - Superfície: `#ffffff`
- Custom `@keyframes` para skeleton pulse se necessário
- Estilos base (`body`, `font-family: 'Inter'`)
- Utilitários customizados para badges WCAG

#### [DELETE] [src/App.css](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/src/App.css)

Arquivo do scaffold original — não será mais necessário.

---

### 10. README

#### [MODIFY] [README.md](file:///d:/User/Documents/CodesProjects/desafio_frontend/bu-country-tours/README.md)

Conteúdo completo com:
1. **Instalação**: `npm install` → `npm run dev`
2. **Testes**: `npm test`
3. **Arquitetura**: Context API vs Redux (simplicidade para MVP), hooks customizados para SRP
4. **UI/UX**: Mobile-first, paleta teal/cyan para setor turístico (confiança), badges WCAG, skeleton loaders, persistência localStorage para UX

---

## Estrutura Final de Arquivos

```
bu-country-tours/
├── babel.config.cjs          [NEW]
├── jest.config.cjs            [NEW]
├── index.html                 [MODIFY]
├── package.json               [MODIFY]
├── vite.config.js             [MODIFY]
├── README.md                  [MODIFY]
└── src/
    ├── tours.json             (inalterado — fonte de dados)
    ├── main.jsx               (inalterado)
    ├── index.css              [MODIFY] — Design system + Tailwind
    ├── App.jsx                [MODIFY] — Orquestração completa
    ├── App.css                [DELETE]
    ├── context/
    │   └── AppContext.jsx     [NEW]
    ├── hooks/
    │   └── useTourBooking.js  [NEW]
    └── components/
        ├── SkeletonLoader.jsx       [NEW]
        ├── TourDetails.jsx          [NEW]
        ├── BookingWidget.jsx        [NEW]
        ├── CheckoutForm.jsx         [NEW]
        ├── SuccessModal.jsx         [NEW]
        └── BookingWidget.test.js    [NEW]
```

---

## Verification Plan

### Automated Tests
1. `npm test` — Executa o arquivo `BookingWidget.test.js` com Jest:
   - Verifica renderização inicial
   - Verifica incremento de crianças
   - Verifica conversão USD (valor exato `$ 54.00` para tour-001 com 1 adulto + 1 criança)
   - Verifica estado do botão reservar

### Manual Verification
1. `npm run dev` — Verificar:
   - Filtros funcionais (busca, categorias, slider)
   - Seleção de tour muda detalhes
   - Widget calcula preço corretamente
   - Datas indisponíveis são rejeitadas pelo calendário
   - Toggle BRL/USD recalcula todos os preços
   - Formulário valida campos e mostra erros
   - Spinner de 1.5s após submit válido
   - Modal de sucesso exibe resumo completo
   - Dados do checkout persistem em localStorage
   - Layout responsivo: widget fixo no mobile, sidebar no desktop
2. `npm run build` — Verificar build de produção sem erros
