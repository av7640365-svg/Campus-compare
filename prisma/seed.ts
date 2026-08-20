import "dotenv/config";

import { prisma } from "../lib/prisma";

async function main() {
  // =========================
  // Purana college-related data delete
  // =========================
  await prisma.cutoff.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  // =========================
  // Helper Function
  // =========================
  async function createCollege(
    name: string,
    city: string,
    state: string,
    collegeType: string,
    establishedYear: number,
    description: string,
    website: string,
    course1: string,
    course2: string,
    fees: number,
    averagePackage: number,
    highestPackage: number,
    placementPercent: number,
    overall: number,
    academics: number,
    infrastructure: number,
    placementRating: number,
    campusLife: number,
    exam: string,
    course1OpeningRank: number,
    course1ClosingRank: number,
    course2OpeningRank: number,
    course2ClosingRank: number
  ) {
    const college = await prisma.college.create({
      data: {
        name,
        city,
        state,
        collegeType,
        establishedYear,
        description,
        website,

        courses: {
          create: [
            {
              name: course1,
              degree: "B.Tech",
              duration: "4 Years",
              fees,
            },
            {
              name: course2,
              degree: "B.Tech",
              duration: "4 Years",
              fees,
            },
          ],
        },

        placements: {
          create: {
            averagePackage,
            highestPackage,
            placementPercent,
          },
        },

        ratings: {
          create: {
            overall,
            academics,
            infrastructure,
            placements: placementRating,
            campusLife,
          },
        },
      },

      include: {
        courses: true,
      },
    });

    await prisma.cutoff.createMany({
      data: [
        {
          exam,
          category: "OPEN",
          openingRank: course1OpeningRank,
          closingRank: course1ClosingRank,
          year: 2025,
          collegeId: college.id,
          courseId: college.courses[0].id,
        },
        {
          exam,
          category: "OPEN",
          openingRank: course2OpeningRank,
          closingRank: course2ClosingRank,
          year: 2025,
          collegeId: college.id,
          courseId: college.courses[1].id,
        },
      ],
    });

    console.log(`${name} added successfully`);
  }

  // =========================
  // 1. IIT Delhi
  // =========================
  await createCollege(
    "Indian Institute of Technology Delhi",
    "New Delhi",
    "Delhi",
    "Government",
    1961,
    "One of India's leading engineering and technology institutes known for academics, research and innovation.",
    "https://home.iitd.ac.in",
    "Computer Science and Engineering",
    "Electrical Engineering",
    800000,
    22,
    80,
    95,
    4.8,
    4.9,
    4.7,
    4.9,
    4.6,
    "JEE Advanced",
    1,
    120,
    150,
    600
  );

  // =========================
  // 2. IIT Bombay
  // =========================
  await createCollege(
    "Indian Institute of Technology Bombay",
    "Mumbai",
    "Maharashtra",
    "Government",
    1958,
    "A premier engineering institute known for strong academics, research and innovation.",
    "https://www.iitb.ac.in",
    "Computer Science and Engineering",
    "Mechanical Engineering",
    900000,
    21,
    75,
    94,
    4.8,
    4.9,
    4.8,
    4.9,
    4.8,
    "JEE Advanced",
    1,
    70,
    500,
    1800
  );

  // =========================
  // 3. IIT Madras
  // =========================
  await createCollege(
    "Indian Institute of Technology Madras",
    "Chennai",
    "Tamil Nadu",
    "Government",
    1959,
    "A leading technology institute known for engineering education, research and innovation.",
    "https://www.iitm.ac.in",
    "Computer Science and Engineering",
    "Electrical Engineering",
    850000,
    21,
    65,
    94,
    4.8,
    4.9,
    4.8,
    4.8,
    4.7,
    "JEE Advanced",
    1,
    170,
    200,
    800
  );

  // =========================
  // 4. IIT Kanpur
  // =========================
  await createCollege(
    "Indian Institute of Technology Kanpur",
    "Kanpur",
    "Uttar Pradesh",
    "Government",
    1959,
    "A premier institute known for science, engineering and advanced research.",
    "https://www.iitk.ac.in",
    "Computer Science and Engineering",
    "Mechanical Engineering",
    850000,
    20,
    60,
    93,
    4.7,
    4.8,
    4.7,
    4.8,
    4.6,
    "JEE Advanced",
    1,
    250,
    800,
    2500
  );

  // =========================
  // 5. IIT Kharagpur
  // =========================
  await createCollege(
    "Indian Institute of Technology Kharagpur",
    "Kharagpur",
    "West Bengal",
    "Government",
    1951,
    "One of India's oldest and largest IITs with strong engineering and research programs.",
    "https://www.iitkgp.ac.in",
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
    820000,
    18,
    55,
    91,
    4.7,
    4.8,
    4.6,
    4.7,
    4.7,
    "JEE Advanced",
    1,
    400,
    500,
    1500
  );

  // =========================
  // 6. IIT Roorkee
  // =========================
  await createCollege(
    "Indian Institute of Technology Roorkee",
    "Roorkee",
    "Uttarakhand",
    "Government",
    1847,
    "A prestigious institute with strong engineering, research and technology programs.",
    "https://www.iitr.ac.in",
    "Computer Science and Engineering",
    "Electrical Engineering",
    800000,
    17,
    50,
    90,
    4.6,
    4.8,
    4.6,
    4.7,
    4.5,
    "JEE Advanced",
    1,
    500,
    600,
    1800
  );

  // =========================
  // 7. IIT Guwahati
  // =========================
  await createCollege(
    "Indian Institute of Technology Guwahati",
    "Guwahati",
    "Assam",
    "Government",
    1994,
    "A major IIT in North East India known for technology, research and innovation.",
    "https://www.iitg.ac.in",
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
    750000,
    16,
    45,
    89,
    4.6,
    4.7,
    4.6,
    4.6,
    4.7,
    "JEE Advanced",
    1,
    700,
    800,
    2200
  );

  // =========================
  // 8. NIT Trichy
  // =========================
  await createCollege(
    "National Institute of Technology Tiruchirappalli",
    "Tiruchirappalli",
    "Tamil Nadu",
    "Government",
    1964,
    "One of India's top National Institutes of Technology with strong academics and placements.",
    "https://www.nitt.edu",
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
    600000,
    15,
    52,
    90,
    4.6,
    4.7,
    4.5,
    4.6,
    4.5,
    "JEE Main",
    500,
    2500,
    2000,
    7000
  );

  // =========================
  // 9. NIT Surathkal
  // =========================
  await createCollege(
    "National Institute of Technology Karnataka",
    "Surathkal",
    "Karnataka",
    "Government",
    1960,
    "A top NIT known for engineering education, research and coastal campus life.",
    "https://www.nitk.ac.in",
    "Computer Science and Engineering",
    "Information Technology",
    650000,
    14,
    48,
    88,
    4.5,
    4.6,
    4.6,
    4.5,
    4.7,
    "JEE Main",
    1000,
    4000,
    3000,
    9000
  );

  // =========================
  // 10. NIT Warangal
  // =========================
  await createCollege(
    "National Institute of Technology Warangal",
    "Warangal",
    "Telangana",
    "Government",
    1959,
    "A prestigious NIT with strong academics and engineering placements.",
    "https://www.nitw.ac.in",
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
    620000,
    13,
    45,
    87,
    4.5,
    4.6,
    4.5,
    4.5,
    4.5,
    "JEE Main",
    1500,
    5000,
    4000,
    12000
  );

  // =========================
  // 11. NIT Rourkela
  // =========================
  await createCollege(
    "National Institute of Technology Rourkela",
    "Rourkela",
    "Odisha",
    "Government",
    1961,
    "A well-known NIT with strong technical education and research facilities.",
    "https://www.nitrkl.ac.in",
    "Computer Science and Engineering",
    "Electrical Engineering",
    600000,
    12,
    42,
    86,
    4.4,
    4.5,
    4.5,
    4.4,
    4.4,
    "JEE Main",
    2000,
    8000,
    6000,
    18000
  );

  // =========================
  // 12. MNNIT Allahabad
  // =========================
  await createCollege(
    "Motilal Nehru National Institute of Technology Allahabad",
    "Prayagraj",
    "Uttar Pradesh",
    "Government",
    1961,
    "A prominent National Institute of Technology in Uttar Pradesh.",
    "https://www.mnnit.ac.in",
    "Computer Science and Engineering",
    "Information Technology",
    600000,
    12,
    40,
    85,
    4.4,
    4.5,
    4.3,
    4.5,
    4.4,
    "JEE Main",
    4000,
    12000,
    8000,
    25000
  );

  // =========================
  // 13. DTU
  // =========================
  await createCollege(
    "Delhi Technological University",
    "New Delhi",
    "Delhi",
    "Government",
    1941,
    "A leading Delhi engineering university with strong industry connections.",
    "https://dtu.ac.in",
    "Computer Science and Engineering",
    "Information Technology",
    900000,
    13,
    50,
    90,
    4.5,
    4.4,
    4.6,
    4.6,
    4.7,
    "JEE Main",
    3000,
    15000,
    7000,
    25000
  );

  // =========================
  // 14. NSUT
  // =========================
  await createCollege(
    "Netaji Subhas University of Technology",
    "New Delhi",
    "Delhi",
    "Government",
    1983,
    "A major engineering university in Delhi known for technology and placements.",
    "https://www.nsut.ac.in",
    "Computer Science and Engineering",
    "Information Technology",
    850000,
    12,
    45,
    89,
    4.4,
    4.4,
    4.5,
    4.5,
    4.6,
    "JEE Main",
    5000,
    18000,
    10000,
    30000
  );

  // =========================
  // 15. KNIT Sultanpur
  // =========================
  await createCollege(
    "Kamla Nehru Institute of Technology",
    "Sultanpur",
    "Uttar Pradesh",
    "Government",
    1976,
    "A government engineering institute located in Sultanpur, Uttar Pradesh.",
    "https://knit.ac.in",
    "Information Technology",
    "Computer Science and Engineering",
    250000,
    6.5,
    20,
    75,
    4.0,
    4.1,
    3.8,
    3.9,
    4.0,
    "JEE Main",
    30000,
    60000,
    25000,
    55000
  );

  // =========================
  // 16. AKGEC
  // =========================
  await createCollege(
    "Ajay Kumar Garg Engineering College",
    "Ghaziabad",
    "Uttar Pradesh",
    "Private",
    1998,
    "A well-known private engineering college in Uttar Pradesh.",
    "https://www.akgec.ac.in",
    "Computer Science and Engineering",
    "Information Technology",
    700000,
    7,
    35,
    85,
    4.2,
    4.1,
    4.2,
    4.0,
    4.3,
    "JEE Main",
    60000,
    150000,
    70000,
    180000
  );

  // =========================
  // 17. JSSATE Noida
  // =========================
  await createCollege(
    "JSS Academy of Technical Education",
    "Noida",
    "Uttar Pradesh",
    "Private",
    1998,
    "A private engineering college located in Noida.",
    "https://jssaten.ac.in",
    "Computer Science and Engineering",
    "Information Technology",
    650000,
    6,
    28,
    82,
    4.1,
    4.0,
    4.1,
    4.0,
    4.2,
    "JEE Main",
    90000,
    220000,
    100000,
    250000
  );

  // =========================
  // 18. GL Bajaj
  // =========================
  await createCollege(
    "G. L. Bajaj Institute of Technology and Management",
    "Greater Noida",
    "Uttar Pradesh",
    "Private",
    2005,
    "A private engineering college located in Greater Noida.",
    "https://www.glbitm.ac.in",
    "Computer Science and Engineering",
    "Information Technology",
    700000,
    6.5,
    30,
    84,
    4.1,
    4.0,
    4.2,
    4.1,
    4.2,
    "JEE Main",
    80000,
    200000,
    100000,
    250000
  );

  // =========================
  // 19. ABES Engineering College
  // =========================
  await createCollege(
    "ABES Engineering College",
    "Ghaziabad",
    "Uttar Pradesh",
    "Private",
    2000,
    "A private engineering college offering technology and engineering programs.",
    "https://www.abes.ac.in",
    "Computer Science and Engineering",
    "Information Technology",
    750000,
    6,
    25,
    80,
    4.0,
    4.0,
    4.1,
    3.9,
    4.2,
    "JEE Main",
    100000,
    250000,
    120000,
    280000
  );

  // =========================
  // 20. Galgotias College
  // =========================
  await createCollege(
    "Galgotias College of Engineering and Technology",
    "Greater Noida",
    "Uttar Pradesh",
    "Private",
    2000,
    "A private engineering college in Greater Noida.",
    "https://www.galgotiacollege.edu",
    "Computer Science and Engineering",
    "Information Technology",
    700000,
    5.5,
    25,
    78,
    4.0,
    3.9,
    4.1,
    3.9,
    4.1,
    "JEE Main",
    120000,
    300000,
    150000,
    350000
  );

  console.log("=================================");
  console.log("Database seeded successfully!");
  console.log("Total colleges added: 20");
  console.log("=================================");
}

main()
  .catch((error) => {
    console.error("SEED ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });