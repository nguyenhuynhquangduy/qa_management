document.addEventListener('DOMContentLoaded', function() {
    var dropdowns = document.querySelectorAll('#headeradmin .nav-menu ul li a[href="#"]');

    dropdowns.forEach(function(dropdown) {
        dropdown.addEventListener('click', function(event) {
            event.preventDefault();
            // Đóng tất cả các dropdown khác
            dropdowns.forEach(function(d) {
                if (d !== dropdown) {
                    d.nextElementSibling.style.display = "none";
                }
            });
            // Mở hoặc đóng dropdown được nhấp vào
            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }
        });
    });

    // Đóng dropdown khi nhấp bên ngoài
    document.addEventListener('click', function(event) {
        if (!event.target.matches('#headeradmin .nav-menu ul li a[href="#"]')) {
            dropdowns.forEach(function(dropdown) {
                dropdown.nextElementSibling.style.display = "none";
            });
        }
    });

    // Cập nhật trạng thái thông báo (ví dụ)
    // var unreadCount = document.getElementById('unreadCount').getAttribute('data-unread-count');
    // unreadCount = Number(unreadCount);
    // var notificationBadge = document.querySelector('.notification-badge');

    // if (notificationBadge) {
    //     var unreadCount = Number(!{unreadCount});
    //     if (unreadCount > 0) {
    //         notificationBadge.textContent = unreadCount; // Hiển thị số lượng thông báo chưa đọc
    //         notificationBadge.style.backgroundColor = 'red'; // Đổi màu khi có thông báo mới
    //     } else {
    //         notificationBadge.textContent = '0'; // Xóa số lượng nếu không có thông báo mới
    //         notificationBadge.style.backgroundColor = 'blue'; // Hoặc một màu khác để không hiển thị thông báo transparent
    //     }
    // }
});
