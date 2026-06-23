export interface WordPair {
  en: string;
  id: string;
}

export interface Level {
  level: number;
  title: string;
  emoji: string;
  pairs: WordPair[];
}

export const vocabularyData: Level[] = [
  {
    level: 1,
    title: "Basic Greetings",
    emoji: "👋",
    pairs: [
      { en: "Hello", id: "Halo" },
      { en: "Good morning", id: "Selamat pagi" },
      { en: "Good night", id: "Selamat malam" },
      { en: "Thank you", id: "Terima kasih" },
      { en: "Please", id: "Tolong" },
      { en: "Sorry", id: "Maaf" },
    ],
  },
  {
    level: 2,
    title: "Animals",
    emoji: "🐾",
    pairs: [
      { en: "Cat", id: "Kucing" },
      { en: "Dog", id: "Anjing" },
      { en: "Bird", id: "Burung" },
      { en: "Fish", id: "Ikan" },
      { en: "Rabbit", id: "Kelinci" },
      { en: "Elephant", id: "Gajah" },
    ],
  },
  {
    level: 3,
    title: "Colors",
    emoji: "🎨",
    pairs: [
      { en: "Red", id: "Merah" },
      { en: "Blue", id: "Biru" },
      { en: "Green", id: "Hijau" },
      { en: "Yellow", id: "Kuning" },
      { en: "White", id: "Putih" },
      { en: "Black", id: "Hitam" },
    ],
  },
  {
    level: 4,
    title: "Numbers",
    emoji: "🔢",
    pairs: [
      { en: "One", id: "Satu" },
      { en: "Two", id: "Dua" },
      { en: "Three", id: "Tiga" },
      { en: "Four", id: "Empat" },
      { en: "Five", id: "Lima" },
      { en: "Ten", id: "Sepuluh" },
    ],
  },
  {
    level: 5,
    title: "Food & Drink",
    emoji: "🍜",
    pairs: [
      { en: "Water", id: "Air" },
      { en: "Rice", id: "Nasi" },
      { en: "Chicken", id: "Ayam" },
      { en: "Egg", id: "Telur" },
      { en: "Fruit", id: "Buah" },
      { en: "Vegetables", id: "Sayuran" },
    ],
  },
  {
    level: 6,
    title: "Family",
    emoji: "👨‍👩‍👧‍👦",
    pairs: [
      { en: "Mother", id: "Ibu" },
      { en: "Father", id: "Ayah" },
      { en: "Sister", id: "Kakak perempuan" },
      { en: "Brother", id: "Kakak laki-laki" },
      { en: "Child", id: "Anak" },
      { en: "Friend", id: "Teman" },
    ],
  },
  {
    level: 7,
    title: "Places",
    emoji: "🗺️",
    pairs: [
      { en: "School", id: "Sekolah" },
      { en: "Hospital", id: "Rumah sakit" },
      { en: "Market", id: "Pasar" },
      { en: "Beach", id: "Pantai" },
      { en: "Mountain", id: "Gunung" },
      { en: "Home", id: "Rumah" },
    ],
  },
  {
    level: 8,
    title: "Daily Actions",
    emoji: "⚡",
    pairs: [
      { en: "Eat", id: "Makan" },
      { en: "Sleep", id: "Tidur" },
      { en: "Walk", id: "Jalan" },
      { en: "Read", id: "Baca" },
      { en: "Write", id: "Tulis" },
      { en: "Play", id: "Bermain" },
    ],
  },
];
