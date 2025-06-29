import { Request, Response } from 'express';
import { ClienteServicoService } from '../services/clienteServicoService';

const clienteServicoService = new ClienteServicoService();

export class ClienteServicoController {
  async create(req: Request, res: Response) {
    try {
      const clienteServicoData = {
        ...req.body,
        data_realizacao: new Date(req.body.data_realizacao)
      };

      const result = await clienteServicoService.create(clienteServicoData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await clienteServicoService.getAll();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'ID inválido'
        });
        return;
      }

      const result = await clienteServicoService.getById(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      if (updates.data_realizacao) {
        updates.data_realizacao = new Date(updates.data_realizacao);
      }

      const result = await clienteServicoService.update(id, updates);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await clienteServicoService.delete(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
} 