// function checkString(value) {
//     if (typeof value !== 'string') return false;

//     const clean = value.trim();

//     // Rỗng sau khi trim
//     if (!clean) return false;

//     // Chỉ toàn dấu "
//     if (/^"+$/.test(clean)) return false;

//     // Phải chứa ít nhất 1 chữ hoặc số (hỗ trợ tiếng Việt)
//     if (!/[a-zA-Z0-9À-ỹ]/.test(clean)) return false;

//     return true;
// }

// module.exports = checkString;
function cleanAndValidateString(value) {
    // 1. Kiểm tra nếu không phải chuỗi hoặc rỗng
    if (typeof value !== 'string') {
        return { isValid: false, error: "Dữ liệu phải là chuỗi văn bản!" };
    }

    // 2. Tự động loại bỏ khoảng trắng thừa ở 2 đầu
    const clean = value.trim();
    if (!clean) {
        return { isValid: false, error: "Trường này không được để trống!" };
    }

    // 3. Kiểm tra các ký tự cấm: ; ' " - + *
    // Sử dụng Regex để tìm xem có chứa bất kỳ ký tự nào trong danh sách cấm không
    const forbiddenChars = /[;'"\-+*]/;
    if (forbiddenChars.test(clean)) {
        return {
            isValid: false,
            error: "Dữ liệu không được chứa các ký tự đặc biệt như: ; ' \" - + *"
        };
    }

    // 4. Kiểm tra xem có chứa ít nhất 1 chữ cái hoặc chữ số (hỗ trợ tiếng Việt) không
    if (!/[a-z0-9à-ỹđ]/i.test(clean)) {
        return { isValid: false, error: "Dữ liệu phải chứa ít nhất một chữ cái hoặc chữ số!" };
    }

    // 5. Nếu mọi thứ hợp lệ, trả về chuỗi đã được làm sạch
    return { isValid: true, data: clean };
}

module.exports = cleanAndValidateString;