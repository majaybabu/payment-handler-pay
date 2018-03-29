
function install() {

    navigator.serviceWorker.register('sw.js')
        .then(() => {
        return navigator.serviceWorker.ready;
})
.then((registration) => {
        if (!registration.paymentManager) {
        console.log('No payment handler capability');
        return;
    }
    if (!registration.paymentManager.instruments) {
        console.log('Payment handler is not fully implemented. Cannot set the instruments.');
        return;
    }
    registration.paymentManager.instruments
        .set('instrument-key', {
            name: 'Chrome uses name and icon from the web app manifest',
            enabledMethods: ['https://pacific-garden-30467.herokuapp.com/pay3'],
        })
        .then(() => {
            registration.paymentManager.instruments.get('instrument-key').then((instrument) => {
            console.log('registration.scope is' + registration.scope);
            console.log('enabledMethods is' + instrument.enabledMethods);

    }).catch((error) => {
        console.log(error);
    });
    })
    .catch((error) => {
        console.log(error);
    });
    })
    .catch((error) => {
        console.log(error);
    });
}



window.addEventListener('load', function(evt) {
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
    }
    install();
});


