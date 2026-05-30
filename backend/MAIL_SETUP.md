# 📧 Konfigurasi Email SMTP (Gmail) — AuraAI Deadliner

Panduan ini menjelaskan cara mengkonfigurasi pengiriman email untuk fitur **Reset Password** menggunakan Gmail SMTP.

## Prasyarat

- Akun Google/Gmail
- Two-Factor Authentication (2FA) sudah diaktifkan di akun Google

## Langkah 1: Aktifkan 2FA di Google Account

1. Buka [Google Account Security](https://myaccount.google.com/security)
2. Di bagian **"Signing in to Google"**, klik **"2-Step Verification"**
3. Ikuti langkah-langkah untuk mengaktifkan verifikasi 2 langkah
4. Pastikan statusnya **"On"**

## Langkah 2: Buat Gmail App Password

> **Penting:** App Password hanya bisa dibuat jika 2FA sudah aktif.

1. Buka [App Passwords](https://myaccount.google.com/apppasswords)
2. Di field **"App name"**, ketik: `AuraAI Deadliner`
3. Klik **"Create"**
4. Google akan menampilkan password 16 karakter (contoh: `abcd efgh ijkl mnop`)
5. **Salin password tersebut** (tanpa spasi)

## Langkah 3: Update File `.env`

Buka file `backend/.env` dan isi konfigurasi berikut:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=email@gmail.com
MAIL_PASSWORD=APP_PASSWORD_GMAIL
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=email@gmail.com
MAIL_FROM_NAME="AuraAI Deadliner"

FRONTEND_URL=http://localhost:3000
```

### Keterangan:

| Variable | Nilai | Penjelasan |
|---|---|---|
| `MAIL_MAILER` | `smtp` | Menggunakan protokol SMTP |
| `MAIL_HOST` | `smtp.gmail.com` | Server SMTP Gmail |
| `MAIL_PORT` | `587` | Port SMTP dengan TLS |
| `MAIL_USERNAME` | Email Gmail Anda | Alamat email pengirim |
| `MAIL_PASSWORD` | App Password | Password 16 karakter dari Langkah 2 |
| `MAIL_ENCRYPTION` | `tls` | Enkripsi TLS |
| `MAIL_FROM_ADDRESS` | Email Gmail Anda | Alamat pengirim yang tampil di email |
| `MAIL_FROM_NAME` | `AuraAI Deadliner` | Nama pengirim |
| `FRONTEND_URL` | URL frontend | URL untuk link reset password |

## Langkah 4: Restart Laravel Server & Clear Cache

Setelah mengubah `.env`, pastikan Anda membersihkan cache konfigurasi agar perubahan terbaca oleh sistem Laravel:

```bash
php artisan config:clear
php artisan cache:clear
```

Lalu restart server:

```bash
# Hentikan server (Ctrl+C) lalu jalankan ulang
php artisan serve
```

## Langkah 5: Test Pengiriman Email

Sekarang, Anda dapat menguji konfigurasi SMTP menggunakan command bawaan yang telah disediakan:

```bash
php artisan mail:test
```

Jika berhasil, Anda akan melihat pesan:
`✅ Test email sent successfully! SMTP configuration is correct.`

Anda juga bisa menjalankan pengujian langsung ke alamat email tertentu:
```bash
php artisan mail:test [email-anda@gmail.com]
```

## Troubleshooting

### Email tidak terkirim
- Pastikan 2FA sudah aktif di Google Account
- Pastikan App Password sudah benar (16 karakter, tanpa spasi)
- Pastikan `MAIL_USERNAME` dan `MAIL_FROM_ADDRESS` menggunakan email yang sama
- Cek log error di `storage/logs/laravel.log`

### Error "Less secure app access"
- Google sudah menghapus opsi ini. Gunakan **App Password** sebagai gantinya.

### Error "SMTP connect() failed"
- Pastikan `MAIL_PORT=587` dan `MAIL_ENCRYPTION=tls`
- Pastikan koneksi internet aktif
- Beberapa jaringan kampus memblokir port 587, coba gunakan jaringan lain

### Untuk Development (Tanpa Gmail)
Jika tidak ingin menggunakan Gmail, gunakan [Mailtrap](https://mailtrap.io) sebagai alternatif:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=<mailtrap_username>
MAIL_PASSWORD=<mailtrap_password>
MAIL_ENCRYPTION=tls
```
