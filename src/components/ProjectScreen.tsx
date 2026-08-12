import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Settings, Plus, FileVideo, Clock, Trash2, Info, Edit2, Check, Copy } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { SettingsModal } from './SettingsModal';
import { AboutModal } from './AboutModal';

interface Project {
  id: string;
  name: string;
  lastModified: number;
  data: string;
}

export function ProjectScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  
  const setCurrentProjectId = useStore(state => state.setCurrentProjectId);
  const resetProject = useStore(state => state.resetProject);
  const loadFromJSON = useStore(state => state.loadFromJSON);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    try {
      const stored = localStorage.getItem('motion-projects');
      if (stored) {
        setProjects(JSON.parse(stored));
      } else {
        // Migration from old single save
        const oldSave = localStorage.getItem('motion-project-save');
        if (oldSave) {
          const defaultProj = {
            id: uuidv4(),
            name: 'Legacy Project',
            lastModified: Date.now(),
            data: oldSave
          };
          setProjects([defaultProj]);
          localStorage.setItem('motion-projects', JSON.stringify([defaultProj]));
        }
      }
    } catch (e) {
      console.error('Failed to load projects', e);
    }
  };

  const saveProjects = (newProjects: Project[]) => {
    localStorage.setItem('motion-projects', JSON.stringify(newProjects));
    setProjects(newProjects);
  };

  const handleNewProject = () => {
    const newId = uuidv4();
    resetProject(); // reset store to defaults
    setCurrentProjectId(newId);
  };

  const handleLoadProject = (project: Project) => {
    if (editingProjectId === project.id) return;
    loadFromJSON(project.data);
    setCurrentProjectId(project.id);
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      saveProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleDuplicateProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    const newProject = {
      ...project,
      id: uuidv4(),
      name: `${project.name} (Copy)`,
      lastModified: Date.now()
    };
    saveProjects([...projects, newProject]);
  };

  const handleStartEdit = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setEditName(project.name);
  };

  const handleSaveEdit = (e?: React.MouseEvent | React.KeyboardEvent, id?: string) => {
    if (e) e.stopPropagation();
    if (!id || !editName.trim()) {
      setEditingProjectId(null);
      return;
    }
    const updated = projects.map(p => p.id === id ? { ...p, name: editName.trim() } : p);
    saveProjects(updated);
    setEditingProjectId(null);
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-main flex flex-col items-center">
      <header className="w-full h-16 flex items-center justify-between px-6 bg-app-bg shrink-0 max-w-7xl relative z-10 pt-4">
        <div className="flex items-center px-2">
          <img src="/favicon.ico" alt="Script Mage" className="w-10 h-10 object-contain" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAbout(true)} className="w-10 h-10 rounded-full bg-button-bg border border-panel-border flex items-center justify-center text-text-muted hover:text-text-main hover:bg-button-hover transition-all" title="About">
            <Info size={18} />
          </button>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-button-bg border border-panel-border flex items-center justify-center text-text-muted hover:text-text-main hover:bg-button-hover transition-all" title="Settings">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <main className="w-full max-w-7xl flex-1 py-8 md:py-16 px-6 flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
          <p className="text-text-muted">Create a new motion video or pick up where you left off.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={handleNewProject}
            className="flex flex-col items-center justify-center border-2 border-dashed border-panel-border rounded-xl p-8 hover:bg-panel-bg hover:border-text-muted transition-all h-48 group gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="font-semibold text-text-main">New Project</span>
          </button>

          {projects.sort((a, b) => b.lastModified - a.lastModified).map(project => (
            <div 
              key={project.id}
              onClick={() => handleLoadProject(project)}
              className="bg-panel-bg border border-panel-border rounded-xl p-5 h-48 flex flex-col hover:border-text-muted cursor-pointer transition-all w-full group relative"
            >
              <div className="flex items-start justify-between mb-auto">
                <div className="w-10 h-10 rounded-lg bg-button-bg flex items-center justify-center text-[var(--color-accent)]">
                  <FileVideo size={20} />
                </div>
                <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleStartEdit(e, project)}
                    className="p-2 text-text-muted hover:text-text-main transition-colors rounded-lg hover:bg-button-hover"
                    title="Rename"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleDuplicateProject(e, project)}
                    className="p-2 text-text-muted hover:text-text-main transition-colors rounded-lg hover:bg-button-hover"
                    title="Duplicate"
                  >
                    <Copy size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteProject(e, project.id)}
                    className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {editingProjectId === project.id ? (
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveEdit(e, project.id);
                        if (e.key === 'Escape') setEditingProjectId(null);
                      }}
                      className="flex-1 bg-background border border-[var(--color-accent)] rounded px-2 py-1 text-sm font-semibold text-text-main outline-none"
                    />
                    <button onClick={(e) => handleSaveEdit(e, project.id)} className="text-[var(--color-accent)] p-1 hover:bg-[var(--color-accent)]/10 rounded">
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <h3 className="font-semibold text-lg text-text-main truncate pr-4">{project.name}</h3>
                )}
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Clock size={12} />
                  <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{new Date(project.lastModified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}
