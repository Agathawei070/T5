"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"

interface Documento {
  id: number
  tipo: string
  valor: string
  data_emissao: string
}

interface Cliente {
  id: number
  nome: string
  nome_social?: string
  email: string
  data_cadastro: string
  documentos?: Documento[]
  telefones?: { id: number; ddd: string; numero: string }[]
  enderecos?: {
    id: number
    estado: string
    cidade: string
    bairro: string
    rua: string
    numero: string
    complemento?: string
    cep: string
  }[]
  pets?: {
    id: number
    nome: string
    tipo: string
    raca: string
    genero: string
  }[]
}

function Clientes () {
  const [busca, setBusca] = useState("")
  const [exibirFormulario, setExibirFormulario] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [novoCliente, setNovoCliente] = useState<{ nome: string; nome_social?: string; email: string }>({
    nome: "",
    nome_social: "",
    email: "",
  })
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteDetalhes, setClienteDetalhes] = useState<Cliente | null>(null)
  const [telefone, setTelefone] = useState({ ddd: "", numero: "" })
  const [telefoneId, setTelefoneId] = useState<number | null>(null);
  const [cpf, setCpf] = useState("")
  const [endereco, setEndereco] = useState({
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
    cep: ""
  })

  // Buscar clientes reais do backend ao carregar a página
  useEffect(() => {
    fetch("http://localhost:3001/api/clientes")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setClientes(json.data)
        }
      })
      .catch(err => {
        console.error("Erro ao buscar clientes:", err)
      })
  }, [])

  const handleBuscaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value)
  }

  const handleNovoClienteClick = () => {
    setExibirFormulario(!exibirFormulario)
    setModoEdicao(false)
    setNovoCliente({ nome: "", nome_social: "", email: "" })
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNovoCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSalvarCliente = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 1. Cadastrar cliente
    const novoClienteBody: any = {
      nome: novoCliente.nome,
      email: novoCliente.email,
    }
    if (novoCliente.nome_social && novoCliente.nome_social.trim() !== "") {
      novoClienteBody.nome_social = novoCliente.nome_social
    }

    if (modoEdicao && clienteSelecionado) {
      // Atualiza cliente
      await fetch(`http://localhost:3001/api/clientes/${clienteSelecionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoCliente.nome,
          nome_social: novoCliente.nome_social,
          email: novoCliente.email,
        }),
      })

      // Atualiza telefone
      if (telefoneId) {
        await fetch(`http://localhost:3001/api/telefones/${telefoneId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ddd: telefone.ddd,
            numero: telefone.numero,
          }),
        })
      } else {
        await fetch("http://localhost:3001/api/telefones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_id: clienteSelecionado.id,
            ddd: telefone.ddd,
            numero: telefone.numero,
          }),
        })
      }

      // Atualiza CPF
      if (cpf) {
        const cpfExistente = clienteSelecionado.documentos?.find(doc => doc.tipo === "CPF")
        if (cpfExistente) {
          await fetch(`http://localhost:3001/api/documentos/${cpfExistente.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              valor: cpf,
              data_emissao: new Date().toISOString().slice(0, 10)
            }),
          })
        } else {
          await fetch("http://localhost:3001/api/documentos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cliente_id: clienteSelecionado.id,
              tipo: "CPF",
              valor: cpf,
              data_emissao: new Date().toISOString().slice(0, 10)
            }),
          })
        }
      }

      // Atualiza Endereço
      if (endereco.rua && endereco.numero) {
        const enderecoExistente = clienteSelecionado.enderecos?.[0]
        if (enderecoExistente) {
          await fetch(`http://localhost:3001/api/enderecos/${enderecoExistente.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(endereco),
          })
        } else {
          await fetch("http://localhost:3001/api/enderecos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cliente_id: clienteSelecionado.id, ...endereco }),
          })
        }
      }
    } else {
      const clienteRes = await fetch("http://localhost:3001/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoClienteBody),
      })
      const clienteJson = await clienteRes.json()
      if (!clienteJson.success) {
        alert(clienteJson.message || "Erro ao salvar cliente.")
        return
      }
      const clienteId = clienteJson.data.id

      // Telefone
      await fetch("http://localhost:3001/api/telefones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente_id: clienteId, ...telefone }),
      })

      // CPF
      await fetch("http://localhost:3001/api/documentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: clienteId,
          tipo: "CPF",
          valor: cpf,
          data_emissao: new Date().toISOString().slice(0, 10)
        }),
      })

      // Endereço
      await fetch("http://localhost:3001/api/enderecos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente_id: clienteId, ...endereco }),
      })
    }

    // Atualize a lista de clientes
    await fetch("http://localhost:3001/api/clientes")
      .then(res => res.json())
      .then(json => {
        if (json.success) setClientes(json.data)
      })

    setNovoCliente({ nome: "", nome_social: "", email: "" })
    setTelefone({ ddd: "", numero: "" })
    setCpf("")
    setEndereco({ estado: "", cidade: "", bairro: "", rua: "", numero: "", complemento: "", cep: "" })
    setExibirFormulario(false)
  }

  const abrirModalDetalhes = async (cliente: Cliente) => {
    const res = await fetch(`http://localhost:3001/api/clientes/${cliente.id}`)
    const json = await res.json()
    if (json.success) {
      setClienteDetalhes(json.data)
    } else {
      setClienteDetalhes(cliente) // fallback
    }
  }

  const fecharModalDetalhes = () => {
    setClienteDetalhes(null)
  }

  const handleEditarCliente = async (cliente: Cliente) => {
    // Busca os dados completos do cliente
    const res = await fetch(`http://localhost:3001/api/clientes/${cliente.id}`)
    const json = await res.json()
    if (json.success) {
      const dados = json.data
      setNovoCliente({
        nome: dados.nome,
        nome_social: dados.nome_social || "",
        email: dados.email,
      })
      setTelefone(
        dados.telefones && dados.telefones.length > 0
          ? { ddd: dados.telefones[0].ddd, numero: dados.telefones[0].numero }
          : { ddd: "", numero: "" }
      )
      setTelefoneId(
        dados.telefones && dados.telefones.length > 0
          ? dados.telefones[0].id
          : null
      );
      setCpf(
        dados.documentos && dados.documentos.length > 0
          ? (dados.documentos.find((doc: any) => doc.tipo === "CPF")?.valor || "")
          : ""
      )
      setEndereco(
        dados.enderecos && dados.enderecos.length > 0
          ? {
              estado: dados.enderecos[0].estado,
              cidade: dados.enderecos[0].cidade,
              bairro: dados.enderecos[0].bairro,
              rua: dados.enderecos[0].rua,
              numero: dados.enderecos[0].numero,
              complemento: dados.enderecos[0].complemento || "",
              cep: dados.enderecos[0].cep,
            }
          : {
              estado: "",
              cidade: "",
              bairro: "",
              rua: "",
              numero: "",
              complemento: "",
              cep: ""
            }
      )
      setClienteSelecionado(dados)
      setModoEdicao(true)
      setExibirFormulario(true)
      setClienteDetalhes(null) // fecha o modal de detalhes ao editar
    }
  }

  const handleExcluirCliente = (cliente: Cliente) => {
    if (window.confirm(`Deseja realmente excluir o cliente "${cliente.nome}"?`)) {
      fetch(`http://localhost:3001/api/clientes/${cliente.id}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setClientes(prev => prev.filter(c => c.id !== cliente.id))
            if (clienteSelecionado && clienteSelecionado.id === cliente.id) {
              setClienteSelecionado(null)
            }
          } else {
            alert(json.message || "Erro ao excluir cliente.")
          }
        })
        .catch(() => alert("Erro ao excluir cliente."))
    }
  }

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="container-fluid min-vh-100 bg-dark text-light py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Clientes Cadastrados</h2>
          <button
            className="btn text-dark fw-semibold"
            style={{ background: "#0dcaf0", border: "none" }}
            onClick={handleNovoClienteClick}
          >
            {exibirFormulario ? (
              "Fechar"
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i> Novo Cliente
              </>
            )}
          </button>
        </div>

        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={handleBuscaChange}
          />
        </div>

        {exibirFormulario && (
          <div className="card mb-4 bg-white text-dark">
            <div className="card-body">
              <h5 className="card-title">{modoEdicao ? "Editar Cliente" : "Cadastrar Novo Cliente"}</h5>
              <form onSubmit={handleSalvarCliente}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={novoCliente.nome}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome Social (opcional)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome_social"
                      value={novoCliente.nome_social}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">E-mail</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={novoCliente.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">DDD</label>
                    <input type="text" className="form-control" value={telefone.ddd} onChange={e => setTelefone({ ...telefone, ddd: e.target.value })} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Telefone</label>
                    <input type="text" className="form-control" value={telefone.numero} onChange={e => setTelefone({ ...telefone, numero: e.target.value })} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CPF</label>
                    <input type="text" className="form-control" value={cpf} onChange={e => setCpf(e.target.value)} required />
                  </div>
                  {/* Endereço */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Estado</label>
                    <input type="text" className="form-control" value={endereco.estado} onChange={e => setEndereco({ ...endereco, estado: e.target.value })} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cidade</label>
                    <input type="text" className="form-control" value={endereco.cidade} onChange={e => setEndereco({ ...endereco, cidade: e.target.value })} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Bairro</label>
                    <input type="text" className="form-control" value={endereco.bairro} onChange={e => setEndereco({ ...endereco, bairro: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Rua</label>
                    <input type="text" className="form-control" value={endereco.rua} onChange={e => setEndereco({ ...endereco, rua: e.target.value })} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Número</label>
                    <input type="text" className="form-control" value={endereco.numero} onChange={e => setEndereco({ ...endereco, numero: e.target.value })} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Complemento</label>
                    <input type="text" className="form-control" value={endereco.complemento} onChange={e => setEndereco({ ...endereco, complemento: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CEP</label>
                    <input type="text" className="form-control" value={endereco.cep} onChange={e => setEndereco({ ...endereco, cep: e.target.value })} required />
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-success">
                      {modoEdicao ? "Salvar Alterações" : "Salvar Cliente"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="col">
              <div className="card shadow-sm h-100 bg-white text-dark border-0">
                <div className="card-body">
                  <h5 className="card-title">{cliente.nome}</h5>
                  {cliente.nome_social && (
                    <p>
                      <strong>Nome Social:</strong> {cliente.nome_social}
                    </p>
                  )}
                  <p>
                    <strong>E-mail:</strong> {cliente.email}
                  </p>
                  <p>
                    <strong>Data de Cadastro:</strong> {new Date(cliente.data_cadastro).toLocaleDateString()}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-center gap-2 bg-white border-0">
                  <button className="btn btn-outline-dark btn-sm" onClick={() => abrirModalDetalhes(cliente)}>
                    Ver Detalhes
                  </button>
                  <button className="btn btn-outline-warning btn-sm" onClick={() => handleEditarCliente(cliente)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleExcluirCliente(cliente)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Detalhes */}
        {clienteDetalhes && (
          <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content bg-white text-dark">
                <div className="modal-header">
                  <h5 className="modal-title">Detalhes do Cliente</h5>
                  <button type="button" className="btn-close" onClick={fecharModalDetalhes}></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Nome:</strong> {clienteDetalhes.nome}
                  </p>
                  {clienteDetalhes.nome_social && (
                    <p>
                      <strong>Nome Social:</strong> {clienteDetalhes.nome_social}
                    </p>
                  )}
                  <p>
                    <strong>E-mail:</strong> {clienteDetalhes.email}
                  </p>
                  <p>
                    <strong>Data de Cadastro:</strong> {new Date(clienteDetalhes.data_cadastro).toLocaleDateString()}
                  </p>
                  {/* Telefones */}
                  {clienteDetalhes.telefones && clienteDetalhes.telefones.length > 0 && (
                    <p>
                      <strong>Telefone:</strong>{" "}
                      {clienteDetalhes.telefones.map(tel => `(${tel.ddd}) ${tel.numero}`).join(", ")}
                    </p>
                  )}
                  {/* Documentos */}
                  {clienteDetalhes.documentos && clienteDetalhes.documentos.length > 0 && (
                    <p>
                      <strong>CPF:</strong>{" "}
                      {clienteDetalhes.documentos
                        .filter(doc => doc.tipo === "CPF")
                        .map(doc => doc.valor)
                        .join(", ")}
                    </p>
                  )}
                  {/* Endereços */}
                  {clienteDetalhes.enderecos && clienteDetalhes.enderecos.length > 0 && (
                    <div>
                      <strong>Endereço:</strong>
                      <ul>
                        {clienteDetalhes.enderecos.map(end => (
                          <li key={end.id}>
                            {end.rua}, {end.numero} - {end.bairro}, {end.cidade} - {end.estado}, CEP: {end.cep}
                            {end.complemento && ` (${end.complemento})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Pets */}
                  {clienteDetalhes.pets && clienteDetalhes.pets.length > 0 && (
                    <div>
                      <strong>Pets:</strong>
                      <ul>
                        {clienteDetalhes.pets.map((pet: any) => (
                          <li key={pet.id}>
                            <strong>Nome:</strong> {pet.nome} | <strong>Tipo:</strong> {pet.tipo} | <strong>Raça:</strong> {pet.raca} | <strong>Gênero:</strong> {pet.genero === "M" ? "Macho" : "Fêmea"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="modal-footer bg-white">
                  <button className="btn btn-secondary" onClick={fecharModalDetalhes}>
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Clientes
