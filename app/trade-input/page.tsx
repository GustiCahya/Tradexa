"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FadeIn } from "../components/PageAnimate";

const defaultFormData = {
  id: "",
  pair: "",
  date: "",
  session: "London",
  entryTF: "1m",
  direction: "LONG",
  pnl: "",
  rr: "",
  day: "Monday",
  emotion: "Neutral",
  notes: ""
};

const getDefaultFormData = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
  const localDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  return { ...defaultFormData, date: localISOTime, day: localDay };
};

function TradeInputForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (editId) {
      // Fetch existing trade data
      fetch(`/api/trades/${editId}`)
        .then(res => res.json())
        .then(data => {
            if (data && !data.error) {
               const localISOTime = new Date(data.date).toISOString().slice(0, 16);
               setFormData({
                  ...defaultFormData,
                  ...data,
                  date: localISOTime,
                  pnl: data.pnl?.toString() ?? "",
                  rr: data.rr?.toString() ?? "",
               });
            }
        })
        .catch(console.error);
    } else {
      setFormData(getDefaultFormData());
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Ensure final payload has matching signs before sending to backend
    const isPnlNegative = formData.pnl.startsWith('-');
    const isRrNegative = formData.rr.startsWith('-');
    
    let finalPnl = formData.pnl;
    let finalRr = formData.rr;
    
    if (isPnlNegative && !isRrNegative && finalRr !== "") {
        finalRr = '-' + finalRr.replace('-', '');
    } else if (isRrNegative && !isPnlNegative && finalPnl !== "") {
        finalPnl = '-' + finalPnl.replace('-', '');
    }
    
    // Clean up empty standalone "-" signs
    if (finalPnl === "-") finalPnl = "";
    if (finalRr === "-") finalRr = "";

    const payload = { ...formData, pnl: finalPnl, rr: finalRr };

    try {
      const url = editId ? `/api/trades` : `/api/trades`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save trade');
      }

      router.push('/overview');
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving the trade.');
      setIsSubmitting(false);
    }
  };

  const syncSigns = (changedId: 'pnl' | 'rr', newValue: string, otherValue: string) => {
    let newOtherValue = otherValue;
    const isNegative = newValue.startsWith('-');
    const otherIsNegative = otherValue.startsWith('-');
    
    if (isNegative && !otherIsNegative && otherValue !== '') {
        newOtherValue = '-' + otherValue;
    } else if (!isNegative && newValue !== '' && otherIsNegative) {
        newOtherValue = otherValue.replace('-', '');
    }
    
    if (isNegative && otherValue === '') {
        newOtherValue = '-';
    } else if (!isNegative && otherValue === '-') {
        newOtherValue = '';
    }
    return newOtherValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (id === 'pnl') {
        const newRr = syncSigns('pnl', value, formData.rr);
        setFormData(prev => ({ ...prev, pnl: value, rr: newRr }));
    } else if (id === 'rr') {
        const newPnl = syncSigns('rr', value, formData.pnl);
        setFormData(prev => ({ ...prev, pnl: newPnl, rr: value }));
    } else if (id === 'date') {
        const dateObj = new Date(value);
        if (!isNaN(dateObj.getTime())) {
            const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            setFormData(prev => ({ ...prev, date: value, day: dayStr }));
        } else {
            setFormData(prev => ({ ...prev, date: value }));
        }
    } else {
        setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-24">
      <FadeIn delay={0.1}>
        <Link href="/overview" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{editId ? "Edit Trade" : "Log Trade"}</h1>
        <p className="text-gray-400 mb-10">Capture every detail of your trade, including your emotional state and RR.</p>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pair */}
              <div className="space-y-2">
                <label htmlFor="pair" className="block text-sm font-medium text-gray-300">
                  Pair / Symbol
                </label>
                <input 
                  id="pair"
                  list="pair-options"
                  type="text" 
                  required
                  value={formData.pair}
                  onChange={handleChange}
                  placeholder="e.g. BTC/USD" 
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                />
                <datalist id="pair-options">
                  <option value="EUR/USD" />
                  <option value="GBP/USD" />
                  <option value="USD/JPY" />
                  <option value="AUD/USD" />
                  <option value="USD/CAD" />
                  <option value="USD/CHF" />
                  <option value="NZD/USD" />
                  <option value="GBP/JPY" />
                  <option value="XAU/USD" />
                  <option value="BTC/USD" />
                  <option value="ETH/USD" />
                </datalist>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-300">
                  Date & Time
                </label>
                <input 
                  id="date"
                  type="datetime-local" 
                  required
                  value={formData.date}
                  onChange={handleChange}
                  style={{ colorScheme: 'dark' }}
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Day */}
              <div className="space-y-2">
                <label htmlFor="day" className="block text-sm font-medium text-gray-300">
                  Day
                </label>
                <select 
                  id="day"
                  value={formData.day}
                  disabled
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white appearance-none opacity-70"
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                    <option key={d} value={d} className="bg-gray-900">{d}</option>
                  ))}
                </select>
              </div>

              {/* Session */}
              <div className="space-y-2">
                <label htmlFor="session" className="block text-sm font-medium text-gray-300">
                  Session
                </label>
                <select 
                  id="session"
                  value={formData.session}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all appearance-none"
                >
                  {["London", "New York", "Asian", "Overlap"].map(s => (
                    <option key={s} value={s} className="bg-gray-900">{s}</option>
                  ))}
                </select>
              </div>

              {/* Entry TF */}
              <div className="space-y-2">
                <label htmlFor="entryTF" className="block text-sm font-medium text-gray-300">
                  Entry TF
                </label>
                <input 
                  id="entryTF"
                  type="text" 
                  value={formData.entryTF}
                  onChange={handleChange}
                  placeholder="e.g. 1m, 5m" 
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Direction */}
              <div className="space-y-2">
                <label htmlFor="direction" className="block text-sm font-medium text-gray-300">
                  Direction
                </label>
                <select 
                  id="direction"
                  value={formData.direction}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="LONG" className="bg-gray-900 text-blue-400">Long</option>
                  <option value="SHORT" className="bg-gray-900 text-orange-400">Short</option>
                </select>
              </div>

              {/* P/L */}
              <div className="space-y-2">
                <label htmlFor="pnl" className="block text-sm font-medium text-gray-300">
                  Profit / Loss ($)
                </label>
                <input 
                  id="pnl"
                  type="number" 
                  step="any"
                  value={formData.pnl}
                  onChange={handleChange}
                  placeholder="0.00" 
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* RR */}
              <div className="space-y-2">
                <label htmlFor="rr" className="block text-sm font-medium text-gray-300">
                  Risk-Reward (RR)
                </label>
                <input 
                  id="rr"
                  type="number" 
                  step="0.1"
                  value={formData.rr}
                  onChange={handleChange}
                  placeholder="e.g. 2.5" 
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Emotion */}
              <div className="space-y-2">
                <label htmlFor="emotion" className="block text-sm font-medium text-gray-300">
                  Emotion
                </label>
                <select 
                  id="emotion"
                  value={formData.emotion}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all appearance-none"
                >
                  {["Neutral", "Disciplined", "Confident", "Greedy", "Fearful", "Anxious", "Frustrated"].map(e => (
                    <option key={e} value={e} className="bg-gray-900">{e}</option>
                  ))}
                </select>
              </div>


            </div>

            {/* General Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
                General Notes & Reflection
              </label>
              <textarea 
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Reflect on the trade execution..." 
                className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-y"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {editId ? "Update Trade" : "Save Trade Record"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </FadeIn>
    </div>
  );
}

export default function TradeInputPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <TradeInputForm />
    </Suspense>
  );
}
