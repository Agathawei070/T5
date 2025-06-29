import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  const alternarMenu = () => {
    setMenuAberto((prev) => !prev);
  };

  return (
    <>
      {/* Topbar responsiva com botão e logo */}
      <div className="topbar d-lg-none bg-dark text-light d-flex align-items-center justify-content-center border-bottom border-secondary px-3">
        <button
          className="btn text-info position-absolute start-0"
          onClick={alternarMenu}
          style={{ zIndex: 1101 }}
        >
          <i className="bi bi-list fs-3"></i>
        </button>
        <Link className="navbar-brand fw-bold fs-4 text-info d-flex align-items-center" to="/">
          <i className="bi bi-paw-fill me-2"></i>C4P
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={`sidebar bg-dark text-light vh-100 d-flex flex-column shadow-lg ${
          menuAberto ? 'd-block' : 'd-none'
        } d-lg-flex`}
      >
        <div className="sidebar-header d-none d-lg-flex align-items-center justify-content-center py-4 border-bottom border-secondary">
          <Link className="navbar-brand fw-bold fs-3 text-info d-flex align-items-center" to="/">
            <i className="bi bi-paw-fill me-2"></i>C4P
          </Link>
        </div>
        <nav className="flex-grow-1">
          <ul className="nav flex-column gap-2 mt-4">
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill hover-nav text-light" to="/">
                <i className="bi bi-house me-2"></i>Início
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill hover-nav text-light" to="/clientes">
                <i className="bi bi-people me-2"></i>Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill hover-nav text-light" to="/pets">
                <i className="bi bi-heart-pulse me-2"></i>Pets
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill hover-nav text-light" to="/produtos">
                <i className="bi bi-box-seam me-2"></i>Produtos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill hover-nav text-light" to="/servicos">
                <i className="bi bi-gear me-2"></i>Serviços
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill hover-nav text-light" to="/consumo">
                <i className="bi bi-cart me-2"></i>Consumo
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill hover-nav text-light" to="/estatisticas">
                <i className="bi bi-bar-chart-line me-2"></i>Estatísticas
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <style>{`
        .sidebar {
          width: 240px;
          min-width: 200px;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1040;
          background: #212529;
          transition: transform 0.3s ease;
        }

        .hover-nav:hover,
        .nav-link.active {
          background: #0dcaf0;
          color: #212529 !important;
          transition: background 0.2s, color 0.2s;
        }

        .topbar {
          height: 60px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1045;
        }

        .topbar .navbar-brand {
          margin: 0 auto;
        }

        @media (max-width: 991px) {
          .sidebar {
            top: 60px;
            height: calc(100vh - 60px);
          }
        }
      `}</style>
    </>
  );
}
