// script.js — Queen Burger Multi-Page Application Logic

// --- DATA ---
const menuItems = [
    { id: 1, nameEn: "Grayson Pizza-Burger", nameAm: "ግሬይሰን ፒዛ-በርገር", price: 1250, img: "The-Grayson-Pizza-Burger.jpg", category: 'burger', isPopular: true },
    { id: 2, nameEn: "Royal Master Deal", nameAm: "ሮያል ማስተር ዲል", price: 1850, img: "Combo.webp", category: 'combos', isCombo: true },
    { id: 3, nameEn: "Benjamin Hollywood", nameAm: "ቤንጃሚን ሆሊውድ", price: 980, img: "Copy-of-The-Benjamin-Hollywood_Photography-by-Nick-Johnson_@rickronson-12-2-2000x1125.jpg", category: 'burger', isPopular: true },
    { id: 4, nameEn: "Family Feast Box", nameAm: "ሮያል ፋሚሊ ቦክስ", price: 2800, img: "combo_family.png", category: 'combos', isCombo: true },
    { id: 5, nameEn: "Whopper Classic", nameAm: "ሆፐር ክላሲክ", price: 850, img: "images (1) (1).jpg", category: 'burger', isPopular: true },
    { id: 6, nameEn: "Double Steak House", nameAm: "ደብል ስቴክ ሃውስ", price: 920, img: "images (8).jpg", category: 'burger', isPopular: true },
    { id: 7, nameEn: "Garden Royale (Veg)", nameAm: "ጋርደን ሮያል", price: 650, img: "images (11).jpg", category: 'burger' },
    { id: 8, nameEn: "Pepperoni Pizza King", nameAm: "ፔፐሮኒ ፒዛ ኪንግ", price: 1150, img: "images (10).jpg", category: 'pizza', isPopular: true },
    { id: 9, nameEn: "Insanity Smash", nameAm: "ኢንሳኒቲ ስማሽ", price: 880, img: "56389604_insanity-burger_6x4.webp", category: 'burger', isPopular: true },
    { id: 10, nameEn: "Fiery Pepper Royal", nameAm: "ፋይሪ ፔፐር ሮያል", price: 720, img: "0190e65e-47b4-70a0-8dec-0f2515ddf946.png", category: 'burger', isPopular: true },
    { id: 11, nameEn: "Smash Royale", nameAm: "ስማሽ ሮያል", price: 820, img: "Easy-Smash-Burger-with-Best-Burger-Sauce.jpg", category: 'burger', isPopular: true },
    { id: 12, nameEn: "Truffle King Fries", nameAm: "ትራፍል ኪንግ ፍራይስ", price: 350, img: "Simply-Recipes-Crispy-French-Fries-LEAD-02-a0352dfe374241d38c04c6cac19b9d0d.jpg", category: 'sides', isCombo: true },
    { id: 13, nameEn: "Imperial Pizza", nameAm: "ኢምፔሪያል ፒዛ", price: 1050, img: "72bf02a3-b886-46f1-8d9d-1889861c7b56.webp", category: 'pizza' },
    { id: 14, nameEn: "King's Daily Meal", nameAm: "ኪንግ ዴይሊ ሚል", price: 1200, img: "home_combo.png", category: 'combos', isCombo: true },
    { id: 15, nameEn: "Onion Ring Platter", nameAm: "ኦኒየን ሪንግ ፕላተር", price: 450, img: "images (5).jpg", category: 'sides', isCombo: true },
    { id: 16, nameEn: "Refreshing Duo", nameAm: "ሪፍሬሽንግ ዱኦ", price: 550, img: "images (6).jpg", category: 'drinks', isCombo: true },
    { id: 17, nameEn: "Crispy Duo Burger", nameAm: "ክሪስፒ ዱኦ በርገር", price: 1100, img: "images (2).jpg", category: 'burger', isCombo: true },
    { id: 18, nameEn: "Cheese Burger Deluxe", nameAm: "ቺዝ በርገር ደሉክስ", price: 550, img: "images (7).jpg", category: 'burger' },
    { id: 19, nameEn: "Village Pride", nameAm: "ቪሌጅ ፕራይድ", price: 480, img: "images (4).jpg", category: 'burger' },
    { id: 20, nameEn: "Wings of Fire", nameAm: "ウィングス オブ ファイヤー", price: 650, img: "images (2).jpg", category: 'sides', isCombo: true },
    { id: 21, nameEn: "Berry Royal Blast", nameAm: "ቤሪ ሮያል ብላስት", price: 380, img: "images (6).jpg", category: 'drinks' },
    { id: 22, nameEn: "Classic Mix Deal", nameAm: "ክላሲክ ሚክስ ዲል", price: 1250, img: "images (9).jpg", category: 'combos', isCombo: true },
    { id: 23, nameEn: "Royal Shake", nameAm: "ሮያል ሼክ", price: 420, img: "Untitled_design_-_2025-04-17T130659.845.webp", category: 'drinks' },
    { id: 24, nameEn: "Golden Fries", nameAm: "ጎልደን ፍራይስ", price: 180, img: "download.jpg", category: 'sides' },
    { id: 25, nameEn: "Duo Snack Box", nameAm: "ዱኦ ስናክ ቦክስ", price: 950, img: "images (7).jpg", category: 'combos', isCombo: true }
];

let cart = JSON.parse(localStorage.getItem('queenBurgerCart')) || [];
let orders = JSON.parse(localStorage.getItem('queenBurgerOrders')) || [];
let orderType = 'pickup'; // Default

const app = {
    init: () => {
        const path = window.location.pathname;

        // Common for all pages
        app.updateCartCount();
        
        // Page specific initialisation
        if (path.includes('menu.html')) {
            app.initMenuPage();
        } else if (path.includes('orders.html')) {
            app.initOrdersPage();
        }

        // Language Change Listener
        window.addEventListener('languageChanged', () => {
            if (path.includes('menu.html')) {
                app.renderMenu();
                app.updateCartUI();
            } else if (path.includes('orders.html')) {
                app.renderOrderHistory();
            }
        });

        app.subscribeRealtime();
    },

    initMenuPage: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const typeParam = urlParams.get('type');
        const filterParam = urlParams.get('filter');

        if (typeParam === 'delivery') {
            app.setOrderType('delivery', true);
        } else if (typeParam === 'pickup') {
            app.setOrderType('pickup', true);
        }

        if (filterParam === 'popular') {
            app.applyFilter('popular');
        } else if (filterParam === 'combo') {
            app.applyFilter('combo');
        } else {
            app.renderMenu();
        }

        app.updateCartUI();

        const searchInput = document.getElementById('menuSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => app.searchMenu(e.target.value));
        }
    },

    initOrdersPage: () => {
        app.renderOrderHistory();
    },

    showToast: (msg, isError = false) => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                text: msg,
                icon: isError ? 'error' : 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#1a1a2e',
                color: '#fff'
            });
        } else {
            alert(msg);
        }
    },

    renderMenu: (itemsToRender) => {
        const grid = document.getElementById('menu-grid');
        if (!grid) return;
        
        const items = itemsToRender || menuItems;
        const lang = i18n.currentLang;

        grid.innerHTML = items.map(item => `
            <div class="card">
                ${item.isPopular ? '<div class="f-badge f-popular">🔥 BEST SELLER</div>' : ''}
                ${item.isCombo ? '<div class="f-badge f-combo">🎁 SPECIAL COMBO</div>' : ''}
                <div class="card-img-container">
                    <img src="${item.img}" class="card-img">
                </div>
                <div class="card-body">
                    <h3 style="color:white; font-size:1.1rem; font-family:var(--font-display); font-weight:800;">
                        ${lang === 'en' ? item.nameEn : item.nameAm}
                    </h3>
                    <div class="card-price">${item.price} ETB</div>
                    <button class="btn btn-attractive" onclick="app.addToCart(${item.id}, event)">
                         ${i18n.t('nav_cart')} +
                    </button>
                </div>
            </div>
        `).join('');
    },

    applyFilter: (mode) => {
        let filtered = [];
        const banner = document.getElementById('filterBanner');
        if (!banner) return;

        if (mode === 'popular') {
            filtered = menuItems.filter(i => i.isPopular);
            banner.innerHTML = `<div class="mode-info">🔥 Showing Popular Items <span onclick="app.resetFilter()" style="text-decoration:underline; cursor:pointer; margin-left:10px; font-weight:700;">Show All</span></div>`;
            banner.style.display = 'block';
        } else if (mode === 'combo') {
            filtered = menuItems.filter(i => i.isCombo);
            banner.innerHTML = `<div class="mode-info">🎁 Showing Combos & Offers <span onclick="app.resetFilter()" style="text-decoration:underline; cursor:pointer; margin-left:10px; font-weight:700;">Show All</span></div>`;
            banner.style.display = 'block';
        }

        app.renderMenu(filtered);
    },

    resetFilter: () => {
        const banner = document.getElementById('filterBanner');
        if (banner) banner.style.display = 'none';
        app.renderMenu(menuItems);
        // Clean URL
        window.history.pushState({}, '', window.location.pathname);
    },

    searchMenu: (query) => {
        const q = query.toLowerCase();
        const filtered = menuItems.filter(i => 
            i.nameEn.toLowerCase().includes(q) || i.nameAm.toLowerCase().includes(q)
        );
        app.renderMenu(filtered);
    },

    toggleLanguage: () => {
        const nextLang = i18n.currentLang === 'en' ? 'am' : 'en';
        i18n.setLanguage(nextLang);
    },

    setOrderType: (type, silent = false) => {
        orderType = type;
        const locGroup = document.getElementById('locationGroup');
        const deliveryFeeEl = document.getElementById('deliveryFee');
        
        if (!locGroup || !deliveryFeeEl) return;

        if (type === 'delivery') {
            locGroup.style.display = 'block';
            deliveryFeeEl.innerText = '150 ETB';
            if (!silent) app.showToast("🚚 " + i18n.t('delivery') + " Selected");
        } else {
            locGroup.style.display = 'none';
            deliveryFeeEl.innerText = '0 ETB';
            if (!silent) app.showToast("🚶‍♂️ " + i18n.t('pickup') + " Selected");
        }
        
        app.updateCartUI();
    },

    addToCart: (id, e) => {
        const existing = cart.find(c => c.id === id);
        if (existing) {
            existing.qty++;
        } else {
            const item = menuItems.find(i => i.id === id);
            cart.push({ ...item, qty: 1 });
        }
        app.saveCart();
        app.updateCartUI();
        app.updateCartCount();
        
        // Visual feedback
        const btn = e ? e.currentTarget : window.event.srcElement;
        const originalText = btn.innerText;
        btn.innerText = "✓ ADDED";
        btn.style.background = "#2ecc71";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "";
        }, 1200);
    },

    saveCart: () => {
        localStorage.setItem('queenBurgerCart', JSON.stringify(cart));
    },

    changeQty: (id, delta) => {
        const idx = cart.findIndex(c => c.id === id);
        if (idx === -1) return;
        cart[idx].qty += delta;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
        app.saveCart();
        app.updateCartUI();
        app.updateCartCount();
    },

    updateCartCount: () => {
        const countEl = document.getElementById('cart-count');
        const totalQty = cart.reduce((a, b) => a + b.qty, 0);

        if (countEl) {
            countEl.innerText = totalQty;
        }

        // Cart reminder badge on the Orders nav button
        const badge  = document.getElementById('navOrdersBadge');
        const navBtn = document.getElementById('navOrdersBtn');
        if (badge && navBtn) {
            if (totalQty > 0) {
                badge.classList.add('visible');
                navBtn.classList.add('has-cart');
            } else {
                badge.classList.remove('visible');
                navBtn.classList.remove('has-cart');
            }
        }
    },

    updateCartUI: () => {
        const list = document.getElementById('cartItems');
        if (!list) return;

        const scBar = document.getElementById('stickyCheckout');
        const scTotal = document.getElementById('scTotal');

        if (cart.length > 0) {
            if (scBar) scBar.classList.add('show');
        } else {
            if (scBar) scBar.classList.remove('show');
        }

        if (cart.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding:50px 0; color:var(--text-muted);">
                <div style="font-size:3rem; margin-bottom:10px;">🛒</div>
                <p>${i18n.currentLang === 'en' ? 'Your cart is empty' : 'ትሪዎ ባዶ ነው'}</p>
            </div>`;
            if (document.getElementById('summarySubtotal')) document.getElementById('summarySubtotal').innerText = '0 ETB';
            if (document.getElementById('summaryTotal')) document.getElementById('summaryTotal').innerText = '0 ETB';
            if (scTotal) scTotal.innerText = '0 ETB';
            return;
        }

        let subtotal = 0;
        const lang = i18n.currentLang;
        
        list.innerHTML = cart.map(item => {
            const lineTotal = item.price * item.qty;
            subtotal += lineTotal;
            return `
                <div class="cart-item">
                    <img src="${item.img}">
                    <div style="flex:1;">
                        <div style="font-weight:700; color:white;">${lang === 'en' ? item.nameEn : item.nameAm}</div>
                        <div style="font-size:12px; color:var(--text-muted);">${item.qty} x ${item.price} ETB</div>
                    </div>
                    <div class="qty-ctrl">
                        <button class="qty-btn" onclick="app.changeQty(${item.id}, -1)">-</button>
                        <span style="font-size:14px; font-weight:700;">${item.qty}</span>
                        <button class="qty-btn" onclick="app.changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            `;
        }).join('');

        const delivery = orderType === 'delivery' ? 150 : 0;
        const grandTotal = subtotal + delivery;

        if (document.getElementById('summarySubtotal')) document.getElementById('summarySubtotal').innerText = subtotal + ' ETB';
        if (document.getElementById('summaryTotal')) document.getElementById('summaryTotal').innerText = grandTotal + ' ETB';
        if (scTotal) scTotal.innerText = grandTotal + ' ETB';
    },

    toggleCart: (force) => {
        const p = document.getElementById('cartPanel');
        const o = document.getElementById('cartOverlay');
        if (!p || !o) return;
        if (force || !p.classList.contains('open')) {
            p.classList.add('open'); o.classList.add('active');
        } else {
            p.classList.remove('open'); o.classList.remove('active');
        }
    },

    selectPayment: (method, el) => {
        document.querySelectorAll('.pay-option').forEach(p => p.classList.remove('selected'));
        el.classList.add('selected');
        el.querySelector('input').checked = true;
        
        const transGrp = document.getElementById('transGroup');
        if (transGrp) transGrp.style.display = (method === 'cod' ? 'none' : 'block');
    },

    captureGPS: (btn) => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Locating...';
        btn.disabled = true;

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            btn.innerHTML = originalText;
            btn.disabled = false;
            return;
        }

        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            document.getElementById('orderGpsCoords').value = `${lat},${lng}`;
            btn.innerHTML = '✅ GPS Captured Successfully!';
            btn.style.background = 'rgba(46, 204, 113, 0.3)';
            btn.style.color = 'white';
        }, error => {
            alert('Unable to retrieve your location. Please check browser permissions.');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, { enableHighAccuracy: true, timeout: 10000 });
    },

    processOrder: async () => {
        const btn = document.getElementById('payBtn');
        const originalText = btn ? btn.innerHTML : 'PAY NOW';
        if (btn) {
            btn.innerHTML = '⏳ PROCESSING...';
            btn.disabled = true;
            btn.style.opacity = '0.7';
        }

        const restoreBtn = () => {
            if (btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        };

        const name = document.getElementById('orderName').value;
        const phone = document.getElementById('orderPhone').value;
        const subcity = document.getElementById('orderLocation').value;
        const addressDetails = document.getElementById('orderAddressDetails').value;
        const method = document.querySelector('input[name="pay"]:checked')?.value;
        const transId = document.getElementById('transId').value;
        const gpsCoords = document.getElementById('orderGpsCoords')?.value || '';

        let location = subcity ? `${subcity}: ${addressDetails}` : addressDetails;
        if (gpsCoords) {
            location += ` | GPS:${gpsCoords}`;
        }

        if (!name || name.length < 3) { restoreBtn(); return app.showToast("❌ Enter your full name", true); }
        if (!phone || phone.length < 10) { restoreBtn(); return app.showToast("❌ Enter a valid 10-digit phone number", true); }
        if (orderType === 'delivery' && !subcity) { restoreBtn(); return app.showToast("❌ Please select a sub-city for delivery", true); }
        if (orderType === 'delivery' && !addressDetails) { restoreBtn(); return app.showToast("❌ Please enter specific address details", true); }
        if (!method) { restoreBtn(); return app.showToast("❌ Please select a payment method", true); }
        if (method !== 'cod' && !transId) { restoreBtn(); return app.showToast("❌ Enter your transaction reference ID", true); }

        app.toggleCart(false);
        document.getElementById('processingModal').classList.add('active');

        const itemsString = cart.map(i => `${i.qty}x ${i.nameEn}`).join(', ');
        const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
        const total = subtotal + (orderType === 'delivery' ? 150 : 0);

        const newOrder = {
            id: 'ORD-' + Math.floor(Math.random() * 1000000),
            customer_name: name,
            phone_number: phone,
            delivery_location: location || 'Pickup',
            address: itemsString, 
            total_price: total,
            payment_method: method,
            transaction_id: transId || '',
            status: orderType === 'delivery' ? 'Preparing 👨‍🍳' : 'Pending ⏳',
            created_at: new Date().toISOString()
        };

        let globalOrders = JSON.parse(localStorage.getItem('queenBurgerGlobalOrders')) || [];
        globalOrders.push(newOrder);
        localStorage.setItem('queenBurgerGlobalOrders', JSON.stringify(globalOrders));

        orders.unshift({ ...newOrder, itemsJSON: [...cart] });
        localStorage.setItem('queenBurgerOrders', JSON.stringify(orders));
            
            setTimeout(() => {
                const pModal = document.getElementById('processingModal');
                if(pModal) pModal.classList.remove('active');
                
                const isPaid = newOrder.payment_method !== 'cod';
                
                Swal.fire({
                    title: isPaid ? 'Payment Verified! ✅' : 'Order Placed! 🎉',
                    text: isPaid ? 'Your transaction was successfully verified.' : 'Your order is being sent to the kitchen.',
                    icon: 'success',
                    confirmButtonText: 'View Legal Bill',
                    confirmButtonColor: isPaid ? '#2ecc71' : '#e67e22',
                    background: '#1a1a1a',
                    color: '#fff',
                    allowOutsideClick: false
                }).then(() => {
                    app.showSuccess({ ...newOrder, itemsJSON: [...cart] });
                    cart = [];
                    app.saveCart();
                    app.updateCartUI();
                    app.updateCartCount();
                    restoreBtn();
                });
            }, 1500);
    },

    showSuccess: (order) => {
        const list = document.getElementById('receiptItems');
        if (!list) return;

        const pStatus = document.getElementById('thermalPaymentStatus');
        if (pStatus) {
            pStatus.innerHTML = `
                <div style="background: rgba(46, 204, 113, 0.15); color: #2ecc71; padding: 8px; border-radius: 4px; font-weight: 800; font-size: 13px; margin-bottom: 15px; border: 1px solid rgba(46, 204, 113, 0.3); text-transform:uppercase;">
                    ✅ Payment Successful
                </div>
            `;
        }
        
        let itemsHtml = `
            <div style="text-align:center; font-size:12px; font-weight:bold; margin-bottom:10px;">Legal Bill No:${order.id || '22'}</div>
            <div style="text-align:left; font-size:11px; margin-bottom:5px;">Pay Mode: <span id="receiptPayMode"></span></div>
            <div style="border-top:1px dashed #444; border-bottom:1px dashed #444; padding:5px 0; margin-bottom:10px; font-size:11px;">
                <div style="display:flex; font-weight:bold;">
                    <div style="flex:4; text-align:left;">Item</div>
                    <div style="flex:1; text-align:center;">Qty</div>
                    <div style="flex:2; text-align:center;">Rate</div>
                    <div style="flex:2; text-align:right;">Total</div>
                </div>
            </div>
        `;

        let totalQty = 0;

        if (order.itemsJSON && Array.isArray(order.itemsJSON)) {
            itemsHtml += order.itemsJSON.map((item, index) => {
                totalQty += item.qty;
                return `
                <div style="display:flex; font-size:11px; margin-bottom:4px;">
                    <div style="flex:4; text-align:left; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${index + 1}.${item.nameEn}</div>
                    <div style="flex:1; text-align:center;">${item.qty}</div>
                    <div style="flex:2; text-align:center;">${item.price}</div>
                    <div style="flex:2; text-align:right;">${item.price * item.qty}</div>
                </div>`;
            }).join('');
            
            if(order.delivery_location && !order.delivery_location.includes("Pickup")) {
                 itemsHtml += `
                 <div style="display:flex; font-size:11px; margin-top:8px;">
                     <div style="flex:4; text-align:left;">- Delivery Fee</div>
                     <div style="flex:1; text-align:center;">1</div>
                     <div style="flex:2; text-align:center;">150</div>
                     <div style="flex:2; text-align:right;">150</div>
                 </div>`;
            }
        }

        itemsHtml += `
            <div style="border-top:1px dashed #444; padding-top:5px; margin-top:10px; font-size:11px; font-weight:bold;">
                <div style="display:flex; justify-content:space-between;">
                    <span>Total Qty : ${totalQty || '-'}</span>
                    <span>Total Amount : ${order.total_price} ETB</span>
                </div>
            </div>
        `;

        list.innerHTML = itemsHtml;
        
        const rd = document.getElementById('receiptDate');
        if(rd) rd.innerText = new Date(order.created_at || Date.now()).toLocaleString();
        
        const rpm = document.getElementById('receiptPayMode');
        if(rpm) rpm.innerText = order.payment_method ? order.payment_method.toUpperCase() : 'UNKNOWN';
        
        const rgt = document.getElementById('receiptGrandTotal');
        if(rgt) rgt.innerText = order.total_price + ' ETB';

        // --- NEW: GENERATE QR CODE ---
        const qrContainer = document.getElementById('receiptQR');
        if (qrContainer) {
            qrContainer.innerHTML = ''; // Clear previous
            new QRCode(qrContainer, {
                text: `ORDER:${order.id}|TOTAL:${order.total_price}ETB|QUEEN-BURGER`,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        document.getElementById('successModal').classList.add('active');
    },

    closeSuccess: () => {
        document.getElementById('successModal').classList.remove('active');
        window.location.href = 'orders.html';
    },

    renderOrderHistory: () => {
        const container = document.getElementById('order-history-list');
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:100px 0; color:var(--text-muted);">
                    <div style="font-size:4rem; margin-bottom:20px;">📦</div>
                    <p style="opacity:0.5;">No orders yet.</p>
                    <button class="btn btn-primary" onclick="window.location.href='menu.html'" style="margin-top:20px;">Order My First Burger</button>
                </div>`;
            return;
        }

        container.innerHTML = orders.map(o => {
            const status = o.status || '';
            let progress = 0;
            let activeSteps = [false, false, false];

            if (status.includes('Preparing')) { progress = 0; activeSteps = [true, false, false]; }
            else if (status.includes('Delivery')) { progress = 50; activeSteps = [true, true, false]; }
            else if (status.includes('Delivered')) { progress = 100; activeSteps = [true, true, true]; }

            const riderBtn = (status.includes('Delivery') && o.rider_phone) ? `
                <a href="https://wa.me/${o.rider_phone.replace(/\D/g,'')}" target="_blank" class="whatsapp-btn" style="margin-top:10px; display:inline-block;">
                    Contact Rider (WA)
                </a>` : '';

            const receivedBtn = (!status.includes('Delivered')) ? `
                <button onclick="app.confirmReceipt('${o.id}')" style="background:#2ecc71; color:white; border:none; padding:8px 15px; border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; margin-top:10px; margin-left:5px; transition:var(--transition);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">I Received It ✅</button>
            ` : '';

            return `
            <div class="order-card" style="padding:25px; border-radius:24px; background:var(--bg-card); margin-bottom:20px; border:1px solid rgba(255,255,255,0.05); transition:var(--transition);">
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; align-items:center;">
                    <div style="font-weight:800; color:var(--primary); font-family:var(--font-display); font-size:1.2rem;">#${o.id}</div>
                    <span style="font-size:11px; padding:6px 14px; background:rgba(255,81,43,0.1); color:var(--primary); border-radius:30px; font-weight:700; text-transform:uppercase;">${o.status}</span>
                </div>
                
                <div class="progress-container">
                    <div class="progress-line"></div>
                    <div class="progress-fill" style="width: ${progress}%"></div>
                    <div class="progress-step ${activeSteps[0] ? 'active' : ''}">
                        <div class="step-icon">👨‍🍳</div>
                        <div class="step-label">Cooking</div>
                    </div>
                    <div class="progress-step ${activeSteps[1] ? 'active' : ''}">
                        <div class="step-icon">🛵</div>
                        <div class="step-label">In Transit</div>
                    </div>
                    <div class="progress-step ${activeSteps[2] ? 'active' : ''}">
                        <div class="step-icon">🍔</div>
                        <div class="step-label">Arrived</div>
                    </div>
                </div>

                <div style="font-size:14px; color:var(--text-muted); margin-bottom:20px; line-height:1.6;">${o.address}</div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.03); padding-top:15px; flex-wrap:wrap;">
                    <div>
                        <div style="font-weight:900; font-size:1.1rem; color:white;">${o.total_price} ETB</div>
                        ${riderBtn}
                        ${receivedBtn}
                    </div>
                    <span style="font-size:11px; color:var(--text-muted); margin-top:10px;">${new Date(o.created_at).toLocaleString()}</span>
                </div>
            </div>`;
        }).join('');
    },

    confirmReceipt: async (id) => {
        const result = await Swal.fire({
            title: 'Confirm Receipt',
            text: 'Have you received your order?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '✅ Yes, I Got It!',
            cancelButtonText: 'Not Yet',
            confirmButtonColor: '#2ecc71',
            cancelButtonColor: 'rgba(255,255,255,0.08)',
            background: '#1a1a2e',
            color: '#fff',
            backdrop: 'rgba(0,0,0,0.65)',
            customClass: {
                popup: 'swal-modern-popup',
                cancelButton: 'swal-cancel-btn'
            }
        });

        if (!result.isConfirmed) return;

        const updateLocal = () => {
            const idx = orders.findIndex(o => o.id == id);
            if(idx > -1) {
                orders[idx].status = 'Delivered ✅';
                localStorage.setItem('queenBurgerOrders', JSON.stringify(orders));
                app.renderOrderHistory();
            }
            let globalOrders = JSON.parse(localStorage.getItem('queenBurgerGlobalOrders')) || [];
            const gIdx = globalOrders.findIndex(o => o.id == id);
            if (gIdx > -1) {
                globalOrders[gIdx].status = 'Delivered ✅';
                localStorage.setItem('queenBurgerGlobalOrders', JSON.stringify(globalOrders));
            }
        };

        updateLocal();
        app.showReceiptSuccess();
    },

    showReceiptSuccess: () => {
        Swal.fire({
            title: '🎉 Enjoy Your Meal!',
            html: `
                <div style="font-size:3rem; margin: 10px 0; animation: bounceIn 0.6s;">🍔</div>
                <p style="color:rgba(255,255,255,0.7); font-size:0.95rem; line-height:1.6;">
                    Your order has been marked as <strong style="color:#2ecc71;">Delivered</strong>.<br>
                    Thank you for choosing <strong style="color:#ff512f;">QUEEN BURGER</strong>!
                </p>
            `,
            showConfirmButton: true,
            confirmButtonText: '❤️ Order Again',
            confirmButtonColor: '#ff512f',
            background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
            color: '#fff',
            backdrop: 'rgba(0,0,0,0.7)',
            timer: 6000,
            timerProgressBar: true
        }).then((res) => {
            if (res.isConfirmed) window.location.href = 'menu.html';
        });
    },

    subscribeRealtime: () => {
        window.addEventListener('storage', (e) => {
            if (e.key === 'queenBurgerGlobalOrders') {
                const globalOrders = JSON.parse(e.newValue || '[]');
                let changed = false;
                orders.forEach(o => {
                    const gOrder = globalOrders.find(go => go.id == o.id);
                    if(gOrder && gOrder.status !== o.status) {
                        o.status = gOrder.status;
                        changed = true;
                    }
                });
                if(changed) {
                    localStorage.setItem('queenBurgerOrders', JSON.stringify(orders));
                    app.renderOrderHistory();
                }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', app.init);