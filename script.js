// API Key - Regístrate en https://www.exchangerate-api.com/ para obtener una gratis
const API_KEY = '2e39dae67bafec6eae69d3d6'; // Reemplaza con tu API key
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

// Elementos del DOM
const amountEl = document.getElementById('amount');
const fromCurrencyEl = document.getElementById('from-currency');
const toCurrencyEl = document.getElementById('to-currency');
const resultEl = document.getElementById('result');
const convertBtn = document.getElementById('convert');
const swapBtn = document.getElementById('swap');
const rateInfoEl = document.getElementById('rate-info');
const updateTimeEl = document.getElementById('update-time');

// Tasas de cambio
let exchangeRates = {};
let lastUpdate = '';

// Cargar tasas de cambio al iniciar
fetchExchangeRates();

// Event Listeners
convertBtn.addEventListener('click', calculate);
swapBtn.addEventListener('click', swapCurrencies);
amountEl.addEventListener('input', calculate);

// Obtener tasas de cambio de la API
async function fetchExchangeRates() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.result === 'success') {
            exchangeRates = data.conversion_rates;
            lastUpdate = new Date(data.time_last_update_utc).toLocaleString();
            updateTimeEl.textContent = lastUpdate;
            calculate();
        } else {
            showError('No se pudieron cargar las tasas de cambio. Intenta más tarde.');
        }
    } catch (error) {
        showError('Error de conexión. Verifica tu internet.');
    }
}

// Calcular conversión
function calculate() {
    const amount = parseFloat(amountEl.value) || 0;
    const fromCurrency = fromCurrencyEl.value;
    const toCurrency = toCurrencyEl.value;
    
    if (Object.keys(exchangeRates).length === 0) return;
    
    // Convertir a USD primero (porque nuestra API base es USD)
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    
    // Calcular resultado
    const result = (amount / fromRate) * toRate;
    resultEl.value = result.toFixed(2);
    
    // Mostrar tasa de cambio
    const rate = (1 / fromRate) * toRate;
    rateInfoEl.innerHTML = `
        <strong>1 ${fromCurrency}</strong> = <strong>${rate.toFixed(6)} ${toCurrency}</strong>
        <br>
        <strong>1 ${toCurrency}</strong> = <strong>${(1 / rate).toFixed(6)} ${fromCurrency}</strong>
    `;
}

// Intercambiar divisas
function swapCurrencies() {
    const temp = fromCurrencyEl.value;
    fromCurrencyEl.value = toCurrencyEl.value;
    toCurrencyEl.value = temp;
    calculate();
}

// Mostrar error
function showError(message) {
    rateInfoEl.innerHTML = `<span style="color: red;">${message}</span>`;
    updateTimeEl.textContent = 'No disponible';
}

// Calcular al cargar la página
window.addEventListener('load', calculate);