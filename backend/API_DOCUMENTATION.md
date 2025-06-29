# Documentação da API - Sistema de Pet Shop

## Visão Geral
Esta API fornece endpoints para gerenciamento de clientes, pets, serviços e produtos de um pet shop. A API segue o padrão REST e retorna respostas em formato JSON.

## Base URL
```
http://localhost:3001/api
```

## Formato das Respostas
Todas as respostas seguem o seguinte formato:
```json
{
    "success": true/false,
    "data": {}, // Dados retornados em caso de sucesso
    "error": "Mensagem de erro", // Presente apenas em caso de erro
    "message": "Mensagem de sucesso" // Presente apenas em caso de sucesso
}
```

## Endpoints

### Clientes

#### Criar Cliente
```http
POST /clientes
```

**Corpo da Requisição:**
```json
{
    "nome": "string",
    "nome_social": "string", // opcional
    "email": "string"
}
```

**Resposta (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "nome": "string",
        "nome_social": "string",
        "data_cadastro": "date",
        "email": "string"
    },
    "message": "Cliente criado com sucesso"
}
```

#### Listar Todos os Clientes
```http
GET /clientes
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "number",
            "nome": "string",
            "nome_social": "string",
            "data_cadastro": "date",
            "email": "string"
        }
    ]
}
```

#### Buscar Cliente por ID
```http
GET /clientes/:id
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "nome": "string",
        "nome_social": "string",
        "data_cadastro": "date",
        "email": "string",
        "documentos": [
            {
                "id": "number",
                "cliente_id": "number",
                "tipo": "CPF" | "RG",
                "valor": "string",
                "data_emissao": "date"
            }
        ],
        "telefones": [
            {
                "id": "number",
                "cliente_id": "number",
                "ddd": "string",
                "numero": "string"
            }
        ],
        "enderecos": [
            {
                "id": "number",
                "cliente_id": "number",
                "estado": "string",
                "cidade": "string",
                "bairro": "string",
                "rua": "string",
                "numero": "string",
                "complemento": "string",
                "cep": "string"
            }
        ],
        "pets": [
            {
                "id": "number",
                "cliente_id": "number",
                "nome": "string",
                "raca": "string",
                "genero": "M" | "F",
                "tipo": "string"
            }
        ]
    }
}
```

#### Atualizar Cliente
```http
PUT /clientes/:id
```

**Corpo da Requisição:**
```json
{
    "nome": "string", // opcional
    "nome_social": "string", // opcional
    "email": "string" // opcional
}
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "nome": "string",
        "nome_social": "string",
        "data_cadastro": "date",
        "email": "string"
    },
    "message": "Cliente atualizado com sucesso"
}
```

#### Excluir Cliente
```http
DELETE /clientes/:id
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "message": "Cliente excluído com sucesso"
}
```

### Pets

#### Criar Pet
```http
POST /pets
```

**Corpo da Requisição:**
```json
{
    "cliente_id": "number",
    "nome": "string",
    "raca": "string",
    "genero": "M" | "F",
    "tipo": "string"
}
```

**Resposta (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "nome": "string",
        "raca": "string",
        "genero": "M" | "F",
        "tipo": "string"
    },
    "message": "Pet criado com sucesso"
}
```

#### Listar Todos os Pets
```http
GET /pets
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "number",
            "cliente_id": "number",
            "nome": "string",
            "raca": "string",
            "genero": "M" | "F",
            "tipo": "string"
        }
    ]
}
```

#### Buscar Pet por ID
```http
GET /pets/:id
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "nome": "string",
        "raca": "string",
        "genero": "M" | "F",
        "tipo": "string"
    }
}
```

#### Listar Pets de um Cliente
```http
GET /clientes/:clienteId/pets
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "number",
            "cliente_id": "number",
            "nome": "string",
            "raca": "string",
            "genero": "M" | "F",
            "tipo": "string"
        }
    ]
}
```

#### Atualizar Pet
```http
PUT /pets/:id
```

**Corpo da Requisição:**
```json
{
    "nome": "string", // opcional
    "raca": "string", // opcional
    "genero": "M" | "F", // opcional
    "tipo": "string" // opcional
}
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "nome": "string",
        "raca": "string",
        "genero": "M" | "F",
        "tipo": "string"
    },
    "message": "Pet atualizado com sucesso"
}
```

#### Excluir Pet
```http
DELETE /pets/:id
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "message": "Pet excluído com sucesso"
}
```

### Serviços

#### Criar Serviço
```http
POST /servicos
```

**Corpo da Requisição:**
```json
{
    "nome": "string",
    "descricao": "string", // opcional
    "preco": "number",
    "duracao_minutos": "number"
}
```

**Resposta (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "nome": "string",
        "descricao": "string",
        "preco": "number",
        "duracao_minutos": "number"
    },
    "message": "Serviço criado com sucesso"
}
```

#### Listar Todos os Serviços
```http
GET /servicos
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "number",
            "nome": "string",
            "descricao": "string",
            "preco": "number",
            "duracao_minutos": "number"
        }
    ]
}
```

#### Buscar Serviço por ID
```http
GET /servicos/:id
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "nome": "string",
        "descricao": "string",
        "preco": "number",
        "duracao_minutos": "number"
    }
}
```

#### Atualizar Serviço
```http
PUT /servicos/:id
```

**Corpo da Requisição:**
```json
{
    "nome": "string", // opcional
    "descricao": "string", // opcional
    "preco": "number", // opcional
    "duracao_minutos": "number" // opcional
}
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "nome": "string",
        "descricao": "string",
        "preco": "number",
        "duracao_minutos": "number"
    },
    "message": "Serviço atualizado com sucesso"
}
```

#### Excluir Serviço
```http
DELETE /servicos/:id
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "message": "Serviço excluído com sucesso"
}
```

### Produtos

#### Criar Produto
```http
POST /produtos
```

**Corpo da Requisição:**
```json
{
    "nome": "string",
    "descricao": "string", // opcional
    "preco": "number",
    "estoque": "number"
}
```

**Resposta (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "nome": "string",
        "descricao": "string",
        "preco": "number",
        "estoque": "number"
    },
    "message": "Produto criado com sucesso"
}
```

#### Listar Todos os Produtos
```http
GET /produtos
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "number",
            "nome": "string",
            "descricao": "string",
            "preco": "number",
            "estoque": "number"
        }
    ]
}
```

#### Buscar Produto por ID
```http
GET /produtos/:id
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "nome": "string",
        "descricao": "string",
        "preco": "number",
        "estoque": "number"
    }
}
```

#### Atualizar Produto
```http
PUT /produtos/:id
```

**Corpo da Requisição:**
```json
{
    "nome": "string", // opcional
    "descricao": "string", // opcional
    "preco": "number", // opcional
    "estoque": "number" // opcional
}
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "nome": "string",
        "descricao": "string",
        "preco": "number",
        "estoque": "number"
    },
    "message": "Produto atualizado com sucesso"
}
```

#### Atualizar Estoque
```http
PATCH /produtos/:id/estoque
```

**Corpo da Requisição:**
```json
{
    "quantidade": "number" // positivo para adicionar, negativo para remover
}
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "nome": "string",
        "descricao": "string",
        "preco": "number",
        "estoque": "number"
    },
    "message": "Estoque atualizado com sucesso"
}
```

#### Excluir Produto
```http
DELETE /produtos/:id
```

**Resposta (200 OK):**
```json
{
    "success": true,
    "message": "Produto excluído com sucesso"
}
```

### Documentos

#### Criar Documento
```http
POST /documentos
```
**Corpo da Requisição:**
```json
{
    "cliente_id": "number",
    "tipo": "CPF" | "RG",
    "valor": "string",
    "data_emissao": "date"
}
```
**Resposta (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "tipo": "CPF" | "RG",
        "valor": "string",
        "data_emissao": "date"
    },
    "message": "Documento criado com sucesso"
}
```

#### Listar Todos os Documentos
```http
GET /documentos
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "number",
            "cliente_id": "number",
            "tipo": "CPF" | "RG",
            "valor": "string",
            "data_emissao": "date"
        }
    ]
}
```

#### Buscar Documento por ID
```http
GET /documentos/:id
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "tipo": "CPF" | "RG",
        "valor": "string",
        "data_emissao": "date"
    }
}
```

#### Atualizar Documento
```http
PUT /documentos/:id
```
**Corpo da Requisição:**
```json
{
    "tipo": "CPF" | "RG", // opcional
    "valor": "string", // opcional
    "data_emissao": "date" // opcional
}
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "tipo": "CPF" | "RG",
        "valor": "string",
        "data_emissao": "date"
    },
    "message": "Documento atualizado com sucesso"
}
```

#### Excluir Documento
```http
DELETE /documentos/:id
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "message": "Documento excluído com sucesso"
}
```

### Telefones

#### Criar Telefone
```http
POST /telefones
```
**Corpo da Requisição:**
```json
{
    "cliente_id": "number",
    "ddd": "string",
    "numero": "string"
}
```
**Resposta (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "ddd": "string",
        "numero": "string"
    },
    "message": "Telefone criado com sucesso"
}
```

#### Listar Todos os Telefones
```http
GET /telefones
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "number",
            "cliente_id": "number",
            "ddd": "string",
            "numero": "string"
        }
    ]
}
```

#### Buscar Telefone por ID
```http
GET /telefones/:id
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "ddd": "string",
        "numero": "string"
    }
}
```

#### Atualizar Telefone
```http
PUT /telefones/:id
```
**Corpo da Requisição:**
```json
{
    "ddd": "string", // opcional
    "numero": "string" // opcional
}
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "ddd": "string",
        "numero": "string"
    },
    "message": "Telefone atualizado com sucesso"
}
```

#### Excluir Telefone
```http
DELETE /telefones/:id
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "message": "Telefone excluído com sucesso"
}
```

### Endereços

#### Criar Endereço
```http
POST /enderecos
```
**Corpo da Requisição:**
```json
{
    "cliente_id": "number",
    "estado": "string",
    "cidade": "string",
    "bairro": "string",
    "rua": "string",
    "numero": "string",
    "complemento": "string",
    "cep": "string"
}
```
**Resposta (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "estado": "string",
        "cidade": "string",
        "bairro": "string",
        "rua": "string",
        "numero": "string",
        "complemento": "string",
        "cep": "string"
    },
    "message": "Endereço criado com sucesso"
}
```

#### Listar Todos os Endereços
```http
GET /enderecos
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "number",
            "cliente_id": "number",
            "estado": "string",
            "cidade": "string",
            "bairro": "string",
            "rua": "string",
            "numero": "string",
            "complemento": "string",
            "cep": "string"
        }
    ]
}
```

#### Buscar Endereço por ID
```http
GET /enderecos/:id
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "estado": "string",
        "cidade": "string",
        "bairro": "string",
        "rua": "string",
        "numero": "string",
        "complemento": "string",
        "cep": "string"
    }
}
```

#### Atualizar Endereço
```http
PUT /enderecos/:id
```
**Corpo da Requisição:**
```json
{
    "estado": "string", // opcional
    "cidade": "string", // opcional
    "bairro": "string", // opcional
    "rua": "string", // opcional
    "numero": "string", // opcional
    "complemento": "string", // opcional
    "cep": "string" // opcional
}
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "estado": "string",
        "cidade": "string",
        "bairro": "string",
        "rua": "string",
        "numero": "string",
        "complemento": "string",
        "cep": "string"
    },
    "message": "Endereço atualizado com sucesso"
}
```

#### Excluir Endereço
```http
DELETE /enderecos/:id
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "message": "Endereço excluído com sucesso"
}
```

### Cliente-Serviços

#### Registrar Serviço Realizado
```http
POST /cliente-servicos
```
**Corpo da Requisição:**
```json
{
    "cliente_id": "number",
    "servico_id": "number",
    "data_realizacao": "date",
    "valor_unitario": "number",
    "desconto": "number",
    "valor_total": "number",
    "observacoes": "string"
}
```
**Resposta (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "servico_id": "number",
        "data_realizacao": "date",
        "valor_unitario": "number",
        "desconto": "number",
        "valor_total": "number",
        "observacoes": "string"
    },
    "message": "Serviço registrado com sucesso"
}
```

#### Listar Todos os Serviços Realizados
```http
GET /cliente-servicos
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "number",
            "cliente_id": "number",
            "servico_id": "number",
            "data_realizacao": "date",
            "valor_unitario": "number",
            "desconto": "number",
            "valor_total": "number",
            "observacoes": "string"
        }
    ]
}
```

#### Buscar Serviço Realizado por ID
```http
GET /cliente-servicos/:id
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "servico_id": "number",
        "data_realizacao": "date",
        "valor_unitario": "number",
        "desconto": "number",
        "valor_total": "number",
        "observacoes": "string"
    }
}
```

#### Atualizar Serviço Realizado
```http
PUT /cliente-servicos/:id
```
**Corpo da Requisição:**
```json
{
    "data_realizacao": "date", // opcional
    "valor_unitario": "number", // opcional
    "desconto": "number", // opcional
    "valor_total": "number", // opcional
    "observacoes": "string" // opcional
}
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "servico_id": "number",
        "data_realizacao": "date",
        "valor_unitario": "number",
        "desconto": "number",
        "valor_total": "number",
        "observacoes": "string"
    },
    "message": "Serviço atualizado com sucesso"
}
```

#### Excluir Serviço Realizado
```http
DELETE /cliente-servicos/:id
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "message": "Serviço excluído com sucesso"
}
```

### Cliente-Produtos

#### Registrar Compra de Produto
```http
POST /cliente-produtos
```
**Corpo da Requisição:**
```json
{
    "cliente_id": "number",
    "produto_id": "number",
    "quantidade": "number",
    "data_compra": "date",
    "valor_unitario": "number",
    "desconto": "number",
    "valor_total": "number"
}
```
**Resposta (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "produto_id": "number",
        "quantidade": "number",
        "data_compra": "date",
        "valor_unitario": "number",
        "desconto": "number",
        "valor_total": "number"
    },
    "message": "Compra registrada com sucesso"
}
```

#### Listar Todas as Compras
```http
GET /cliente-produtos
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "number",
            "cliente_id": "number",
            "produto_id": "number",
            "quantidade": "number",
            "data_compra": "date",
            "valor_unitario": "number",
            "desconto": "number",
            "valor_total": "number"
        }
    ]
}
```

#### Buscar Compra por ID
```http
GET /cliente-produtos/:id
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "produto_id": "number",
        "quantidade": "number",
        "data_compra": "date",
        "valor_unitario": "number",
        "desconto": "number",
        "valor_total": "number"
    }
}
```

#### Atualizar Compra
```http
PUT /cliente-produtos/:id
```
**Corpo da Requisição:**
```json
{
    "quantidade": "number", // opcional
    "data_compra": "date", // opcional
    "valor_unitario": "number", // opcional
    "desconto": "number", // opcional
    "valor_total": "number" // opcional
}
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "number",
        "cliente_id": "number",
        "produto_id": "number",
        "quantidade": "number",
        "data_compra": "date",
        "valor_unitario": "number",
        "desconto": "number",
        "valor_total": "number"
    },
    "message": "Compra atualizada com sucesso"
}
```

#### Excluir Compra
```http
DELETE /cliente-produtos/:id
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "message": "Compra deletada com sucesso"
}
```

### Estatísticas

#### Top 10 clientes que mais consumiram (quantidade)
```http
GET /estatisticas/top-clientes-quantidade
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "cliente_id": "number",
            "nome": "string",
            "quantidade_consumida": "number"
        }
    ]
}
```

#### Itens mais consumidos (produtos/serviços)
```http
GET /estatisticas/itens-mais-consumidos
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "item_id": "number",
            "nome": "string",
            "tipo": "produto" | "servico",
            "quantidade": "number"
        }
    ]
}
```

#### Consumo por tipo e raça de pets
```http
GET /estatisticas/consumo-por-tipo-raca
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "tipo_pet": "string",
            "raca_pet": "string",
            "item_id": "number",
            "nome": "string",
            "tipo": "produto" | "servico",
            "quantidade": "number"
        }
    ]
}
```

#### Top 5 clientes que mais consumiram (valor)
```http
GET /estatisticas/top-clientes-valor
```
**Resposta (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "cliente_id": "number",
            "nome": "string",
            "valor_total": "number"
        }
    ]
}
```

## Códigos de Status HTTP

- 200: Sucesso
- 201: Criado com sucesso
- 400: Erro na requisição
- 404: Recurso não encontrado
- 500: Erro interno do servidor

## Exemplos de Uso

### Criar um novo cliente
```javascript
const response = await fetch('http://localhost:3000/api/clientes', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nome: 'João Silva',
        nome_social: 'João',
        email: 'joao@email.com'
    })
});

const data = await response.json();
```

### Buscar um cliente específico
```javascript
const response = await fetch('http://localhost:3000/api/clientes/1');
const data = await response.json();
```

### Atualizar um produto
```javascript
const response = await fetch('http://localhost:3000/api/produtos/1', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        preco: 29.99,
        estoque: 50
    })
});

const data = await response.json();
```

### Atualizar estoque de um produto
```javascript
const response = await fetch('http://localhost:3000/api/produtos/1/estoque', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        quantidade: -5 // Remove 5 unidades do estoque
    })
});

const data = await response.json();
```