/* O endereço da sua API Flask
const apiUrl = 'http://127.0.0.1:5000/';

const apiUrl2 = 'http://127.0.0.1:5000/two';

// Função assíncrona para buscar os dados
async function buscarDadosDaApi() {
    console.log('Tentando buscar dados da API1...');

    const response = await fetch(apiUrl);
    // Converte a resposta para JSON
    const dados = await response.json();
    // Faça algo com os dados recebidos

    console.log('Dados recebidos da API1:', dados);
}*/