const express = require('express');
const app = express();
const port = 3000;

const db = require('./db');

app.use(express.json()); 

app.get('/tarefas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tarefas');
    res.json(rows); 
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).send('Erro interno do servidor ao buscar tarefas.');
  }
});

app.get('/tarefas/:id', async (req, res) => {
  const id = parseInt(req.params.id); 

  if (isNaN(id)) {
    return res.status(400).send('ID inválido. O ID deve ser um número.');
  }

  try {
   
    const [rows] = await db.query('SELECT * FROM tarefas WHERE id = ?', [id]);

    if (rows.length > 0) {
      res.json(rows[0]); 
    } else {
      res.status(404).send('Tarefa não encontrada.');
    }
  } catch (error) {
    console.error(`Erro ao buscar tarefa com ID ${id}:`, error);
    res.status(500).send('Erro interno do servidor ao buscar tarefa.');
  }
});

app.post('/tarefas', async (req, res) => {
  const { titulo, descricao, concluida } = req.body;

  if (!titulo) {
    return res.status(400).send('O título da tarefa é obrigatório.');
  }

  try {
    const [result] = await db.query(
      'INSERT INTO tarefas (titulo, descricao, concluida) VALUES (?, ?, ?)',
      [titulo, descricao || null, concluida || false]
    );

    const novaTarefa = { id: result.insertId, titulo, descricao, concluida };
    res.status(201).json(novaTarefa); 
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).send('Erro interno do servidor ao criar tarefa.');
  }
});

app.put('/tarefas/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descricao, concluida } = req.body;

  if (isNaN(id)) {
    return res.status(400).send('ID inválido. O ID deve ser um número.');
  }
  if (!titulo && descricao === undefined && concluida === undefined) {
    return res.status(400).send('Pelo menos um campo (titulo, descricao, ou concluida) deve ser fornecido para atualização.');
  }

  try {

    const [existingRows] = await db.query('SELECT * FROM tarefas WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).send('Tarefa não encontrada para atualização.');
    }

    let updates = [];
    let params = [];
    if (titulo !== undefined) {
      updates.push('titulo = ?');
      params.push(titulo);
    }
    if (descricao !== undefined) {
      updates.push('descricao = ?');
      params.push(descricao);
    }
    if (concluida !== undefined) {
      updates.push('concluida = ?');
      params.push(concluida);
    }

    if (updates.length === 0) { 
      return res.status(400).send('Nenhum campo válido para atualização fornecido.');
    }

    const query = `UPDATE tarefas SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id); 

    const [result] = await db.query(query, params);

    if (result.affectedRows > 0) {

      const [updatedRows] = await db.query('SELECT * FROM tarefas WHERE id = ?', [id]);
      res.json(updatedRows[0]);
    } else {

      res.status(404).send('Tarefa não encontrada ou nenhum dado foi alterado.');
    }
  } catch (error) {
    console.error(`Erro ao atualizar tarefa com ID ${id}:`, error);
    res.status(500).send('Erro interno do servidor ao atualizar tarefa.');
  }
});

app.delete('/tarefas/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('ID inválido. O ID deve ser um número.');
  }

  try {
    const [result] = await db.query('DELETE FROM tarefas WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.status(204).send(); 
    } else {
      res.status(404).send('Tarefa não encontrada para exclusão.');
    }
  } catch (error) {
    console.error(`Erro ao excluir tarefa com ID ${id}:`, error);
    res.status(500).send('Erro interno do servidor ao excluir tarefa.');
  }
});

app.get('/tarefa', async (req,res)=>{
  const pesquisa = req.query.q;

  if(!pesquisa){
    return res
          .status(400)
          .send("É necessário informar o parâmetro 'q' para buscar");

  }

  try{
    const [rows] = await db.query(
      "SELECT * FROM tarefas WHERE titulo LIKE ?",
      [`%${pesquisa}%`]
    );

    return res.send(rows);
  } catch (err) {
    console.error("Erro ao pesquisar tarefas:", err.message);
    return res.status(500).send("Erro interno do servidor");
  }
});
  
app.get("/tarefas/status", async (req,res) =>{
  try {
    const [rows] = await db.query(`
    SELECT
      COUNT(CASE WHEN concluida = 1 THEN 1 END) AS concluidas,
      COUNT(CASE WHEN concluida = 0 THEN 1 END) AS pendentes
      FROM tarefas
    `);

    const { concluidas, pendentes} = rows[0];
    return res.send({ concluidas, pendentes});
  
  } catch (err){
    console.error("Erro ao buscar status das tarefas:", err.message);
    return res.status(500).send("Erro interno do servidor");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});