import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create cities
  const delhi = await prisma.city.create({
    data: { name: "Delhi", slug: "delhi" }
  })
  const mumbai = await prisma.city.create({
    data: { name: "Mumbai", slug: "mumbai" }
  })
  const bangalore = await prisma.city.create({
    data: { name: "Bangalore", slug: "bangalore" }
  })
  const chennai = await prisma.city.create({
    data: { name: "Chennai", slug: "chennai" }
  })

  // Create V1 Kits per CLAUDE.md §3
  // Reels: ₹1,499 - Smartphone gimbal, ring light, lapel mic, backdrop
  await prisma.kit.create({
    data: {
      name: "Reels",
      description: "Smartphone gimbal, ring light, lapel mic, backdrop",
      dailyPrice: 149900, // ₹1,499 in paise
      category: "Reels",
      city: { connect: { id: delhi.id } }
    }
  })

  // Vlog: ₹1,999 - Camera, shotgun mic, tripod, portable light
  await prisma.kit.create({
    data: {
      name: "Vlog",
      description: "Camera, shotgun mic, tripod, portable light",
      dailyPrice: 199900, // ₹1,999 in paise
      category: "Vlog",
      city: { connect: { id: mumbai.id } }
    }
  })

  // Portrait: ₹2,499 - DSLR, prime lens, strobe, reflector, backdrop
  await prisma.kit.create({
    data: {
      name: "Portrait",
      description: "DSLR, prime lens, strobe, reflector, backdrop",
      dailyPrice: 249900, // ₹2,499 in paise
      category: "Portrait",
      city: { connect: { id: bangalore.id } }
    }
  })

  // Podcast: ₹2,999 - Audio interface, two XLR mics, headphones, pop filters
  await prisma.kit.create({
    data: {
      name: "Podcast",
      description: "Audio interface, two XLR mics, headphones, pop filters",
      dailyPrice: 299900, // ₹2,999 in paise
      category: "Podcast",
      city: { connect: { id: chennai.id } }
    }
  })

  console.log("Seed completed: V1 kits created")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })