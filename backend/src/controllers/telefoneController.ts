import { Request, Response } from 'express';
import { TelefoneService } from '../services/telefoneService';

const telefoneService = new TelefoneService();

export class TelefoneController {
  async create(req: Request, res: Response) {
    try {
      const result = await telefoneService.create(req.body);
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await telefoneService.getAll();
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await telefoneService.getById(id);
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await telefoneService.update(id, req.body);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await telefoneService.delete(id);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }
} 