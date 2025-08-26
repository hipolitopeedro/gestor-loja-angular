LuPA - Lucro e Performance em Análise
LuPA é uma aplicação web desenvolvida como parte do Projeto Interdisciplinar (PIN), projetada para ser um painel de controle financeiro completo para pequenos comércios, com foco em clareza, análise e tomada de decisão estratégica.

🎯 O Problema:

Pequenos lojistas frequentemente enfrentam dificuldades para obter uma visão clara da saúde financeira de seus negócios. Processos manuais, planilhas complexas e a falta de ferramentas integradas resultam em:

Perda de tempo com fechamentos de caixa.

Dificuldade em calcular o lucro líquido real após taxas de pagamento.

Incerteza sobre o fluxo de caixa e a gestão de contas a pagar/receber.

Falta de dados para decisões estratégicas sobre compras e precificação.

O LuPA foi criado para resolver esses problemas, transformando dados brutos em insights visuais e acionáveis.

✨ Funcionalidades Principais:

Dashboard Intuitivo: Uma visão geral e centralizada dos indicadores mais importantes: faturamento bruto, custos totais, lucro líquido, contas a pagar e a receber.

Análise de Performance: Gráficos e tabelas que detalham a performance do negócio, incluindo:

Um gráfico dinâmico que alterna entre a visualização de Despesas e Lucro Bruto por categoria.

Uma tabela de análise de lucro por categoria de produto, revelando os itens mais e menos rentáveis.

Controle de Contas: Módulos dedicados para gerenciar Boletos a Pagar e o Controle de Fiado (Gastos e Lucros).

Configuração Flexível: Painel de administração para customizar taxas de pagamento (por bandeira de cartão), prazos de recebimento e categorias de despesas e produtos.

Importação/Exportação: Funcionalidade para exportar todos os dados para um arquivo .csv e importar dados para a aplicação, facilitando backups e a migração de informações.


🛠️ Tecnologias Utilizadas:

Frontend: Angular

Estilização: Tailwind CSS

Gráficos: Chart.js

Manipulação de Planilhas: SheetJS (xlsx)

🚀 Como Rodar o Projeto Localmente:

Clone o repositório:

git clone https://github.com/seu-usuario/gestor-loja-angular.git

Navegue até a pasta do projeto:

cd gestor-loja-angular

Instale as dependências:

npm install

Inicie o servidor de desenvolvimento:

ng serve

Abra seu navegador e acesse http://localhost:4200/.