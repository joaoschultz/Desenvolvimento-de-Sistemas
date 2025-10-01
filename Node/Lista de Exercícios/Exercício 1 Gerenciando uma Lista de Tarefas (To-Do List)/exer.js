const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let tarefas = [
  { id: 1, titulo: "Estudar Express", concluida: false },
  { id: 2, titulo: "Fazer Exercicios", concluida: false }
];

// Próximo ID a ser usado para criar um usuário novo
let nextId = 3;

// READ ALL - Rota GET que retorne todas as tarefas
app.get("/tarefas", (req, res) => {
  res.send(tarefas);
});

// READ ONE - Rota GET que retorne uma única tarefa com base no seu id
app.get('/tarefas/:id', (req, res) => {
  // Extrai o ID da URL e converte para número
  const id = parseInt(req.params.id);
  // Busca o usuário no array pelo ID
  let tarefa = tarefas.find(t => t.id === id);
  // Se um usuário for encontrado, retorna-o em formato JSON
  if (!tarefa) {
    res.status(404).send('Tarefa não foi encontrada.'); // Se não encontrar, retorna o status 404 (Not Found)
  }
  res.send(tarefa);
});

// CREATE - Rota POST que receba um novo objeto de tarefa no corpo da requisição e o adicione à lista
app.post('/tarefas', (req, res) => {
  //Pega o atributo do objeto recebido 
  //Coloca em uma variavel do mesmo nome
  let { titulo } = req.body;

  let tarefa = { id: nextId, titulo: titulo, concluida: false };
  nextId++;

  tarefas.push(tarefa);
  res.status(201).send(tarefa);
})

// UPDATE - Rota PUT    
app.put("/tarefas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let tarefa = req.body;
  tarefa.id = id;
  // t - corresponde a uma iteração dos itens da lista
  // t.id  -E o id de cada tarefa
  // id = variavel id recebido na requisição 
  // Verificando cada tarefa até achar com o mesmo 
  let index = tarefas.findIndex(t => t.id === id);

  if (index == -1) {
    res.status(404).send("Tarefa não encontrada!");
  }
  tarefas[index] = tarefa;
  // 204 - Ok sem dados, nem mensagem 
  res.status(204).send();
})
// DELETE - Rota que remove a tarefa com o id correspondente
app.delete("/tarefas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let index = tarefas.findIndex(t => t.id === id);

  if (index == -1) {
    return res.status(404).send("Tarefa não encontrada")
  }

  tarefas.splice(index, 1);
  res.status(204).send("Tarefa deletada");
})

app.listen(port, () => {
  console.log("Servidor rodando em http://localhost:" + port);
});
