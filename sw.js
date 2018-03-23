self.addEventListener('canmakepayment', (evt) => {
    console.log('canmakepayment evt is ' + evt);
    evt.respondWith(true);
});

self.addEventListener('paymentrequest', (evt) => {
    console.log('paymentrequest evt is ' + evt);
    evt.respondWith({
        methodName: 'https://pacific-garden-30467.herokuapp.com/pay3',
        details: {
            token: '1234567890000',
        },
    });
});

self.addEventListener('install', event => {
    console.log('sw installing.........');
});

self.addEventListener('activate', event => {
    console.log('sw now ready to handle');
});