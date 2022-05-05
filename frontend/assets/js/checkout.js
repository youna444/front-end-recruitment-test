import '../css/checkout.css'
import '../sass/checkout.scss'

//simple form validation
const checkoutForm = document.forms['checkout'];
let invalidInputs = [];

checkoutForm.addEventListener('submit', (e) => {

    const phoneNumberField = checkoutForm.querySelector('#phone-number');
    const emailField = checkoutForm.querySelector('#email');
    const creditCardField = checkoutForm.querySelector('#credit-card');
    const securityCodeField = checkoutForm.querySelector('#security-code');
    const expDateField = checkoutForm.querySelector('#exp-date');

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

    //validate credit card input
    validateNumberFields(creditCardField, 16);

    //validate security code input
    validateNumberFields(securityCodeField, 3);

    //validate exp date input
    checkInputExpiryDate(expDateField);

    if(invalidInputs.length > 0) {
        e.preventDefault();
    }

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
    if(!invalidInputs.includes(input)) { //check if input already is in array so it won't duplicate
        invalidInputs.push(input); //push invalid input to the invalid inputs array
    }
}

const removeErrorMessage = (input) => {
    const errorElement = input.parentNode.querySelector('.error');
    if (errorElement) {
        errorElement.innerText = '';
    }
    input.classList.remove('is-invalid');
    invalidInputs = invalidInputs.filter(item => item !== input); //remove valid inputs from the invalid inputs array
}