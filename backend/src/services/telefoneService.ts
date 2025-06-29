import pool from '../database/connection';
import { Telefone, ApiResponse } from '../types';

export class TelefoneService {
    async create(telefone: Omit<Telefone, 'id'>): Promise<ApiResponse<Telefone>> {
        try {
            const [result] = await pool.execute(
                'INSERT INTO telefones (cliente_id, ddd, numero) VALUES (?, ?, ?)',
                [telefone.cliente_id, telefone.ddd, telefone.numero]
            );
            
            const [newTelefone] = await pool.execute(
                'SELECT * FROM telefones WHERE id = ?',
                [(result as any).insertId]
            );

            return {
                success: true,
                data: (newTelefone as any)[0],
                message: 'Telefone criado com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAll(): Promise<ApiResponse<Telefone[]>> {
        try {
            const [telefones] = await pool.execute('SELECT * FROM telefones');
            return {
                success: true,
                data: telefones as Telefone[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getById(id: number): Promise<ApiResponse<Telefone>> {
        try {
            const [telefone] = await pool.execute('SELECT * FROM telefones WHERE id = ?', [id]);
            if (!(telefone as any[])[0]) {
                return {
                    success: false,
                    error: 'Telefone não encontrado'
                };
            }

            return {
                success: true,
                data: (telefone as any[])[0]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async update(id: number, telefone: Partial<Telefone>): Promise<ApiResponse<Telefone>> {
        try {
            const [existingTelefone] = await pool.execute('SELECT * FROM telefones WHERE id = ?', [id]);
            if (!(existingTelefone as any[])[0]) {
                return {
                    success: false,
                    error: 'Telefone não encontrado'
                };
            }

            const updates = [];
            const values = [];

            if (telefone.ddd) {
                updates.push('ddd = ?');
                values.push(telefone.ddd);
            }
            if (telefone.numero) {
                updates.push('numero = ?');
                values.push(telefone.numero);
            }

            if (updates.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum campo para atualizar'
                };
            }

            values.push(id);
            await pool.execute(
                `UPDATE telefones SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            const [updatedTelefone] = await pool.execute('SELECT * FROM telefones WHERE id = ?', [id]);

            return {
                success: true,
                data: (updatedTelefone as any[])[0],
                message: 'Telefone atualizado com sucesso'
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
            const [existingTelefone] = await pool.execute('SELECT * FROM telefones WHERE id = ?', [id]);
            if (!(existingTelefone as any[])[0]) {
                return {
                    success: false,
                    error: 'Telefone não encontrado'
                };
            }

            await pool.execute('DELETE FROM telefones WHERE id = ?', [id]);

            return {
                success: true,
                message: 'Telefone excluído com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
} 