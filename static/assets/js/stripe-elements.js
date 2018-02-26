(function() {
    'use strict';

    let elements = stripe.elements({
        fonts: [
            {
                cssSrc: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
            },
        ],
        // Stripe's examples are localized to specific languages, but if
        // you wish to have Elements automatically detect your user's locale,
        // use `locale: 'auto'` instead.
        locale: window.__exampleLocale
    });

    // Floating labels
    let inputs = document.querySelectorAll('.cell.example.example2 .input');
    Array.prototype.forEach.call(inputs, function(input) {
        input.addEventListener('focus', function() {
            input.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            input.classList.remove('focused');
        });
        input.addEventListener('keyup', function() {
            if (input.value.length === 0) {
                input.classList.add('empty');
            } else {
                input.classList.remove('empty');
            }
        });
    });

    let stripeRadio = document.getElementById('cardRadio');
    let payPalRadio = document.getElementById('payPalRadio');

    let stripeSection = document.getElementById('cc-section');
    let payPalSection = document.getElementById('pp-section');

    stripeRadio.addEventListener('click', function () {
        if(stripeRadio.checked) {
            stripeSection.hidden = false;
            payPalSection.hidden = true;
        }
    });

    payPalRadio.addEventListener('click', function () {
        if(payPalRadio.checked) {
            stripeSection.hidden = true;
            payPalSection.hidden = false;
        }
    });

    let elementStyles = {
        base: {
            color: '#32325D',
            fontWeight: 500,
            fontSize: '16px',
            fontSmoothing: 'antialiased',

            '::placeholder': {
                color: '#CFD7DF',
            },
            ':-webkit-autofill': {
                color: '#e39f48',
            },
        },
        invalid: {
            color: '#E25950',

            '::placeholder': {
                color: '#FFCCA5',
            },
        },
    };

    let elementClasses = {
        focus: 'focused',
        empty: 'empty',
        invalid: 'invalid',
    };

    let cardNumber = elements.create('cardNumber', {
        style: elementStyles,
        classes: elementClasses,
    });

    cardNumber.mount('#example2-card-number');

    let cardExpiry = elements.create('cardExpiry', {
        style: elementStyles,
        classes: elementClasses,
    });

    cardExpiry.mount('#example2-card-expiry');

    let cardCvc = elements.create('cardCvc', {
        style: elementStyles,
        classes: elementClasses,
    });

    cardCvc.mount('#example2-card-cvc');

    registerElements([cardNumber, cardExpiry, cardCvc], 'example2');
})();