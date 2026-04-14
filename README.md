# P2P Bridge - Koneksi Aman Tanpa Internet

P2P Bridge adalah aplikasi web sederhana namun kuat yang memungkinkan koneksi langsung antar browser (Peer-to-Peer) menggunakan teknologi WebRTC. Proyek ini dirancang khusus untuk bekerja tanpa memerlukan signaling server pusat, sehingga ideal untuk lingkungan offline atau privasi tingkat tinggi.

## Fitur Utama

*   **Koneksi Langsung (Direct P2P):** Komunikasi data langsung antar browser tanpa melalui server perantara.
*   **Signaling Manual:** Pertukaran kunci koneksi secara manual (copy-paste) untuk keamanan maksimal.
*   **Desain Premium:** Menggunakan estetika modern dengan *glassmorphism*, mode gelap, dan animasi yang halus.
*   **Responsif & Ringan:** Dibuat dengan HTML, CSS, dan JavaScript/TypeScript murni tanpa dependensi berat.
*   **Keamanan:** Data dikirimkan secara terenkripsi melalui WebRTC Data Channel.

## Cara Penggunaan

Proses koneksi melibatkan dua pihak: **Host** dan **Joiner**.

### 1. Host (Pihak Pertama)
1.  Buka aplikasi dan klik tombol **"Host a Connection"**.
2.  Kunci Host akan dihasilkan secara otomatis (tunggu hingga status berubah).
3.  Salin (Copy) kunci tersebut dan kirimkan ke rekan Anda melalui media apa pun (chat, email, dll).
4.  Tunggu rekan Anda memberikan **Answer Key**.

### 2. Joiner (Pihak Kedua)
1.  Buka aplikasi dan klik tombol **"Join a Connection"**.
2.  Tempelkan (Paste) kunci yang diterima dari Host ke kolom yang tersedia.
3.  Klik **"Accept & Generate Answer"**. Sebuah dialog modal akan muncul menampilkan **Answer Key**.
4.  Salin kuncinya dan berikan kembali ke pihak Host.

### 3. Finalisasi
1.  **Host** menempelkan Answer Key dari rekannya ke kolom kedua dan klik **"Finalize Connection"**.
2.  Setelah status berubah menjadi **"Connected"**, layar chat akan terbuka secara otomatis.

## Teknologi yang Digunakan

*   **WebRTC:** Protokol utama untuk komunikasi peer-to-peer.
*   **HTML5 & CSS3:** Untuk struktur dan styling (termasuk CSS Variables dan Animations).
*   **TypeScript/JavaScript:** Logika aplikasi dan manajemen state koneksi.
*   **Manual Signaling:** Metode pertukaran SDP (Session Description Protocol) secara manual melalui Base64.

## Pengembangan

Jika Anda ingin memodifikasi proyek ini:

*   `index.html`: Struktur antarmuka pengguna.
*   `style.css`: Semua styling dan desain visual.
*   `main.ts`: Logika inti menggunakan TypeScript.
*   `main.js`: Versi JavaScript yang dikompilasi untuk runtime browser.

---
Dibuat dengan ❤️ untuk koneksi yang aman dan bebas hambatan.
