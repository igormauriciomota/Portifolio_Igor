import { requirePortfolioAdmin, chatGPTSignOutPath } from "../chatgpt-auth";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

async function ProtectedAdmin() {
  const user = await requirePortfolioAdmin("/admin");
  return <AdminPanel userName={user.displayName} userEmail={user.email} signOutPath={chatGPTSignOutPath("/")} />;
}

export default function AdminPage() {
  return <ProtectedAdmin />;
}
