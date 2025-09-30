const express = require('express');  
const app = express();  
const port = 3000;   
 
app.use(express.json());

let tarefas = [
    { id: 1, nome: "Estudar Express", concluida: false },
    { id: 2, nome: "Fazer Exercicios", concluida: false }
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
    let tarefa = tarefas.find(u => u.id === id);
    // Se um usuário for encontrado, retorna-o em formato JSON
    if (tarefa) {
      res.json(tarefa);
    } else {
      // Se não encontrar, retorna o status 404 (Not Found)
      res.status(404).send('Tarefa não encontrado.');
    }
  });

// CREATE - Rota POST que receba um novo objeto de tarefa no corpo da requisição e o adicione à lista.
app.post('/tarefas', (req, res) => {
    let novaTarefa = req.body;
    // lógica de ID para atribuir um id único e seguro.
    if(!novaTarefa.nome || novaTarefa.concluida == false){
      return res.status(400).send('Não corresponde');
    }
    novatarefa = tarefas.length + 1; 
    tarefas.push(novaTarefa); 

    res.status(201).send("Tarefa criada");
  })
// UPDATE - Rota PUT    
app.put("/tarefas/:id",(req,res) => {
    const id = parseInt(req.params.id);
    let novasTarefas = req.body;  
    if(index !== -1){
      res.status(404).send("Nao encontrado"); 
    }
      tarefas[index] = novasTarefas; 

    const index = tarefas.findIndex(t => t.id === id); 
    res.status(200).send("Atualizado"); 
   
})
// DELETE - Rota que remove a tarefa com o id correspondente.
app.delete("/tarefas/:id", (req,res) => {
  const id = parseInt(req.params.id); 
  const index = tarefas.findIndex(t => t.id === id); 

  if (index !== -1) {
    tarefas.splice(index, 1);
    res.status(204).send("Solicitado com sucesso");
  } else {
    res.status(404).send('Tarefa não encontrada.');
  }
})


// Inicia o servidor
app.listen(port, () => {
  console.log("Servidor rodando em http://localhost:" + port);
});