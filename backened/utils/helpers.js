const moment = require('moment');
const mongoose = require('mongoose');

/**
 * Generate a unique ID with prefix
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Generated ID
 */
const generateUniqueId = (prefix = '') => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}${timestamp}${random}`.toUpperCase();
};

/**
 * Calculate age from date of birth
 * @param {Date} dob - Date of birth
 * @returns {number} Age in years
 */
const calculateAge = (dob) => {
    return moment().diff(moment(dob), 'years');
};

/**
 * Format date to readable string
 * @param {Date} date - Date to format
 * @param {string} format - Moment.js format string
 * @returns {string} Formatted date
 */
const formatDate = (date, format = 'DD MMM YYYY') => {
    return moment(date).format(format);
};

/**
 * Calculate percentage
 * @param {number} obtained - Obtained marks
 * @param {number} total - Total marks
 * @returns {number} Percentage
 */
const calculatePercentage = (obtained, total) => {
    if (total === 0) return 0;
    return ((obtained / total) * 100).toFixed(2);
};

/**
 * Generate grade based on percentage
 * @param {number} percentage - Percentage
 * @returns {string} Grade
 */
const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};

/**
 * Sanitize input data
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

/**
 * Generate random password
 * @param {number} length - Password length
 * @returns {string} Generated password
 */
const generateRandomPassword = (length = 8) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

/**
 * Convert object to query string
 * @param {object} obj - Object to convert
 * @returns {string} Query string
 */
const objectToQueryString = (obj) => {
    return Object.keys(obj)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join('&');
};

/**
 * Check if ID is valid MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} Is valid ObjectId
 */
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Paginate array of data
 * @param {Array} data - Data array
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result
 */
const paginate = (data, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        totalItems: data.length,
        itemsPerPage: limit,
        data: data.slice(startIndex, endIndex)
    };

    return result;
};

/**
 * Calculate working days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Number of working days
 */
const calculateWorkingDays = (startDate, endDate) => {
    let count = 0;
    const current = moment(startDate);
    const end = moment(endDate);

    while (current.isSameOrBefore(end)) {
        if (current.isoWeekday() <= 5) { // Monday to Friday
            count++;
        }
        current.add(1, 'days');
    }

    return count;
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

module.exports = {
    generateUniqueId,
    calculateAge,
    formatDate,
    calculatePercentage,
    calculateGrade,
    isValidEmail,
    isValidPhone,
    sanitizeInput,
    generateRandomPassword,
    objectToQueryString,
    isValidObjectId,
    paginate,
    calculateWorkingDays,
    formatFileSize,
    deepClone,
    debounce
};