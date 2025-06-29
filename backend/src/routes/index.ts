import { Router, Request, Response } from 'express';
import { ClienteController } from '../controllers/clienteController';
import { PetController } from '../controllers/petController';
import { ServicoController } from '../controllers/servicoController';
import { ProdutoController } from '../controllers/produtoController';
import { DocumentoController } from '../controllers/documentoController';
import { TelefoneController } from '../controllers/telefoneController';
import { EnderecoController } from '../controllers/enderecoController';
import { ClienteServicoController } from '../controllers/clienteServicoController';
import { ClienteProdutoController } from '../controllers/clienteProdutoController';
import { StatisticsController } from '../controllers/statisticsController';

const router = Router();
const clienteController = new ClienteController();
const petController = new PetController();
const servicoController = new ServicoController();
const produtoController = new ProdutoController();
const documentoController = new DocumentoController();
const telefoneController = new TelefoneController();
const enderecoController = new EnderecoController();
const clienteServicoController = new ClienteServicoController();
const clienteProdutoController = new ClienteProdutoController();
const statisticsController = new StatisticsController();

// Cliente routes
router.post('/clientes', (req: Request, res: Response) => clienteController.create(req, res));
router.get('/clientes', (req: Request, res: Response) => clienteController.getAll(req, res));
router.get('/clientes/:id', (req: Request, res: Response) => clienteController.getById(req, res));
router.put('/clientes/:id', (req: Request, res: Response) => clienteController.update(req, res));
router.delete('/clientes/:id', (req: Request, res: Response) => clienteController.delete(req, res));

// Pet routes
router.post('/pets', (req: Request, res: Response) => petController.create(req, res));
router.get('/pets', (req: Request, res: Response) => petController.getAll(req, res));
router.get('/pets/:id', (req: Request, res: Response) => petController.getById(req, res));
router.get('/clientes/:clienteId/pets', (req: Request, res: Response) => petController.getByClienteId(req, res));
router.put('/pets/:id', (req: Request, res: Response) => petController.update(req, res));
router.delete('/pets/:id', (req: Request, res: Response) => petController.delete(req, res));

// Serviço routes
router.post('/servicos', (req: Request, res: Response) => servicoController.create(req, res));
router.get('/servicos', (req: Request, res: Response) => servicoController.getAll(req, res));
router.get('/servicos/:id', (req: Request, res: Response) => servicoController.getById(req, res));
router.put('/servicos/:id', (req: Request, res: Response) => servicoController.update(req, res));
router.delete('/servicos/:id', (req: Request, res: Response) => servicoController.delete(req, res));

// Produto routes
router.post('/produtos', (req: Request, res: Response) => produtoController.create(req, res));
router.get('/produtos', (req: Request, res: Response) => produtoController.getAll(req, res));
router.get('/produtos/:id', (req: Request, res: Response) => produtoController.getById(req, res));
router.put('/produtos/:id', (req: Request, res: Response) => produtoController.update(req, res));
router.delete('/produtos/:id', (req: Request, res: Response) => produtoController.delete(req, res));
router.patch('/produtos/:id/estoque', (req: Request, res: Response) => produtoController.updateEstoque(req, res));

// Documento routes
router.post('/documentos', (req: Request, res: Response) => documentoController.create(req, res));
router.get('/documentos', (req: Request, res: Response) => documentoController.getAll(req, res));
router.get('/documentos/:id', (req: Request, res: Response) => documentoController.getById(req, res));
router.put('/documentos/:id', (req: Request, res: Response) => documentoController.update(req, res));
router.delete('/documentos/:id', (req: Request, res: Response) => documentoController.delete(req, res));

// Telefone routes
router.post('/telefones', (req: Request, res: Response) => telefoneController.create(req, res));
router.get('/telefones', (req: Request, res: Response) => telefoneController.getAll(req, res));
router.get('/telefones/:id', (req: Request, res: Response) => telefoneController.getById(req, res));
router.put('/telefones/:id', (req: Request, res: Response) => telefoneController.update(req, res));
router.delete('/telefones/:id', (req: Request, res: Response) => telefoneController.delete(req, res));

// Endereco routes
router.post('/enderecos', (req: Request, res: Response) => enderecoController.create(req, res));
router.get('/enderecos', (req: Request, res: Response) => enderecoController.getAll(req, res));
router.get('/enderecos/:id', (req: Request, res: Response) => enderecoController.getById(req, res));
router.put('/enderecos/:id', (req: Request, res: Response) => enderecoController.update(req, res));
router.delete('/enderecos/:id', (req: Request, res: Response) => enderecoController.delete(req, res));

// ClienteServico routes
router.post('/cliente-servicos', (req: Request, res: Response) => clienteServicoController.create(req, res));
router.get('/cliente-servicos', (req: Request, res: Response) => clienteServicoController.getAll(req, res));
router.get('/cliente-servicos/:id', (req: Request, res: Response) => clienteServicoController.getById(req, res));
router.put('/cliente-servicos/:id', (req: Request, res: Response) => clienteServicoController.update(req, res));
router.delete('/cliente-servicos/:id', (req: Request, res: Response) => clienteServicoController.delete(req, res));

// ClienteProduto routes
router.post('/cliente-produtos', (req: Request, res: Response) => clienteProdutoController.create(req, res));
router.get('/cliente-produtos', (req: Request, res: Response) => clienteProdutoController.getAll(req, res));
router.get('/cliente-produtos/:id', (req: Request, res: Response) => clienteProdutoController.getById(req, res));
router.put('/cliente-produtos/:id', (req: Request, res: Response) => clienteProdutoController.update(req, res));
router.delete('/cliente-produtos/:id', (req: Request, res: Response) => clienteProdutoController.delete(req, res));

// Statistics routes
router.get('/estatisticas/top-clientes-quantidade', (req: Request, res: Response) => statisticsController.getTopClientesPorQuantidade(req, res));
router.get('/estatisticas/itens-mais-consumidos', (req: Request, res: Response) => statisticsController.getItensMaisConsumidos(req, res));
router.get('/estatisticas/consumo-por-tipo-raca', (req: Request, res: Response) => statisticsController.getConsumoPorTipoRaca(req, res));
router.get('/estatisticas/top-clientes-valor', (req: Request, res: Response) => statisticsController.getTopClientesPorValor(req, res));

export default router; 