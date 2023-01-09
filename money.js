const fromSelect = document.querySelector('[name="from_currency"]');
const fromInput = document.querySelector('[name="from_amount"]');
const toSelect = document.querySelector('[name="to_currency"]');
const toEl = document.querySelector('.to_amount');
const form = document.querySelector('.app form');
const endpoint =
  'https://api.apilayer.com/currency_data/change?start_date=2023-01-11&end_date=2023-01-25';

const ratesByBase = {};

const currencies = {
  USD: 'United States Dollar',
  AUD: 'Australian Dollar',
  BGN: 'Bulgarian Lev',
  BRL: 'Brazilian Real',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  CZK: 'Czech Republic Koruna',
  DKK: 'Danish Krone',
  GBP: 'British Pound Sterling',
  HKD: 'Hong Kong Dollar',
  HRK: 'Croatian Kuna',
  HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah',
  ILS: 'Israeli New Sheqel',
  INR: 'Indian Rupee',
  JPY: 'Japanese Yen',
  KRW: 'South Korean Won',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  NOK: 'Norwegian Krone',
  NZD: 'New Zealand Dollar',
  PHP: 'Philippine Peso',
  PLN: 'Polish Zloty',
  RON: 'Romanian Leu',
  RUB: 'Russian Ruble',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  THB: 'Thai Baht',
  TRY: 'Turkish Lira',
  ZAR: 'South African Rand',
  EUR: 'Euro',
};

var myHeaders = new Headers();
myHeaders.append('apikey', 'ya2UlVO0WcrpIVSanjUTXy2H8KkWKHdQ');

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders,
};

// `https://api.apilayer.com/exchangerates_data/latest?symbols={symbols}&base={base}`

fetch(
  'https://api.apilayer.com/currency_data/change?start_date=2022-12-11&end_date=2022-12-31',
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log('error', error));

function generateOptions(options) {
  return Object.entries(options)
    .map(([currencyCode, currencyName]) => {
      return `<option value="${currencyCode}">${currencyCode} - ${currencyName}</option>`;
    })
    .join('');
}

async function fetchRates(base = 'USD') {
  const res = await fetch(`${endpoint}?base=${base}`);
  const rates = await res.json();
  return rates;
}

async function convert(amount, from, to) {
  //first check if we even have the rates to convert from each currency
  if (!ratesByBase[from]) {
    console.log(
      `Oh no, we don't have ${from} to convert to ${to}. So let's go get it!`
    );
    const rates = await fetchRates(from);
    //store them for next time
    ratesByBase[from] = rates;
  }
  //convert that amount that they passed it
  const rate = ratesByBase[from].rates[to];
  const convertedAmount = rate * amount;
  console.log(`${amount}${from} is ${convertedAmount} in ${to}`);
  return convertedAmount;
}

function formatCurrency(amount, currency) {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

async function handleInput(e) {
  const rawAmount = await convert(
    fromInput.value,
    fromSelect.value,
    toSelect.value
  );
  toEl.textContent = formatCurrency(rawAmount, toSelect.value);
}

const optionsHTML = generateOptions(currencies);
console.log(optionsHTML);

//populate the options elements
fromSelect.innerHTML = optionsHTML;
toSelect.innerHTML = optionsHTML;

form.addEventListener('input', handleInput);
