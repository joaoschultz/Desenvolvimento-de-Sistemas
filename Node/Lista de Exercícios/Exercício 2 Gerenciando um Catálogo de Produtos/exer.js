const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const produtos = [
    { id: 1, nome: "Teclado Mecanico", preco: 350.00, emEstoque: true },
    { id: 2, nome: "Mouse Gamer", preco: 180.00, emEstoque: false },
    { id: 3, nome: "Monitor UltraWide", preco: 1500.00, emEstoque: true }
];

// Próximo ID a ser usado para criar um usuário novo
let nextId = 3;

// READ ALL - Rota GET que retorne todas as tarefas
app.get("/produtos", (req, res) => {
    res.send(produtos);
});

//READ ONE
app.get("/produtos/em-estoque", (req, res) => {
    // Filtra os produtos onde 'emEstoque' é verdadeiro
    const produtosEmEstoque = produtos.filter(p => p.emEstoque === true);

    if (produtosEmEstoque) {
        res.send(produtosEmEstoque);
    } if (produtosEmEstoque === false) {
        return res.status(404).send('Nenhum produto em estoque');
    }

});

app.get("/produtos/pesquisar", (req, res) => {
    const nomePesquisa = req.query.nome;

    if (!nomePesquisa) {
        return res.status(400).send("Parâmetro 'nome' é obrigatório na consulta.");
    }

    const produtosEncontrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(nomePesquisa.toLowerCase())
    );

    if (produtosEncontrados.length === 0) {
        return res.status(404).send("Nenhum produto encontrado com esse nome.");
    }

    res.send(produtosEncontrados);
});

// Rota para atualizar preço
app.patch('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const novoPreco = req.body.preco;

    if (novoPreco === undefined) {
        return res.status(400).send('É necessário informar o novo preço no corpo da requisição.');
    }

    const index = produtos.findIndex(p => p.id === id);

    if (index !== -1) {
        produtos[index].preco = novoPreco;
        res.json(produtos[index]);
    } else {
        res.status(404).send('Produto não encontrado.');
    }
});

app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const novoProduto = req.body;

    if (!novoProduto.categoria) {
        return res.status(400).send("A categoria é obrigatória para a substituição do produto.");
    }

    const index = produtos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).send("Produto não encontrado.");
    }

    produtos[index] = { ...novoProduto, id }; 
    res.json(produtos[index]);
});

app.listen(port, () => {
    console.log("Servidor rodando em http://localhost:" + port);
});
