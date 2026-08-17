// delivery_panel.js — Real-time assigned orders for delivery guys

const panel = {
    user: null,
    orders: [],
    currentGps: null,

    init: async () => {
        panel.user = auth.getUser();
        if (!panel.user) {
            location.href = 'delivery_login.html';
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                panel.currentGps = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                panel.renderOrders(); // Re-render to show exact distance
            }, () => {}, { enableHighAccuracy: true });
        }

        console.log('[Panel] Initializing for:', panel.user.name);
        await panel.loadOrders();
        await panel.loadStats();
        panel.subscribeRealtime();
    },

    loadStats: async () => {
        let globalOrders = JSON.parse(localStorage.getItem('queenBurgerGlobalOrders')) || [];
        const delivered = globalOrders.filter(o => o.rider_phone === panel.user.phone && o.status.includes('Delivered'));
        const count = delivered.length;
        const earnings = count * 150;
        const rE = document.getElementById('riderEarnings');
        const rC = document.getElementById('riderDeliveryCount');
        if(rE) rE.innerText = earnings + ' ETB';
        if(rC) rC.innerText = count;
    },

    calculateDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return (R * c).toFixed(1);
    },

    loadOrders: async () => {
        console.log('[Panel] Fetching assigned orders...');
        
        let globalOrders = JSON.parse(localStorage.getItem('queenBurgerGlobalOrders')) || [];
        const pending = globalOrders.filter(o => o.status.includes('Out for Delivery') || o.status.includes('Preparing'));
        const newData = pending.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        // Detect if an order just disappeared (meaning the customer successfully received it!)
        if (panel.orders.length > 0 && newData) {
            const newIds = newData.map(o => o.id);
            panel.orders.forEach(oldOrder => {
                if (!newIds.includes(oldOrder.id) && oldOrder.status.includes('Delivery')) {
                    if (oldOrder.rider_phone === panel.user.phone) {
                        alert(`🎉 AWESOME JOB, ${panel.user.name.toUpperCase()}!\n\nThe customer just confirmed they received Order #${oldOrder.id}. \n\n💵 You earned 150 ETB for this delivery!`);
                        panel.loadStats(); // Re-fetch stats instantly
                    }
                }
            });
        }

        panel.orders = newData;
        panel.renderOrders();
    },

    subscribeRealtime: () => {
        setInterval(() => panel.loadOrders(), 3000);
    },

    renderOrders: () => {
        const container = document.getElementById('delivery-orders');
        if (panel.orders.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:100px 20px; color:var(--text-muted);">
                    <div style="font-size:3rem; margin-bottom:20px;">🚲</div>
                    <h3>No Active Deliveries</h3>
                    <p style="font-size:14px; margin-top:10px;">New orders will appear here instantly.</p>
                </div>`;
            return;
        }

        container.innerHTML = panel.orders.map(order => {
            const statusClass = panel.getStatusClass(order.status);
            const items = order.address || 'Items list unavailable'; // In previous version 'address' was used for items summary
            
            return `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <div class="order-id">#${order.id}</div>
                            <div style="font-size:13px; color:var(--text-muted); margin-top:4px;">${new Date(order.created_at).toLocaleTimeString()}</div>
                        </div>
                        <div class="order-status ${statusClass}">${order.status}</div>
                    </div>

                    <div style="font-size:14px; color:white; line-height:1.6; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom:15px; margin-bottom:15px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <span style="display:block; font-size:11px; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Items</span>
                            ${items}
                        </div>
                        <div style="background: rgba(46, 204, 113, 0.1); border: 1px solid rgba(46, 204, 113, 0.2); padding: 10px 15px; border-radius: 12px; text-align: right; margin-left: 15px; min-width: 100px;">
                            <span style="display:block; font-size:10px; text-transform:uppercase; color: #2ecc71; font-weight:800;">Fee Earned</span>
                            <span style="font-weight:900; font-size: 1.2rem; color: white;">150 ETB</span>
                        </div>
                    </div>

                    <div class="customer-info">
                        <div>
                            <span class="info-label">Customer</span>
                            <div style="font-weight:700;">${order.customer_name}</div>
                        </div>
                        <div>
                            <span class="info-label">Phone</span>
                            <div style="font-weight:700; color:var(--primary); cursor:pointer;" onclick="window.open('tel:${order.phone_number}')">${order.phone_number} 📞</div>
                        </div>
                    </div>

                    ${(() => {
                        let locText = order.delivery_location || 'Not Specified';
                        let hasGps  = locText.includes('| GPS:');
                        let gpsCoords = null;
                        let displayLoc = locText;

                        if (hasGps) {
                            const parts = locText.split('| GPS:');
                            displayLoc  = parts[0].trim();
                            gpsCoords   = parts[1].trim(); // "lat,lng"
                        }

                        // Build navigate URL
                        let navUrl, mapEmbedUrl, distanceHtml;

                        if (gpsCoords) {
                            const [destLat, destLng] = gpsCoords.split(',');
                            if (panel.currentGps) {
                                const dist = panel.calculateDistance(
                                    panel.currentGps.lat, panel.currentGps.lng,
                                    parseFloat(destLat), parseFloat(destLng)
                                );
                                distanceHtml = `<div style="font-size:13px; font-weight:800; color:#f1c40f; margin-top:6px;">📍 ${dist} km from you</div>`;
                                navUrl = `https://www.google.com/maps/dir/?api=1&origin=${panel.currentGps.lat},${panel.currentGps.lng}&destination=${destLat},${destLng}&travelmode=driving`;
                            } else {
                                distanceHtml = `<div style="font-size:12px; color:var(--text-muted); margin-top:5px;">Enable location for distance</div>`;
                                navUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
                            }
                            mapEmbedUrl = `https://maps.google.com/maps?q=${destLat},${destLng}&z=16&output=embed`;
                        } else {
                            const q = encodeURIComponent('Addis Ababa, ' + displayLoc);
                            navUrl  = `https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`;
                            mapEmbedUrl = null;
                            distanceHtml = `<div style="font-size:12px; color:var(--text-muted); margin-top:5px;">No GPS — approximate area</div>`;
                        }

                        return `
                        <div style="margin-top:18px; background:rgba(0,0,0,0.15); border-radius:18px; border:1px solid rgba(46,204,113,0.2); overflow:hidden;">
                            <!-- Location header -->
                            <div style="padding:16px 18px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
                                <div style="flex:1;">
                                    <span style="font-size:10px; text-transform:uppercase; color:var(--text-muted); font-weight:700; letter-spacing:1px;">📦 Delivery Address</span>
                                    <div style="font-weight:900; color:#2ecc71; font-size:16px; margin-top:5px;">${displayLoc}</div>
                                    ${gpsCoords ? `<div style="font-size:11px; color:rgba(255,255,255,0.3); margin-top:4px; font-family:monospace;">GPS: ${gpsCoords}</div>` : ''}
                                    ${distanceHtml}
                                </div>
                            </div>

                            ${mapEmbedUrl ? `
                            <!-- Embedded map preview -->
                            <div style="width:100%; height:200px; position:relative; border-top:1px solid rgba(255,255,255,0.05);">
                                <iframe
                                    src="${mapEmbedUrl}"
                                    style="width:100%; height:100%; border:none; display:block;"
                                    loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade"
                                    allowfullscreen>
                                </iframe>
                                <div style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.6); border-radius:6px; padding:3px 8px; font-size:10px; color:rgba(255,255,255,0.7); font-weight:700;">📍 EXACT PIN</div>
                            </div>` : ''}

                            <!-- Navigate button -->
                            <div style="padding:14px 18px; border-top:1px solid rgba(255,255,255,0.05);">
                                <button onclick="window.open('${navUrl}', '_blank')"
                                    style="width:100%; background:linear-gradient(135deg,#2ecc71,#27ae60); color:white; border:none; padding:14px; border-radius:12px; font-weight:900; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:var(--transition); box-shadow:0 6px 20px rgba(46,204,113,0.35);"
                                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 28px rgba(46,204,113,0.5)'"
                                    onmouseout="this.style.transform=''; this.style.boxShadow='0 6px 20px rgba(46,204,113,0.35)'">
                                    🗺️ NAVIGATE TO CUSTOMER
                                </button>
                            </div>
                        </div>`;
                    })()}

                    <div class="action-row">
                        ${order.status.includes('Preparing') ? `
                            <button class="action-btn btn-update" onclick="panel.updateStatus('${order.id}', 'Out for Delivery 🚚')">PICK UP ORDER 🛵</button>
                        ` : ''}
                        
                        ${order.status.includes('Delivery') ? `
                            <button class="action-btn" style="background:#2ecc71; color:white;" onclick="panel.updateStatus('${order.id}', 'Delivered ✅')">MARK AS DELIVERED ✅</button>
                        ` : ''}
                    </div>
                </div>`;
        }).join('');
    },

    getStatusClass: (status) => {
        if (status.includes('Preparing')) return 'status-preparing';
        if (status.includes('Delivery')) return 'status-delivery';
        if (status.includes('Delivered')) return 'status-delivered';
        return '';
    },

    updateStatus: async (id, newStatus) => {
        console.log('[Panel] Updating status:', id, '->', newStatus);
        
        let globalOrders = JSON.parse(localStorage.getItem('queenBurgerGlobalOrders')) || [];
        let idx = globalOrders.findIndex(o => o.id == id);
        
        if (idx > -1) {
            globalOrders[idx].status = newStatus;
            if (newStatus.includes('Delivery')) {
                globalOrders[idx].rider_phone = panel.user.phone;
            }
            localStorage.setItem('queenBurgerGlobalOrders', JSON.stringify(globalOrders));
            console.log('[Panel] Status updated successfully!');
            panel.loadOrders();
        } else {
            alert("Failed to update status: Order not found");
        }
    }
};

document.addEventListener('DOMContentLoaded', panel.init);
