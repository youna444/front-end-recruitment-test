import '../css/checkout.css'
import '../sass/checkout.scss'

//simple form validation
const checkoutForm = document.forms['checkout'];


checkoutForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const mainFormError = document.querySelector('.form__error');
    const mainFormSuccess = document.querySelector('.form__success');

    const postalCodeField = checkoutForm.querySelector('#postalCode');
    const phoneNumberField = checkoutForm.querySelector('#phone');
    const emailField = checkoutForm.querySelector('#email');
    const creditCardField = checkoutForm.querySelector('#creditCard');
    const securityCodeField = checkoutForm.querySelector('#CVV');
    const expDateField = checkoutForm.querySelector('#expDate');

    let allInputs = checkoutForm.elements; //get all html elements inside form
    allInputs = [...allInputs].filter(e => e.getAttribute("name")); //filter out array of the elements that are not inputs

    //check all the inputs for value presence
    allInputs.forEach(element => {
        checkIfInputValueIsEmpty(element);
    });

    //validate email input
    validateEmailInput(emailField);

    //validate phone number input
    validateNumberFields(phoneNumberField, 9);

    //validate postal code input
    validateNumberFields(postalCodeField, 5);

    //validate credit card input
    validateNumberFields(creditCardField, 16);

    //validate security code input
    validateNumberFields(securityCodeField, 3);

    //validate exp date input
    checkInputExpiryDate(expDateField);

    //fetch post request and handle error/success messages
    fetch(e.target.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(e.target))
    }).then((response) => {
        return response.json();
    }).then((body) => {
        console.log(body);
        if(body.message) {
            mainFormError.classList.remove('active');
            mainFormSuccess.classList.add('active');
            mainFormSuccess.textContent = body.message;
        } else {
            mainFormError.classList.add('active');
            mainFormSuccess.classList.remove('active');
        }
    }).catch((error) => {
        console.log(error)
    });
});

const checkIfInputValueIsEmpty = (input) => {
    if(input.value.trim() === "") {
        setErrorMessage(input, 'Field cannot be empty');
        return false;
    } else {
        removeErrorMessage(input);
        return true;
    }
}

const validateEmailInput = (input) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.value)) { //regex validation for valid email
        removeErrorMessage(input);
        return true;
    } else {
        setErrorMessage(input, 'Provided e-mail address is incorrect');
        return false;
    }
}

const validateNumberFields = (input, validLength) => {
    if(checkInputNumericCharacters(input)) {
        checkInputValueLength(input, validLength);
    }
}

const checkInputValueLength = (input, validLength) => {
    if(input.value.length == validLength && input.value.trim() !== "") {
        removeErrorMessage(input);
        return true;  	
    } else { 
        setErrorMessage(input, 'This field must contain ' +validLength+ ' characters');
        return false;  	
    }
}

const checkInputNumericCharacters = (input) => {
    if (input.value.match(/^[0-9]+$/)) { //regex validation for numeric characters
        removeErrorMessage(input);
        return true;
    } else {
        setErrorMessage(input, 'Please provide numeric characters only');
        return false;
    }
}

const checkInputExpiryDate = (input) => {
    if (/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(input.value)) { //regex validation for format MM/YY
        removeErrorMessage(input);
        return true;
    } else {
        setErrorMessage(input, 'Invalid characters, please provide data in MM/YY format');
        return false;
    }
}


const setErrorMessage = (input, message) => {
    const errorElement = input.parentNode.querySelector('.error');
    if (errorElement) {
        errorElement.innerText = message;
    }
    input.classList.add('is-invalid');
}

const removeErrorMessage = (input) => {
    const errorElement = input.parentNode.querySelector('.error');
    if (errorElement) {
        errorElement.innerText = '';
    }
    input.classList.remove('is-invalid');
}