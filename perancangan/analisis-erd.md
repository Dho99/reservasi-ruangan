Analisis dan Perancangan Basis Data: Sistem Reservasi Ruangan Kampus

1. Entity Relationship Diagram (ERD)

Diagram ini memvisualisasikan struktur basis data relasional yang dinormalisasi, dirancang untuk mendukung integritas data, performa tinggi pada query jadwal, dan audit keamanan.

erDiagram
    %% ==========================================
    %% ENTITAS (DATA TABLES)
    %% ==========================================

    USER {
        String id PK "Primary Key (CUID)"
        String npm UK "Unique Index (NPM/NIP)"
        String nama "Nama Lengkap"
        String email UK "Unique, Validated @unsil.ac.id"
        String image "URL Foto Profil (Optional)"
        Enum role "ADMIN | MAHASISWA"
        DateTime createdAt "Waktu pendaftaran"
        DateTime updatedAt "Waktu update profil"
    }

    ROOM {
        String id PK "Primary Key (CUID)"
        String nama "Nama Ruangan"
        String deskripsi "Fasilitas & Keterangan"
        Int kapasitas "Validasi Logis Peserta"
        String lokasi "Gedung/Lantai"
        String gambar "URL Foto Ruangan"
        Boolean isActive "Soft Delete Flag"
        DateTime createdAt
        DateTime updatedAt
    }

    RESERVATION {
        String id PK "Primary Key (CUID)"
        String userId FK "Peminjam"
        String roomId FK "Ruangan yang dipinjam"
        DateTime waktuMulai "Composite Index [Start, End]"
        DateTime waktuSelesai "Composite Index [Start, End]"
        String keperluan "Deskripsi Kegiatan"
        Int jumlahPeserta "Estimasi jumlah orang"
        Enum status "MENUNGGU | DISETUJUI | DITOLAK | DIBATALKAN | SELESAI"
        String alasanPenolakan "Nullable (Diisi jika DITOLAK)"
        DateTime createdAt
        DateTime updatedAt
    }

    BLOCKED_SLOT {
        String id PK "Primary Key (CUID)"
        String roomId FK "Ruangan yang diblokir"
        DateTime waktuMulai "Index Time"
        DateTime waktuSelesai "Index Time"
        String alasan "Alasan Administratif (ex: Renovasi)"
        String createdBy FK "Admin yang memblokir (userId)"
        DateTime createdAt
        DateTime updatedAt
    }

    AUDIT_LOG {
        String id PK "Primary Key (CUID)"
        String userId FK "Aktor (Siapa yang melakukan aksi)"
        String targetId "ID Objek yang diubah (ResvID/RoomID)"
        String targetType "Tipe Objek (RESERVATION/ROOM)"
        Enum action "CREATE | UPDATE | DELETE | APPROVE | REJECT"
        Json metadata "Snapshot data sebelum/sesudah (untuk rollback)"
        DateTime timestamp "Waktu kejadian"
    }

    %% ==========================================
    %% RELASI & KARDINALITAS
    %% ==========================================

    %% User & Reservation (1 User -> Banyak Reservasi)
    USER ||--o{ RESERVATION : "mengajukan (1:N)"

    %% Room & Reservation (1 Room -> Banyak Reservasi)
    ROOM ||--o{ RESERVATION : "memiliki jadwal (1:N)"

    %% Room & BlockedSlot (1 Room -> Banyak Jadwal Blokir)
    ROOM ||--o{ BLOCKED_SLOT : "memiliki blokir (1:N)"

    %% User (Admin) & BlockedSlot (1 Admin -> Membuat Banyak Blokir)
    USER ||--o{ BLOCKED_SLOT : "membuat (1:N)"

    %% User & AuditLog (1 User -> Memicu Banyak Log)
    USER ||--o{ AUDIT_LOG : "memicu aktivitas (1:N)"


2. Analisis Entitas dan Atribut (Data Dictionary)

Perancangan ini menggunakan pendekatan Model-First yang kompatibel dengan Prisma ORM dan PostgreSQL.

A. Entitas USER (Pengguna)

Menyimpan identitas seluruh aktor sistem.

Atribut Kunci:

id (PK): Menggunakan CUID (Collision Resistant Unique Identifier) alih-alih Auto-increment integer. Ini praktik terbaik modern untuk keamanan (mencegah enumerasi ID) dan skalabilitas horizontal.

role: Menggunakan tipe Enumerasi (ADMIN, MAHASISWA) untuk menegakkan Role-Based Access Control (RBAC) yang ketat pada level basis data.

email: Dilindungi dengan Unique Constraint dan divalidasi pada level aplikasi untuk memastikan hanya domain @unsil.ac.id yang terdaftar.

B. Entitas ROOM (Fasilitas)

Merepresentasikan sumber daya fisik kampus.

Atribut Kunci:

isActive: Implementasi mekanisme Soft Delete. Ruangan yang sedang direnovasi atau tidak digunakan lagi tidak dihapus datanya secara fisik untuk menjaga integritas riwayat reservasi lama, melainkan hanya ditandai sebagai false.

kapasitas: Digunakan sebagai parameter validasi bisnis. Sistem akan menolak reservasi jika jumlahPeserta > kapasitas.

C. Entitas RESERVATION (Transaksi Inti)

Jantung operasional sistem yang menghubungkan pengguna dengan ruangan.

Atribut Kunci:

waktuMulai & waktuSelesai: Atribut paling kritis. Wajib diterapkan Composite Index pada kedua kolom ini di PostgreSQL. Hal ini menjamin performa pencarian jadwal bentrok (conflict detection) tetap milidetik meskipun data mencapai jutaan baris.

status: Mesin status (State Machine) yang mencakup siklus hidup lengkap: MENUNGGU $\rightarrow$ DISETUJUI/DITOLAK $\rightarrow$ SELESAI/DIBATALKAN.

D. Entitas BLOCKED_SLOT (Manajemen Ketersediaan)

Entitas khusus administratif untuk menutup jadwal tanpa melalui proses reservasi.

Fungsi: Digunakan untuk pemeliharaan, ujian nasional, atau acara internal kampus.

Prioritas: Dalam algoritma pengecekan jadwal, entitas ini memiliki hierarki lebih tinggi dari RESERVATION. Jika ada BlockedSlot, reservasi tidak bisa dibuat.

Relasi Tambahan: Memiliki createdBy (Foreign Key ke User) untuk mengetahui Admin mana yang melakukan pemblokiran.

E. Entitas AUDIT_LOG (Akuntabilitas & Keamanan)

Entitas tambahan untuk memenuhi aspek "Akuntabilitas" dalam latar belakang masalah.

Fungsi: Mencatat "Siapa melakukan Apa, Kapan, dan Di Mana".

metadata (JSON): Menyimpan snapshot data. Misalnya, saat Admin menolak pengajuan, sistem menyimpan status sebelumnya. Ini berguna untuk fitur undo atau investigasi jika terjadi sengketa peminjaman.

3. Analisis Relasi (Relationship & Cardinality)

Sistem ini didominasi oleh relasi One-to-Many (1:N) yang efisien:

User $\rightarrow$ Reservation (1:N)

Analisis: Satu mahasiswa dapat memiliki riwayat banyak peminjaman sepanjang masa studinya.

Behavior: Jika User dihapus, data reservasi bisa diatur SET NULL atau CASCADE (tergantung kebijakan kampus apakah ingin menyimpan riwayat alumni atau tidak).

Room $\rightarrow$ Reservation (1:N)

Analisis: Satu ruangan menampung banyak slot waktu reservasi yang berbeda.

Constraint: Relasi ini dijaga ketat oleh logika aplikasi untuk mencegah overlapping waktu (satu ruangan tidak boleh memiliki 2 reservasi di rentang waktu yang sama).

User $\rightarrow$ AuditLog (1:N)

Analisis: Setiap tindakan pengguna (Login, Submit, Approve, Reject) akan menghasilkan satu baris log baru. Ini akan menjadi tabel dengan pertumbuhan data tercepat (high volume table).