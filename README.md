# 📊 Controle Pessoal PC

Sistema integrado de controle financeiro pessoal e gestão de loja com sincronização em tempo real.

## ✨ Funcionalidades

### 💰 Controle Financeiro Pessoal
- Registrar receitas e despesas
- Categorizar transações
- Visualizar histórico completo
- Projeção de fluxo de caixa mensal

### 🏪 Controle da Loja
- **Produtos**: Adicionar, editar e remover produtos
- **Vendas**: Registrar vendas com cálculo automático de lucro
- **Estoque**: Controlar quantidade de produtos
- **Análise**: 
  - Valor de compra e venda
  - Margem de lucro (%)
  - Faturamento total
  - Lucro total

### 📈 Dashboard
- Saldo total do mês
- Total recebido (receitas + vendas)
- Total gasto (despesas)
- Calendário com fluxo de caixa diário
- Alertas de dias críticos (saldo negativo)

## 🚀 Como Começar

### 1. Clonar o Repositório
```bash
git clone https://github.com/pclima777/Controle-Pessoal-PC-.git
cd Controle-Pessoal-PC-
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Copie suas credenciais do Firebase
4. Crie arquivo `.env.local` na raiz do projeto (copie de `.env.example`):

```env
VITE_FIREBASE_API_KEY=sua_chave_api
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### 5. Build para Produção
```bash
npm run build
```

## 📤 Deploy no Vercel

### Método 1: Via GitHub (Recomendado)
1. Faça push do seu projeto para GitHub
2. Acesse [Vercel](https://vercel.com)
3. Clique em "New Project"
4. Selecione seu repositório GitHub
5. Vercel detectará que é um projeto Vite
6. Adicione as variáveis de ambiente do Firebase
7. Clique em "Deploy"

### Método 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

## 🔐 Variáveis de Ambiente

**Importante**: Nunca faça commit do arquivo `.env.local`

No Vercel:
1. Vá para Project Settings → Environment Variables
2. Adicione todas as 6 variáveis do Firebase
3. Redeploy o projeto

## 📱 Acessar de Qualquer Computador

Após fazer deploy no Vercel, a aplicação estará disponível em:
```
https://seu-projeto.vercel.app
```

Os dados **sincronizarão automaticamente** entre computadores em tempo real!

## 🛠️ Stack Técnico

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Icons**: Lucide React
- **Date**: date-fns

## 📝 Estrutura do Projeto

```
src/
├── config/
│   └── firebase.js          # Configuração do Firebase
├── hooks/
│   ├── useTransactions.js   # Hook para transações pessoais
│   ├── useProducts.js       # Hook para produtos da loja
│   └── useSales.js          # Hook para vendas da loja
├── pages/
│   ├── Login.jsx            # Página de login/cadastro
│   ├── Dashboard.jsx        # Dashboard principal
│   ├── Transactions.jsx     # Controle financeiro pessoal
│   └── Shop.jsx             # Controle da loja
├── App.jsx                  # Componente principal
└── index.css                # Estilos globais
```

## 🐛 Troubleshooting

**Erro: "Firebase config not found"**
- Certifique-se de que o arquivo `.env.local` existe
- Verifique se as variáveis estão corretas
- Reinicie o servidor de desenvolvimento

**Dados não sincronizam**
- Verifique sua conexão com internet
- Confirme que o Firebase está configurado corretamente
- Verifique as regras do Firestore (deve estar em teste por enquanto)

**Erro de autenticação**
- No Firebase Console, vá para Authentication
- Ative "Email/Password" como método de autenticação

**Erro de permissão no Firestore**
- No Firebase Console, vá para Firestore Database → Rules
- Use as regras padrão de teste (descomente se necessário)

## 💡 Dicas

- Salve regularmente suas transações
- Faça backup dos seus dados
- Use senhas fortes para sua conta
- Revisione seu fluxo de caixa mensalmente

## 📞 Suporte

Para dúvidas, abra uma issue no GitHub.

## 📄 Licença

MIT

---

**Feito com ❤️ para gerenciar sua vida financeira e sua loja**
