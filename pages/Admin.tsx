
import React, { useState, useRef, DragEvent } from 'react';
import { Save, RefreshCw, Plus, Trash2, Edit3, Image as ImageIcon, Info, FileText, Upload, Calendar, X, MousePointer2 } from 'lucide-react';
import { CMSData, ResearchProject, CVEntry, MemoryPost } from '../types';

interface AdminProps {
  data: CMSData;
  onUpdate: (newData: CMSData) => void;
}

const Admin: React.FC<AdminProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState<CMSData>(JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState<'info' | 'research' | 'cv' | 'memories'>('info');
  const [isDragging, setIsDragging] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const memoryFileInputRef = useRef<HTMLInputElement>(null);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState<number | null>(null);

  const handleSave = () => {
    onUpdate(formData);
    alert('Changes saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      setFormData(JSON.parse(JSON.stringify(data)));
    }
  };

  const updatePersonalInfo = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [key]: value }
    }));
  };

  const processFile = (file: File, callback: (base64: string) => void) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, (base64) => updatePersonalInfo('headshot', base64));
  };

  const handleDragOver = (e: DragEvent, type: string) => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleDragLeave = () => {
    setIsDragging(null);
  };

  const handleDrop = (e: DragEvent, type: string, index?: number) => {
    e.preventDefault();
    setIsDragging(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (type === 'profile') {
      processFile(file, (base64) => updatePersonalInfo('headshot', base64));
    } else if (type === 'memory' && typeof index === 'number') {
      processFile(file, (base64) => {
        const newList = [...formData.memories];
        newList[index].imageUrl = base64;
        setFormData({ ...formData, memories: newList });
      });
    }
  };

  const addResearch = () => {
    const newItem: ResearchProject = {
      id: Date.now().toString(),
      title: "New Paper Title",
      authors: "Authors Name",
      journal: "Journal Name",
      category: "General",
      description: "",
      date: new Date().getFullYear().toString(),
      status: 'working_paper',
      link: ""
    };
    setFormData(prev => ({ ...prev, research: [newItem, ...prev.research] }));
  };

  const removeResearch = (id: string) => {
    setFormData(prev => ({ ...prev, research: prev.research.filter(r => r.id !== id) }));
  };

  const addCVItem = (type: 'education' | 'experience') => {
    const newItem: CVEntry = {
      id: Date.now().toString(),
      title: "New Position/Degree",
      institution: "Institution Name",
      period: "2024 - Present",
      description: ""
    };
    setFormData(prev => ({
      ...prev,
      cv: { ...prev.cv, [type]: [newItem, ...prev.cv[type]] }
    }));
  };

  const removeCVItem = (type: 'education' | 'experience', id: string) => {
    setFormData(prev => ({
      ...prev,
      cv: { ...prev.cv, [type]: prev.cv[type].filter(item => item.id !== id) }
    }));
  };

  const addMemory = () => {
    const newItem: MemoryPost = {
      id: Date.now().toString(),
      title: "New Memory Title",
      date: "Month Year",
      imageUrl: "",
      description: ""
    };
    setFormData(prev => ({ ...prev, memories: [newItem, ...prev.memories] }));
  };

  const removeMemory = (id: string) => {
    setFormData(prev => ({ ...prev, memories: prev.memories.filter(m => m.id !== id) }));
  };

  const handleMemoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, (base64) => {
        const newList = [...formData.memories];
        newList[index].imageUrl = base64;
        setFormData({ ...formData, memories: newList });
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-zinc-400 text-sm font-light">Drag files to upload immediately. No complex buttons needed.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleReset} className="flex items-center px-4 py-2 border border-white/10 text-zinc-400 hover:text-white rounded-md transition-all text-xs font-bold uppercase tracking-widest bg-white/5">
            <RefreshCw size={14} className="mr-2" /> Reset
          </button>
          <button onClick={handleSave} className="flex items-center px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-md hover:bg-emerald-500 transition-all text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="flex flex-col space-y-2">
          {[
            { id: 'info', icon: Info, label: 'Profile Settings' },
            { id: 'research', icon: Edit3, label: 'Research Portfolio' },
            { id: 'cv', icon: FileText, label: 'Curriculum Vitae' },
            { id: 'memories', icon: ImageIcon, label: 'Visual Memories' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center px-5 py-4 rounded-lg text-left transition-all text-[11px] font-bold uppercase tracking-[0.15em] border ${activeTab === tab.id ? 'bg-emerald-500 text-black border-emerald-500 shadow-xl' : 'text-zinc-500 border-white/5 hover:bg-white/5'}`}
            >
              <tab.icon size={16} className="mr-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-10 shadow-3xl">
          {activeTab === 'info' && (
            <div className="space-y-12 welcome-fade">
              <div>
                <h3 className="text-xl font-bold mb-8 text-white flex items-center">
                  <span className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mr-3 text-xs">1</span>
                  Personal Branding
                </h3>
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  {/* HERO DRAG & DROP ZONE */}
                  <div 
                    onDragOver={(e) => handleDragOver(e, 'profile')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'profile')}
                    onClick={() => fileInputRef.current?.click()}
                    className={`group w-52 h-64 bg-black rounded-2xl overflow-hidden flex-shrink-0 border-2 border-dashed transition-all relative cursor-pointer flex items-center justify-center ${isDragging === 'profile' ? 'border-emerald-500 bg-emerald-500/10 scale-105' : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/5'}`}
                  >
                    {formData.personalInfo.headshot ? (
                      <>
                        <img src={formData.personalInfo.headshot} className="w-full h-full object-cover grayscale brightness-50 group-hover:brightness-75 transition-all" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                           <MousePointer2 size={32} className="text-emerald-500 mb-2 animate-bounce" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-white">Drop New Photo</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-4">
                        <Upload size={32} className="mx-auto text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                        <p className="text-[10px] uppercase font-bold text-zinc-500 leading-relaxed tracking-widest">
                          Drag & Drop Photo<br/>to Upload Immediately
                        </p>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>

                  <div className="flex-1 space-y-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Public Name</label>
                        <input type="text" value={formData.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm outline-none focus:border-emerald-500 transition-all shadow-inner" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Academic Role</label>
                        <input type="text" value={formData.personalInfo.role} onChange={(e) => updatePersonalInfo('role', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm outline-none focus:border-emerald-500 transition-all shadow-inner" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Introduction Bio</label>
                      <textarea rows={6} value={formData.personalInfo.bio} onChange={(e) => updatePersonalInfo('bio', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm outline-none focus:border-emerald-500 transition-all resize-none shadow-inner" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                 <h3 className="text-xl font-bold mb-8 text-white flex items-center">
                  <span className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mr-3 text-xs">2</span>
                  Digital Presence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Contact Email</label>
                    <input type="email" value={formData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm outline-none focus:border-emerald-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">LinkedIn Profile</label>
                    <input type="text" value={formData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm outline-none focus:border-emerald-500 transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Curriculum Vitae Link (External PDF)</label>
                    <input type="text" value={formData.personalInfo.cvUrl} onChange={(e) => updatePersonalInfo('cvUrl', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm outline-none focus:border-emerald-500 transition-all" placeholder="https://..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="space-y-8 welcome-fade">
              <div className="flex justify-between items-center pb-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white">Research Management</h3>
                <button onClick={addResearch} className="px-5 py-2.5 bg-emerald-600/10 text-emerald-500 rounded-lg border border-emerald-500/30 text-xs font-bold uppercase tracking-widest flex items-center hover:bg-emerald-600 hover:text-white transition-all">
                  <Plus size={16} className="mr-2" /> Add Project
                </button>
              </div>
              <div className="space-y-8">
                {formData.research.map((r, idx) => (
                  <div key={r.id} className="p-8 bg-black/30 rounded-2xl border border-white/10 relative group hover:border-emerald-500/40 transition-all">
                    <button onClick={() => removeResearch(r.id)} className="absolute top-6 right-6 text-zinc-700 hover:text-red-500 transition-colors">
                      <X size={20} />
                    </button>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Project Title</label>
                        <input className="w-full bg-black border border-white/10 rounded-lg p-3.5 text-sm text-white focus:border-emerald-500 outline-none" value={r.title} onChange={(e) => {
                          const nl = [...formData.research]; nl[idx].title = e.target.value; setFormData({...formData, research: nl});
                        }} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Authors</label>
                          <input className="w-full bg-black border border-white/10 rounded-lg p-3.5 text-sm text-zinc-300 focus:border-emerald-500 outline-none" value={r.authors} onChange={(e) => {
                            const nl = [...formData.research]; nl[idx].authors = e.target.value; setFormData({...formData, research: nl});
                          }} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Venue / Journal</label>
                          <input className="w-full bg-black border border-white/10 rounded-lg p-3.5 text-sm text-zinc-300 focus:border-emerald-500 outline-none" value={r.journal} onChange={(e) => {
                            const nl = [...formData.research]; nl[idx].journal = e.target.value; setFormData({...formData, research: nl});
                          }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Status</label>
                          <select className="w-full bg-black border border-white/10 rounded-lg p-3.5 text-sm text-white capitalize focus:border-emerald-500 outline-none" value={r.status} onChange={(e) => {
                            const nl = [...formData.research]; nl[idx].status = e.target.value as any; setFormData({...formData, research: nl});
                          }}>
                            <option value="publication">Published</option>
                            <option value="working_paper">Working Paper</option>
                            <option value="under_review">Under Review</option>
                            <option value="in_preparation">In Preparation</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Year</label>
                          <input className="w-full bg-black border border-white/10 rounded-lg p-3.5 text-sm text-zinc-300 focus:border-emerald-500 outline-none" value={r.date} onChange={(e) => {
                            const nl = [...formData.research]; nl[idx].date = e.target.value; setFormData({...formData, research: nl});
                          }} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">External Link</label>
                          <input className="w-full bg-black border border-white/10 rounded-lg p-3.5 text-sm text-zinc-300 focus:border-emerald-500 outline-none" placeholder="https://..." value={r.link} onChange={(e) => {
                            const nl = [...formData.research]; nl[idx].link = e.target.value; setFormData({...formData, research: nl});
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cv' && (
            <div className="space-y-12 welcome-fade">
              <div>
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                  <h3 className="text-xl font-bold text-white">Education Milestones</h3>
                  <button onClick={() => addCVItem('education')} className="px-4 py-2 bg-emerald-600/10 text-emerald-500 rounded-lg border border-emerald-500/20 text-xs font-bold uppercase tracking-widest flex items-center hover:bg-emerald-600 hover:text-white transition-all">
                    <Plus size={16} className="mr-2" /> New Degree
                  </button>
                </div>
                <div className="space-y-6">
                  {formData.cv.education.map((item, idx) => (
                    <div key={item.id} className="p-6 bg-black/40 rounded-xl border border-white/10 relative group hover:border-emerald-500/40 transition-all">
                      <button onClick={() => removeCVItem('education', item.id)} className="absolute top-4 right-4 text-zinc-700 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <input className="bg-black border border-white/10 rounded-lg p-3.5 text-sm font-bold text-white focus:border-emerald-500 outline-none" placeholder="Degree Title" value={item.title} onChange={(e) => {
                          const nl = [...formData.cv.education]; nl[idx].title = e.target.value; setFormData({...formData, cv: {...formData.cv, education: nl}});
                        }} />
                        <input className="bg-black border border-white/10 rounded-lg p-3.5 text-sm text-zinc-400 focus:border-emerald-500 outline-none" placeholder="Period" value={item.period} onChange={(e) => {
                          const nl = [...formData.cv.education]; nl[idx].period = e.target.value; setFormData({...formData, cv: {...formData.cv, education: nl}});
                        }} />
                      </div>
                      <input className="w-full bg-black border border-white/10 rounded-lg p-3.5 text-sm text-emerald-500 font-bold mb-4 focus:border-emerald-500 outline-none" placeholder="University" value={item.institution} onChange={(e) => {
                        const nl = [...formData.cv.education]; nl[idx].institution = e.target.value; setFormData({...formData, cv: {...formData.cv, education: nl}});
                      }} />
                      <textarea className="w-full bg-black border border-white/10 rounded-lg p-3.5 text-sm text-zinc-400 resize-none outline-none focus:border-emerald-500" rows={2} placeholder="Thesis or details..." value={item.description} onChange={(e) => {
                        const nl = [...formData.cv.education]; nl[idx].description = e.target.value; setFormData({...formData, cv: {...formData.cv, education: nl}});
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                  <h3 className="text-xl font-bold text-white">Career Milestones</h3>
                  <button onClick={() => addCVItem('experience')} className="px-4 py-2 bg-emerald-600/10 text-emerald-500 rounded-lg border border-emerald-500/20 text-xs font-bold uppercase tracking-widest flex items-center hover:bg-emerald-600 hover:text-white transition-all">
                    <Plus size={16} className="mr-2" /> New Position
                  </button>
                </div>
                <div className="space-y-6">
                  {formData.cv.experience.map((item, idx) => (
                    <div key={item.id} className="p-6 bg-black/40 rounded-xl border border-white/10 relative group hover:border-emerald-500/40 transition-all">
                      <button onClick={() => removeCVItem('experience', item.id)} className="absolute top-4 right-4 text-zinc-700 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <input className="bg-black border border-white/10 rounded-lg p-3.5 text-sm font-bold text-white focus:border-emerald-500 outline-none" placeholder="Position" value={item.title} onChange={(e) => {
                          const nl = [...formData.cv.experience]; nl[idx].title = e.target.value; setFormData({...formData, cv: {...formData.cv, experience: nl}});
                        }} />
                        <input className="bg-black border border-white/10 rounded-lg p-3.5 text-sm text-zinc-400 focus:border-emerald-500 outline-none" placeholder="Period" value={item.period} onChange={(e) => {
                          const nl = [...formData.cv.experience]; nl[idx].period = e.target.value; setFormData({...formData, cv: {...formData.cv, experience: nl}});
                        }} />
                      </div>
                      <input className="w-full bg-black border border-white/10 rounded-lg p-3.5 text-sm text-emerald-500 font-bold mb-4 focus:border-emerald-500 outline-none" placeholder="Organization" value={item.institution} onChange={(e) => {
                        const nl = [...formData.cv.experience]; nl[idx].institution = e.target.value; setFormData({...formData, cv: {...formData.cv, experience: nl}});
                      }} />
                      <textarea className="w-full bg-black border border-white/10 rounded-lg p-3.5 text-sm text-zinc-400 resize-none outline-none focus:border-emerald-500" rows={2} placeholder="Impact and details..." value={item.description} onChange={(e) => {
                        const nl = [...formData.cv.experience]; nl[idx].description = e.target.value; setFormData({...formData, cv: {...formData.cv, experience: nl}});
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="space-y-10 welcome-fade">
              <div className="flex justify-between items-center pb-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white">Visual Storytelling</h3>
                <button onClick={addMemory} className="px-5 py-2.5 bg-emerald-600/10 text-emerald-500 rounded-lg border border-emerald-500/30 text-xs font-bold uppercase tracking-widest flex items-center hover:bg-emerald-600 hover:text-white transition-all">
                  <Plus size={16} className="mr-2" /> Capture Moment
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {formData.memories.map((m, idx) => (
                  <div key={m.id} className="p-6 bg-black/40 rounded-2xl border border-white/10 relative group flex flex-col gap-6 hover:border-emerald-500/40 transition-all">
                    <button onClick={() => removeMemory(m.id)} className="absolute top-4 right-4 text-zinc-700 hover:text-red-500 transition-colors z-20 bg-black/50 p-1.5 rounded-full">
                      <X size={16} />
                    </button>
                    
                    {/* MEMORY DRAG & DROP ZONE */}
                    <div 
                      onDragOver={(e) => handleDragOver(e, m.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'memory', idx)}
                      onClick={() => {
                        setCurrentMemoryIndex(idx);
                        memoryFileInputRef.current?.click();
                      }}
                      className={`aspect-video bg-black rounded-xl overflow-hidden border-2 border-dashed relative transition-all flex items-center justify-center cursor-pointer ${isDragging === m.id ? 'border-emerald-500 bg-emerald-500/10 scale-105' : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/5'}`}
                    >
                      {m.imageUrl ? (
                        <>
                          <img src={m.imageUrl} className="w-full h-full object-cover grayscale brightness-50 group-hover:brightness-75 transition-all" />
                           <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                             <Upload size={24} className="text-white mb-2 animate-pulse" />
                             <span className="text-[9px] uppercase font-bold text-white">Drop to Replace</span>
                           </div>
                        </>
                      ) : (
                        <div className="text-center p-6">
                          <Upload size={24} className="mx-auto mb-3 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Immediate Image Drop</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Caption</label>
                        <input className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-emerald-500 outline-none" value={m.title} onChange={(e) => {
                          const nl = [...formData.memories]; nl[idx].title = e.target.value; setFormData({...formData, memories: nl});
                        }} />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Timestamp</label>
                          <input className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-zinc-400 focus:border-emerald-500 outline-none" placeholder="e.g. Summer 2024" value={m.date} onChange={(e) => {
                            const nl = [...formData.memories]; nl[idx].date = e.target.value; setFormData({...formData, memories: nl});
                          }} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Backstory</label>
                        <textarea className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-zinc-400 resize-none outline-none focus:border-emerald-500" rows={3} value={m.description} onChange={(e) => {
                          const nl = [...formData.memories]; nl[idx].description = e.target.value; setFormData({...formData, memories: nl});
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <input 
                ref={memoryFileInputRef} 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => {
                  if (currentMemoryIndex !== null) handleMemoryImageUpload(e, currentMemoryIndex);
                }} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
