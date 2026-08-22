import os
import glob
import re

files = glob.glob('src/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Text colors
    content = content.replace('text-indigo-600', 'text-slate-900')
    content = content.replace('text-indigo-500', 'text-slate-700')
    content = content.replace('hover:text-indigo-600', 'hover:text-slate-900')
    content = content.replace('hover:text-indigo-500', 'hover:text-slate-700')
    
    # Backgrounds
    content = content.replace('bg-indigo-600', 'bg-slate-900')
    content = content.replace('bg-indigo-500', 'bg-slate-800')
    content = content.replace('bg-indigo-50', 'bg-slate-50')
    content = content.replace('bg-indigo-100', 'bg-slate-100')
    content = content.replace('hover:bg-indigo-700', 'hover:bg-slate-800')
    content = content.replace('hover:bg-indigo-600', 'hover:bg-slate-900')
    content = content.replace('hover:bg-indigo-50', 'hover:bg-slate-100')
    
    # Borders and Rings
    content = content.replace('border-indigo-600', 'border-slate-900')
    content = content.replace('border-indigo-500', 'border-slate-300')
    content = content.replace('border-indigo-200', 'border-slate-200')
    content = content.replace('border-indigo-100', 'border-slate-100')
    content = content.replace('hover:border-indigo-500', 'hover:border-slate-400')
    content = content.replace('hover:border-indigo-300', 'hover:border-slate-300')
    
    content = content.replace('focus:ring-indigo-500', 'focus:ring-slate-900')
    content = content.replace('focus:border-indigo-500', 'focus:border-slate-900')
    content = content.replace('focus-within:ring-indigo-500', 'focus-within:ring-slate-900')
    content = content.replace('focus-within:border-indigo-500', 'focus-within:border-slate-900')
    
    # Shadows
    content = content.replace('shadow-indigo-500/30', 'shadow-slate-500/10')
    content = content.replace('shadow-indigo-600/20', 'shadow-slate-900/10')
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
