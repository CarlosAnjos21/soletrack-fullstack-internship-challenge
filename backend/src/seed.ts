import { prisma } from "./database/prisma";
import bcrypt from "bcrypt";

async function seed() {
  const password = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Carlos Admin",
      email: "admin@admin.com",
      password,
      role: "ADMIN"
    }
  });

  const sizesValues = [38, 39, 40, 41, 42];

  const sizes = [];
  for (const value of sizesValues) {
    const size = await prisma.size.upsert({
      where: { value },
      update: {},
      create: { value }
    });
    sizes.push(size);
  }

  const brands = [
    { id: "NK-SPORT-001", name: "Nike Runner", category: "Running" },
    { id: "AD-SPORT-002", name: "Adidas Boost", category: "Running" },
    { id: "MZ-SPORT-003", name: "Mizuno Wave", category: "Running" },
    { id: "OK-SPORT-004", name: "Oakley Street", category: "Casual" }
  ];

  const colors = [
    { color: "Black", sole: "White", code: "BLK-WHT" },
    { color: "Red", sole: "Black", code: "RED-BLK" },
    { color: "Blue", sole: "White", code: "BLU-WHT" },
    { color: "Green", sole: "Black", code: "GRN-BLK" }
  ];

  const models = [];

  for (const brand of brands) {
    const model = await prisma.shoeModel.upsert({
      where: { id: brand.id },
      update: {},
      create: {
        id: brand.id,
        name: brand.name,
        category: brand.category,
        base_cost: 120
      }
    });

    models.push(model);
  }

  const variants = [];

  for (const model of models) {
    for (let i = 0; i < 4; i++) {
      const c = colors[i];

      const sku = `${model.id}-${c.code}`;

      const variant = await prisma.shoeVariant.upsert({
        where: { sku },
        update: {},
        create: {
          model_id: model.id,
          color: c.color,
          sole_color: c.sole,
          sku
        }
      });

      variants.push(variant);
    }
  }

  for (const variant of variants) {
    for (const size of sizes) {
      await prisma.stock.upsert({
        where: {
          variant_id_size_id: {
            variant_id: variant.id,
            size_id: size.id
          }
        },
        update: {},
        create: {
          variant_id: variant.id,
          size_id: size.id,
          quantity: Math.floor(Math.random() * 20) + 1
        }
      });
    }
  }

  let opCount = 1;

  const inProgressVariants = variants.slice(0, 9);

  for (const variant of inProgressVariants) {
    for (let i = 0; i < 4; i++) {
      const size = sizes[i];

      await prisma.productionOrder.create({
        data: {
          id: `OP-2026-${String(opCount++).padStart(3, "0")}`,
          variant_id: variant.id,
          size_id: size.id,
          quantity_planned: 50,
          quantity_produced: Math.floor(Math.random() * 30),
          status: "IN_PROGRESS",
          start_date: new Date()
        }
      });
    }
  }

  const plannedVariant = variants[10];
  const plannedSize = sizes[0];

  await prisma.productionOrder.create({
    data: {
      id: `OP-2026-${String(opCount++).padStart(3, "0")}`,
      variant_id: plannedVariant.id,
      size_id: plannedSize.id,
      quantity_planned: 40,
      quantity_produced: 0,
      status: "PLANNED"
    }
  });

  const completedVariants = variants.slice(11, 16);

  for (const variant of completedVariants) {
    for (let i = 0; i < 2; i++) {
      const size = sizes[i];

      await prisma.productionOrder.create({
        data: {
          id: `OP-2026-${String(opCount++).padStart(3, "0")}`,
          variant_id: variant.id,
          size_id: size.id,
          quantity_planned: 30,
          quantity_produced: 30,
          status: "COMPLETED",
          start_date: new Date(),
          end_date: new Date()
        }
      });
    }
  }

  console.log("✅ Seed completo executado");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());