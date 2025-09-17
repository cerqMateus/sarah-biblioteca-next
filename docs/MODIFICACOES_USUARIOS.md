# Modificações - Sistema de Usuários por Matrícula

## ✅ Modificações Implementadas

### 1. **API de Usuário por Matrícula** (`/api/usuarios/[matricula]`)

- **Arquivo:** `src/app/api/usuarios/[matricula]/route.ts`
- **Funcionalidade:** Endpoint GET para buscar usuário por matrícula
- **Validação:** Verifica se matrícula é um número válido
- **Retorna:** Dados do usuário (nome, matrícula, ramal, setor)
- **Erro:** 404 se usuário não encontrado, 400 para matrícula inválida

### 2. **API de Reservas Modificada** (`/api/reservas`)

- **Arquivo:** `src/app/api/reservas/route.ts`
- **Modificação:** Removida a criação automática de usuários
- **Validação:** Verifica se o usuário existe antes de criar reserva
- **Erro:** Retorna erro 400 se usuário não for encontrado

### 3. **Hook useUsuario**

- **Arquivo:** `src/hooks/useUsuario.ts`
- **Funcionalidade:** Hook personalizado para buscar usuário por matrícula
- **Features:** Loading, error handling, busca automática, limpeza de dados
- **Interface:** Define tipo Usuario com todos os campos

### 4. **Hook useReservas Atualizado**

- **Arquivo:** `src/hooks/useReservas.ts`
- **Modificação:** Campos nome e ramal agora são opcionais na interface
- **Flexibilidade:** Permite criação de reserva sem passar nome/ramal explicitamente

### 5. **NovaReservaDialog Completamente Refatorado**

- **Arquivo:** `src/app/reservas/components/NovaReservaDialog.tsx`
- **Campos Nome e Ramal:** Agora são readonly (somente leitura)
- **Busca Automática:** Busca usuário automaticamente ao digitar matrícula (3+ dígitos)
- **Preenchimento Automático:** Nome e ramal preenchidos automaticamente
- **Validação Customizada:** Verifica se usuário foi encontrado antes de submeter
- **Feedback Visual:** Mensagens simples de loading e erro abaixo do campo matrícula

## 🔄 Comportamento Atual

### ✅ **Fluxo de Preenchimento:**

1. **Usuário digita matrícula** → Busca automática iniciada (3+ dígitos)
2. **Usuário encontrado** → Nome e ramal preenchidos automaticamente
3. **Feedback visual** → Mensagens de loading/erro aparecem abaixo do campo matrícula
4. **Campos bloqueados** → Nome e ramal ficam readonly (fundo cinza)
5. **Validação final** → Só permite criar reserva se usuário foi encontrado

### ❌ **O que foi removido:**

- Criação automática de usuários
- Campos Nome e Ramal editáveis
- Possibilidade de criar reserva com usuário inexistente

### 🎨 **Melhorias de UX:**

- Placeholder explicativo nos campos
- Estados visuais distintos (loading, erro, sucesso)
- Campos readonly com aparência diferenciada
- Busca automática sem necessidade de botão
- Limpeza automática ao fechar dialog

## 🎯 Validações Implementadas

### **Frontend (NovaReservaDialog):**

- Matrícula obrigatória
- Usuário deve ser encontrado antes de prosseguir
- Validação de campos obrigatórios (data, horários, local)

### **Backend (API):**

- Matrícula deve ser número válido
- Usuário deve existir no banco de dados
- Sala deve existir e estar disponível
- Validação de conflitos de horário

## 🧪 Como Testar

### 1. **Testar Busca de Usuário:**

```
1. Abrir dialog "Nova Reserva"
2. Digitar matrícula de usuário existente (ex: digite "1" se houver usuário com matrícula 1)
3. Verificar que nome e ramal são preenchidos automaticamente
4. Verificar que campos ficam readonly (fundo cinza)
5. Verificar mensagens de feedback aparecem abaixo do campo matrícula
```

### 2. **Testar Usuário Inexistente:**

```
1. Digitar matrícula que não existe (ex: "99999")
2. Verificar mensagem de erro abaixo do campo matrícula
3. Tentar submeter formulário
4. Verificar que não permite criar reserva
```

### 3. **Testar API Diretamente:**

```bash
# Buscar usuário existente
curl http://localhost:3000/api/usuarios/1

# Buscar usuário inexistente
curl http://localhost:3000/api/usuarios/99999

# Tentar criar reserva com usuário inexistente
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{"matricula":"99999","local":"Sala de Reunião A","data":"2025-08-07","horaInicio":"09:00","horaFim":"10:00"}'
```

## 📊 Endpoints da API

### GET `/api/usuarios/[matricula]`

**Sucesso (200):**

```json
{
  "matricula": 1,
  "name": "João Silva",
  "ramal": "1234",
  "sector": "TI"
}
```

**Usuário não encontrado (404):**

```json
{
  "error": "Usuário não encontrado"
}
```

**Matrícula inválida (400):**

```json
{
  "error": "Matrícula deve ser um número válido"
}
```

### POST `/api/reservas`

**Erro para usuário inexistente:**

```json
{
  "error": "Usuário não encontrado. Verifique a matrícula informada."
}
```

## 🎨 Interface Visual

### **Estados dos Campos:**

#### **Campo Matrícula:**

- **Normal:** Fundo branco, editável
- **Loading:** Feedback "Buscando usuário..."
- **Erro:** Mensagem de erro em vermelho

#### **Campos Nome e Ramal:**

#### **Campos Nome e Ramal:**

- **Vazio:** Placeholder explicativo, fundo cinza claro
- **Preenchido:** Dados do usuário, fundo cinza (readonly)
- **Aparência:** Claramente identificados como não-editáveis

#### **Mensagens de Feedback:**

- **Loading:** "Buscando usuário..." em azul abaixo do campo matrícula
- **Erro:** Mensagem de erro em vermelho abaixo do campo matrícula

## 🚀 Próximos Passos Sugeridos

1. **Cache de Usuários:** Implementar cache local para evitar buscas repetidas
2. **Autocomplete:** Sugerir usuários conforme digitação
3. **Validação de Permissões:** Verificar se usuário pode fazer reservas
4. **Histórico de Reservas:** Mostrar reservas anteriores do usuário
5. **Integração com AD:** Buscar usuários do Active Directory

## 📝 Dados de Exemplo (Seed)

O seed cria 20 usuários com matrículas de 1 a 20. Para testar:

- **Matrícula 1:** João Silva (TI, ramal 1234)
- **Matrícula 2:** Maria Santos (RH, ramal 5678)
- **Matrícula 3:** Pedro Oliveira (Financeiro, ramal 9012)
- etc.

Use qualquer matrícula de 1 a 20 para testar usuários existentes, ou números maiores que 20 para testar usuários inexistentes.
