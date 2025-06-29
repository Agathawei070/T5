"use client"

import { useEffect, useState } from "react"

type ClienteStats = {
  nome: string
  quantidadeCompras: number
  valorTotal: number
}

type ItemStats = {
  nome: string
  tipo: string
  quantidade: number
}

type PetStats = {
  tipo: string
  raca: string
  nome: string
  tipoItem: string
  quantidade: number
}

function Estatisticas () {
  const [topClientesQuantidade, setTopClientesQuantidade] = useState<ClienteStats[]>([])
  const [topClientesValor, setTopClientesValor] = useState<ClienteStats[]>([])
  const [itensMaisConsumidos, setItensMaisConsumidos] = useState<ItemStats[]>([])
  const [consumoPorTipoRaca, setConsumoPorTipoRaca] = useState<PetStats[]>([])

  useEffect(() => {
    // Top 10 clientes por quantidade
    fetch("http://localhost:3001/api/estatisticas/top-clientes-quantidade")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setTopClientesQuantidade(
            json.data.map((c: any) => ({
              nome: c.cliente?.nome || c.nome || "Desconhecido",
              quantidadeCompras: Number(c.quantidade) || Number(c.quantidade_consumida) || 0,
              valorTotal: Number(c.valor) || Number(c.valor_total) || 0
            }))
          )
        }
      })

    // Top 5 clientes por valor
    fetch("http://localhost:3001/api/estatisticas/top-clientes-valor")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setTopClientesValor(
            json.data.map((c: any) => ({
              nome: c.cliente?.nome || c.nome || "Desconhecido",
              quantidadeCompras: Number(c.quantidade) || Number(c.quantidade_consumida) || 0,
              valorTotal: Number(c.valor) || Number(c.valor_total) || 0
            }))
          )
        }
      })

    // Itens mais consumidos
    fetch("http://localhost:3001/api/estatisticas/itens-mais-consumidos")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setItensMaisConsumidos(
            json.data.map((entry: any) => ({
              nome: entry.item?.nome || "Desconhecido",
              tipo: entry.item?.tipo === "produto" ? "Produto" : "Serviço",
              quantidade: Number(entry.quantidade) || 0
            }))
          )
        }
      })

    // Consumo por tipo e raça de pet
    fetch("http://localhost:3001/api/estatisticas/consumo-por-tipo-raca")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const lista: PetStats[] = []
          json.data.forEach((pet: any) => {
            (pet.itens || []).forEach((entry: any) => {
              lista.push({
                tipo: pet.tipo,
                raca: pet.raca,
                nome: entry.item?.nome || "Desconhecido",
                tipoItem: entry.item?.tipo === "produto" ? "Produto" : "Serviço",
                quantidade: Number(entry.quantidade) || 0
              })
            })
          })
          setConsumoPorTipoRaca(lista)
        }
      })
  }, [])

  return (
    <div className="container-fluid min-vh-100 bg-dark text-light py-5">
      <div className="container">
        <h2 className="fw-bold mb-4">Estatísticas</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card bg-white text-dark shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">
                  <i className="bi bi-trophy-fill text-warning me-2"></i>
                  Top 10 Clientes por Quantidade
                </h5>
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th className="text-center">Compras</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topClientesQuantidade.map((c, i) => (
                        <tr key={i}>
                          <td className="fw-bold">{i + 1}</td>
                          <td>{c.nome}</td>
                          <td className="text-center">
                            <span className="badge bg-info text-dark">
                              {(typeof c.quantidadeCompras === "number" && !isNaN(c.quantidadeCompras) ? c.quantidadeCompras : 0).toString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-white text-dark shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">
                  <i className="bi bi-cash-coin text-success me-2"></i>
                  Top 5 Clientes por Valor
                </h5>
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th className="text-end">Valor Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topClientesValor.map((c, i) => (
                        <tr key={i}>
                          <td className="fw-bold">{i + 1}</td>
                          <td>{c.nome}</td>
                          <td className="text-end">
                            <span className="badge bg-success bg-opacity-75">
                              R$ {(typeof c.valorTotal === "number" && !isNaN(c.valorTotal) ? c.valorTotal : 0).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-white text-dark shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">
                  <i className="bi bi-star-fill text-primary me-2"></i>
                  Itens Mais Consumidos
                </h5>
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Tipo</th>
                        <th className="text-center">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensMaisConsumidos.map((item, i) => (
                        <tr key={i}>
                          <td>{item.nome}</td>
                          <td>
                            <span
                              className={`badge ${item.tipo === "Produto" ? "bg-primary" : "bg-warning text-dark"}`}
                            >
                              {item.tipo}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-info text-dark">
                              {(typeof item.quantidade === "number" && !isNaN(item.quantidade) ? item.quantidade : 0).toString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-white text-dark shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">
                  <i className="bi bi-emoji-smile text-danger me-2"></i>
                  Consumo por Tipo e Raça de Pet
                </h5>
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Raça</th>
                        <th>Item</th>
                        <th>Tipo Item</th>
                        <th className="text-center">Consumos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumoPorTipoRaca.map((pet, i) => (
                        <tr key={i}>
                          <td>{pet.tipo}</td>
                          <td>{pet.raca}</td>
                          <td>{pet.nome}</td>
                          <td>
                            <span className={`badge ${pet.tipoItem === "Produto" ? "bg-primary" : "bg-warning text-dark"}`}>
                              {pet.tipoItem}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-info text-dark">
                              {(typeof pet.quantidade === "number" && !isNaN(pet.quantidade) ? pet.quantidade : 0).toString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="alert alert-info mt-5">
          <strong>Análise segmentada:</strong> Os dados acima permitem identificar clientes mais fiéis, produtos e
          serviços de maior demanda e preferências por tipo/raça de pet, auxiliando em campanhas e decisões
          estratégicas.
        </div>
      </div>
    </div>
  )
}

export default Estatisticas
