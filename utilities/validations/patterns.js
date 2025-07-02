export const validationForFullName = () => {
	return /^(?!\s*$)[a-zA-Z'\s]+$/i;
};

export const validationNumberOnly = () => {
	return /^[0-9]+$/i;
};

export const validateEmailPattern = () => {
	return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
};

export const validationMobilePattern = () => {
	return /^(?!0{10})[0-9]{10}$/i;
	// return /^[0-9]{10}$/i;
};

export const validationPincodePattern = () => {
	return /^(?!0{6})(\d{6})$/;
	// return /^(\d{6})$/;
};

export const validationIfscCodePattern = () => {
	return /^(?!0{11})[a-zA-Z0-9]{11}$/i;
	// return /^[a-zA-Z0-9]{11}$/i;
};

export const validationNumberOnlyWithDecimal = () => {
	return /^[0-9.]+$/i;
};

export const validationForName = () => {
	return /^[a-zA-Z']+$/i;
};

export const validationForNumbersAndAlphabets = () => {
	return /^[a-zA-Z0-9'\s]+$/i;
};

export const validationForOrderID = () => {
	return /^[a-zA-Z0-9-'\s]+$/i;
};

export const validationForEmptyString = () => {
	return /([^\s])/;
};

export const validationForAddress = () => {
	return /^[a-zA-Z0-9\s/,.'-]{0,}$/;
};

export const validationForIfscCode = () => {
	return /^[A-Z]{4}0[A-Z0-9a-z]{6}$/;
};

export const validationForAccountNo = () => {
	return /[0-9]{9,18}/;
};

export const validationForDebitCard = () => {
	return /^([0-9]{4}[-]?){3}([0-9]{4})$/;
};

export const validationForCvv = () => {
	return /^[0-9]{3,4}$/;
};

export const validationExpiryDate = () => {
	return /^(0[1-9]|1[0-2])\/\d{2}$/;
};
export const validationForStreetAddress = () => {
	return /^[a-zA-Z0-9\s:,/\\&()-.'#@_"]{0,}$/;
};

