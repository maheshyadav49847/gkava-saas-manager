import os
file='src/features/plans/components/PlansList.tsx'
with open(file, 'r', encoding='utf-8') as f: content=f.read()
content=content.replace('className={`relative flex flex-col p-8 bg-white  rounded-md border shadow-sm transition-all duration-300 hover:shadow-xl ${', 'className={`relative flex flex-col p-8 bg-white rounded-2xl border transition-all duration-300 ${')
content=content.replace('"border-indigo-300 shadow-indigo-500/10 scale-105 z-10 ring-2 ring-indigo-500/20"', '"border-[#635BFF] shadow-[0_12px_32px_rgba(99,91,255,0.15)] scale-105 z-10 ring-1 ring-[#635BFF]"')
content=content.replace('"border-[#E3E8EE]  hover:border-[#E3E8EE]"', '"border-[#E3E8EE] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"')
content=content.replace('bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-sm', 'bg-[#635BFF] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-[0_2px_8px_rgba(99,91,255,0.3)]')
content=content.replace('"bg-white hover:bg-[#F6F9FC] text-[#425466] border border-[#E3E8EE] shadow-sm"', '"bg-white hover:bg-[#F6F9FC] text-[#0A2540] font-medium border border-[#E3E8EE] rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.04)] transition-all"')
content=content.replace('bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 shadow-sm', 'bg-white hover:bg-rose-50 text-rose-600 font-medium border border-rose-200 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.04)] transition-all')
content=content.replace('text-5xl font-extrabold tracking-tight', 'text-5xl font-extrabold tracking-tighter text-[#0A2540]')
with open(file, 'w', encoding='utf-8') as f: f.write(content)
