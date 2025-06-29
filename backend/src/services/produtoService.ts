import pool from '../database/connection';
import { Produto, ApiResponse } from '../types';

export class ProdutoService {
    async create(produto: Omit<Produto, 'id'>): Promise<ApiResponse<Produto>> {
        try {
            const [result] = await pool.execute(
                'INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)',
                [produto.nome, produto.descricao || null, produto.preco, produto.estoque]
            );
            
            const [newProduto] = await pool.execute(
                'SELECT * FROM produtos WHERE id = ?',
                [(result as any).insertId]
            );

            return {
                success: true,
                data: (newProduto as any)[0],
                message: 'Produto criado com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAll(): Promise<ApiResponse<Produto[]>> {
        try {
            const [produtos] = await pool.execute('SELECT * FROM produtos');
            return {
                success: true,
                data: produtos as Produto[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getById(id: number): Promise<ApiResponse<Produto>> {
        try {
            const [produto] = await pool.execute('SELECT * FROM produtos WHERE id = ?', [id]);
            if (!(produto as any[])[0]) {
                return {
                    success: false,
                    error: 'Produto não encontrado'
                };
            }

            return {
                success: true,
                data: (produto as any[])[0]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async update(id: number, produto: Partial<Produto>): Promise<ApiResponse<Produto>> {
        try {
            const [existingProduto] = await pool.execute('SELECT * FROM produtos WHERE id = ?', [id]);
            if (!(existingProduto as any[])[0]) {
                return {
                    success: false,
                    error: 'Produto não encontrado'
                };
            }

            const updates = [];
            const values = [];

            if (produto.nome) {
                updates.push('nome = ?');
                values.push(produto.nome);
            }
            if (produto.descricao !== undefined) {
                updates.push('descricao = ?');
                values.push(produto.descricao);
            }
            if (produto.preco !== undefined) {
                updates.push('preco = ?');
                values.push(produto.preco);
            }
            if (produto.estoque !== undefined) {
                updates.push('estoque = ?');
                values.push(produto.estoque);
            }

            if (updates.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum campo para atualizar'
                };
            }

            values.push(id);
            await pool.execute(
                `UPDATE produtos SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            const [updatedProduto] = await pool.execute('SELECT * FROM produtos WHERE id = ?', [id]);

            return {
                success: true,
                data: (updatedProduto as any[])[0],
                message: 'Produto atualizado com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async delete(id: number): Promise<ApiResponse<void>> {
        try {
            const [existingProduto] = await pool.execute('SELECT * FROM produtos WHERE id = ?', [id]);
            if (!(existingProduto as any[])[0]) {
                return {
                    success: false,
                    error: 'Produto não encontrado'
                };
            }

            await pool.execute('DELETE FROM produtos WHERE id = ?', [id]);

            return {
                success: true,
                message: 'Produto excluído com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateEstoque(id: number, quantidade: number): Promise<ApiResponse<Produto>> {
        try {
            const [produto] = await pool.execute('SELECT * FROM produtos WHERE id = ?', [id]);
            if (!(produto as any[])[0]) {
                return {
                    success: false,
                    error: 'Produto não encontrado'
                };
            }

            const novoEstoque = (produto as any[])[0].estoque + quantidade;
            if (novoEstoque < 0) {
                return {
                    success: false,
                    error: 'Estoque insuficiente'
                };
            }

            await pool.execute(
                'UPDATE produtos SET estoque = ? WHERE id = ?',
                [novoEstoque, id]
            );

            const [updatedProduto] = await pool.execute('SELECT * FROM produtos WHERE id = ?', [id]);

            return {
                success: true,
                data: (updatedProduto as any[])[0],
                message: 'Estoque atualizado com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
} 