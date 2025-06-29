import pool from '../database/connection';
import { Endereco, ApiResponse } from '../types';

export class EnderecoService {
    async create(endereco: Omit<Endereco, 'id'>): Promise<ApiResponse<Endereco>> {
        try {
            const [result] = await pool.execute(
                'INSERT INTO enderecos (cliente_id, estado, cidade, bairro, rua, numero, complemento, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [endereco.cliente_id, endereco.estado, endereco.cidade, endereco.bairro, endereco.rua, endereco.numero, endereco.complemento || null, endereco.cep]
            );
            
            const [newEndereco] = await pool.execute(
                'SELECT * FROM enderecos WHERE id = ?',
                [(result as any).insertId]
            );

            return {
                success: true,
                data: (newEndereco as any)[0],
                message: 'Endereço criado com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAll(): Promise<ApiResponse<Endereco[]>> {
        try {
            const [enderecos] = await pool.execute('SELECT * FROM enderecos');
            return {
                success: true,
                data: enderecos as Endereco[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getById(id: number): Promise<ApiResponse<Endereco>> {
        try {
            const [endereco] = await pool.execute('SELECT * FROM enderecos WHERE id = ?', [id]);
            if (!(endereco as any[])[0]) {
                return {
                    success: false,
                    error: 'Endereço não encontrado'
                };
            }

            return {
                success: true,
                data: (endereco as any[])[0]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async update(id: number, endereco: Partial<Endereco>): Promise<ApiResponse<Endereco>> {
        try {
            const [existingEndereco] = await pool.execute('SELECT * FROM enderecos WHERE id = ?', [id]);
            if (!(existingEndereco as any[])[0]) {
                return {
                    success: false,
                    error: 'Endereço não encontrado'
                };
            }

            const updates = [];
            const values = [];

            if (endereco.estado) {
                updates.push('estado = ?');
                values.push(endereco.estado);
            }
            if (endereco.cidade) {
                updates.push('cidade = ?');
                values.push(endereco.cidade);
            }
            if (endereco.bairro) {
                updates.push('bairro = ?');
                values.push(endereco.bairro);
            }
            if (endereco.rua) {
                updates.push('rua = ?');
                values.push(endereco.rua);
            }
            if (endereco.numero) {
                updates.push('numero = ?');
                values.push(endereco.numero);
            }
            if (endereco.complemento !== undefined) {
                updates.push('complemento = ?');
                values.push(endereco.complemento);
            }
            if (endereco.cep) {
                updates.push('cep = ?');
                values.push(endereco.cep);
            }

            if (updates.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum campo para atualizar'
                };
            }

            values.push(id);
            await pool.execute(
                `UPDATE enderecos SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            const [updatedEndereco] = await pool.execute('SELECT * FROM enderecos WHERE id = ?', [id]);

            return {
                success: true,
                data: (updatedEndereco as any[])[0],
                message: 'Endereço atualizado com sucesso'
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
            const [existingEndereco] = await pool.execute('SELECT * FROM enderecos WHERE id = ?', [id]);
            if (!(existingEndereco as any[])[0]) {
                return {
                    success: false,
                    error: 'Endereço não encontrado'
                };
            }

            await pool.execute('DELETE FROM enderecos WHERE id = ?', [id]);

            return {
                success: true,
                message: 'Endereço excluído com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
} 