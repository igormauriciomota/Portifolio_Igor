import { getChatGPTUser, isPortfolioAdmin } from "../chatgpt-auth";

export async function requireWriteUser() {
  const user = await getChatGPTUser();
  if (!user) {
    return {
      user: null,
      response: Response.json(
        { error: "Entre com sua conta para alterar o portfólio." },
        { status: 401 },
      ),
    };
  }

  if (!isPortfolioAdmin(user)) {
    return {
      user: null,
      response: Response.json(
        { error: "Somente o proprietário pode alterar este portfólio." },
        { status: 403 },
      ),
    };
  }

  return { user, response: null };
}

export function optionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function requiredText(value: unknown, field: string) {
  const parsed = optionalText(value);
  if (!parsed) throw new Error(`O campo ${field} é obrigatório.`);
  return parsed;
}

export function safeUrl(value: unknown) {
  const parsed = optionalText(value);
  if (!parsed) return null;
  const url = new URL(parsed);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Use um link iniciado por https:// ou http://.");
  }
  return url.toString();
}

export function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Não foi possível concluir a operação.";
  return Response.json({ error: message }, { status: 400 });
}
