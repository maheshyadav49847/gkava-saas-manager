import os
import glob
import re

files = glob.glob('src/**/*.tsx', recursive=True)

# Define replacements for colorful outline UI
replacements = {
    # Buttons (previously slate outline -> colored outline)
    'bg-transparent hover:bg-slate-50 text-slate-900 border border-slate-200': 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200',
    'bg-transparent py-2 px-4 text-sm font-medium text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50': 'bg-indigo-50 py-2 px-4 text-sm font-medium text-indigo-700 border border-indigo-200 shadow-sm hover:bg-indigo-100',
    
    # Active Tabs or Links
    'text-slate-900 shadow-sm border border-slate-200/60': 'text-indigo-700 shadow-sm border border-indigo-200/60',
    '"text-slate-900" : "text-slate-400 group-hover:text-slate-600"': '"text-indigo-600" : "text-slate-400 group-hover:text-slate-600"',
    
    # Header icons
    'p-2.5 bg-white border border-slate-200 rounded-md shadow-sm text-slate-700 shrink-0': 'p-2.5 bg-indigo-50 border border-indigo-200 rounded-md shadow-sm text-indigo-600 shrink-0',
    
    # Dashboard icons/boxes
    'bg-slate-50 border border-slate-100 rounded-md text-slate-900': 'bg-indigo-50 border border-indigo-100 rounded-md text-indigo-600',
    'bg-slate-50 text-slate-900 rounded-full flex items-center justify-center shrink-0 border border-slate-100/50': 'bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0 border border-indigo-100/50',
    
    # Focus rings (bring color back to inputs)
    'focus:border-slate-900': 'focus:border-indigo-500',
    'focus:ring-slate-900': 'focus:ring-indigo-500/20',
    'focus-within:border-slate-900': 'focus-within:border-indigo-500',
    'focus-within:ring-slate-900': 'focus-within:ring-indigo-500/20',
    
    # Brand (restore colorful brand)
    'w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-[0_2px_10px_rgba(79,70,229,0.2)] shrink-0': 'w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_2px_10px_rgba(79,70,229,0.2)] shrink-0',
}

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Done")
