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
    <div className="absolute left-4 sm:left-6 bottom-4 sm:bottom-6 flex flex-col-reverse items-start gap-3 z-50" ref={ref}>
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
            className="glass-panel p-2 rounded-[24px] shadow-2xl mb-2 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto custom-scrollbar max-w-[calc(100vw-2rem)]"
          >
          <div className="grid grid-cols-2 gap-1 w-full relative group/tools">
            <button 
              onClick={handleBackToProjects} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
              title="Back to Projects"
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={handleSaveToLocalStorage} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
              title="Save Project"
            >
              <Save size={20} />
            </button>

            <label className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors cursor-pointer" title="Import JSON">
               <Upload size={20} />
               <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
            </label>
            <button 
              onClick={handleExportJSON} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
              title="Export JSON"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => {
                setShowAboutModal(true);
                setIsOpen(false);
              }} 
              className="col-span-2 w-full h-10 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center gap-2 hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold uppercase tracking-wider" 
              title="About Script Mage"
            >
              <Info size={16} /> About
            </button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
