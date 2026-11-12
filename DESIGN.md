# Cooch — Design Guide (Mobile First)

Versi 0.1 · 2026-11-11 · Pendamping PRD "Multigame Party Platform"

**Cooch** adalah platform multigame untuk game kumpul-kumpul yang dimainkan **di satu HP yang diedarkan bergantian**. Dokumen ini mendefinisikan komponen, halaman, state, dan skenario penggunaan untuk layar mobile.

## 0. Keputusan Produk yang Mengunci Desain

| Topik | Keputusan |
| --- | --- |
| Perangkat | Satu HP diedarkan bergantian (pass-and-play). Tanpa online di rilis ini |
| Bahasa | Dwibahasa Indonesia (default) dan Inggris, bisa diganti kapan saja |
| Nama produk | Cooch |
| Narator/suara | Ditunda. Semua narasi berupa teks besar di layar |
| Iklan | Ditunda. Tidak ada slot iklan di layout |
| Guess the Impostor | Peran: Citizen, Impostor, Chameleon (lihat bagian 6) |
| Werewolf | Lima peran klasik: Werewolf, Villager, Seer, Doctor, Hunter |

## 1. Prinsip Desain

1. **Satu tangan, satu aksi.** Setiap layar punya satu tombol utama di zona jempol (bawah layar).
2. **Rahasia dulu.** Layar apa pun yang menampilkan info rahasia harus didahului layar penutup dan diikuti layar penutup. Tidak ada transisi yang memperlihatkan kartu.
3. **Bisa dibaca di ruangan ramai dan gelap.** Teks besar, kontras tinggi, mode terang sebagai default; mode malam dipakai saat fase malam Werewolf.
4. **Tidak ada jalan buntu.** Setiap layar punya cara keluar (jeda, kembali ke beranda) dan sesi yang terputus bisa dilanjutkan.
5. **Game-agnostic.** Halaman dan komponen inti tidak menyebut game tertentu. Layar khusus game dirakit dari komponen yang sama.
6. **Dwibahasa tanpa merusak layout.** Teks Indonesia sering 20-30% lebih panjang dari Inggris, jadi tidak ada lebar teks yang dikunci.

## 2. Design Tokens

 - USE EXISTING TOKENS

### Spasi, bentuk, gerak

- Spasi kelipatan 4 px. Gutter halaman 16 px. Radius kartu 20 px, tombol 16 px.
- Target sentuh minimal 48x48 px, jarak antar target minimal 8 px.
- Tombol utama: tinggi 56 px, lebar penuh, menempel di bawah dengan safe-area inset.
- Gerak: 150-250 ms untuk transisi UI, 400 ms untuk flip kartu. Hormati `prefers-reduced-motion` (ganti dengan fade).

## 3. Kerangka Layout Global

```
┌──────────────────────────┐
│ TopBar  [←]  Judul  [⋯]  │  56 px, status bar aman
├──────────────────────────┤
│                          │
│   Konten (scroll)        │
│                          │
├──────────────────────────┤
│ PrimaryAction (sticky)   │  tombol 56 px + safe area
└──────────────────────────┘
   BottomNav hanya di halaman Beranda, Jelajah, Pengaturan
```

- **BottomNav** (3 tab: Beranda, Jelajah, Pengaturan) hanya tampil di halaman level atas. Selama game berjalan, BottomNav disembunyikan agar tidak ada keluar tidak sengaja.
- **Selama game:** TopBar menampilkan tombol Jeda dan Aturan, bukan tombol kembali.
- Layar tetap menyala (Wake Lock) selama game. Orientasi dikunci portrait.
- Zona jempol: aksi utama selalu di bawah. Aksi destruktif (akhiri game) tidak di zona jempol dan butuh konfirmasi.

## 4. Katalog Komponen

| Komponen | Fungsi | Varian / state |
| --- | --- | --- |
| `TopBar` | Judul, kembali, menu | Default, dalam-game (Jeda, Aturan) |
| `BottomNav` | Navigasi level atas | 3 tab, aktif/tidak aktif |
| `PrimaryButton` | Aksi utama | Default, loading, disabled, hold-to-confirm |
| `SecondaryButton` | Aksi pendukung | Outline, teks |
| `LangSwitch` | Ganti ID/EN | Segmented control, juga ada di TopBar menu |
| `GameCard` | Kartu game di katalog | Besar (unggulan), kecil (grid), horizontal (daftar) |
| `CategoryChip` | Filter kategori | Pilih tunggal/ganda, aktif/tidak |
| `SearchField` | Cari game | Kosong, berisi, tidak ada hasil |
| `Stepper` | Atur jumlah (pemain, impostor, menit) | Dengan batas min/maks, tombol +/− besar |
| `PlayerRow` | Satu pemain di daftar | Nama bisa diedit, hapus, status (hidup/mati) |
| `SettingRow` | Satu pengaturan | Toggle, pilihan, stepper |
| `BottomSheet` | Panel dari bawah | Aturan, pilihan, konfirmasi |
| `ConfirmDialog` | Konfirmasi aksi berisiko | Netral, destruktif |
| `HandoffScreen` | Layar "serahkan HP ke {nama}" | Lihat 5.5 |
| `SecretCard` | Kartu rahasia (peran/kata) | Tertutup, terbuka, auto-tutup |
| `HoldToReveal` | Tahan untuk melihat | Menahan, terlepas, selesai |
| `Timer` | Hitung mundur | Berjalan, jeda, 10 detik terakhir, habis |
| `TurnOrderList` | Urutan giliran | Giliran sekarang disorot |
| `VoteGrid` | Pilih satu pemain | Tidak dipilih, dipilih, dinonaktifkan (mati) |
| `NarrationBanner` | Teks narasi fase | Pagi, malam (teks besar, tanpa suara) |
| `RoleBadge` | Ikon + nama peran | Per peran, per tim |
| `ResultPanel` | Pemenang dan ringkasan | Menang, kalah, seri |
| `ToastBar` | Pesan singkat | Info, peringatan |
| `ResumeBanner` | Lanjutkan sesi terakhir | Di Beranda, bila ada sesi tersimpan |
| `EmptyState` | Tidak ada data | Ikon, teks, aksi |

## 5. Halaman dan Komponennya

### 5.1 Beranda

**Tujuan:** langsung memilih game dalam kurang dari 10 detik.

```
┌──────────────────────────┐
│ Cooch            [ID|EN] │
│ [ResumeBanner]           │  hanya jika ada sesi
│ Cari game…               │
│ [Semua][Party][Kuis][…]  │  CategoryChip, scroll horizontal
│ ┌──────────────────────┐ │
│ │ GameCard besar       │ │  unggulan
│ └──────────────────────┘ │
│ Baru dimainkan   →       │
│ [card][card][card]       │
│ Semua game               │
│ [card][card]             │  grid 2 kolom
│ [Beranda][Jelajah][Atur] │
└──────────────────────────┘
```

- Komponen: TopBar, LangSwitch, ResumeBanner, SearchField, CategoryChip, GameCard, BottomNav.
- State: pertama kali (tanpa "Baru dimainkan"), ada sesi tersimpan, katalog kosong atau tidak ada hasil pencarian (EmptyState).
- GameCard menampilkan nama, ikon/ilustrasi, jumlah pemain, durasi, dan tag.

### 5.2 Jelajah

Daftar penuh game dengan filter jumlah pemain, durasi, dan kategori lewat BottomSheet. Komponen: SearchField, CategoryChip, GameCard (horizontal), BottomSheet filter. Menampilkan jumlah hasil dan tombol "Reset filter".

### 5.3 Detail Game

**Tujuan:** memahami game dan memulainya.

- Konten: ilustrasi, nama, deskripsi satu kalimat, info (pemain, durasi, tingkat kesulitan), "Cara main" (3-5 langkah singkat, bisa dibuka sebagai BottomSheet), daftar peran atau kategori.
- Aksi utama: **Mulai / Start** (sticky). Aksi kedua: Cara main.
- Komponen: TopBar, GameCard besar, daftar info, BottomSheet aturan, PrimaryButton.

### 5.4 Setup Sesi

**Tujuan:** menyiapkan pemain dan aturan dalam kurang dari 60 detik.

```
┌──────────────────────────┐
│ ← Setup · Werewolf       │
│ Jumlah pemain  [−] 8 [+] │  Stepper
│ Nama pemain (opsional)   │
│  1 [Aku        ] ✕       │  PlayerRow, otomatis "Pemain 2" dst.
│  2 [Pemain 2   ] ✕       │
│  [+ Tambah pemain]       │
│ Pengaturan game          │
│  Buka peran saat mati  ◉ │  SettingRow
│  …                       │
│ Komposisi peran  (saran) │  khusus Werewolf, bisa diubah
│ [      Mulai       ]     │
└──────────────────────────┘
```

- Mengubah jumlah pemain otomatis menambah/menghapus baris. Nama kosong diisi otomatis.
- Pengaturan terakhir tiap game diingat di perangkat.
- Validasi inline: jumlah pemain di luar batas game, nama kembar, komposisi peran tidak sesuai jumlah pemain.
- Mengacak urutan duduk: tombol "Acak urutan" untuk menentukan urutan reveal.
- Komponen: Stepper, PlayerRow, SettingRow, BottomSheet (pilihan kategori), PrimaryButton.

### 5.5 Handoff (Serahkan HP)

Layar yang paling sering muncul. Dipakai sebelum dan sesudah setiap layar rahasia.

```
┌──────────────────────────┐
│                          │
│        (ikon tangan)     │
│                          │
│     Serahkan HP ke       │
│        BUDI              │  display, nama besar
│                          │
│  Hanya Budi yang boleh   │
│  melihat layar berikutnya│
│                          │
│ [   Aku Budi, lanjut   ] │  PrimaryButton (hold 0,5 dtk)
└──────────────────────────┘
```

- Tombol lanjut butuh **tahan 0,5 detik** agar tidak terbuka tidak sengaja saat HP berpindah tangan.
- Tidak menampilkan peran, kata, atau petunjuk apa pun.
- Pemain terakhir selesai berganti ke layar "Semua sudah melihat" dengan aksi **Mulai game**.

### 5.6 Reveal Kartu Rahasia

```
┌──────────────────────────┐
│ Budi · 3 dari 8          │
│  ┌────────────────────┐  │
│  │   (kartu tertutup) │  │
│  │   Tahan untuk      │  │  HoldToReveal
│  │   melihat          │  │
│  └────────────────────┘  │
│ [  Sudah, tutup kartu  ] │  aktif setelah kartu dibuka
└──────────────────────────┘
```

- Kartu terbuka hanya selama ditahan atau, di mode "ketuk", sampai diketuk lagi. Auto-tutup setelah 15 detik.
- Tombol "Sudah, tutup kartu" aktif hanya setelah kartu pernah dibuka. Setelahnya langsung ke Handoff pemain berikutnya.
- Tombol Jeda di TopBar menyembunyikan kartu secara paksa.
- Isi kartu per game: lihat 6.1 dan 7.1.

### 5.7 Halaman dalam Game (kerangka)

Setiap game memakai kerangka sama: TopBar dalam-game (Jeda, Aturan), area konten fase, PrimaryButton fase. Fase umum yang disediakan inti: **Giliran** (TurnOrderList), **Diskusi** (Timer), **Voting** (VoteGrid), **Hasil** (ResultPanel). Game menyusun fase sesuai mesinnya.

### 5.8 Hasil

- ResultPanel: pemenang, peran semua pemain terbuka, kata rahasia (bila ada), ringkasan ringkas.
- Aksi: **Main lagi** (pengaturan sama, peran diacak ulang), **Ubah pengaturan**, **Ke beranda**.
- Satu baris survei opsional "Seru?" (👍/👎) yang bisa dilewati.

### 5.9 Pengaturan

Bahasa (ID/EN), tema (gelap/terang/ikut sistem), ukuran teks, getar, kurangi gerak, hapus data lokal, tentang Cooch. Komponen: SettingRow, LangSwitch, ConfirmDialog (hapus data).

### 5.10 Jeda dan Keluar

BottomSheet dari TopBar: Lanjutkan, Aturan, Ulangi dari awal, Akhiri game. "Akhiri game" memakai ConfirmDialog destruktif. Menutup tab tidak menghapus sesi. Saat dibuka lagi, ResumeBanner di Beranda menawarkan lanjut dengan layar Handoff sebagai pembuka agar tidak ada rahasia terlihat.

### 5.11 Status Khusus

| Situasi | Perilaku |
| --- | --- |
| Offline | Tetap main. Ikon kecil "Offline siap" di Pengaturan |
| Sesi tersimpan | ResumeBanner, mulai dari Handoff |
| Rotasi layar | Dikunci portrait, tidak ada layout lanskap |
| HP terkunci/di-background | Saat kembali, layar rahasia disembunyikan dan masuk Handoff |
| Jumlah pemain di luar batas | Tombol Mulai nonaktif, pesan inline |

## 6. Game Awal 1: Guess the Impostor (Cooch)

### 6.1 Peran dan isi kartu

| Peran | Tim | Kartu menampilkan |
| --- | --- | --- |
| Citizen | Warga | Kategori + **kata rahasia** (sama untuk semua Citizen) |
| Chameleon | Jahat | Kategori yang **sama** + **kata berbeda** (mirip tapi bukan kata Citizen). Kartu tampak seperti Citizen, tanpa tanda peran |
| Impostor | Jahat | "Kamu Impostor" + kategori saja, **tanpa kata** |

Asumsi desain (perlu dikonfirmasi): Chameleon tidak tahu dirinya Chameleon, sehingga ia ikut memberi petunjuk seperti warga. Impostor tidak tahu siapa Chameleon. Tim jahat adalah Impostor dan Chameleon. Jumlah pemain minimal untuk Chameleon adalah 6, di bawah itu hanya Citizen dan Impostor.

### 6.2 Setup khusus

Jumlah Impostor (Stepper), Chameleon (toggle, jumlah 0-1 atau lebih), kategori (BottomSheet multi-pilih, bisa "Acak"), timer diskusi, "Impostor boleh menebak kata saat tertangkap" (toggle).

### 6.3 Alur layar

1. Setup → 2. Handoff/Reveal bergilir → 3. **Giliran petunjuk** (TurnOrderList, pemain pertama diacak, satu petunjuk lisan per orang) → 4. **Diskusi** (Timer, tombol "Mulai voting") → 5. **Voting** (VoteGrid, tiap pemain memilih secara rahasia dengan Handoff antar pemain) → 6. **Hasil putaran** → 7. **Hasil akhir**.

- Voting memakai VoteGrid satu layar per pemain. Pilihan tidak ditampilkan sampai semua selesai, lalu hasil suara dibuka bersamaan.
- Pemain yang tereliminasi diungkap perannya. Bila ia Impostor, muncul layar **Tebak kata** (input teks besar, satu kesempatan).
- Chameleon yang tereliminasi tidak menebak kata, tetapi permainan lanjut selama masih ada tim jahat tersisa.
- Aturan menang (perlu dikonfirmasi): warga menang bila semua tim jahat tereliminasi. Tim jahat menang bila jumlahnya sama atau lebih dari warga hidup, atau Impostor menebak kata dengan benar.

### 6.4 Konten

Kata disimpan per kategori dengan field `word_id`, `word_en`, `lookalike_id`, `lookalike_en` (kata pembeda untuk Chameleon, tetap dalam kategori sama). Bahasa kata mengikuti bahasa aplikasi, atau bisa dipilih terpisah di Setup.

## 7. Game Awal 2: Werewolf (Cooch)

### 7.1 Lima peran klasik

| Peran | Tim | Aksi |
| --- | --- | --- |
| Werewolf | Werewolf | Memilih satu korban tiap malam. Sesama Werewolf saling tahu |
| Villager | Desa | Tidak ada aksi malam |
| Seer | Desa | Memilih satu pemain, lalu melihat apakah ia Werewolf |
| Doctor | Desa | Melindungi satu pemain per malam, tidak boleh orang yang sama dua malam berturut-turut |
| Hunter | Desa | Saat mati, menembak satu pemain |

Komposisi otomatis mengikuti tabel di PRD bagian 4 dan bisa diubah di Setup.

### 7.2 Alur layar (loop)

1. Setup → 2. Handoff/Reveal bergilir (Werewolf melihat rekannya di kartu) → 3. **Malam** → 4. **Pagi** → 5. **Diskusi siang** → 6. **Voting** → 7. **Eksekusi** → cek menang → ulang dari 3.

**Malam (tanpa narator suara):**
- Layar `night` penuh dengan NarrationBanner teks besar: "Malam tiba. Semua menutup mata."
- Host menekan "Mulai malam". Lalu urutan aksi: Werewolf → Doctor → Seer, masing-masing diawali Handoff ke pemain pemilik peran.
- Aksi Werewolf: Werewolf berkumpul memegang HP bersama, lalu VoteGrid memilih korban. Bila ada lebih dari satu Werewolf, layar meminta mereka sepakat sebelum menekan konfirmasi.
- **Peran yang sudah mati atau tidak ada tetap dipanggil** dengan layar Handoff dan jeda acak (3-8 detik) agar pemain lain tidak bisa menebak siapa masih hidup.
- Seer melihat hasil di SecretCard ("Werewolf" atau "Bukan Werewolf"), lalu tutup kartu.

**Pagi:** NarrationBanner mengumumkan korban (atau "Tidak ada yang mati"). Peran korban terbuka bila opsi "Buka peran saat mati" aktif. Bila korban adalah Hunter, muncul layar **Tembakan Hunter** (VoteGrid satu pilihan, pemain hidup saja).

**Siang:** daftar pemain hidup (PlayerRow dengan status), Timer diskusi, tombol "Mulai voting".

**Voting:** satu VoteGrid, tiap pemain hidup memilih bergantian secara rahasia (Handoff), atau mode cepat "hitung tangan, host memasukkan hasil". Seri sesuai pengaturan (tanpa eksekusi atau voting ulang).

### 7.3 Layar status untuk host

Tombol "Siapa masih hidup" di TopBar menampilkan hanya daftar nama hidup/mati (tanpa peran), aman dilihat semua orang.

### 7.4 Pengecekan menang

Desa menang bila semua Werewolf mati. Werewolf menang bila jumlahnya sama atau lebih dari warga hidup. Layar hasil menampilkan semua peran dan kronologi singkat per malam.

## 8. Skenario Penggunaan

### Skenario A: Kumpul pertama kali, Guess the Impostor, 6 orang

1. Dina membuka Cooch di HP, layar Beranda tampil dalam bahasa Indonesia mengikuti HP.
2. Ia mengetuk kartu **Guess the Impostor**, membaca "Cara main" sekilas, lalu **Mulai**.
3. Di Setup, ia mengatur 6 pemain, mengetik nama temannya, memilih 1 Impostor dan menyalakan Chameleon, kategori "Makanan" dan "Hewan".
4. HP dioper. Tiap orang menahan kartu untuk melihat kata, lalu menutup. Dina mendapat kata "Bakso", temannya Raka mendapat "Mi ayam" (Chameleon, tanpa tanda), dan Sari mendapat "Impostor, kategori Makanan".
5. Giliran petunjuk berjalan. Setelah diskusi tiga menit, mereka memilih Mulai voting dan HP dioper untuk voting rahasia.
6. Hasil: Sari tereliminasi, ia menebak kata dan salah. Permainan lanjut karena Chameleon masih ada. Di putaran berikutnya Raka tereliminasi, Citizen menang. Mereka menekan **Main lagi**.

### Skenario B: Werewolf 8 orang tanpa moderator

1. Bima memilih **Werewolf**, jumlah pemain 8, menerima komposisi saran (2 Werewolf, 1 Seer, 1 Doctor, 4 Villager, Hunter menggantikan satu Villager bila diaktifkan).
2. Reveal bergilir. Dua Werewolf melihat nama rekannya di kartu.
3. Malam 1: Handoff ke Werewolf yang memilih korban, lalu ke Doctor, lalu ke Seer. Peran yang tidak ada dipanggil dengan jeda acak.
4. Pagi: "Rani meninggal." Rani adalah Hunter, ia menembak satu pemain dari layar Tembakan Hunter.
5. Diskusi siang empat menit, voting, satu pemain dieksekusi. Loop berlanjut sampai Desa menang.

### Skenario C: HP berdering di tengah game

1. Telepon masuk saat Werewolf sedang di fase Siang. Setelah ditutup dan kembali ke browser, layar menampilkan Handoff ("Lanjutkan sebagai host"), bukan layar yang mungkin berisi rahasia.
2. Game lanjut dari fase terakhir tanpa kehilangan peran.

### Skenario D: Ganti bahasa di tengah acara

1. Teman dari luar negeri ikut bermain. Di Pengaturan, Dina mengganti ke English.
2. Seluruh UI dan nama kategori berganti. Game yang sedang berjalan tidak direset. Kata rahasia yang sudah dibagikan tetap dalam bahasa saat dibagikan.

### Skenario E: Salah mengetuk "Akhiri game"

1. Pemain mengetuk Jeda lalu Akhiri game. ConfirmDialog destruktif muncul dengan tombol batal sebagai fokus utama.
2. Bila dibatalkan, game lanjut. Bila dikonfirmasi, sesi dihapus dan pengguna kembali ke Beranda.

## 9. Dwibahasa (ID/EN)

- Semua teks berada di berkas terjemahan berbasis key (`home.title`, `handoff.passTo`), bukan di komponen.
- Bahasa default mengikuti bahasa browser, lalu pilihan pengguna disimpan.
- Kata rahasia dan konten game memiliki field `_id` dan `_en`. Bila terjemahan belum ada, tampilkan bahasa lain dan tandai.
- Tombol dan label memakai teks yang bisa memanjang, tanpa lebar tetap dan tanpa teks di dalam gambar.
- Format angka dan waktu mengikuti bahasa terpilih.

## 10. Aksesibilitas dan Performa

- Kontras 4,5:1, target sentuh 48 px, fokus terlihat, label untuk pembaca layar di semua tombol ikon.
- Informasi tidak hanya lewat warna: tim dan status memakai ikon dan teks.
- Getar singkat (opsional) saat kartu terbuka/tertutup dan saat timer habis.
- Halaman awal di bawah 300 KB, modul game dimuat saat dibuka, ilustrasi memakai SVG.
- Semua aksi inti berfungsi tanpa koneksi setelah kunjungan pertama (PWA).

## 11. Memetakan Game Baru ke Komponen

Game baru dirakit dari komponen di atas, tanpa halaman baru di inti.

| Jenis game | Komponen yang dipakai ulang |
| --- | --- |
| Spyfall, Avalon, Mafia | SecretCard, HandoffScreen, VoteGrid, Timer, ResultPanel |
| Charades, tebak kata | Timer, TurnOrderList, skor, ResultPanel, kartu kata |
| Kuis tim | Stepper, skor, Timer, ResultPanel |
| Game solo kasual | TopBar dalam-game, skor tertinggi lokal, ResultPanel |
| Game dua pemain satu layar | Kerangka dalam-game, TurnOrderList, ResultPanel |

Syarat sebuah game baru: menyediakan metadata, skema setup, mesin fase, dan layar khusus yang dirakit dari katalog komponen. Bila butuh komponen baru yang dipakai lebih dari satu game, komponen itu ditambahkan ke katalog bagian 4.

## 12. Pertanyaan Terbuka Desain

- [ ] Apakah Chameleon sebaiknya tahu dirinya Chameleon, atau tidak (asumsi sekarang: tidak tahu)? Tidak Tahu
- [ ] Apakah Impostor hanya melihat kategori, atau tidak ada petunjuk sama sekali? Tidak sama sekali
- [ ] Aturan menang Guess the Impostor: eliminasi berulang (asumsi sekarang) atau satu kali voting? Eliminasi berulang sampai semua impostor atau chameleon habis. Jika Impostor/Chameleon menang ketika Innocent kalah jumlah.
- [ ] Apakah Hunter masuk di komposisi default semua ukuran grup, atau hanya di 9 pemain ke atas? Jadikan opsi