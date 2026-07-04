import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Handlebars from "handlebars";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

type RenderTemplateInput = {
  template: string;
  data: Record<string, unknown>;
};

async function renderTemplate(input: RenderTemplateInput) {
  const templatePath = join(
    process.cwd(),
    "server",
    "modules",
    "email",
    "templates",
    `${input.template}.hbs`,
  );

  const templateContent = await readFile(templatePath, "utf-8");
  const compiledTemplate = Handlebars.compile(templateContent);

  return compiledTemplate(input.data);
}

export const emailService = {
  async send(input: SendEmailInput) {
    const { sendMail } = useNodeMailer();

    return sendMail({
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
  },

  async sendRegisterEmail(input: {
    to: string;
    name?: string | null;
    registerUrl: string;
  }) {
    const html = await renderTemplate({
      template: "register",
      data: {
        name: input.name,
        registerUrl: input.registerUrl,
        year: new Date().getFullYear(),
      },
    });
    return this.send({
      to: input.to,
      subject: "Confirmação de cadastro - LinkStore",
      html,
      text: `Acesse o link para confirmar seu cadastro: ${input.registerUrl}`,
    });
  },

  async sendResetPasswordEmail(input: {
    to: string;
    name?: string | null;
    resetUrl: string;
  }) {
    const html = await renderTemplate({
      template: "reset-password",
      data: {
        name: input.name,
        resetUrl: input.resetUrl,
        year: new Date().getFullYear(),
      },
    });

    return this.send({
      to: input.to,
      subject: "Recuperação de senha - LinkStore",
      html,
      text: `Acesse o link para redefinir sua senha: ${input.resetUrl}`,
    });
  },
};
