import { Component } from 'react';

interface Cliente {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataCadastro: string;
  observacoes: string;
}

interface ClientesState {
  busca: string;
  novoCliente: Cliente;
  exibirFormulario: boolean;
  clientes: Cliente[];
}

class Clientes extends Component<{}, ClientesState & { clienteSelecionado: Cliente | null }> {
  state: ClientesState & { clienteSelecionado: Cliente | null } = {
    busca: '',
    novoCliente: {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      dataCadastro: '',
      observacoes: '',
    },
    exibirFormulario: false,
    clientes: [],
    clienteSelecionado: null
  };

  componentDidMount() {
    // Buscar clientes do backend ao carregar a página
    fetch('http://localhost:3001/api/clientes')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({ clientes: json.data });
        }
      })
      .catch(err => {
        console.error('Erro ao buscar clientes:', err);
      });
  }

  handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ busca: e.target.value });
  };

  handleNovoClienteClick = () => {
    this.setState({ exibirFormulario: !this.state.exibirFormulario });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      novoCliente: {
        ...prevState.novoCliente,
        [name]: value
      }
    }));
  };

  handleSalvarCliente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const novo = {
      nome: this.state.novoCliente.nome,
      email: this.state.novoCliente.email,
      telefone: this.state.novoCliente.telefone,
      cpf: this.state.novoCliente.cpf,
      observacoes: this.state.novoCliente.observacoes
    };

    // Enviar novo cliente para o backend
    fetch('http://localhost:3001/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState(prevState => ({
            clientes: [...prevState.clientes, json.data],
            novoCliente: {
              nome: '',
              email: '',
              telefone: '',
              cpf: '',
              dataCadastro: '',
              observacoes: '',
            },
            exibirFormulario: false
          }));
        }
      })
      .catch(err => {
        console.error('Erro ao salvar cliente:', err);
      });
  };

  abrirModalDetalhes = (cliente: Cliente) => {
    this.setState({ clienteSelecionado: cliente });
  };

  fecharModalDetalhes = () => {
    this.setState({ clienteSelecionado: null });
  };

  render() {
    const { busca, clientes, exibirFormulario, novoCliente, clienteSelecionado } = this.state;

    const clientesFiltrados = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
      <div className="container-fluid min-vh-100 bg-dark text-light py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Clientes Cadastrados</h2>
            <button
              className="btn text-dark fw-semibold"
              style={{ background: '#0dcaf0', border: 'none' }}
              onClick={this.handleNovoClienteClick}
            >
              {exibirFormulario ? 'Fechar' : <><i className="bi bi-plus-circle me-2"></i> Novo Cliente</>}
            </button>
          </div>

          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nome..."
              value={busca}
              onChange={this.handleBuscaChange}
            />
          </div>

          {exibirFormulario && (
            <div className="card mb-4 bg-white text-dark">
              <div className="card-body">
                <h5 className="card-title">Cadastrar Novo Cliente</h5>
                <form onSubmit={this.handleSalvarCliente}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nome</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={novoCliente.nome}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={novoCliente.email}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Telefone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="telefone"
                        value={novoCliente.telefone}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">CPF</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cpf"
                        value={novoCliente.cpf}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Observações</label>
                      <textarea
                        className="form-control"
                        name="observacoes"
                        value={novoCliente.observacoes}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-success">Salvar Cliente</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {clientesFiltrados.map((cliente, index) => (
              <div key={index} className="col">
                <div className="card shadow-sm h-100 bg-white text-dark border-0">
                  <div className="card-body">
                    <h5 className="card-title">{cliente.nome}</h5>
                    <p><strong>E-mail:</strong> {cliente.email}</p>
                    <p><strong>Telefone:</strong> {cliente.telefone}</p>
                    <p><strong>CPF:</strong> {cliente.cpf}</p>
                    <p><strong>Data de Cadastro:</strong> {cliente.dataCadastro}</p>
                    <p><strong>Observações:</strong> {cliente.observacoes}</p>
                  </div>
                  <div className="card-footer text-center bg-white border-0">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => this.abrirModalDetalhes(cliente)}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de Detalhes */}
          {clienteSelecionado && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content bg-white text-dark">
                  <div className="modal-header">
                    <h5 className="modal-title">Detalhes do Cliente</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={this.fecharModalDetalhes}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p><strong>Nome:</strong> {clienteSelecionado.nome}</p>
                    <p><strong>E-mail:</strong> {clienteSelecionado.email}</p>
                    <p><strong>Telefone:</strong> {clienteSelecionado.telefone}</p>
                    <p><strong>CPF:</strong> {clienteSelecionado.cpf}</p>
                    <p><strong>Data de Cadastro:</strong> {clienteSelecionado.dataCadastro}</p>
                    <p><strong>Observações:</strong> {clienteSelecionado.observacoes}</p>
                  </div>
                  <div className="modal-footer bg-white">
                    <button className="btn btn-secondary" onClick={this.fecharModalDetalhes}>
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }
}

export default Clientes;
