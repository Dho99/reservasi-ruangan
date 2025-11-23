Berikut **analisis halaman (page)** untuk **User (Mahasiswa)** dan **Admin** berdasarkan *use case diagram* yang kamu berikan.
Aku uraikan **nama halaman** dan **isi/fitur** di dalamnya, supaya nanti mudah dijadikan acuan untuk implementasi web-nya.


# ✅ **1. USER (Mahasiswa) — Halaman & Isi Page**

Mahasiswa hanya berinteraksi dengan fitur reservasi, pengecekan jadwal, dan status.

## **1. Login Page**

**Isi / Fitur:**

* Form login (NIM / email kampus + password)
* Tombol "Lupa Password"
* Redirect ke Dashboard Mahasiswa jika login berhasil

---

## **2. Dashboard Mahasiswa**

**Isi / Fitur:**

* Ringkasan status pengajuan reservasi terakhir
* Tombol navigasi cepat:

  * Ajukan Reservasi
  * Lihat Jadwal Ketersediaan
  * Status Pengajuan
  * Pembatalan Reservasi
* Notifikasi (jika ada pengajuan disetujui / ditolak)

---

## **3. Page Ajukan Reservasi Ruangan**

(*mengajukan reservasi ruangan*)
**Isi / Fitur:**

* Form pengajuan:

  * Pilih ruangan
  * Tanggal & waktu mulai
  * Tanggal & waktu selesai
  * Keperluan penggunaan
  * Upload surat izin (opsional)
* Tombol submit
* Validasi: cek bentrok jadwal

---

## **4. Page Lihat Jadwal Ketersediaan**

(*lihat jadwal ketersediaan ruangan*)
**Isi / Fitur:**

* Tabel / kalender jadwal ruangan
* Filter:

  * Nama ruangan
  * Tanggal
  * Jenis ruangan (kelas, lab, aula)
* Indikator:

  * Hijau = tersedia
  * Merah = terpakai
  * Kuning = menunggu approval

---

## **5. Page Status Pengajuan**

(*melihat status pengajuan*)
**Isi / Fitur:**

* Daftar semua pengajuan reservasi
* Kolom:

  * Ruangan
  * Tanggal
  * Waktu
  * Status: Pending / Disetujui / Ditolak
  * Catatan admin (jika ditolak)
* Tombol “Detail”

---

## **6. Page Pembatalan Reservasi**

(*pembatalan reservasi*)
**Isi / Fitur:**

* List pengajuan yang masih “disetujui” atau “menunggu”
* Tombol “Batalkan”
* Alasan pembatalan (opsional)

---

# ✅ **2. ADMIN — Halaman & Isi Page**

Admin memiliki akses untuk mengelola ruangan, jadwal, pengajuan, dan laporan.

---

## **1. Login Admin**

**Isi / Fitur:**

* Form login (username + password)
* Proteksi berbeda dari login mahasiswa

---

## **2. Dashboard Admin**

**Isi / Fitur:**

* Statistik:

  * Total reservasi hari ini
  * Pengajuan pending
  * Jadwal terblokir
* Shortcut ke:

  * Kelola Ruangan
  * Kelola Jadwal
  * Kelola Pengajuan
  * Laporan Penggunaan

---

## **3. Page Kelola Pengajuan**

(*mengelola pengajuan*)
**Isi / Fitur:**

* Daftar pengajuan pending
* Detail pengajuan (ruangan, tanggal, waktu, alasan)
* Tombol:

  * Setujui
  * Tolak
  * Tambah catatan
* Riwayat pengajuan

---

## **4. Page Kelola Ruangan**

(*buat, edit, hapus data ruangan*)
**Isi / Fitur:**

* List ruangan:

  * Nama ruangan
  * Kapasitas
  * Fasilitas
  * Lokasi
* Tombol:

  * Buat Data Ruangan
  * Edit Data
  * Hapus Data

---

## **5. Page Kelola Jadwal Ruangan**

(*buat, edit, hapus jadwal + blok jadwal*)
**Isi / Fitur:**

* Jadwal semua ruangan (tabel/kalender)
* Tombol aksi:

  * Buat Jadwal
  * Edit Jadwal
  * Hapus Jadwal
  * Blok Jadwal (contoh: ruangan dipakai rapat fakultas)
* Informasi jadwal bentrok otomatis

---

## **6. Page Laporan Penggunaan**

(*melihat laporan penggunaan + extend ke cetak laporan*)
**Isi / Fitur:**

* Filter laporan:

  * Per tanggal
  * Per ruangan
  * Per departemen
* Tabel laporan:

  * Ruangan
  * Pemohon
  * Jam penggunaan
  * Status
* Tombol:

  * **Cetak PDF**
  * **Export Excel**

---

# 🔥 Summary Singkat

| Role          | Page                | Isi Singkat            |
| ------------- | ------------------- | ---------------------- |
| **Mahasiswa** | Login               | masuk sistem           |
|               | Dashboard           | ringkasan & navigasi   |
|               | Ajukan Reservasi    | form pengajuan         |
|               | Jadwal Ketersediaan | kalender/tabel ruangan |
|               | Status Pengajuan    | lihat status           |
|               | Pembatalan          | batalkan reservasi     |
| **Admin**     | Login               | akses admin            |
|               | Dashboard           | statistik & menu utama |
|               | Kelola Pengajuan    | approval pending       |
|               | Kelola Ruangan      | CRUD ruangan           |
|               | Kelola Jadwal       | CRUD jadwal & blok     |
|               | Laporan Penggunaan  | lihat + cetak laporan  |


