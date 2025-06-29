import { Component } from "react";

type ClienteStats = {
  nome: string;
  quantidadeCompras: number;
  valorTotal: number;
};

type ItemStats = {
  nome: string;
  tipo: string;
  quantidade: number;
};

type PetStats = {
  tipo: string;
  raca: string;
  quantidade: number;
};

type EstatisticasState = {
  topClientesQuantidade: ClienteStats[];
  topClientesValor: ClienteStats[];
  itensMaisConsumidos: ItemStats[];
  consumoPorTipoRaca: PetStats[];
};

class Estatisticas extends Component<{}, EstatisticasState> {
  state: EstatisticasState = {
    topClientesQuantidade: [],
    topClientesValor: [],
    itensMaisConsumidos: [],
    consumoPorTipoRaca: [],
  };

  componentDidMount() {
    fetch("http://localhost:3001/api/estatisticas")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            topClientesQuantidade: json.data.topClientesQuantidade || [],
            topClientesValor: json.data.topClientesValor || [],
            itensMaisConsumidos: json.data.itensMaisConsumidos || [],
            consumoPorTipoRaca: json.data.consumoPorTipoRaca || [],
          });
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar estatísticas:", err);
      });
  }

  render() {
    const {
      topClientesQuantidade,
      topClientesValor,
      itensMaisConsumidos,
      consumoPorTipoRaca,
    } = this.state;

    return (
      <div className="container-fluid min-vh-100 bg-dark text-light py-5">
        <div className="container">
          <h2 className="fw-bold mb-4">Estatísticas</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card bg-white text-dark shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">
                    <i className="bi bi-trophy-fill text-warning me-2"></i>
                    Top 10 Clientes por Quantidade
                  </h5>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nome</th>
                          <th className="text-center">Compras</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topClientesQuantidade.map((c, i) => (
                          <tr key={i}>
                            <td className="fw-bold">{i + 1}</td>
                            <td>{c.nome}</td>
                            <td className="text-center">
                              <span className="badge bg-info text-dark">
                                {c.quantidadeCompras}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-white text-dark shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">
                    <i className="bi bi-cash-coin text-success me-2"></i>
                    Top 5 Clientes por Valor
                  </h5>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nome</th>
                          <th className="text-end">Valor Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topClientesValor.map((c, i) => (
                          <tr key={i}>
                            <td className="fw-bold">{i + 1}</td>
                            <td>{c.nome}</td>
                            <td className="text-end">
                              <span className="badge bg-success bg-opacity-75">
                                R$ {c.valorTotal.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-white text-dark shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">
                    <i className="bi bi-star-fill text-primary me-2"></i>
                    Itens Mais Consumidos
                  </h5>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Tipo</th>
                          <th className="text-center">Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itensMaisConsumidos.map((item, i) => (
                          <tr key={i}>
                            <td>{item.nome}</td>
                            <td>
                              <span
                                className={`badge ${
                                  item.tipo === "Produto"
                                    ? "bg-primary"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {item.tipo}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-info text-dark">
                                {item.quantidade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-white text-dark shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">
                    <i className="bi bi-emoji-smile text-danger me-2"></i>
                    Consumo por Tipo e Raça de Pet
                  </h5>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Raça</th>
                          <th className="text-center">Consumos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumoPorTipoRaca.map((pet, i) => (
                          <tr key={i}>
                            <td>{pet.tipo}</td>
                            <td>{pet.raca}</td>
                            <td className="text-center">
                              <span className="badge bg-info text-dark">
                                {pet.quantidade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="alert alert-info mt-5">
            <strong>Análise segmentada:</strong> Os dados acima permitem identificar
            clientes mais fiéis, produtos e serviços de maior demanda e preferências
            por tipo/raça de pet, auxiliando em campanhas e decisões estratégicas.
          </div>
        </div>
      </div>
    );
  }
}

export default Estatisticas;