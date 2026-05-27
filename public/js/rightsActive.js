$(document).ready(function () {
    let MATK = null;
    let selectedPermissions = [];// Lưu quyền được chọn của tài khoản

    //Tìm kiếm theo tên tài khoản
    $('#search-box').on('input', function () {
        const query = $(this).val().toLowerCase().trim();
        $("#taikhoan-list li").each(function () {
            const username = $(this).find('input[type="radio"]').closest('label').text().toLowerCase();
            if (username.includes(query)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    })
    //Xử lý khi nhấp vào tài khoản (radio button)
    $('input[name="MATK"]').on('change', function () {
        MATK = $(this).val();
        /*
        Các cách viết thay đổi
        const MATK = $(this).val();
        const MATK = this.value;
        MATK = $('input[name="MATK"]:checked').val();
        // 1. Dùng event.target (chính xác nhất)
        $('input[name="MATK"]').on('change', function (e) {
            MATK = e.target.value;
        });
        MATK = document.getElementById('MATK_id').value;
        MATK = document.querySelector('input[name="MATK"]:checked').value;
        MATK = $('input[name="MATK"]:checked').val();


         */
        /* code ajax đã cũ
        if (MATK) {
            $.ajax({
                url: "/rights/rights-of-user",
                type: "GET",
                data: { MATK },
                success: function (data) {
                    // Xóa hết các checkbox quyền
                    $('.phanquyen-list input[name="id"]').prop('checked', false);
                    // Lưu quyền của tài khoản và đánh dấu các quyền đã có cho tài khoản
                    selectedPermissions = data.map(phanquyen => phanquyen.id);
                    selectedPermissions.forEach(id => {
                        $('.phanquyen-list input[value="' + id + '"]').prop('checked', true);
                    });

                }

            })
        }
            */
        //Xử lý cách mới fetch
        if (MATK) {
            loadRightsOfUser(MATK);
        }
        async function loadRightsOfUser(MATK) {
            try {
                // 1. Reset trạng thái hiển thị
                // Bỏ chọn checkbox của nhóm
                $('.group-checkbox').prop("checked", false);
                // Xoá các số đếm cũ
                document.querySelectorAll('.rights-count').forEach(span => {
                    span.textContent = '';
                });
                // Bỏ chọn toàn bộ checkbox của quyền
                document.querySelectorAll('.phanquyen-list input[name="id"]')
                    .forEach(input => input.checked = false);

                // 2. Fetch dữ liệu mới
                const response = await fetch(`/rights/rights-of-user?MATK=${encodeURIComponent(MATK)}`, {
                    method: "GET",
                    headers: { "Accept": "application/json" }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || "Lỗi khi tải quyền");
                }

                const data = await response.json();
                const { userRights, groupRights } = data;


                // 3. Check lại các quyền theo DB
                if (userRights && Array.isArray(userRights)) {
                    const selectedPermissions = userRights.map(p => p.id);
                    selectedPermissions.forEach(id => {
                        const checkbox = document.querySelector(
                            `.phanquyen-list input[value="${id}"]`
                        );
                        if (checkbox) checkbox.checked = true;
                    });
                }

                // 4. Cập nhật số lượng quyền cho từng nhóm
                if (groupRights && Array.isArray(groupRights)) {
                    groupRights.forEach(group => {
                        const countSpan = document.querySelector(`.rights-count[data-group-id="${group.MANQ}"]`);
                        if (countSpan) {
                            countSpan.textContent = ` (${group.userPermissionsCount}/${group.totalPermissions})`;
                        }
                    });
                }

            } catch (error) {
                console.error("Lỗi:", error.message);
                showWarning(error.message);
            }
        }
        /*
        Rút gọn
        fetch(`/rights/rights-of-user?MATK=${MATK}`)
            .then(res => {
                if (!res.ok) throw new Error("Tài khoản không tồn tại");
                return res.json();
            })
            .then(data => {
                document.querySelectorAll('.phanquyen-list input[name="id"]')
                    .forEach(input => input.checked = false);

                data.forEach(p => {
                    const checkbox = document.querySelector(
                        `.phanquyen-list input[value="${p.id}"]`
                    );
                    if (checkbox) checkbox.checked = true;
                });
            })
            .catch(err => alert(err.message));
        */
    });
    // Xử lý mở/đóng danh sách quyền trong mỗi nhóm
    $('.rights-group-btn').on('click', function () {
        const rightsGroupID = $(this).data('group-id');
        $(`ul.phanquyen-list[data-group-id="${rightsGroupID}"]`).toggle();
    });
    // Xử lý chọn tất cả quyền trong nhóm khi chọn checkbox của nhóm
    $('.group-checkbox').on('change', function () {
        const groupID = $(this).data('group-id');
        const isChecked = $(this).is(':checked');
        $(`ul.phanquyen-list[data-group-id="${groupID}"] input[name="id"]`).prop('checked', isChecked);
    });
    //Xử lý lưu quyền cho tài khoản
    $('#save-rights').on('click', function () {

        if (!MATK) return showWarning('Vui lòng chọn tài khoản');
        updateRightsOfUser(MATK);


    });
    //Xử lý copy quyền cho tài khoản
    $('#copy-rights').on('click', function () {
        if (!MATK) return showWarning('Vui lòng chọn tài khoản');
        const targetAccount = prompt('Nhập MATK tài khoản mà bạn muốn sao chép quyền đến:');
        if (targetAccount) {
            updateRightsOfUser(targetAccount);
        }
    });

    //hàm lưu quyền cho tài khoản
    async function updateRightsOfUser(MATK) {
        try {
            // const chonQuyen = [];
            // $('.phanquyen-list input[name="id"]:checked').each(function () {
            //     if ($(this).data()) {
            //         chonQuyen.push($(this).val());
            //     } else {
            //         showWarning("Cảnh báo ! Dữ liệu rỗng !");
            //     }
            // });

            // Lấy danh sách các quyền đã được chọn, viết gọn và chính xác hơn
            const chonQuyen = $('.phanquyen-list input[name="id"]:checked').map(function () {
                return $(this).val();
            }).get();
            const response = await fetch("/rights/rights-of-user-update",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",//tôi đang gữi dữ liệu dạng JSON
                        "Accept": "application/json",// tôi muốn phản hồi dạng JSON
                    },
                    body: JSON.stringify({ MATK: MATK, phanquyens: chonQuyen })
                }

            );
            // Luôn đọc body của response để lấy message từ server
            const result = await response.json();
            if (!response.ok) {
                // Ném lỗi với message nhận được từ server
                throw new Error(result.message || "Lỗi khi cập nhật quyền");
            }

            // [PHẦN BỊ THIẾU] - Hiển thị thông báo thành công
            Swal.fire({
                title: 'Thành công!',
                text: result.message || 'Cập nhật quyền thành công!', // Sử dụng message từ server nếu có
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error("Lỗi:", error.message);
            showWarning(error.message);
        }
    };
    /*
       Khi bạn định nghĩa mối quan hệ belongsToMany (nhiều-nhiều) với alias phanquyens, Sequelize tự động sinh ra các phương thức:
       taikhoan.belongsToMany(models.phanquyen, {
           through: models.taikhoan_phanquyen,
           foreignKey: 'MATK',
           otherKey: 'phanquyenId',
           as: 'phanquyens'
           });
       setPhanquyens() - thay thế tất cả quyền liên kết
       addPhanquyens() - thêm quyền
       removePhanquyens() - xoá quyền
       getPhanquyens() - lấy danh sách quyền
       hasPhanquyens() - kiểm tra quyền tồn tại
       Bảng trung gian taikhoan_phanquyen được sử dụng để lưu trữ quan hệ này.
       */
    function showWarning(message) {
        Swal.fire({
            title: 'Cảnh báo',
            text: message,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    }
});