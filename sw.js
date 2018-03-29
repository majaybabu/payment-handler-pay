self.addEventListener('canmakepayment', (evt) => {
    console.log('canmakepayment evt is ' + evt);
    evt.respondWith(true);
});

self.addEventListener('paymentrequest', (evt) => {
    console.log('paymentrequest evt is ' + evt);
    /*event.waitUntil(
        readDB().then(function(items) {
            for (var i = 0; i < items.length; i++) {
                console.log('item is ' + items[i].get())
                //Do something
            }
        });
    );*/
    evt.respondWith({
        methodName: 'https://pacific-garden-30467.herokuapp.com/pay3',
        details: {
            token: '1234567890000',
        },
    });
});

self.addEventListener('install', event => {
    console.log('sw installing............');
});

self.addEventListener('activate', event => {
    console.log('sw now ready to handle');
    event.waitUntil(
        createDB()

    readDB().then(function(items) {
        for (var i = 0; i < items.length; i++) {
            console.log('item is ' + items[i].get())
            //Do something
        }
    });

    );
});


function createDB() {
    idb.open('cardsDB', 1, function(cardsDB) {
        var cards = cardsDB.createObjectStore('cards', {
            keyPath: 'id'
        });
        cards.put({id: 1, last4: '0001', token: '371700000000001'});
        cards.put({id: 2, last4: '0002', token: '371700000000002'});
        cards.put({id: 3, last4: '0003', token: '371700000000003'});
    });
}

function readDB() {
    idb.open('cardsDB', 1).then(function(db) {
        var tx = db.transaction('cards', 'readonly');
        var cards = tx.objectStore('cards');
        return cards.getAll();
    })
}