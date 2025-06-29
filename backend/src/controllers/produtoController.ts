import { Request, Response } from 'express';
import { ProdutoService } from '../services/produtoService';

export class ProdutoController {
    private service: ProdutoService;

    constructor() {
        this.service = new ProdutoService();
    }

    async create(req: Request, res: Response) {
        const response = await this.service.create(req.body);
        if (response.success) {
            res.status(201).json(response);
        } else {
            res.status(400).json(response);
        }
    }

    async getAll(req: Request, res: Response) {
        const response = await this.service.getAll();
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(500).json(response);
        }
    }

    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido'
            });
            return;
        }

        const response = await this.service.getById(id);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    }

    async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido'
            });
            return;
        }

        const response = await this.service.update(id, req.body);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido'
            });
            return;
        }

        const response = await this.service.delete(id);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    }

    async updateEstoque(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const quantidade = parseInt(req.body.quantidade);

        if (isNaN(id) || isNaN(quantidade)) {
            res.status(400).json({
                success: false,
                error: 'ID ou quantidade inválidos'
            });
            return;
        }

        const response = await this.service.updateEstoque(id, quantidade);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    }
} 