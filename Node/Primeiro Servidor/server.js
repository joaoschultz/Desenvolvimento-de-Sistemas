const express = require('express'); // Importa o módulo 'express', para criar servidor web
const app = express();  // Cria uma instância do app Express
const port = 3000;  // Define a porta do servidor

// Middleware para interpretar JSON nas requisições (body parser)
app.use(express.json());

// Lista simulada de usuários em memória
let usuarios = [
    { id: 1, nome: "Rodrigo", idade: 19 },
    { id: 2, nome: "Gabriel", idade: 20 }
];

// Próximo ID a ser usado para criar um usuário novo
let nextId = 3;

// Rota raiz - teste simples
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Retorna todos os usuários
app.get("/usuarios", (req, res) => {
    res.send(usuarios);
});

// Retorna usuário pelo ID
app.get("/usuarios/:id", (req, res) => {
    const id = parseInt(req.params.id); // Pega o id da URL e converte pra número
    const usuario = usuarios.find(u => u.id === id); // Busca o usuário

    if (!usuario) {
        return res.status(404).send("Usuario nao encontrado"); // Se não achar, 404
    }
    res.status(200).send(usuario); // Envia o usuário encontrado
});

// POST - Cria um novo usuário
app.post("/usuarios", (req, res) => {
    let novoUsuario = req.body; // Pega dados do corpo da requisição

    // Validação simples: nome e idade obrigatórios e idade > 0
    if (!novoUsuario.nome || novoUsuario.idade <= 0) {
        return res.status(400).send("E necessario preencher nome e idade valida!");
    }

    novoUsuario.id = nextId; // Atribui o próximo ID
    nextId++;

    usuarios.push(novoUsuario); // Adiciona na lista

    res.status(201).send(novoUsuario); // Retorna o usuário criado com status 201 (Created)
});

// PUT - Atualiza um usuário pelo ID
app.put("/usuarios/:id", (req, res) => {
    const id = parseInt(req.params.id); // Pega o ID da URL
    let novosDados = req.body; // Dados para atualizar

    // Validação
    if (!novosDados.nome || novosDados.idade <= 0) {
        return res.status(400).send("E necessário preencher nome e idade valida!");
    }
   novosDados.id = id; 
    const index = usuarios.findIndex(u => u.id == id); // Encontra índice do usuário a ser atualizado

    if (index == -1) {
        res.status(404).send("Usuario nao encontrado");  // Se NÃO encontrar usuário com o ID (index == -1)
    }

    // Atualiza os dados do usuário mantendo o mesmo ID
    usuarios[index] = novosDados;
    
    res.status(200).send("Usuario atualizado"); // Retorna status 200 com o usuário atualizado
});

//DELETE - Remover usuario 
app.delete("/usuarios/id", (req,res) => {
    const id = parseInt(req.params.id); 
    const index = usuarios.findIndex(u => u.id == id); 

    if(index == -1) {
        res.status (404).send("Tarefa nao encontrado")
    }

    usuarios.splice(index, 1); 
    res.status(204).send(); 
})

// Inicia o servidor
app.listen(port, () => {
    console.log("Servidor rodando em http://localhost:" + port);
});