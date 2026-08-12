import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Globe, Loader2, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { CustomSelect } from './CustomSelect';

interface TranslateModalProps {
  onClose: () => void;
}

export function TranslateModal({ onClose }: TranslateModalProps) {
  const elements = useStore((state) => state.elements);
  const updateElement = useStore((state) => state.updateElement);
  const addToast = useStore((state) => state.addToast);
  
  const [translateLang, setTranslateLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleTranslateAll = async () => {
    setIsTranslating(true);
    setLogs([]);
    addLog(`Starting translation to ${translateLang}...`);
    
    try {
      const textElements = elements.filter(el => el.type === 'text' && el.content.trim());
      
      if (textElements.length === 0) {
        addLog('No text elements found to translate.');
        setIsTranslating(false);
        return;
      }

      addLog(`Found ${textElements.length} text element(s).`);
      let successCount = 0;
      
      for (const el of textElements) {
        addLog(`Translating element: "${el.content.substring(0, 20)}${el.content.length > 20 ? '...' : ''}"`);
        try {
          const res = await fetch(`/api/translate?text=${encodeURIComponent(el.content)}&tl=${translateLang}`);
          if (res.ok) {
            const data = await res.json();
            if (data.translation) {
              updateElement(el.id, { 
                content: data.translation,
                ttsVoice: translateLang
              });
              addLog(`  -> Success: "${data.translation.substring(0, 20)}${data.translation.length > 20 ? '...' : ''}"`);
              successCount++;
            } else {
               addLog(`  -> Warning: No translation returned.`);
            }
          } else {
             addLog(`  -> Failed with status: ${res.status}`);
          }
        } catch (e: any) {
          addLog(`  -> Error: ${e.message}`);
          console.error(`Failed to translate element ${el.id}:`, e);
        }
      }
      
      addLog(`Finished! Successfully translated ${successCount} out of ${textElements.length} elements.`);
      addToast(`Translated ${successCount} text elements.`, 'success');
      
      // Delay closing to let user read the final logs
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (e: any) {
      addLog(`Fatal error during translation: ${e.message}`);
      console.error(e);
      addToast('Translation failed. Please try again.', 'error');
      setIsTranslating(false);
    } 
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-[#121214] border border-panel-border rounded-xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-4 border-b border-panel-border shrink-0">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-text-muted" />
            <h2 className="text-sm font-semibold text-text-main">Global Translation</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto min-h-0 space-y-6 flex-1">
          <div className="space-y-2">
            <label className="text-[10px] text-text-muted uppercase font-semibold">Target Language</label>
            <CustomSelect 
              value={translateLang}
              onChange={(val) => setTranslateLang(val)}
              options={[
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' },
                { value: 'hi', label: 'Hindi' },
                { value: 'ml', label: 'Malayalam' },
                { value: 'ta', label: 'Tamil' },
                { value: 'ja', label: 'Japanese' },
                { value: 'ko', label: 'Korean' },
                { value: 'zh-CN', label: 'Chinese (Simplified)' },
                { value: 'ru', label: 'Russian' },
                { value: 'ar', label: 'Arabic' },
                { value: 'pt', label: 'Portuguese' },
                { value: 'it', label: 'Italian' },
                { value: 'en', label: 'English' }
              ]}
            />
            <p className="text-xs text-text-muted mt-2">
              This will translate all text elements in your project to the selected language.
              The text-to-speech voice will also be updated to match the target language. Use the Global TTS button to recalculate audio timings.
            </p>
          </div>

          {(logs.length > 0 || isTranslating) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-muted">
                <Terminal size={14} />
                <span className="text-xs font-semibold">Process Logs</span>
              </div>
              <div className="bg-[#0a0a0a] border border-panel-border rounded-lg p-3 h-40 overflow-y-auto font-mono text-[10px] text-text-muted whitespace-pre-wrap">
                {logs.length === 0 ? (
                  <span className="text-text-muted/50">Waiting for process to start...</span>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="mb-1">{log}</div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-panel-border shrink-0 flex justify-end gap-3 bg-[#0a0a0a] rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isTranslating}
            className="px-4 py-2 text-sm font-medium text-text-muted hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={handleTranslateAll}
            disabled={isTranslating}
            className="px-5 py-2 bg-[var(--color-accent)] hover:bg-opacity-90 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isTranslating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Globe size={16} />
                Translate All
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
