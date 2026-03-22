import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FolderPlus, Folder, Trash2, Plus, Check, X, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface TestResult {
  id: string;
  provider: string;
  model: string;
  success: boolean;
  response_time: number;
  status_code: number | null;
  error: string | null;
  created_at: string;
}

interface ProjectModeProps {
  onSaveResult?: (projectId: string) => void;
  currentResult?: {
    provider: string;
    model: string;
    success: boolean;
    responseTime: number;
    statusCode?: number;
    error?: string;
  } | null;
}

export function ProjectMode({ currentResult }: ProjectModeProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  useEffect(() => {
    if (selectedProject) fetchResults(selectedProject);
  }, [selectedProject]);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  const fetchResults = async (projectId: string) => {
    const { data } = await supabase.from("project_test_results").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
    if (data) setResults(data);
  };

  const createProject = async () => {
    if (!newName.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase.from("projects").insert({ name: newName.trim(), user_id: user.id });
    if (error) toast.error("Failed to create project");
    else {
      toast.success("Project created!");
      setNewName("");
      setShowCreate(false);
      fetchProjects();
    }
    setLoading(false);
  };

  const deleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    if (selectedProject === id) { setSelectedProject(null); setResults([]); }
    fetchProjects();
    toast.success("Project deleted");
  };

  const saveResultToProject = async (projectId: string) => {
    if (!currentResult) return;
    const { error } = await supabase.from("project_test_results").insert({
      project_id: projectId,
      provider: currentResult.provider,
      model: currentResult.model,
      success: currentResult.success,
      response_time: currentResult.responseTime,
      status_code: currentResult.statusCode ?? null,
      error: currentResult.error ?? null,
    });
    if (error) toast.error("Failed to save result");
    else {
      toast.success("Result saved to project!");
      if (selectedProject === projectId) fetchResults(projectId);
    }
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/40 p-6 text-center">
        <Folder className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-30" />
        <p className="text-xs text-muted-foreground">Sign in to use Project Mode</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Projects</label>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/20 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
        >
          <FolderPlus className="w-3 h-3" />
          New Project
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Project name..."
                className="flex-1 bg-secondary/20 rounded-lg px-3 py-2 text-xs text-foreground outline-none border border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/40"
                onKeyDown={(e) => e.key === "Enter" && createProject()}
              />
              <button onClick={createProject} disabled={loading} className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                Create
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-card/40 p-6 text-center">
          <Folder className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-30" />
          <p className="text-xs text-muted-foreground">No projects yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className={`rounded-xl border p-3 transition-colors cursor-pointer ${
              selectedProject === p.id ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card/40 hover:border-border"
            }`}>
              <div className="flex items-center justify-between" onClick={() => setSelectedProject(selectedProject === p.id ? null : p.id)}>
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {currentResult && (
                    <button
                      onClick={(e) => { e.stopPropagation(); saveResultToProject(p.id); }}
                      className="p-1 rounded text-muted-foreground hover:text-success transition-colors"
                      title="Save current result here"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                    className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedProject === p.id ? "rotate-90" : ""}`} />
                </div>
              </div>

              <AnimatePresence>
                {selectedProject === p.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3 space-y-2"
                  >
                    {results.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-3">No test results saved</p>
                    ) : (
                      results.map((r) => (
                        <div key={r.id} className="flex items-center justify-between bg-secondary/20 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            {r.success ? <Check className="w-3 h-3 text-success" /> : <X className="w-3 h-3 text-destructive" />}
                            <span className="text-xs font-medium text-foreground">{r.provider}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{r.model}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{r.response_time}ms</span>
                            <Clock className="w-3 h-3" />
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
