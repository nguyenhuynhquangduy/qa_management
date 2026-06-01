module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'Vui lòng đăng nhập để tiếp tục');
        return res.redirect('/');
    },

    isAdmin: (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.admin == 1) {
                return next();
            } else {
                return res.redirect('/error-admin.html');
            }
        }
        return res.redirect('/');
    },

    kiemtraQuyen: (requiredPermission) => {
        return (req, res, next) => {
            if (req.user && req.user.phanquyens.includes(requiredPermission)) {
                return next();
            } else {
                return res.status(403).send('Bạn không có quyền truy cập.');
            }
        };
    }
};