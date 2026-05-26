# Bu Country Tours

Bem-vindo à plataforma **Bu Country Tours**, o MVP de agendamento de experiências turísticas locais pelo mundo.

## 🚀 Instalação e Execução Local

Siga os passos abaixo para rodar o projeto em sua máquina:

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a URL informada no terminal (geralmente `http://localhost:5173/`).

3. **Execute os testes automatizados:**
   ```bash
   npm run test
   ```

## 🏗️ Decisões de Arquitetura

- **Context API vs Redux**: Para este MVP, utilizamos nativamente o `Context API` (`AppContext.jsx`) aliado a Hooks Customizados. Esta abordagem garante simplicidade, evita o overhead de bibliotecas externas complexas de estado (como Redux) enquanto mantém os dados globais consistentes e sincronizados entre filtros, carrinho, persistência em localStorage e a troca dinâmica de moedas.
- **Hook de Regra de Negócio (`useTourBooking`)**: Isolamos 100% da inteligência do widget num Custom Hook. Isso facilita os testes unitários, respeita o SRP (Single Responsibility Principle) e limpa a parte de marcação UI no componente.

## 🎨 UI/UX

- **Design**: O layout flui naturalmente do mobile (componentes em pilha vertical, filtros acessíveis, widget de checkout otimizado no rodapé) para o desktop (layout em 2 colunas com `aside` persistente).
- **Psicologia das Cores**: A paleta de cores foca em tons *Teal* e *Cyan* (`teal-600`, `teal-700`). No setor do turismo, o azul/verde piscina transmite confiança, profissionalismo, segurança e aventura na natureza.
- **Usabilidade Otimizada**: Adotamos micro-interações como `SkeletonLoader` para UX otimista, slider simplificado para o preço, preenchimento de campos de persistência de sessão e feedback visual imersivo de sucesso (modal). Tudo pensado para reduzir cliques no checkout.
- **Acessibilidade (WCAG)**: Foco no alto contraste de texto nas tags (badges) informativas, labels de `aria-live` para inputs de formulário inválidos e navegação correta por teclado e leitores de tela.
