import { createChart, CrosshairMode } from 'lightweight-charts';
var chart = createChart(document.body, {
  width: window.innerWidth,
  height: window.innerHeight,
  layout: {
    backgroundColor: '#000000',
    textColor: 'rgba(255, 255, 255, 0.9)',
  },
  grid: {
    vertLines: {
      color: 'rgba(197, 203, 206, 0.5)',
    },
    horzLines: {
      color: 'rgba(197, 203, 206, 0.5)',
    },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  rightPriceScale: {
    borderColor: 'rgba(197, 203, 206, 0.8)',
  },
  timeScale: {
    borderColor: 'rgba(197, 203, 206, 0.8)',
  },
});

window.addEventListener('resize', () => {
  chart.resize(window.innerWidth, window.innerHeight);
});

var candleSeries = chart.addCandlestickSeries({
  upColor: '#0f0',
  downColor: '#f00',
  borderDownColor: '#f00',
  borderUpColor: '#0f0',
  wickDownColor: '#f00',
  wickUpColor: '#0f0',
});

window.candleSeries = candleSeries;
window.chart = chart;
window.pidor = 1337;
