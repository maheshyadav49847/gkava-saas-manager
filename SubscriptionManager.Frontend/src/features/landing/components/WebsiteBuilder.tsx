import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { MarketingLayout } from '../../../layouts/MarketingLayout';
import { LandingPage, AboutPage, ProductsPage, BookDemo, PrivacyPolicy, Terms } from '../index';
import { useWebsiteConfigStore } from '../store/useWebsiteConfigStore';
import { MediaPicker } from './MediaPicker';

type PageRoute = '/' | '/about' | '/products' | '/book-demo' | '/privacy' | '/terms';

export const WebsiteBuilder = () => {
  const { config, updateConfig, updateNestedConfig, isSaving, saveConfig, fetchConfig } = useWebsiteConfigStore();
  const [activePage, setActivePage] = useState<PageRoute>('/');
  const [activeTab, setActiveTab] = useState('hero');
  const [applications, setApplications] = useState<any[]>([]);

  // Fetch config and applications on mount
  useEffect(() => {
    fetchConfig();
    fetch('http://localhost:5048/api/applications')
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error('Failed to fetch applications:', err));
  }, [fetchConfig]);

  // Helper for updating fields
  const handleChange = (section: any, subsection: string, field: string, value: any) => {
    updateNestedConfig(section, subsection, { [field]: value });
  };

  // Render different forms based on activePage
  const renderSidebarContent = () => {
    switch (activePage) {
      case '/':
        return (
          <>
            <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 overflow-x-auto custom-scrollbar">
              {['hero', 'features', 'ecosystem', 'engineering', 'finalCta'].map(tab => (
                <button 
                  key={tab}
                  className={`px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="p-6 space-y-6">
              {activeTab === 'hero' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tagline</label>
                    <input type="text" value={config.landing.hero.tagline} onChange={(e) => handleChange('landing', 'hero', 'tagline', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.landing.hero.title} onChange={(e) => handleChange('landing', 'hero', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title Highlight</label>
                    <input type="text" value={config.landing.hero.titleHighlight} onChange={(e) => handleChange('landing', 'hero', 'titleHighlight', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                    <textarea rows={4} value={config.landing.hero.subtitle} onChange={(e) => handleChange('landing', 'hero', 'subtitle', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                </>
              )}
              {activeTab === 'features' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.landing.features.title} onChange={(e) => handleChange('landing', 'features', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                    <textarea rows={2} value={config.landing.features.subtitle} onChange={(e) => handleChange('landing', 'features', 'subtitle', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-bold text-slate-700">Feature Items</p>
                      <button onClick={() => {
                        const newItems = [...config.landing.features.items, { id: Date.now().toString(), title: 'New Feature', desc: '' }];
                        handleChange('landing', 'features', 'items', newItems);
                      }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded">+ Add Feature</button>
                    </div>
                    {config.landing.features.items.map((item, idx) => (
                      <div key={item.id} className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                        <p className="text-xs font-bold text-indigo-600 mb-2">Feature {idx + 1}</p>
                        <button onClick={() => {
                          const newItems = config.landing.features.items.filter(i => i.id !== item.id);
                          handleChange('landing', 'features', 'items', newItems);
                        }} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                        <input type="text" value={item.title} onChange={(e) => {
                          const newItems = [...config.landing.features.items];
                          newItems[idx] = { ...item, title: e.target.value };
                          handleChange('landing', 'features', 'items', newItems);
                        }} className="w-full p-2 mb-2 bg-white border border-slate-200 rounded text-sm text-slate-900 font-bold" />
                        <textarea value={item.desc} onChange={(e) => {
                          const newItems = [...config.landing.features.items];
                          newItems[idx] = { ...item, desc: e.target.value };
                          handleChange('landing', 'features', 'items', newItems);
                        }} rows={2} className="w-full p-2 bg-white border border-slate-200 rounded text-sm text-slate-700 resize-none" />
                        <label className="block text-xs font-bold text-slate-500 uppercase mt-3 mb-1">Media</label>
                        <MediaPicker
                          iconValue={item.icon}
                          imageUrlValue={item.imageUrl}
                          onChange={(type, value) => {
                            const newItems = [...config.landing.features.items];
                            if (type === 'icon') {
                              newItems[idx] = { ...item, icon: value, imageUrl: '' };
                            } else {
                              newItems[idx] = { ...item, imageUrl: value, icon: '' };
                            }
                            handleChange('landing', 'features', 'items', newItems);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeTab === 'ecosystem' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tagline</label>
                    <input type="text" value={config.landing.ecosystem.tagline} onChange={(e) => handleChange('landing', 'ecosystem', 'tagline', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.landing.ecosystem.title} onChange={(e) => handleChange('landing', 'ecosystem', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                    <textarea rows={3} value={config.landing.ecosystem.subtitle} onChange={(e) => handleChange('landing', 'ecosystem', 'subtitle', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                </>
              )}
              {activeTab === 'engineering' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tagline</label>
                    <input type="text" value={config.landing.engineering.tagline} onChange={(e) => handleChange('landing', 'engineering', 'tagline', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.landing.engineering.title} onChange={(e) => handleChange('landing', 'engineering', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                    <textarea rows={3} value={config.landing.engineering.subtitle} onChange={(e) => handleChange('landing', 'engineering', 'subtitle', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                </>
              )}
              {activeTab === 'finalCta' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.landing.finalCta.title} onChange={(e) => handleChange('landing', 'finalCta', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                    <textarea rows={3} value={config.landing.finalCta.subtitle} onChange={(e) => handleChange('landing', 'finalCta', 'subtitle', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Button Text</label>
                    <input type="text" value={config.landing.finalCta.buttonText} onChange={(e) => handleChange('landing', 'finalCta', 'buttonText', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                </>
              )}
            </div>
          </>
        );
      
      case '/about':
        return (
          <>
            <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 overflow-x-auto custom-scrollbar">
              {['hero', 'mission', 'vision', 'values', 'cta'].map(tab => (
                <button 
                  key={tab}
                  className={`px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="p-6 space-y-6">
              {activeTab === 'hero' && (
                 <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tagline</label>
                    <input type="text" value={config.about.hero.tagline} onChange={(e) => handleChange('about', 'hero', 'tagline', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.about.hero.title} onChange={(e) => handleChange('about', 'hero', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title Highlight</label>
                    <input type="text" value={config.about.hero.titleHighlight} onChange={(e) => handleChange('about', 'hero', 'titleHighlight', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                    <textarea rows={4} value={config.about.hero.subtitle} onChange={(e) => handleChange('about', 'hero', 'subtitle', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                </>
              )}
              {activeTab === 'mission' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.about.mission.title} onChange={(e) => handleChange('about', 'mission', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                    <textarea rows={4} value={config.about.mission.desc} onChange={(e) => handleChange('about', 'mission', 'desc', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                </>
              )}
              {activeTab === 'vision' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.about.vision.title} onChange={(e) => handleChange('about', 'vision', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                    <textarea rows={4} value={config.about.vision.desc} onChange={(e) => handleChange('about', 'vision', 'desc', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                </>
              )}
              {activeTab === 'values' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Section Title</label>
                    <input type="text" value={config.about.values.title} onChange={(e) => handleChange('about', 'values', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-bold text-slate-700">Core Values</p>
                      <button onClick={() => {
                        const newItems = [...config.about.values.items, { id: Date.now().toString(), title: 'New Value', desc: '' }];
                        handleChange('about', 'values', 'items', newItems);
                      }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded">+ Add Value</button>
                    </div>
                    {config.about.values.items.map((item, idx) => (
                      <div key={item.id} className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                        <p className="text-xs font-bold text-indigo-600 mb-2">Value {idx + 1}</p>
                        <button onClick={() => {
                          const newItems = config.about.values.items.filter(i => i.id !== item.id);
                          handleChange('about', 'values', 'items', newItems);
                        }} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                        <input type="text" value={item.title} onChange={(e) => {
                          const newItems = [...config.about.values.items];
                          newItems[idx] = { ...item, title: e.target.value };
                          handleChange('about', 'values', 'items', newItems);
                        }} className="w-full p-2 mb-2 bg-white border border-slate-200 rounded text-sm text-slate-900 font-bold" />
                        <textarea value={item.desc} onChange={(e) => {
                          const newItems = [...config.about.values.items];
                          newItems[idx] = { ...item, desc: e.target.value };
                          handleChange('about', 'values', 'items', newItems);
                        }} rows={2} className="w-full p-2 bg-white border border-slate-200 rounded text-sm text-slate-700 resize-none" />
                        <label className="block text-xs font-bold text-slate-500 uppercase mt-3 mb-1">Media</label>
                        <MediaPicker
                          iconValue={item.icon}
                          imageUrlValue={item.imageUrl}
                          onChange={(type, value) => {
                            const newItems = [...config.about.values.items];
                            if (type === 'icon') {
                              newItems[idx] = { ...item, icon: value, imageUrl: '' };
                            } else {
                              newItems[idx] = { ...item, imageUrl: value, icon: '' };
                            }
                            handleChange('about', 'values', 'items', newItems);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeTab === 'cta' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.about.cta.title} onChange={(e) => handleChange('about', 'cta', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                    <textarea rows={3} value={config.about.cta.subtitle} onChange={(e) => handleChange('about', 'cta', 'subtitle', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Button Text</label>
                    <input type="text" value={config.about.cta.buttonText} onChange={(e) => handleChange('about', 'cta', 'buttonText', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                </>
              )}
            </div>
          </>
        );

      case '/products':
        return (
          <>
            <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 overflow-x-auto custom-scrollbar">
              {['header', 'catalog', 'customBanner'].map(tab => (
                <button 
                  key={tab}
                  className={`px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="p-6 space-y-6">
              {activeTab === 'header' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tagline</label>
                    <input type="text" value={config.products.header.tagline} onChange={(e) => handleChange('products', 'header', 'tagline', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.products.header.title} onChange={(e) => handleChange('products', 'header', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title Highlight</label>
                    <input type="text" value={config.products.header.titleHighlight} onChange={(e) => handleChange('products', 'header', 'titleHighlight', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                    <textarea rows={4} value={config.products.header.subtitle} onChange={(e) => handleChange('products', 'header', 'subtitle', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                </>
              )}
              {activeTab === 'catalog' && (
                <div className="pt-2">
                  <div className="mb-4 text-sm text-slate-600 bg-blue-50 p-3 rounded border border-blue-100">
                    Your applications are automatically synced from the dashboard. Customize how they look on the website below.
                  </div>
                  {applications.map((app) => {
                    const itemConfig: any = config.products.items.find(i => i.applicationId === app.id) || {
                      id: app.id,
                      applicationId: app.id,
                      title: app.name,
                      desc: '',
                      icon: '',
                      imageUrl: '',
                      badge: '',
                      isReady: false,
                      order: 0,
                      features: []
                    };

                    const updateItem = (updates: any) => {
                      let newItems = [...config.products.items];
                      const existingIdx = newItems.findIndex(i => i.applicationId === app.id);
                      if (existingIdx >= 0) {
                        newItems[existingIdx] = { ...newItems[existingIdx], ...updates };
                      } else {
                        newItems.push({ ...itemConfig, ...updates });
                      }
                      updateConfig('products', { items: newItems });
                    };

                    return (
                      <div key={app.id} className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                        <div className="mb-3 flex justify-between items-center">
                          <label className="block text-sm font-black text-slate-800 uppercase">{app.name}</label>
                          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold">Auto-Synced</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Badge</label>
                            <input type="text" value={itemConfig.badge || ''} onChange={(e) => updateItem({ badge: e.target.value })} className="w-full p-2 bg-white border border-slate-200 rounded text-sm" placeholder="e.g. Coming Soon" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Order</label>
                            <input type="number" value={itemConfig.order || 0} onChange={(e) => updateItem({ order: parseInt(e.target.value) || 0 })} className="w-full p-2 bg-white border border-slate-200 rounded text-sm" placeholder="0" />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Media</label>
                          <MediaPicker
                            iconValue={itemConfig.icon}
                            imageUrlValue={itemConfig.imageUrl}
                            onChange={(type, value) => {
                              if (type === 'icon') {
                                updateItem({ icon: value, imageUrl: '' });
                              } else {
                                updateItem({ imageUrl: value, icon: '' });
                              }
                            }}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                          <textarea value={itemConfig.desc || ''} onChange={(e) => updateItem({ desc: e.target.value })} rows={3} className="w-full p-2 bg-white border border-slate-200 rounded text-sm text-slate-700 resize-none" placeholder="Marketing description..." />
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <input type="checkbox" id={`ready-${app.id}`} checked={itemConfig.isReady || false} onChange={(e) => updateItem({ isReady: e.target.checked })} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                          <label htmlFor={`ready-${app.id}`} className="text-sm font-bold text-slate-700 cursor-pointer">Show on Website</label>
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                          <div className="flex justify-between items-center mb-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase">Application Modules</label>
                            <button onClick={() => {
                              const currentFeatures = itemConfig.features || [];
                              updateItem({ features: [...currentFeatures, { id: Date.now().toString(), title: 'New Module', desc: '', icon: 'Zap' }] });
                            }} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded">+ Add Module</button>
                          </div>
                          {(itemConfig.features || []).map((feature: any, fIdx: number) => (
                            <div key={feature.id || fIdx} className="mb-3 p-3 border border-slate-200 rounded bg-white relative group">
                              <button onClick={() => {
                                const newFeatures = (itemConfig.features || []).filter((_: any, i: number) => i !== fIdx);
                                updateItem({ features: newFeatures });
                              }} className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                              
                              <div className="flex gap-2 mb-2 pr-8">
                                <div className="w-auto shrink-0 mt-1">
                                  <MediaPicker
                                    iconValue={feature.icon}
                                    imageUrlValue={feature.imageUrl}
                                    onChange={(type, value) => {
                                      const newFeatures = [...(itemConfig.features || [])];
                                      if (type === 'icon') {
                                        newFeatures[fIdx] = { ...feature, icon: value, imageUrl: '' };
                                      } else {
                                        newFeatures[fIdx] = { ...feature, imageUrl: value, icon: '' };
                                      }
                                      updateItem({ features: newFeatures });
                                    }}
                                  />
                                </div>
                                
                                <input type="text" value={feature.title || ''} onChange={(e) => {
                                  const newFeatures = [...(itemConfig.features || [])];
                                  newFeatures[fIdx] = { ...feature, title: e.target.value };
                                  updateItem({ features: newFeatures });
                                }} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900 font-bold" placeholder="Module Title" />
                              </div>

                              <div className="mb-2">
                                <textarea value={feature.description || ''} onChange={(e) => {
                                  const newFeatures = [...(itemConfig.features || [])];
                                  newFeatures[fIdx] = { ...feature, description: e.target.value };
                                  updateItem({ features: newFeatures });
                                }} rows={2} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 resize-none" placeholder="Short description for the module (optional)" />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Bullet Points</label>
                                {(() => {
                                  const currentBulletPoints = Array.isArray(feature.bulletPoints)
                                    ? feature.bulletPoints
                                    : (feature.desc ? feature.desc.split('\n').filter((l: string) => l.trim() !== '') : []);
                                  
                                  return (
                                    <div className="space-y-2">
                                      {currentBulletPoints.map((bp: string, bpIdx: number) => (
                                        <div key={bpIdx} className="flex gap-2">
                                          <input 
                                            type="text" 
                                            value={bp} 
                                            onChange={(e) => {
                                              const newFeatures = [...(itemConfig.features || [])];
                                              const newBps = [...currentBulletPoints];
                                              newBps[bpIdx] = e.target.value;
                                              newFeatures[fIdx] = { ...feature, bulletPoints: newBps, desc: '' };
                                              updateItem({ features: newFeatures });
                                            }}
                                            className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700" 
                                            placeholder={`Point ${bpIdx + 1}...`} 
                                          />
                                          <button 
                                            onClick={() => {
                                              const newFeatures = [...(itemConfig.features || [])];
                                              const newBps = currentBulletPoints.filter((_: any, i: number) => i !== bpIdx);
                                              newFeatures[fIdx] = { ...feature, bulletPoints: newBps, desc: '' };
                                              updateItem({ features: newFeatures });
                                            }}
                                            className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded border border-red-100 hover:bg-red-100 transition-colors shrink-0"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                      <button 
                                        onClick={() => {
                                          const newFeatures = [...(itemConfig.features || [])];
                                          const newBps = [...currentBulletPoints, ''];
                                          newFeatures[fIdx] = { ...feature, bulletPoints: newBps, desc: '' };
                                          updateItem({ features: newFeatures });
                                        }}
                                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded w-full border border-indigo-100"
                                      >
                                        + Add Bullet Point
                                      </button>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {applications.length === 0 && (
                    <div className="text-center p-6 text-slate-500 text-sm">
                      No applications found. Go to the Applications menu to create one.
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'customBanner' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                    <input type="text" value={config.products.customSolutions.title} onChange={(e) => handleChange('products', 'customSolutions', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                    <textarea rows={3} value={config.products.customSolutions.desc} onChange={(e) => handleChange('products', 'customSolutions', 'desc', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Button Text</label>
                    <input type="text" value={config.products.customSolutions.buttonText} onChange={(e) => handleChange('products', 'customSolutions', 'buttonText', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
                  </div>
                </>
              )}
            </div>
          </>
        );

      // Book Demo / Contact
      case '/book-demo':
        return (
          <>
            <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 overflow-x-auto custom-scrollbar">
              <button className="px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 border-indigo-600 text-indigo-600 bg-white">Hero Settings</button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                <input type="text" value={config.bookDemo.hero.title} onChange={(e) => handleChange('bookDemo', 'hero', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subtitle</label>
                <textarea rows={4} value={config.bookDemo.hero.subtitle} onChange={(e) => handleChange('bookDemo', 'hero', 'subtitle', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded resize-none" />
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase">FAQs</label>
                  <button onClick={() => {
                    const newFaqs = [...config.bookDemo.faq, { question: 'New Question', answer: 'New Answer' }];
                    updateConfig('bookDemo', { faq: newFaqs });
                  }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded">+ Add FAQ</button>
                </div>
                {config.bookDemo.faq.map((item, idx) => (
                  <div key={idx} className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                    <button onClick={() => {
                      const newFaqs = config.bookDemo.faq.filter((_, i) => i !== idx);
                      updateConfig('bookDemo', { faq: newFaqs });
                    }} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question</label>
                    <input type="text" value={item.question} onChange={(e) => {
                      const newFaqs = [...config.bookDemo.faq];
                      newFaqs[idx] = { ...item, question: e.target.value };
                      updateConfig('bookDemo', { faq: newFaqs });
                    }} className="w-full p-2 mb-2 bg-white border border-slate-200 rounded text-sm text-slate-900 font-bold" />
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Answer</label>
                    <textarea value={item.answer} onChange={(e) => {
                      const newFaqs = [...config.bookDemo.faq];
                      newFaqs[idx] = { ...item, answer: e.target.value };
                      updateConfig('bookDemo', { faq: newFaqs });
                    }} rows={3} className="w-full p-2 bg-white border border-slate-200 rounded text-sm text-slate-700 resize-none" />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      // Legal Pages
      case '/privacy':
        return (
          <>
             <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 overflow-x-auto custom-scrollbar">
              <button className="px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 border-indigo-600 text-indigo-600 bg-white">Privacy Content</button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                <input type="text" value={config.legal.privacyPolicy.title} onChange={(e) => handleChange('legal', 'privacyPolicy', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Last Updated</label>
                <input type="text" value={config.legal.privacyPolicy.lastUpdated} onChange={(e) => handleChange('legal', 'privacyPolicy', 'lastUpdated', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Sections</label>
                  <button onClick={() => {
                    const newSections = [...(config.legal.privacyPolicy.sections || []), { id: Date.now().toString(), title: 'New Section', content: '' }];
                    handleChange('legal', 'privacyPolicy', 'sections', newSections);
                  }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded">+ Add Section</button>
                </div>
                {(config.legal.privacyPolicy.sections || []).map((section, idx) => (
                  <div key={section.id} className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                    <button onClick={() => {
                      const newSections = config.legal.privacyPolicy.sections.filter(s => s.id !== section.id);
                      handleChange('legal', 'privacyPolicy', 'sections', newSections);
                    }} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    <input type="text" value={section.title} onChange={(e) => {
                      const newSections = [...config.legal.privacyPolicy.sections];
                      newSections[idx] = { ...section, title: e.target.value };
                      handleChange('legal', 'privacyPolicy', 'sections', newSections);
                    }} className="w-full p-2 mb-2 bg-white border border-slate-200 rounded text-sm text-slate-900 font-bold" />
                    <div className="mb-12">
                      <ReactQuill theme="snow" value={section.content} onChange={(value) => {
                        const newSections = [...config.legal.privacyPolicy.sections];
                        newSections[idx] = { ...section, content: value };
                        handleChange('legal', 'privacyPolicy', 'sections', newSections);
                      }} className="bg-white text-slate-900" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case '/terms':
        return (
          <>
             <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 overflow-x-auto custom-scrollbar">
              <button className="px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 border-indigo-600 text-indigo-600 bg-white">Terms Content</button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                <input type="text" value={config.legal.termsOfService.title} onChange={(e) => handleChange('legal', 'termsOfService', 'title', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Last Updated</label>
                <input type="text" value={config.legal.termsOfService.lastUpdated} onChange={(e) => handleChange('legal', 'termsOfService', 'lastUpdated', e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded" />
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Sections</label>
                  <button onClick={() => {
                    const newSections = [...(config.legal.termsOfService.sections || []), { id: Date.now().toString(), title: 'New Section', content: '' }];
                    handleChange('legal', 'termsOfService', 'sections', newSections);
                  }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded">+ Add Section</button>
                </div>
                {(config.legal.termsOfService.sections || []).map((section, idx) => (
                  <div key={section.id} className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
                    <button onClick={() => {
                      const newSections = config.legal.termsOfService.sections.filter(s => s.id !== section.id);
                      handleChange('legal', 'termsOfService', 'sections', newSections);
                    }} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    <input type="text" value={section.title} onChange={(e) => {
                      const newSections = [...config.legal.termsOfService.sections];
                      newSections[idx] = { ...section, title: e.target.value };
                      handleChange('legal', 'termsOfService', 'sections', newSections);
                    }} className="w-full p-2 mb-2 bg-white border border-slate-200 rounded text-sm text-slate-900 font-bold" />
                    <div className="mb-12">
                      <ReactQuill theme="snow" value={section.content} onChange={(value) => {
                        const newSections = [...config.legal.termsOfService.sections];
                        newSections[idx] = { ...section, content: value };
                        handleChange('legal', 'termsOfService', 'sections', newSections);
                      }} className="bg-white text-slate-900" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActivePage(e.target.value as PageRoute);
    // Reset tabs based on page
    if (e.target.value === '/') setActiveTab('hero');
    if (e.target.value === '/about') setActiveTab('hero');
    if (e.target.value === '/products') setActiveTab('header');
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
      {/* Editor Sidebar */}
      <div className="w-[500px] bg-white border-r border-slate-200 shadow-xl z-20 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex justify-between items-center">
          <h1 className="font-bold">Global Builder</h1>
          <button 
            onClick={() => saveConfig()}
            disabled={isSaving}
            className="px-3 py-1 bg-indigo-600 rounded text-sm font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
        
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Page to Edit</label>
          <select 
            value={activePage} 
            onChange={handlePageChange}
            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-bold text-slate-900"
          >
            <option value="/">Home Page</option>
            <option value="/about">About Us</option>
            <option value="/products">Products Catalog</option>
            <option value="/book-demo">Contact / Book Demo</option>
            <option value="/privacy">Privacy Policy</option>
            <option value="/terms">Terms of Service</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {renderSidebarContent()}
        </div>
      </div>

      {/* Live Preview Area */}
      <div className="flex-1 bg-slate-800 overflow-hidden relative flex flex-col items-center">
        <div className="w-full bg-slate-900/50 backdrop-blur px-6 py-3 flex items-center justify-between border-b border-slate-700 shadow-md z-10">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <span className="text-sm font-bold text-slate-300">Live Preview: {activePage}</span>
           <div className="w-16"></div> {/* Spacer for centering */}
        </div>
        
        <div className="flex-1 w-full overflow-auto p-8 flex justify-center custom-scrollbar">
           <div 
             className="w-[1280px] bg-white shadow-2xl rounded-xl overflow-hidden origin-top border-4 border-slate-700" 
             style={{ transform: 'scale(0.85)', height: 'fit-content', marginBottom: '-15%' }}
           >
              <MarketingLayout>
                 {activePage === '/' && <LandingPage />}
                 {activePage === '/about' && <AboutPage />}
                 {activePage === '/products' && <ProductsPage />}
                 {activePage === '/book-demo' && <BookDemo />}
                 {activePage === '/privacy' && <PrivacyPolicy />}
                 {activePage === '/terms' && <Terms />}
              </MarketingLayout>
           </div>
        </div>
      </div>
    </div>
  );
};
