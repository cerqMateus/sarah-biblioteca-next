# Sistema de Autenticação SARAH

## Visão Geral

Sistema de autenticação simples baseado em matrícula do usuário. Controla o acesso às páginas principais do sistema (Home, Reservas e Consultas).

## Componentes Implementados

### 1. **AuthContext** (`src/contexts/AuthContext.tsx`)

- **Propósito**: Gerencia o estado global de autenticação
- **Funcionalidades**:
  - Login por matrícula
  - Logout com limpeza da sessão
  - Persistência da sessão no localStorage
  - Estado de loading
- **Interface do Usuário**:
  ```typescript
  interface User {
    matricula: number;
    name: string;
    ramal: string;
  }
  ```

### 2. **Página de Login** (`src/app/login/page.tsx`)

- **Propósito**: Interface de autenticação
- **Funcionalidades**:
  - Campo para entrada da matrícula
  - Validação de entrada
  - Feedback de erro
  - Redirecionamento após login bem-sucedido
- **Validações**:
  - Campo obrigatório
  - Verificação se usuário existe no banco
  - Mensagens de erro amigáveis

### 3. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)

- **Propósito**: Protege rotas que requerem autenticação
- **Funcionalidades**:
  - Verifica se usuário está logado
  - Redireciona para login se não autenticado
  - Mostra loading durante verificação
  - Wrapper para páginas protegidas

### 4. **PublicOnlyRoute** (`src/components/PublicOnlyRoute.tsx`)

- **Propósito**: Impede acesso à página de login quando já autenticado
- **Funcionalidades**:
  - Verifica se usuário está logado
  - Redireciona para home se já autenticado
  - Mostra loading durante verificação
  - Wrapper para página de login

### 5. **TopBar Atualizada** (`src/components/TopBar.jsx`)

- **Propósito**: Exibe informações dinâmicas do usuário
- **Funcionalidades**:
  - Mostra matrícula e nome do usuário logado
  - **Menu dropdown** ao clicar no ícone de usuário
  - **Opção "Sair"** no menu para logout seguro
  - **Fechamento automático** do menu ao clicar fora
  - Dados obtidos do contexto de autenticação

### 6. **API de Usuários** (`src/app/api/usuarios/route.ts`)

- **Propósito**: Endpoint para buscar usuário por matrícula
- **Endpoint**: `GET /api/usuarios?matricula=XXXXX`
- **Resposta**:
  ```json
  {
    "matricula": 20221301,
    "name": "Mateus Cerqueira",
    "ramal": "1234"
  }
  ```

## Fluxo de Autenticação

### 1. **Acesso Inicial**

1. Usuário tenta acessar qualquer página protegida
2. `ProtectedRoute` verifica se há sessão ativa
3. Se não há sessão, redireciona para `/login`

### 2. **Login**

1. Usuário insere matrícula na página de login
2. Sistema valida se matrícula existe no banco
3. Se válida, cria sessão e armazena no localStorage
4. Redireciona para página inicial

### 3. **Navegação Autenticada**

1. Todas as páginas protegidas verificam autenticação
2. TopBar mostra dados do usuário logado
3. Usuário pode navegar livremente

### 4. **Logout**

### 4. **Logout**

1. Usuário clica no ícone de usuário na TopBar
2. Menu dropdown aparece com opção "Sair"
3. Usuário clica em "Sair" para confirmar
4. Sessão é limpa do localStorage
5. Redireciona para página de login

## Páginas Protegidas

Todas as páginas principais agora são protegidas:

- ✅ **Home** (`/`) - Página inicial
- ✅ **Reservas** (`/reservas`) - Sistema de reservas
- ✅ **Consultas** (`/consultas`) - Sistema de consultas

## Persistência de Sessão

- **Método**: localStorage do navegador
- **Chave**: `sarah-user`
- **Conteúdo**: Objeto JSON com dados do usuário
- **Duração**: Até logout manual ou limpeza do localStorage

## Integração com Sistema Existente

### Modificações Realizadas:

1. **Layout Principal**: Adicionado `AuthProvider` wrapper
2. **Páginas**: Envolvidas com `ProtectedRoute`
3. **TopBar**: Dados dinâmicos do usuário
4. **API**: Nova rota para busca de usuários

### Compatibilidade:

- ✅ Sistema de reservas continua funcionando
- ✅ Validações existentes mantidas
- ✅ Hooks existentes (`useReservas`, `useSalas`, `useUsuario`) preservados

## Melhorias Futuras

### Possíveis Implementações:

1. **Timeout de Sessão**: Logout automático após inatividade
2. **Múltiplos Perfis**: Diferentes níveis de acesso (admin, usuário)
3. **Senha**: Adicionar campo de senha para maior segurança
4. **Refresh Token**: Sistema de renovação automática de sessão
5. **Auditoria**: Log de acessos e ações do usuário

## Segurança

### Implementadas:

- ✅ Validação de existência do usuário
- ✅ Proteção de rotas sensíveis
- ✅ Verificação de sessão em todas as páginas

### Considerações:

- 🔸 Sistema atual é baseado apenas em matrícula (sem senha)
- 🔸 Adequado para ambiente controlado/interno
- 🔸 Para produção, considerar autenticação mais robusta

## Testes de Funcionalidade

### Cenários para Testar:

1. **Login Válido**: Matrícula existente no banco
2. **Login Inválido**: Matrícula inexistente
3. **Acesso Direto**: Tentar acessar página protegida sem login
4. **Menu Dropdown**: Clicar no ícone de usuário e verificar menu
5. **Logout**: Selecionar "Sair" no menu dropdown
6. **Fechamento do Menu**: Clicar fora do menu para fechá-lo
7. **Logout**: Verificar limpeza de sessão
8. **Persistência**: Recarregar página e manter sessão
9. **Navegação**: Transição entre páginas protegidas

Data da implementação: Janeiro 2025
