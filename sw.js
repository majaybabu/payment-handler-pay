var cardPromiseResolve = undefined;

self.addEventListener('canmakepayment', (evt) => {
    console.log('canmakepayment evt is ' + evt);
    evt.respondWith(true);
});

self.addEventListener("message", function (event) {
    console.log('selected card is - ' + JSON.stringify(event.data));
    cardPromiseResolve(JSON.parse("{\"methodName\": \"https://majaybabu.github.io/payment-handler-pay/\", \"details\": " + JSON.stringify(event.data) + "}"));
});

self.addEventListener('paymentrequest', (evt) => {
    console.log('paymentrequest evt is ' + evt);
    console.log('FLS indicator is ' + evt.methodData[0].data.threeDS)

    var cardPromise = new Promise((resolve, reject) => {
        cardPromiseResolve = resolve;
        const dbX = self.indexedDB.open('cardsDB', 1);
        dbX.onsuccess = event => {
            var db = event.target.result;
            var tx = db.transaction('cards', 'readonly');
            cards = tx.objectStore('cards');
            cards.getAll().onsuccess = e => {
                console.log('all cards are ' +  JSON.stringify(e.target.result));
                var cardsResponse = "{\"cards\":" + JSON.stringify(e.target.result) + "}";

                //below is just for logging
                var cardsJSON = JSON.parse(cardsResponse);
                for (var i = 0; i < cardsJSON.cards.length; i++) {
                    console.log('card is  ' + JSON.stringify(cardsJSON.cards[i]));
                    console.log('token is ' + cardsJSON.cards[i].token);
                }
                //above is just for logging

                evt.openWindow("https://majaybabu.github.io/payment-handler-pay/select.html")
                    .then(function(windowClient) {
                        setTimeout(function(){
                            console.log('posting msg....');
                            windowClient.postMessage(JSON.parse(cardsResponse));
                        }, 200);
                    });
            }

            tx.oncomplete = function() {
                db.close();
            };
        }
    });

    evt.respondWith(cardPromise);

});

self.addEventListener('install', event => {
    console.log('sw installing.....');
});

self.addEventListener('activate', event => {
    console.log('sw now ready to handle');
    event.waitUntil(
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

