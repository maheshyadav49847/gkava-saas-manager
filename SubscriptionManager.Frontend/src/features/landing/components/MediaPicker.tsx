import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, Upload, X } from 'lucide-react';

interface MediaPickerProps {
  iconValue?: string;
  imageUrlValue?: string;
  onChange: (type: 'icon' | 'image', value: string) => void;
}

// Get all icon names from lucide-react
const allIconNames = Object.keys(LucideIcons).filter(
  name => /^[A-Z]/.test(name) && name !== 'LucideProvider' && !name.endsWith('Icon') && typeof (LucideIcons as any)[name] === 'object'
);

export const MediaPicker = ({ iconValue, imageUrlValue, onChange }: MediaPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'icons' | 'upload'>('icons');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter icons based on search (limit to 100 for performance if no search)
  const filteredIcons = useMemo(() => {
    if (!searchQuery) return allIconNames.slice(0, 100);
    return allIconNames
      .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 100); // Still limit to prevent UI freezing
  }, [searchQuery]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to Base64 to store in database config
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      onChange('image', base64String);
      setIsOpen(false);
    };
    reader.readAsDataURL(file);
  };

  // Determine current preview
  let CurrentIcon = null;
  if (iconValue && (LucideIcons as any)[iconValue]) {
    CurrentIcon = (LucideIcons as any)[iconValue];
  }

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 bg-white border border-slate-200 rounded text-sm hover:border-indigo-400 transition-colors"
      >
        <div className="flex items-center gap-3">
          {imageUrlValue ? (
            <img src={imageUrlValue} alt="Custom" className="w-6 h-6 object-contain rounded bg-slate-50" />
          ) : CurrentIcon ? (
            <div className="w-6 h-6 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded">
              <CurrentIcon className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-400 rounded">
              ?
            </div>
          )}
          <span className="font-bold text-slate-700 truncate max-w-[150px]">
            {imageUrlValue ? 'Custom Image' : iconValue ? iconValue : 'Select Media...'}
          </span>
        </div>
        <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded">Change</span>
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              className={`flex-1 py-3 text-xs font-bold ${activeTab === 'icons' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('icons')}
            >
              Lucide Icons
            </button>
            <button
              className={`flex-1 py-3 text-xs font-bold ${activeTab === 'upload' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload Custom
            </button>
            <button onClick={() => setIsOpen(false)} className="p-3 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeTab === 'icons' && (
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 1000+ icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                {filteredIcons.map(name => {
                  const Icon = (LucideIcons as any)[name];
                  const isActive = iconValue === name && !imageUrlValue;
                  return (
                    <button
                      key={name}
                      title={name}
                      onClick={() => {
                        onChange('icon', name);
                        setIsOpen(false);
                      }}
                      className={`aspect-square flex items-center justify-center rounded-lg border-2 transition-all ${isActive ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
              {!searchQuery && <p className="text-center text-[10px] text-slate-400 mt-2">Showing first 100 icons. Search to find more.</p>}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="p-6">
              <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">
                <Upload className="w-8 h-8 text-indigo-500 mb-3" />
                <span className="text-sm font-bold text-slate-700 mb-1">Click to upload</span>
                <span className="text-xs font-medium text-slate-500 text-center">SVG, PNG, or JPG<br/>(Stores directly in DB)</span>
                <input
                  type="file"
                  accept=".svg, .png, .jpg, .jpeg"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              
              {imageUrlValue && (
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-xs font-bold text-slate-500 mb-2">Current Upload:</p>
                  <img src={imageUrlValue} alt="Preview" className="h-16 object-contain rounded bg-slate-50 border border-slate-200" />
                  <button 
                    onClick={() => {
                      onChange('image', '');
                    }}
                    className="mt-2 text-xs text-red-600 font-bold hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
