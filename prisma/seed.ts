import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/prisma/src/generated/prisma/client"
import { hash } from "bcrypt-ts"

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Create Admin User (Email Kampus)
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@unsil.ac.id' },
    update: {},
    create: {
      nama: 'Administrator',
      email: 'admin@unsil.ac.id',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create Second Admin User (for testing)
  const admin2Password = await hash('admin123', 10)
  const admin2 = await prisma.user.upsert({
    where: { email: 'staff@unsil.ac.id' },
    update: {},
    create: {
      nama: 'Staff Admin',
      email: 'staff@unsil.ac.id',
      password: admin2Password,
      role: 'ADMIN',
    },
  })
  console.log('✅ Second admin user created:', admin2.email)

  // Create Sample Student Users
  const studentPassword = await hash('student123', 10)
  const student = await prisma.user.upsert({
    where: { email: 'mahasiswa@student.unsil.ac.id' },
    update: {},
    create: {
      nama: 'Mahasiswa Demo',
      email: 'mahasiswa@student.unsil.ac.id',
      password: studentPassword,
      role: 'MAHASISWA',
    },
  })
  console.log('✅ Student user created:', student.email)

  // Create Gmail Student User (for testing)
  const gmailPassword = await hash('gmail123', 10)
  const gmailStudent = await prisma.user.upsert({
    where: { email: 'student.test@gmail.com' },
    update: {},
    create: {
      nama: 'Gmail Student',
      email: 'student.test@gmail.com',
      password: gmailPassword,
      role: 'MAHASISWA',
    },
  })
  console.log('✅ Gmail student user created:', gmailStudent.email)

  // Create Sample Rooms
  const rooms = [
    {
      nama: 'Aula Utama',
      deskripsi: 'Aula besar untuk acara kampus',
      kapasitas: 200,
      lokasi: 'Gedung A Lantai 1',
      isActive: true,
    },
    {
      nama: 'Lab Komputer 1',
      deskripsi: 'Laboratorium komputer dengan 30 PC',
      kapasitas: 30,
      lokasi: 'Gedung B Lantai 2',
      isActive: true,
    },
    {
      nama: 'Ruang Rapat B',
      deskripsi: 'Ruang rapat untuk diskusi kelompok',
      kapasitas: 15,
      lokasi: 'Gedung A Lantai 2',
      isActive: true,
    },
    {
      nama: 'Kelas 101',
      deskripsi: 'Ruang kelas standar',
      kapasitas: 40,
      lokasi: 'Gedung C Lantai 1',
      isActive: true,
    },
  ]

  for (const room of rooms) {
    const created = await prisma.room.upsert({
      where: { id: room.nama }, // Using nama as temporary unique identifier
      update: {},
      create: room,
    })
    console.log('✅ Room created:', created.nama)
  }

  console.log('🎉 Seeding completed!')
  console.log('\n📝 Login Credentials (Credentials Provider):')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👨‍💼 Admin Users:')
  console.log('   • admin@unsil.ac.id / admin123')
  console.log('   • staff@unsil.ac.id / admin123')
  console.log('\n👨‍🎓 Student Users:')
  console.log('   • mahasiswa@student.unsil.ac.id / student123')
  console.log('   • student.test@gmail.com / gmail123')
  console.log('\n🔐 Google OAuth Login:')
  console.log('   • Gmail accounts (@gmail.com) → MAHASISWA role')
  console.log('   • Staff emails (@unsil.ac.id) → ADMIN role')
  console.log('   • Student emails (@student.unsil.ac.id) → MAHASISWA role')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
