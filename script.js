const LANGUAGE = "pt-BR";
const CURRENCY = "currency";
const BRL = "BRL";
const EMPTY_STRING = "";

var newBillingIsVisible = false;
var billings = [];

function toggleNewBilling() {
  if (newBillingIsVisible) {
    document.getElementsByClassName("newBillingContainer")[0].classList.add("invisible");
  } else {
    document.getElementsByClassName("newBillingContainer")[0].classList.remove("invisible");
  }
  newBillingIsVisible = !newBillingIsVisible;
}

function addNewBilling(event) {
  event.preventDefault();

  inputName = document.getElementById("billingName");
  inputValue = document.getElementById("billingValue");
  inputDate = document.getElementById("billingDate");

  var data = {
    name: inputName.value,
    value: inputValue.value,
    date: inputDate.value,
    id: uuidv4(),
  };

  if (data.date && data.name && data.value) {
    inputName.value = EMPTY_STRING;
    inputValue.value = EMPTY_STRING;
    inputDate.value = EMPTY_STRING;

    billings.push(data);

    console.log(billings);

    updateView();
    toggleNewBilling();
    toggleBackground();
  }
}

function removeBilling(id) {
  billings = billings.filter((billing) => billing.id !== id);
  toggleBackground();
  updateView();
}

function updateView() {
  var container = document.getElementsByClassName("billingsContainer")[0];

  container.innerHTML = "";

  billings.map((billing) => {
    var newBilling = `
    <li class="invoicing" id="${billing.id}">
        <div class="invoicingInfo">
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
  if (a.date < b.date) {
    return -1;
  }
  if (a.date > b.date) {
    return 1;
  }
  return 0;
}

function formatAsDate(date) {
  return new Intl.DateTimeFormat(LANGUAGE).format(new Date(date));
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
