self.addEventListener('canmakepayment', (evt) => {
    console.log('canmakepayment evt is ' + evt);
    evt.respondWith(true);
});

self.addEventListener('paymentrequest', (evt) => {
    console.log('paymentrequest evt is ' + evt);
    evt.waitUntil(
        //readDB()

        new Promise((resolve, reject) => {
            const dbX = self.indexedDB.open('cardsDB', 1);

        dbX.onsuccess = event => {
            var db = event.target.result;
            var tx = db.transaction('cards', 'readonly');
            cards = tx.objectStore('cards');
            cards.getAll().onsuccess = e => console.log('token is ' +  e.target.result.token + ' last4 is ' + e.target.result.last4);
            tx.oncomplete = function() {
                db.close();
            };
            resolve(db);
        }
        })


    );
    evt.respondWith({
        methodName: 'https://pacific-garden-30467.herokuapp.com/pay3',
        details: {
            token: '1234567890000',
        },
    });
});

self.addEventListener('install', event => {
    console.log('sw installing.');
});

self.addEventListener('activate', event => {
    console.log('sw now ready to handle');
    event.waitUntil(
        //createDB()

        new Promise((resolve, reject) => {
            const dbX = self.indexedDB.open('cardsDB', 1);

            dbX.onupgradeneeded = event => {
                var db = event.target.result;
                var cards = db.createObjectStore('cards', {keyPath: 'id'});
                cards.put({id: 1, last4: '0001', token: '371700000000001'});
                cards.put({id: 2, last4: '0002', token: '371700000000002'});
                cards.put({id: 3, last4: '0003', token: '371700000000003'});
                resolve(db);
            }
        })
    );
});


function createDB() {
    return indexedDB.open('cardsDB', 1, function(cardsDB) {
        console.log('reached inside');
        var cards = cardsDB.createObjectStore('cards', {keyPath: 'id'});
        cards.put({id: 1, last4: '0001', token: '371700000000001'});
        cards.put({id: 2, last4: '0002', token: '371700000000002'});
        cards.put({id: 3, last4: '0003', token: '371700000000003'});
    });
}


function readDB() {
    return indexedDB.open('cardsDB', 1, function(cardsDB) {
        var tx = cardsDB.transaction('cards', 'readonly');
        cards = tx.objectStore('cards');
        var items =  cards.getAll();
        for (var i = 0; i < items.length; i++) {
            console.log('item is ' + items[i].get())
            //Do something
        }
    });


}