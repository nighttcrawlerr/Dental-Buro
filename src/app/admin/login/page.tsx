import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin/leads");

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-8 py-10">
      <h1 className="font-display text-heading-sm text-ink">Вход для администратора</h1>
      <LoginForm />
    </div>
  );
}
