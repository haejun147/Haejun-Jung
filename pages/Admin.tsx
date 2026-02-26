
import React, { useState, useRef, DragEvent } from 'react';
import { 
  Save, RefreshCw, Plus, Trash2, Edit3, Image as ImageIcon, 
  Info, FileText, Upload, X, MousePointer2, LogOut, Palette, Calendar
} from 'lucide-react';
import { CMSData, ResearchProject, CVEntry, MemoryPost } from '../types';

interface AdminProps {
  data: CMSData;
  onUpdate: (newData: CMSData) => void;
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ data, onUpdate, onLogout }) => {
  const [formData, setFormData] = useState<CMSData>(JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState<'info' | 'research' | 'cv' | 'memories' | 'site'>('info');
  const [isDragging, setIsDragging] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const memoryInputRef = useRef<HTMLInputElement>(null);
  const [activeMemoryIdx, setActiveMemoryIdx] = useState<number | null>(null);

  const handleSave = () => {
    onUpdate(formData);
    alert('Site settings updated successfully!');
  };

  const handleReset = () => {
    if (confirm('Revert all unsaved changes to original state?')) {
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

  const handleMemoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeMemoryIdx !== null) {
      processFile(file, (base64) => {
        const newList = [...formData.memories];
        newList[activeMemoryIdx].imageUrl = base64;
        setFormData({ ...formData, memories: newList });
      });
    }
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

  const updateCVItem = (type: 'education' | 'experience', index: number, field: keyof CVEntry, value: string) => {
    const newList = [...formData.cv[type]];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, cv: { ...formData.cv, [type]: newList } });
  };

  const addMemory = () => {
    const newItem: MemoryPost = {
      id: Date.now().toString(),
      title: "New Memory Title",
      date: "Month Year",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
      description: ""
    };
    setFormData(prev => ({ ...prev, memories: [newItem, ...prev.memories] }));
  };

  const updateMemory = (index: number, field: keyof MemoryPost, value: string) => {
    const newList = [...formData.memories];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, memories: newList });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Settings Dashboard</h1>
          <p className="text-zinc-400 text-sm font-light uppercase tracking-widest">Manage your professional identity and content</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onLogout} className="flex items-center px-4 py-2 text-zinc-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">
            <LogOut size={14} className="mr-2" /> Logout
          </button>
          <button onClick={handleReset} className="flex items-center px-4 py-2 border border-white/10 text-zinc-400 hover:text-white rounded-md transition-all text-[10px] font-bold uppercase tracking-widest bg-white/5">
            <RefreshCw size={14} className="mr-2" /> Reset
          </button>
          <button onClick={handleSave} className="flex items-center px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-md hover:bg-emerald-500 transition-all text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="flex flex-col space-y-2">
          {[
            { id: 'info', icon: Info, label: 'Profile' },
            { id: 'research', icon: Edit3, label: 'Research' },
            { id: 'cv', icon: FileText, label: 'CV' },
            { id: 'memories', icon: ImageIcon, label: 'Memories' },
            { id: 'site', icon: Palette, label: 'Site Config' }
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
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div 
                  onDragOver={(e) => handleDragOver(e, 'profile')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'profile')}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group w-52 h-64 bg-black rounded-2xl overflow-hidden flex-shrink-0 border-2 border-dashed transition-all relative cursor-pointer flex items-center justify-center ${isDragging === 'profile' ? 'border-emerald-500 bg-emerald-500/10 scale-105' : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/5'}`}
                >
                  {formData.personalInfo.headshot ? (
                    <img src={formData.personalInfo.headshot} className="w-full h-full object-cover grayscale brightness-50 group-hover:brightness-75 transition-all" />
                  ) : (
                    <Upload size={32} className="text-zinc-700" />
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <MousePointer2 size={32} className="text-emerald-500 mb-2 animate-bounce" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Replace Photo</span>
                  </div>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>

                <div className="flex-1 space-y-6 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Public Name</label>
                      <input type="text" value={formData.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm text-white outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Academic Role</label>
                      <input type="text" value={formData.personalInfo.role} onChange={(e) => updatePersonalInfo('role', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm text-white outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Introduction Bio</label>
                    <textarea rows={6} value={formData.personalInfo.bio} onChange={(e) => updatePersonalInfo('bio', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm text-white outline-none focus:border-emerald-500 resize-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'research' && (
             <div className="space-y-8 welcome-fade">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Manage Research</h3>
                  <button onClick={addResearch} className="px-4 py-2 bg-emerald-600/10 text-emerald-500 rounded border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest flex items-center hover:bg-emerald-600 hover:text-white transition-all">
                    <Plus size={14} className="mr-2" /> Add Project
                  </button>
                </div>
                {formData.research.map((r, idx) => (
                  <div key={r.id} className="p-6 bg-black/30 border border-white/10 rounded-xl relative group">
                    <button onClick={() => setFormData({...formData, research: formData.research.filter(res => res.id !== r.id)})} className="absolute top-4 right-4 text-zinc-700 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <input className="w-full bg-black/40 border border-white/5 rounded p-3 text-sm text-white font-bold mb-4 focus:border-emerald-500 outline-none" value={r.title} onChange={(e) => {
                       const nl = [...formData.research]; nl[idx].title = e.target.value; setFormData({...formData, research: nl});
                    }} placeholder="Research Title" />
                    <div className="grid grid-cols-2 gap-4">
                      <input className="bg-black/40 border border-white/5 rounded p-3 text-xs text-zinc-400 focus:border-emerald-500 outline-none" value={r.authors} onChange={(e) => {
                         const nl = [...formData.research]; nl[idx].authors = e.target.value; setFormData({...formData, research: nl});
                      }} placeholder="Authors" />
                      <input className="bg-black/40 border border-white/5 rounded p-3 text-xs text-zinc-400 focus:border-emerald-500 outline-none" value={r.journal} onChange={(e) => {
                         const nl = [...formData.research]; nl[idx].journal = e.target.value; setFormData({...formData, research: nl});
                      }} placeholder="Journal/Venue" />
                    </div>
                  </div>
                ))}
             </div>
          )}

          {activeTab === 'cv' && (
            <div className="space-y-12 welcome-fade">
              {/* Experience Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center">
                    <FileText size={18} className="mr-3 text-emerald-500" /> Professional Experience
                  </h3>
                  <button onClick={() => addCVItem('experience')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.cv.experience.map((item, idx) => (
                    <div key={item.id} className="p-5 bg-black/40 border border-white/5 rounded-xl space-y-4 relative group">
                      <button onClick={() => setFormData({...formData, cv: {...formData.cv, experience: formData.cv.experience.filter(e => e.id !== item.id)}})} className="absolute top-4 right-4 text-zinc-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                        <X size={14} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="bg-black/20 border border-white/10 rounded p-2 text-sm text-white font-bold outline-none focus:border-emerald-500" value={item.title} onChange={(e) => updateCVItem('experience', idx, 'title', e.target.value)} placeholder="Position Title" />
                        <input className="bg-black/20 border border-white/10 rounded p-2 text-sm text-zinc-400 outline-none focus:border-emerald-500" value={item.period} onChange={(e) => updateCVItem('experience', idx, 'period', e.target.value)} placeholder="Period (e.g., 2022 - Present)" />
                      </div>
                      <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs text-emerald-500 font-bold uppercase tracking-widest outline-none focus:border-emerald-500" value={item.institution} onChange={(e) => updateCVItem('experience', idx, 'institution', e.target.value)} placeholder="Institution/Company" />
                      <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs text-zinc-400 outline-none focus:border-emerald-500 resize-none" rows={3} value={item.description} onChange={(e) => updateCVItem('experience', idx, 'description', e.target.value)} placeholder="Description..." />
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center">
                    <ImageIcon size={18} className="mr-3 text-emerald-500" /> Academic Education
                  </h3>
                  <button onClick={() => addCVItem('education')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.cv.education.map((item, idx) => (
                    <div key={item.id} className="p-5 bg-black/40 border border-white/5 rounded-xl space-y-4 relative group">
                      <button onClick={() => setFormData({...formData, cv: {...formData.cv, education: formData.cv.education.filter(e => e.id !== item.id)}})} className="absolute top-4 right-4 text-zinc-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                        <X size={14} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="bg-black/20 border border-white/10 rounded p-2 text-sm text-white font-bold outline-none focus:border-emerald-500" value={item.title} onChange={(e) => updateCVItem('education', idx, 'title', e.target.value)} placeholder="Degree Title" />
                        <input className="bg-black/20 border border-white/10 rounded p-2 text-sm text-zinc-400 outline-none focus:border-emerald-500" value={item.period} onChange={(e) => updateCVItem('education', idx, 'period', e.target.value)} placeholder="Period" />
                      </div>
                      <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs text-emerald-500 font-bold uppercase tracking-widest outline-none focus:border-emerald-500" value={item.institution} onChange={(e) => updateCVItem('education', idx, 'institution', e.target.value)} placeholder="University" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="space-y-8 welcome-fade">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Gallery Management</h3>
                  <button onClick={addMemory} className="px-4 py-2 bg-emerald-600/10 text-emerald-500 rounded border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest flex items-center hover:bg-emerald-600 hover:text-white transition-all">
                    <Plus size={14} className="mr-2" /> New Memory
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {formData.memories.map((m, idx) => (
                   <div key={m.id} className="bg-black/40 border border-white/5 rounded-xl p-5 space-y-4 relative group">
                      <button onClick={() => setFormData({...formData, memories: formData.memories.filter(item => item.id !== m.id)})} className="absolute top-4 right-4 z-10 p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all">
                         <Trash2 size={14} />
                      </button>
                      <div 
                        onClick={() => { setActiveMemoryIdx(idx); memoryInputRef.current?.click(); }}
                        className="aspect-video bg-black border border-white/10 rounded-lg overflow-hidden cursor-pointer relative"
                      >
                         <img src={m.imageUrl} className="w-full h-full object-cover grayscale brightness-50 hover:brightness-100 transition-all" />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Change Image</span>
                         </div>
                      </div>
                      <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm text-white font-bold outline-none focus:border-emerald-500" value={m.title} onChange={(e) => updateMemory(idx, 'title', e.target.value)} placeholder="Memory Title" />
                      <div className="flex items-center text-[10px] text-zinc-500 uppercase tracking-widest">
                         <Calendar size={12} className="mr-2" />
                         <input className="bg-transparent border-none outline-none focus:text-emerald-500" value={m.date} onChange={(e) => updateMemory(idx, 'date', e.target.value)} placeholder="Date (e.g. Aug 2023)" />
                      </div>
                      <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs text-zinc-400 outline-none focus:border-emerald-500 resize-none" rows={2} value={m.description} onChange={(e) => updateMemory(idx, 'description', e.target.value)} placeholder="Brief description..." />
                   </div>
                 ))}
               </div>
               <input ref={memoryInputRef} type="file" className="hidden" accept="image/*" onChange={handleMemoryUpload} />
            </div>
          )}

          {activeTab === 'site' && (
            <div className="space-y-12 welcome-fade">
              <div>
                <h3 className="text-xl font-bold mb-8 text-white">Visual Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Primary Accent Color</label>
                    <div className="flex gap-4 items-center">
                      <input 
                        type="color" 
                        value={formData.theme.primary} 
                        onChange={(e) => setFormData({...formData, theme: {...formData.theme, primary: e.target.value}})} 
                        className="w-12 h-12 bg-transparent border-none cursor-pointer" 
                      />
                      <input 
                        type="text" 
                        value={formData.theme.primary} 
                        onChange={(e) => setFormData({...formData, theme: {...formData.theme, primary: e.target.value}})} 
                        className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm text-white outline-none focus:border-emerald-500 font-mono" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-8 text-white">Socials & Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">LinkedIn URL</label>
                    <input type="text" value={formData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm text-white outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Email</label>
                    <input type="email" value={formData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3.5 text-sm text-white outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
