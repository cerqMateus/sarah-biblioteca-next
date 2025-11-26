# 🏥 Sarah Biblioteca - Sistema de Reservas

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.4.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-316192?style=for-the-badge&logo=postgresql)

Sistema completo de gestão de reservas de salas para o Hospital Sarah

[Funcionalidades](#-funcionalidades) • [Tecnologias](#-tecnologias) • [Instalação](#-instalação) • [Arquitetura](#-arquitetura) • [API](#-api-endpoints)

</div>

---

## 📋 Sobre o Projeto

O **Sarah Biblioteca** é um sistema web full-stack desenvolvido para gerenciar reservas de espaços no Hospital Sarah, incluindo salas de reunião, biblioteca e auditório. A aplicação oferece uma interface intuitiva para criação, consulta e gerenciamento de reservas, com validações robustas e sistema de notificações integrado.

### 🎯 Objetivos

- ✅ Facilitar o agendamento de espaços compartilhados
- ✅ Evitar conflitos de horários através de validação em tempo real
- ✅ Fornecer visibilidade sobre disponibilidade de salas
- ✅ Automatizar notificações e lembretes
- ✅ Manter histórico completo de reservas

---

## ✨ Funcionalidades

### 🔐 Autenticação e Usuários

- **Login por matrícula** institucional
- Persistência de sessão com localStorage
- Proteção de rotas privadas
- Preenchimento automático de dados do usuário

### 📅 Sistema de Reservas

#### Criação de Reservas

- Interface com diálogo modal intuitivo
- Seleção de sala disponível
- Calendário interativo para escolha de data
- Horários restritos (até 17:00 para início, até 18:00 para fim)
- **Validação em tempo real** de disponibilidade
- Descrição opcional da reserva
- Preenchimento automático de dados do usuário autenticado

#### Validações Implementadas

- ❌ Não permite reservas em datas passadas
- ❌ Não permite horários conflitantes
- ❌ Não permite reservas fora do horário de funcionamento
- ❌ Valida se a sala está disponível
- ❌ Verifica se o usuário existe no sistema
- ✅ Validação simultânea no frontend e backend

#### Consulta de Reservas

- **Visualização em calendário** customizado
- Filtro por data e sala
- Filtro por tipo: Todas, Ativas, Canceladas, Completadas
- Cards informativos com detalhes da reserva
- Opção de cancelamento de reservas ativas
- Interface responsiva e acessível

### 🔔 Sistema de Notificações

- **Notificações em tempo real** na TopBar
- Tipos de notificação:
  - Reserva criada
  - Reserva cancelada
  - Lembrete 3 dias antes
  - Lembrete 1 dia antes
  - Reserva completada
- Badge visual com contador de não lidas
- Dropdown interativo para visualização
- Marcação de leitura individual ou em massa

### 🧹 Limpeza Automática

- **Auto-cleanup** de reservas expiradas
- Execução automática a cada 5 minutos
- Mudança de status para COMPLETED
- Logging de atividades no console

---

## 🛠 Tecnologias

### Frontend

| Tecnologia           | Versão  | Descrição                                |
| -------------------- | ------- | ---------------------------------------- |
| **Next.js**          | 15.4.3  | Framework React com SSR e API Routes     |
| **React**            | 19.1.0  | Biblioteca para construção de interfaces |
| **TypeScript**       | 5.x     | Superset JavaScript com tipagem estática |
| **TailwindCSS**      | 4.1.11  | Framework CSS utility-first              |
| **Radix UI**         | -       | Componentes acessíveis e customizáveis   |
| **Lucide React**     | 0.525.0 | Biblioteca de ícones moderna             |
| **date-fns**         | 3.6.0   | Manipulação e formatação de datas        |
| **React Day Picker** | 9.8.1   | Componente de calendário customizável    |
| **Zod**              | 4.0.5   | Validação de schemas TypeScript-first    |

### Backend

| Tecnologia             | Versão | Descrição                             |
| ---------------------- | ------ | ------------------------------------- |
| **Prisma**             | 6.13.0 | ORM moderno para Node.js e TypeScript |
| **PostgreSQL**         | -      | Banco de dados relacional robusto     |
| **Next.js API Routes** | 15.4.3 | Backend serverless integrado          |

### Testes

| Tecnologia               | Versão | Descrição                    |
| ------------------------ | ------ | ---------------------------- |
| **Cypress**              | 15.2.0 | Framework E2E de testes      |
| **Mochawesome Reporter** | 4.0.2  | Relatórios de testes visuais |
| **Mocha JUnit Reporter** | 2.2.1  | Relatórios em formato JUnit  |

### Ferramentas de Desenvolvimento

- **ESLint** - Linter para qualidade de código
- **Autoprefixer** - Prefixos CSS automáticos
- **TSX** - TypeScript executor para scripts

---

## 📦 Instalação

### Pré-requisitos

- Node.js 20.x ou superior
- PostgreSQL 14.x ou superior
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/cerqMateus/sarah-biblioteca-next.git
cd sarah-biblioteca-next
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/sarah_biblioteca"
```

4. **Execute as migrações do banco de dados**

```bash
npx prisma migrate dev
```

5. **Popule o banco com dados iniciais (seed)**

```bash
npm run db:seed
```

6. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

7. **Acesse a aplicação**

Abra [http://localhost:3000](http://localhost:3000) no navegador

---

## 🏗 Arquitetura

### Estrutura de Diretórios

```
sarah-biblioteca-next/
├── prisma/
│   ├── schema.prisma          # Modelos de dados
│   ├── seed.ts                # Script de população do banco
│   └── migrations/            # Histórico de migrações
├── src/
│   ├── app/
│   │   ├── api/               # API Routes (Backend)
│   │   │   ├── reservas/      # CRUD de reservas
│   │   │   ├── salas/         # Consulta de salas
│   │   │   ├── usuarios/      # Gestão de usuários
│   │   │   └── notifications/ # Sistema de notificações
│   │   ├── reservas/          # Página de criação de reservas
│   │   │   └── components/    # Componentes da página
│   │   ├── consultas/         # Página de consulta de reservas
│   │   │   └── components/    # Calendário e filtros
│   │   ├── login/             # Página de autenticação
│   │   └── components/        # Componentes compartilhados
│   ├── components/
│   │   ├── ui/                # Componentes base (shadcn/ui)
│   │   ├── ProtectedRoute.tsx # HOC para rotas protegidas
│   │   ├── TopBar.tsx         # Barra superior com notificações
│   │   └── NotificationDropdown.tsx
│   ├── contexts/              # Contextos React
│   │   ├── AuthContext.tsx    # Autenticação global
│   │   ├── ReservasContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/                 # Custom Hooks
│   │   ├── useReservas.ts
│   │   ├── useSalas.ts
│   │   ├── useAvailabilityCheck.ts
│   │   ├── useNotifications.ts
│   │   └── useAutoCleanupExpiredReservations.ts
│   ├── lib/
│   │   ├── utils.ts           # Funções utilitárias
│   │   └── notificationService.ts
│   └── generated/
│       └── prisma/            # Cliente Prisma gerado
├── cypress/                   # Testes E2E
│   ├── e2e/
│   ├── fixtures/
│   └── reports/
├── docs/                      # Documentação técnica
└── public/                    # Arquivos estáticos
```

### 🗄️ Modelo de Dados

```prisma
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│     User     │         │     Room     │         │ Reservation  │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ matricula PK │────┐    │ id PK        │────┐    │ id PK        │
│ name         │    │    │ name         │    │    │ userId FK    │
│ sector       │    │    │ capacity     │    │    │ roomId FK    │
│ ramal        │    │    │ isAvailable  │    │    │ startDateTime│
│ createdAt    │    │    │ createdAt    │    │    │ endDateTime  │
│ updatedAt    │    │    │ updatedAt    │    │    │ status       │
└──────────────┘    │    └──────────────┘    │    │ createdAt    │
                    │                        │    │ updatedAt    │
                    │    ┌──────────────┐    │    └──────────────┘
                    │    │ RoomResource │    │            │
                    │    ├──────────────┤    │            │
                    │    │ id PK        │    │            │
                    │    │ name         │    │            │
                    │    │ type         │    │            │
                    │    │ roomId FK    │────┘            │
                    │    │ createdAt    │                 │
                    │    │ updatedAt    │                 │
                    │    └──────────────┘                 │
                    │                                     │
                    │    ┌──────────────┐                │
                    └────│ Notification │────────────────┘
                         ├──────────────┤
                         │ id PK        │
                         │ userId FK    │
                         │ reservationId│
                         │ title        │
                         │ message      │
                         │ type         │
                         │ isRead       │
                         │ createdAt    │
                         │ updatedAt    │
                         └──────────────┘
```

#### Enums

```typescript
enum ReservationStatus {
  ACTIVE      // Reserva ativa
  CANCELLED   // Cancelada pelo usuário
  COMPLETED   // Finalizada automaticamente
}

enum NotificationType {
  RESERVATION_CREATED           // Nova reserva criada
  RESERVATION_CANCELLED         // Reserva cancelada
  RESERVATION_REMINDER_3_DAYS   // Lembrete 3 dias antes
  RESERVATION_REMINDER_1_DAY    // Lembrete 1 dia antes
  RESERVATION_COMPLETED         // Reserva finalizada
}
```

---

## 🌐 API Endpoints

### 🔐 Autenticação

#### `GET /api/usuarios?matricula={matricula}`

Busca usuário por matrícula para login

**Response:**

```json
{
  "matricula": 12345,
  "name": "João Silva",
  "ramal": "1234"
}
```

### 📅 Reservas

#### `POST /api/reservas`

Cria uma nova reserva

**Request Body:**

```json
{
  "nome": "João Silva",
  "matricula": "12345",
  "ramal": "1234",
  "local": "Sala de Reunião 1",
  "data": "2025-11-27",
  "horaInicio": "14:00",
  "horaFim": "16:00"
}
```

**Validações:**

- Data >= hoje
- Hora início <= 17:00
- Hora fim <= 18:00
- Hora fim > hora início
- Sem conflitos de horário
- Usuário existe
- Sala existe e está disponível

**Response:**

```json
{
  "id": 1,
  "userId": 12345,
  "roomId": 1,
  "startDateTime": "2025-11-27T14:00:00Z",
  "endDateTime": "2025-11-27T16:00:00Z",
  "status": "ACTIVE",
  "createdAt": "2025-11-26T10:00:00Z"
}
```

#### `GET /api/reservas?matricula={matricula}`

Lista reservas do usuário

**Query Params:**

- `matricula` (obrigatório)

#### `GET /api/reservas/consulta?data={data}&local={local}&status={status}`

Consulta reservas com filtros

**Query Params:**

- `data` (opcional) - Formato: YYYY-MM-DD
- `local` (opcional) - Nome da sala
- `status` (opcional) - ACTIVE, CANCELLED, COMPLETED

#### `GET /api/reservas/check-availability`

Verifica disponibilidade de sala

**Query Params:**

- `roomId` (obrigatório)
- `startDateTime` (obrigatório) - ISO 8601
- `endDateTime` (obrigatório) - ISO 8601
- `excludeReservationId` (opcional)

**Response:**

```json
{
  "available": true,
  "conflicts": []
}
```

#### `DELETE /api/reservas/[id]`

Cancela uma reserva

#### `POST /api/reservas/cleanup-expired`

Limpa reservas expiradas (executado automaticamente)

### 🏢 Salas

#### `GET /api/salas`

Lista todas as salas disponíveis

**Response:**

```json
[
  {
    "id": 1,
    "name": "Sala de Reunião 1",
    "capacity": 10,
    "isAvailable": true,
    "resources": [
      {
        "id": 1,
        "name": "Projetor",
        "type": "Equipamento"
      }
    ]
  }
]
```

### 🔔 Notificações

#### `GET /api/notifications?userId={userId}`

Lista notificações do usuário

**Query Params:**

- `userId` (obrigatório)
- `unreadOnly` (opcional) - boolean

#### `PATCH /api/notifications`

Marca notificações como lidas

**Request Body:**

```json
{
  "notificationIds": [1, 2, 3]
}
```

#### `DELETE /api/notifications/[id]`

Deleta uma notificação

---

## 🎨 Componentes Principais

### NovaReservaDialog

Modal completo para criação de reservas com validação em tempo real.

**Features:**

- Formulário com validação Zod
- Verificação automática de disponibilidade
- Feedback visual de erros
- Preenchimento automático de dados do usuário
- Mensagens de sucesso/erro

### CalendarComponent

Calendário customizado para visualização de reservas.

**Features:**

- Navegação entre meses
- Destaque de dias com reservas
- Integração com react-day-picker
- Estilização com TailwindCSS

### NotificationDropdown

Dropdown de notificações na TopBar.

**Features:**

- Badge com contador de não lidas
- Lista de notificações em tempo real
- Marcação de leitura
- Animações e transições suaves

### ReservaCard

Card informativo de reserva.

**Features:**

- Dados da reserva formatados
- Indicador de status visual
- Botão de cancelamento
- Design responsivo

---

## 🧪 Testes

### Executar Testes E2E

```bash
# Interface interativa
npx cypress open

# Modo headless
npx cypress run
```

### Relatórios

Os relatórios são gerados automaticamente em:

- **HTML:** `cypress/reports/html/index.html`
- **JUnit XML:** `cypress/reports/junit/`

### Cobertura de Testes

- ✅ Fluxo de login
- ✅ Criação de reservas
- ✅ Validações de formulário
- ✅ Consulta de reservas
- ✅ Cancelamento de reservas

---

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (porta 3000)

# Build
npm run build        # Compila para produção

# Produção
npm run start        # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Executa ESLint

# Banco de Dados
npm run db:seed      # Popula banco com dados iniciais
npx prisma studio    # Interface visual do banco
npx prisma migrate dev  # Cria nova migração
npx prisma generate  # Gera cliente Prisma
```

---

## 📚 Documentação Adicional

O projeto inclui documentação técnica detalhada em `/docs`:

- **DOCUMENTACAO.md** - Visão geral técnica do sistema
- **FUNCIONALIDADE_RESERVAS.md** - Detalhes do sistema de reservas
- **SISTEMA_AUTENTICACAO.md** - Fluxo de autenticação
- **MODIFICACOES_SALAS.md** - Gestão de salas
- **MODIFICACOES_USUARIOS.md** - Gestão de usuários
- **VALIDACAO_DATA.md** - Regras de validação de datas
- **OTIMIZACAO_DIALOG.md** - Otimizações de performance
- **RESET_DIALOG.md** - Reset de formulários
- **RESERVAS_COM_SESSAO.md** - Integração com autenticação

---

## 🔒 Segurança

- ✅ Validação de dados no frontend e backend
- ✅ Proteção de rotas com ProtectedRoute
- ✅ Sanitização de inputs
- ✅ Uso de prepared statements (Prisma)
- ✅ CORS configurado
- ✅ Variáveis de ambiente para dados sensíveis

---

## 🌟 Melhorias Futuras

- [ ] Implementar autenticação JWT
- [ ] Adicionar suporte a recorrência de reservas
- [ ] Sistema de aprovação de reservas
- [ ] Exportação de relatórios em PDF
- [ ] Integração com calendário externo (Google Calendar, Outlook)
- [ ] Notificações push via service workers
- [ ] Dashboard administrativo
- [ ] Histórico de auditoria completo
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] Tema claro/escuro

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para novas funcionalidades
- Siga as convenções do ESLint configurado
- Adicione testes para novas features
- Documente mudanças significativas

---

## 📄 Licença

Este projeto é de uso interno do Hospital Sarah.

---

## 👤 Autor

**Mateus Cerqueira**

- GitHub: [@cerqMateus](https://github.com/cerqMateus)
- LinkedIn: [Mateus Cerqueira](https://linkedin.com/in/mateus-cerqueira)

---

## 🙏 Agradecimentos

- Hospital Sarah pela oportunidade de desenvolvimento
- Comunidade Next.js e React
- Todos os contribuidores do projeto

---

<div align="center">

**[⬆ Voltar ao topo](#-sarah-biblioteca---sistema-de-reservas)**

Feito com ❤️ por [Mateus Cerqueira](https://github.com/cerqMateus)

</div>
