import { Request, Response } from 'express';
import { ClienteProdutoService } from '../services/clienteProdutoService';

const clienteProdutoService = new ClienteProdutoService();

export class ClienteProdutoController {
  async create(req: Request, res: Response) {
    try {
      const clienteProdutoData = {
        ...req.body,
        data_compra: new Date(req.body.data_compra)
      };

      const result = await clienteProdutoService.create(clienteProdutoData);
      
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
      const result = await clienteProdutoService.getAll();
      
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

      const result = await clienteProdutoService.getById(id);
      
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
      
      if (updates.data_compra) {
        updates.data_compra = new Date(updates.data_compra);
      }

      const result = await clienteProdutoService.update(id, updates);
      
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
      const result = await clienteProdutoService.delete(id);
      
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