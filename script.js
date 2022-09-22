const LANGUAGE = "pt-BR";
const CURRENCY = "currency";
const BRL = "BRL";
const EMPTY_STRING = "";
const CACHE_KEY = "minhascontas-billings";

var newBillingIsVisible = false;
var billings = [];

function toggleNewBilling() {
  var container = document.getElementsByClassName("newBillingContainer")[0];
  document.getElementById("newBillingTitle").textContent = "Nova conta";

  if (newBillingIsVisible) {
    container.classList.add("invisible");
  } else {
    container.classList.remove("invisible");
  }
  newBillingIsVisible = !newBillingIsVisible;
}

function addNewBilling(event) {
  inputName = document.getElementById("billingName");
  inputValue = document.getElementById("billingValue");
  inputDate = document.getElementById("billingDate");

  var data = {
    name: inputName.value,
    value: parseFloat(inputValue.value),
    date: inputDate.value,
    id: uuidv4(),
  };

  if (data.date && data.name && data.value) {
    inputName.value = EMPTY_STRING;
    inputValue.value = EMPTY_STRING;
    inputDate.value = EMPTY_STRING;

    billings.push(data);

    toggleNewBilling();
    toggleBackground();
    updateView();
  }
}

function removeBilling(id) {
  billings = billings.filter((billing) => billing.id !== id);
  toggleBackground();
  updateView();
}

function editBilling(id) {
  var billing = billings.find((b) => b.id == id);

  var container = document.getElementsByClassName("newBillingContainer")[0];
  container.classList.remove("invisible");
  document.getElementById("newBillingTitle").textContent = "Editar conta";
  newBillingIsVisible = false;

  document.getElementById("billingName").value = billing.name;
  document.getElementById("billingValue").value = billing.value;
  document.getElementById("billingDate").value = billing.date;

  removeBilling(id);
}

function updateView() {
  setCache();

  var container = document.getElementsByClassName("billingsContainer")[0];
  container.innerHTML = "";

  billings.map((billing) => {
    var newBilling = `
    <li class="invoicing" id="${billing.id}">
        <div class="invoicingInfo" onclick={editBilling("${billing.id}")}>
          <h2>${billing.name}</h2>
          <div>
            <h3>${formatAsCurrency(billing.value)}</h3>
            <h3>${formatAsDate(billing.date)}</h3>
          </div>
        </div>
        <div class="invoicingButtons">
          <button onclick={markAsPaid("${billing.id}")}>
            <img src="./res/finish-icon.svg" alt="Finish icon" />
          </button>
          <button onclick={removeBilling("${billing.id}")}>
            <img src="./res/cancel-icon.svg" alt="Cancel icon" />
          </button>
        </div>
      </li>
      `;
    container.innerHTML += newBilling;
    toggleBackground();
  });
}

function formatAsCurrency(number) {
  var formatter = new Intl.NumberFormat(LANGUAGE, {
    style: CURRENCY,
    currency: BRL,
  });

  return formatter.format(number);
}

function markAsPaid(id) {
  var classes = document.getElementById(id).classList;

  if (classes.contains("lineThrough")) {
    classes.remove("lineThrough");
  } else {
    classes.add("lineThrough");
  }
}

function orderBillings() {
  var by = document.getElementById("sortButton");
  if (by.lastElementChild.textContent == "Data de vencimento") {
    billings = billings.sort(byValue);
    by.lastElementChild.textContent = "Valor";
  } else {
    billings = billings.sort(byDate);
    by.lastElementChild.textContent = "Data de vencimento";
  }
  updateView();
}

function byValue(a, b) {
  if (a.value < b.value) {
    return -1;
  }
  if (a.value > b.value) {
    return 1;
  }
  return 0;
}

function byDate(a, b) {
  if (Date.parse(a.date) < Date.parse(b.date)) {
    return -1;
  }
  if (Date.parse(a.date) < Date.parse(b.date)) {
    return 1;
  }
  return 0;
}

function formatAsDate(date) {
  var result = new Date(date);
  result.setDate(result.getDate() + 1);
  return result.toLocaleDateString();
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

function toggleBackground() {
  var backgroundImg = document.getElementById("nothingToShow");

  if (billings.length === 0) {
    backgroundImg.classList.remove("invisible");
  } else {
    backgroundImg.classList.add("invisible");
  }
}

function getCache() {
  var cache = JSON.parse(localStorage.getItem(CACHE_KEY));
  console.log(cache);

  if (cache != null) {
    billings = cache;
    updateView();
  }
}

function setCache() {
  localStorage.setItem(CACHE_KEY, JSON.stringify(billings));
}

//navigator.serviceWorker.register("./minhascontas-sw.js");
