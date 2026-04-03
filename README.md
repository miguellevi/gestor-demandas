# Gestor de Demandas

Sistema de gestão de demandas para vereadores, com autenticação via Supabase e deploy no Vercel.

---

## 📁 Estrutura do Projeto

```
gestor-demandas/
├── api/
│   └── config.js        ← Serverless function que expõe as env vars
├── public/
│   └── index.html       ← Aplicação completa
├── vercel.json          ← Configuração do Vercel
└── README.md
```

---

## 🚀 Deploy no Vercel

### 1. Suba o projeto no GitHub

```bash
git init
git add .
git commit -m "Gestor de Demandas v1"
git remote add origin https://github.com/SEU_USUARIO/gestor-demandas.git
git push -u origin main
```

### 2. Importe no Vercel

1. Acesse [vercel.com](https://vercel.com) → **Add New Project**
2. Conecte o GitHub e selecione este repositório
3. Clique em **Deploy** (sem alterar nenhuma configuração de build)

### 3. Configure as variáveis de ambiente

No painel do Vercel, vá em:
**Project → Settings → Environment Variables**

Adicione as duas variáveis:

| Nome | Valor |
|------|-------|
| `SUPABASE_URL` | `https://xxxxxxxxxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

> Encontre esses valores em: **Supabase → Project Settings → API**

### 4. Redeploy

Após adicionar as variáveis, clique em **Redeploy** para aplicar.

---

## 🗄️ Tabelas no Supabase

Execute no **SQL Editor** do Supabase:

```sql
-- Tabela de demandas
create table demandas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users,
  categoria text not null,
  titulo text not null,
  cidadao text not null,
  lideranca text,
  localidade text,
  telefone text,
  endereco text,
  prioridade text default 'Média',
  status text default 'Aberta',
  obs text
);

-- Tabela de lideranças
create table liderancas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users,
  nome text unique not null
);

-- Tabela de localidades
create table localidades (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users,
  nome text unique not null
);

-- Habilitar RLS (Row Level Security)
alter table demandas   enable row level security;
alter table liderancas enable row level security;
alter table localidades enable row level security;

-- Policies: usuários autenticados têm acesso total
create policy "Autenticados podem tudo em demandas"
  on demandas for all using (auth.role() = 'authenticated');

create policy "Autenticados podem tudo em liderancas"
  on liderancas for all using (auth.role() = 'authenticated');

create policy "Autenticados podem tudo em localidades"
  on localidades for all using (auth.role() = 'authenticated');
```

---

## 👤 Criar usuários

No Supabase, vá em **Authentication → Users → Add user** e crie os usuários que terão acesso ao sistema.

---

## ✅ Como funciona a integração

1. O Vercel hospeda o `index.html` como site estático
2. A rota `/api/config` é uma Serverless Function que lê as variáveis de ambiente e as envia ao browser de forma segura
3. O browser inicializa o Supabase com essas credenciais
4. Todo o tráfego de dados vai diretamente do browser → Supabase (sem passar pelo Vercel)
