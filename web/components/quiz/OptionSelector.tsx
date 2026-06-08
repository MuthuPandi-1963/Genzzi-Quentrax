import React from "react";

interface OptionSelectorProps {
  options: { id: string; text: string }[];
  selectedId: string | null;
  onChange: (id: string) => void;
  isMulti?: boolean;
}

export default function OptionSelector({ options, selectedId, onChange, isMulti = false }: OptionSelectorProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all ${
              isSelected 
                ? "border-purple-500 bg-purple-50 dark:bg-purple-500/10" 
                : "border-black/5 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 bg-white dark:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center border-2 ${isMulti ? 'rounded' : 'rounded-full'} ${
                isSelected ? "border-purple-500" : "border-gray-300 dark:border-gray-600"
              }`}>
                {isSelected && (
                  <div className={`w-2.5 h-2.5 bg-purple-500 ${isMulti ? 'rounded-sm' : 'rounded-full'}`} />
                )}
              </div>
              <span className={`text-lg ${isSelected ? "text-purple-900 dark:text-purple-100 font-medium" : "text-gray-700 dark:text-gray-300"}`}>
                {option.text}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
