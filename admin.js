// admin.js — Queen Burger Manager Dashboard


/**
 * Modern promise-based confirm dialog.
 * @param {Object} opts - { icon, title, message, okLabel }
 * @returns {Promise<boolean>}
 */
function showConfirm({ icon = '⚠️', title = 'Are you sure?', message = 'This action cannot be undone.', okLabel = 'Confirm' } = {}) {
    return new Promise(resolve => {
        const overlay = document.getElementById('adminConfirmOverlay');
        document.getElementById('adminConfirmIcon').textContent  = icon;
        document.getElementById('adminConfirmTitle').textContent = title;
        document.getElementById('adminConfirmMsg').textContent   = message;
        document.getElementById('adminConfirmOk').textContent    = okLabel;

        overlay.classList.add('active');

        const close = (result) => {
            overlay.classList.remove('active');
            okBtn.removeEventListener('click', onOk);
            cancelBtn.removeEventListener('click', onCancel);
            resolve(result);
        };

        const okBtn     = document.getElementById('adminConfirmOk');
        const cancelBtn = document.getElementById('adminConfirmCancel');
        const onOk      = () => close(true);
        const onCancel  = () => close(false);

        okBtn.addEventListener('click', onOk);
        cancelBtn.addEventListener('click', onCancel);
    });
}

const admin = {
    orders: [],
    deliveryGuys: [],

    init: async () => {
        console.log('[Admin] Initializing Manager Dashboard...');
        await admin.loadData();
        admin.subscribeRealtime();
    },

    loadData: async () => {
        const globalOrders = JSON.parse(localStorage.getItem('queenBurgerGlobalOrders')) || [];
        const deliveryGuys = JSON.parse(localStorage.getItem('queenBurgerDeliveryUsers')) || [];

        // Sort descending by created_at (newest first)
        admin.orders = globalOrders.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        admin.deliveryGuys = deliveryGuys;

        admin.renderDashboard();
    },

    subscribeRealtime: () => {
        setInterval(() => admin.loadData(), 3000);
    },

    renderDashboard: () => {
        admin.renderStats();
        admin.renderTable();
        admin.renderDeliveryStaff();
    },

    renderStats: () => {
        const totalRev = admin.orders.reduce((s, o) => s + (o.total_price || 0), 0);
        const pending = admin.orders.filter(o => o.status.includes('Pending')).length;

        document.getElementById('statOrders').innerText = admin.orders.length;
        document.getElementById('statRevenue').innerText = totalRev + ' ETB';
        document.getElementById('statPending').innerText = pending;
    },

    renderTable: () => {
        const tbody = document.getElementById('adminOrderTable');
        if (!tbody) return;

        if (admin.orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:50px;">No orders found.</td></tr>`;
            return;
        }

        tbody.innerHTML = admin.orders.map(order => {
            const date = new Date(order.created_at).toLocaleString();
            const statusClass = admin.getStatusClass(order.status);
            
            return `
                <tr>
                    <td><strong style="color:var(--primary); font-family:var(--font-display);">#${order.id}</strong></td>
                    <td>
                        <div style="font-weight:700;">${order.customer_name}</div>
                        <div style="font-size:11px; color:var(--text-muted);">${order.phone_number}</div>
                    </td>
                    <td style="max-width:200px; font-size:12px; color:#aaa;">${order.address}</td>
                    <td>
                        <div style="font-size:13px; font-weight:700;">${order.total_price} ETB</div>
                        <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">${order.payment_method}</div>
                    </td>
                    <td>
                        <div style="font-size:12px; font-weight:600; color:#2ecc71;">${order.delivery_location || 'Pickup'}</div>
                    </td>
                    <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                    <td>
                        <select onchange="admin.updateStatus('${order.id}', this.value)"
                            style="background:#1a1a1a; color:white; border:1px solid rgba(255,255,255,0.1); padding:8px; border-radius:8px; font-size:12px; outline:none;">
                            <option value="Pending ⏳" ${order.status.includes('Pending') ? 'selected' : ''}>Pending ⏳</option>
                            <option value="Preparing 👨‍🍳" ${order.status.includes('Preparing') ? 'selected' : ''}>Preparing 👨‍🍳</option>
                            <option value="Out for Delivery 🚚" ${order.status.includes('Delivery') ? 'selected' : ''}>Out for Delivery 🚚</option>
                            <option value="Delivered ✅" ${order.status.includes('Delivered') ? 'selected' : ''}>Delivered ✅</option>
                        </select>
                        <button onclick="admin.deleteOrder('${order.id}')"
                            style="background:transparent; border:none; color:#555; cursor:pointer; margin-left:10px; font-size:1.2rem;">&times;</button>
                    </td>
                </tr>`;
        }).join('');
    },

    getStatusClass: (status) => {
        if (status.includes('Pending')) return 'status-pending';
        if (status.includes('Preparing')) return 'status-preparing';
        if (status.includes('Delivery')) return 'status-ready';
        if (status.includes('Delivered')) return 'status-delivered';
        return 'status-pending';
    },

    updateStatus: async (id, newStatus) => {
        let globalOrders = JSON.parse(localStorage.getItem('queenBurgerGlobalOrders')) || [];
        let idx = globalOrders.findIndex(o => o.id == id);
        if (idx > -1) {
            globalOrders[idx].status = newStatus;
            localStorage.setItem('queenBurgerGlobalOrders', JSON.stringify(globalOrders));
        }
        admin.loadData();
    },

    deleteOrder: async (id) => {
        const ok = await showConfirm({
            icon: '🗑️',
            title: 'Delete Order?',
            message: `Order #${id} will be permanently removed from the system.`,
            okLabel: 'Yes, Delete'
        });
        if (!ok) return;
        let globalOrders = JSON.parse(localStorage.getItem('queenBurgerGlobalOrders')) || [];
        globalOrders = globalOrders.filter(o => o.id != id);
        localStorage.setItem('queenBurgerGlobalOrders', JSON.stringify(globalOrders));
        admin.loadData();
    },

    clearOrders: async () => {
        const ok = await showConfirm({
            icon: '🔥',
            title: 'Purge All History?',
            message: 'This will permanently erase every order record. This cannot be undone.',
            okLabel: 'Purge Everything'
        });
        if (!ok) return;
        localStorage.setItem('queenBurgerGlobalOrders', JSON.stringify([]));
        admin.loadData();
    },

    // ── Delivery Staff & Per-Person Invite Codes ──

    /** Generate a random alphanumeric code tied to a person's name */
    generateInviteCode: () => {
        const nameInput = document.getElementById('inviteNameInput');
        const name = nameInput ? nameInput.value.trim() : '';

        if (!name || name.length < 2) {
            Swal.fire({
                title: '⚠️ Name Required',
                text: 'Please enter the staff member\'s full name before generating a code.',
                icon: 'warning',
                confirmButtonColor: '#f1c40f',
                background: '#1a1a2e',
                color: '#fff'
            });
            return;
        }

        // Generate unique code: QBR + 6 random uppercase chars
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'QBR-';
        for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];

        // Save to pending invites
        let pending = JSON.parse(localStorage.getItem('queenBurgerPendingInvites')) || [];

        // Check if name already has a pending invite
        const existing = pending.find(p => p.name.toLowerCase() === name.toLowerCase() && p.status === 'Pending');
        if (existing) {
            Swal.fire({
                title: '📋 Code Already Exists',
                html: `<b>${name}</b> already has a pending invite code:<br><br>
                    <div style="font-family:monospace; font-size:1.4rem; color:#f1c40f; background:rgba(241,196,15,0.1); border:1px solid rgba(241,196,15,0.3); padding:10px 20px; border-radius:10px; letter-spacing:3px;">${existing.code}</div>`,
                icon: 'info',
                confirmButtonColor: '#f1c40f',
                background: '#1a1a2e',
                color: '#fff'
            });
            return;
        }

        pending.push({ name, code, status: 'Pending', createdAt: new Date().toISOString() });
        localStorage.setItem('queenBurgerPendingInvites', JSON.stringify(pending));

        if (nameInput) nameInput.value = '';

        // Show the generated code
        Swal.fire({
            title: '✅ Code Generated!',
            html: `Invite code for <b>${name}</b>:<br><br>
                <div style="font-family:monospace; font-size:1.6rem; color:#f1c40f; background:rgba(241,196,15,0.1); border:1px solid rgba(241,196,15,0.3); padding:14px 24px; border-radius:12px; letter-spacing:4px; cursor:pointer;" onclick="navigator.clipboard.writeText('${code}')">${code}</div>
                <div style="font-size:0.75rem; color:rgba(255,255,255,0.4); margin-top:10px;">Tap the code to copy</div>`,
            icon: 'success',
            confirmButtonText: '📋 Copy & Close',
            confirmButtonColor: '#f1c40f',
            background: '#1a1a2e',
            color: '#fff'
        }).then(() => {
            navigator.clipboard.writeText(code).catch(() => {});
        });

        admin.renderDeliveryStaff();
    },

    renderDeliveryStaff: () => {
        // ── Pending Invites ──
        const pendingTbody = document.getElementById('pendingInvitesTable');
        if (pendingTbody) {
            const pending = JSON.parse(localStorage.getItem('queenBurgerPendingInvites')) || [];
            if (pending.length === 0) {
                pendingTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--text-muted);">No invite codes generated yet. Enter a name above to create one.</td></tr>`;
            } else {
                pendingTbody.innerHTML = pending.map((inv, i) => {
                    const isPending = inv.status === 'Pending';
                    return `
                    <tr>
                        <td><strong style="color:var(--primary); font-family:var(--font-display);">${i + 1}</strong></td>
                        <td><div style="font-weight:700;">${inv.name}</div></td>
                        <td>
                            <div style="display:flex; align-items:center; gap:10px;">
                                <span style="font-family:monospace; font-size:13px; color:#f1c40f; background:rgba(241,196,15,0.08); border:1px solid rgba(241,196,15,0.2); padding:5px 12px; border-radius:8px; letter-spacing:2px;">${inv.code}</span>
                                ${isPending ? `<button onclick="admin.copyCode('${inv.code}', this)" style="background:transparent; border:1px solid rgba(241,196,15,0.3); color:#f1c40f; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">📋</button>` : ''}
                            </div>
                        </td>
                        <td>
                            <span class="status-badge ${isPending ? 'status-pending' : 'status-ready'}">${inv.status}</span>
                        </td>
                        <td>
                            <button onclick="admin.revokeInvite('${inv.code}')" style="background:transparent; border:1px solid rgba(255,81,43,0.3); color:#ff512f; padding:6px 14px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; transition:var(--transition);" onmouseover="this.style.background='rgba(255,81,43,0.1)'" onmouseout="this.style.background='transparent'">🗑️ Revoke</button>
                        </td>
                    </tr>`;
                }).join('');
            }
        }

        // ── Registered Staff ──
        const staffTbody = document.getElementById('deliveryStaffTable');
        if (!staffTbody) return;

        const staff = JSON.parse(localStorage.getItem('queenBurgerDeliveryUsers')) || [];
        if (staff.length === 0) {
            staffTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--text-muted);">No delivery staff registered yet.</td></tr>`;
            return;
        }

        staffTbody.innerHTML = staff.map((u, i) => `
            <tr>
                <td><strong style="color:var(--primary); font-family:var(--font-display);">${i + 1}</strong></td>
                <td><div style="font-weight:700;">${u.name}</div></td>
                <td><div style="font-size:13px; color:#aaa;">${u.phone}</div></td>
                <td>
                    <span class="status-badge ${u.status === 'Available' ? 'status-ready' : 'status-pending'}">${u.status || 'Available'}</span>
                </td>
                <td>
                    <button onclick="admin.removeStaff('${u.phone}')" style="background:transparent; border:1px solid rgba(255,81,43,0.3); color:#ff512f; padding:6px 14px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; transition:var(--transition);" onmouseover="this.style.background='rgba(255,81,43,0.1)'" onmouseout="this.style.background='transparent'">🗑️ Remove</button>
                </td>
            </tr>`).join('');
    },

    copyCode: (code, btn) => {
        navigator.clipboard.writeText(code).then(() => {
            const orig = btn.textContent;
            btn.textContent = '✅';
            setTimeout(() => { btn.textContent = orig; }, 1800);
        }).catch(() => { prompt('Copy this invite code:', code); });
    },

    revokeInvite: async (code) => {
        const ok = await showConfirm({
            icon: '🗑️',
            title: 'Revoke Invite Code?',
            message: `Code ${code} will be permanently revoked. The person will no longer be able to register with it.`,
            okLabel: 'Yes, Revoke'
        });
        if (!ok) return;
        let pending = JSON.parse(localStorage.getItem('queenBurgerPendingInvites')) || [];
        pending = pending.filter(p => p.code !== code);
        localStorage.setItem('queenBurgerPendingInvites', JSON.stringify(pending));
        admin.renderDeliveryStaff();
    },

    removeStaff: async (phone) => {
        const ok = await showConfirm({
            icon: '🛵',
            title: 'Remove Staff Member?',
            message: `This will permanently remove the delivery staff member with phone ${phone}.`,
            okLabel: 'Yes, Remove'
        });
        if (!ok) return;
        let staff = JSON.parse(localStorage.getItem('queenBurgerDeliveryUsers')) || [];
        staff = staff.filter(u => u.phone !== phone);
        localStorage.setItem('queenBurgerDeliveryUsers', JSON.stringify(staff));
        admin.renderDeliveryStaff();
    }
};

document.addEventListener('DOMContentLoaded', admin.init);
