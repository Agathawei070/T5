import { Request, Response } from 'express';
import { StatisticsService } from '../services/statisticsService';

export class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService();
  }

  async getTopClientesPorQuantidade(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.statisticsService.obterTopClientesPorQuantidade();
      
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

  async getItensMaisConsumidos(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.statisticsService.obterItensMaisConsumidos();
      
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

  async getConsumoPorTipoRaca(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.statisticsService.obterConsumoPorTipoRaca();
      
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

  async getTopClientesPorValor(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.statisticsService.obterTopClientesPorValor();
      
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
} 