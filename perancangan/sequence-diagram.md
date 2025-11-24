# UML Sequence Diagram - Sistem Reservasi Ruangan Kampus

## Deskripsi Sistem

Sistem Reservasi Ruangan Kampus berbasis Next.js dengan Prisma ORM dan PostgreSQL, menggunakan Google OAuth untuk autentikasi dengan validasi domain @unsil.ac.id.

---

## Sequence Diagram

```mermaid
sequenceDiagram
    actor Mahasiswa as Mahasiswa (User)
    actor Admin as Admin
    participant UI as UI (Next.js Frontend)
    participant API as API (Next.js Routes)
    participant DB as Database (Prisma + PostgreSQL)

    %% ========================================
    %% A. SKENARIO AUTENTIKASI (LOGIN)
    %% ========================================
    rect rgb(240, 248, 255)
        Note over Mahasiswa,DB: A. Skenario Autentikasi (Login)
        
        Mahasiswa->>+UI: Klik "Login with Google"
        UI->>+API: POST /api/auth/signin
        activate API
        API->>API: Redirect ke Google OAuth
        API-->>-UI: Google OAuth URL
        UI-->>-Mahasiswa: Redirect ke Google Login
        
        Mahasiswa->>+UI: Login dengan akun Google
        UI->>+API: Callback with OAuth token
        activate API
        API->>API: Validasi OAuth token
        
        alt Email BUKAN @unsil.ac.id
            API-->>UI: Error: "Akses ditolak - Gunakan email @unsil.ac.id"
            deactivate API
            UI-->>Mahasiswa: Tampilkan error message
        else Email @unsil.ac.id (Valid)
            API->>+DB: Cari/Buat user di tabel User
            activate DB
            DB-->>-API: User data
            deactivate DB
            API->>API: Buat session & generate token
            API-->>-UI: Return { token, user, session }
            deactivate API
            UI-->>-Mahasiswa: Redirect ke Dashboard
        end
    end

    %% ========================================
    %% B. SKENARIO PENGECEKAN JADWAL
    %% ========================================
    rect rgb(240, 255, 240)
        Note over Mahasiswa,DB: B. Skenario Pengecekan Jadwal (Mahasiswa)
        
        Mahasiswa->>+UI: Pilih Ruangan & Tanggal
        activate UI
        UI->>+API: GET /api/schedule?roomId={id}&date={date}
        activate API
        
        API->>+DB: Query Reservation & BlockedSlot
        activate DB
        Note right of API: SELECT * FROM Reservation<br/>WHERE roomId = ? AND date = ?<br/>UNION<br/>SELECT * FROM BlockedSlot<br/>WHERE roomId = ? AND date = ?
        DB-->>-API: Return occupied/blocked slots
        deactivate DB
        
        API->>API: Process & format data
        API-->>-UI: Return { availableSlots, occupiedSlots, blockedSlots }
        deactivate API
        
        UI->>UI: Render Timeline View
        UI-->>-Mahasiswa: Tampilkan visualisasi jadwal
        deactivate UI
    end

    %% ========================================
    %% C. SKENARIO PENGAJUAN RESERVASI
    %% ========================================
    rect rgb(255, 250, 240)
        Note over Mahasiswa,DB: C. Skenario Pengajuan Reservasi (Mahasiswa)
        
        Mahasiswa->>+UI: Isi form reservasi<br/>(Waktu Mulai, Selesai, Keperluan)
        activate UI
        Mahasiswa->>UI: Submit reservasi
        
        UI->>+API: POST /api/reservation<br/>{ roomId, startTime, endTime, purpose }
        activate API
        
        API->>API: Validasi input data
        
        API->>+DB: Check conflict (Conflict Detection)
        activate DB
        Note right of API: VALIDASI CONFLICT:<br/>Cek tabrakan waktu dengan<br/>reservasi existing & blocked slots
        
        DB->>DB: Query overlapping reservations
        DB-->>-API: Return conflict check result
        deactivate DB
        
        alt Ada Conflict (Bentrok)
            API-->>UI: Error: "Waktu bentrok dengan reservasi lain"
            deactivate API
            UI-->>Mahasiswa: Tampilkan error & saran waktu alternatif
            deactivate UI
        else Tidak Ada Conflict (Tersedia)
            API->>+DB: INSERT INTO Reservation<br/>SET status = 'MENUNGGU'
            activate DB
            DB-->>-API: Return new reservation ID
            deactivate DB
            
            API-->>-UI: Success: { message, reservationId, status }
            deactivate API
            UI-->>-Mahasiswa: "Reservasi berhasil diajukan!<br/>Menunggu persetujuan admin."
            deactivate UI
        end
    end

    %% ========================================
    %% D. SKENARIO PERSETUJUAN RESERVASI
    %% ========================================
    rect rgb(255, 240, 245)
        Note over Admin,DB: D. Skenario Persetujuan Reservasi (Admin)
        
        Admin->>+UI: Akses halaman Admin Panel
        activate UI
        UI->>+API: GET /api/reservation/pending
        activate API
        
        API->>+DB: SELECT * FROM Reservation<br/>WHERE status = 'MENUNGGU'
        activate DB
        DB-->>-API: Return pending reservations
        deactivate DB
        
        API-->>-UI: Return list of pending requests
        deactivate API
        UI-->>-Admin: Tampilkan daftar pengajuan
        deactivate UI
        
        Admin->>+UI: Pilih reservasi & klik Setuju/Tolak
        activate UI
        UI->>+API: PATCH /api/reservation/{id}<br/>{ action: 'APPROVE' | 'REJECT' }
        activate API
        
        Note right of API: RACE CONDITION PREVENTION:<br/>Validasi ulang ketersediaan<br/>sebelum approval
        
        API->>+DB: Re-check conflict untuk reservasi ini
        activate DB
        DB-->>-API: Return validation result
        deactivate DB
        
        alt Masih Ada Conflict (Race Condition)
            API-->>UI: Error: "Reservasi ini bentrok dengan approval lain"
            deactivate API
            UI-->>Admin: Tampilkan error & refresh list
            deactivate UI
        else Tidak Ada Conflict
            API->>+DB: UPDATE Reservation<br/>SET status = 'DISETUJUI' | 'DITOLAK'
            activate DB
            DB-->>-API: Update successful
            deactivate DB
            
            opt Jika DISETUJUI
                API->>API: Trigger email notification (optional)
            end
            
            API-->>-UI: Success: "Status berhasil diupdate"
            deactivate API
            UI-->>-Admin: Refresh list & tampilkan notifikasi
            deactivate UI
        end
    end
```

---

## Penjelasan Komponen

### Participants (Lifelines)

- **Mahasiswa (User)**: Aktor yang mengajukan reservasi ruangan
- **Admin**: Aktor yang menyetujui/menolak reservasi
- **UI (Next.js Frontend)**: Layer presentasi (Pages/Components)
- **API (Next.js Routes)**: Layer business logic (API Routes/Server Actions)
- **Database (Prisma + PostgreSQL)**: Layer data persistence

---

## Alur Skenario

### A. Skenario Autentikasi (Login)

1. User/Admin melakukan login menggunakan Google OAuth
2. Sistem memvalidasi domain email
3. Jika email BUKAN `@unsil.ac.id` → Tolak akses (return error)
4. Jika valid → Buat sesi dan kembalikan token akses

**Fitur Keamanan:**
- Validasi domain email di level API
- Session management dengan token JWT
- OAuth 2.0 flow untuk autentikasi aman

---

### B. Skenario Pengecekan Jadwal (Mahasiswa)

1. Mahasiswa memilih ruangan dan tanggal
2. UI meminta data ketersediaan ke API
3. API melakukan query ke Database (cek tabel `Reservation` & `BlockedSlot`)
4. Database mengembalikan data slot yang terisi/diblokir
5. UI menampilkan visualisasi jadwal (Timeline View)

**Optimasi Query:**
- Index pada `waktuMulai` dan `waktuSelesai`
- UNION query untuk menggabungkan data reservasi dan blocked slots
- Caching untuk ruangan yang sering diakses

---

### C. Skenario Pengajuan Reservasi (Mahasiswa)

1. Mahasiswa mengisi form reservasi (Waktu Mulai, Selesai, Keperluan)
2. API melakukan validasi **Conflict Detection** (memastikan tidak ada tabrakan waktu)
3. Jika bentrok → Return Error ke UI dengan saran waktu alternatif
4. Jika tersedia → Simpan data ke Database dengan status `MENUNGGU`
5. Return pesan sukses ke UI

**Conflict Detection Algorithm:**
```sql
SELECT * FROM Reservation
WHERE roomId = ?
  AND status IN ('MENUNGGU', 'DISETUJUI')
  AND (
    (waktuMulai >= ? AND waktuMulai < ?) OR
    (waktuSelesai > ? AND waktuSelesai <= ?) OR
    (waktuMulai <= ? AND waktuSelesai >= ?)
  )
```

---

### D. Skenario Persetujuan Reservasi (Admin)

1. Admin melihat daftar pengajuan dengan status `MENUNGGU`
2. Admin mengirim aksi (Setuju/Tolak)
3. API memvalidasi ulang ketersediaan (untuk mencegah race condition)
4. Database mengupdate status menjadi `DISETUJUI` atau `DITOLAK`

**Race Condition Prevention:**
- Re-validasi conflict sebelum approval
- Database transaction untuk memastikan atomicity
- Optimistic locking jika diperlukan

---

## Ketentuan Teknis Diagram

✅ **Activate/Deactivate**: Menunjukkan durasi proses aktif  
✅ **Panah Putus-Putus (-->>)**: Response/return dari proses  
✅ **Note**: Dokumentasi pada validasi penting (Conflict Detection, Race Condition)  
✅ **Alt Fragment**: Skenario kondisional (if-else)  
✅ **Opt Fragment**: Skenario optional  
✅ **Rect**: Grouping skenario dengan background color berbeda  

---

## Status Reservasi (State Machine)

```
MENUNGGU (Initial State)
    ↓
    ├─→ DISETUJUI (Final State - Success)
    ├─→ DITOLAK (Final State - Rejected)
    └─→ DIBATALKAN (Final State - Cancelled by User)
```

| Status | Deskripsi | Dapat Diubah Oleh |
|--------|-----------|-------------------|
| `MENUNGGU` | Pengajuan baru yang belum diproses | Sistem (auto) |
| `DISETUJUI` | Reservasi yang telah disetujui admin | Admin |
| `DITOLAK` | Reservasi yang ditolak admin | Admin |
| `DIBATALKAN` | Reservasi yang dibatalkan oleh user | Mahasiswa/Admin |

---

## Cara Menggunakan Diagram

Diagram ini dapat di-render menggunakan:

1. **GitHub** - Native Mermaid support dalam Markdown
2. **Mermaid Live Editor** - https://mermaid.live
3. **VS Code** - Extension "Markdown Preview Mermaid Support"
4. **Documentation Tools** - Docusaurus, VitePress, GitBook, dll.

---

## Referensi Teknis

- **Next.js**: Framework React untuk SSR dan API Routes
- **Prisma ORM**: Type-safe database client
- **PostgreSQL**: Relational database dengan ACID compliance
- **Google OAuth**: OAuth 2.0 provider untuk autentikasi
- **Mermaid.js**: Diagram as code untuk dokumentasi teknis
