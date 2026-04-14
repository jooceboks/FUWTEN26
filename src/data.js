// ─── AUDIO ───
export const HIT_SFX_URL = 'https://rrzvgzjttmyseqsmmyvn.supabase.co/storage/v1/object/sign/attachments/3228282c-0b5e-4ad1-a13a-b9680cafdfa3/generated-audio/lc9j6h2psxs-1776101497261-8mra.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xMjY1MWQ4My04ODE0LTQ3NzMtOGRlNS00MzliNDBkODY2NmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdHRhY2htZW50cy8zMjI4MjgyYy0wYjVlLTRhZDEtYTEzYS1iOTY4MGNhZmRmYTMvZ2VuZXJhdGVkLWF1ZGlvL2xjOWo2aDJwc3hzLTE3NzYxMDE0OTcyNjEtOG1yYS5tcDMiLCJpYXQiOjE3NzYxMDE0OTcsImV4cCI6MjA5MTQ2MTQ5N30.Cdta-z4JB4e149r90g-FHCDZcw5HFCJLrmdM6ceELtE';
export const AMBIENT_URL = 'https://rrzvgzjttmyseqsmmyvn.supabase.co/storage/v1/object/sign/attachments/3228282c-0b5e-4ad1-a13a-b9680cafdfa3/generated-audio/lc9j6h2psxs-1776101512184-7u52.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xMjY1MWQ4My04ODE0LTQ3NzMtOGRlNS00MzliNDBkODY2NmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdHRhY2htZW50cy8zMjI4MjgyYy0wYjVlLTRhZDEtYTEzYS1iOTY4MGNhZmRmYTMvZ2VuZXJhdGVkLWF1ZGlvL2xjOWo2aDJwc3hzLTE3NzYxMDE1MTIxODQtN3U1Mi5tcDMiLCJpYXQiOjE3NzYxMDE1MTIsImV4cCI6MjA5MTQ2MTUxMn0.b0aJV7gYN-DyN2Lf8R2SzwkpTZQAiJf5Guo91TBqB0A';

// ─── PLAYER IMAGES ───
// Add /assets/roster/<filename> paths here. File must exist in public/assets/roster/.
export const playerImages = {
  'Maeve Cassidy':      '/assets/roster/imgi_13_Cassidy.jpg',
  'Dylin Pizzutello':   '/assets/roster/imgi_23_Pizzutello.jpg',
  'Lily Malinowski':    '/assets/roster/imgi_20_Malinowski.jpg',
  'Maria Gell':         '/assets/roster/imgi_14_Gell.jpg',
  'Nicolette Loeffler': '/assets/roster/imgi_19_Loeffler.jpg',
  'Victoria Mandma':    '/assets/roster/imgi_21_Mandma.jpg',
  'Anna Neyestani':     '/assets/roster/imgi_22_Neyestani.jpg',
  'Meg Harding':        '/assets/roster/imgi_15_Harding.jpg',
  'Sophia Harris':      '/assets/roster/imgi_16_Harris.jpg',
  'Regina Herrera':     '/assets/roster/imgi_17_Herrera.jpg',
};

// ─── PLAYER DATA ───
export const players = [
  { name: 'Maeve Cassidy',      number: 'Jr.', note: 'Maeve, my unofficial therapist and a true leader from day one. I don\'t think you realize how much your words actually impact me, but I find myself thinking about your advice long after the sun goes down. I\'m more grateful for your support than you\'ll ever know.' },
  { name: 'Dylin Pizzutello',   number: 'So.', note: 'The biggest Stag supporter! I loved having you around for every single match. You\'re personable, funny, and your energy is exactly what this team needs to keep everyone\'s head in the game.' },
  { name: 'Lily Malinowski',    number: 'Jr.', note: 'A real fighter AND the ultimate entertainer on and off the court. Gonna miss the constant laughs and content. I just hope no one forgets the condiments...' },
  { name: 'Maria Gell',         number: 'So.', note: 'MARIE! Te quiero! You are hands down the most unintentionally funny person I\'ve ever met and the best doubles player on this team. I\'m going to miss watching you play, queen!' },
  { name: 'Nicolette Loeffler', number: 'Jr.', note: 'Nicolette, you are the absolute definition of resilience. I\'ve always admired how you can bounce back from anything. I\'m leaving you with so much respect and wishing you all the apple sauce you deserve!' },
  { name: 'Victoria Mandma',    number: 'So.', note: 'Our Number 1, all the way from Estonia! VIC, it\'s been an honor watching you play. I have so much respect for how you\'ve pushed through your injury. Thanks for being such an inspiration during my time here.' },
  { name: 'Anna Neyestani',     number: 'Jr.', note: 'I\'ll catch you floating around in NYC soon, right? I\'ve always loved having your energy around. It\'s been such a pleasure, and I\'m definitely going to miss being on this team with you!' },
  { name: 'Meg Harding',        number: 'Sr.', note: 'To my fellow graduating senior, Meg.... Words really can\'t describe how much respect I have for you. Truly glad I had you by my side for this entire journey, and I know I\'ll be seeing you very soon!' },
  { name: 'Sophia Harris',      number: 'Fr.', note: 'Hey Soph! Hope you are enjoying your first year! I really enjoyed playing doubles with you early on, you\'ve got a lot of talent, and I\'ll be cheering you on from the side instead of beside you now.' },
  { name: 'Regina Herrera',     number: 'Fr.', note: 'Hey Freshi, I wish I could\'ve seen you play even more, because you\'re one of the biggest fighters I\'ve ever seen. I\'ve truly appreciated you showing up every single day with no complaints, just pure discipline and hard work.' },
];

// ─── SEASON RESULTS ───
export const results = [
  { date: 'Jan 28', opp: 'UConn',           result: 'L', score: '0–7', maac: false },
  { date: 'Jan 30', opp: 'St. John\'s',     result: 'L', score: '0–4', maac: false },
  { date: 'Jan 31', opp: 'Rhode Island',    result: 'L', score: '2–5', maac: false },
  { date: 'Feb 7',  opp: 'Army West Point', result: 'L', score: '1–4', maac: false },
  { date: 'Feb 13', opp: 'Towson',          result: 'W', score: '4–2', maac: false },
  { date: 'Feb 21', opp: 'Bryant',          result: 'L', score: '0–7', maac: false },
  { date: 'Mar 1',  opp: 'Hofstra',         result: 'W', score: '5–2', maac: false },
  { date: 'Mar 9',  opp: 'Navy',            result: 'L', score: '1–6', maac: false },
  { date: 'Mar 11', opp: 'Marquette',       result: 'L', score: '3–4', maac: false },
  { date: 'Mar 12', opp: 'Lehigh',          result: 'L', score: '2–5', maac: false },
  { date: 'Mar 18', opp: 'LIU',             result: 'L', score: '3–4', maac: false },
  { date: 'Mar 24', opp: 'Rider',           result: 'W', score: '4–3', maac: true  },
  { date: 'Mar 27', opp: 'Siena',           result: 'W', score: '6–1', maac: true  },
  { date: 'Mar 29', opp: 'Merrimack',       result: 'W', score: '7–0', maac: true  },
  { date: 'Apr 2',  opp: 'Sacred Heart',    result: 'L', score: '2–5', maac: true  },
  { date: 'Apr 9',  opp: 'Marist',          result: 'W', score: '5–2', maac: true  },
];

export const upcoming = [
  { date: 'Apr 12', opp: 'at Mount St. Mary\'s' },
  { date: 'Apr 15', opp: 'at Quinnipiac'         },
  { date: 'Apr 19', opp: 'vs Niagara'            },
  { date: 'Apr 25–26', opp: 'MAAC Championships — Princeton, NJ' },
];

// ─── CAROUSEL PHOTOS ───
// Photos shown in the camera lens carousel. Add more as needed.
export const carouselPhotos = [
  { src: '/assets/team_photo_2.jpg', caption: 'Team Shoot — 2025–26' },
  { src: '/assets/team_photo_1.jpg', caption: 'Team Photo — Spring 2026' },
  { src: '/assets/team_photo_3.jpg', caption: 'Post-Match — Spring 2026' },
];

// ─── CAROUSEL VIDEOS ───
// Videos shown in the camera lens carousel. Add more as needed.
export const carouselVideos = [
  { src: '/assets/highlight_1.mov', caption: 'Highlights — Spring 2026' },
];
