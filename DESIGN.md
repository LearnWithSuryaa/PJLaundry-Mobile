# Design Direction: PJLaundry Mobile

## 1. Identity & Context

- **Product:** PJLaundry — aplikasi layanan laundry on-demand untuk pemesanan, penjemputan, pelacakan proses cucian, dan pembayaran.
- **Platform:** Mobile-first application for Android and iOS.
- **Audience:** Pelanggan individu dan keluarga yang membutuhkan layanan laundry praktis, transparan, dan dapat dipercaya. Antarmuka juga harus mendukung pemahaman status pesanan dengan cepat.
- **Brand Essence:** Fresh, Friendly, Dependable.
- **Personality:** Soft, Optimistic, Tactile, Clear.
- **Visual Direction:** Clean utility with playful organic accents.
- **Dial:** ENERGY 2 / RHYTHM 2 / MOTION 1.

### Brand Principles

1. **Friendly, never childish.** Gunakan bentuk organik dan warna hangat tanpa membuat aplikasi terlihat seperti permainan anak-anak.
2. **Clear, never cluttered.** Status pesanan, biaya, jadwal, dan tindakan utama harus mudah ditemukan.
3. **Expressive identity, restrained interface.** Karakter logo dipertahankan melalui warna, bentuk, dan aksen; bukan dengan memberikan efek glossy pada setiap komponen.
4. **Trust through clarity.** Informasi transaksi dan progres layanan harus lebih menonjol daripada dekorasi.
5. **Functional consistency.** Elemen yang memiliki fungsi sama harus memiliki tampilan dan perilaku yang konsisten.

## 2. Visual Levers & Core Rules

### One Focal Point per Screen

Setiap layar memiliki satu fokus visual utama yang jelas.

- **Home:** Status pesanan aktif atau tindakan utama untuk membuat pesanan.
- **Service Selection:** Pilihan layanan dan harga.
- **Order Detail:** Progres cucian dan status terkini.
- **Checkout:** Ringkasan biaya dan tombol konfirmasi.
- **Payment:** Total pembayaran dan status transaksi.
- **Order History:** Status serta tanggal pesanan yang paling relevan.

Jangan menampilkan beberapa elemen dengan intensitas visual yang sama jika salah satunya lebih penting bagi tugas pengguna.

### Identity Motif

- Gunakan kurva organik yang terinspirasi dari bentuk abstrak pada logo.
- Gunakan aksen swoosh atau lengkungan hanya pada area yang membutuhkan identitas visual.
- Gunakan bentuk kapsul untuk badge status dan elemen kecil tertentu.
- Pertahankan siluet dan proporsi logo asli; jangan merekonstruksi logo menggunakan teks atau bentuk UI.
- Jangan menjadikan motif logo sebagai dekorasi berulang pada setiap card.

### Whitespace & Composition

- Berikan ruang yang cukup antara heading, konten utama, dan tindakan.
- Variasikan komposisi berdasarkan tujuan layar, bukan sekadar mengganti urutan card.
- Gunakan section horizontal, list, progress indicator, dan area ringkasan sesuai kebutuhan.
- Hindari penggunaan grid card seragam untuk seluruh konten.
- Jangan menambahkan elemen dekoratif jika tidak memperjelas hierarki atau identitas produk.

## 3. Color Tokens

Palet berikut merupakan token desain awal yang diturunkan dari karakter visual logo PJLaundry. Nilainya adalah spesifikasi antarmuka, bukan klaim bahwa setiap warna merupakan sampel piksel persis dari logo.

### Brand Colors

- **Brand Blue:** `#3998E5` — warna brand utama untuk tindakan primer dan state aktif.
- **Brand Blue Dark:** `#2476BC` — variasi untuk pressed state dan elemen biru yang membutuhkan kontras lebih tinggi.
- **Brand Blue Soft:** `#EAF5FF` — latar pendukung untuk informasi atau progres terkait brand.
- **Brand Yellow:** `#FFE98A` — aksen hangat untuk ilustrasi dan sorotan terbatas.
- **Brand Orange:** `#FFB45C` — aksen sekunder untuk promosi dan elemen dekoratif.
- **Brand Orange Soft:** `#FFF2DE` — latar aksen hangat.

### Light Theme

- **Background Primary:** `#F7F9FC`
- **Surface Primary:** `#FFFFFF`
- **Surface Secondary:** `#F1F5F9`
- **Border Default:** `#E2E8F0`
- **Text Primary:** `#172033`
- **Text Secondary:** `#64748B`
- **Text Disabled:** `#94A3B8`
- **Text On Accent:** `#FFFFFF` only when sufficient contrast is verified.

### Semantic Colors

- **Success:** `#16845B`
- **Success Surface:** `#E8F7EF`
- **Warning:** `#A86408`
- **Warning Surface:** `#FFF4D8`
- **Error:** `#C93636`
- **Error Surface:** `#FDECEC`
- **Information:** `#2476BC`
- **Information Surface:** `#EAF5FF`

### Functional Color Rules

- Biru adalah satu-satunya aksen utama untuk CTA primer, navigasi aktif, dan fokus interaksi.
- Kuning dan oranye digunakan secara selektif untuk identitas visual, promosi, dan penekanan sekunder.
- Warna semantik ditentukan berdasarkan makna status, bukan warna dekoratif brand.
- Status tidak boleh dibedakan berdasarkan warna saja; sertakan label teks atau ikon yang jelas.
- Hindari teks putih di atas kuning atau oranye terang jika kontrasnya tidak memadai.
- Targetkan rasio kontras WCAG minimal 4.5:1 untuk teks normal dan 3:1 untuk teks besar serta komponen visual yang relevan.
- Jangan menggunakan semua warna brand secara bersamaan dalam satu komponen.
- Gradien bukan gaya default. Gunakan hanya jika memiliki tujuan visual yang jelas dan tidak mengganggu keterbacaan.

## 4. Typography Scale

### Font Family

- **Primary:** Plus Jakarta Sans.
- **Fallback:** system sans-serif.
- Gunakan font weight yang konsisten dan hindari terlalu banyak variasi ketebalan.

### Type Hierarchy

- **Display:** 28–32 px, Bold (700).
- **Heading 1:** 24 px, Bold (700).
- **Heading 2:** 20 px, SemiBold (600).
- **Heading 3:** 16–18 px, SemiBold (600).
- **Body Large:** 16 px, Regular (400).
- **Body:** 14 px, Regular (400).
- **Label:** 14 px, Medium (500).
- **Caption:** 12 px, Regular (400).
- **Numeric Emphasis:** 24–28 px, Bold (700), terutama untuk total pembayaran atau ringkasan yang benar-benar penting.

### Typography Rules

- Gunakan sentence case untuk heading dan label.
- Hindari penggunaan ALL CAPS pada teks panjang.
- Harga dan total pembayaran harus mudah dipindai.
- Jangan menggunakan banyak ukuran font berbeda dalam satu section.
- Pastikan teks Indonesia tetap nyaman dibaca pada layar kecil.
- Ukuran tipografi harus mengikuti skala platform jika implementasi native membutuhkan penyesuaian.

## 5. Layout, Spacing & Mobile Ergonomics

### Spacing System

Gunakan sistem spacing berbasis kelipatan 4 px:

- `4 px`: jarak mikro.
- `8 px`: jarak antar elemen terkait.
- `12 px`: jarak label dan konten pendukung.
- `16 px`: padding komponen standar.
- `20 px`: jarak antarkelompok.
- `24 px`: jarak antarsection.
- `32 px`: pemisah section utama.
- `40–48 px`: ruang khusus untuk komposisi hero atau area dengan penekanan visual.

### Layout Rules

- **Screen Padding:** 20 px sebagai default; sesuaikan dengan ukuran perangkat dan platform.
- **Content Width:** Gunakan lebar konten yang nyaman dibaca dan hindari baris teks terlalu panjang.
- **Card Radius:** 16 px.
- **Input Radius:** 12 px.
- **Primary Button Radius:** 14 px.
- **Status Badge:** pill-shaped.
- **Border:** 1 px dengan warna netral yang halus.
- **Elevation:** Gunakan border sebagai pemisah utama; shadow hanya untuk menunjukkan hierarki atau kedalaman.
- **Bottom Navigation:** Gunakan hanya jika struktur aplikasi memang membutuhkan navigasi tingkat atas yang persisten.

### Touch Targets & Safe Areas

- Target interaksi minimum: 48 × 48 dp pada Android dan sekitar 48 × 48 pt pada iOS sebagai standar desain lintas platform yang praktis.
- Icon button harus memiliki area sentuh yang cukup meskipun ikon visualnya lebih kecil.
- Pertimbangkan safe area untuk status bar, notch, dan home indicator.
- Hindari menempatkan CTA penting terlalu dekat dengan tepi layar.
- Jika keyboard terbuka, input aktif dan tindakan penting harus tetap dapat dijangkau.
- Sediakan state focus, pressed, disabled, loading, dan error yang jelas.

## 6. Component Direction

### Buttons

**Primary Button**

- Latar biru brand.
- Teks kontras tinggi.
- Bentuk rounded dengan radius 14 px.
- Satu CTA primer yang dominan per area tindakan.

**Secondary Button**

- Latar putih atau transparan.
- Border netral.
- Tidak bersaing secara visual dengan CTA primer.

**Destructive Button**

- Gunakan warna error hanya untuk tindakan destruktif.
- Tampilkan konfirmasi ketika tindakan memiliki konsekuensi yang signifikan.

### Cards

- Gunakan card untuk mengelompokkan informasi yang memang memiliki hubungan.
- Hindari card bersarang tanpa kebutuhan yang jelas.
- Jangan menggunakan shadow, gradien, badge, dan ikon dekoratif secara bersamaan pada semua card.
- Variasikan pola penyajian: list untuk informasi padat, card untuk kelompok informasi, dan inline section untuk konten sederhana.
- Card harus membantu pemindaian informasi, bukan menjadi dekorasi utama.

### Inputs & Forms

- Label harus tetap terlihat; placeholder bukan pengganti label.
- Tampilkan format, validasi, dan pesan error di dekat field terkait.
- Gunakan keyboard yang sesuai dengan tipe data.
- Pertahankan nilai input ketika validasi gagal jika memungkinkan.
- Pisahkan informasi wajib, opsional, dan instruksi tambahan secara jelas.

### Order Status

- Tampilkan nama status dalam teks yang eksplisit.
- Gunakan ikon atau indikator progres sebagai pendukung.
- Bedakan status menunggu, diproses, selesai, dan bermasalah dengan kombinasi teks, ikon, dan warna.
- Timestamp dan detail kurir bersifat sekunder kecuali sedang dibutuhkan untuk keputusan pengguna.
- Jangan menggunakan animasi terus-menerus hanya untuk menunjukkan pesanan aktif.

## 7. Motion & Interaction

**Motion Dial: 1 — Calm.**

- Utamakan respons langsung terhadap tap.
- Gunakan transisi sederhana untuk perubahan state yang membutuhkan konteks.
- Hindari parallax, animasi dekoratif berulang, dan choreografi kompleks.
- Jangan menunda tindakan pengguna demi animasi.
- Loading state harus memberikan umpan balik tanpa membuat layout bergeser secara tidak perlu.
- Hormati preferensi reduced motion pada platform yang mendukungnya.
- Perubahan status pesanan harus jelas meskipun animasi tidak berjalan.

## 8. Accessibility & Content

- Gunakan bahasa Indonesia yang ringkas, ramah, dan langsung.
- Hindari jargon teknis untuk pelanggan.
- Setiap ikon yang tidak umum harus memiliki label atau konteks yang jelas.
- Jangan mengandalkan warna sebagai satu-satunya pembeda.
- Pertahankan kontras teks dan komponen interaktif.
- Berikan pesan error yang menjelaskan masalah dan langkah berikutnya.
- Gunakan format tanggal, waktu, dan mata uang Rupiah yang konsisten.
- Tampilkan biaya secara transparan sebelum pengguna mengonfirmasi pesanan.
- Pastikan status pesanan dapat dipahami tanpa harus menafsirkan ilustrasi.

## 9. Anti-Patterns & Visual Boundaries

Hindari pola berikut:

- Dashboard yang seluruh isinya berupa card dengan ukuran dan struktur identik.
- Gradien biru-ungu generik yang tidak berasal dari identitas brand.
- Glassmorphism atau efek blur yang diterapkan tanpa kebutuhan.
- Shadow tebal pada semua card.
- Ilustrasi laundry generik yang tidak menambah makna.
- Emoji sebagai pengganti ikon antarmuka utama.
- Terlalu banyak warna aksen dalam satu viewport.
- Heading besar yang mengambil ruang tanpa menyampaikan informasi penting.
- Pill pada setiap elemen, termasuk elemen yang seharusnya berbentuk standar.
- Tombol primer yang berulang kali muncul dengan intensitas visual sama.
- Animasi yang menghambat interaksi.
- Dekorasi logo yang mengalahkan informasi transaksi.
- Komponen yang berbeda hanya demi variasi visual tanpa alasan fungsional.

## 10. Design Acceptance Criteria

Sebuah layar dinilai sesuai dengan arah desain PJLaundry apabila:

1. Memiliki fokus visual utama yang mudah dikenali.
2. Menggunakan warna dan tipografi secara konsisten.
3. Memiliki hierarki informasi sesuai tugas pengguna.
4. Tidak bergantung pada dekorasi untuk menciptakan karakter.
5. Menggunakan variasi layout berdasarkan kebutuhan konten.
6. Memiliki target sentuh yang memadai.
7. Menyediakan state interaksi dan status transaksi yang jelas.
8. Mempertahankan keterbacaan dan kontras yang memadai.
9. Menggunakan motif brand secara selektif.
10. Tetap terasa seperti PJLaundry meskipun dekorasi visual dihilangkan.

---

**Design North Star:** PJLaundry should feel fresh and approachable, with a distinctive blue-led identity, warm organic accents, and a calm interface that makes every laundry order easy to understand and manage.
