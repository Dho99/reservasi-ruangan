import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/prisma/src/generated/prisma/client"

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function testConnection() {
  console.log('🔍 Testing Prisma Client connection...\n')

  try {
    // Test 1: Count users
    const userCount = await prisma.user.count()
    console.log(`✅ Total users in database: ${userCount}`)

    // Test 2: Get all users
    const users = await prisma.user.findMany({
      select: {
        nama: true,
        email: true,
        role: true,
      }
    })
    console.log('\n📋 Users:')
    users.forEach(user => {
      console.log(`   - ${user.nama} (${user.email}) - ${user.role}`)
    })

    // Test 3: Count rooms
    const roomCount = await prisma.room.count()
    console.log(`\n✅ Total rooms in database: ${roomCount}`)

    // Test 4: Get all rooms
    const rooms = await prisma.room.findMany({
      select: {
        nama: true,
        kapasitas: true,
        lokasi: true,
      }
    })
    console.log('\n🏢 Rooms:')
    rooms.forEach(room => {
      console.log(`   - ${room.nama} (Kapasitas: ${room.kapasitas}) - ${room.lokasi}`)
    })

    console.log('\n✅ Prisma Client is working correctly!')
  } catch (error) {
    console.error('❌ Error testing Prisma Client:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

