        const apiUrl = 'http://127.0.0.1:5000/';

        async function buscarDadosDaApi() {
            try {
                console.log('Tentando buscar dados da API...');
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                }
                const dados = await response.json();
                console.log('Dados recebidos da API:', dados);
                atualizarTabela(dados);
                criarGraficoTipos(dados, 'bar');
                criarGraficoGratuidade(dados, 'bar');
                criarGraficoLancamentosAnuais(dados);

                document.getElementById('tipo-grafico-tipo').addEventListener('change', (event) => {
                    criarGraficoTipos(dados, event.target.value);
                });

                document.getElementById('tipo-grafico-gratuito').addEventListener('change', (event) => {
                    criarGraficoGratuidade(dados, event.target.value);
                });


            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
                $('#myTable').html(`<p class="text-red-500">Erro ao carregar os dados: ${error.message}</p>`);
            }
        }

        function atualizarTabela(dados) {
            if (dados && dados.data && dados.data.length > 0) {
                $('#myTable').DataTable({
                    data: dados.data,
                    columns: [
                        { "data": "app_id" },
                        { "data": "name" },
                        { "data": "release_date" },
                        { "data": "is_free" },
                        { "data": "type" }
                    ],
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
                    },
                    "responsive": true,
                    "autoWidth": false,
                    "deferRender": true,
                    "initComplete": function(settings, json) {
                        if (json && json.data && json.data.length > 0) {
                            $('#myTable').find('td').html('');
                        }
                    }
                });
            } else {
                $('#myTable').html('<p class="text-center text-gray-500">Nenhum dado encontrado.</p>');
            }
        }

        let tipoJogoChartInstance = null;
        const tipoJogoCores = ['#0856FFFF', '#FF3CAEFF']; // Cores fixas
        function criarGraficoTipos(dados, tipoGrafico) {
            const tipos = {};
            if(dados && dados.data){
                 dados.data.forEach(item => {
                    tipos[item.type] = (tipos[item.type] || 0) + 1;
                });
            }


            const labels = Object.keys(tipos);
            const valores = Object.values(tipos);
            //const cores = gerarCoresAleatorias(labels.length);

            const ctx = document.getElementById('tipo-jogo-chart').getContext('2d');

            if (tipoJogoChartInstance) {
                tipoJogoChartInstance.destroy();
            }

            const graficoConfig = {
                type: tipoGrafico,
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: tipoJogoCores.slice(0, labels.length), // Usa as cores fixas
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: false,
                            text: 'Tipos de Jogos'
                        }
                    }
                }
            };

            if (tipoGrafico === 'pie' || tipoGrafico === 'doughnut') {
                graficoConfig.options.plugins.legend.position = 'right';
            }

            tipoJogoChartInstance = new Chart(ctx, graficoConfig);
        }

        let gratuidadeChartInstance = null;
        const gratuidadeCores = ['#FF9C08FF', '#F44336']; // Cores fixas para gratuidade
        function criarGraficoGratuidade(dados, tipoGrafico) {
            const gratuidade = {
                Gratuito: 0,
                Pago: 0
            };

            if(dados && dados.data){
                dados.data.forEach(item => {
                    if (item.is_free) {
                        gratuidade.Gratuito++;
                    } else {
                        gratuidade.Pago++;
                    }
                });
            }


            const labels = Object.keys(gratuidade);
            const valores = Object.values(gratuidade);
            //const cores = ['#FF9C08FF', '#F44336'];

            const ctx = document.getElementById('gratuidade-chart').getContext('2d');

            if (gratuidadeChartInstance) {
                gratuidadeChartInstance.destroy();
            }

            const graficoConfig = {
                type: tipoGrafico,
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: gratuidadeCores, // Usa as cores fixas para gratuidade
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: false,
                            text: 'Jogos Gratuitos vs. Pagos'
                        }
                    }
                }
            };

              if (tipoGrafico === 'pie' || tipoGrafico === 'doughnut') {
                graficoConfig.options.plugins.legend.position = 'right';
            }

            gratuidadeChartInstance = new Chart(ctx, graficoConfig);
        }

        let lancamentosAnuaisChartInstance = null;
        const lancamentosAnuaisCores = ['#8b0000', '#a52a2a', '#b22222', '#dc143c', '#ff4500', '#ff6347', '#ff7f50', '#ff8c00', '#ffa500', '#ffb6c1'];
        function criarGraficoLancamentosAnuais(dados) {
            const lancamentosPorAno = {};

            if (dados && dados.data) {
                dados.data.forEach(item => {
                    const ano = new Date(item.release_date).getFullYear();
                    if (!isNaN(ano)) {
                        lancamentosPorAno[ano] = (lancamentosPorAno[ano] || 0) + 1;
                    }
                });
            }


            const anos = Object.keys(lancamentosPorAno).sort();
            const quantidadeLancamentos = Object.values(lancamentosPorAno);

            const ctx = document.getElementById('lancamentos-ano-chart').getContext('2d');
            if (lancamentosAnuaisChartInstance) {
                lancamentosAnuaisChartInstance.destroy();
            }
            lancamentosAnuaisChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: anos,
                    datasets: [{
                        label: 'Lançamentos por Ano',
                        data: quantidadeLancamentos,
                        backgroundColor: lancamentosAnuaisCores.slice(0, anos.length),
                        borderColor: lancamentosAnuaisCores.slice(0, anos.length),
                        borderWidth: 2,
                        pointRadius: 5,
                        pointBackgroundColor: lancamentosAnuaisCores.slice(0, anos.length),
                        pointBorderColor: '#fff',
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: lancamentosAnuaisCores.slice(0, anos.length),
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Número de Lançamentos de Jogos por Ano',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value;
                                }
                            }
                        },
                        x: {
                            ticks: {
                                autoSkip: false,
                                maxRotation: 90,
                                minRotation: 90
                            },
                            grid: {
                                display: true
                            }
                        }
                    }
                }
            });
        }

        document.addEventListener('DOMContentLoaded', buscarDadosDaApi);