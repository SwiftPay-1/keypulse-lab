import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, Camera, Loader2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (userId: string) => {
    if (!avatarFile) return null;
    const ext = avatarFile.name.split('.').pop();
    const path = `${userId}/avatar.${ext}`;
    const { error } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login successful!");
        navigate("/");
      } else {
        if (!username.trim()) { toast.error("Username is required"); setLoading(false); return; }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (error) throw error;

        if (data.user && avatarFile) {
          const avatarUrl = await uploadAvatar(data.user.id);
          if (avatarUrl) {
            await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('user_id', data.user.id);
          }
        }

        toast.success("Account created! Check your email to verify.");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">KeyPulse</h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Sign in to continue" : "Sign up to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Upload (signup only) */}
            {!isLogin && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="relative w-20 h-20 rounded-full border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors overflow-hidden bg-secondary/20 flex items-center justify-center group"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
            )}

            {/* Username (signup only) */}
            {!isLogin && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Username</label>
                <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 px-4 py-3 focus-within:border-primary/50 transition-colors">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Email</label>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 px-4 py-3 focus-within:border-primary/50 transition-colors">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Password</label>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 px-4 py-3 focus-within:border-primary/50 transition-colors">
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 transition-all"
              style={{ background: "linear-gradient(135deg, hsl(263.4, 70%, 50.4%), hsl(199, 89%, 48%))" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </motion.button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
