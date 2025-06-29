# Pet Shop Management System (C4P)

Sistema de gerenciamento para pet shops desenvolvido em React com TypeScript, Bootstrap e Vite.

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 🔧 Instalação`

**Instale as dependências**
   ```bash
   npm install
   ```
   
   ou se preferir usar yarn:
   ```bash
   yarn install
   ```

## 🏃‍♂️ Executando o Projeto

### Modo de Desenvolvimento

Para iniciar o servidor de desenvolvimento, você pode usar qualquer um dos comandos abaixo:

```bash
npm start
```

ou

```bash
npm run dev
```

ou se preferir yarn:

```bash
yarn start
```

O aplicativo estará disponível em [http://localhost:5173](http://localhost:5173)

### Build para Produção

Para criar uma build otimizada para produção:

```bash
npm run build
```

### Preview da Build

Para visualizar a build de produção localmente:

```bash
npm run preview
```

### Linting

Para executar o linter e verificar problemas no código:

```bash
npm run lint
```
## 📋 Funcionalidades

- **Gestão de Clientes**: Cadastro, visualização e busca de clientes
- **Gestão de Pets**: Registro de pets com informações do dono
- **Gestão de Produtos**: Controle de estoque e preços de produtos
- **Gestão de Serviços**: Cadastro de serviços oferecidos (banho, tosa, consultas, etc.)
- **Controle de Vendas**: Registro e acompanhamento de vendas
- **Estatísticas**: Dashboard com métricas e relatórios do negócio

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **Bootstrap 5.3** - Framework CSS para estilização
- **Bootstrap Icons** - Biblioteca de ícones
- **React Router DOM** - Roteamento para aplicações React

## 📁 Estrutura do Projeto

```
atvii/
├── src/
│   ├── components/          # Componentes React
│   │   ├── clientes.tsx     # Gestão de clientes
│   │   ├── pets.tsx         # Gestão de pets
│   │   ├── produtos.tsx     # Gestão de produtos
│   │   ├── servicos.tsx     # Gestão de serviços
│   │   ├── lista-vendas.tsx # Controle de vendas
│   │   ├── estatisticas.tsx # Dashboard de estatísticas
│   │   └── home.tsx         # Página inicial
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Ponto de entrada
│   └── index.css            # Estilos globais
├── public/                  # Arquivos públicos
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração TypeScript
├── vite.config.ts           # Configuração Vite
└── README.md                # Este arquivo
```

## 🎨 Estilização

O projeto utiliza **Bootstrap 5.3** para estilização, proporcionando:

- Design responsivo
- Componentes pré-estilizados
- Sistema de grid flexível
- Tema escuro personalizado
- Ícones do Bootstrap Icons

## 🔄 Funcionalidades Principais

### Dashboard Principal
- Visão geral com estatísticas resumidas
- Navegação rápida para todas as seções
- Cards informativos com métricas importantes

### Gestão de Clientes
- Cadastro de novos clientes
- Busca por nome
- Visualização de detalhes em modal
- Informações: nome, email, telefone, CPF, observações

### Gestão de Pets
- Registro de pets vinculados aos donos
- Informações: nome, espécie, dono, observações
- Busca por nome do pet

### Gestão de Produtos
- Controle de estoque
- Categorização (alimentação, higiene, acessórios)
- Preços e quantidades
- Edição inline via modal

### Gestão de Serviços
- Cadastro de serviços oferecidos
- Categorias: higiene, saúde, hospedagem, treinamento, bem-estar
- Informações de preço e duração
- Sistema de edição completo

### Controle de Vendas
- Registro de vendas com múltiplos itens
- Seleção de cliente e forma de pagamento
- Cálculo automático de totais
- Histórico de vendas

### Estatísticas
- Top clientes por quantidade e valor
- Itens mais consumidos
- Análise por tipo e raça de pet
- Métricas para tomada de decisão

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build para produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa verificação de código