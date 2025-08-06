# Sistema de Reservas Sarah - Biblioteca

Sistema de reservas de salas para biblioteca desenvolvido com Next.js, Prisma e PostgreSQL.

## ✨ Funcionalidades Implementadas

### ✅ Nova Funcionalidade: Criação de Reservas

- **Dialog de Nova Reserva**: Interface intuitiva para criar reservas
- **Validação de Formulário**: Validação completa dos dados usando Zod
- **Verificação de Conflitos**: Sistema que impede reservas conflitantes
- **Notificações**: Sistema de toast para feedback ao usuário
- **API REST**: Endpoints para criação e listagem de reservas

### 📋 Campos do Formulário de Reserva

- **Nome**: Nome do usuário
- **Matrícula**: Número de matrícula (criará usuário se não existir)
- **Ramal**: Número do ramal de contato
- **Local**: Nome da sala (criará sala se não existir)
- **Data**: Data da reserva
- **Hora de Início**: Horário de início da reserva
- **Hora de Fim**: Horário de fim da reserva

### 🔧 Validações Implementadas

- Todos os campos são obrigatórios
- Hora de fim deve ser posterior à hora de início
- Verificação de conflitos de horário para a mesma sala
- Validação de formato de dados

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

### 1. Configuração do Banco de Dados

1. Crie um banco PostgreSQL
2. Configure a variável de ambiente `DATABASE_URL` no arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/sarah_biblioteca"
```

### 2. Instalação e Configuração

```bash
# Instalar dependências
npm install

# Gerar o cliente Prisma
npx prisma generate

# Executar migrações do banco
npx prisma migrate dev

# Popular o banco com dados de exemplo (opcional)
npm run db:seed
```

### 3. Executar o Projeto

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm run start
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura dos Arquivos Criados/Modificados

### API Routes

- `src/app/api/reservas/route.ts` - Endpoints para CRUD de reservas

### Componentes

- `src/app/reservas/components/NovaReservaDialog.tsx` - Dialog para criar reservas (ATUALIZADO)
- `src/app/reservas/components/ReservaSidebarContent.tsx` - Conteúdo da sidebar (ATUALIZADO)
- `src/components/Toast.tsx` - Sistema de notificações (NOVO)

### Hooks

- `src/hooks/useReservas.ts` - Hook personalizado para gerenciar reservas (NOVO)

### Utilitários

- `src/lib/utils.ts` - Funções de formatação de data/hora (ATUALIZADO)

### Layout

- `src/app/layout.tsx` - Layout principal com ToastProvider (ATUALIZADO)

## 🧪 Como Testar a Funcionalidade

### 1. Acessar a Página de Reservas

- Navegue para `/reservas`
- Você verá a interface com sidebar e área principal

### 2. Criar uma Nova Reserva

1. Clique no botão "Criar nova reserva" na sidebar
2. Preencha todos os campos:
   - Nome: ex: "João Silva"
   - Matrícula: ex: "12345"
   - Ramal: ex: "1234"
   - Local: ex: "Sala A"
   - Data: selecione uma data
   - Hora de Início: ex: "09:00"
   - Hora de Fim: ex: "10:00"
3. Clique em "Confirmar"

### 3. Verificar a Reserva

- A reserva aparecerá na lista da sidebar
- Uma notificação de sucesso será exibida
- O dialog será fechado automaticamente

### 4. Testar Validações

- Tente criar uma reserva com campos vazios
- Tente criar uma reserva com hora de fim anterior à hora de início
- Tente criar uma reserva conflitante (mesmo local, data e horário sobreposto)

## 🌱 Dados de Exemplo

O comando `npm run db:seed` cria:

- 20 usuários de exemplo
- 3 salas (Sala de Reunião A, Sala de Conferência B, Auditório)
- Recursos para cada sala (projetor, ar condicionado, etc.)

## 🔗 Endpoints da API

### POST `/api/reservas`

Cria uma nova reserva

**Body:**

```json
{
  "nome": "João Silva",
  "matricula": "12345",
  "ramal": "1234",
  "local": "Sala A",
  "data": "2025-08-07",
  "horaInicio": "09:00",
  "horaFim": "10:00"
}
```

### GET `/api/reservas`

Lista todas as reservas

## 🛠 Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zod** - Validação de esquemas
- **Radix UI** - Componentes de UI

## 📝 Notas Técnicas

- O sistema cria automaticamente usuários e salas se não existirem
- Reservas conflitantes são impedidas pelo sistema
- Todas as operações são tipadas com TypeScript
- Interface responsiva e acessível
- Sistema de notificações não-intrusivo
