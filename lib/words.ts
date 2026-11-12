import type { WordCategory } from "./types";

function word(id: string, idWord: string, enWord: string, idLook: string, enLook: string) {
  return {
    id,
    word: { id: idWord, en: enWord },
    lookalike: { id: idLook, en: enLook },
  };
}

/**
 * Built-in word bank. Add words or whole categories here: the setup picker,
 * the word bank page, and the game engine all read this list.
 */
export const WORD_CATEGORIES: WordCategory[] = [
  {
    id: "makanan",
    name: { id: "Makanan", en: "Food" },
    icon: "i-sparkle",
    words: [
      word("makanan-1", "Bakso", "Meatball soup", "Mi ayam", "Chicken noodles"),
      word("makanan-2", "Nasi goreng", "Fried rice", "Nasi uduk", "Coconut rice"),
      word("makanan-3", "Sate ayam", "Chicken satay", "Tongseng", "Sweet-spicy stew"),
      word("makanan-4", "Rendang", "Beef rendang", "Semur", "Braised beef"),
      word("makanan-5", "Soto", "Soto soup", "Rawon", "Black beef soup"),
      word("makanan-6", "Gado-gado", "Peanut salad", "Karedok", "Raw vegetable salad"),
      word("makanan-7", "Martabak", "Stuffed pancake", "Terang bulan", "Sweet pancake"),
      word("makanan-8", "Pisang goreng", "Fried banana", "Bakwan", "Vegetable fritter"),
      word("makanan-9", "Es teh", "Iced tea", "Es jeruk", "Iced orange"),
      word("makanan-10", "Kerupuk", "Crackers", "Keripik", "Chips"),
    ],
  },
  {
    id: "hewan",
    name: { id: "Hewan", en: "Animals" },
    icon: "i-paw",
    words: [
      word("hewan-1", "Kucing", "Cat", "Anjing", "Dog"),
      word("hewan-2", "Gajah", "Elephant", "Badak", "Rhino"),
      word("hewan-3", "Harimau", "Tiger", "Macan tutul", "Leopard"),
      word("hewan-4", "Burung merpati", "Pigeon", "Burung gereja", "Sparrow"),
      word("hewan-5", "Ikan hiu", "Shark", "Ikan paus", "Whale"),
      word("hewan-6", "Kadal", "Lizard", "Cicak", "Gecko"),
      word("hewan-7", "Kupu-kupu", "Butterfly", "Capung", "Dragonfly"),
      word("hewan-8", "Monyet", "Monkey", "Kera", "Ape"),
      word("hewan-9", "Kambing", "Goat", "Domba", "Sheep"),
      word("hewan-10", "Ayam", "Chicken", "Bebek", "Duck"),
    ],
  },
  {
    id: "tempat",
    name: { id: "Tempat", en: "Places" },
    icon: "i-home",
    words: [
      word("tempat-1", "Pantai", "Beach", "Danau", "Lake"),
      word("tempat-2", "Bandara", "Airport", "Stasiun", "Train station"),
      word("tempat-3", "Pasar", "Market", "Mal", "Mall"),
      word("tempat-4", "Rumah sakit", "Hospital", "Puskesmas", "Clinic"),
      word("tempat-5", "Sekolah", "School", "Kampus", "Campus"),
      word("tempat-6", "Gunung", "Mountain", "Bukit", "Hill"),
      word("tempat-7", "Museum", "Museum", "Galeri", "Gallery"),
      word("tempat-8", "Masjid", "Mosque", "Gereja", "Church"),
      word("tempat-9", "Kebun binatang", "Zoo", "Taman safari", "Safari park"),
      word("tempat-10", "Perpustakaan", "Library", "Toko buku", "Bookstore"),
    ],
  },
  {
    id: "profesi",
    name: { id: "Profesi", en: "Professions" },
    icon: "i-user",
    words: [
      word("profesi-1", "Dokter", "Doctor", "Perawat", "Nurse"),
      word("profesi-2", "Guru", "Teacher", "Dosen", "Lecturer"),
      word("profesi-3", "Polisi", "Police officer", "Tentara", "Soldier"),
      word("profesi-4", "Pilot", "Pilot", "Pramugara", "Flight attendant"),
      word("profesi-5", "Koki", "Chef", "Barista", "Barista"),
      word("profesi-6", "Petani", "Farmer", "Nelayan", "Fisherman"),
      word("profesi-7", "Pemadam kebakaran", "Firefighter", "Satpam", "Security guard"),
      word("profesi-8", "Programmer", "Programmer", "Desainer", "Designer"),
      word("profesi-9", "Penyanyi", "Singer", "Aktor", "Actor"),
      word("profesi-10", "Tukang ojek", "Motorcycle taxi driver", "Kurir", "Courier"),
    ],
  },
  {
    id: "film",
    name: { id: "Film dan Serial", en: "Film & Series" },
    icon: "i-play",
    words: [
      word("film-1", "Harry Potter", "Harry Potter", "Percy Jackson", "Percy Jackson"),
      word("film-2", "Avengers", "Avengers", "Justice League", "Justice League"),
      word("film-3", "SpongeBob", "SpongeBob", "Patrick Star", "Patrick Star"),
      word("film-4", "Doraemon", "Doraemon", "Nobita", "Nobita"),
      word("film-5", "Squid Game", "Squid Game", "Alice in Borderland", "Alice in Borderland"),
      word("film-6", "Frozen", "Frozen", "Moana", "Moana"),
      word("film-7", "Batman", "Batman", "Superman", "Superman"),
      word("film-8", "Upin Ipin", "Upin Ipin", "Boboiboy", "BoBoiBoy"),
      word("film-9", "Stranger Things", "Stranger Things", "Dark", "Dark"),
      word("film-10", "The Lion King", "The Lion King", "Madagascar", "Madagascar"),
    ],
  },
  {
    id: "olahraga",
    name: { id: "Olahraga", en: "Sports" },
    icon: "i-trophy",
    words: [
      word("olahraga-1", "Sepak bola", "Football", "Futsal", "Futsal"),
      word("olahraga-2", "Bulu tangkis", "Badminton", "Tenis meja", "Table tennis"),
      word("olahraga-3", "Basket", "Basketball", "Voli", "Volleyball"),
      word("olahraga-4", "Renang", "Swimming", "Menyelam", "Diving"),
      word("olahraga-5", "Lari maraton", "Marathon", "Sprint", "Sprint"),
      word("olahraga-6", "Tinju", "Boxing", "Muay Thai", "Muay Thai"),
      word("olahraga-7", "Panahan", "Archery", "Menembak", "Shooting"),
      word("olahraga-8", "Bersepeda", "Cycling", "Motorcross", "Motocross"),
      word("olahraga-9", "Golf", "Golf", "Mini golf", "Mini golf"),
      word("olahraga-10", "Angkat besi", "Weightlifting", "Binaraga", "Bodybuilding"),
    ],
  },
  {
    id: "benda",
    name: { id: "Benda Sehari-hari", en: "Everyday Objects" },
    icon: "i-key",
    words: [
      word("benda-1", "Sikat gigi", "Toothbrush", "Sisir", "Comb"),
      word("benda-2", "Payung", "Umbrella", "Jas hujan", "Raincoat"),
      word("benda-3", "Dompet", "Wallet", "Tas", "Bag"),
      word("benda-4", "Kunci", "Key", "Gembok", "Padlock"),
      word("benda-5", "Sapu", "Broom", "Pel", "Mop"),
      word("benda-6", "Cermin", "Mirror", "Jendela", "Window"),
      word("benda-7", "Sendok", "Spoon", "Garpu", "Fork"),
      word("benda-8", "Sepatu", "Shoes", "Sandal", "Sandals"),
      word("benda-9", "Charger", "Charger", "Power bank", "Power bank"),
      word("benda-10", "Jam tangan", "Wristwatch", "Jam dinding", "Wall clock"),
    ],
  },
  {
    id: "tokoh",
    name: { id: "Tokoh Umum", en: "Public Figures" },
    icon: "i-star",
    words: [
      word("tokoh-1", "Soekarno", "Sukarno", "Mohammad Hatta", "Mohammad Hatta"),
      word("tokoh-2", "Jokowi", "Jokowi", "Prabowo", "Prabowo"),
      word("tokoh-3", "Albert Einstein", "Albert Einstein", "Isaac Newton", "Isaac Newton"),
      word("tokoh-4", "Lionel Messi", "Lionel Messi", "Cristiano Ronaldo", "Cristiano Ronaldo"),
      word("tokoh-5", "Taylor Swift", "Taylor Swift", "Billie Eilish", "Billie Eilish"),
      word("tokoh-6", "B.J. Habibie", "B.J. Habibie", "Soeharto", "Suharto"),
      word("tokoh-7", "Elon Musk", "Elon Musk", "Jeff Bezos", "Jeff Bezos"),
      word("tokoh-8", "Neymar", "Neymar", "Kylian Mbappe", "Kylian Mbappe"),
      word("tokoh-9", "R.A. Kartini", "R.A. Kartini", "Cut Nyak Dhien", "Cut Nyak Dhien"),
      word("tokoh-10", "Michael Jackson", "Michael Jackson", "Prince", "Prince"),
    ],
  },
  {
    id: "kota",
    name: { id: "Kota Indonesia", en: "Indonesian Cities" },
    icon: "i-mask",
    words: [
      word("kota-1", "Jakarta", "Jakarta", "Bandung", "Bandung"),
      word("kota-2", "Surabaya", "Surabaya", "Semarang", "Semarang"),
      word("kota-3", "Yogyakarta", "Yogyakarta", "Solo", "Solo"),
      word("kota-4", "Medan", "Medan", "Palembang", "Palembang"),
      word("kota-5", "Makassar", "Makassar", "Manado", "Manado"),
      word("kota-6", "Denpasar", "Denpasar", "Mataram", "Mataram"),
      word("kota-7", "Balikpapan", "Balikpapan", "Samarinda", "Samarinda"),
      word("kota-8", "Pontianak", "Pontianak", "Banjarmasin", "Banjarmasin"),
      word("kota-9", "Malang", "Malang", "Batu", "Batu"),
      word("kota-10", "Padang", "Padang", "Bukittinggi", "Bukittinggi"),
    ],
  },
  {
    id: "alam",
    name: { id: "Alam", en: "Nature" },
    icon: "i-sun",
    words: [
      word("alam-1", "Pelangi", "Rainbow", "Fatamorgana", "Mirage"),
      word("alam-2", "Gunung berapi", "Volcano", "Air terjun", "Waterfall"),
      word("alam-3", "Hujan", "Rain", "Gerimis", "Drizzle"),
      word("alam-4", "Salju", "Snow", "Es", "Ice"),
      word("alam-5", "Petir", "Lightning", "Kilat", "Flash"),
      word("alam-6", "Hutan", "Forest", "Rimba", "Jungle"),
      word("alam-7", "Sungai", "River", "Selokan", "Drain"),
      word("alam-8", "Bintang", "Star", "Planet", "Planet"),
      word("alam-9", "Ombak", "Wave", "Arus", "Current"),
      word("alam-10", "Kabut", "Fog", "Asap", "Smoke"),
    ],
  },
];

export function getCategory(id: string) {
  return WORD_CATEGORIES.find((category) => category.id === id);
}

export function categoryName(id: string) {
  return getCategory(id)?.name ?? { id, en: id };
}
