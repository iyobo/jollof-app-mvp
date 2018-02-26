'use strict';

const stripe = Stripe(stripePublicKey);
let purchase = {};

function registerElements(elements, exampleName) {
    let formClass = '.' + exampleName;
    let example = document.querySelector(formClass);

    purchase.event = window.location.pathname.split('/')[1];

    let form = example.querySelector('#stripe-form');
    let resetButton = example.querySelector('a.reset');
    let error = form.querySelector('.error');
    let errorMessage = error.querySelector('.message');

    function enableInputs() {
        Array.prototype.forEach.call(
            form.querySelectorAll(
                "input[type='text'], input[type='email'], input[type='tel']"
            ),
            function(input) {
                input.removeAttribute('disabled');
            }
        );
    }

    function disableInputs() {
        Array.prototype.forEach.call(
            form.querySelectorAll(
                "input[type='text'], input[type='email'], input[type='tel']"
            ),
            function(input) {
                input.setAttribute('disabled', 'true');
            }
        );
    }

    // Listen for errors from each Element, and show error messages in the UI.
    elements.forEach(function(element) {
        element.on('change', function(event) {
            if (event.error) {
                // error.classList.add('visible');
                errorMessage.innerText = event.error.message;
            } else {
                // error.classList.remove('visible');
            }
        });
    });


    // Listen on the form's 'submit' handler...
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show a loading screen...
        example.classList.add('submitting');

        // Disable all inputs.
        disableInputs();

        // Gather additional customer data we may have collected in our form.
        let name = form.querySelector('#' + exampleName + '-name');
        let email = form.querySelector('#' + exampleName + '-email');
        let address1 = form.querySelector('#' + exampleName + '-address');
        let city = form.querySelector('#' + exampleName + '-city');
        let state = form.querySelector('#' + exampleName + '-state');
        let zip = form.querySelector('#' + exampleName + '-zip-code');
        let additionalData = {
            name: name ? name.value : undefined,
            address_line1: address1 ? address1.value : undefined,
            address_city: city ? city.value : undefined,
            address_state: state ? state.value : undefined,
            address_zip: zip ? zip.value : undefined,
        };

        purchase.processor = 'stripe';
        purchase.name = name.value;
        purchase.email = email.value;

        // console.log(additionalData);
        // console.log(purchase);

        // Use Stripe.js to create a token. We only need to pass in one Element
        // from the Element group in order to create a token. We can also pass
        // in the additional customer data we collected in our form.

        stripe.createToken(elements[0], additionalData).then(function(result) {
            // Stop loading!
            if (result.token) {
                // If we received a token, show the token ID.
                purchase.token = result.token;

                axios.post('/paynow', purchase)
                    .then(function (response) {
                        console.log(response);
                        example.classList.remove('submitting');
                        if(response.data.success) {
                            example.classList.add('submitted');
                        } else {
                            errorMessage.innerText = response.data.message;
                            error.classList.add('visible');
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            } else {
                // Otherwise, un-disable inputs.
                enableInputs();
            }
        });
    });

    resetButton.addEventListener('click', function(e) {
        e.preventDefault();
        // Resetting the form (instead of setting the value to `''` for each input)
        // helps us clear webkit autofill styles.
        form.reset();

        // Clear each Element.
        elements.forEach(function(element) {
            element.clear();
        });

        // Reset error state as well.
        error.classList.remove('visible');

        // Resetting the form does not un-disable inputs, so we need to do it separately:
        enableInputs();
        example.classList.remove('submitted');
    });
}