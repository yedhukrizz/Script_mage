import React from 'react';
import { useStore } from '../store/useStore';
import { Type, Image as ImageIcon, Square, Circle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function Sidebar() {
  const addElement = useStore((state) => state.addElement);
  const duration = useStore((state) => state.duration);

  const handleAddText = () => {
    addElement({
      id: uuidv4(),
      type: 'text',
      content: 'Double click to edit',
      x: 100, y: 100, width: 300, height: 80,
      rotation: 0, opacity: 1,
      startTime: 0, endTime: duration,
      animationIn: 'none', animationOut: 'none', easing: 'linear',
      color: '#ffffff', fontSize: 48
    });
  };

  const handleAddShape = (shapeType: string) => {
    addElement({
      id: uuidv4(),
      type: 'shape',
      content: shapeType,
      x: 100, y: 100, width: 200, height: 200,
      rotation: 0, opacity: 1,
      startTime: 0, endTime: duration,
      animationIn: 'none', animationOut: 'none', easing: 'linear',
      color: '#3b82f6'
    });
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addElement({
        id: uuidv4(),
        type: 'image',
        content: url,
        x: 100, y: 100, width: 400, height: 400,
        rotation: 0, opacity: 1,
        startTime: 0, endTime: duration,
        animationIn: 'none', animationOut: 'none', easing: 'linear'
      });
    }
  };

  return (
    <aside className="w-16 md:w-64 border-r border-panel-border bg-panel-bg flex flex-col items-center md:items-start py-4 gap-2 shrink-0">
      <div className="px-4 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:block mb-2">Add Elements</div>
      <button onClick={handleAddText} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-button-bg transition-colors text-text-main hover:text-text-main">
        <Type size={20} />
        <span className="hidden md:inline">Text</span>
      </button>
      <label className="w-full flex items-center gap-3 px-4 py-3 hover:bg-button-bg transition-colors cursor-pointer text-text-main hover:text-text-main">
        <ImageIcon size={20} />
        <span className="hidden md:inline">Image</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
      </label>
      <button onClick={() => handleAddShape('rectangle')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-button-bg transition-colors text-text-main hover:text-text-main">
        <Square size={20} />
        <span className="hidden md:inline">Rectangle</span>
      </button>
      <button onClick={() => handleAddShape('circle')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-button-bg transition-colors text-text-main hover:text-text-main">
        <Circle size={20} />
        <span className="hidden md:inline">Circle</span>
      </button>
    </aside>
  );
}
