import pool from '../database/connection';
import { Cliente, ClienteCompleto, ApiResponse } from '../types';

export class ClienteService {
    async create(cliente: Omit<Cliente, 'id' | 'data_cadastro'>): Promise<ApiResponse<Cliente>> {
        try {
            const [result] = await pool.execute(
                'INSERT INTO clientes (nome, nome_social, email) VALUES (?, ?, ?)',
                [cliente.nome, cliente.nome_social || null, cliente.email]
            );
            
            const [newCliente] = await pool.execute(
                'SELECT * FROM clientes WHERE id = ?',
                [(result as any).insertId]
            );

            return {
                success: true,
                data: (newCliente as any)[0],
                message: 'Cliente criado com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAll(): Promise<ApiResponse<Cliente[]>> {
        try {
            const [clientes] = await pool.execute('SELECT * FROM clientes');
            return {
                success: true,
                data: clientes as Cliente[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getById(id: number): Promise<ApiResponse<ClienteCompleto>> {
        try {
            const [cliente] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
            if (!(cliente as any[])[0]) {
                return {
                    success: false,
                    error: 'Cliente não encontrado'
                };
            }

            const [documentos] = await pool.execute('SELECT * FROM documentos_cliente WHERE cliente_id = ?', [id]);
            const [telefones] = await pool.execute('SELECT * FROM telefones WHERE cliente_id = ?', [id]);
            const [enderecos] = await pool.execute('SELECT * FROM enderecos WHERE cliente_id = ?', [id]);
            const [pets] = await pool.execute('SELECT * FROM pets WHERE cliente_id = ?', [id]);

            const clienteCompleto: ClienteCompleto = {
                ...(cliente as any[])[0],
                documentos: documentos as any[],
                telefones: telefones as any[],
                enderecos: enderecos as any[],
                pets: pets as any[]
            };

            return {
                success: true,
                data: clienteCompleto
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async update(id: number, cliente: Partial<Cliente>): Promise<ApiResponse<Cliente>> {
        try {
            const [existingCliente] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
            if (!(existingCliente as any[])[0]) {
                return {
                    success: false,
                    error: 'Cliente não encontrado'
                };
            }

            const updates = [];
            const values = [];

            if (cliente.nome) {
                updates.push('nome = ?');
                values.push(cliente.nome);
            }
            if (cliente.nome_social !== undefined) {
                updates.push('nome_social = ?');
                values.push(cliente.nome_social);
            }
            if (cliente.email) {
                updates.push('email = ?');
                values.push(cliente.email);
            }

            if (updates.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum campo para atualizar'
                };
            }

            values.push(id);
            await pool.execute(
                `UPDATE clientes SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            const [updatedCliente] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);

            return {
                success: true,
                data: (updatedCliente as any[])[0],
                message: 'Cliente atualizado com sucesso'
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
            const [existingCliente] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
            if (!(existingCliente as any[])[0]) {
                return {
                    success: false,
                    error: 'Cliente não encontrado'
                };
            }

            await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);

            return {
                success: true,
                message: 'Cliente excluído com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
} 