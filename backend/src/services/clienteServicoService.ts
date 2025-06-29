import pool from '../database/connection';
import { ClienteServico, ApiResponse } from '../types';

export class ClienteServicoService {
    async create(clienteServico: Omit<ClienteServico, 'id'>): Promise<ApiResponse<ClienteServico>> {
        try {
            const valorTotal = clienteServico.valor_unitario - (clienteServico.desconto || 0);
            
            const [result] = await pool.execute(
                'INSERT INTO cliente_servicos (cliente_id, servico_id, data_realizacao, valor_unitario, desconto, valor_total, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    clienteServico.cliente_id,
                    clienteServico.servico_id,
                    clienteServico.data_realizacao.toISOString().slice(0, 19).replace('T', ' '),
                    clienteServico.valor_unitario,
                    clienteServico.desconto || 0,
                    valorTotal,
                    clienteServico.observacoes || null
                ]
            );

            const [newClienteServico] = await pool.execute(
                'SELECT * FROM cliente_servicos WHERE id = ?',
                [(result as any).insertId]
            );

            return {
                success: true,
                data: (newClienteServico as any[])[0],
                message: 'Serviço registrado'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAll(): Promise<ApiResponse<ClienteServico[]>> {
        try {
            const [clienteServicos] = await pool.execute(`
                SELECT cs.*, c.nome as cliente_nome, s.nome as servico_nome
                FROM cliente_servicos cs
                JOIN clientes c ON cs.cliente_id = c.id
                JOIN servicos s ON cs.servico_id = s.id
                ORDER BY cs.data_realizacao DESC
            `);
            
            return {
                success: true,
                data: clienteServicos as ClienteServico[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getById(id: number): Promise<ApiResponse<ClienteServico>> {
        try {
            const [clienteServico] = await pool.execute(`
                SELECT cs.*, c.nome as cliente_nome, s.nome as servico_nome
                FROM cliente_servicos cs
                JOIN clientes c ON cs.cliente_id = c.id
                JOIN servicos s ON cs.servico_id = s.id
                WHERE cs.id = ?
            `, [id]);
            
            if (!(clienteServico as any[])[0]) {
                return {
                    success: false,
                    error: 'ClienteServico não encontrado'
                };
            }

            return {
                success: true,
                data: (clienteServico as any[])[0]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getByClienteId(clienteId: number): Promise<ApiResponse<ClienteServico[]>> {
        try {
            const [clienteServicos] = await pool.execute(`
                SELECT cs.*, c.nome as cliente_nome, s.nome as servico_nome
                FROM cliente_servicos cs
                JOIN clientes c ON cs.cliente_id = c.id
                JOIN servicos s ON cs.servico_id = s.id
                WHERE cs.cliente_id = ?
                ORDER BY cs.data_realizacao DESC
            `, [clienteId]);
            
            return {
                success: true,
                data: clienteServicos as ClienteServico[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async update(id: number, updates: Partial<ClienteServico>): Promise<ApiResponse<ClienteServico>> {
        try {
            const [existingClienteServico] = await pool.execute('SELECT * FROM cliente_servicos WHERE id = ?', [id]);
            if (!(existingClienteServico as any[])[0]) {
                return {
                    success: false,
                    error: 'ClienteServico não encontrado'
                };
            }

            const fields = [];
            const values = [];

            if (updates.data_realizacao !== undefined) {
                fields.push('data_realizacao = ?');
                values.push(updates.data_realizacao.toISOString());
            }
            if (updates.valor_unitario !== undefined) {
                fields.push('valor_unitario = ?');
                values.push(updates.valor_unitario);
            }
            if (updates.desconto !== undefined) {
                fields.push('desconto = ?');
                values.push(updates.desconto);
            }
            if (updates.observacoes !== undefined) {
                fields.push('observacoes = ?');
                values.push(updates.observacoes);
            }

            if (fields.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum campo para atualizar'
                };
            }

            // Recalcular valor total
            const valorUnitario = updates.valor_unitario ?? (existingClienteServico as any[])[0].valor_unitario;
            const desconto = updates.desconto ?? (existingClienteServico as any[])[0].desconto;
            const valorTotal = valorUnitario - desconto;

            fields.push('valor_total = ?');
            values.push(valorTotal);
            values.push(id);

            await pool.execute(
                `UPDATE cliente_servicos SET ${fields.join(', ')} WHERE id = ?`,
                values
            );

            const [updatedClienteServico] = await pool.execute('SELECT * FROM cliente_servicos WHERE id = ?', [id]);

            return {
                success: true,
                data: (updatedClienteServico as any[])[0],
                message: 'ClienteServico atualizado com sucesso'
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
            const [existingClienteServico] = await pool.execute('SELECT * FROM cliente_servicos WHERE id = ?', [id]);
            if (!(existingClienteServico as any[])[0]) {
                return {
                    success: false,
                    error: 'ClienteServico não encontrado'
                };
            }

            await pool.execute('DELETE FROM cliente_servicos WHERE id = ?', [id]);

            return {
                success: true,
                message: 'ClienteServico excluído com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
} 