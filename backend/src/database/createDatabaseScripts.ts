export const createDatabase = `CREATE DATABASE IF NOT EXISTS c4p;`

export const createTables = `
-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nome_social VARCHAR(100),
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(100) NOT NULL,
    UNIQUE KEY (email)
) ENGINE=InnoDB;

-- Tabela de Documentos dos Clientes (CPF/RG)
CREATE TABLE IF NOT EXISTS documentos_cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    tipo ENUM('CPF', 'RG') NOT NULL,
    valor VARCHAR(20) NOT NULL,
    data_emissao DATE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    UNIQUE KEY (tipo, cliente_id),
    UNIQUE KEY (valor)
) ENGINE=InnoDB;

-- Tabela de Telefones
CREATE TABLE IF NOT EXISTS telefones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    ddd VARCHAR(2) NOT NULL,
    numero VARCHAR(9) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    UNIQUE KEY (ddd, numero)
) ENGINE=InnoDB;

-- Tabela de Endereços
CREATE TABLE IF NOT EXISTS enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    estado VARCHAR(2) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100),
    cep VARCHAR(8) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela de Pets
CREATE TABLE IF NOT EXISTS pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
    raca VARCHAR(50) NOT NULL,
    genero ENUM("M", "F") NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela de Serviços
CREATE TABLE IF NOT EXISTS servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    duracao_minutos INT NOT NULL
) ENGINE=InnoDB;

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Tabela de Relacionamento Cliente-Serviços (histórico)
CREATE TABLE IF NOT EXISTS cliente_servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    servico_id INT NOT NULL,
    data_realizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_unitario DECIMAL(10,2) NOT NULL,
    desconto DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (servico_id) REFERENCES servicos(id)
) ENGINE=InnoDB;

-- Tabela de Relacionamento Cliente-Produtos (compras)
CREATE TABLE IF NOT EXISTS cliente_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    data_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_unitario DECIMAL(10,2) NOT NULL,
	desconto DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
) ENGINE=InnoDB;
`