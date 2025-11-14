const express = require('express');
const app = express();
const port = 3000;

const db = require('./db');

app.use(express.json());

//  Gerar sessão 
function generateSessionId(){
  return crypto.randomBytes(24).toString("hex");
}

function authenticate(req,res,next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Sessão não informada"); 
  const session = sessions.get(token);
  if (!session) return res.status(401).send("Sessão inválida");
  req.user = {id: session.userId, email: session.email}; 
  next(); 
}

//  Logout
app.post("/logout", authenticate, (req,res) => {
  const token = req.headers["authorization"]; 
  if (token && sessions.has(token)) sessions.delete(token); 
  return res.sendStatus(204);
});

//  Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send("Email e senha são obrigatórios");
  }

  try {
    const [rows] = await db.query(
      "SELECT id, nome, email, senha FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0 || rows[0].senha !== senha) {
      return res.status(401).send("Credenciais inválidas");
    }

    const user = rows[0];
    const sessionId = generateSessionId();

    sessions.set(sessionId, { userId: user.id, email: user.email });

    return res.send({
      sessionId,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro interno do servidor");
  }
});

//  Usuarios
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
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
  }

  try {
    const [result] = await db.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email]);
    const novoUsuario = { idUsuario: result.insertId, nome, email };
    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro interno do servidor ao criar usuário.');
  }
});

app.put('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios para atualizar.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
      [nome, email, id]
    );

    console.log('Resultado do UPDATE:', result); 

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ idUsuario: id, nome, email });
  } catch (error) {
    console.error(`Erro ao atualizar usuário com ID ${id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
  }

  try {

    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

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

//  Categorias
app.get('/tarefas_categorias', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tarefas_categorias');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar tarefas_categorias:', error);
    res.status(500).send('Erro interno do servidor ao buscar tarefas_categorias.');
  }
});

app.get('/tarefas_categorias/:tarefa_id', async (req, res) => {
  const tarefa_id = parseInt(req.params.tarefa_id);

  if (isNaN(tarefa_id)) {
    return res.status(400).send('ID de tarefa inválido. Deve ser um número.');
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM tarefas_categorias WHERE tarefa_id = ?',
      [tarefa_id]
    );

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).send('Relação tarefa-categoria não encontrada.');
    }
  } catch (error) {
    console.error(`Erro ao buscar tarefa_categoria com tarefa_id ${tarefa_id}:`, error);
    res.status(500).send('Erro interno do servidor ao buscar tarefa_categoria.');
  }
});

app.post('/tarefas_categorias', async (req, res) => {
  const { tarefa_id, categoria_id } = req.body;

  if (!tarefa_id || !categoria_id) {
    return res.status(400).json({ error: 'tarefa_id e categoria_id são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO tarefas_categorias (tarefa_id, categoria_id) VALUES (?, ?)',
      [tarefa_id, categoria_id]
    );

    const novaRelacao = { tarefa_id, categoria_id };
    res.status(201).json(novaRelacao);
  } catch (error) {
    console.error('Erro ao criar relação tarefa-categoria:', error);
    res.status(500).send('Erro interno do servidor ao criar relação tarefa-categoria.');
  }
});

app.put('/tarefas_categorias/:tarefa_id', async (req, res) => {
  const tarefa_id = parseInt(req.params.tarefa_id);
  const { categoria_id } = req.body;

  if (isNaN(tarefa_id)) {
    return res.status(400).json({ error: 'ID de tarefa inválido. Deve ser um número.' });
  }

  if (!categoria_id) {
    return res.status(400).json({ error: 'categoria_id é obrigatório para atualizar.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE tarefas_categorias SET categoria_id = ? WHERE tarefa_id = ?',
      [categoria_id, tarefa_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relação tarefa-categoria não encontrada.' });
    }

    res.json({ tarefa_id, categoria_id });
  } catch (error) {
    console.error(`Erro ao atualizar tarefa_categoria com tarefa_id ${tarefa_id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao atualizar tarefa_categoria.' });
  }
});

app.delete('/tarefas_categorias/:tarefa_id', async (req, res) => {
  const tarefa_id = parseInt(req.params.tarefa_id);

  if (isNaN(tarefa_id)) {
    return res.status(400).json({ error: 'ID de tarefa inválido. Deve ser um número.' });
  }

  try {
    const [result] = await db.query(
      'DELETE FROM tarefas_categorias WHERE tarefa_id = ?',
      [tarefa_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relação tarefa-categoria não encontrada.' });
    }

    res.json({ message: `Relação tarefa-categoria com tarefa_id ${tarefa_id} removida com sucesso.` });
  } catch (error) {
    console.error(`Erro ao deletar tarefa_categoria com tarefa_id ${tarefa_id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao deletar tarefa_categoria.' });
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