"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"

interface Pet {
  id: number
  cliente_id: number
  nome: string
  raca: string
  genero: "M" | "F"
  tipo: string
}

interface Cliente {
  id: number
  nome: string
}

function Pets () {
  const [busca, setBusca] = useState("")
  const [exibirFormulario, setExibirFormulario] = useState(false)
  const [petSelecionado, setPetSelecionado] = useState<Pet | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [novoPet, setNovoPet] = useState<Partial<Pet>>({
    nome: "",
    raca: "",
    genero: "M",
    tipo: "",
    cliente_id: 0,
  })
  const [pets, setPets] = useState<Pet[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [petDetalhes, setPetDetalhes] = useState<Pet | null>(null)

  // Buscar pets e clientes reais do backend ao carregar a página
  useEffect(() => {
    fetch("http://localhost:3001/api/pets")
      .then(res => res.json())
      .then(json => {
        if (json.success) setPets(json.data)
      })
      .catch(err => {
        console.error("Erro ao buscar pets:", err)
      })

    fetch("http://localhost:3001/api/clientes")
      .then(res => res.json())
      .then(json => {
        if (json.success) setClientes(json.data)
      })
      .catch(err => {
        console.error("Erro ao buscar clientes:", err)
      })
  }, [])

  const handleBuscaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value)
  }

  const handleNovoPetClick = () => {
    setExibirFormulario(!exibirFormulario)
    setModoEdicao(false)
    setNovoPet({ nome: "", raca: "", genero: "M", tipo: "", cliente_id: 0 })
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNovoPet((prevState) => ({
      ...prevState,
      [name]: name === "cliente_id" ? Number(value) : value,
    }))
  }

  const handleSalvarPet = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const novo = {
      cliente_id: novoPet.cliente_id,
      nome: novoPet.nome,
      raca: novoPet.raca,
      genero: novoPet.genero,
      tipo: novoPet.tipo,
    }

    if (modoEdicao && petSelecionado) {
      // Edição
      fetch(`http://localhost:3001/api/pets/${petSelecionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo),
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setPets(prev =>
              prev.map(p =>
                p.id === petSelecionado.id
                  ? { ...p, ...json.data }
                  : p
              )
            )
            setNovoPet({ nome: "", raca: "", genero: "M", tipo: "", cliente_id: 0 })
            setExibirFormulario(false)
            setModoEdicao(false)
            setPetSelecionado(null)
          } else {
            alert(json.message || "Erro ao editar pet.")
          }
        })
        .catch(err => {
          alert("Erro ao editar pet.")
          console.error("Erro ao editar pet:", err)
        })
    } else {
      // Criação
      fetch("http://localhost:3001/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo),
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setPets(prev => [...prev, json.data])
            setNovoPet({ nome: "", raca: "", genero: "M", tipo: "", cliente_id: 0 })
            setExibirFormulario(false)
          }
        })
        .catch(err => {
          console.error("Erro ao salvar pet:", err)
        })
    }
  }

  const abrirModalDetalhes = (pet: Pet) => {
    setPetDetalhes(pet)
  }

  const fecharModalDetalhes = () => {
    setPetDetalhes(null)
  }

  const handleEditarPet = (pet: Pet) => {
    setNovoPet({
      nome: pet.nome,
      raca: pet.raca,
      genero: pet.genero,
      tipo: pet.tipo,
      cliente_id: pet.cliente_id,
    })
    setPetSelecionado(pet)
    setModoEdicao(true)
    setExibirFormulario(true)
  }

  const handleExcluirPet = (pet: Pet) => {
    if (window.confirm(`Deseja realmente excluir o pet "${pet.nome}"?`)) {
      fetch(`http://localhost:3001/api/pets/${pet.id}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setPets(prev => prev.filter(p => p.id !== pet.id))
            if (petSelecionado && petSelecionado.id === pet.id) {
              setPetSelecionado(null)
            }
          } else {
            alert(json.message || "Erro ao excluir pet.")
          }
        })
        .catch(() => alert("Erro ao excluir pet."))
    }
  }

  const petsFiltrados = pets.filter((pet) =>
    pet.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const getClienteNome = (cliente_id: number) => {
    const cliente = clientes.find(c => c.id === cliente_id)
    return cliente ? cliente.nome : "Desconhecido"
  }

  return (
    <div className="container-fluid min-vh-100 bg-dark text-light py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Pets Cadastrados</h2>
          <button
            className="btn text-dark fw-semibold"
            style={{ background: "#0dcaf0", border: "none" }}
            onClick={handleNovoPetClick}
          >
            {exibirFormulario ? (
              "Fechar"
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i> Novo Pet
              </>
            )}
          </button>
        </div>

        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome do pet..."
            value={busca}
            onChange={handleBuscaChange}
          />
        </div>

        {exibirFormulario && (
          <div className="card mb-4 bg-white text-dark">
            <div className="card-body">
              <h5 className="card-title">{modoEdicao ? "Editar Pet" : "Cadastrar Novo Pet"}</h5>
              <form onSubmit={handleSalvarPet}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={novoPet.nome || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Raça</label>
                    <input
                      type="text"
                      className="form-control"
                      name="raca"
                      value={novoPet.raca || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tipo</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tipo"
                      value={novoPet.tipo || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Gênero</label>
                    <select
                      className="form-select"
                      name="genero"
                      value={novoPet.genero || "M"}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="M">Macho</option>
                      <option value="F">Fêmea</option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Dono</label>
                    <select
                      className="form-select"
                      name="cliente_id"
                      value={novoPet.cliente_id || 0}
                      onChange={handleInputChange}
                      required
                    >
                      <option value={0}>Selecione...</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-success">
                      {modoEdicao ? "Salvar Alterações" : "Salvar Pet"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {petsFiltrados.map((pet) => (
            <div key={pet.id} className="col">
              <div className="card shadow-sm h-100 bg-white text-dark border-0">
                <div className="card-body">
                  <h5 className="card-title">{pet.nome}</h5>
                  <p>
                    <strong>Raça:</strong> {pet.raca}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {pet.tipo}
                  </p>
                  <p>
                    <strong>Gênero:</strong> {pet.genero === "M" ? "Macho" : "Fêmea"}
                  </p>
                  <p>
                    <strong>Dono:</strong> {getClienteNome(pet.cliente_id)}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-center gap-2 bg-white border-0">
                  <button className="btn btn-outline-dark btn-sm" onClick={() => abrirModalDetalhes(pet)}>
                    Ver Detalhes
                  </button>
                  <button className="btn btn-outline-warning btn-sm" onClick={() => handleEditarPet(pet)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleExcluirPet(pet)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Detalhes */}
        {petDetalhes && (
          <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content bg-white text-dark">
                <div className="modal-header">
                  <h5 className="modal-title">Detalhes do Pet</h5>
                  <button type="button" className="btn-close" onClick={fecharModalDetalhes}></button>
                </div>
                <div className="modal-body">
                  <p><strong>Nome:</strong> {petDetalhes.nome}</p>
                  <p><strong>Raça:</strong> {petDetalhes.raca}</p>
                  <p><strong>Tipo:</strong> {petDetalhes.tipo}</p>
                  <p><strong>Gênero:</strong> {petDetalhes.genero === "M" ? "Macho" : "Fêmea"}</p>
                  <p><strong>Dono:</strong> {getClienteNome(petDetalhes.cliente_id)}</p>
                </div>
                <div className="modal-footer bg-white">
                  <button className="btn btn-secondary" onClick={fecharModalDetalhes}>Fechar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pets
