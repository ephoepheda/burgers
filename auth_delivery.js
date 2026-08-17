// auth_delivery.js — Handling Delivery Registration & Login

const auth = {
    // Hash password using CryptoJS (SHA256)
    hashPassword: (password) => {
        return CryptoJS.SHA256(password).toString();
    },

    register: async (name, phone, password) => {
        console.log('[Auth] Registering delivery guy:', name);
        const hashedPassword = auth.hashPassword(password);

        let users = JSON.parse(localStorage.getItem('queenBurgerDeliveryUsers')) || [];
        if (users.find(u => u.phone === phone)) {
            window._lastAuthError = "Phone already registered";
            return false;
        }

        users.push({ 
            name: name, 
            phone: phone, 
            password: hashedPassword,
            status: 'Available'
        });
        localStorage.setItem('queenBurgerDeliveryUsers', JSON.stringify(users));

        return true;
    },

    login: async (phone, password) => {
        console.log('[Auth] Logging in delivery guy:', phone);
        const hashedPassword = auth.hashPassword(password);

        let users = JSON.parse(localStorage.getItem('queenBurgerDeliveryUsers')) || [];
        const user = users.find(u => u.phone === phone && u.password === hashedPassword);

        if (user) {
            // Save session to localStorage
            localStorage.setItem('oneBurgerDeliveryUser', JSON.stringify(user));
            return user;
        }
        return null;
    },

    logout: () => {
        localStorage.removeItem('oneBurgerDeliveryUser');
        location.href = 'delivery_login.html';
    },

    getUser: () => {
        const user = localStorage.getItem('oneBurgerDeliveryUser');
        return user ? JSON.parse(user) : null;
    },

    checkAuth: () => {
        const user = auth.getUser();
        if (!user && !location.href.includes('login') && !location.href.includes('register')) {
            location.href = 'delivery_login.html';
        }
        return user;
    }
};

window.auth = auth;
