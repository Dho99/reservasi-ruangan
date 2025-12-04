import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/prisma/src/generated/prisma/client"
import { hash } from "bcrypt-ts"

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting fresh seed...')
  
  // Fresh seed: Delete all existing data (like Laravel's migrate:fresh)
  console.log('🗑️  Deleting all existing data...')
  
  // Delete in correct order (respecting foreign key constraints)
  await prisma.reservation.deleteMany({})
  console.log('   ✓ Deleted all reservations')
  
  await prisma.blockedSlot.deleteMany({})
  console.log('   ✓ Deleted all blocked slots')
  
  await prisma.room.deleteMany({})
  console.log('   ✓ Deleted all rooms')
  
  await prisma.user.deleteMany({})
  console.log('   ✓ Deleted all users')
  
  console.log('✅ Database cleared!')
  console.log('\n🌱 Seeding fresh data...')

  // Create Admin User (Email Kampus)
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      nama: 'Administrator',
      email: 'admin@unsil.ac.id',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create Second Admin User (for testing)
  const admin2Password = await hash('admin123', 10)
  const admin2 = await prisma.user.create({
    data: {
      nama: 'Staff Admin',
      email: 'staff@unsil.ac.id',
      password: admin2Password,
      role: 'ADMIN',
    },
  })
  console.log('✅ Second admin user created:', admin2.email)

  // Create Sample Student Users
  const studentPassword = await hash('student123', 10)
  const student = await prisma.user.create({
    data: {
      nama: 'Mahasiswa Demo',
      email: 'mahasiswa@student.unsil.ac.id',
      password: studentPassword,
      role: 'MAHASISWA',
    },
  })
  console.log('✅ Student user created:', student.email)

  // Create Test Student User
  const student2Password = await hash('test123', 10)
  const student2 = await prisma.user.create({
    data: {
      nama: 'Test Student',
      email: 'test@student.unsil.ac.id',
      password: student2Password,
      role: 'MAHASISWA',
    },
  })
  console.log('✅ Test student user created:', student2.email)

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
    const created = await prisma.room.create({
      data: room,
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
  console.log('   • test@student.unsil.ac.id / test123')
  console.log('\n🔐 Google OAuth Login (STRICT DOMAIN):')
  console.log('   • ✅ Staff emails (@unsil.ac.id) → ADMIN role')
  console.log('   • ✅ Student emails (@student.unsil.ac.id) → MAHASISWA role')
  console.log('   • ❌ Gmail accounts (@gmail.com) → DITOLAK')
  console.log('   • ❌ Email domain lain → DITOLAK')
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
