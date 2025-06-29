# Sistema de Pet Shop - Projeto ADS

Este projeto é um sistema completo para gerenciamento de um Pet Shop, desenvolvido para a disciplina de Programação Orientada a Objetos. Ele permite o cadastro e controle de clientes, pets, produtos, serviços e vendas, com interface web moderna e API RESTful.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
  - [1. Backend](#1-backend)
  - [2. Frontend](#2-frontend)
- [Como Usar](#como-usar)
- [Estrutura das Pastas](#estrutura-das-pastas)
- [Dúvidas Frequentes](#dúvidas-frequentes)

---

## Funcionalidades

- Cadastro, edição e exclusão de clientes, com endereço, telefone e CPF.
- Cadastro de pets vinculados aos clientes.
- Cadastro e controle de produtos e serviços.
- Registro de vendas (consumo), vinculando clientes, pets, produtos e serviços.
- Listagem detalhada de vendas, clientes e pets.
- Modal de detalhes para cada entidade.
- Exclusão de vendas com atualização automática da lista.
- Interface responsiva e intuitiva.

---

## Tecnologias Utilizadas

- **Frontend:** React + TypeScript + Bootstrap
- **Backend:** Node.js + Express + (possivelmente SQLite ou outro banco relacional)
- **API RESTful:** Endpoints para clientes, pets, produtos, serviços, vendas, etc.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- (Opcional) [Git](https://git-scm.com/)

---

## Como Rodar o Projeto

### 1. Backend

1. **Acesse a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn
   ```

3. **Configure o banco de dados (se necessário):**
   - O projeto pode já criar o banco automaticamente ao rodar.
   - Se houver arquivo `.env.example`, copie para `.env` e ajuste as variáveis.

4. **Inicie o servidor:**
   ```bash
   npm start
   ```
   ou
   ```bash
   yarn start
   ```

5. **A API estará disponível em:**  
   [http://localhost:3001/api](http://localhost:3001/api)

---

### 2. Frontend

1. **Acesse a pasta do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   ou
   ```bash
   yarn start
   ```

4. **Acesse o sistema no navegador:**  
   [http://localhost:3000](http://localhost:3000)

---

## Como Usar

1. **Clientes:**  
   Cadastre clientes com nome, nome social, email, telefone, CPF e endereço.  
   Edite ou exclua clientes conforme necessário.  
   Veja detalhes completos no modal, incluindo pets vinculados.

2. **Pets:**  
   Cadastre pets vinculados a clientes.  
   Edite ou exclua pets.

3. **Produtos e Serviços:**  
   Cadastre e gerencie produtos e serviços oferecidos pelo pet shop.

4. **Vendas (Consumo):**  
   Registre vendas, selecionando cliente, pet, produtos e/ou serviços.  
   Veja o histórico de vendas, detalhes e exclua vendas se necessário.

5. **Detalhes:**  
   Use os botões de "Ver Detalhes" para visualizar informações completas de clientes, pets e vendas.

---

## Estrutura das Pastas

```
T5/
├── backend/
│   ├── src/
│   ├── API_DOCUMENTATION.md
│   └── ...
├── frontend/
│   ├── src/
│   └── ...
└── README.md
```

---

## Dúvidas Frequentes

**1. O backend não inicia, o que fazer?**  
Verifique se as dependências estão instaladas e se a porta 3001 está livre.

**2. O frontend não conecta ao backend.**  
Confirme que o backend está rodando em `http://localhost:3001/api` e que não há bloqueio de CORS.

**3. Como resetar o banco de dados?**  
Apague o arquivo do banco (ex: `database.sqlite`) na pasta do backend e reinicie o servidor.

**4. Como cadastrar um cliente com telefone, CPF e endereço?**  
Preencha todos os campos obrigatórios no formulário de cadastro de cliente.

---

## Contribuição

Este projeto é acadêmico, mas sugestões e melhorias são bem-vindas!

---

**Desenvolvido para a disciplina de Programação Orientada a Objetos - FATEC.**
