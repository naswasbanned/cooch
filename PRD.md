# PRD: Multigame Party Platform

Nov 9, 2026 · @Naufal Aqil

Website **platform multigame** seperti Friv: satu tempat berisi banyak game dari berbagai jenis, dengan katalog yang terus bertambah. Fokus awal adalah game kumpul-kumpul satu perangkat (couch co-op / pass-and-play) yang menggantikan kartu fisik dan Dungeon Master manusia, tetapi platform dirancang agar game jenis apa pun bisa ditambahkan. Guess the Impostor dan Werewolf hanyalah dua game pembuka, bukan batas produk.

## 0. Visi Platform Multigame

**Posisi produk:** bukan aplikasi dua game, melainkan *rumah* untuk banyak game. Nilai utamanya adalah katalog yang luas, pengalaman yang konsisten antar game, dan kemudahan menambah game baru. Pengguna datang untuk "main sesuatu", bukan untuk satu game tertentu.

**Prinsip platform**

1. **Game-agnostic:** inti platform tidak mengandung logika game apa pun. Semua yang spesifik game hidup di modul game.
2. **Tambah game tanpa mengubah inti:** game baru cukup didaftarkan lewat kontrak modul (bagian 5) dan langsung muncul di katalog.
3. **Banyak jenis game:** pass-and-play, solo, dua pemain di satu layar, multipemain online, game party, kuis, puzzle, dan game kasual HTML5.
4. **Pengalaman seragam:** navigasi, tema, tombol, dan alur mulai game konsisten di semua game.
5. **Katalog tumbuh dari konten, bukan dari kode inti:** penambahan game dan paket konten (kata, soal, kartu) adalah pekerjaan konten.

**Jenis game yang didukung platform**

| Jenis | Contoh | Cara main | Rilis |
| --- | --- | --- | --- |
| Party sosial satu perangkat | Guess the Impostor, Werewolf, Spyfall | Perangkat diedarkan, website sebagai moderator | MVP |
| Party tebak dan kuis | Charades, tebak kata, kuis tim | Satu layar bersama, timer dan skor otomatis | Setelah MVP |
| Game solo kasual | Puzzle, memori, reflex, game arcade ringan | Satu pemain, skor tinggi lokal | Setelah MVP |
| Game dua pemain satu layar | Catur, tic-tac-toe, game papan | Dua pemain bergantian atau berhadapan | Setelah MVP |
| Multipemain online | Werewolf online, game papan online | Kode ruangan, tiap pemain HP sendiri | Tahap lanjut |
| Game pihak ketiga (HTML5) | Game dari pengembang lain | Dimuat lewat iframe dengan SDK platform | Tahap lanjut |

## 1. Latar Belakang, Pengguna, dan Tujuan

Game sosial seperti Werewolf dan Guess the Impostor butuh moderator, kartu peran, dan catatan kata rahasia. Di praktiknya, kelompok sering batal main karena tidak ada yang mau jadi moderator, kartu hilang, atau pembagian peran bocor. Platform ini menggantikan semua itu dengan satu website yang dibuka di satu HP atau laptop dan diedarkan antar pemain.

**Target pengguna**

| Persona | Situasi | Kebutuhan utama |
| --- | --- | --- |
| Host santai | Nongkrong 4-12 orang, tidak ada yang mau jadi moderator | Mulai game dalam kurang dari 1 menit |
| Penyelenggara acara | Gathering kantor, kelas, camping, ulang tahun | Banyak game dalam satu tempat, mudah dijelaskan |
| Pemain baru | Belum hafal aturan | Penjelasan aturan singkat di dalam game |

**Tujuan produk**

1. Satu perangkat cukup: tanpa login, tanpa pemain install aplikasi.
2. Role dan kata rahasia tidak bocor selama proses reveal.
3. Website menjalankan seluruh alur game, termasuk menjadi Dungeon Master penuh untuk Werewolf.
4. Game baru bisa ditambahkan tanpa mengubah inti platform.

**Metrik keberhasilan (3 bulan setelah rilis)**

| Metrik | Target |
| --- | --- |
| Waktu dari buka website sampai game mulai | < 60 detik |
| Game selesai dibanding game dimulai | > 70% |
| Pengguna yang memainkan lebih dari 1 game per sesi | > 35% |
| Pemain kembali dalam 30 hari | > 25% |
| Skor kepuasan (survei singkat di akhir game) | > 4,2 dari 5 |

## 2. Konsep Inti dan Fitur Platform

Semua game memakai satu pola: **satu perangkat diedarkan**. Setiap pemain membuka kartunya sendiri secara bergiliran, membaca, menutup, lalu mengoper perangkat. Pola ini disebut *pass-and-play* dan menjadi fondasi seluruh platform.

**Alur umum setiap game**

1. Pilih game dari katalog.
2. Atur sesi: jumlah pemain, nama pemain (opsional), opsi khusus game.
3. Reveal role: tiap pemain membuka kartu rahasia secara bergiliran.
4. Jalankan game: diskusi, voting, atau fase dari website.
5. Hasil akhir: pemenang, ringkasan, dan tombol main lagi dengan pengaturan sama.

**Fitur platform yang dipakai bersama**

| Fitur | Deskripsi | Prioritas |
| --- | --- | --- |
| Katalog game | Halaman beranda berisi kartu game dengan jumlah pemain, durasi, dan tingkat kesulitan | Wajib |
| Setup sesi | Input jumlah pemain 3-20, nama pemain opsional, simpan pengaturan terakhir | Wajib |
| Kartu reveal | Kartu tertutup, tahan atau ketuk untuk membuka, otomatis menutup setelah dibaca, layar jeda sebelum oper | Wajib |
| Anti-bocor | Layar "serahkan ke pemain berikutnya" dengan nama pemain, tidak ada kartu terlihat saat transisi | Wajib |
| Timer | Timer diskusi dan voting yang bisa diatur host | Wajib |
| Penjelasan aturan | Panel aturan singkat per game, bisa dibuka kapan saja | Wajib |
| Narasi suara | Suara moderator (text-to-speech atau rekaman) untuk fase malam Werewolf | Sebaiknya ada |
| Mode terang dan gelap | Mode gelap otomatis untuk fase malam | Sebaiknya ada |
| Multi bahasa | Bahasa Indonesia sebagai default, Inggris sebagai tambahan | Sebaiknya ada |
| Riwayat dan statistik | Rekap game yang dimainkan di perangkat itu, tersimpan lokal | Nanti |
| Mode online | Tiap pemain memakai HP sendiri lewat kode ruangan | Nanti |

**Prinsip desain:** tidak perlu akun, tidak perlu internet setelah halaman termuat (PWA), dan satu tombol besar per layar sehingga bisa dipakai dalam ruangan gelap dan ramai.

## 3. Game Awal 1: Guess the Impostor

**Ringkasan:** semua pemain menerima kata rahasia yang sama, kecuali impostor yang menerima kata mirip atau tidak menerima kata sama sekali. Pemain bergiliran memberi petunjuk, lalu voting untuk menemukan impostor.

**Setup**

| Pengaturan | Pilihan | Default |
| --- | --- | --- |
| Jumlah pemain | 3-20 | 5 |
| Jumlah impostor | 1 sampai pemain dibagi 3 (dibulatkan ke bawah) | 1 |
| Kategori kata | Satu atau beberapa kategori, atau acak | Acak |
| Mode impostor | (a) Tidak tahu kata, hanya tahu kategori. (b) Dapat kata mirip | (a) |
| Timer diskusi | 1-10 menit atau tanpa timer | 3 menit |
| Impostor boleh menebak kata saat tertangkap | Ya / Tidak | Ya |

**Alur permainan**

1. Sistem memilih satu kata dari kategori dan mengacak peran.
2. Reveal bergiliran: pemain membuka kartu. Warga melihat kata rahasia, impostor melihat "Kamu Impostor" (plus kategori atau kata mirip sesuai mode).
3. Sistem menentukan pemain pertama secara acak dan menampilkan urutan giliran.
4. Ronde petunjuk: tiap pemain menyebut satu petunjuk lisan tentang kata itu. Website hanya menampilkan giliran dan timer.
5. Diskusi bebas sampai timer habis atau host menekan "Mulai voting".
6. Voting: pemain memilih tersangka secara rahasia bergantian di perangkat, atau lewat hitung jari lalu host memasukkan hasil.
7. Hasil: bila impostor tertangkap, ia punya satu kesempatan menebak kata. Tebakan benar berarti impostor menang.

**Aturan menang**

| Kondisi | Pemenang |
| --- | --- |
| Impostor terpilih dan gagal menebak kata | Warga |
| Impostor terpilih tetapi menebak kata dengan benar | Impostor |
| Pemain yang terpilih adalah warga | Impostor |

**Sistem kata dan kategori**

- Kata dibagi per kategori, misalnya Makanan, Hewan, Tempat, Profesi, Film dan Serial, Olahraga, Benda Sehari-hari, Tokoh Umum, dan Kota Indonesia.
- Setiap kata punya data: kategori, kata utama, kata mirip (untuk mode b), tingkat kesulitan (mudah, sedang, sulit), dan bahasa.
- Sistem tidak mengulang kata yang sudah keluar dalam sesi yang sama.
- Host boleh menambah kategori buatan sendiri (daftar kata dimasukkan manual), disimpan di perangkat.
- Isi awal: minimal 10 kategori dengan 50 kata per kategori sebelum rilis.

**Kebutuhan fungsional utama**

- Pembagian peran acak yang adil dan tidak bisa ditebak dari urutan reveal.
- Kartu reveal menampilkan kata dengan ukuran besar dan otomatis menutup setelah waktu tertentu atau saat diketuk.
- Tombol "kata sudah dibaca" wajib ditekan sebelum perangkat bisa dioper.
- Layar hasil menampilkan siapa impostor dan kata aslinya, dengan tombol main lagi.

## 4. Game Awal 2: Werewolf (Website sebagai Dungeon Master)

**Ringkasan:** desa berisi warga dan werewolf yang menyamar. Setiap malam werewolf memilih korban, setiap siang desa berdiskusi dan mengeksekusi satu tersangka. Website menggantikan Dungeon Master: membagikan peran, membacakan narasi, menjalankan aksi malam secara rahasia, dan menghitung hasil.

**Peran**

| Peran | Tim | Aksi | Rilis |
| --- | --- | --- | --- |
| Werewolf | Werewolf | Memilih satu korban tiap malam (bersama werewolf lain) | MVP |
| Villager | Desa | Tidak ada aksi malam, hanya diskusi dan voting | MVP |
| Seer | Desa | Memilih satu pemain tiap malam untuk dicek apakah werewolf | MVP |
| Doctor | Desa | Melindungi satu pemain tiap malam, tidak boleh orang yang sama dua malam berturut-turut | MVP |
| Hunter | Desa | Saat mati, menembak satu pemain pilihannya | MVP |
| Witch | Desa | Satu ramuan menyelamatkan dan satu ramuan membunuh, masing-masing sekali per game | Versi 1.1 |
| Cupid | Desa | Malam pertama memasangkan dua pemain sebagai pasangan | Versi 1.1 |
| Bodyguard, Tanner, Alpha Wolf, dst. | Beragam | Peran tambahan | Nanti |

**Saran komposisi peran otomatis** (host bisa mengubah manual)

| Pemain | Werewolf | Seer | Doctor | Hunter | Sisanya Villager |
| --- | --- | --- | --- | --- | --- |
| 5-6 | 1 | 1 | 0 | 0 | 3-4 |
| 7-8 | 2 | 1 | 1 | 0 | 3-4 |
| 9-11 | 2 | 1 | 1 | 1 | 4-6 |
| 12-15 | 3 | 1 | 1 | 1 | 6-9 |
| 16-20 | 4 | 1 | 1 | 1 | 9-13 |

**Alur permainan (loop malam dan siang)**

1. Setup dan reveal: sama seperti Guess the Impostor, tiap pemain membuka kartu peran secara bergiliran. Werewolf diberi tahu siapa rekannya lewat layar khusus.
2. Malam: layar gelap, narator membacakan "Semua tidur". Peran dipanggil satu per satu dalam urutan tetap (Cupid pada malam pertama, Werewolf, Doctor, Seer, Witch). Pemain bersangkutan menerima perangkat, memilih aksi, lalu menyerahkan kembali. Peran yang sudah mati tetap dipanggil dengan jeda acak agar tidak ketahuan.
3. Pagi: website mengumumkan korban malam. Kematian ditampilkan tanpa membuka peran, kecuali opsi "buka peran saat mati" diaktifkan.
4. Diskusi siang: timer berjalan, host bisa memperpanjang atau mempersingkat.
5. Voting: pemain hidup memilih tersangka, suara terbanyak dieksekusi. Hasil seri berarti tidak ada eksekusi, atau voting ulang (opsi host).
6. Cek kemenangan, lalu ulangi dari malam sampai satu tim menang.

**Kondisi menang**

- Desa menang bila semua werewolf mati.
- Werewolf menang bila jumlah werewolf sama atau lebih banyak dari jumlah warga hidup.
- Pasangan Cupid menang bersama bila hanya mereka berdua yang tersisa (versi 1.1).

**Tugas website sebagai Dungeon Master**

- Menyimpan seluruh state rahasia (peran, siapa hidup, siapa dilindungi, hasil cek Seer) dan tidak menampilkannya ke layar publik.
- Membacakan narasi tiap fase lewat teks besar dan suara opsional.
- Menyelesaikan urutan aksi malam secara konsisten: Doctor menggagalkan serangan, ramuan Witch diproses sesudahnya, dan seterusnya.
- Menegakkan aturan: tidak ada pemain mati yang bisa dipilih, Doctor tidak boleh melindungi orang yang sama dua kali berturut-turut.
- Menjalankan timer, hitung suara, dan pengumuman kemenangan.
- Menyediakan tombol "lihat peran saya lagi" yang dilindungi jeda dan konfirmasi agar tidak disalahgunakan.
- Mode Moderator Manusia (opsional): host yang melihat semua peran dan website hanya menjadi alat bantu.

**Pengaturan host**

| Pengaturan | Pilihan | Default |
| --- | --- | --- |
| Buka peran saat mati | Ya / Tidak | Ya |
| Hasil voting seri | Tidak ada eksekusi / Voting ulang | Tidak ada eksekusi |
| Timer diskusi siang | 1-10 menit | 4 menit |
| Narasi suara | Hidup / Mati | Hidup |
| Doctor boleh melindungi diri sendiri | Ya / Tidak | Ya |
| Seer melihat peran asli atau hanya "werewolf / bukan" | Hanya werewolf atau bukan | Hanya werewolf atau bukan |

## 5. Arsitektur Game Modular

Platform dibagi menjadi dua lapis: **inti platform** (dibuat sekali) dan **modul game** (satu per game). Game baru cukup menulis satu modul yang mengikuti kontrak yang sama, tanpa menyentuh inti.

| Lapisan | Isi | Tanggung jawab |
| --- | --- | --- |
| Inti platform | Katalog, setup sesi, kartu reveal, timer, narator, penyimpanan lokal, tema, bahasa | Semua yang dipakai lebih dari satu game |
| Mesin game | State machine per game: fase, giliran, aksi, aturan menang | Logika murni tanpa tampilan, mudah diuji |
| Modul game | Konfigurasi, aturan, daftar peran atau kata, layar khusus game | Satu folder per game |

**Kontrak modul game** (setiap game wajib menyediakan)

- Metadata: nama, ikon, deskripsi, jumlah pemain minimum dan maksimum, durasi, tingkat kesulitan.
- Skema pengaturan sesi (agar form setup dibuat otomatis).
- Fungsi pembagian peran dan data rahasia per pemain.
- State machine: daftar fase, transisi, dan aksi yang diizinkan di tiap fase.
- Layar khusus game yang dirender oleh inti platform lewat komponen standar.
- Teks aturan dan narasi, dipisah dari kode agar mudah diterjemahkan.

**Model data utama**

| Entitas | Isi utama |
| --- | --- |
| Game | id, nama, versi, pengaturan default, daftar peran atau kategori |
| Session | id game, daftar pemain, pengaturan terpilih, fase saat ini, riwayat aksi |
| Player | nama, peran rahasia, status hidup atau mati, data rahasia (misalnya kata atau hasil cek Seer) |
| WordPack | kategori, kata, kata mirip, tingkat kesulitan, bahasa |
| Settings | bahasa, tema, suara, kategori kustom, tersimpan lokal di perangkat |

**Prinsip penting:** state sesi disimpan di perangkat (localStorage atau IndexedDB), sehingga menutup tab tidak menghilangkan game yang sedang berjalan dan tidak butuh server untuk mode pass-and-play.

**Game Registry dan penambahan game baru**

- Semua game terdaftar di satu *registry* (daftar) yang membaca metadata tiap modul. Katalog, pencarian, dan halaman game dibuat otomatis dari registry itu.
- Menambah game = membuat satu folder modul dan satu entri registry. Tidak ada perubahan di katalog, setup sesi, atau tema inti.
- Modul game dimuat *lazy* (hanya diunduh saat dibuka) sehingga ukuran halaman awal tetap kecil walau katalog mencapai ratusan game.
- Setiap game punya versi dan bisa dinyalakan atau dimatikan lewat konfigurasi tanpa deploy ulang.

**Komponen bersama yang disediakan inti untuk semua game**

| Komponen | Dipakai oleh |
| --- | --- |
| Layar setup pemain dan pengaturan (dibuat dari skema) | Game multipemain dan party |
| Kartu reveal rahasia | Game peran tersembunyi |
| Timer, giliran, dan papan skor | Hampir semua game |
| Narator teks dan suara | Game dengan moderator otomatis |
| Penyimpanan skor tertinggi dan riwayat lokal | Game solo dan kompetitif |
| Layar hasil dan tombol main lagi | Semua game |
| Paket konten (kata, soal, kartu) | Game berbasis konten |

**Fitur katalog ala portal game**

- Beranda dengan game populer, baru, dan rekomendasi "mirip dengan yang kamu mainkan".
- Kategori dan tag: party, solo, dua pemain, kuis, puzzle, arcade, edukasi.
- Filter menurut jumlah pemain, durasi, dan tingkat kesulitan.
- Pencarian nama game.
- Favorit dan "terakhir dimainkan", tersimpan lokal tanpa akun.
- Halaman detail game: deskripsi, aturan singkat, jumlah pemain, durasi, tangkapan layar.

**Integrasi game pihak ketiga (tahap lanjut):** game HTML5 dari pengembang lain dimuat dalam iframe terisolasi dan berkomunikasi lewat SDK platform kecil (mulai game, kirim skor, selesai). Ini membuka katalog besar ala Friv tanpa platform harus menulis semua game sendiri. Perlu kebijakan konten dan lisensi sebelum dibuka (lihat risiko).

## 6. Kebutuhan UX, Non-Fungsional, dan Teknis

**UX**

- Mobile first: target utama HP layar 360-430 px, dipakai satu tangan. Laptop dan tablet didukung sebagai layar tambahan.
- Satu aksi utama per layar, tombol besar (minimal 48 px), teks mudah dibaca dari jarak lengan.
- Tema berbeda per game (misalnya detektif untuk Impostor, hutan malam untuk Werewolf) dengan animasi kartu dan transisi fase yang ringan.
- Layar transisi "Serahkan ke {nama}" selalu muncul antar pemain agar rahasia tidak terlihat.
- Aksesibilitas: kontras tinggi, ukuran teks bisa diperbesar, tidak bergantung pada warna saja, narasi teks selalu ada walau suara mati.
- Pencegahan layar mati (Wake Lock) selama game berjalan.

**Non-fungsional**

| Aspek | Target |
| --- | --- |
| Performa | Halaman pertama termuat < 2 detik di 4G, ukuran awal < 300 KB |
| Offline | Bisa dimainkan tanpa internet setelah kunjungan pertama (PWA) |
| Privasi | Tanpa akun, tanpa pelacakan data pribadi, nama pemain tidak dikirim ke server |
| Kompatibilitas | Chrome, Safari, Firefox, Samsung Internet versi 2 tahun terakhir |
| Ketahanan | Refresh atau tab tertutup tidak menghilangkan sesi aktif |
| Keamanan | Kata dan peran tidak muncul di URL, tidak tersimpan dalam teks polos yang mudah diintip lewat tampilan publik |
| Skalabilitas konten | Penambahan game atau kategori kata tidak butuh perubahan inti |

**Usulan teknis (bisa diganti sesuai tim)**

| Komponen | Usulan | Alasan |
| --- | --- | --- |
| Framework | Next.js atau Vite dengan React dan TypeScript | Ekosistem luas, komponen modular |
| State game | State machine (misalnya XState) | Fase dan aturan Werewolf jelas dan mudah diuji |
| Penyimpanan | localStorage atau IndexedDB | Tanpa server untuk mode satu perangkat |
| Styling | Tailwind CSS dengan token tema per game | Cepat dan konsisten |
| Suara | Web Speech API, dengan rekaman sebagai cadangan | Narator tanpa biaya server |
| Offline | Service worker (PWA) | Tetap jalan tanpa sinyal |
| Hosting | Vercel atau Cloudflare Pages | Statis, murah, cepat |
| Analitik | Penghitung anonim tanpa cookie | Mengukur metrik tanpa melanggar privasi |

**Tahap lanjutan (mode online):** tiap pemain memakai HP sendiri lewat kode ruangan. Membutuhkan server realtime (WebSocket atau layanan seperti Supabase Realtime), sehingga state rahasia dipindah ke server agar pemain tidak bisa mengintip. Mesin game yang berupa logika murni di lapisan arsitektur tetap bisa dipakai ulang.

## 7. Roadmap

Estimasi durasi bersifat perkiraan awal untuk satu sampai dua pengembang dan perlu disesuaikan dengan kapasitas tim.

| Fase | Isi | Syarat selesai | Estimasi |
| --- | --- | --- | --- |
| 0. Fondasi | Inti platform, katalog, setup sesi, kartu reveal, tema, PWA | Kartu reveal bisa dipakai 3-20 pemain tanpa bocor | 3-4 minggu |
| 1. Guess the Impostor (MVP) | Game lengkap, 10 kategori, timer, voting, hasil | 10 sesi uji coba dengan kelompok nyata selesai tanpa kendala besar | 3 minggu |
| 2. Werewolf (MVP) | Peran dasar (Werewolf, Villager, Seer, Doctor, Hunter), narator, loop malam-siang, pengaturan host | Satu game penuh 8 pemain berjalan tanpa moderator manusia | 5-6 minggu |
| 3. Peningkatan | Narasi suara, peran Witch dan Cupid, kategori kustom, bahasa Inggris, statistik lokal | Metrik 3 bulan di bagian 1 mulai terukur | 4 minggu |
| 4. Mode online | Kode ruangan, state di server, pemain memakai HP sendiri | 20 pemain dalam satu ruangan stabil | 6-8 minggu |
| 5. Katalog diperluas | Game baru lewat kontrak modul | Game baru ditambah tanpa mengubah inti | Berkelanjutan |
| 6. Ekosistem pihak ketiga | SDK platform, iframe terisolasi, alur review dan publikasi game dari pengembang lain | Satu game pihak ketiga tayang lewat alur review tanpa perubahan inti | 6-8 minggu |

**Ide game berikutnya** (cocok dengan pola reveal dan moderator otomatis)

- Spyfall: semua tahu lokasi kecuali satu mata-mata.
- Mafia dan variasi Among Us versi tatap muka.
- Charades dan tebak kata dengan kartu otomatis dan timer.
- Truth or Dare dengan kategori tingkat keberanian.
- The Resistance atau Avalon: misi tim dengan voting rahasia.
- Kuis cepat antar tim dengan skor otomatis.

**Di luar cakupan versi pertama:** akun pengguna, chat suara atau video di dalam website, monetisasi, dan moderasi konten buatan pengguna.

## 8. Risiko dan Pertanyaan Terbuka

**Risiko**

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Pemain mengintip kartu orang lain saat perangkat dioper | Rahasia bocor, game tidak seru | Layar transisi wajib, kartu auto-tutup, kartu tidak terlihat dari samping dengan ukuran teks yang pas |
| Alur malam Werewolf terasa lambat di satu perangkat | Pemain bosan | Alur ringkas, peran yang sudah mati dipanggil dengan jeda singkat, opsi mode cepat |
| Daftar kata terasa itu-itu saja | Retensi turun | Kategori kustom, penambahan paket kata berkala, sistem anti-ulang |
| Pemain menutup tab di tengah game | Sesi hilang | Simpan state otomatis dan tawarkan lanjutkan sesi |
| Aturan Werewolf berbeda antar kelompok | Debat aturan, pengalaman buruk | Pengaturan host yang jelas dan penjelasan aturan di dalam game |
| Lingkup meluas terlalu cepat | Rilis molor | Patuhi roadmap, MVP hanya dua game |
| Game pihak ketiga bermasalah (lisensi, konten tidak pantas, iklan berlebihan) | Risiko hukum dan reputasi platform | Buka hanya setelah ada kebijakan lisensi, proses review sebelum tayang, dan iframe terisolasi |

**Pertanyaan terbuka untuk Anda**

- [ ] Apakah target pemain hanya satu perangkat, atau mode online (tiap orang HP sendiri) ingin ikut sejak awal?
- [ ] Bahasa utama kata dan narasi: Indonesia saja, atau dwibahasa sejak awal?
- [ ] Pada Guess the Impostor, impostor sebaiknya tidak tahu kata sama sekali, atau mendapat kata mirip? Atau dibuat pilihan host?
- [ ] Peran Werewolf apa saja yang wajib ada di rilis pertama selain lima peran dasar?
- [ ] Apakah suara narator (text-to-speech) penting sejak MVP, atau cukup teks?
- [ ] Apakah website akan memakai monetisasi (iklan atau premium) di masa depan, sehingga perlu disiapkan sejak desain?
- [ ] Nama dan identitas visual produk: sudah ada, atau perlu dibuat?
