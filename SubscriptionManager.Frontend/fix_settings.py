import os
file = 'src/features/settings/components/Settings.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("'bg-[#F6F9FC]  text-indigo-700 '", "'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[#635BFF]'")
c = c.replace("'bg-[#F6F9FC] text-indigo-700 '", "'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[#635BFF]'")
c = c.replace("text-indigo-700", "text-[#635BFF]")
c = c.replace("text-slate-400", "text-[#425466]/60")

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
