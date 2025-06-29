import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Pets from './pages/Pets';
import Produtos from './pages/Produtos';
import Servicos from './pages/Servicos';
import Consumo from './pages/Consumo';
import Dashboard from './pages/Home';
import Estatisticas from './pages/Estatisticas';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/pets" element={<Pets />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/servicos" element={<Servicos />} />
      <Route path="/consumo" element={<Consumo />} />
      <Route path="/estatisticas" element={<Estatisticas />} />
    </Routes>
  );
}
export default AppRoutes;
