import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  Download, 
  Upload,
  Trash2, 
  TrendingUp, 
  UserCheck, 
  XCircle,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import './App.css';

const STATUS_OPTIONS = ['Interested', 'Junk', 'Purchased'];

function App() {
  const [leads, setLeads] = useState(() => {
    const savedLeads = localStorage.getItem('whatsapp_leads_v2');
    return savedLeads ? JSON.parse(savedLeads) : [];
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Interested',
    value: '',
    eventDate: new Date().toISOString().split('T')[0]
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('whatsapp_leads_v2', JSON.stringify(leads));
  }, [leads]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const normalizePhone = (phone) => {
    let p = phone.replace(/\D/g, '');
    if (!p.startsWith('20')) {
      if (p.startsWith('0')) p = '20' + p.substring(1);
      else p = '20' + p;
    }
    return p;
  };

  const normalizeEmail = (email) => email.trim().toLowerCase();

  const addLead = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newLead = {
      id: Date.now(),
      ...formData,
      email: normalizeEmail(formData.email),
      phone: normalizePhone(formData.phone),
      value: formData.status === 'Purchased' ? parseFloat(formData.value) || 0 : 0,
      createdAt: new Date().toISOString()
    };

    setLeads([newLead, ...leads]);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      status: 'Interested', 
      value: '', 
      eventDate: new Date().toISOString().split('T')[0] 
    });
  };

  const updateLeadStatus = (id, newStatus) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { 
        ...lead, 
        status: newStatus,
        value: newStatus === 'Purchased' ? lead.value || 0 : 0,
        // Update event date to today if marking as purchased now
        eventDate: newStatus === 'Purchased' ? new Date().toISOString().split('T')[0] : lead.eventDate
      } : lead
    ));
  };

  const deleteLead = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const handleImportClick = () => fileInputRef.current.click();

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const rows = content.split('\n');
      const newLeads = [];
      
      // Basic CSV parsing (assuming: Name, Email, Phone or similar)
      // Header check
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue;
        const cols = rows[i].split(',').map(c => c.trim());
        
        const lead = {
          id: Date.now() + i,
          name: cols[headers.indexOf('name')] || cols[headers.indexOf('first name')] || cols[0],
          email: normalizeEmail(cols[headers.indexOf('email')] || cols[1] || ''),
          phone: normalizePhone(cols[headers.indexOf('phone')] || cols[headers.indexOf('phone number')] || cols[2] || ''),
          status: 'Interested',
          value: 0,
          eventDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        };
        
        if (lead.name && lead.phone) {
          newLeads.push(lead);
        }
      }
      
      setLeads([...newLeads, ...leads]);
      alert(`Successfully imported ${newLeads.length} leads!`);
    };
    reader.readAsText(file);
  };

  const exportToFacebook = () => {
    const purchasedLeads = leads.filter(lead => lead.status === 'Purchased');
    
    if (purchasedLeads.length === 0) {
      alert('No purchased leads to export.');
      return;
    }

    // CSV Headers for Advanced Matching
    const headers = ['email', 'phone', 'event_name', 'event_time', 'value', 'currency'];
    
    const rows = purchasedLeads.map(lead => {
      // Use the eventDate for the timestamp
      const timestamp = Math.floor(new Date(lead.eventDate).getTime() / 1000);

      return [
        lead.email,
        lead.phone,
        'Purchase',
        timestamp,
        lead.value || 0,
        'USD'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `meta_offline_conversions_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const stats = {
    total: leads.length,
    purchased: leads.filter(l => l.status === 'Purchased').length,
    revenue: leads.reduce((acc, l) => acc + (parseFloat(l.value) || 0), 0),
    conversionRate: leads.length > 0 ? ((leads.filter(l => l.status === 'Purchased').length / leads.length) * 100).toFixed(1) : 0,
    avgValue: leads.length > 0 ? (leads.reduce((acc, l) => acc + (parseFloat(l.value) || 0), 0) / leads.length).toFixed(1) : 0
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Data Science Ready</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-8 h-8 text-indigo-600" />
              WhatsApp CRM Pro
            </h1>
            <p className="text-slate-500">Train your Meta algorithm with offline sales data</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleImportClick}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              Import Systeme.io
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileImport} 
              className="hidden" 
              accept=".csv"
            />
            <button 
              onClick={exportToFacebook}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Export to Meta
            </button>
          </div>
        </header>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={<Users className="text-blue-500" />} label="Total Leads" value={stats.total} />
          <StatCard icon={<UserCheck className="text-emerald-500" />} label="Purchased" value={stats.purchased} />
          <StatCard icon={<DollarSign className="text-indigo-500" />} label="Revenue" value={`$${stats.revenue.toLocaleString()}`} />
          <StatCard icon={<BarChart3 className="text-amber-500" />} label="Conv. Rate" value={`${stats.conversionRate}%`} />
          <StatCard icon={<TrendingUp className="text-rose-500" />} label="Avg. Value" value={`$${stats.avgValue}`} />
        </div>

        {/* Add Lead Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            Capture New Lead
          </h2>
          <form onSubmit={addLead} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Name</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleInputChange}
                placeholder="John Doe"
                className="input-field" required
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Email</label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleInputChange}
                placeholder="john@example.com"
                className="input-field"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Phone</label>
              <input 
                type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                placeholder="01234567890"
                className="input-field" required
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Status</label>
              <select 
                name="status" value={formData.status} onChange={handleInputChange}
                className="input-field appearance-none cursor-pointer"
              >
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            
            {formData.status === 'Purchased' ? (
              <>
                <div className="lg:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Value ($)</label>
                  <input 
                    type="number" name="value" value={formData.value} onChange={handleInputChange}
                    placeholder="0.00" className="input-field"
                  />
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Sale Date</label>
                  <input 
                    type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </>
            ) : null}

            <div className={`${formData.status === 'Purchased' ? 'lg:col-span-6' : 'lg:col-span-2'}`}>
              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Lead to System
              </button>
            </div>
          </form>
        </div>

        {/* Lead Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Users className="w-10 h-10 opacity-20" />
                        <p>Your dataset is empty. Start by importing leads or adding them manually.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.eventDate || lead.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {lead.phone}
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {lead.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select 
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className={`text-[10px] font-black px-3 py-1 rounded-full border transition-all appearance-none cursor-pointer uppercase tracking-tighter
                              ${lead.status === 'Purchased' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                lead.status === 'Interested' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                'bg-slate-50 text-slate-500 border-slate-200'}`}
                          >
                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          {lead.status === 'Purchased' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-slate-900">
                          {lead.status === 'Purchased' ? `$${parseFloat(lead.value).toLocaleString()}` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => deleteLead(lead.id)}
                          className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-lg shadow-inner">
          {icon}
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
      </div>
      <div className="text-xl font-black text-slate-900 tracking-tight">{value}</div>
    </div>
  );
}

export default App;
