import React from 'react';

export const ThickSlider = ({ label, value, min, max, step = 1, onChange, onChangeStart, onChangeEnd, unit = '' }: any) => {
  const handleStart = (e: any) => {
    if (onChangeStart) onChangeStart(e);
  };
  const handleEnd = (e: any) => {
    if (onChangeEnd) onChangeEnd(e);
  };

  return (
    <div className="flex flex-col gap-2 mb-4 w-full">
      <div className="flex justify-between items-center text-xs text-text-muted font-medium px-1">
        <span>{label}</span>
        <span className="font-mono text-text-main">{typeof value === 'number' ? Math.round(value * 100) / 100 : value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))} 
        onPointerDown={handleStart}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        className="w-full h-6 bg-button-bg hover:bg-button-hover rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text-main [&::-webkit-slider-thumb]:shadow-md cursor-pointer transition-all active:[&::-webkit-slider-thumb]:scale-90 relative z-[100]" 
      />
    </div>
  );
};
