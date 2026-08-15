import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { createSupabaseAdminClient } from "../src/config/supabase.config";

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD;

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set");
  }

  const supabase = createSupabaseAdminClient();
  const prisma = new PrismaClient();

  try {
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    let userId = existingUsers.users.find((u) => u.email === ADMIN_EMAIL)?.id;

    if (!userId) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (error || !data.user) {
        throw new Error(`Failed to create Supabase Auth user: ${error?.message}`);
      }
      userId = data.user.id;
      console.log(`Created Supabase Auth user ${ADMIN_EMAIL} (${userId})`);
    } else {
      console.log(`Supabase Auth user ${ADMIN_EMAIL} already exists (${userId})`);
    }

    await prisma.adminProfile.upsert({
      where: { id: userId },
      update: { email: ADMIN_EMAIL },
      create: { id: userId, email: ADMIN_EMAIL, fullName: "Admin RiseSkill" },
    });
    console.log(`AdminProfile ready for ${ADMIN_EMAIL}`);
    await prisma.$disconnect();
  } finally {
    // no-op
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
