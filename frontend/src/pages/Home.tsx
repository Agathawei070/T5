import { Component } from 'react';

type Stat = {
  icon: string;
  label: string;
  value: number;
};

type HomeState = {
  stats: Stat[];
};

class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      stats: [
        { icon: 'bi-people', label: 'Clientes', value: 0 },
        { icon: 'bi-heart-pulse', label: 'Pets', value: 0 },
        { icon: 'bi-box-seam', label: 'Produtos', value: 0 },
        { icon: 'bi-gear', label: 'Serviços', value: 0 },
        { icon: 'bi-cart', label: 'Vendas', value: 0 },
      ],
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/estatisticas')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            stats: [
              { icon: 'bi-people', label: 'Clientes', value: json.data.clientes },
              { icon: 'bi-heart-pulse', label: 'Pets', value: json.data.pets },
              { icon: 'bi-box-seam', label: 'Produtos', value: json.data.produtos },
              { icon: 'bi-gear', label: 'Serviços', value: json.data.servicos },
              { icon: 'bi-cart', label: 'Vendas', value: json.data.vendas },
            ],
          });
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar estatísticas:', err);
      });
  }

  render() {
    const { stats } = this.state;

    return (
      <div className="container-fluid bg-dark text-light px-0">
        <div className="content-wrapper min-vh-100 py-5 px-3 px-md-5">
          <div className="text-center">
            <div className="mb-4">
              <i className="bi bi-paw-fill display-1 text-info"></i>
            </div>
            <h1 className="fw-bold mb-3">
              Bem-vindo à <span className="text-info">C4P</span>
            </h1>
            <p className="lead mb-4">
              Gerencie seu pet shop de forma{' '}
              <span className="text-info">fácil</span>,{' '}
              <span className="text-info">moderna</span> e{' '}
              <span className="text-info">intuitiva</span>.
              <br />
              Cadastre clientes, pets, produtos, serviços e acompanhe vendas em um só lugar!
            </p>

            {/* Dashboard de estatísticas */}
            <div className="row justify-content-center g-4 mb-5">
              {stats.map((stat, i) => (
                <div key={i} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  <div className="card bg-white text-dark shadow-sm border-0 text-center h-100">
                    <div className="card-body py-4">
                      <i className={`bi ${stat.icon} display-6 text-info mb-2`}></i>
                      <h3 className="fw-bold mb-0">{stat.value}</h3>
                      <div className="small text-uppercase text-secondary">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botões de navegação */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              {[
                { href: '/clientes', icon: 'bi-people', label: 'Clientes' },
                { href: '/pets', icon: 'bi-heart-pulse', label: 'Pets' },
                { href: '/produtos', icon: 'bi-box-seam', label: 'Produtos' },
                { href: '/servicos', icon: 'bi-gear', label: 'Serviços' },
                { href: '/consumo', icon: 'bi-cart', label: 'Consumo' },
                { href: '/estatisticas', icon: 'bi-bar-chart-line', label: 'Estatísticas' },
              ].map((btn, i) => (
                <a
                  key={i}
                  href={btn.href}
                  className="btn btn-info text-dark fw-semibold px-4 py-2 d-flex align-items-center"
                >
                  <i className={`bi ${btn.icon} me-2`}></i> {btn.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .content-wrapper {
            margin-left: 240px;
            transition: margin-left 0.3s;
          }

          @media (max-width: 991px) {
            .content-wrapper {
              margin-left: 0 !important;
              padding-top: 80px !important;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Home;
