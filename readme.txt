Sửa MySQL ko có AUTO_INCREMENT
        Để giải quyết vấn đề, hãy chạy lệnh SQL:
        `ALTER TABLE taikhoans MODIFY COLUMN MATK INT NOT NULL AUTO_INCREMENT;`
        Để đảm bảo rằng MATK được đặt làm khóa chính. 
        Nếu có bất kỳ hàng nào trùng lặp với MATK = 0, bạn nên xóa chúng đi.
        -- Bước 1: Tắt kiểm tra khóa ngoại
        SET FOREIGN_KEY_CHECKS = 0;

        -- Bước 2: Chạy câu lệnh sửa bảng của bạn
        ALTER TABLE taikhoans
        MODIFY COLUMN MATK INT NOT NULL AUTO_INCREMENT;

        -- Bước 3: Bật lại kiểm tra khóa ngoại để bảo vệ DB
        SET FOREIGN_KEY_CHECKS = 1;
    Cách 2:
        -- Bước 1: Xóa ràng buộc khóa ngoại ở bảng logs
        ALTER TABLE logs DROP FOREIGN KEY logs_ibfk_1;
        ALTER TABLE logs DROP FOREIGN KEY taikhoan_phanquyens_ibfk_1

        -- Bước 2: Thêm thuộc tính tự động tăng cho bảng taikhoans
        ALTER TABLE taikhoans MODIFY COLUMN MATK INT NOT NULL AUTO_INCREMENT;

        -- Bước 3: Tạo lại khóa ngoại cho bảng logs để đảm bảo liên kết dữ liệu
        ALTER TABLE logs 
        ADD CONSTRAINT logs_ibfk_1 
        FOREIGN KEY (MATK) REFERENCES taikhoans(MATK) 
        ON DELETE CASCADE ON UPDATE CASCADE;

// nếu không dùng electron
          "scripts": {
    "start": "node app.js",
    "dev": "cross-env NODE_ENV=development nodemon app.js",
    "test": "cross-env NODE_ENV=test node app.js"
  },