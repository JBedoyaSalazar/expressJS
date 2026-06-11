function validateName(name) {
    if (!name) {
        return { valid: false, message: 'Name is required' };
    }
    if (typeof name !== 'string') {
        return { valid: false, message: 'Name must be a string' };
    }
    if (name.trim().length < 3 || name.trim().length > 20) {
        return { valid: false, message: 'Name must have between 3 and 20 characters' };
    }
    return { valid: true };
}

function validateEmail(email) {
    if (!email) {
        return { valid: false, message: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email format' };
    }
    return { valid: true };
}

function validateUserData(user) {
    const { id, name, email } = user;

    if (id === undefined || id === null) {
        return { valid: false, message: 'Id is required' };
    }
    if (typeof id !== 'number') {
        return { valid: false, message: 'Id must be numeric' };
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) return nameValidation;

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) return emailValidation;

    return { valid: true };
}

function validateUserUpdate(user) {
    const { name, email } = user;

    const nameValidation = validateName(name);
    if (!nameValidation.valid) return nameValidation;

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) return emailValidation;

    return { valid: true };
}

function checkIdCollision(newId, users, currentUserId = null) {
    return users.some(user => user.id === newId && user.id !== currentUserId);
}

module.exports = {
    validateUserData,
    validateUserUpdate,
    checkIdCollision
}