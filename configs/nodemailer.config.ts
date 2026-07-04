export const nodemailerConfig = {
  from: process.env.NUXT_NODEMAILER_FROM,
  host: process.env.NUXT_NODEMAILER_HOST,
  port: Number(process.env.NUXT_NODEMAILER_PORT),
  secure: process.env.NUXT_NODEMAILER_SECURE === "true",
  auth: {
    user: process.env.NUXT_NODEMAILER_AUTH_USER,
    pass: process.env.NUXT_NODEMAILER_AUTH_PASS || "",
  },
};
