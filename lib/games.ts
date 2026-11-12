import type { GameMeta } from "./types";

/**
 * Game registry. Live games have real client-side engines in lib/game/*.
 * "Soon" entries are catalog-only and intentionally have no play route.
 * Adding a game later means adding metadata here plus an engine + play view.
 */
export const GAMES: GameMeta[] = [
  {
    slug: "impostor",
    name: { id: "Guess the Impostor", en: "Guess the Impostor" },
    short: {
      id: "Semua dapat kata rahasia, kecuali tim jahat. Temukan mereka.",
      en: "Everyone gets a secret word except the evil team. Find them.",
    },
    description: {
      id: "Satu HP diedarkan. Warga melihat kata rahasia yang sama, Impostor tidak melihat apa pun. Beri petunjuk, debat, lalu voting siapa yang paling mencurigakan.",
      en: "One phone is passed around. Citizens see the same secret word, the Impostor sees nothing. Give clues, debate, then vote for the most suspicious player.",
    },
    icon: "i-mask",
    media: "default",
    art: "/art/games/impostor.svg",
    tags: ["party"],
    minPlayers: 3,
    maxPlayers: 20,
    minutes: 15,
    level: "easy",
    status: "live",
    featured: true,
    isNew: true,
    steps: [
      {
        title: { id: "Bagi kartu", en: "Deal the cards" },
        text: {
          id: "Edarkan HP. Tahan kartu untuk melihat kata, lalu tutup.",
          en: "Pass the phone. Hold the card to see your word, then close it.",
        },
      },
      {
        title: { id: "Petunjuk", en: "Clues" },
        text: {
          id: "Bergiliran sebut satu petunjuk lisan tentang kata itu.",
          en: "Take turns saying one spoken clue about the word.",
        },
      },
      {
        title: { id: "Diskusi", en: "Discussion" },
        text: {
          id: "Debat sampai timer habis, lalu mulai voting.",
          en: "Debate until the timer ends, then start voting.",
        },
      },
      {
        title: { id: "Voting rahasia", en: "Secret voting" },
        text: {
          id: "HP dioper lagi. Tiap pemain memilih tersangka tanpa dilihat yang lain.",
          en: "Pass the phone again. Each player picks a suspect in private.",
        },
      },
      {
        title: { id: "Eliminasi", en: "Elimination" },
        text: {
          id: "Suara terbanyak tersingkir dan perannya dibuka. Ulangi sampai satu tim menang.",
          en: "The top vote is eliminated and their role is revealed. Repeat until one team wins.",
        },
      },
    ],
    roles: [
      {
        name: { id: "Warga", en: "Citizen" },
        team: "citizen",
        icon: "i-users",
        text: {
          id: "Melihat kategori dan kata rahasia yang sama.",
          en: "Sees the same category and secret word as every citizen.",
        },
      },
      {
        name: { id: "Chameleon", en: "Chameleon" },
        team: "evil",
        icon: "i-eye",
        text: {
          id: "Dapat kata mirip tapi berbeda. Kartunya tampak seperti warga, jadi ia tidak tahu dirinya Chameleon.",
          en: "Gets a similar but different word. Their card looks like a citizen's, so they never know they are the Chameleon.",
        },
        optional: true,
      },
      {
        name: { id: "Impostor", en: "Impostor" },
        team: "evil",
        icon: "i-mask",
        text: {
          id: "Hanya melihat \"Kamu Impostor\", tanpa kata dan tanpa kategori. Bila tertangkap, boleh menebak kata.",
          en: "Only sees \"You are the Impostor\", with no word and no category. If caught, they may guess the word.",
        },
      },
    ],
    rules: [
      {
        id: "Warga menang bila semua Impostor dan Chameleon tersingkir.",
        en: "Citizens win when every Impostor and Chameleon is eliminated.",
      },
      {
        id: "Tim jahat menang bila jumlahnya menyamai warga, atau Impostor menebak kata dengan benar.",
        en: "The evil team wins when they match the citizens, or an Impostor guesses the word correctly.",
      },
      {
        id: "Petunjuk terlalu jelas membantu Impostor menebak kata.",
        en: "Clues that are too obvious help the Impostor guess the word.",
      },
    ],
  },
  {
    slug: "werewolf",
    name: { id: "Werewolf", en: "Werewolf" },
    short: {
      id: "Desa vs serigala. HP ini jadi moderatornya.",
      en: "Village versus wolves. This phone is the moderator.",
    },
    description: {
      id: "Malam tiba dan Werewolf memilih korban. Siang hari desa berdebat dan voting. Peran rahasia dibagikan lewat satu HP, dengan narasi yang menjaga urutan malam tetap aman.",
      en: "Night falls and the Werewolves pick a victim. By day the village debates and votes. Secret roles are dealt on one phone, with narration that keeps the night order safe.",
    },
    icon: "i-moon",
    media: "night",
    art: "/art/games/werewolf.svg",
    tags: ["party"],
    minPlayers: 5,
    maxPlayers: 20,
    minutes: 30,
    level: "medium",
    status: "live",
    featured: true,
    steps: [
      {
        title: { id: "Bagi peran", en: "Deal the roles" },
        text: {
          id: "Tiap pemain menahan kartu untuk melihat perannya sendiri.",
          en: "Each player holds the card to see their own role.",
        },
      },
      {
        title: { id: "Malam", en: "Night" },
        text: {
          id: "Werewolf memilih korban, Doctor melindungi, Seer memeriksa.",
          en: "Werewolves pick a victim, the Doctor protects, the Seer checks.",
        },
      },
      {
        title: { id: "Pagi", en: "Morning" },
        text: {
          id: "Semua membuka mata. Korban semalam diumumkan.",
          en: "Everyone opens their eyes. Last night's victim is announced.",
        },
      },
      {
        title: { id: "Diskusi dan voting", en: "Discussion and vote" },
        text: {
          id: "Desa berdebat, lalu memilih siapa yang dieksekusi.",
          en: "The village debates, then votes on who to execute.",
        },
      },
      {
        title: { id: "Menang", en: "Win" },
        text: {
          id: "Desa menang bila semua Werewolf mati. Werewolf menang bila jumlahnya menyamai warga.",
          en: "The village wins when every Werewolf is dead. Werewolves win when they match the villagers.",
        },
      },
    ],
    roles: [
      {
        name: { id: "Werewolf", en: "Werewolf" },
        team: "wolf",
        icon: "i-paw",
        text: {
          id: "Setiap malam memilih satu korban bersama kawanan.",
          en: "Each night, choose one victim together with the pack.",
        },
      },
      {
        name: { id: "Villager", en: "Villager" },
        team: "village",
        icon: "i-users",
        text: {
          id: "Tidak punya aksi malam. Debat dan voting di siang hari.",
          en: "No night action. Debate and vote during the day.",
        },
      },
      {
        name: { id: "Seer", en: "Seer" },
        team: "village",
        icon: "i-eye",
        text: {
          id: "Setiap malam memeriksa satu pemain, melihat apakah ia Werewolf.",
          en: "Each night, check one player and learn whether they are a Werewolf.",
        },
      },
      {
        name: { id: "Doctor", en: "Doctor" },
        team: "village",
        icon: "i-check-circle",
        text: {
          id: "Setiap malam melindungi satu pemain dari serangan Werewolf.",
          en: "Each night, protect one player from the Werewolf attack.",
        },
      },
      {
        name: { id: "Hunter", en: "Hunter" },
        team: "village",
        icon: "i-bolt",
        text: {
          id: "Bila mati, langsung menembak satu pemain pilihannya.",
          en: "When they die, they immediately shoot one player of their choice.",
        },
        optional: true,
      },
    ],
    rules: [
      {
        id: "Desa menang bila semua Werewolf mati.",
        en: "The village wins when every Werewolf is dead.",
      },
      {
        id: "Werewolf menang bila jumlahnya sama dengan atau lebih dari warga yang hidup.",
        en: "Werewolves win when their number equals or exceeds the living villagers.",
      },
      {
        id: "Doctor tidak boleh melindungi orang yang sama dua malam berturut-turut.",
        en: "The Doctor cannot protect the same person two nights in a row.",
      },
      {
        id: "Bila voting seri, tidak ada eksekusi atau voting ulang sesuai pengaturan.",
        en: "On a tied vote, either nobody is executed or the village revotes, depending on the settings.",
      },
    ],
  },
  {
    slug: "spyfall",
    name: { id: "Spyfall", en: "Spyfall" },
    short: {
      id: "Semua tahu lokasi, kecuali mata-mata.",
      en: "Everyone knows the location except the spy.",
    },
    description: {
      id: "Satu pemain tidak tahu lokasi. Ajukan pertanyaan, cari jawaban yang janggal, dan temukan mata-mata sebelum ia menebak lokasinya.",
      en: "One player does not know the location. Ask questions, spot the odd answer, and find the spy before they guess the location.",
    },
    icon: "i-eye",
    media: "grape",
    art: "/art/games/spyfall.svg",
    tags: ["party"],
    minPlayers: 3,
    maxPlayers: 12,
    minutes: 15,
    level: "medium",
    status: "soon",
    steps: [
      {
        title: { id: "Bagi lokasi", en: "Deal the location" },
        text: {
          id: "Semua melihat lokasi rahasia, kecuali satu mata-mata.",
          en: "Everyone sees a secret location except one spy.",
        },
      },
      {
        title: { id: "Tanya jawab", en: "Questions" },
        text: {
          id: "Ajukan pertanyaan rumit dan cari jawaban yang aneh.",
          en: "Ask tricky questions and look for strange answers.",
        },
      },
    ],
    roles: [],
    rules: [],
  },
  {
    slug: "tebak-gaya",
    name: { id: "Tebak Gaya", en: "Charades" },
    short: {
      id: "Peragakan kata tanpa bicara. Tim lain menebak.",
      en: "Act out a word without speaking. The other team guesses.",
    },
    description: {
      id: "Peragakan kata tanpa suara. Tim lain menebak secepat mungkin sebelum waktu habis.",
      en: "Act out words silently. The other team guesses as fast as they can before time runs out.",
    },
    icon: "i-sparkle",
    media: "sun",
    art: "/art/games/tebak-gaya.svg",
    tags: ["party", "kuis"],
    minPlayers: 4,
    maxPlayers: 20,
    minutes: 15,
    level: "easy",
    status: "soon",
    steps: [],
    roles: [],
    rules: [],
  },
  {
    slug: "kuis-tim",
    name: { id: "Kuis Tim", en: "Team Quiz" },
    short: {
      id: "Soal cepat antar tim dengan skor otomatis.",
      en: "Fast questions between teams with automatic scoring.",
    },
    description: {
      id: "Dua tim atau lebih menjawab soal cepat. Skor dihitung otomatis dan pemenang langsung terlihat.",
      en: "Two or more teams answer quick questions. Scores are automatic and the winner is clear.",
    },
    icon: "i-help",
    media: "default",
    art: "/art/games/kuis-tim.svg",
    tags: ["kuis"],
    minPlayers: 4,
    maxPlayers: 20,
    minutes: 20,
    level: "medium",
    status: "soon",
    steps: [],
    roles: [],
    rules: [],
  },
  {
    slug: "jujur-berani",
    name: { id: "Jujur atau Berani", en: "Truth or Dare" },
    short: {
      id: "Pilih tingkat keberanian, HP yang mengundi.",
      en: "Pick your courage level, the phone draws the card.",
    },
    description: {
      id: "Pilih jujur atau berani. HP mengundi pertanyaan dan tantangan yang sesuai dengan tingkat keberanian kelompok.",
      en: "Choose truth or dare. The phone draws questions and challenges that match the group's courage level.",
    },
    icon: "i-flame",
    media: "sun",
    art: "/art/games/jujur-berani.svg",
    tags: ["party"],
    minPlayers: 3,
    maxPlayers: 12,
    minutes: 20,
    level: "easy",
    status: "soon",
    steps: [],
    roles: [],
    rules: [],
  },
  {
    slug: "misi-rahasia",
    name: { id: "Misi Rahasia", en: "Secret Mission" },
    short: {
      id: "Tim misi dan penyusup. Voting rahasia tiap ronde.",
      en: "Mission team versus saboteurs. Secret votes every round.",
    },
    description: {
      id: "Tim misi berusaha menyelesaikan misi, penyusup berusaha menggagalkannya. Voting rahasia menentukan siapa yang dikeluarkan.",
      en: "A mission team tries to complete missions while saboteurs try to fail them. Secret votes decide who gets removed.",
    },
    icon: "i-key",
    media: "night",
    art: "/art/games/misi-rahasia.svg",
    tags: ["party"],
    minPlayers: 5,
    maxPlayers: 10,
    minutes: 30,
    level: "hard",
    status: "soon",
    steps: [],
    roles: [],
    rules: [],
  },
  {
    slug: "tebak-kata-kilat",
    name: { id: "Tebak Kata Kilat", en: "Speed Words" },
    short: {
      id: "Satu menit, sebanyak mungkin kata.",
      en: "One minute, as many words as you can.",
    },
    description: {
      id: "Satu pemain menjelaskan, tim menebak. Sebanyak mungkin kata dalam satu menit.",
      en: "One player explains while the team guesses. As many words as possible in one minute.",
    },
    icon: "i-bolt",
    media: "leaf",
    art: "/art/games/tebak-kata-kilat.svg",
    tags: ["kuis"],
    minPlayers: 4,
    maxPlayers: 16,
    minutes: 10,
    level: "easy",
    status: "soon",
    steps: [],
    roles: [],
    rules: [],
  },
  {
    slug: "kartu-memori",
    name: { id: "Kartu Memori", en: "Memory Cards" },
    short: {
      id: "Buka dua kartu, cari pasangannya.",
      en: "Flip two cards, find the pair.",
    },
    description: {
      id: "Latih ingatan dengan membuka dua kartu setiap giliran. Cocokkan semua pasangan sebelum langkah habis.",
      en: "Train your memory by flipping two cards each turn. Match every pair before you run out of moves.",
    },
    icon: "i-dice",
    media: "default",
    art: "/art/games/kartu-memori.svg",
    tags: ["solo", "puzzle"],
    minPlayers: 1,
    maxPlayers: 1,
    minutes: 5,
    level: "easy",
    status: "soon",
    steps: [],
    roles: [],
    rules: [],
  },
  {
    slug: "tangkas",
    name: { id: "Tangkas", en: "Quick Tap" },
    short: {
      id: "Ketuk secepat kilat sebelum waktu habis.",
      en: "Tap fast before time runs out.",
    },
    description: {
      id: "Ketuk target yang muncul secepat mungkin. Reaksi dan ketepatan menentukan skor.",
      en: "Tap the targets as fast as they appear. Reaction and accuracy set your score.",
    },
    icon: "i-bolt",
    media: "grape",
    art: "/art/games/tangkas.svg",
    tags: ["solo", "arcade"],
    minPlayers: 1,
    maxPlayers: 1,
    minutes: 3,
    level: "easy",
    status: "soon",
    steps: [],
    roles: [],
    rules: [],
  },
  {
    slug: "tiga-sebaris",
    name: { id: "Tiga Sebaris", en: "Tic-Tac-Toe" },
    short: {
      id: "Klasik dua pemain di satu layar.",
      en: "The classic two-player game on one screen.",
    },
    description: {
      id: "Bergiliran menandai kotak. Baris pertama yang lengkap menang.",
      en: "Take turns marking squares. The first complete line wins.",
    },
    icon: "i-close",
    media: "leaf",
    art: "/art/games/tiga-sebaris.svg",
    tags: ["duo", "puzzle"],
    minPlayers: 2,
    maxPlayers: 2,
    minutes: 5,
    level: "easy",
    status: "soon",
    steps: [],
    roles: [],
    rules: [],
  },
  {
    slug: "catur",
    name: { id: "Catur", en: "Chess" },
    short: {
      id: "Berhadapan di satu layar, giliran otomatis.",
      en: "Head to head on one screen, turns automatic.",
    },
    description: {
      id: "Catur lengkap untuk dua pemain di satu perangkat. Giliran dan bidak ilegal dicegah otomatis.",
      en: "Full chess for two players on one device. Turns and illegal moves are handled automatically.",
    },
    icon: "i-trophy",
    media: "sun",
    art: "/art/games/catur.svg",
    tags: ["duo"],
    minPlayers: 2,
    maxPlayers: 2,
    minutes: 30,
    level: "hard",
    status: "soon",
    steps: [],
    roles: [],
    rules: [],
  },
];

export const LIVE_GAMES = GAMES.filter((game) => game.status === "live");

export function getGame(slug: string): GameMeta | undefined {
  return GAMES.find((game) => game.slug === slug);
}

export function similarGames(slug: string, count = 4): GameMeta[] {
  const game = getGame(slug);
  if (!game) return GAMES.slice(0, count);
  return GAMES.filter((other) => other.slug !== slug)
    .sort((a, b) => {
      const overlapA = a.tags.filter((tag) => game.tags.includes(tag)).length;
      const overlapB = b.tags.filter((tag) => game.tags.includes(tag)).length;
      return overlapB - overlapA;
    })
    .slice(0, count);
}
