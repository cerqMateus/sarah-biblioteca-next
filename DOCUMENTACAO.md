# Documentação Técnica: Sistema de Reservas Sarah Biblioteca

## Visão Geral

Este sistema é uma aplicação web desenvolvida com Next.js 15, React 19, TypeScript e Prisma ORM, destinada à gestão de reservas de salas na biblioteca Sarah. O sistema contempla autenticação de usuários, criação e consulta de reservas, validações de negócio, e um sistema de notificações planejado.

---

## Estrutura do Projeto

- **Frontend:** Next.js (React, TypeScript)
- **Backend:** API Routes do Next.js
- **Banco de Dados:** Prisma ORM (PostgreSQL)
- **Validação:** Zod
- **Notificações:** Planejado (modelo no Prisma, lógica em desenvolvimento)

### Principais Diretórios e Arquivos

- `src/app/`
  - `reservas/`: Fluxo de criação de reservas
    - `components/NovaReservaDialog.tsx`: Diálogo para criar reservas, com validações visuais e regras de negócio
    - `components/ReservaFormContent.tsx`, `ReservaSidebarContent.tsx`: Componentes auxiliares
    - `page.tsx`: Página principal de reservas
  - `consultas/`: Consulta de reservas
    - `components/CalendarComponent.tsx`: Calendário customizado para visualização
    - `page.tsx`: Página de consulta
  - `api/`
    - `reservas/route.ts`: API para criação/listagem de reservas, validações de data/hora
    - `usuarios/[matricula]/route.ts`: API para consulta de usuário
    - `notifications/[id]/route.ts`: (Planejado) API para notificações
  - `components/TopBar.jsx`: Ícone de notificações
  - `components/ui/`: Componentes de UI customizados (button, dialog, calendar)
  - `contexts/`: Contextos globais (Auth, Reservas)
  - `hooks/`: Hooks customizados (useReservas, useSalas, useAvailabilityCheck)
  - `lib/utils.ts`: Funções utilitárias
- `prisma/`
  - `schema.prisma`: Modelos de dados (Reserva, Usuário, Notificação)
  - `seed.ts`: Script de seed para popular o banco
  - `migrations/`: Histórico de migrações

---

## Funcionalidades

### 1. Autenticação

- Usuário autenticado via contexto (`useAuth`)
- Dados do usuário (nome, matrícula, ramal) são preenchidos automaticamente no formulário de reserva

### 2. Reservas

- Criação de reservas via `NovaReservaDialog.tsx`
  - Horário de início: até 17:00
  - Horário de fim: até 18:00
  - Validação visual e backend para garantir regras de negócio
  - Não permite reservas em datas anteriores à atual
  - Verificação de disponibilidade em tempo real
- Consulta de reservas via calendário customizado
- Backend valida todos os campos e regras antes de persistir

### 3. Notificações (Planejado)

- Modelo de notificação definido no Prisma
- Lógica de envio e exibição em desenvolvimento
- Ícone de notificações na TopBar

### 4. Validações

- Zod para validação de formulário
- Backend valida:
  - Data >= hoje
  - Hora de início <= 17:00
  - Hora de fim <= 18:00
  - Hora de fim > hora de início
  - Conflitos de horário (disponibilidade)

---

## Fluxo de Criação de Reserva

1. Usuário abre o diálogo de reserva
2. Seleciona sala, data, horário de início e fim (restritos pelas regras)
3. Sistema verifica disponibilidade automaticamente
4. Usuário confirma; dados são enviados para API
5. Backend valida e persiste reserva
6. Notificação de sucesso ou erro exibida

---

## Manutenção e Extensibilidade

- **Validações:** Centralizadas no backend e frontend para garantir integridade
- **Componentização:** UI modular para fácil manutenção
- **Prisma:** Migrações versionadas; alterações no modelo devem ser refletidas em `schema.prisma` e migradas
- **Notificações:** Estrutura pronta para expansão
- **Hooks e Contextos:** Facilita adição de novas funcionalidades e compartilhamento de estado

---

## Considerações Finais

- Sempre sincronize alterações no modelo Prisma com o banco via migrações
- Teste regras de negócio tanto no frontend quanto no backend
- Para novas funcionalidades, siga o padrão de componentização e hooks/contextos
- Documente endpoints e regras de negócio ao expandir o sistema

---

## Contato

Para dúvidas ou manutenção, consulte o README principal ou entre em contato com o responsável pelo projeto.
