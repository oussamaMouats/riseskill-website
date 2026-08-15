import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Mot de passe oublié</h1>
      {/* TODO: wire to Supabase Auth password reset (emailed via Resend) */}
      <form className="space-y-3">
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          type="email"
          placeholder="Email"
        />
        <Button type="submit" className="w-full">
          Réinitialiser
        </Button>
      </form>
    </div>
  );
}
