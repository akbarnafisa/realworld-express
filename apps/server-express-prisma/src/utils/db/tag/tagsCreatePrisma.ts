import prisma from "../prisma";

export default async function tagsCreatePrisma(tags: Array<string>) {
  const createdTags = [];
  for (const tag of tags) {
    createdTags.push(
      await prisma.tags.upsert({
        create: { name: tag },
        where: { name: tag },
        update: {},
      })
    );
  }
  return createdTags;
}