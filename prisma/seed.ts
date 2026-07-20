import "dotenv/config";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  ChannelStatus,
  ChannelType,
  DayOfWeek,
  MemberRole,
  MemberStatus,
  PlanCode,
  SubscriptionStatus,
} from "./generated/enums";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin@123", 10);

  const freePlan = await prisma.plan.upsert({
    where: { code: PlanCode.FREE },
    update: {
      name: "Free",
      maxServices: 10,
      maxCollaborators: 0,
      customDomainEnabled: false,
      reportsLevel: 1,
      priceMonthly: "0",
      priceYearly: "0",
    },
    create: {
      code: PlanCode.FREE,
      name: "Free",
      maxServices: 10,
      maxCollaborators: 0,
      customDomainEnabled: false,
      reportsLevel: 1,
      priceMonthly: "0",
      priceYearly: "0",
    },
  });

  await prisma.plan.upsert({
    where: { code: PlanCode.PRO },
    update: {
      name: "Pro",
      maxServices: null,
      maxCollaborators: 5,
      customDomainEnabled: false,
      reportsLevel: 2,
      priceMonthly: "49.90",
      priceYearly: "499.00",
    },
    create: {
      code: PlanCode.PRO,
      name: "Pro",
      maxServices: null,
      maxCollaborators: 5,
      customDomainEnabled: false,
      reportsLevel: 2,
      priceMonthly: "49.90",
      priceYearly: "499.00",
    },
  });

  await prisma.plan.upsert({
    where: { code: PlanCode.PREMIUM },
    update: {
      name: "Premium",
      maxServices: null,
      maxCollaborators: null,
      customDomainEnabled: true,
      reportsLevel: 3,
      priceMonthly: "99.90",
      priceYearly: "999.00",
    },
    create: {
      code: PlanCode.PREMIUM,
      name: "Premium",
      maxServices: null,
      maxCollaborators: null,
      customDomainEnabled: true,
      reportsLevel: 3,
      priceMonthly: "99.90",
      priceYearly: "999.00",
    },
  });

  const barbershopType = await prisma.businessType.upsert({
    where: { slug: "barbearia" },
    update: {
      name: "Barbearia",
      description: "Barbeiros, cortes masculinos e cuidados com barba.",
    },
    create: {
      name: "Barbearia",
      slug: "barbearia",
      description: "Barbeiros, cortes masculinos e cuidados com barba.",
    },
  });

  await prisma.businessType.upsert({
    where: { slug: "salao-de-beleza" },
    update: {
      name: "Salão de beleza",
      description: "Cabeleireiros, manicures e serviços de beleza.",
    },
    create: {
      name: "Salão de beleza",
      slug: "salao-de-beleza",
      description: "Cabeleireiros, manicures e serviços de beleza.",
    },
  });

  const additionalBusinessTypes = [
    {
      name: "Clínica de estética",
      slug: "clinica-de-estetica",
      description: "Procedimentos estéticos faciais e corporais.",
    },
    {
      name: "Esmalteria",
      slug: "esmalteria",
      description: "Manicure, pedicure e cuidados com as unhas.",
    },
    {
      name: "Estúdio de tatuagem",
      slug: "estudio-de-tatuagem",
      description: "Tatuagens, piercings e procedimentos relacionados.",
    },
    {
      name: "Massoterapia",
      slug: "massoterapia",
      description: "Massagens terapêuticas, relaxantes e esportivas.",
    },
    {
      name: "Pet shop",
      slug: "pet-shop",
      description: "Banho, tosa e cuidados para animais de estimação.",
    },
    {
      name: "Podologia",
      slug: "podologia",
      description: "Tratamentos e cuidados especializados com os pés.",
    },
    {
      name: "Spa",
      slug: "spa",
      description: "Bem-estar, relaxamento e tratamentos corporais.",
    },
    {
      name: "Personal trainer",
      slug: "personal-trainer",
      description: "Treinos personalizados e acompanhamento físico.",
    },
  ];

  for (const businessType of additionalBusinessTypes) {
    await prisma.businessType.upsert({
      where: { slug: businessType.slug },
      update: {
        name: businessType.name,
        description: businessType.description,
      },
      create: businessType,
    });
  }

  const haircutIllustration = await prisma.serviceIllustration.upsert({
    where: { id: "seed-haircut-illustration" },
    update: {
      businessTypeId: barbershopType.id,
      title: "Corte de cabelo",
      imageUrl: "/images/services/haircut.svg",
      isActive: true,
    },
    create: {
      id: "seed-haircut-illustration",
      businessTypeId: barbershopType.id,
      title: "Corte de cabelo",
      imageUrl: "/images/services/haircut.svg",
      isActive: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: {
      email: "admin@gmail.com",
    },
    update: {
      firstName: "Admin",
      lastName: "Admin",
      passwordHash,
      preferences: {
        upsert: {
          update: {
            language: "pt-BR",
            timezone: "America/Sao_Paulo",
            currency: "BRL",
            theme: "light",
          },
          create: {
            language: "pt-BR",
            timezone: "America/Sao_Paulo",
            currency: "BRL",
            theme: "light",
          },
        },
      },
    },
    create: {
      firstName: "Admin",
      lastName: "Admin",
      email: "admin@gmail.com",
      passwordHash,
      preferences: {
        create: {
          language: "pt-BR",
          timezone: "America/Sao_Paulo",
          currency: "BRL",
          theme: "light",
        },
      },
    },
  });

  const business = await prisma.business.upsert({
    where: { slug: "barbearia-admin" },
    update: {
      name: "Barbearia Admin",
      description: "Ambiente demo para testar o fluxo de agendamento.",
      logoUrl: "https://res.cloudinary.com/dp0qcuzkq/image/upload/v1784556371/agendaai/business-logos/cmr5n1swc00004gvz5yxatbnx/c6qk8fc68awzbsailnis.webp",
      bannerUrl: "/images/demo/banner.jpg",
      phone: "(21) 99999-9999",
      businessTypeId: barbershopType.id,
    },
    create: {
      name: "Barbearia Admin",
      slug: "barbearia-admin",
      description: "Ambiente demo para testar o fluxo de agendamento.",
      logoUrl: "/images/demo/logo.svg",
      bannerUrl: "/images/demo/banner.jpg",
      phone: "(21) 99999-9999",
      businessTypeId: barbershopType.id,
    },
  });

  const ownerMember = await prisma.businessMember.upsert({
    where: {
      businessId_userId: {
        businessId: business.id,
        userId: adminUser.id,
      },
    },
    update: {
      role: MemberRole.OWNER,
      status: MemberStatus.ACTIVE,
      displayName: "Admin",
    },
    create: {
      businessId: business.id,
      userId: adminUser.id,
      role: MemberRole.OWNER,
      status: MemberStatus.ACTIVE,
      displayName: "Admin",
    },
  });

  await prisma.businessSubscription.upsert({
    where: { businessId: business.id },
    update: {
      planId: freePlan.id,
      status: SubscriptionStatus.ACTIVE,
      startsAt: new Date(),
      endsAt: null,
      trialEndsAt: null,
    },
    create: {
      businessId: business.id,
      planId: freePlan.id,
      status: SubscriptionStatus.ACTIVE,
      startsAt: new Date(),
    },
  });

  await prisma.businessLayout.upsert({
    where: { businessId: business.id },
    update: {
      primaryColor: "#0e0b16",
      secondaryColor: "#4b3c79",
      theme: "default",
      settings: {
        fontFamily: "Poppins",
      },
    },
    create: {
      businessId: business.id,
      primaryColor: "#0e0b16",
      secondaryColor: "#4b3c79",
      theme: "default",
      settings: {
        fontFamily: "Poppins",
      },
    },
  });

  await prisma.businessAddress.upsert({
    where: { businessId: business.id },
    update: {
      address: "Rua das Amendoeiras",
      number: "317",
      complement: "Casa 20A",
      neighborhood: "Cosmos",
      city: "Rio de Janeiro",
      state: "RJ",
      zip: "20000-000",
      country: "Brasil",
      latitude: "-22.9068467",
      longitude: "-43.1728965",
    },
    create: {
      businessId: business.id,
      address: "Rua das Amendoeiras",
      number: "317",
      complement: "Casa 20A",
      neighborhood: "Cosmos",
      city: "Rio de Janeiro",
      state: "RJ",
      zip: "20000-000",
      country: "Brasil",
      latitude: "-22.9068467",
      longitude: "-43.1728965",
    },
  });

  const channels = [
    {
      type: ChannelType.WHATSAPP,
      channel: "(21) 99999-9999",
    },
    {
      type: ChannelType.INSTAGRAM,
      channel: "@barbeariaadmin",
    },
    {
      type: ChannelType.FACEBOOK,
      channel: "barbeariaadmin",
    },
  ];

  for (const channel of channels) {
    await prisma.businessChannel.upsert({
      where: {
        businessId_type: {
          businessId: business.id,
          type: channel.type,
        },
      },
      update: {
        channel: channel.channel,
        status: ChannelStatus.ACTIVE,
      },
      create: {
        businessId: business.id,
        type: channel.type,
        channel: channel.channel,
        status: ChannelStatus.ACTIVE,
      },
    });
  }

  const workingHours = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
  ];

  for (const dayOfWeek of workingHours) {
    await prisma.businessWorkingHour.upsert({
      where: {
        businessId_dayOfWeek: {
          businessId: business.id,
          dayOfWeek,
        },
      },
      update: {
        startMinutes: 540,
        endMinutes: 1080,
        breakStartMinutes: 720,
        breakEndMinutes: 780,
        isActive: true,
      },
      create: {
        businessId: business.id,
        dayOfWeek,
        startMinutes: 540,
        endMinutes: 1080,
        breakStartMinutes: 720,
        breakEndMinutes: 780,
        isActive: true,
      },
    });
  }

  for (const dayOfWeek of [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY]) {
    await prisma.businessWorkingHour.upsert({
      where: {
        businessId_dayOfWeek: {
          businessId: business.id,
          dayOfWeek,
        },
      },
      update: {
        startMinutes: 540,
        endMinutes: 780,
        breakStartMinutes: null,
        breakEndMinutes: null,
        isActive: dayOfWeek === DayOfWeek.SATURDAY,
      },
      create: {
        businessId: business.id,
        dayOfWeek,
        startMinutes: 540,
        endMinutes: 780,
        breakStartMinutes: null,
        breakEndMinutes: null,
        isActive: dayOfWeek === DayOfWeek.SATURDAY,
      },
    });
  }

  const haircutService = await prisma.service.upsert({
    where: {
      businessId_slug: {
        businessId: business.id,
        slug: "corte-de-cabelo",
      },
    },
    update: {
      name: "Corte de cabelo",
      description: "Corte masculino completo.",
      illustrationId: haircutIllustration.id,
      durationMinutes: 45,
      price: "50.00",
      isActive: true,
      position: 1,
    },
    create: {
      businessId: business.id,
      illustrationId: haircutIllustration.id,
      name: "Corte de cabelo",
      slug: "corte-de-cabelo",
      description: "Corte masculino completo.",
      durationMinutes: 45,
      price: "50.00",
      isActive: true,
      position: 1,
    },
  });

  const additionalServices = await Promise.all(
    [
      {
        name: "Barba tradicional",
        slug: "barba-tradicional",
        description: "Modelagem e acabamento completo da barba.",
        durationMinutes: 30,
        price: "35.00",
        position: 2,
      },
      {
        name: "Corte e barba",
        slug: "corte-e-barba",
        description: "Combo completo de corte masculino e barba.",
        durationMinutes: 75,
        price: "80.00",
        position: 3,
      },
    ].map((service) =>
      prisma.service.upsert({
        where: {
          businessId_slug: {
            businessId: business.id,
            slug: service.slug,
          },
        },
        update: {
          name: service.name,
          description: service.description,
          illustrationId: haircutIllustration.id,
          durationMinutes: service.durationMinutes,
          price: service.price,
          isActive: true,
          position: service.position,
        },
        create: {
          businessId: business.id,
          illustrationId: haircutIllustration.id,
          ...service,
          isActive: true,
        },
      }),
    ),
  );

  for (const service of [haircutService, ...additionalServices]) {
    await prisma.serviceAssignment.upsert({
      where: {
        serviceId_memberId: {
          serviceId: service.id,
          memberId: ownerMember.id,
        },
      },
      update: {
        isActive: true,
      },
      create: {
        serviceId: service.id,
        memberId: ownerMember.id,
        isActive: true,
      },
    });
  }

  console.log(
    `Created/updated user: ${adminUser.firstName} ${adminUser.lastName}`,
  );
  console.log(`Created/updated business: ${business.name}`);
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
