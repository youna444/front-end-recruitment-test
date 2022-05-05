import '../css/checkout.css'
import '../sass/checkout.scss'

//simple form validation
const checkoutForm = document.forms['checkout'];
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
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

    //validate credit card input
    validateNumberFields(creditCardField, 16);

    //validate security code input
    validateNumberFields(securityCodeField, 3);

    //validate exp date input
    checkInputExpiryDate(expDateField);

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
        const expMonth = input.value.split('/')[0]; //get set month
        const expYear = input.value.split('/')[1]; //get set year

        const currentYearLastTwoDigits = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of current year

        // Get current month in MM format
        let currentMonthMMFormat = new Date().getMonth()+1;
        currentMonthMMFormat = currentMonthMMFormat.toString().padStart(2, '0'); // i.e. changes 1 -> 01....9->09, 10 -> 10

        //validate month func
        const validateMonth = (setMonth, currentMonth) => {
            if(setMonth > 0 && setMonth <= 12 ) { //check if value is 1-12
                if(expMonth >= currentMonth) {
                    return true;
                }
            } else {
                return false;
            }
        }

        //validate year func
        const validateYear = (setYear, currentYear) => {
            if(setYear >= currentYear) {
                return true;
            } else {
                return false;
            }
        }

        // handle inpit validation
        if(validateMonth(expMonth, currentMonthMMFormat) && validateYear(expYear, currentYearLastTwoDigits)) {
            removeErrorMessage(input);
            return true;
        } else {
            setErrorMessage(input, 'Provided card is expired');
            return false;
        }
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