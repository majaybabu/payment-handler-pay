self.addEventListener('canmakepayment', (evt) => {
    console.log('canmakepayment evt is ' + evt);
    evt.respondWith(true);
});

self.addEventListener('paymentrequest', (evt) => {
    console.log('paymentrequest evt is ' + evt);
    var cardsResponse;


        //readDB()

        new Promise((resolve, reject) => {
            const dbX = self.indexedDB.open('cardsDB', 1);

            dbX.onsuccess = event => {
                var db = event.target.result;
                var tx = db.transaction('cards', 'readonly');
                cards = tx.objectStore('cards');
                cards.getAll().onsuccess = e => {
                    console.log('all cards are ' +  JSON.stringify(e.target.result));
                    cardsResponse = "{\"cards\":" + JSON.stringify(e.target.result) + "}";
                    console.log('cardsResponse is ' + cardsResponse);
                    var cardsJSON = JSON.parse(cardsResponse);

                    for (var i = 0; i < cardsJSON.cards.length; i++) {
                        console.log('card is  ' + JSON.stringify(cardsJSON.cards[i]));
                        console.log('token is ' + cardsJSON.cards[i].token);
                    }



                    //var x = JSON.parse("{methodName: 'https://majaybabu.github.io/payment-handler-pay/', details: " + cardsResponse + "}");
                    resolve("{methodName: 'https://majaybabu.github.io/payment-handler-pay/', details: " + cardsResponse + "}");

                }
                tx.oncomplete = function() {
                    db.close();
                };
            }
        }).then(function(response){
            console.log('response is ' + response);
            return response;
        });



    /*evt.respondWith(

        var promise = new Promise((resolve, reject) => {
        const dbX = self.indexedDB.open('cardsDB', 1);
        var cardsResponse;
        dbX.onsuccess = event => {
            var db = event.target.result;
            var tx = db.transaction('cards', 'readonly');
            cards = tx.objectStore('cards');
            cards.getAll().onsuccess = e => {
                console.log('all cards are ' +  JSON.stringify(e.target.result));
                cardsResponse = "{\"cards\":" + JSON.stringify(e.target.result) + "}";
                var cardsJSON = JSON.parse(cardsResponse);

                for (var i = 0; i < cardsJSON.cards.length; i++) {
                    console.log('card is  ' + JSON.stringify(cardsJSON.cards[i]));
                    console.log('token is ' + cardsJSON.cards[i].token);
                }
                console.log('response is ' + JSON.stringify("{\"methodName\": 'https://majaybabu.github.io/payment-handler-pay/', \"details\": " + cardsResponse + "}"));
                resolve("{\"methodName\": 'https://majaybabu.github.io/payment-handler-pay/', \"details\": " + cardsResponse + "}");
                console.log('after sending response');
            }
            tx.oncomplete = function() {
                db.close();
            };
        }
    });

    promise.then(function(response){
        response;
    });

);*/

});

self.addEventListener('install', event => {
    console.log('sw installing.....');
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

