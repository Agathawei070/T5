import pool from '../database/connection';
import { Pet, ApiResponse } from '../types';

export class PetService {
    async create(pet: Omit<Pet, 'id'>): Promise<ApiResponse<Pet>> {
        try {
            const [result] = await pool.execute(
                'INSERT INTO pets (cliente_id, nome, raca, genero, tipo) VALUES (?, ?, ?, ?, ?)',
                [pet.cliente_id, pet.nome, pet.raca, pet.genero, pet.tipo]
            );
            
            const [newPet] = await pool.execute(
                'SELECT * FROM pets WHERE id = ?',
                [(result as any).insertId]
            );

            return {
                success: true,
                data: (newPet as any)[0],
                message: 'Pet criado com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAll(): Promise<ApiResponse<Pet[]>> {
        try {
            const [pets] = await pool.execute('SELECT * FROM pets');
            return {
                success: true,
                data: pets as Pet[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getById(id: number): Promise<ApiResponse<Pet>> {
        try {
            const [pet] = await pool.execute('SELECT * FROM pets WHERE id = ?', [id]);
            if (!(pet as any[])[0]) {
                return {
                    success: false,
                    error: 'Pet não encontrado'
                };
            }

            return {
                success: true,
                data: (pet as any[])[0]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getByClienteId(clienteId: number): Promise<ApiResponse<Pet[]>> {
        try {
            const [pets] = await pool.execute('SELECT * FROM pets WHERE cliente_id = ?', [clienteId]);
            return {
                success: true,
                data: pets as Pet[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async update(id: number, pet: Partial<Pet>): Promise<ApiResponse<Pet>> {
        try {
            const [existingPet] = await pool.execute('SELECT * FROM pets WHERE id = ?', [id]);
            if (!(existingPet as any[])[0]) {
                return {
                    success: false,
                    error: 'Pet não encontrado'
                };
            }

            const updates = [];
            const values = [];

            if (pet.nome) {
                updates.push('nome = ?');
                values.push(pet.nome);
            }
            if (pet.raca) {
                updates.push('raca = ?');
                values.push(pet.raca);
            }
            if (pet.genero) {
                updates.push('genero = ?');
                values.push(pet.genero);
            }
            if (pet.tipo) {
                updates.push('tipo = ?');
                values.push(pet.tipo);
            }

            if (updates.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum campo para atualizar'
                };
            }

            values.push(id);
            await pool.execute(
                `UPDATE pets SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            const [updatedPet] = await pool.execute('SELECT * FROM pets WHERE id = ?', [id]);

            return {
                success: true,
                data: (updatedPet as any[])[0],
                message: 'Pet atualizado com sucesso'
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
            const [existingPet] = await pool.execute('SELECT * FROM pets WHERE id = ?', [id]);
            if (!(existingPet as any[])[0]) {
                return {
                    success: false,
                    error: 'Pet não encontrado'
                };
            }

            await pool.execute('DELETE FROM pets WHERE id = ?', [id]);

            return {
                success: true,
                message: 'Pet excluído com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
} 