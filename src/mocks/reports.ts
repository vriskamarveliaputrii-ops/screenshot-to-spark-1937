import type { Report, ReportStatus, ReportStatusLog, WasteCategory } from "@/types";
import { mockUsers } from "./users";

/** Fixed reference "now" so mock data is deterministic. */
export const MOCK_NOW = new Date("2026-11-04T15:00:00+07:00").getTime();
const HOUR = 3600_000;
const iso = (hoursAgo: number) => new Date(MOCK_NOW - hoursAgo * HOUR).toISOString();

const PHOTOS: Record<WasteCategory, string[]> = {
  plastic: ["/images/waste-plastic.jpg", "/images/waste-mixed.jpg"],
  organic: ["/images/waste-organic.jpg", "/images/waste-mixed.jpg"],
  paper: ["/images/waste-paper.jpg"],
};

type Seed = [string, string, number, number, WasteCategory, WasteCategory | null, number | null, ReportStatus, number, number];
// title, address, lat, lng, category, ai_label, confidence, status, userId, hoursAgo
const seeds: Seed[] = [
  ["Tumpukan sampah plastik di pinggir Kali Ciliwung", "Jl. Inspeksi Kali Ciliwung, Kampung Melayu, Jakarta Timur", -6.2236, 106.8667, "plastic", "plastic", 0.94, "in_progress", 2, 3],
  ["Sampah sayur menumpuk di depan Pasar Minggu", "Jl. Raya Pasar Minggu, Pasar Minggu, Jakarta Selatan", -6.2846, 106.8433, "organic", "organic", 0.91, "pending", 2, 8],
  ["Kardus bekas dibuang di trotoar Jl. Sabang", "Jl. H. Agus Salim, Menteng, Jakarta Pusat", -6.1857, 106.8262, "paper", "paper", 0.88, "completed", 3, 20],
  ["Botol plastik berserakan di Taman Suropati", "Jl. Taman Suropati, Menteng, Jakarta Pusat", -6.1991, 106.8325, "plastic", "plastic", 0.82, "completed", 4, 30],
  ["Sampah daun dan ranting tidak diangkut", "Jl. Cendrawasih, Kebayoran Baru, Jakarta Selatan", -6.2425, 106.7987, "organic", "plastic", 0.56, "pending", 2, 40],
  ["Tumpukan koran bekas di gang sempit", "Gg. Kelinci, Pasar Baru, Jakarta Pusat", -6.1631, 106.8341, "paper", null, null, "in_progress", 3, 52],
  ["Sampah plastik menyumbat selokan", "Jl. Tanah Abang II, Gambir, Jakarta Pusat", -6.1764, 106.8159, "plastic", "plastic", 0.97, "rejected", 4, 70],
  ["Sisa makanan di belakang warung tenda", "Jl. Kemang Raya, Bangka, Jakarta Selatan", -6.2618, 106.8137, "organic", "organic", 0.86, "completed", 2, 90],
  ["Kemasan styrofoam di bantaran Kali Sunter", "Jl. Danau Sunter Utara, Tanjung Priok, Jakarta Utara", -6.1418, 106.8655, "plastic", "plastic", 0.79, "pending", 3, 110],
  ["Tumpukan sampah pasar di Kebayoran Lama", "Jl. Kebayoran Lama Raya, Jakarta Selatan", -6.2373, 106.7826, "organic", "organic", 0.93, "in_progress", 5, 140],
  ["Kertas dan kardus basah di depan ruko", "Jl. Mangga Besar Raya, Taman Sari, Jakarta Barat", -6.1497, 106.8174, "paper", "organic", 0.61, "rejected", 4, 170],
  ["Kantong plastik hitam di pinggir tol", "Jl. Daan Mogot, Grogol, Jakarta Barat", -6.1625, 106.7795, "plastic", "plastic", 0.9, "completed", 2, 200],
  ["Sampah organik di sekitar Sungai Cikapundung", "Jl. Siliwangi, Coblong, Bandung", -6.8857, 107.6093, "organic", "organic", 0.89, "pending", 3, 12],
  ["Botol plastik di Taman Lansia Bandung", "Jl. Cisangkuy, Citarum, Bandung", -6.9026, 107.6232, "plastic", "plastic", 0.95, "completed", 4, 60],
  ["Tumpukan kardus di belakang Pasar Baru Bandung", "Jl. Otto Iskandar Dinata, Sumur Bandung, Bandung", -6.9176, 107.6046, "paper", "paper", 0.84, "in_progress", 2, 95],
  ["Sampah plastik di saluran air Dago", "Jl. Ir. H. Juanda, Dago, Bandung", -6.8846, 107.6136, "plastic", null, null, "pending", 5, 130],
  ["Kulit buah berserakan di Jl. Braga", "Jl. Braga, Sumur Bandung, Bandung", -6.9175, 107.6091, "organic", "organic", 0.77, "completed", 3, 180],
  ["Sampah kertas bekas acara di Gasibu", "Lapangan Gasibu, Citarum, Bandung", -6.9003, 107.6186, "paper", "plastic", 0.52, "rejected", 2, 230],
  ["Sampah daun menumpuk di Jl. Riau", "Jl. RE. Martadinata, Bandung Wetan, Bandung", -6.9056, 107.6186, "organic", "organic", 0.92, "in_progress", 4, 280],
  ["Plastik kemasan di pinggir Kali Mas", "Jl. Kalimas Barat, Pabean Cantikan, Surabaya", -7.2321, 112.7376, "plastic", "plastic", 0.96, "pending", 2, 5],
  ["Sisa sayur di Pasar Keputran", "Jl. Keputran, Tegalsari, Surabaya", -7.2734, 112.7409, "organic", "organic", 0.9, "in_progress", 3, 26],
  ["Kardus bekas di depan Tunjungan Plaza", "Jl. Basuki Rahmat, Tegalsari, Surabaya", -7.2626, 112.7404, "paper", "paper", 0.81, "completed", 4, 80],
  ["Sampah plastik di Taman Bungkul", "Jl. Taman Bungkul, Darmo, Surabaya", -7.2913, 112.7398, "plastic", "paper", 0.58, "completed", 2, 150],
  ["Tumpukan sampah organik di Wonokromo", "Jl. Stasiun Wonokromo, Wonokromo, Surabaya", -7.3008, 112.7388, "organic", null, null, "rejected", 5, 210],
  ["Koran bekas berserakan di halte", "Jl. Raya Darmo, Wonokromo, Surabaya", -7.2873, 112.7381, "paper", "paper", 0.87, "pending", 3, 250],
  ["Sampah plastik di pantai Kenjeran", "Jl. Pantai Kenjeran, Bulak, Surabaya", -7.2392, 112.7952, "plastic", "plastic", 0.93, "in_progress", 4, 320],
  ["Limbah dapur restoran dibuang sembarangan", "Jl. Sabang, Kebon Sirih, Jakarta Pusat", -6.1853, 106.8273, "organic", "organic", 0.88, "completed", 2, 400],
  ["Sampah plastik di kolong jembatan Semanggi", "Jl. Jend. Gatot Subroto, Setiabudi, Jakarta Selatan", -6.2195, 106.8133, "plastic", "plastic", 0.74, "pending", 3, 480],
  ["Kertas bekas di parkiran kampus", "Jl. Ganesha, Lb. Siliwangi, Bandung", -6.8915, 107.6107, "paper", "paper", 0.9, "completed", 4, 560],
  ["Sampah campuran di TPS liar Cakung", "Jl. Raya Cakung Cilincing, Cakung, Jakarta Timur", -6.1837, 106.9393, "organic", "plastic", 0.64, "in_progress", 2, 650],
];

const admin = { id: 1, name: "Admin SWM" };
const NOTES: Record<ReportStatus, string> = {
  pending: "Laporan dibuat",
  in_progress: "Petugas kebersihan sedang menuju lokasi",
  completed: "Sampah sudah diangkut dan lokasi dibersihkan",
  rejected: "Lokasi bukan area tanggung jawab dinas / laporan duplikat",
};

function buildLogs(reportId: number, status: ReportStatus, userId: number, hoursAgo: number): ReportStatusLog[] {
  const owner = mockUsers.find((u) => u.id === userId)!;
  const logs: ReportStatusLog[] = [
    { id: reportId * 10 + 1, changed_by: { id: owner.id, name: owner.name }, from_status: null, to_status: "pending", note: NOTES.pending, created_at: iso(hoursAgo) },
  ];
  const path: ReportStatus[] =
    status === "in_progress" ? ["in_progress"]
    : status === "completed" ? ["in_progress", "completed"]
    : status === "rejected" ? ["rejected"] : [];
  let prev: ReportStatus = "pending";
  path.forEach((s, i) => {
    logs.push({
      id: reportId * 10 + 2 + i,
      changed_by: admin,
      from_status: prev,
      to_status: s,
      note: NOTES[s],
      created_at: iso(Math.max(hoursAgo - (i + 1) * Math.max(1, hoursAgo / 4), 0.5)),
    });
    prev = s;
  });
  return logs;
}

export const mockReports: Report[] = seeds.map((s, i) => {
  const [title, address, latitude, longitude, category, ai_label, ai_confidence, status, userId, hoursAgo] = s;
  const id = i + 1;
  const owner = mockUsers.find((u) => u.id === userId)!;
  const logs = buildLogs(id, status, userId, hoursAgo);
  const photos = PHOTOS[category];
  return {
    id,
    user: { id: owner.id, name: owner.name, email: owner.email },
    title,
    description: `${title}. Kondisi ini sudah berlangsung beberapa hari dan mulai menimbulkan bau tidak sedap serta mengganggu warga sekitar. Mohon segera ditindaklanjuti oleh petugas kebersihan.`,
    photo_url: photos[i % photos.length],
    latitude,
    longitude,
    address,
    category,
    ai_label,
    ai_confidence,
    ai_uncertain: ai_label === null,
    status,
    admin_note: status === "pending" ? null : NOTES[status],
    created_at: logs[0].created_at,
    updated_at: logs[logs.length - 1].created_at,
    status_logs: logs,
  };
});
