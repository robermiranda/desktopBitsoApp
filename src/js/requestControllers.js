const { ipcRenderer } = require('electron');


/*
 * Al iniciar el sistema se manda la primer petición a bitso
 * con la finalidad de obtener los books para poder llenar
 * dinamicamente los select en el ticker y demas endpoints 
 * que así lo requieran.
 */
ipcRenderer.send('books', {
    httpMethod : 'GET',
    requestFunction : 'available_books'
});


formElements.sendButton.addEventListener('click', () => {
    
    const operation = getFormValues().form.operation;

    if(operations.includes(operation)) {
        requestSend(operation);
    }
    else console.log(`LOG. Operation '${operation}' NO valida.`);
});


placeOrderFormElements.sendButton.addEventListener('click', () => {

    const operation = getFormValues().form.operation;
    if (operations.includes(operation)) {
        requestSend(operation);
    }
    else console.log(`Log. Operation '${operation}' NO valida.`);
});


function requestSend (_operation) {
    
    const renderSend = args => ipcRenderer.send('bitsogw',args);

    const values = getFormValues();
    
    const operation = {
        requestFunction : _operation,
        httpMethod : 'GET'
    };

    const selectedIndex = formElements.orderBookSelect.selectedIndex === 0 ?
    1 : formElements.orderBookSelect.selectedIndex;

    switch(_operation) {
        case 'open_orders' :
        case 'order_book' :
        case 'ticker' :
        case 'trades' :
        case 'user_trades' :
            operation.queryParams = {
                book : formElements.orderBookSelect.options[selectedIndex].value
            }
        break;
        case 'cancel_order' :
            operation.httpMethod = 'DELETE';
            operation.requestFunction = 
            `${operationsObj[_operation].endpoint}/${formElements.input1.value}`;
        break;
        case 'phone_number' :
            operation.httpMethod = 'POST'
            operation.payload = {
                phone_number : formElements.input1.value
            }
        break;
        case 'phone_verification' :
            operation.httpMethod = 'POST'
            operation.payload = {
                verification_code : formElements.input1.value    
            }
        break;
        case 'place_order' :
            operation.httpMethod = 'POST';
            operation.requestFunction = operationsObj[_operation].endpoint;
            operation.payload = {
                book : values.form.orderBook,
                side : values.placeOrderForm.side,
                type : values.placeOrderForm.type,
            }
            if (values.placeOrderForm.price) operation.payload.price = values.placeOrderForm.price;
            if (values.placeOrderForm.stop) operation.payload.stop = values.placeOrderForm.stop;
        break;
    }
    //console.log('DEP. requiestControllers.operation',operation);
    renderSend(operation);
}