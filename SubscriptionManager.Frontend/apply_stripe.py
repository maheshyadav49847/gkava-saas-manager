import os
import glob
import re

files = glob.glob('src/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Text colors
    content = content.replace('text-slate-900', 'text-[#0A2540]')
    content = content.replace('text-slate-800', 'text-[#0A2540]')
    content = content.replace('text-slate-700', 'text-[#425466]')
    content = content.replace('text-slate-600', 'text-[#425466]')
    content = content.replace('text-slate-500', 'text-[#425466]')
    
    # Borders
    content = content.replace('border-slate-200', 'border-[#E3E8EE]')
    content = content.replace('border-slate-300', 'border-[#E3E8EE]')
    content = content.replace('border-slate-100', 'border-[#E3E8EE]')
    
    # Backgrounds
    content = content.replace('bg-slate-50/50', 'bg-[#F6F9FC]')
    content = content.replace('bg-slate-50', 'bg-[#F6F9FC]')
    
    # Buttons (Primary) - we previously set them to indigo-50 outline or slate-900
    # Let's target the buttons we changed
    content = content.replace('bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm', 'bg-[#635BFF] hover:bg-[#0A2540] text-white rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.12)] border border-transparent transition-all')
    content = content.replace('bg-indigo-50 py-2 px-4 text-sm font-medium text-indigo-700 border border-indigo-200 shadow-sm hover:bg-indigo-100', 'bg-[#635BFF] hover:bg-[#0A2540] py-2 px-4 text-sm font-medium text-white rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.12)] border border-transparent transition-all')
    content = content.replace('bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md shadow-sm', 'bg-[#635BFF] hover:bg-[#0A2540] text-white rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.12)] border border-transparent transition-all')
    
    # Icons container
    content = content.replace('p-2.5 bg-indigo-50 border border-indigo-200 rounded-md shadow-sm text-indigo-600 shrink-0', 'p-3 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E3E8EE] text-[#635BFF] shrink-0')
    
    # Cards
    content = content.replace('bg-white  rounded-md border border-[#E3E8EE]  shadow-sm', 'bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E3E8EE]')
    
    # Dashboard Layout specific
    if 'DashboardLayout' in file:
        content = content.replace('bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-200/60', 'bg-white text-[#635BFF] shadow-[0_2px_5px_rgba(0,0,0,0.04)] border border-[#E3E8EE] font-semibold')
        content = content.replace('text-indigo-600', 'text-[#635BFF]')
        
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Done")
