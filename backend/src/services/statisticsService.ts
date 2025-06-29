import pool from '../database/connection';
import { ApiResponse } from '../types';

export interface EstatisticasConsumo {
  cliente: {
    id: number;
    nome: string;
  };
  quantidade: number;
  valor: number;
}

export interface EstatisticasItem {
  item: {
    id: number;
    nome: string;
    tipo: 'produto' | 'servico';
  };
  quantidade: number;
}

export interface EstatisticasPet {
  tipo: string;
  raca: string;
  itens: EstatisticasItem[];
}

export class StatisticsService {
  // Obter top 10 clientes por quantidade de consumo
  async obterTopClientesPorQuantidade(): Promise<ApiResponse<EstatisticasConsumo[]>> {
    try {
      const [result] = await pool.execute(`
        SELECT 
          c.id,
          c.nome,
          (COALESCE(SUM(cp.quantidade), 0) + COALESCE(COUNT(cs.id), 0)) as quantidade_total,
          (COALESCE(SUM(cp.valor_total), 0) + COALESCE(SUM(cs.valor_total), 0)) as valor_total
        FROM clientes c
        LEFT JOIN cliente_produtos cp ON c.id = cp.cliente_id
        LEFT JOIN cliente_servicos cs ON c.id = cs.cliente_id
        GROUP BY c.id, c.nome
        HAVING quantidade_total > 0
        ORDER BY quantidade_total DESC
        LIMIT 10
      `);

      const estatisticas = (result as any[]).map(row => ({
        cliente: {
          id: row.id,
          nome: row.nome
        },
        quantidade: parseInt(row.quantidade_total),
        valor: parseFloat(row.valor_total)
      }));

      return {
        success: true,
        data: estatisticas
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obter itens mais consumidos
  async obterItensMaisConsumidos(): Promise<ApiResponse<EstatisticasItem[]>> {
    try {
      const [result] = await pool.execute(`
        (SELECT 
          p.id,
          p.nome,
          'produto' as tipo,
          SUM(cp.quantidade) as quantidade_total
        FROM produtos p
        JOIN cliente_produtos cp ON p.id = cp.produto_id
        GROUP BY p.id, p.nome)
        UNION ALL
        (SELECT 
          s.id,
          s.nome,
          'servico' as tipo,
          COUNT(cs.id) as quantidade_total
        FROM servicos s
        JOIN cliente_servicos cs ON s.id = cs.servico_id
        GROUP BY s.id, s.nome)
        ORDER BY quantidade_total DESC
      `);

      const estatisticas = (result as any[]).map(row => ({
        item: {
          id: row.id,
          nome: row.nome,
          tipo: row.tipo as 'produto' | 'servico'
        },
        quantidade: parseInt(row.quantidade_total)
      }));

      return {
        success: true,
        data: estatisticas
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obter consumo por tipo e raça de pet
  async obterConsumoPorTipoRaca(): Promise<ApiResponse<EstatisticasPet[]>> {
    try {
      // Primeiro, vamos obter os dados de produtos por pet
      const [produtosResult] = await pool.execute(`
        SELECT 
          pet.tipo,
          pet.raca,
          p.id as item_id,
          p.nome as item_nome,
          SUM(cp.quantidade) as quantidade_total
        FROM pets pet
        JOIN clientes c ON pet.cliente_id = c.id
        JOIN cliente_produtos cp ON c.id = cp.cliente_id
        JOIN produtos p ON cp.produto_id = p.id
        GROUP BY pet.tipo, pet.raca, p.id, p.nome
        HAVING quantidade_total > 0
      `);

      // Depois, vamos obter os dados de serviços por pet
      const [servicosResult] = await pool.execute(`
        SELECT 
          pet.tipo,
          pet.raca,
          s.id as item_id,
          s.nome as item_nome,
          COUNT(cs.id) as quantidade_total
        FROM pets pet
        JOIN clientes c ON pet.cliente_id = c.id
        JOIN cliente_servicos cs ON c.id = cs.cliente_id
        JOIN servicos s ON cs.servico_id = s.id
        GROUP BY pet.tipo, pet.raca, s.id, s.nome
        HAVING quantidade_total > 0
      `);

      // Combinar os resultados
      const todosResultados = [
        ...(produtosResult as any[]).map(row => ({ ...row, is_produto: true })),
        ...(servicosResult as any[]).map(row => ({ ...row, is_produto: false }))
      ];

      // Agrupar por tipo e raça
      const estatisticasPorPet = new Map<string, EstatisticasPet>();

      todosResultados.forEach(row => {
        const chave = `${row.tipo}-${row.raca}`;
        
        if (!estatisticasPorPet.has(chave)) {
          estatisticasPorPet.set(chave, {
            tipo: row.tipo,
            raca: row.raca,
            itens: []
          });
        }

        const estatistica = estatisticasPorPet.get(chave)!;
        estatistica.itens.push({
          item: {
            id: row.item_id,
            nome: row.item_nome,
            tipo: row.is_produto ? 'produto' : 'servico'
          },
          quantidade: parseInt(row.quantidade_total)
        });
      });

      return {
        success: true,
        data: Array.from(estatisticasPorPet.values())
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obter top 5 clientes por valor
  async obterTopClientesPorValor(): Promise<ApiResponse<EstatisticasConsumo[]>> {
    try {
      const [result] = await pool.execute(`
        SELECT 
          c.id,
          c.nome,
          (COALESCE(SUM(cp.quantidade), 0) + COALESCE(COUNT(cs.id), 0)) as quantidade_total,
          (COALESCE(SUM(cp.valor_total), 0) + COALESCE(SUM(cs.valor_total), 0)) as valor_total
        FROM clientes c
        LEFT JOIN cliente_produtos cp ON c.id = cp.cliente_id
        LEFT JOIN cliente_servicos cs ON c.id = cs.cliente_id
        GROUP BY c.id, c.nome
        HAVING valor_total > 0
        ORDER BY valor_total DESC
        LIMIT 5
      `);

      const estatisticas = (result as any[]).map(row => ({
        cliente: {
          id: row.id,
          nome: row.nome
        },
        quantidade: parseInt(row.quantidade_total),
        valor: parseFloat(row.valor_total)
      }));

      return {
        success: true,
        data: estatisticas
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
} 