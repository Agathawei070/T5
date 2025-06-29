"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

interface Servico {
  id: number
  nome: string
  descricao?: string
  preco: number
  duracao_minutos: number
}

function Servicos () {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [novoServico, setNovoServico] = useState<Partial<Servico>>({
    nome: "",
    descricao: "",
    preco: 0,
    duracao_minutos: 0,
  })
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Buscar serviços reais do backend ao carregar a página
  useEffect(() => {
    fetch("http://localhost:3001/api/servicos")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          // Converta preco e duracao_minutos para número
          setServicos(
            json.data.map((s: any) => ({
              ...s,
              preco: Number(s.preco) || 0,
              duracao_minutos: Number(s.duracao_minutos) || 0,
            }))
          )
        }
      })
      .catch(err => {
        console.error("Erro ao buscar serviços:", err)
      })
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNovoServico((prev) => ({
      ...prev,
      [name]: name === "preco" || name === "duracao_minutos" ? Number(value) : value,
    }))
  }

  const handleSalvarServico = (e: FormEvent) => {
    e.preventDefault()

    if (modoEdicao && servicoSelecionado) {
      // Atualizar serviço
      fetch(`http://localhost:3001/api/servicos/${servicoSelecionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoServico),
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setServicos(prev =>
              prev.map(s => (s.id === servicoSelecionado.id
                ? {
                    ...json.data,
                    preco: Number(json.data.preco) || 0,
                    duracao_minutos: Number(json.data.duracao_minutos) || 0,
                  }
                : s))
            )
            setModoEdicao(false)
            setServicoSelecionado(null)
            setNovoServico({ nome: "", descricao: "", preco: 0, duracao_minutos: 0 })
            setShowModal(false)
          }
        })
        .catch(err => {
          console.error("Erro ao atualizar serviço:", err)
        })
    } else {
      // Criar novo serviço
      fetch("http://localhost:3001/api/servicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoServico),
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setServicos(prev => [
              ...prev,
              {
                ...json.data,
                preco: Number(json.data.preco) || 0,
                duracao_minutos: Number(json.data.duracao_minutos) || 0,
              }
            ])
            setNovoServico({ nome: "", descricao: "", preco: 0, duracao_minutos: 0 })
            setShowModal(false)
          }
        })
        .catch(err => {
          console.error("Erro ao salvar serviço:", err)
        })
    }
  }

  const abrirModal = (servico: Servico, editar: boolean) => {
    setServicoSelecionado(servico)
    setNovoServico({ ...servico })
    setModoEdicao(editar)
    setShowModal(true)
  }

  const fecharModal = () => {
    setServicoSelecionado(null)
    setModoEdicao(false)
    setShowModal(false)
  }

  const abrirModalNovoServico = () => {
    setNovoServico({ nome: "", descricao: "", preco: 0, duracao_minutos: 0 })
    abrirModal({ id: 0, nome: "", descricao: "", preco: 0, duracao_minutos: 0 }, true)
  }

  // Função utilitária para formatar minutos em horas e minutos
  function formatarDuracao(minutos: number) {
    if (minutos < 60) return `${minutos} minutos`
    const h = Math.floor(minutos / 60)
    const m = minutos % 60
    return m === 0
      ? `${h} hora${h > 1 ? "s" : ""}`
      : `${h} hora${h > 1 ? "s" : ""} e ${m} minutos`
  }

  return (
    <div className="container-fluid min-vh-100 bg-dark text-light py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Serviços</h2>
          <button
            className="btn btn-info text-dark fw-semibold"
            style={{ background: "#0dcaf0", border: "none" }}
            onClick={abrirModalNovoServico}
          >
            <i className="bi bi-plus-circle me-2"></i> Novo Serviço
          </button>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {servicos.map((s) => (
            <div key={s.id} className="col">
              <div className="card h-100 shadow-sm bg-white text-dark border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{s.nome}</h5>
                  {s.descricao && (
                    <p>
                      <strong>Descrição:</strong> {s.descricao}
                    </p>
                  )}
                  <p>
                    <strong>Preço:</strong> R$ {s.preco.toFixed(2)}
                  </p>
                  <p>
                    <strong>Duração:</strong> {formatarDuracao(s.duracao_minutos)}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-center gap-2 bg-white border-0">
                  <button className="btn btn-outline-dark btn-sm" onClick={() => abrirModal(s, false)}>
                    <i className="bi bi-eye"></i>
                  </button>
                  <button className="btn btn-outline-warning btn-sm" onClick={() => abrirModal(s, true)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={async () => {
                      if (window.confirm(`Deseja realmente excluir o serviço "${s.nome}"?`)) {
                        try {
                          const res = await fetch(`http://localhost:3001/api/servicos/${s.id}`, {
                            method: "DELETE"
                          });
                          const json = await res.json();
                          if (json.success) {
                            setServicos(prev => prev.filter(serv => serv.id !== s.id));
                          } else {
                            alert(json.message || "Erro ao excluir serviço.");
                          }
                        } catch (err) {
                          alert("Erro ao excluir serviço.");
                          console.error("Erro ao excluir serviço:", err);
                        }
                      }
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content bg-dark text-light">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title">{modoEdicao ? "Editar Serviço" : "Detalhes do Serviço"}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={fecharModal}></button>
                </div>
                <div className="modal-body">
                  {modoEdicao ? (
                    <form onSubmit={handleSalvarServico}>
                      <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input
                          className="form-control bg-secondary text-light border-0"
                          name="nome"
                          value={novoServico.nome || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Descrição</label>
                        <input
                          className="form-control bg-secondary text-light border-0"
                          name="descricao"
                          value={novoServico.descricao || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Preço</label>
                        <input
                          type="number"
                          className="form-control bg-secondary text-light border-0"
                          name="preco"
                          value={novoServico.preco || 0}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Duração (minutos)</label>
                        <input
                          type="number"
                          className="form-control bg-secondary text-light border-0"
                          name="duracao_minutos"
                          value={novoServico.duracao_minutos || 0}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="text-end">
                        <button type="submit" className="btn btn-success">
                          Salvar
                        </button>
                      </div>
                    </form>
                  ) : (
                    servicoSelecionado && (
                      <div>
                        <p>
                          <strong>Nome:</strong> {servicoSelecionado.nome}
                        </p>
                        {servicoSelecionado.descricao && (
                          <p>
                            <strong>Descrição:</strong> {servicoSelecionado.descricao}
                          </p>
                        )}
                        <p>
                          <strong>Preço:</strong> R$ {servicoSelecionado.preco.toFixed(2)}
                        </p>
                        <p>
                          <strong>Duração:</strong> {formatarDuracao(servicoSelecionado.duracao_minutos)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Servicos
