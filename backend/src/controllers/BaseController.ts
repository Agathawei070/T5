import { Request, Response } from 'express';
import pool from '../config/database';
import { ApiResponse } from '../types';

export abstract class BaseController {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    protected async getAll(req: Request, res: Response) {
        try {
            const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
            const response: ApiResponse<any> = {
                success: true,
                data: rows
            };
            res.json(response);
        } catch (error) {
            const response: ApiResponse<null> = {
                success: false,
                error: 'Error fetching records'
            };
            res.status(500).json(response);
        }
    }

    protected async getById(req: Request, res: Response) {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM ${this.tableName} WHERE id = ?`,
                [req.params.id]
            );
            
            if (!rows || (Array.isArray(rows) && rows.length === 0)) {
                const response: ApiResponse<null> = {
                    success: false,
                    error: 'Record not found'
                };
                return res.status(404).json(response);
            }

            const response: ApiResponse<any> = {
                success: true,
                data: Array.isArray(rows) ? rows[0] : rows
            };
            res.json(response);
        } catch (error) {
            const response: ApiResponse<null> = {
                success: false,
                error: 'Error fetching record'
            };
            res.status(500).json(response);
        }
    }

    protected async create(req: Request, res: Response) {
        try {
            const fields = Object.keys(req.body);
            const values = Object.values(req.body);
            const placeholders = fields.map(() => '?').join(', ');

            const [result] = await pool.query(
                `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`,
                values
            );

            const response: ApiResponse<any> = {
                success: true,
                data: { id: (result as any).insertId, ...req.body },
                message: 'Record created successfully'
            };
            res.status(201).json(response);
        } catch (error) {
            const response: ApiResponse<null> = {
                success: false,
                error: 'Error creating record'
            };
            res.status(500).json(response);
        }
    }

    protected async update(req: Request, res: Response) {
        try {
            const fields = Object.keys(req.body);
            const values = Object.values(req.body);
            const setClause = fields.map(field => `${field} = ?`).join(', ');

            const [result] = await pool.query(
                `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
                [...values, req.params.id]
            );

            if ((result as any).affectedRows === 0) {
                const response: ApiResponse<null> = {
                    success: false,
                    error: 'Record not found'
                };
                return res.status(404).json(response);
            }

            const response: ApiResponse<any> = {
                success: true,
                data: { id: req.params.id, ...req.body },
                message: 'Record updated successfully'
            };
            res.json(response);
        } catch (error) {
            const response: ApiResponse<null> = {
                success: false,
                error: 'Error updating record'
            };
            res.status(500).json(response);
        }
    }

    protected async delete(req: Request, res: Response) {
        try {
            const [result] = await pool.query(
                `DELETE FROM ${this.tableName} WHERE id = ?`,
                [req.params.id]
            );

            if ((result as any).affectedRows === 0) {
                const response: ApiResponse<null> = {
                    success: false,
                    error: 'Record not found'
                };
                return res.status(404).json(response);
            }

            const response: ApiResponse<null> = {
                success: true,
                message: 'Record deleted successfully'
            };
            res.json(response);
        } catch (error) {
            const response: ApiResponse<null> = {
                success: false,
                error: 'Error deleting record'
            };
            res.status(500).json(response);
        }
    }
} 