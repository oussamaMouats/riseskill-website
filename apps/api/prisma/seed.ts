import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: "developpement" },
    update: {},
    create: {
      slug: "developpement",
      name: "Développement",
      icon: "💻",
      description: "Web, mobile, back-end — apprenez à construire de vraies applications.",
    },
  });

  const course = await prisma.course.upsert({
    where: { slug: "full-stack-web-development" },
    update: {},
    create: {
      slug: "full-stack-web-development",
      title: "Full Stack Web Development",
      tagline: "De l'interface à la base de données",
      description:
        "Apprenez à construire des applications web complètes, de l'interface à la base de données.",
      categoryId: category.id,
      level: "Débutant",
      techStack: ["HTML5", "CSS3", "JavaScript", "React", "Node.js"],
      objectives: [
        "Construire des pages web responsives",
        "Créer des composants React réutilisables",
        "Connecter une interface à une API",
      ],
      published: true,
    },
  });

  await prisma.courseOffering.upsert({
    where: { courseId_format: { courseId: course.id, format: "IN_PERSON" } },
    update: {},
    create: { courseId: course.id, format: "IN_PERSON", price: 45000, durationLabel: "4 mois" },
  });
  await prisma.courseOffering.upsert({
    where: { courseId_format: { courseId: course.id, format: "ONLINE_LIVE" } },
    update: {},
    create: { courseId: course.id, format: "ONLINE_LIVE", price: 38000, durationLabel: "3 mois" },
  });
  await prisma.courseOffering.upsert({
    where: { courseId_format: { courseId: course.id, format: "ONLINE_SELF_PACED" } },
    update: {},
    create: {
      courseId: course.id,
      format: "ONLINE_SELF_PACED",
      price: 22000,
      durationLabel: "Accès 6 mois",
    },
  });

  const module1 = await prisma.courseModule.create({
    data: { courseId: course.id, title: "HTML & CSS", orderIndex: 1 },
  });

  await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: "Structurer une page avec HTML",
      content: "Introduction aux balises sémantiques et à la structure d'une page web.",
      orderIndex: 1,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
