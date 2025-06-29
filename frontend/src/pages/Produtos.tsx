import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
}

interface ProdutosState {
  produtos: Produto[];
  novoProduto: Produto;
  produtoSelecionado: Produto | null;
  modoEdicao: boolean;
  showModal: boolean;
}

class Produtos extends Component<{}, ProdutosState> {
  state: ProdutosState = {
    produtos: [],
    novoProduto: { id: 0, nome: '', categoria: '', preco: 0, estoque: 0 },
    produtoSelecionado: null,
    modoEdicao: false,
    showModal: false
  };

  componentDidMount() {
    // Buscar produtos do backend ao carregar a página
    fetch('http://localhost:3001/api/produtos')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({ produtos: json.data });
        }
      })
      .catch(err => {
        console.error('Erro ao buscar produtos:', err);
      });
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = name === 'preco' || name === 'estoque' ? Number(value) : value;
    this.setState(prev => ({
      novoProduto: { ...prev.novoProduto, [name]: val }
    }));
  };

  handleSalvarProduto = (e: React.FormEvent) => {
    e.preventDefault();
    const { novoProduto, modoEdicao } = this.state;

    if (modoEdicao) {
      // Atualizar produto no backend
      fetch(`http://localhost:3001/api/produtos/${novoProduto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            const produtoAtualizado = json.data;
            this.setState(prev => ({
              produtos: prev.produtos.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p),
              modoEdicao: false,
              produtoSelecionado: null,
              novoProduto: { id: 0, nome: '', categoria: '', preco: 0, estoque: 0 }
            }));
            this.fecharModal();
          }
        })
        .catch(err => {
          console.error('Erro ao atualizar produto:', err);
        });
    } else {
      // Cadastrar novo produto no backend
      fetch('http://localhost:3001/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            const produtoSalvo = json.data;
            this.setState(prev => ({
              produtos: [...prev.produtos, produtoSalvo],
              novoProduto: { id: 0, nome: '', categoria: '', preco: 0, estoque: 0 }
            }));
            this.fecharModal();
          }
        })
        .catch(err => {
          console.error('Erro ao salvar produto:', err);
        });
    }
  };

  abrirModal = (produto: Produto, editar: boolean) => {
    this.setState({
      produtoSelecionado: editar ? null : produto,
      novoProduto: editar ? { ...produto } : { id: 0, nome: '', categoria: '', preco: 0, estoque: 0 },
      modoEdicao: editar,
      showModal: true
    });
  };

  fecharModal = () => {
    this.setState({ produtoSelecionado: null, modoEdicao: false, showModal: false });
  };

  render() {
    const { produtos, novoProduto, produtoSelecionado, modoEdicao, showModal } = this.state;

    return (
      <div className="container-fluid min-vh-100 bg-dark text-light py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Produtos</h2>
            <button
              className="btn text-dark fw-semibold"
              style={{ background: '#0dcaf0', border: 'none' }}
              onClick={() => this.abrirModal({ id: 0, nome: '', categoria: '', preco: 0, estoque: 0 }, true)}
            >
              <i className="bi bi-plus-circle me-2"></i> Novo Produto
            </button>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {produtos.map(p => (
              <div key={p.id} className="col">
                <div className="card h-100 shadow-sm bg-white text-dark border-0">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{p.nome}</h5>
                    <p className="card-text"><strong>Categoria:</strong> {p.categoria}</p>
                    <p className="card-text"><strong>Preço:</strong> R$ {p.preco.toFixed(2)}</p>
                    <p className="card-text"><strong>Estoque:</strong> {p.estoque}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-center gap-2 bg-white border-0">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => this.abrirModal(p, false)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => this.abrirModal(p, true)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Bootstrap */}
          {showModal && (
            <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
              <div className="modal-dialog">
                <div className="modal-content bg-dark text-light">
                  <div className="modal-header border-secondary">
                    <h5 className="modal-title">
                      {modoEdicao ? 'Editar Produto' : 'Detalhes do Produto'}
                    </h5>
                    <button type="button" className="btn-close btn-close-white" onClick={this.fecharModal}></button>
                  </div>
                  <div className="modal-body">
                    {modoEdicao ? (
                      <form onSubmit={this.handleSalvarProduto}>
                        <div className="mb-3">
                          <label className="form-label">Nome</label>
                          <input
                            className="form-control bg-secondary text-light border-0"
                            name="nome"
                            value={novoProduto.nome}
                            onChange={this.handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Categoria</label>
                          <select
                            className="form-select bg-secondary text-light border-0"
                            name="categoria"
                            value={novoProduto.categoria}
                            onChange={this.handleInputChange}
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="alimentacao">Alimentação</option>
                            <option value="higiene">Higiene</option>
                            <option value="acessorios">Acessórios</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Preço</label>
                          <input
                            type="number"
                            className="form-control bg-secondary text-light border-0"
                            name="preco"
                            value={novoProduto.preco}
                            onChange={this.handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Estoque</label>
                          <input
                            type="number"
                            className="form-control bg-secondary text-light border-0"
                            name="estoque"
                            value={novoProduto.estoque}
                            onChange={this.handleInputChange}
                            required
                          />
                        </div>
                        <div className="text-end">
                          <button type="submit" className="btn btn-success">Salvar</button>
                        </div>
                      </form>
                    ) : (
                      produtoSelecionado && (
                        <div>
                          <p><strong>Nome:</strong> {produtoSelecionado.nome}</p>
                          <p><strong>Categoria:</strong> {produtoSelecionado.categoria}</p>
                          <p><strong>Preço:</strong> R$ {produtoSelecionado.preco.toFixed(2)}</p>
                          <p><strong>Estoque:</strong> {produtoSelecionado.estoque}</p>
                        </div>
                      )
                    )}
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

export default Produtos;
