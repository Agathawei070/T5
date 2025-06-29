import pool from '../database/connection';
import { Servico, ApiResponse } from '../types';

export class ServicoService {
    async create(servico: Omit<Servico, 'id'>): Promise<ApiResponse<Servico>> {
        try {
            const [result] = await pool.execute(
                'INSERT INTO servicos (nome, descricao, preco, duracao_minutos) VALUES (?, ?, ?, ?)',
                [servico.nome, servico.descricao || null, servico.preco, servico.duracao_minutos]
            );
            
            const [newServico] = await pool.execute(
                'SELECT * FROM servicos WHERE id = ?',
                [(result as any).insertId]
            );

            return {
                success: true,
                data: (newServico as any)[0],
                message: 'Serviço criado com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAll(): Promise<ApiResponse<Servico[]>> {
        try {
            const [servicos] = await pool.execute('SELECT * FROM servicos');
            return {
                success: true,
                data: servicos as Servico[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getById(id: number): Promise<ApiResponse<Servico>> {
        try {
            const [servico] = await pool.execute('SELECT * FROM servicos WHERE id = ?', [id]);
            if (!(servico as any[])[0]) {
                return {
                    success: false,
                    error: 'Serviço não encontrado'
                };
            }

            return {
                success: true,
                data: (servico as any[])[0]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async update(id: number, servico: Partial<Servico>): Promise<ApiResponse<Servico>> {
        try {
            const [existingServico] = await pool.execute('SELECT * FROM servicos WHERE id = ?', [id]);
            if (!(existingServico as any[])[0]) {
                return {
                    success: false,
                    error: 'Serviço não encontrado'
                };
            }

            const updates = [];
            const values = [];

            if (servico.nome) {
                updates.push('nome = ?');
                values.push(servico.nome);
            }
            if (servico.descricao !== undefined) {
                updates.push('descricao = ?');
                values.push(servico.descricao);
            }
            if (servico.preco !== undefined) {
                updates.push('preco = ?');
                values.push(servico.preco);
            }
            if (servico.duracao_minutos !== undefined) {
                updates.push('duracao_minutos = ?');
                values.push(servico.duracao_minutos);
            }

            if (updates.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum campo para atualizar'
                };
            }

            values.push(id);
            await pool.execute(
                `UPDATE servicos SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            const [updatedServico] = await pool.execute('SELECT * FROM servicos WHERE id = ?', [id]);

            return {
                success: true,
                data: (updatedServico as any[])[0],
                message: 'Serviço atualizado com sucesso'
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
            const [existingServico] = await pool.execute('SELECT * FROM servicos WHERE id = ?', [id]);
            if (!(existingServico as any[])[0]) {
                return {
                    success: false,
                    error: 'Serviço não encontrado'
                };
            }

            await pool.execute('DELETE FROM servicos WHERE id = ?', [id]);

            return {
                success: true,
                message: 'Serviço excluído com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
} 