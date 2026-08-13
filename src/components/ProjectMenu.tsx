import React, { useState, useRef, useEffect } from 'react';
import { Menu, Save, Upload, Download, Settings, LayoutGrid, Info } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';

export function ProjectMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const toJSON = useStore(state => state.toJSON);
  const loadFromJSON = useStore(state => state.loadFromJSON);
  const setShowSettings = useStore(state => state.setShowSettings);
  const setShowAboutModal = useStore(state => state.setShowAboutModal);
  const currentProjectId = useStore(state => state.currentProjectId);
  const setCurrentProjectId = useStore(state => state.setCurrentProjectId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleExportJSON = async () => {
    if (!toJSON) return;
    const json = await toJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script-mage-project.json';
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !loadFromJSON) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        loadFromJSON(json);
      } catch (err) {
        console.error('Failed to parse Project JSON', err);
        alert('Invalid Project File');
      }
    };
    reader.readAsText(file);
    setIsOpen(false);
  };
  
  const handleSaveToLocalStorage = async () => {
    if (!toJSON || !currentProjectId) return;
    try {
      const stored = localStorage.getItem('motion-projects');
      let projects = stored ? JSON.parse(stored) : [];
      const projectIndex = projects.findIndex((p: any) => p.id === currentProjectId);
      
      const projectData = {
        id: currentProjectId,
        name: `Project ${currentProjectId.substring(0, 4)}`,
        lastModified: Date.now(),
        data: await toJSON()
      };

      if (projectIndex >= 0) {
        projectData.name = projects[projectIndex].name;
        projects[projectIndex] = projectData;
      } else {
        projects.push(projectData);
      }
      
      localStorage.setItem('motion-projects', JSON.stringify(projects));
      alert('Project saved successfully.');
    } catch (e) {
      console.error(e);
      alert('Failed to save project.');
    }
    setIsOpen(false);
  };
  
  const handleBackToProjects = () => {
    useStore.getState().setIsPlaying(false);
    setCurrentProjectId(null);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center justify-center z-50" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-12 h-12 sm:w-14 sm:h-14 bg-button-bg text-text-main border border-panel-border rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-10 ${isOpen ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white' : 'hover:bg-button-hover'}`}
        title="Project Menu"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[100%] left-0 mb-4 z-[100] w-[200px] glass-panel p-2 rounded-[24px] shadow-2xl max-h-[50vh] sm:max-h-[60vh] overflow-y-auto custom-scrollbar origin-bottom-left"
          >
          <div className="flex flex-col gap-1.5 w-full relative group/tools">
            <button 
              onClick={handleBackToProjects} 
              className="w-full h-10 sm:h-12 px-3 bg-button-bg text-text-main rounded-xl flex items-center gap-3 hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
            >
              <LayoutGrid size={18} />
              <span>Projects</span>
            </button>
            <button 
              onClick={handleSaveToLocalStorage} 
              className="w-full h-10 sm:h-12 px-3 bg-button-bg text-text-main rounded-xl flex items-center gap-3 hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
            >
              <Save size={18} />
              <span>Save Project</span>
            </button>

            <label className="w-full h-10 sm:h-12 px-3 bg-button-bg text-text-main rounded-xl flex items-center gap-3 hover:bg-button-hover hover:text-text-main transition-colors cursor-pointer text-xs font-semibold m-0">
               <Upload size={18} />
               <span>Import JSON</span>
               <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
            </label>
            <button 
              onClick={handleExportJSON} 
              className="w-full h-10 sm:h-12 px-3 bg-button-bg text-text-main rounded-xl flex items-center gap-3 hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
            >
              <Download size={18} />
              <span>Export JSON</span>
            </button>
            <button 
              onClick={() => {
                setShowAboutModal(true);
                setIsOpen(false);
              }} 
              className="w-full h-10 sm:h-12 px-3 bg-button-bg text-text-main rounded-xl flex items-center justify-center gap-2 hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold uppercase tracking-wider mt-1 border border-panel-border/50" 
            >
              <Info size={16} /> <span>About Script Mage</span>
            </button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
