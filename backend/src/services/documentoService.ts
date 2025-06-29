import pool from '../database/connection';
import { DocumentoCliente, ApiResponse } from '../types';

export class DocumentoService {
    async create(documento: Omit<DocumentoCliente, 'id'>): Promise<ApiResponse<DocumentoCliente>> {
        try {
            const [result] = await pool.execute(
                'INSERT INTO documentos_cliente (cliente_id, tipo, valor, data_emissao) VALUES (?, ?, ?, ?)',
                [documento.cliente_id, documento.tipo, documento.valor, documento.data_emissao || null]
            );
            
            const [newDocumento] = await pool.execute(
                'SELECT * FROM documentos_cliente WHERE id = ?',
                [(result as any).insertId]
            );

            return {
                success: true,
                data: (newDocumento as any)[0],
                message: 'Documento criado com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAll(): Promise<ApiResponse<DocumentoCliente[]>> {
        try {
            const [documentos] = await pool.execute('SELECT * FROM documentos_cliente');
            return {
                success: true,
                data: documentos as DocumentoCliente[]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getById(id: number): Promise<ApiResponse<DocumentoCliente>> {
        try {
            const [documento] = await pool.execute('SELECT * FROM documentos_cliente WHERE id = ?', [id]);
            if (!(documento as any[])[0]) {
                return {
                    success: false,
                    error: 'Documento não encontrado'
                };
            }

            return {
                success: true,
                data: (documento as any[])[0]
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async update(id: number, documento: Partial<DocumentoCliente>): Promise<ApiResponse<DocumentoCliente>> {
        try {
            const [existingDocumento] = await pool.execute('SELECT * FROM documentos_cliente WHERE id = ?', [id]);
            if (!(existingDocumento as any[])[0]) {
                return {
                    success: false,
                    error: 'Documento não encontrado'
                };
            }

            const updates = [];
            const values = [];

            if (documento.tipo) {
                updates.push('tipo = ?');
                values.push(documento.tipo);
            }
            if (documento.valor) {
                updates.push('valor = ?');
                values.push(documento.valor);
            }
            if (documento.data_emissao !== undefined) {
                updates.push('data_emissao = ?');
                values.push(documento.data_emissao);
            }

            if (updates.length === 0) {
                return {
                    success: false,
                    error: 'Nenhum campo para atualizar'
                };
            }

            values.push(id);
            await pool.execute(
                `UPDATE documentos_cliente SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            const [updatedDocumento] = await pool.execute('SELECT * FROM documentos_cliente WHERE id = ?', [id]);

            return {
                success: true,
                data: (updatedDocumento as any[])[0],
                message: 'Documento atualizado com sucesso'
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
            const [existingDocumento] = await pool.execute('SELECT * FROM documentos_cliente WHERE id = ?', [id]);
            if (!(existingDocumento as any[])[0]) {
                return {
                    success: false,
                    error: 'Documento não encontrado'
                };
            }

            await pool.execute('DELETE FROM documentos_cliente WHERE id = ?', [id]);

            return {
                success: true,
                message: 'Documento excluído com sucesso'
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
} 