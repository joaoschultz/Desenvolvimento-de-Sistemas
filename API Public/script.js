document.getElementById('buscar').addEventListener('click', async () => {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    const erro = document.getElementById('erro');
    const campos = ['logradouro', 'bairro', 'localidade', 'uf'];
    
    erro.textContent = '';
    campos.forEach(id => document.getElementById(id).textContent = '');
  
    if (cep.length !== 8) {
      erro.textContent = 'Por favor, digite um CEP válido com 8 dígitos.';
      return;
    }
  
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
  
      if (data.erro) {
        erro.textContent = 'CEP não encontrado.';
        return;
      }
  
      document.getElementById('logradouro').textContent = data.logradouro;
      document.getElementById('bairro').textContent = data.bairro;
      document.getElementById('localidade').textContent = data.localidade;
      document.getElementById('uf').textContent = data.uf;
  
    } catch {
      erro.textContent = 'Erro ao buscar o CEP. Tente novamente.';
    }
  });
  