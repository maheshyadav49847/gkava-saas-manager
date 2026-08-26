import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, Plus, Trash2, Image as ImageIcon, Type, Link as LinkIcon, AlignLeft, Hash, ChevronDown, ChevronUp, ArrowRight, Save, Loader2 } from "lucide-react";
import * as LucideIcons from 'lucide-react';
import { IconPicker } from '../../../components/ui/IconPicker';
import { Application, CreateApplicationDTO, UpdateApplicationDTO, ApplicationModule } from '../types';
import './ApplicationStudio.css';

interface ApplicationStudioProps {
  application: Application | null;
  onSave: (data: CreateApplicationDTO | UpdateApplicationDTO) => Promise<void>;
  onCancel: () => void;
}

export function ApplicationStudio({ application, onSave, onCancel }: ApplicationStudioProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'modules'>('general');
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [formData, setFormData] = useState<Partial<Application>>({
    name: '',
    websiteUrl: '',
    description: '',
    imageBase64: '',
    displayOrder: 0,
    modules: [],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: CreateApplicationDTO | UpdateApplicationDTO) => {
      await onSave(data);
    }
  });

  useEffect(() => {
    if (application) {
      setFormData(application);
    }
  }, [application]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (application) {
      saveMutation.mutate(formData as UpdateApplicationDTO);
    } else {
      saveMutation.mutate(formData as CreateApplicationDTO);
    }
  };

  const addModule = () => {
    setFormData(prev => {
      const currentModules = prev.modules || [];
      const maxOrder = currentModules.length > 0 ? Math.max(...currentModules.map(m => m.displayOrder || 0)) : 0;
      return {
        ...prev,
        modules: [...currentModules, { name: '', description: '', icon: 'Layers', displayOrder: maxOrder + 1 }]
      };
    });
  };

  const updateModule = (index: number, field: keyof ApplicationModule, value: string) => {
    const newModules = [...(formData.modules || [])];
    newModules[index] = { ...newModules[index], [field]: value };
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  const removeModule = (index: number) => {
    const newModules = [...(formData.modules || [])];
    newModules.splice(index, 1);
    setFormData(prev => ({ ...prev, modules: newModules }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex overflow-hidden">
      {/* Editor Panel */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col h-full shadow-xl z-10 relative">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {application ? 'Edit Application' : 'New Application'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Design and configure your product</p>
          </div>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-4 space-x-6 bg-gray-50/50">
          {(['general', 'modules'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === tab ? 'text-[#0A2540]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-sm-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {activeTab === 'general' && (
            <div className="space-y-8">
              {/* Product Name (Advanced) */}
              <div className="relative group">
                
                <div className="relative bg-white rounded-sm p-1 border border-gray-100">
                  <label className="block text-xs font-bold tracking-wider text-[#425466] uppercase ml-3 mt-2 mb-1">Product Name</label>
                  <div className="flex items-center px-3 pb-2 border-b border-gray-100">
                    <Type className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      placeholder="e.g. MyQCare"
                      className="w-full bg-transparent text-xl font-bold text-gray-900 focus:outline-none placeholder-gray-300"
                    />
                  </div>
                  
                  <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase ml-3 mt-2 mb-1">Product Subtitle / Tagline</label>
                  <div className="flex items-center px-3 pb-2">
                    <Type className="w-4 h-4 text-gray-300 mr-2" />
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle || ''}
                      onChange={handleChange}
                      placeholder="e.g. The Intelligent Clinic Management Module by Gkava."
                      className="w-full bg-transparent text-sm font-medium text-gray-600 focus:outline-none placeholder-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Website URL and Display Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-400" /> Website URL
                  </label>
                  <input
                    type="text"
                    name="websiteUrl"
                    value={formData.websiteUrl || ''}
                    onChange={handleChange}
                    placeholder="https://www.yourproduct.com"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" /> Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="displayOrder"
                    value={formData.displayOrder || 0}
                    onChange={(e) => {
                      let val = parseInt(e.target.value) || 0;
                      if (val < 0) val = 0;
                      setFormData(prev => ({ ...prev, displayOrder: val }));
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8EE] rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-colors text-[#0A2540] placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Description (Rich Text Editor) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-gray-400" /> Description
                  </label>
                  <div className="rounded-sm overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-[#E3E8EE] transition-shadow bg-white">
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full border-none p-4 min-h-[150px] focus:ring-0 text-gray-700 resize-y"
                      placeholder="Write a compelling description for your product..."
                    />
                  </div>
                </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Graphic</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border border-[#E3E8EE] border-dashed rounded-sm hover:border-[#E3E8EE] transition-colors bg-gray-50/50">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-sm font-medium text-[#0A2540] hover:text-[#425466] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500/20">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-6">
              {formData.modules?.map((module, index) => (
                <div key={index} className="p-5 border border-gray-200 rounded-sm bg-white shadow-sm space-y-4 relative group hover:border-[#E3E8EE] transition-colors">
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => removeModule(index)} className="p-1 ml-1 text-gray-400 hover:text-red-500 rounded-sm transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <IconPicker 
                          value={module.icon || 'Layers'} 
                          onChange={(val) => updateModule(index, 'icon', val)}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={module.name}
                          onChange={(e) => updateModule(index, 'name', e.target.value)}
                          placeholder="Module Name (e.g. Analytics Engine)"
                          className="w-full bg-transparent border-0 p-0 text-lg font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium focus:ring-0"
                        />
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-sm border border-gray-100 flex-shrink-0 mr-8">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order</span>
                        <input
                          type="number"
                          min="0"
                          value={module.displayOrder || 0}
                          onChange={(e) => {
                            let val = parseInt(e.target.value) || 0;
                            if (val < 0) val = 0;
                            updateModule(index, 'displayOrder', val.toString());
                          }}
                          className="w-8 bg-transparent border-0 p-0 text-sm font-semibold text-gray-700 text-center focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                    
                    <textarea
                      value={module.description}
                      onChange={(e) => updateModule(index, 'description', e.target.value)}
                      rows={4}
                      placeholder="Briefly describe what this module does..."
                      className="w-full bg-transparent border-0 p-0 text-sm text-gray-500 placeholder:text-gray-300 focus:ring-0 resize-none"
                    />
                  </div>
                </div>
              ))}
              <button onClick={addModule} className="w-full py-3 border-2 border-dashed border border-[#E3E8EE] rounded-sm text-gray-600 font-medium hover:border-[#E3E8EE] hover:text-[#0A2540] transition-colors flex items-center justify-center gap-2">
                <Plus size={20} /> Add Module
              </button>
            </div>
          )}


        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-[#425466] bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] rounded-sm transition-colors shadow-sm">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saveMutation.isPending} className="flex-1 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-white bg-[#635BFF] hover:bg-[#0A2540] border border-transparent rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saveMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="w-2/3 bg-gray-100 h-full overflow-y-auto relative pattern-bg">
        {/* Mock Browser Topbar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-400"></div>
            <div className="w-3 h-3 rounded-sm bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-sm bg-green-400"></div>
          </div>
          <div className="text-sm font-medium text-gray-500 flex-1 text-center bg-gray-100 mx-4 py-1.5 rounded-sm max-w-md">
            Live Preview: Website rendering
          </div>
          <div className="w-16"></div>
        </div>

        {/* Scaled Preview Container */}
        <div className="p-10 min-h-full flex justify-center">
          <div className="w-full max-w-[1200px] bg-white rounded-sm shadow-2xl overflow-hidden" style={{ minHeight: '800px' }}>
            
            {/* THIS IS THE WEBSITE PREVIEW RENDER */}
            <div className="p-10">
              <div className="product-row">
                {/* Hero Section */}
                <div className="product-hero-section">
                    <div className="product-graphic" style={formData.imageBase64 ? { padding: '1rem', aspectRatio: 'auto' } : {}}>
                      {formData.imageBase64 ? (
                        <img src={formData.imageBase64} alt={formData.name} style={{ width: '100%', height: '100%', aspectRatio: '16 / 11', display: 'block', objectFit: 'fill', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                      ) : (
                      <div className="graphic-inner">
                        <div className="graphic-header">
                          <div className="graphic-dot"></div>
                          <div className="graphic-dot"></div>
                          <div className="graphic-dot"></div>
                        </div>
                        <div className="graphic-body">
                          <span>App Graphic (Upload Image)</span>
                        </div>
                      </div>
                    )}
                  </div>
                    <div className="product-intro">
                      <h2 className="product-name" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{formData.name || 'Your Product Name'}</h2>
                      {formData.subtitle && (
                        <p className="product-subtitle" style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                          {formData.subtitle}
                        </p>
                      )}
                      {formData.description ? (
                        <div className="product-description" style={{ fontSize: '1.25rem' }}>{formData.description}</div>
                      ) : (
                        <div className="product-description" style={{ fontSize: '1.25rem' }}>Add a compelling description to showcase your product's value proposition.</div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                        {formData.modules && formData.modules.length > 0 && (
                          <button onClick={() => setPreviewExpanded(!previewExpanded)} className="btn-secondary-large">
                            Platform Modules {previewExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        )}
                        <button className="btn-primary-large">
                          View Pricing <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                </div>

                {/* Details Section */}
                {previewExpanded && (
                  <div className="product-details-section">
                    {/* Modules */}
                    {formData.modules && formData.modules.length > 0 && (
                      <div>
                        <h3 className="detail-title">Platform Modules</h3>
                        <div className="product-modules-grid">
                        {[...formData.modules].sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((module, mIndex) => {
                          const IconCmp = (LucideIcons as any)[module.icon || 'Layers'] || LucideIcons.Layers;
                          return <div key={mIndex} className="module-card">
                                <div className="module-card-header">
                                  <div className="module-icon">
                                    <IconCmp size={24} />
                                  </div>
                                  <div className="module-name">{module.name || 'Untitled Module'}</div>
                                </div>
                                <div className="module-desc">{module.description || 'Add a brief description here...'}</div>
                              </div>;
                        })}
                      </div>
                    </div>
                  )}

                  {(!formData.modules?.length) && (
                    <div className="text-center p-12 border-2 border-dashed border border-[#E3E8EE] rounded-sm text-gray-400">
                      Add modules to see them render here.
                    </div>
                  )}

                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .pattern-bg {
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
