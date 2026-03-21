import { Shield } from "lucide-react";

export function TrustBadge() {
  return (
    <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-success/5 border border-success/10">
      <Shield className="w-3.5 h-3.5 text-success" />
      <span className="text-[11px] text-success/80 font-medium">
        We do NOT store your API key — all tests run client-side
      </span>
    </div>
  );
}
