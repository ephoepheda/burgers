// admin_auth.js — Manager Dashboard Authentication Logic

const adminAuth = {
    // ⚠️ This is the master manager code. Change it regularly for security!
    MASTER_CODE: 'QUEEN_MANAGER_2026',
    
    login: (code) => {
        if (code === adminAuth.MASTER_CODE) {
            const session = {
                loggedIn: true,
                timestamp: new Date().getTime(),
                role: 'manager'
            };
            localStorage.setItem('queenBurgerAdminSession', JSON.stringify(session));
            return true;
        }
        return false;
    },

    logout: () => {
        localStorage.removeItem('queenBurgerAdminSession');
        location.href = 'admin_login.html';
    },

    isLoggedIn: () => {
        const sessionStr = localStorage.getItem('queenBurgerAdminSession');
        if (!sessionStr) return false;

        const session = JSON.parse(sessionStr);
        // Session valid for 24 hours
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const now = new Date().getTime();

        if (now - session.timestamp > twentyFourHours) {
            adminAuth.logout();
            return false;
        }
        return session.loggedIn;
    },

    checkAuth: () => {
        if (!adminAuth.isLoggedIn()) {
            // Guard against infinite redirect loops if we are already on the login page
            if (!location.href.includes('admin_login.html')) {
                location.href = 'admin_login.html';
            }
        } else if (location.href.includes('admin_login.html')) {
            // If logged in and on login page, redirect to dashboard
            location.href = 'admin.html';
        }
    }
};

window.adminAuth = adminAuth;
