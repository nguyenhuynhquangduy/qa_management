function checkString(value) {
    if (typeof value !== 'string') return false;

    const clean = value.trim();

    // Rỗng sau khi trim
    if (!clean) return false;

    // Chỉ toàn dấu "
    if (/^"+$/.test(clean)) return false;

    // Phải chứa ít nhất 1 chữ hoặc số (hỗ trợ tiếng Việt)
    if (!/[a-zA-Z0-9À-ỹ]/.test(clean)) return false;

    return true;
}

module.exports = checkString;