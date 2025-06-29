"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

interface Produto {
  id: number
  nome: string
  descricao?: string
  preco: number
  estoque: number
}

function Produtos () {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [novoProduto, setNovoProduto] = useState<Partial<Produto>>({
    nome: "",
    descricao: "",
    preco: 0,
    estoque: 0,
  })
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Buscar produtos reais do backend ao carregar a página
  useEffect(() => {
    fetch("http://localhost:3001/api/produtos")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setProdutos(
            json.data.map((p: any) => ({
              ...p,
              preco: Number(p.preco),
              estoque: Number(p.estoque),
            }))
          )
        }
      })
      .catch(err => {
        console.error("Erro ao buscar produtos:", err)
      })
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNovoProduto((prev) => ({
      ...prev,
      [name]: name === "preco" || name === "estoque" ? Number(value) : value,
    }))
  }

  const handleSalvarProduto = (e: FormEvent) => {
    e.preventDefault()

    if (modoEdicao && novoProduto.id) {
      // Atualizar produto real
      fetch(`http://localhost:3001/api/produtos/${novoProduto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto),
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setProdutos(prev =>
              prev.map(p =>
                p.id === novoProduto.id
                  ? { ...json.data, preco: Number(json.data.preco), estoque: Number(json.data.estoque) }
                  : p
              )
            )
            setModoEdicao(false)
            setProdutoSelecionado(null)
            setNovoProduto({ id: 0, nome: "", descricao: "", preco: 0, estoque: 0 })
            fecharModal()
          }
        })
        .catch(err => {
          console.error("Erro ao atualizar produto:", err)
        })
    } else {
      // Criar novo produto real
      fetch("http://localhost:3001/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto),
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setProdutos(prev => [
              ...prev,
              { ...json.data, preco: Number(json.data.preco), estoque: Number(json.data.estoque) }
            ])
            setNovoProduto({ id: 0, nome: "", descricao: "", preco: 0, estoque: 0 })
            fecharModal()
          }
        })
        .catch(err => {
          console.error("Erro ao salvar produto:", err)
        })
    }
  }

  const abrirModal = (produto: Produto, editar: boolean) => {
    setProdutoSelecionado(editar ? null : produto)
    setNovoProduto(editar ? { ...produto } : novoProduto)
    setModoEdicao(editar)
    setShowModal(true)
  }

  const fecharModal = () => {
    setProdutoSelecionado(null)
    setModoEdicao(false)
    setShowModal(false)
  }

  const abrirModalNovoProduto = () => {
    setNovoProduto({ id: 0, nome: "", descricao: "", preco: 0, estoque: 0 })
    abrirModal({ id: 0, nome: "", descricao: "", preco: 0, estoque: 0 }, true)
  }

  return (
    <div className="container-fluid min-vh-100 bg-dark text-light py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Produtos</h2>
          <button
            className="btn text-dark fw-semibold"
            style={{ background: "#0dcaf0", border: "none" }}
            onClick={abrirModalNovoProduto}
          >
            <i className="bi bi-plus-circle me-2"></i> Novo Produto
          </button>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {produtos.map((p) => (
            <div key={p.id} className="col">
              <div className="card h-100 shadow-sm bg-white text-dark border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{p.nome}</h5>
                  {p.descricao && (
                    <p className="card-text">
                      <strong>Descrição:</strong> {p.descricao}
                    </p>
                  )}
                  
                  <p className="card-text">
                    <strong>Preço:</strong> R$ {Number(p.preco).toFixed(2)}
                  </p>
                  <p className="card-text">
                    <strong>Estoque:</strong> {p.estoque}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-center gap-2 bg-white border-0">
                  <button className="btn btn-outline-dark btn-sm" onClick={() => abrirModal(p, false)}>
                    <i className="bi bi-eye"></i>
                  </button>
                  <button className="btn btn-outline-warning btn-sm" onClick={() => abrirModal(p, true)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={async () => {
                      if (window.confirm(`Deseja realmente excluir o produto "${p.nome}"?`)) {
                        try {
                          const res = await fetch(`http://localhost:3001/api/produtos/${p.id}`, {
                            method: "DELETE"
                          });
                          const json = await res.json();
                          if (json.success) {
                            setProdutos(prev => prev.filter(prod => prod.id !== p.id));
                          } else {
                            alert(json.message || "Erro ao excluir produto.");
                          }
                        } catch (err) {
                          alert("Erro ao excluir produto.");
                          console.error("Erro ao excluir produto:", err);
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
          <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modoEdicao
                      ? (novoProduto.id ? "Editar Produto" : "Novo Produto")
                      : "Detalhes do Produto"}
                  </h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={fecharModal}></button>
                </div>
                <div className="modal-body">
                  {modoEdicao ? (
                    <form onSubmit={handleSalvarProduto}>
                      <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nome"
                          value={novoProduto.nome || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Descrição</label>
                        <input
                          type="text"
                          className="form-control"
                          name="descricao"
                          value={novoProduto.descricao || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Preço</label>
                        <input
                          type="number"
                          className="form-control"
                          name="preco"
                          value={novoProduto.preco || 0}
                          onChange={handleInputChange}
                          required
                          min={0}
                          step={0.01}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Estoque</label>
                        <input
                          type="number"
                          className="form-control"
                          name="estoque"
                          value={novoProduto.estoque || 0}
                          onChange={handleInputChange}
                          required
                          min={0}
                        />
                      </div>
                      <div className="d-flex justify-content-end">
                        <button type="button" className="btn btn-secondary me-2" onClick={fecharModal}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Salvar
                        </button>
                      </div>
                    </form>
                  ) : (
                    produtoSelecionado && (
                      <div>
                        <p><strong>Nome:</strong> {produtoSelecionado.nome}</p>
                        <p><strong>Descrição:</strong> {produtoSelecionado.descricao}</p>
                        <p><strong>Preço:</strong> R$ {Number(produtoSelecionado.preco).toFixed(2)}</p>
                        <p><strong>Estoque:</strong> {produtoSelecionado.estoque}</p>
                        <div className="d-flex justify-content-end">
                          <button type="button" className="btn btn-secondary" onClick={fecharModal}>
                            Fechar
                          </button>
                        </div>
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

export default Produtos
