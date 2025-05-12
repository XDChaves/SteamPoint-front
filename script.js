// O endereço da sua API Flask
const apiUrl = 'http://127.0.0.1:5000/';

// Função assíncrona para buscar os dados
async function buscarDadosDaApi() {
    console.log('Tentando buscar dados da API...');

    const response = await fetch(apiUrl);
    // Converte a resposta para JSON
    const dados = await response.json();
    // Faça algo com os dados recebidos
    console.log('Dados recebidos da API:', dados);
}

// Adiciona um listener que chama a função quando o HTML inicial for carregado e parseado
document.addEventListener('DOMContentLoaded', buscarDadosDaApi);