
const operationsObj = {
    'account_status' : {
        description : `Get information concerning the user’s account status,
        documents uploaded, and transaction limits.`
    },
    'available_books' : {
        description : `Get a list of existing exchange order books
        and their respective order placement limits.`
    },
    'balance' : {
        description : `Get information concerning the
        user’s balances for all supported currencies.`
    },
    'cancel_order' : {
        description : "Cancel an open order with specific 'oid'",
        textDesc : 'cancel an order',
        endpoint : 'orders'
    },
    'fees' : {
        description : `Get information on customer fees for all available order books,
        and withdrawal fees for applicable currencies.`
    },
    'open_orders' : {
        description : 'Get a list of the user’s open orders.'
    },
    'order_book' : {
        description : 'Get a list of all open orders in the specified book.'
    },
    'place_order' : {
        description : `Places a buy or sell order
        (both limit and market orders are available)`,
        textDesc : 'place an order',
        endpoint : 'orders'
    },
    'phone_number' : {
        description : `Register Mobile phone number (10 digits) for verification.`
    },
    'phone_verification' : {
        description : 'Verify a registered mobile phone number.'
    },
    'ticker' : {
        description : 'Get trading information from the specified book.'
    },
    'trades' : {
        description : `Get a list of recent trades from the specified book.`
    },
    'user_trades' : {
        description : 'Get a list of the user’s trades.'
    }
}

const operations = Object.keys(operationsObj);

const formElements = {
    operationSelect : document.getElementById('operationsSelect'),
    orderBookSelect :document.getElementById('orderBookSelect'),
    input1 : document.getElementById('input1'),
    sendButton : document.getElementById('sendButton')
}

const placeOrderFormElements = {
    side : document.getElementById('sideSelect'),
    type : document.getElementById('typeSelect'),
    currency : document.getElementById('amountSelect'),
    amount : document.getElementById('amountInput'),
    price : document.getElementById('priceInput'),
    stop : document.getElementById('stopInput'),
    sendButton : document.getElementById('placeOrderButton')
}


function getFormValues () {
    const operationSelectedIndex = formElements.operationSelect.selectedIndex;
    const orderBookSelectedIndex = formElements.orderBookSelect.selectedIndex;
    const sideSelectedIndex = placeOrderFormElements.side.selectedIndex;
    const typeSelectedIndex = placeOrderFormElements.type.selectedIndex;
    const currencySelectedIndex = placeOrderFormElements.currency.selectedIndex;

    return {
        form : {
            operationSelectedIndex,
            orderBookSelectedIndex,
            operation : formElements.operationSelect.options[operationSelectedIndex].value,
            orderBook : formElements.orderBookSelect.options[orderBookSelectedIndex].value,
            input1 :formElements.input1.value
        },
        placeOrderForm : {
            sideSelectedIndex,
            typeSelectedIndex,
            side : placeOrderFormElements.side.options[sideSelectedIndex].value,
            type : placeOrderFormElements.type.options[typeSelectedIndex].value,
            currency : placeOrderFormElements.currency.options[currencySelectedIndex].value,
            amount : placeOrderFormElements.amount.value,
            price : placeOrderFormElements.price.value,
            stop : placeOrderFormElements.stop.value
        }
    }
}

operations.forEach((element, key) => {
    const text = operationsObj[element].textDesc ? operationsObj[element].textDesc : element;
    formElements.operationSelect[key + 1] = new Option(text, element, false, false);
});

enableFormElements([]);

enablePlaceOrderForm(true);

formElements.operationSelect.addEventListener('change', () => {

    const selectedIndex = formElements.operationSelect.selectedIndex;

    enablePlaceOrderForm(true);
    if (selectedIndex === 0) enableFormElements([]);

    const operation = formElements
        .operationSelect
        .options[selectedIndex]
        .value;

    if(operationsObj[operation]) {
        setOperationDesc(operationsObj[operation].description);
    }

    switch(operation) {
        case 'available_books' :
        case 'account_status' :
        case 'balance' :
        case 'fees' :
            enableFormElements([formElements.sendButton]);
        break;
        case 'open_orders' :
        case 'order_book' :
        case 'ticker' :
        case 'trades' :
        case 'user_trades' :
            if(formElements.orderBookSelect.selectedIndex === 0) {
                enableFormElements([formElements.orderBookSelect]);
            }
            else enableFormElements([formElements.orderBookSelect, formElements.sendButton]);
        break;
        case 'phone_number' :
            formElements.input1.setAttribute('placeholder','Phone Number');
            enableFormElements([formElements.input1, formElements.sendButton]);
        break;
        case 'phone_verification' :
            formElements.input1.setAttribute('placeholder','Code Verification');
            enableFormElements([formElements.input1, formElements.sendButton]);
        break;
        case 'cancel_order' :
            formElements.input1.setAttribute('placeholder','Order ID');
            enableFormElements([formElements.input1, formElements.sendButton]);
        break;
        case 'place_order' :
            enableFormElements([formElements.orderBookSelect]);
            if (formElements.orderBookSelect.selectedIndex > 0) {
                enablePlaceOrderForm();
            }
        break;
    }
});

formElements.orderBookSelect.addEventListener('change', () => {

    const selectedIndex = formElements.orderBookSelect.selectedIndex;
    const selectedValue = formElements.orderBookSelect.options[selectedIndex].value;

    const majorMinor = selectedValue.split('_');

    placeOrderFormElements.currency.options[1].text = majorMinor[0];
    placeOrderFormElements.currency.options[2].text = majorMinor[1];
    placeOrderFormElements.currency.selectedIndex = 0;
    
    const operation = formElements
    .operationSelect
    .options[formElements.operationSelect.selectedIndex]
    .value;

    if (selectedIndex === 0) {
        enableFormElements([formElements.orderBookSelect]);
        enablePlaceOrderForm(true);
    }
    else if (operation === 'place_order') {
        enablePlaceOrderForm();
    }
    else enableFormElements([formElements.orderBookSelect, formElements.sendButton]);
});

[
    placeOrderFormElements.side,
    placeOrderFormElements.type,
    placeOrderFormElements.currency
].forEach(x => x.addEventListener('change', () => enablePlaceOrderForm()));

function enablePlaceOrderForm (disableAll = false) {

    if (disableAll) {
        Object.keys(placeOrderFormElements)
        .forEach(x => {
            placeOrderFormElements[x].setAttribute('disabled', '');
            placeOrderFormElements[x].selectedIndex = 0;
        });

        return;
    }
    
    const typeSelectedIndex = placeOrderFormElements.type.selectedIndex;
    const typeOptions = placeOrderFormElements.type.options;

    if (placeOrderFormElements.side.selectedIndex === 0) {
        enableFormElements([placeOrderFormElements.side], placeOrderFormElements);
    }
    else if (typeSelectedIndex === 0) { 
        enableFormElements([
            placeOrderFormElements.type,
            placeOrderFormElements.side
        ], placeOrderFormElements);
    }
    else if (placeOrderFormElements.currency.selectedIndex === 0) { 
        enableFormElements([
            placeOrderFormElements.currency,
            placeOrderFormElements.type,
            placeOrderFormElements.side
        ], placeOrderFormElements);
    }
    else if (typeOptions[typeSelectedIndex].value  === 'market') {
        enableFormElements([
            placeOrderFormElements.amount,
            placeOrderFormElements.currency,
            placeOrderFormElements.type,
            placeOrderFormElements.side,
            placeOrderFormElements.sendButton
        ], placeOrderFormElements);
    }
    else if (typeOptions[typeSelectedIndex].value  === 'limit') {
        enableFormElements([
            placeOrderFormElements.amount,
            placeOrderFormElements.price,
            placeOrderFormElements.currency,
            placeOrderFormElements.type,
            placeOrderFormElements.side,
            placeOrderFormElements.sendButton
        ], placeOrderFormElements);
    }
    else if (typeOptions[typeSelectedIndex].value  === 'stop') {
        enableFormElements([
            placeOrderFormElements.amount,
            placeOrderFormElements.stop,
            placeOrderFormElements.currency,
            placeOrderFormElements.type,
            placeOrderFormElements.side,
            placeOrderFormElements.sendButton
        ], placeOrderFormElements);
    }
}

/**
 * Enable elements in x
 * Disable elements not in x
 */
function enableFormElements (x, form=formElements) {

    // operationSelect must be eneabled always
    if (form.operationSelect) x.push(form.operationSelect);

    const notX = Object.keys(form).filter(y => !x.includes(form[y]));

    x.forEach(y => y.removeAttribute("disabled"));
    notX.forEach(y => form[y].setAttribute('disabled', ''));
}

/** 
 * establece la descripción de la operación.
 */
function setOperationDesc (descripcion) {
    document.getElementById('operationDesc').innerHTML = descripcion;
}

function clearTables () {
    document.getElementById('tableResult').innerHTML = '';
    document.getElementById('tableResult2').innerHTML = '';
    document.getElementById('tableResult3').innerHTML = '';
    document.getElementById("titleResult").innerHTML = '';
    document.getElementById("titleResult2").innerHTML = '';
    document.getElementById("titleResult3").innerHTML = '';
}

function makeTable (table, params) {
    
    function generateTableHead(table, data) {
        let thead = table.createTHead();
        let row = thead.insertRow();
        for (let key of data) {
          let th = document.createElement("th");
          let text = document.createTextNode(key);
          th.appendChild(text);
          row.appendChild(th);
        }
      }
      
    function generateTable(table, data) {
        for (let element of data) {
            let row = table.insertRow();
            for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
            }
        }
    }
    
    const data = Object.keys(params[0]);
    generateTableHead(table, data);
    generateTable(table, params);
}

function tsDateFormated (ts) {
    const dateIn = new Date(ts);
    const yearIn = dateIn.getFullYear();
    const monthIn = 1 + dateIn.getMonth();
    const dayIn = dateIn.getDate();
    const hourIn = dateIn.getHours();
    const minIn = dateIn.getMinutes();
    const secIn = dateIn.getSeconds();
    return `${yearIn}-${monthIn}-${dayIn}  ${hourIn}:${minIn}:${secIn}`;
}
