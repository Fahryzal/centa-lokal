_Pajak Dokumentasi_:

---

# Pajak Dokumentasi

## Versi Teknologi

1. **Node.js**: v20
2. **Package Manager**: Yarn (v1.22.22)
3. **Framework**: [NestJS v9](https://docs.nestjs.com/v9/)
4. **ORM**: Prisma (v5.19.1)
5. **RDBMS**: PostgreSQL

## Cara Instalasi untuk Pengembangan

1. **Clone repository ini** ke lokal Anda:

   ```bash
   git clone -b develop https://nama-akun@gitlab.nutech-integrasi.com/nutech/digitax-api.git
   ```

2. **Install dependencies** yang dibutuhkan:

   ```bash

   (optional), jika belum install yarn
   npm install --global yarn

   yarn install

   ```

### Konfigurasi File `.env.develop / .env` untuk Prisma

1. Inisialisasi Prisma dengan perintah:

   ```bash

   (optional), jika belum ada folder prisma, di root project
   npx prisma init
   ```

2. Buat file `.env.develop / .env` dengan konfigurasi berikut:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb" or
   DATABASE_URL_LOCAL="postgresql://user:password@localhost:5432/mydb"
   ```

3. Pull skema basis data yang telah dibuat ke dalam file skema Prisma:

   ```bash

   (optional), jika shcema belum ada di prisma/schema.prisma
   npx prisma db pull
   ```

4. Setelah skema diperbarui, buat Klien Prisma dengan perintah:

   ```bash
   npx prisma generate
   ```

5. Akses Swagger local

   ```bash
   http://localhost:3000/api/swagger#/
   ```npx pr

## Aturan Penamaan Variabel, File, dan Folder

- **Nama folder**: Gunakan strip (`-`) untuk pemisah kata. Contoh: `faktur-keluaran-lives`
- **Nama file**: Gunakan strip (`-`) untuk pemisah kata. Contoh: `faktur-keluaran-lives.service.ts`
- **Nama variabel**: Gunakan camelCase. Contoh: `camelCase`
- **Nama kelas**: Gunakan PascalCase. Contoh: `PascalCase`

## Struktur folder rujukan

![alt text](<Screenshot 2024-09-09 at 21.40.15.png>)

---

Dokumentasi ini memastikan bahwa semua tim pengembang dapat mengikuti standar yang sama dan mempermudah proses kolaborasi.
