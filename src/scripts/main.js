// Vars
const country = document.getElementById('country');
const form = document.getElementById('form');

const formObj = {
	firstName: {
		id: 'firstName',
		re: /^[\D]{3,}$/,
	},
	lastName: {
		id: 'lastName',
		re: /^[\D]{3,}$/,
	},

	email: {
		id: 'email',
		re: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
	},
	phone: {
		id: 'phone',
		re: /^[\d]{7,}$/,
	},
};

// Set phone prefix
const setPrefix = () => {
	const phonePrefix = document.getElementById('phonePrefix');
	const phoneCode = country.options[country.selectedIndex].getAttribute(
		'dataPrefix'
	);
	phonePrefix.textContent = phoneCode;
};

// Validate form field
const validateField = (id, re) => {
	const field = document.getElementById(id);
	const parent = field.closest('.form-group');

	if (!re.test(field.value)) {
		parent.classList.add('is-invalid');
	} else {
		parent.classList.remove('is-invalid');
	}
};

// Get full phone number
const getFullPhone = () => {
	const phonePrefix = document.getElementById('phonePrefix').innerText;
	const phoneNum = document.getElementById('phone').value;
	return phonePrefix.concat(phoneNum);
};

// Validate form
const validateForm = () => {
	const formGroups = document.querySelectorAll('.form-group');

	// Validate each form field
	for (let key in formObj) {
		validateField(formObj[key]['id'], formObj[key]['re']);
	}
	const isValid = !Array.from(formGroups).some(group =>
		group.classList.contains('is-invalid')
	);

	return isValid;
};

// On submit form
const submitForm = e => {
	e.preventDefault();

	let isValid = validateForm();

	if (isValid) {
		const formElemenetArr = document.querySelectorAll('.form-group__element');

		// Get form data
		const formData = Array.from(formElemenetArr).reduce((obj, input) => {
			obj[input.name] = input.value;
			return obj;
		}, {});

		// Insert full phone value
		formData.phone = getFullPhone();

		// Test alert
		alert('Form was successfully submitted!');
		console.log(formData);

		// Here should be an ajx request with the user data....

		// Clear for fields
		form.reset();
	}
};

// Set phone prefix on first run
setPrefix();

// Set phone prefix on change
country.addEventListener('change', setPrefix);

// Validate form on submit
form.addEventListener('submit', submitForm);
