// Interfaces principais
export interface Cliente {
    id: number;
    nome: string;
    nome_social?: string;
    data_cadastro: Date;
    email: string;
}

export interface DocumentoCliente {
    id: number;
    cliente_id: number;
    tipo: 'CPF' | 'RG';
    valor: string;
    data_emissao?: Date;
}

export interface Telefone {
    id: number;
    cliente_id: number;
    ddd: string;
    numero: string;
}

export interface Endereco {
    id: number;
    cliente_id: number;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
    cep: string;
}

export interface Pet {
    id: number;
    cliente_id: number;
    nome: string;
    raca: string;
    genero: "M" | "F";
    tipo: string;
}

export interface Servico {
    id: number;
    nome: string;
    descricao?: string;
    preco: number;
    duracao_minutos: number;
}

export interface Produto {
    id: number;
    nome: string;
    descricao?: string;
    preco: number;
    estoque: number;
}

// Interfaces para relacionamentos
export interface ClienteServico {
    id: number;
    cliente_id: number;
    servico_id: number;
    data_realizacao: Date;
    valor_unitario: number;
    desconto: number;
    valor_total: number;
    observacoes?: string;
}

export interface ClienteProduto {
    id: number;
    cliente_id: number;
    produto_id: number;
    quantidade: number;
    data_compra: Date;
    valor_unitario: number;
    desconto: number;
    valor_total: number;
}

// Interfaces para consultas relacionadas
export interface ClienteCompleto extends Cliente {
    documentos: DocumentoCliente[];
    telefones: Telefone[];
    enderecos: Endereco[];
    pets: Pet[];
}

export interface ClienteComServicos {
    cliente: Cliente;
    servicos: Array<{
        detalhes: Servico;
        registro: ClienteServico;
    }>;
}

export interface ClienteComProdutos {
    cliente: Cliente;
    produtos: Array<{
        detalhes: Produto;
        registro: ClienteProduto;
    }>;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}