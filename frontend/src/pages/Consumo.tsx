"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

interface Cliente {
  id: number
  nome: string
}

interface Pet {
  id: number
  nome: string
  cliente_id: number
}

interface Item {
  id: number
  nome: string
  tipo: "Produto" | "Serviço"
  preco: number
}

interface ItemVenda {
  itemId: number
  tipo: "Produto" | "Serviço"
  nome: string
  quantidade: number
  precoUnitario: number
}

interface Venda {
  id: number
  data: string
  cliente: string
  formaPagamento: string
  itens: ItemVenda[]
  total: number
  status: string
}

function ListaVendas () {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [itensDisponiveis, setItensDisponiveis] = useState<Item[]>([])
  const [vendas, setVendas] = useState<Venda[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [indexEdicao, setIndexEdicao] = useState<number | null>(null)
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null)
  const [novaVenda, setNovaVenda] = useState({
    clienteId: 0,
    petId: 0, // novo campo
    formaPagamento: "",
    itens: [] as ItemVenda[],
    total: 0,
  })
  const [novoItem, setNovoItem] = useState({
    tipo: "Produto" as "Produto" | "Serviço",
    itemId: 0,
    quantidade: 1,
  })

  // Buscar dados reais do backend ao carregar a página
  useEffect(() => {
    // Clientes
    fetch("http://localhost:3001/api/clientes")
      .then(res => res.json())
      .then(json => {
        if (json.success) setClientes(json.data)
      })

    // Pets
    fetch("http://localhost:3001/api/pets")
      .then(res => res.json())
      .then(json => {
        if (json.success) setPets(json.data)
      })

    // Produtos
    fetch("http://localhost:3001/api/produtos")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const produtos: Item[] = json.data.map((p: any) => ({
            id: p.id,
            nome: p.nome,
            tipo: "Produto",
            preco: Number(p.preco), // CONVERSÃO AQUI
          }))
          setItensDisponiveis(prev => [...prev, ...produtos])
        }
      })

    // Serviços
    fetch("http://localhost:3001/api/servicos")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const servicos: Item[] = json.data.map((s: any) => ({
            id: s.id,
            nome: s.nome,
            tipo: "Serviço",
            preco: Number(s.preco), // CONVERSÃO AQUI
          }))
          setItensDisponiveis(prev => [...prev, ...servicos])
        }
      })
  }, [])

  // Novo useEffect para montar as vendas quando clientes e itensDisponiveis estiverem carregados
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/api/cliente-produtos").then(res => res.json()),
      fetch("http://localhost:3001/api/cliente-servicos").then(res => res.json())
    ]).then(([produtosResp, servicosResp]) => {
      let vendasTemp: Venda[] = []

      if (produtosResp.success) {
        produtosResp.data.forEach((cp: any) => {
          vendasTemp.push({
            id: cp.id,
            data: cp.data_compra,
            cliente: clientes.find(c => c.id === cp.cliente_id)?.nome || `Cliente #${cp.cliente_id}`,
            formaPagamento: "Desconhecido",
            itens: [
              {
                itemId: cp.produto_id,
                tipo: "Produto",
                nome: itensDisponiveis.find(i => i.id === cp.produto_id && i.tipo === "Produto")?.nome || "Produto",
                quantidade: Number(cp.quantidade),
                precoUnitario: Number(cp.valor_unitario),
              }
            ],
            total: Number(cp.valor_total),
            status: "Concluída"
          })
        })
      }
      if (servicosResp.success) {
        servicosResp.data.forEach((cs: any) => {
          vendasTemp.push({
            id: cs.id + 10000,
            data: cs.data_realizacao,
            cliente: clientes.find(c => c.id === cs.cliente_id)?.nome || `Cliente #${cs.cliente_id}`,
            formaPagamento: "Desconhecido",
            itens: [
              {
                itemId: cs.servico_id,
                tipo: "Serviço",
                nome: itensDisponiveis.find(i => i.id === cs.servico_id && i.tipo === "Serviço")?.nome || "Serviço",
                quantidade: 1,
                precoUnitario: Number(cs.valor_unitario),
              }
            ],
            total: Number(cs.valor_total),
            status: "Concluída"
          })
        })
      }
      setVendas(vendasTemp)
    })
  }, [clientes, itensDisponiveis])

  const handleClienteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNovaVenda((prev) => ({
      ...prev,
      clienteId: Number(e.target.value),
    }))
  }

  const handlePetChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNovaVenda((prev) => ({
      ...prev,
      petId: Number(e.target.value),
    }))
  }

  const handlePagamentoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNovaVenda((prev) => ({
      ...prev,
      formaPagamento: e.target.value,
    }))
  }

  const handleNovoItemChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setNovoItem((prev) => {
      if (name === "tipo") {
        return {
          ...prev,
          tipo: value as "Produto" | "Serviço",
          itemId: 0, // reseta o itemId ao trocar o tipo
        }
      }
      return {
        ...prev,
        [name]: name === "quantidade" ? Number(value) : value,
      }
    })
  }

  const adicionarItem = () => {
    const itemInfo = itensDisponiveis.find((i) => i.id === Number(novoItem.itemId) && i.tipo === novoItem.tipo)
    if (!itemInfo) return

    const novoItemVenda: ItemVenda = {
      itemId: itemInfo.id,
      nome: itemInfo.nome,
      tipo: itemInfo.tipo,
      quantidade: novoItem.quantidade,
      precoUnitario: itemInfo.preco,
    }

    const novosItens = [...novaVenda.itens, novoItemVenda]
    const novoTotal = novosItens.reduce((acc, item) => acc + item.quantidade * item.precoUnitario, 0)

    setNovaVenda((prev) => ({
      ...prev,
      itens: novosItens,
      total: novoTotal,
    }))
    setNovoItem({
      tipo: novoItem.tipo,
      itemId: 0,
      quantidade: 1,
    })
  }

  // Salva venda real no backend (cliente-produtos e cliente-servicos)
  const registrarVenda = async () => {
    const cliente = clientes.find((c) => c.id === novaVenda.clienteId)
    const pet = pets.find((p) => p.id === novaVenda.petId)
    if (!cliente || !pet) return

    // Salva cada item como uma venda separada (produto ou serviço)
    for (const item of novaVenda.itens) {
      if (item.tipo === "Produto") {
        await fetch("http://localhost:3001/api/cliente-produtos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_id: novaVenda.clienteId,
            pet_id: novaVenda.petId,
            produto_id: item.itemId,
            quantidade: item.quantidade,
            data_compra: new Date().toISOString().slice(0, 10),
            valor_unitario: item.precoUnitario,
            desconto: 0,
            valor_total: item.precoUnitario * item.quantidade
          })
        })
      } else {
        await fetch("http://localhost:3001/api/cliente-servicos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_id: novaVenda.clienteId,
            pet_id: novaVenda.petId,
            servico_id: item.itemId,
            data_realizacao: new Date().toISOString().slice(0, 10),
            valor_unitario: item.precoUnitario,
            desconto: 0,
            valor_total: item.precoUnitario * item.quantidade,
            observacoes: ""
          })
        })
      }
    }

    // Monta a venda localmente para exibir na lista
    const novaVendaObj: Venda = {
      id: Date.now(), // ou gere um id temporário
      data: new Date().toISOString(),
      cliente: clientes.find(c => c.id === novaVenda.clienteId)?.nome || "",
      formaPagamento: novaVenda.formaPagamento,
      itens: novaVenda.itens.map(item => ({
        ...item,
        nome: itensDisponiveis.find(i => i.id === item.itemId && i.tipo === item.tipo)?.nome || item.nome
      })),
      total: novaVenda.total,
      status: "Concluída"
    }

    setVendas(prev => [...prev, novaVendaObj])

    setMostrarFormulario(false)
    setIndexEdicao(null)
    setVendaSelecionada(null)
    setNovaVenda({
      clienteId: 0,
      petId: 0,
      formaPagamento: "",
      itens: [],
      total: 0,
    })
  }

  const visualizarVenda = (index: number) => {
    setVendaSelecionada(vendas[index])
    setIndexEdicao(index)
  }

  const cancelarFormulario = () => {
    setMostrarFormulario(false)
    setIndexEdicao(null)
    setNovaVenda({
      clienteId: 0,
      petId: 0,
      formaPagamento: "",
      itens: [],
      total: 0,
    })
  }

  const fecharModal = () => {
    setVendaSelecionada(null)
  }

  // Adicione esta função no componente ListaVendas:
  const excluirVenda = async (id: number) => {
    // Descobre se é produto ou serviço pelo id (ajuste conforme sua lógica de id)
    // Exemplo: ids acima de 10000 são serviços, abaixo são produtos (igual ao seu carregamento inicial)
    let endpoint = ""
    let venda = vendas.find(v => v.id === id)
    if (!venda) return

    // Se a venda tem apenas itens de produto, exclua de cliente-produtos, se for serviço, de cliente-servicos
    if (venda.itens.length > 0 && venda.itens[0].tipo === "Produto") {
      endpoint = `cliente-produtos/${id}`
    } else if (venda.itens.length > 0 && venda.itens[0].tipo === "Serviço") {
      // Se você somou 10000 ao id de serviço, subtraia aqui para pegar o id real do backend
      endpoint = `cliente-servicos/${id > 10000 ? id - 10000 : id}`
    } else {
      alert("Tipo de venda não identificado para exclusão.")
      return
    }

    if (window.confirm("Deseja realmente excluir esta venda?")) {
      const res = await fetch(`http://localhost:3001/api/${endpoint}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setVendas(prev => prev.filter(v => v.id !== id))
        if (vendaSelecionada && vendaSelecionada.id === id) {
          setVendaSelecionada(null)
        }
      } else {
        alert("Erro ao excluir venda no backend.")
      }
    }
  }

  return (
    <div className="container-fluid min-vh-100 bg-dark text-light py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0">Lista de Vendas</h3>
          {!mostrarFormulario && (
            <button
              className="btn text-dark fw-semibold"
              style={{ background: "#0dcaf0", border: "none" }}
              onClick={() => {
                setMostrarFormulario(true)
                setIndexEdicao(null)
              }}
            >
              <i className="bi bi-plus-circle"></i> Nova Venda
            </button>
          )}
        </div>

        <div className="mb-4"></div>

        {!mostrarFormulario ? (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <ul className="list-group mb-4">
                {vendas.map((v, index) => (
                  <li
                    key={v.id}
                    className="list-group-item bg-white text-dark mb-3 shadow-sm rounded-4 border-0 px-3 py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between"
                    style={{ transition: "box-shadow 0.2s" }}
                  >
                    <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 flex-grow-1">
                      <span className="badge bg-info text-dark fs-6 px-3 py-2 mb-2 mb-md-0">#{v.id}</span>
                      <div>
                        <strong className="me-2">Cliente:</strong>
                        {v.cliente}
                      </div>
                      <div>
                        <strong className="me-2">Data:</strong>
                        {new Date(v.data).toLocaleDateString()}
                      </div>
                      <div>
                        <strong className="me-2">Total:</strong>
                        R$ {v.total.toFixed(2)}
                      </div>
                      <div>
                        <span className="badge bg-success">{v.status}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => visualizarVenda(index)}
                        title="Ver detalhes"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => excluirVenda(v.id)}
                        title="Excluir venda"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="card bg-white text-dark">
            <div className="card-header">
              <h5 className="fw-bold">{indexEdicao !== null ? "Editar Venda" : "Cadastrar Nova Venda"}</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Cliente</label>
                <select className="form-select" value={novaVenda.clienteId} onChange={handleClienteChange} required>
                  <option value={0}>Selecione...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Pet</label>
                <select
                  className="form-select"
                  value={novaVenda.petId}
                  onChange={handlePetChange}
                  required
                  disabled={novaVenda.clienteId === 0}
                >
                  <option value={0}>Selecione...</option>
                  {pets
                    .filter((p) => p.cliente_id === novaVenda.clienteId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Forma de Pagamento</label>
                <select
                  className="form-select"
                  value={novaVenda.formaPagamento}
                  onChange={handlePagamentoChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão">Cartão</option>
                  <option value="Pix">Pix</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Adicionar Item</label>
                <div className="row g-2">
                  <div className="col-md-3">
                    <select className="form-select" name="tipo" value={novoItem.tipo} onChange={handleNovoItemChange}>
                      <option value="Produto">Produto</option>
                      <option value="Serviço">Serviço</option>
                    </select>
                  </div>
                  <div className="col-md-5">
                    <select
                      className="form-select"
                      name="itemId"
                      value={novoItem.itemId}
                      onChange={handleNovoItemChange}
                    >
                      <option value={0}>Selecione...</option>
                      {itensDisponiveis
                        .filter(item => item.tipo === novoItem.tipo)
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nome} ({item.tipo})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      className="form-control"
                      name="quantidade"
                      min={1}
                      value={novoItem.quantidade}
                      onChange={handleNovoItemChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-success w-100"
                      type="button"
                      onClick={adicionarItem}
                      disabled={novoItem.itemId === 0}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
              {novaVenda.itens.length > 0 && (
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Item</th>
                      <th>Quantidade</th>
                      <th>Preço Unitário</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {novaVenda.itens.map((item, i) => (
                      <tr key={i}>
                        <td>{item.tipo}</td>
                        <td>{item.nome}</td>
                        <td>{item.quantidade}</td>
                        <td>R$ {item.precoUnitario.toFixed(2)}</td>
                        <td>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="text-end mb-3">
                <strong>Total: R$ {novaVenda.total.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" type="button" onClick={cancelarFormulario}>
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={registrarVenda}
                  disabled={novaVenda.clienteId === 0 || novaVenda.petId === 0 || !novaVenda.formaPagamento || novaVenda.itens.length === 0}
                >
                  {indexEdicao !== null ? "Salvar Alterações" : "Cadastrar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Visualizar Venda */}
        {vendaSelecionada && (
          <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-white text-dark">
                  <h5 className="modal-title">
                    Detalhes da Venda #{vendaSelecionada ? vendaSelecionada.id : ""}
                  </h5>
                  <button type="button" className="btn-close" onClick={fecharModal}></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Cliente:</strong> {vendaSelecionada ? vendaSelecionada.cliente : ""}
                  </p>
                  <p>
                    <strong>Itens:</strong> {vendaSelecionada ? vendaSelecionada.itens.map(item => item.nome).join(", ") : ""}
                  </p>
                  <p>
                    <strong>Data:</strong> {vendaSelecionada ? new Date(vendaSelecionada.data).toLocaleDateString() : ""}
                  </p>
                  <p>
                    <strong>Forma de Pagamento:</strong> {vendaSelecionada ? vendaSelecionada.formaPagamento : ""}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-success">
                      {vendaSelecionada ? vendaSelecionada.status : ""}
                    </span>
                  </p>
                  <hr />
                  <h6>Itens da Venda:</h6>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Item</th>
                        <th>Quantidade</th>
                        <th>Preço Unitário</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendaSelecionada && vendaSelecionada.itens.map((item, i) => (
                        <tr key={i}>
                          <td>{item.tipo}</td>
                          <td>{item.nome}</td>
                          <td>{item.quantidade}</td>
                          <td>R$ {item.precoUnitario.toFixed(2)}</td>
                          <td>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-end">
                    <strong>
                      Total: R$ {vendaSelecionada ? vendaSelecionada.total.toFixed(2) : ""}
                    </strong>
                  </div>
                </div>
                <div className="modal-footer bg-white">
                  <button className="btn btn-secondary" onClick={fecharModal}>
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

export default ListaVendas
