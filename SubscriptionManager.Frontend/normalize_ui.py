import os
import glob
import re

files = glob.glob('src/features/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Standardize text inputs, selects, textareas
    # Find things like className="w-full ... transition-all" or className="w-full px-4 py-2.5 bg-[#F6F9FC] border border-[#E3E8EE] rounded-md focus:outline-none focus:ring-0 focus:border-[#635BFF] text-[#0A2540] transition-all"
    # We will replace them by looking for specific patterns of input classes.
    # Most modal inputs have w-full px-4 py-2.5 or w-full px-3 py-2.
    content = re.sub(r'className="w-full px-\d+ py-[\d\.]+ [^"]+"', 'className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"', content)
    
    # 2. Standardize modal cancel buttons
    # px-5 py-2.5 text-sm font-medium flex items-center gap-2 text-[#425466] bg-transparent hover:bg-[#F6F9FC] border-2 border-[#E3E8EE] rounded-md transition-colors
    content = re.sub(r'className="px-\d+ py-[\d\.]+ text-sm font-medium flex items-center gap-2 text-\[#425466\] bg-transparent hover:bg-\[#F6F9FC\] border-?2? border-\[#E3E8EE\] [^"]+"', 'className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-[#425466] bg-white border border-[#E3E8EE] rounded-md shadow-sm hover:bg-[#F6F9FC] transition-colors"', content)
    
    # 3. Standardize modal primary buttons
    # px-5 py-2.5 text-sm font-medium flex items-center gap-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm
    content = re.sub(r'className="px-\d+ py-[\d\.]+ text-sm font-medium flex items-center gap-2 text-\[#635BFF\] bg-\[#F6F9FC\] hover:bg-\[#0A2540\] border border-transparent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"', 'className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-white bg-[#635BFF] hover:bg-[#0A2540] border border-transparent rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"', content)
    
    # Also I recently used text-indigo-700 bg-indigo-50... for modal buttons! Let's standardize ALL primary submit buttons
    content = re.sub(r'className="px-\d+ py-[\d\.]+ text-sm font-medium flex items-center gap-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200\s*rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"', 'className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-white bg-[#635BFF] hover:bg-[#0A2540] border border-transparent rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"', content)
    
    # 4. Standardize header "Add" buttons
    content = re.sub(r'className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md transition-all text-sm font-medium shadow-sm active:scale-95"', 'className="flex items-center justify-center gap-2 px-4 py-2 bg-[#635BFF] hover:bg-[#0A2540] text-white border border-transparent rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors text-sm font-medium active:scale-95"', content)
    
    # 5. Dashboard filters/actions
    content = re.sub(r'className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-\[#425466\] bg-white border border-\[#E3E8EE\] rounded-lg hover:bg-\[#F6F9FC\] transition-colors"', 'className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#425466] bg-white border border-[#E3E8EE] rounded-md shadow-sm hover:bg-[#F6F9FC] transition-colors"', content)

    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Done")
