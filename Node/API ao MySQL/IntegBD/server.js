const express = require('express');
const app = express();
const port = 3000;

const db = require('./db');

app.use(express.json());

app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuarios:', error);
    res.status(500).send('Erro interno do servidor ao buscar usuarios.');
  }
});

app.get('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('ID inválido. O ID deve ser um número.');
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE idUsuario = ?', [id]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('Usuário não encontrado.');
    }
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${id}:`, error);
    res.status(500).send('Erro interno do servidor ao buscar usuário.');
  }
});

let usuarios = [
  { id: 1, nome: 'Rodrigo', email: 'rodrigo@gmail.com' },
  { id: 2, nome: 'Gabriel', email: 'gabriel@gmail.com' },
  { id: 3, nome: 'João', email: 'joao@gmail.com' },
];

app.post('/usuarios', async (req, res) => {
  const { nome, idade } = req.body;

  if (!nome || !idade) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
  }

  try {
    const [result] = await db.query('INSERT INTO usuarios (nome, idade) VALUES (?, ?)', [nome, idade]);
    const novoUsuario = { idUsuario: result.insertId, nome, idade };
    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro interno do servidor ao criar usuário.');
  }
});

app.put('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, idade } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  if (!nome || !idade) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios para atualizar.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE usuarios SET nome = ?, idade = ? WHERE idUsuario = ?',
      [nome, idade, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ idUsuario: id, nome, idade });
  } catch (error) {
    console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao atualizar usuário.' });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {

    const [result] = await db.query('DELETE FROM usuarios WHERE idUsuario = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ message: `Usuário com ID ${id} foi removido com sucesso.` });
  } catch (error) {
    console.error(`Erro ao deletar usuário com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao deletar usuário.' });
  }
});

// Dados do Usuario
// Dados do Usuario
app.get('/dadosUsuarios', async (req, res) => {
  console.log('→ Rota /dadosUsuarios foi chamada');
  try {
    const [rows] = await db.query('SELECT * FROM api_aula_db.dados_usuarios');
    console.log('→ Resultado da consulta:', rows);
    res.json(rows);
  } catch (error) {
    console.error('→ Erro detalhado:', error);
    res.status(500).json({ erro: error.message });
  }
});

app.get('/dadosUsuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('ID inválido. O ID deve ser um número.');
  }

  try {
    const [rows] = await db.query('SELECT * FROM api_aula_db.dados_usuarios WHERE id = ?', [id]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('Usuário não encontrado.');
    }
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${id}:`, error);
    res.status(500).send('Erro interno do servidor ao buscar usuário.');
  }
});

app.post('/dadosUsuarios', async (req, res) => {
  const { usuario_id, biografia, url_foto, data_nascimento, telefone } = req.body;

  if (!usuario_id || !biografia || !url_foto || !data_nascimento || !telefone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO api_aula_db.dados_usuarios (usuario_id, biografia, url_foto, data_nascimento, telefone) VALUES (?, ?, ?, ?, ?)',
      [usuario_id, biografia, url_foto, data_nascimento, telefone]
    );

    const novoRegistro = { id: result.insertId, usuario_id, biografia, url_foto, data_nascimento, telefone };
    res.status(201).json(novoRegistro);
  } catch (error) {
    console.error('Erro ao criar dadosUsuario:', error);
    res.status(500).send('Erro interno do servidor ao criar dadosUsuario.');
  }
});

app.put('/dadosUsuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { biografia, url_foto, data_nascimento, telefone } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE api_aula_db.dados_usuarios SET biografia = ?, url_foto = ?, data_nascimento = ?, telefone = ? WHERE id = ?',
      [biografia, url_foto, data_nascimento, telefone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ id, biografia, url_foto, data_nascimento, telefone });
  } catch (error) {
    console.error(`Erro ao atualizar dadosUsuario com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao atualizar dadosUsuario.' });
  }
});

app.delete('/dadosUsuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {
    const [result] = await db.query('DELETE FROM api_aula_db.dados_usuarios WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ message: `Registro com ID ${id} foi removido com sucesso.` });
  } catch (error) {
    console.error(`Erro ao deletar dadosUsuario com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao deletar dadosUsuario.' });
  }
});

//  Tarefas
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