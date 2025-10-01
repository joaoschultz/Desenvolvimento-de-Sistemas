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


//READ ONE
app.get("/produtos/:em-estoque", (req, res) => {
    const id = parseInt(req, params.id);
    let produto = produtos.find(p => p.id === id);
    if (produto === false) {
        res.status(404).send('Produto não corresponde');
    } else {
        res.send(produtos);
    }

});

app.listen(port, () => {
    console.log("Servidor rodando em http://localhost:" + port);
});
