
ipcRenderer.on('resBooks', (e, args) => {
    const argsObj = JSON.parse(args);
    const books = argsObj.payload.map(x => x.book);
    
    books.forEach( (element, key) => {
        formElements.orderBookSelect[key+1] = new Option(element, element, false, false);
    });
});



ipcRenderer.on('resBitsogw', (e, args) => {

    const HIDE = parseInt(process.env.HIDE) === 1;

    function Filter (initialArr, toExclude) {
        return initialArr.filter(x => ! toExclude.includes(x));
    }

    // se borra el contenido de la tableResult
    clearTables();

    document.getElementById('timeResult').innerHTML = tsDateFormated(Date.now());
    
    const argsObj = JSON.parse(args);

    const payload = argsObj.payload;

    document.getElementById('dispAreaTitle').innerHTML = argsObj.requestFunction;

    switch(argsObj.requestFunction) {
        case 'available_books' :
        case 'open_orders' :
        case 'trades' :
        case 'user_trades' :
            makeTable(document.getElementById('tableResult'), payload);
        break;
        case 'ticker' :
        case 'account_status' :
            let keys = Object.keys(payload);
            if (HIDE) keys = Filter(Object.keys(payload), ['client_id', 'first_name', 'last_name', 'cellphone_number_stored', 'email_stored', 'gravatar_img', 'account_creation_date', 'date_of_birth']);
            const _payload = keys.map(x => ({'property' : x, 'value' : payload[x]}));
            makeTable(document.getElementById('tableResult'), _payload);
        break;
        case 'cancel_order' :
        case 'phone_number' :
        case 'phone_verification' :
            document.getElementById("titleResult").innerHTML = args;
        break;
        case 'balance' :
            const balances = [];
            payload.balances.forEach(x => {                
                if (parseFloat(x.total) > 0) {
                    if ( ! HIDE) balances.push(x);
                    else {
                        x.total = '**********';
                        x.available = '**********';
                        balances.push(x);
                    }
                }
            });

            makeTable(document.getElementById('tableResult'), balances);
        break;
        case 'order_book' :
            makeTable(document.getElementById('tableResult'), payload.asks);
            makeTable(document.getElementById('tableResult2'), payload.bids);
            makeTable(document.getElementById('tableResult3'), [{
                updated_at : payload.updated_at,
                sequence : payload.sequence
            }]);
            document.getElementById("titleResult").innerHTML = 'Asks';
            document.getElementById("titleResult2").innerHTML = 'Bids';
            document.getElementById("titleResult3").innerHTML = 'Updated at';
        break;
        case 'fees' :
            makeTable(document.getElementById('tableResult'), payload.fees);
            makeTable(document.getElementById('tableResult2'), Object
                .keys(payload.withdrawal_fees)
                .map(x => ({'property' : x, 'value' : payload.withdrawal_fees[x]}))
            );

            document.getElementById("titleResult").innerHTML = 'Fees';
            document.getElementById("titleResult2").innerHTML = 'Withdrawal Fees';
        break;
    }
});
