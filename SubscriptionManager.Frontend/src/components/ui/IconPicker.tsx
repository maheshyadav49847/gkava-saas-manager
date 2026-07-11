import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search } from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

const ALL_ICONS = Object.keys(LucideIcons).filter(
  key => 
    key.charAt(0) === key.charAt(0).toUpperCase() && 
    key !== 'LucideProps' && 
    key !== 'IconNode' &&
    key !== 'LucideProvider' &&
    typeof (LucideIcons as any)[key] === 'object' &&
    (LucideIcons as any)[key] !== null
);

// A curated list of popular icons to show by default
const POPULAR_ICONS = [
  'Layers', 'Layout', 'Settings', 'Users', 'Database', 'Server', 'Shield', 
  'Lock', 'Key', 'CreditCard', 'ShoppingCart', 'Box', 'Package', 'Briefcase',
  'FileText', 'Folder', 'Mail', 'MessageSquare', 'Phone', 'Video', 'Camera',
  'Image', 'Music', 'Play', 'CheckCircle', 'AlertCircle', 'Info', 'HelpCircle',
  'Star', 'Heart', 'Zap', 'Activity', 'TrendingUp', 'BarChart', 'PieChart',
  'Calendar', 'Clock', 'Globe', 'Map', 'Navigation', 'Compass', 'Home',
  'Building', 'Store', 'Truck', 'Coffee', 'Cpu', 'Monitor', 'Smartphone'
];

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = search.trim() === ''
    ? POPULAR_ICONS.filter(icon => ALL_ICONS.includes(icon))
    : ALL_ICONS.filter(icon => icon.toLowerCase().includes(search.toLowerCase())).slice(0, 200);

  const CurrentIcon = (LucideIcons as any)[value] || LucideIcons.Layers;

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
      >
        <CurrentIcon size={24} className="text-gray-700" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-14 left-0 z-50 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1 pb-1">
              {filteredIcons.map(iconName => {
                const IconComp = (LucideIcons as any)[iconName];
                if (!IconComp) return null;
                
                return (
                  <button
                    key={iconName}
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                    }}
                    title={iconName}
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                      value === iconName 
                        ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' 
                        : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <IconComp size={20} />
                  </button>
                );
              })}
              {filteredIcons.length === 0 && (
                <div className="col-span-5 text-center py-4 text-sm text-gray-500">
                  No icons found.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
