

let menuData = [];
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
    updateCartUI();
    updateAuthUI();


    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('tombolCheckout')?.addEventListener('click', showCheckoutSummary);
    document.getElementById('confirmOrderBtn')?.addEventListener('click', processCheckout);
});

async function fetchMenu() {
    const container = document.getElementById('wadahMenu');
    try {
        const response = await fetch('menu/meta_data/menu_data.json');
        if (!response.ok) throw new Error('Gagal memuat data menu');

        menuData = await response.json();
        renderCategories();
        renderMenuItems('Artisan Tea');
    } catch (error) {
        console.error('Error fetching menu:', error);
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-danger">⚠️ Gagal memuat data menu.</p>
                    <small class="text-muted">Pastikan Anda menjalankan aplikasi menggunakan server lokal (seperti Live Server) karena kebijakan keamanan browser.</small>
                </div>
            `;
        }
    }
}

function renderCategories() {
    const nav = document.getElementById('listKategori');
    if (!nav) return;

    nav.innerHTML = menuData.map((cat, index) => `
        <li class="nav-item">
            <a class="nav-link d-flex align-items-center ${index === 0 ? 'active' : ''}" 
               href="#" 
               onclick="selectCategory(event, '${cat.category.replace(/'/g, "\\'")}')">
               <img src="${cat.image}" alt="" class="ikon-kategori me-2 rounded-circle">
               ${cat.category}
            </a>
        </li>
    `).join('');
}

function selectCategory(event, category) {
    event.preventDefault();
    document.querySelectorAll('#listKategori .nav-link').forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');

    renderMenuItems(category);
}

function renderMenuItems(categoryName) {
    const container = document.getElementById('wadahMenu');
    const featuredImg = document.getElementById('gambarBesarKategori');
    const featuredTitle = document.getElementById('judulKategoriSekarang');
    const category = menuData.find(c => c.category === categoryName);

    if (!container || !category) return;

    if (featuredImg) featuredImg.src = category.image;
    if (featuredTitle) featuredTitle.innerText = category.category;

    container.innerHTML = category.items.map(item => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="kartu-menu card">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text text-muted small">${categoryName}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="harga-item">Rp ${item.price.toLocaleString('id-ID')}</span>
                        <button class="btn tombol-tambah" onclick="addToCart('${item.name}', ${item.price})">
                            <i class="bi bi-plus-lg"></i> Tambah
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}


function addToCart(name, price) {
    const existingItem = cart.find(i => i.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    showNotification(name);
}

function showNotification(menuName) {
    const container = document.getElementById('wadahNotifikasi');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'notif-pop-up';
    toast.innerHTML = `
        <i class="bi bi-check-circle-fill"></i>
        <div>
            <div class="judul-notif">Berhasil!</div>
            <div class="isi-notif">Order <strong>${menuName}</strong> ditambahkan ke keranjang.</div>
        </div>
    `;

    container.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.4s forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    saveCart();
    updateCartUI();
}

function updateQuantity(name, delta) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartList = document.getElementById('listBarang');
    const cartCount = document.getElementById('jumlahKeranjang');
    const cartTotal = document.getElementById('totalHarga');
    const floatingCount = document.getElementById('jumlahKeranjangFloating');

    if (!cartList) return;

    let total = 0;
    let count = 0;

    cartList.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        count += item.quantity;
        return `
            <div class="isi-keranjang">
                <div>
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center">
                    <div class="btn-group btn-group-sm me-3">
                        <button class="btn btn-outline-secondary" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span class="btn btn-outline-secondary disabled text-dark">${item.quantity}</span>
                        <button class="btn btn-outline-secondary" onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="btn btn-sm btn-link text-danger" onclick="removeFromCart('${item.name}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="text-center text-muted my-5">Keranjang masih kosong</p>';
    }

    cartCount.innerText = count;
    if (floatingCount) floatingCount.innerText = count;
    cartTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}


function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) {
        alert('Email sudah terdaftar!');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registrasi berhasil! Silakan login.');
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        updateAuthUI();
    } else {
        alert('Email atau password salah!');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
}

function updateAuthUI() {
    const authSection = document.getElementById('areaUser');
    if (!authSection) return;

    if (currentUser) {
        authSection.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle"></i> ${currentUser.name}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#" id="logoutBtn" onclick="handleLogout()">Keluar</a></li>
                </ul>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <button class="btn btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#registerModal">Daftar</button>
        `;
    }
}


function showCheckoutSummary() {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu untuk melakukan pemesanan.');
        new bootstrap.Modal(document.getElementById('loginModal')).show();
        return;
    }

    if (cart.length === 0) {
        alert('Keranjang kamu masih kosong!');
        return;
    }

    const summaryList = document.getElementById('listRingkasan');
    const summaryTotal = document.getElementById('totalAkhir');

    let total = 0;
    summaryList.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${item.name} (${item.quantity}x)
            <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>
        </li>`;
    }).join('');

    summaryTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;

    bootstrap.Offcanvas.getInstance(document.getElementById('keranjangBelanja')).hide();
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
}

function processCheckout() {
    alert('Terima kasih! Pesanan kamu telah diterima dan sedang diproses.');
    cart = [];
    saveCart();
    updateCartUI();
    bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
}
