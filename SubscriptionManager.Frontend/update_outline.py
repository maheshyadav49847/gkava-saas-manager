import os
import re

files_info = [
    {
        'path': 'src/features/applications/components/ApplicationList.tsx',
        'title': 'Applications',
        'desc': 'Manage your independent SaaS applications and API keys.',
        'icon': 'LayoutGrid',
        'btn_text': 'Add Application',
        'btn_action': 'setIsModalOpen(true)'
    },
    {
        'path': 'src/features/tenants/components/TenantsList.tsx',
        'title': 'Tenants',
        'desc': 'Manage your customers and their active subscriptions.',
        'icon': 'Users',
        'btn_text': 'Add Tenant',
        'btn_action': 'setIsCreateModalOpen(true)'
    },
    {
        'path': 'src/features/plans/components/PlansList.tsx',
        'title': 'Pricing Plans',
        'desc': 'Manage the subscription plans offered across your SaaS applications.',
        'icon': 'ListTodo',
        'btn_text': 'Add Plan',
        'btn_action': 'setIsCreateModalOpen(true)'
    },
    {
        'path': 'src/features/coupons/components/CouponsList.tsx',
        'title': 'Coupons & Discounts',
        'desc': 'Manage promotional codes and discounts for your subscriptions.',
        'icon': 'Tag',
        'btn_text': 'Add Coupon',
        'btn_action': 'setIsCreateModalOpen(true)'
    },
    {
        'path': 'src/features/team-members/components/TeamMembersList.tsx',
        'title': 'Team Members',
        'desc': 'Manage the people displayed on the website About Us page.',
        'icon': 'Users',
        'btn_text': 'Add Member',
        'btn_action': 'handleAdd'
    },
]

for info in files_info:
    try:
        with open(info['path'], 'r', encoding='utf-8') as f:
            content = f.read()

        header_block = f'''    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-white border border-slate-200 rounded-md shadow-sm text-slate-700 shrink-0">
            <{info['icon']} className="w-6 h-6" strokeWidth={{1.5}} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{info['title']}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {info['desc']}
            </p>
          </div>
        </div>
        <button 
          onClick={{() => {info['btn_action']}}}
          className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-md transition-all text-sm font-medium shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" strokeWidth={{1.5}} /> {info['btn_text']}
        </button>
      </div>'''

        pattern = r'<div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">.*?</button>\s*</div>'
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, header_block, content, count=1, flags=re.DOTALL)
        else:
            print(f"Could not find replacement pattern in {info['path']}")

        with open(info['path'], 'w', encoding='utf-8') as f:
            f.write(content)
            
    except Exception as e:
        print(f"Error in {info['path']}: {e}")

try:
    with open('src/features/settings/components/Settings.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    settings_header = '''    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-white border border-slate-200 rounded-md shadow-sm text-slate-700 shrink-0">
            <SettingsIcon className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Account Settings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your personal profile and platform preferences.
            </p>
          </div>
        </div>
      </div>'''

    pattern = r'<div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">.*?</div>\s*</div>'
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, settings_header, content, count=1, flags=re.DOTALL)
    
    with open('src/features/settings/components/Settings.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
except Exception as e:
    print(f"Error in Settings: {e}")

print("Done")
