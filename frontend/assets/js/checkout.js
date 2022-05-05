import '../css/checkout.css'
import '../sass/checkout.scss'
import 'babel-polyfill'

//simple form validation
const checkoutForm = document.forms['checkout'];

let allInputs = checkoutForm.elements; //get all html elements inside form
allInputs = [...allInputs].filter(e => e.getAttribute("name")); //filter out array of the elements that are not inputs

const postalCodeField = checkoutForm.querySelector('#postalCode');
const phoneNumberField = checkoutForm.querySelector('#phone');
const emailField = checkoutForm.querySelector('#email');
const creditCardField = checkoutForm.querySelector('#creditCard');
const securityCodeField = checkoutForm.querySelector('#CVV');
const expDateField = checkoutForm.querySelector('#expDate');

const mainFormError = document.querySelector('.form__error');
const mainFormSuccess = document.querySelector('.form__success');

const formButton = checkoutForm.querySelector('button');

allInputs.forEach(element => {
    element.addEventListener('input', (e) => { //handle live validation
        handleInputsValidation(element);
    })
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //validate inputs
    allInputs.forEach(element => {
        handleInputsValidation(element);
    });
    //handle post response
    async function fetchResponseJSON() {
        const response = await fetch(e.target.action, {
            method: 'POST',
            body: new URLSearchParams(new FormData(e.target))
        }).catch((error) => {
            console.log(error)
        });
        const responseJSON = await response.json();
        if(response.ok) {
            handleResponseSuccess(responseJSON.message);
        } else {
            handleResponseError();
        }
    }
    fetchResponseJSON();
});

const handleResponseSuccess = (message) => {
    mainFormError.classList.remove('active');
    mainFormSuccess.classList.add('active');
    mainFormSuccess.textContent = message;
    formButton.disabled = true;
}

const handleResponseError = () => {
    mainFormError.classList.add('active');
    mainFormSuccess.classList.remove('active');
    formButton.disabled = false;
}

const handleInputsValidation = (element) => {
    checkIfInputValueIsEmpty(element);  //check all the inputs for value presence
    switch (element) {
        case phoneNumberField:   //validate phone number input
            validateNumberFields(element, 9);
            break;
        case emailField: //validate email input
            validateEmailInput(element);
            break;
        case postalCodeField:  //validate postal code input
            validateNumberFields(element, 5)
            break;
        case creditCardField:  //validate credit card input
            validateNumberFields(element, 16);
            break;
        case securityCodeField: //validate security code input
            validateNumberFields(element, 3);
            break;
        case expDateField: //validate exp date input
            checkInputExpiryDate(element);
            break;
    }
}

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