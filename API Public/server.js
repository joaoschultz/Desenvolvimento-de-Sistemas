import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint intermediário
app.get("/api/cep/:cep", async (req, res) => {
  const { cep } = req.params;

  if (!/^\d{8}$/.test(cep)) {
    return res.status(400).json({ erro: "CEP inválido. Use apenas números (8 dígitos)." });
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      return res.status(404).json({ erro: "CEP não encontrado." });
    }

    // Tratamento: formatando e retornando somente campos úteis
    const endereco = {
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento || "-",
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      ibge: data.ibge,
    };

    res.json(endereco);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar dados no ViaCEP." });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
