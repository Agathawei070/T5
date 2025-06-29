import pool from '../database/connection';
import { ClienteProduto, ApiResponse } from '../types';

export class ClienteProdutoService {
    async create(clienteProduto: Omit<ClienteProduto, 'id'>): Promise<ApiResponse<ClienteProduto>> {
        try {
            const valorTotal = (clienteProduto.valor_unitario - (clienteProduto.desconto || 0)) * clienteProduto.quantidade;
            
            const [result] = await pool.execute(
                'INSERT INTO cliente_produtos (cliente_id, produto_id, quantidade, data_compra, valor_unitario, desconto, valor_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    clienteProduto.cliente_id,
                    clienteProduto.produto_id,
                    clienteProduto.quantidade,
                    clienteProduto.data_compra.toISOString().slice(0, 19).replace('T', ' '),
                    clienteProduto.valor_unitario,
                    clienteProduto.desconto || 0,
                    valorTotal
                ]
            );

            const [newClienteProduto] = await pool.execute(
                'SELECT * FROM cliente_produtos WHERE id = ?',
                [(result as any).insertId]
            );

            return {
                success: true,
                data: (newClienteProduto as any[])[0],
                message: 'Compra registrada'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAll(): Promise<ApiResponse<ClienteProduto[]>> {
        try {
            const [clienteProdutos] = await pool.execute(`
                SELECT cp.*, c.nome as cliente_nome, p.nome as produto_nome
                FROM cliente_produtos cp
                JOIN clientes c ON cp.cliente_id = c.id
                JOIN produtos p ON cp.produto_id = p.id
                ORDER BY cp.data_compra DESC
            `);
            
            return {
                success: true,
                data: clienteProdutos as ClienteProduto[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getById(id: number): Promise<ApiResponse<ClienteProduto>> {
        try {
            const [clienteProduto] = await pool.execute(`
                SELECT cp.*, c.nome as cliente_nome, p.nome as produto_nome
                FROM cliente_produtos cp
                JOIN clientes c ON cp.cliente_id = c.id
                JOIN produtos p ON cp.produto_id = p.id
                WHERE cp.id = ?
            `, [id]);
            
            if (!(clienteProduto as any[])[0]) {
                return {
                    success: false,
                    error: 'ClienteProduto não encontrado'
                };
            }

            return {
                success: true,
                data: (clienteProduto as any[])[0]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getByClienteId(clienteId: number): Promise<ApiResponse<ClienteProduto[]>> {
        try {
            const [clienteProdutos] = await pool.execute(`
                SELECT cp.*, c.nome as cliente_nome, p.nome as produto_nome
                FROM cliente_produtos cp
                JOIN clientes c ON cp.cliente_id = c.id
                JOIN produtos p ON cp.produto_id = p.id
                WHERE cp.cliente_id = ?
                ORDER BY cp.data_compra DESC
            `, [clienteId]);
            
            return {
                success: true,
                data: clienteProdutos as ClienteProduto[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async update(id: number, updates: Partial<ClienteProduto>): Promise<ApiResponse<ClienteProduto>> {
        try {
            const [existingClienteProduto] = await pool.execute('SELECT * FROM cliente_produtos WHERE id = ?', [id]);
            if (!(existingClienteProduto as any[])[0]) {
                return {
                    success: false,
                    error: 'ClienteProduto não encontrado'
                };
            }

            const fields = [];
            const values = [];

            if (updates.quantidade !== undefined) {
                fields.push('quantidade = ?');
                values.push(updates.quantidade);
            }
            if (updates.data_compra !== undefined) {
                fields.push('data_compra = ?');
                values.push(updates.data_compra.toISOString());
            }
            if (updates.valor_unitario !== undefined) {
                fields.push('valor_unitario = ?');
                values.push(updates.valor_unitario);
            }
            if (updates.desconto !== undefined) {
                fields.push('desconto = ?');
                values.push(updates.desconto);
            }

            if (fields.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum campo para atualizar'
                };
            }

            // Recalcular valor total
            const quantidade = updates.quantidade ?? (existingClienteProduto as any[])[0].quantidade;
            const valorUnitario = updates.valor_unitario ?? (existingClienteProduto as any[])[0].valor_unitario;
            const desconto = updates.desconto ?? (existingClienteProduto as any[])[0].desconto;
            const valorTotal = (valorUnitario - desconto) * quantidade;

            fields.push('valor_total = ?');
            values.push(valorTotal);
            values.push(id);

            await pool.execute(
                `UPDATE cliente_produtos SET ${fields.join(', ')} WHERE id = ?`,
                values
            );

            const [updatedClienteProduto] = await pool.execute('SELECT * FROM cliente_produtos WHERE id = ?', [id]);

            return {
                success: true,
                data: (updatedClienteProduto as any[])[0],
                message: 'ClienteProduto atualizado com sucesso'
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
            const [existingClienteProduto] = await pool.execute('SELECT * FROM cliente_produtos WHERE id = ?', [id]);
            if (!(existingClienteProduto as any[])[0]) {
                return {
                    success: false,
                    error: 'ClienteProduto não encontrado'
                };
            }

            await pool.execute('DELETE FROM cliente_produtos WHERE id = ?', [id]);

            return {
                success: true,
                message: 'ClienteProduto excluído com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
} 