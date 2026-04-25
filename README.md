# ATAP COFFEE - Menu Ordering System
ATAP COFFEE merupakan sebuah cafe yang terletak di daerah Cepu, Jawa Tengah. 

Saya membuat sebuah sistem menu online interaktif untuk ATAP COFFEE yang memungkinkan pengguna untuk melihat menu, menyaring kategori, dan mengelola keranjang belanja secara real-time.

## Dokumentasi Teknis

### 1. Struktur HTML (`index.html`)
`index.html` berfungsi sebagai kerangka utama aplikasi. Menggunakan elemen semantik HTML5 untuk SEO dan aksesibilitas:
- **Navbar**: Menggunakan komponen Navbar Bootstrap yang *sticky* untuk navigasi yang konsisten.
- **Hero Section**: Memberikan kesan visual pertama yang kuat dengan pesan selamat datang dan jam operasional.
- **Menu Grid**: Area dinamis (`#menuGrid`) tempat item menu dirender menggunakan JavaScript.
- **Offcanvas Cart**: Menggunakan komponen Offcanvas Bootstrap untuk menampilkan isi keranjang tanpa berpindah halaman.
- **Modals**: Digunakan untuk alur autentikasi (Login/Register) dan ringkasan checkout.

### 2. Desain & Styling (`css/style.css`)
CSS kustom digunakan untuk memberikan identitas visual yang unik (Branding ATAP COFFEE):
- **CSS Variables**: Mendefinisikan palet warna (hijau keabu-abuan dan beige) untuk konsistensi di seluruh aplikasi.
- **Hero Background**: Menggunakan gradien overlay pada gambar latar belakang untuk memastikan teks tetap terbaca.
- **Interactive Cards**: Efek hover pada kartu menu untuk meningkatkan pengalaman pengguna (UX).
- **Custom Toasts**: Sistem notifikasi kustom dengan animasi `@keyframes` untuk memberikan umpan balik visual saat item ditambahkan ke keranjang.

### 3. Framework Bootstrap 5
Proyek ini memanfaatkan Bootstrap 5.3.0 untuk mempercepat pengembangan responsif:
- **Grid System**: Menggunakan baris (`row`) dan kolom (`col`) untuk tata letak yang adaptif di berbagai ukuran layar.
- **Utilities**: Memanfaatkan *spacing*, *text*, dan *flexbox utilities* untuk penyesuaian layout cepat.
- **Components**: Menggunakan Modal, Offcanvas, Dropdowns, dan Badge Bootstrap.

### 4. Logika JavaScript (`js/script.js`)
JavaScript menangani aspek interaktif dan state management aplikasi.

#### Fitur Utama:
- **Fetch API**: Mengambil data menu secara asinkron dari file JSON lokal.
- **State Management**: Mengelola data keranjang belanja dan status login pengguna.
- **Persistence**: Menggunakan `localStorage` untuk menyimpan data pengguna dan `sessionStorage` untuk data keranjang agar tetap ada saat halaman di-refresh.

#### Referensi & Inspirasi:
Pengembangan logika JavaScript dalam proyek ini merujuk pada pola-pola umum dari platform berikut:
- **Fetch API & Async/Await**: Referensi dari [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) dan tutorial [GeeksforGeeks](https://www.geeksforgeeks.org/javascript-fetch-method/) tentang pengambilan data JSON.
- **Local/Session Storage**: Pola implementasi penyimpanan data merujuk pada diskusi di [Stack Overflow](https://stackoverflow.com/questions/16010827/how-to-use-localstorage-in-javascript) mengenai persistensi state sederhana.
- **DOM Manipulation**: Teknik rendering dinamis menggunakan `.map()` dan `.innerHTML` terinspirasi dari pola pengembangan aplikasi web modern yang sering dibahas di [W3Schools](https://www.w3schools.com/js/js_htmldom.asp).
- **Bootstrap JS API**: Penggunaan `bootstrap.Modal.getInstance()` dan `bootstrap.Offcanvas.show()` mengikuti dokumentasi resmi [getbootstrap.com](https://getbootstrap.com/docs/5.3/components/modal/#via-javascript).

