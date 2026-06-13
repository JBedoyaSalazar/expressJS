function validateUsername(username) {
    if (!username) {
        return {
            valid: false,
            message: 'Username is required'
        }
    }

    if (typeof username !== 'string') {
        return {
            valid: false,
            message: 'Username must be a string'
        }
    }

    if (username.trim().length < 3) {
        return {
            valid: false,
            message: 'Username must contain at least 3 characters'
        }
    }

    return { valid: true }
}

function validatePassword(password) {
    if (!password) {
        return {
            valid: false,
            message: 'Password is required'
        }
    }

    if (password.length < 8) {
        return {
            valid: false,
            message: 'Password must contain at least 8 characters'
        }
    }

    return { valid: true }
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

function validateRegisterData(user) {
    const {
        username,
        email,
        password
    } = user

    const usernameValidation =
        validateUsername(username)

    if (!usernameValidation.valid) {
        return usernameValidation
    }

    const emailValidation =
        validateEmail(email)

    if (!emailValidation.valid) {
        return emailValidation
    }

    const passwordValidation =
        validatePassword(password)

    if (!passwordValidation.valid) {
        return passwordValidation
    }

    return {
        valid: true
    }
}

module.exports = {
    validateUsername,
    validatePassword,
    validateRegisterData
}