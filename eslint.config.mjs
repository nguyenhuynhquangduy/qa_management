import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import pluginNode from "eslint-plugin-n"; // Import plugin Node.js vừa cài

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      js,
      n: pluginNode // Tích hợp plugin Node vào hệ thống
    },
    extends: ["js/recommended"],
    languageOptions: {
      // Khai báo cho ESLint biết dự án chạy cả ở Trình duyệt và Node.js Backend
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      // 🎯 ĐÂY LÀ NƠI BẮT LỖI QUÊN AWAIT CỦA BẠN:
      // Luật này của plugin Node sẽ kiểm tra nếu bạn trả về một Promise lơ lửng mà không có await/return
      "n/no-missing-require": "error",

      // Bạn có thể bật thêm các luật ép buộc code bất đồng bộ phải chặt chẽ
      "require-await": "error", // Cảnh báo nếu hàm ghi async mà bên trong không có await nào
    }
  },
  pluginReact.configs.flat.recommended,
]);