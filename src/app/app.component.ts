/*
* ARQUIVO: src/app/app.component.ts
*/

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  pagina = 'landing'; // Inicia na landing page
  isSidebarOpen = false;
  appName = 'LuPA';
  appSubtitle = 'Lucro e Performance em Análise';
  isLoggedIn = false; // Controla o estado de login

  // --- DADOS ---
  vendas: any[] = [];
  despesas: any[] = [];
  clientes: any[] = [];
  transacoesFiado: any[] = [];
  configTaxas: any = {};
  categoriasProduto: any[] = [];
  categoriasDespesa: string[] = [];
  boletos: any[] = [];

  // --- MÉTRICAS CALCULADAS ---
  metricas = { faturamentoBruto: 0, faturamentoLiquido: 0, custosTotais: 0, lucroLiquido: 0, totalFiado: 0, totalBoletos: 0 };
  analiseDespesas: any = {};
  analiseCategorias: any = {};
  previsoesFluxoCaixa = { hoje: 0, amanha: 0, prox7dias: 0, prox30dias: 0 };

  // --- CONTROLE DO GRÁFICO ---
  chart: Chart | undefined;
  chartView = 'despesas';

  ngOnInit() {
    this.carregarDadosIniciais();
    this.calcularMetricas();
  }

  ngAfterViewInit() {
    if (this.pagina === 'dashboard') {
      setTimeout(() => this.createChart(), 0);
    }
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  carregarDadosIniciais() {
    const hoje = new Date();
    this.configTaxas = {
      'Pix': { type: 'simples', taxa: 0.00, prazo: 0 },
      'Dinheiro': { type: 'simples', taxa: 0.00, prazo: 0 },
      'Débito': { type: 'cartao', bandeiras: { 'Visa': { taxa: 1.99, prazo: 1 }, 'Mastercard': { taxa: 2.05, prazo: 1 }}},
      'Crédito 1x': { type: 'cartao', bandeiras: { 'Visa': { taxa: 4.99, prazo: 30 }, 'Mastercard': { taxa: 5.15, prazo: 30 }}},
    };
    this.categoriasProduto = [
        {id: 1, nome: 'Curvatura A', margem: 15}, 
        {id: 2, nome: 'Finalizadores', margem: 40}, 
        {id: 3, nome: 'Acessórios', margem: 50},
        {id: 4, nome: 'Recebimento Fiado', margem: 100},
        {id: 5, nome: 'Não Especificado', margem: 30}
    ];
    this.categoriasDespesa = ['Custo de Mercadoria', 'Custo Fixo', 'Marketing', 'Despesa Variável', 'Investimento', 'Pró-labore'];
    this.vendas = [
      { id: 1, data: hoje.toISOString().split('T')[0], valorBruto: 850.50, formaPagamento: 'Crédito 1x', bandeira: 'Visa', categoria: 'Curvatura A' },
      { id: 2, data: hoje.toISOString().split('T')[0], valorBruto: 1230.00, formaPagamento: 'Pix', categoria: 'Finalizadores' },
    ];
    this.despesas = [
        { id: 1, data: '2025-08-01', descricao: 'Aluguel', categoria: 'Custo Fixo', valor: 1200.00 },
    ];
    this.clientes = [{ id: 1, nome: 'Cliente Exemplo' }];
    this.transacoesFiado = [{ id: 1, clienteId: 1, data: new Date(new Date().setDate(hoje.getDate() - 5)).toISOString().split('T')[0], tipo: 'compra', valor: 200.00, descricao: 'Compra de produtos' }];
    this.boletos = [{ id: 1, empresa: 'Fornecedor X', vencimento: '2025-08-30', valor: 1500.00, pago: false }];
  }

  setPagina(novaPagina: string) {
    this.pagina = novaPagina;
    this.isSidebarOpen = false;
    if (novaPagina === 'dashboard') {
        setTimeout(() => this.createChart(), 0);
    } else {
        this.chart?.destroy();
    }
  }
  
  handleLogin() {
    this.isLoggedIn = true;
    this.setPagina('dashboard');
  }

  handleLogoff() {
    this.isLoggedIn = false;
    this.setPagina('landing');
  }

  calcularMetricas() {
    let faturamentoBruto = 0, faturamentoLiquido = 0;
    this.vendas.forEach(venda => {
      faturamentoBruto += venda.valorBruto;
      const metodo = this.configTaxas[venda.formaPagamento];
      let taxa = 0;
      if (metodo?.type === 'cartao' && venda.bandeira && metodo.bandeiras[venda.bandeira]) taxa = metodo.bandeiras[venda.bandeira].taxa;
      else if (metodo?.type === 'simples') taxa = metodo.taxa;
      faturamentoLiquido += venda.valorBruto * (1 - taxa / 100);
    });
    let custosTotais = 0;
    const analiseDesp: any = {};
    this.despesas.forEach(despesa => {
      custosTotais += despesa.valor;
      if (!analiseDesp[despesa.categoria]) analiseDesp[despesa.categoria] = 0;
      analiseDesp[despesa.categoria] += despesa.valor;
    });
    this.analiseDespesas = analiseDesp;
    const lucroLiquido = faturamentoLiquido - custosTotais;
    const totalFiado = this.clientes.reduce((total, cliente) => {
        const saldo = this.transacoesFiado.filter(t => t.clienteId === cliente.id).reduce((acc, t) => acc + (t.tipo === 'compra' ? t.valor : -t.valor), 0);
        return total + (saldo > 0 ? saldo : 0);
    }, 0);
    const totalBoletos = this.boletos.filter(b => !b.pago).reduce((acc, b) => acc + b.valor, 0);
    this.metricas = { faturamentoBruto, faturamentoLiquido, custosTotais, lucroLiquido, totalFiado, totalBoletos };
    this.analiseCategorias = this.vendas.reduce((acc: any, venda) => {
        const { categoria, valorBruto } = venda;
        if (!categoria) return acc;
        if (!acc[categoria]) acc[categoria] = { faturamento: 0, lucroBruto: 0 };
        const catConfig = this.categoriasProduto.find(c => c.nome === categoria);
        const margem = catConfig ? catConfig.margem : 0;
        acc[categoria].faturamento += valorBruto;
        acc[categoria].lucroBruto += valorBruto * (margem / 100);
        return acc;
    }, {});
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const previsoes = { hoje: 0, amanha: 0, prox7dias: 0, prox30dias: 0 };
    this.vendas.forEach(venda => {
        const metodo = this.configTaxas[venda.formaPagamento]; if (!metodo) return;
        let taxa = 0, prazo = 0;
        if (metodo.type === 'cartao' && venda.bandeira && metodo.bandeiras[venda.bandeira]) { taxa = metodo.bandeiras[venda.bandeira].taxa; prazo = metodo.bandeiras[venda.bandeira].prazo; } 
        else if (metodo.type === 'simples') { taxa = metodo.taxa; prazo = metodo.prazo; }
        const valorLiquido = venda.valorBruto * (1 - taxa / 100);
        const dataVenda = new Date(venda.data + 'T00:00:00');
        const dataLiquidacao = new Date(new Date(dataVenda).setDate(dataVenda.getDate() + prazo));
        const diffDays = Math.ceil((dataLiquidacao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) previsoes.hoje += valorLiquido;
        if (diffDays === 1) previsoes.amanha += valorLiquido;
        if (diffDays >= 0 && diffDays <= 7) previsoes.prox7dias += valorLiquido;
        if (diffDays >= 0 && diffDays <= 30) previsoes.prox30dias += valorLiquido;
    });
    this.previsoesFluxoCaixa = previsoes;
    this.updateChart();
  }

  toggleChartView() {
    this.chartView = this.chartView === 'despesas' ? 'lucros' : 'despesas';
    this.updateChart();
  }

  createChart() {
    this.chart?.destroy();
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'doughnut',
          data: { labels: [], datasets: [{ label: '', data: [], backgroundColor: [], hoverOffset: 4 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
        this.updateChart();
      }
    }
  }

  updateChart() {
    if (!this.chart) return;
    let labels: string[] = [], data: number[] = [], backgroundColor: string[] = [], label = '';
    if (this.chartView === 'despesas') {
        label = 'Despesas por Categoria';
        labels = Object.keys(this.analiseDespesas);
        data = Object.values(this.analiseDespesas);
        backgroundColor = ['#fb7185', '#f472b6', '#e879f9', '#c084fc', '#a78bfa', '#818cf8'];
    } else {
        label = 'Lucro Bruto por Categoria';
        labels = Object.keys(this.analiseCategorias);
        data = Object.values(this.analiseCategorias).map((v: any) => v.lucroBruto);
        backgroundColor = ['#34d399', '#6ee7b7', '#a7f3d0', '#4ade80', '#86efac', '#bbf7d0'];
    }
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].backgroundColor = backgroundColor;
    this.chart.data.datasets[0].label = label;
    this.chart.update();
  }
}
