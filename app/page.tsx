'use client';
import React, { useState, useEffect } from 'react';
import { Menu, PieChart, TrendingUp, Wallet, ArrowUpRight, ArrowDownLeft, Banknote, Send, Users, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

// --- 1. DEFINITIONS ---
interface Bill {
  id: string;
  title: string;
  amount: number;
}

interface SavingsGoal {
  id: string;
  title: string;
  target: number;
  current: number;
}

interface Debt {
  id: string;
  person: string;
  amount: number;
  type: 'owed_to_me' | 'i_owe';
  date: string;
}

interface UserProfile {
  monthlyIncome: number;
  fixedExpenses: Bill[];
  savingsGoals: SavingsGoal[];
  debts: Debt[];
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
}

const CATEGORIES = [
  { name: 'Food', icon: '🍔', color: 'bg-orange-500', isEssential: true },
  { name: 'Transport', icon: '🚕', color: 'bg-blue-500', isEssential: true },
  { name: 'Data', icon: '📡', color: 'bg-purple-500', isEssential: false },
  { name: 'Entertainment', icon: '🍿', color: 'bg-pink-500', isEssential: false },
  { name: 'Other', icon: '📦', color: 'bg-gray-500', isEssential: false },
];

const DEFAULT_USER: UserProfile = {
  monthlyIncome: 1500,
  fixedExpenses: [
    { id: '1', title: 'Hostel Fees', amount: 400 },
    { id: '2', title: 'Data/WiFi', amount: 150 },
  ],
  savingsGoals: [
    { id: '1', title: 'New Laptop', target: 3000, current: 0 },
  ],
  debts: []
};

// --- 2. MODAL COMPONENTS ---

// A. SETTINGS MODAL (With Modes & Goal Creation)
function BudgetSettingsModal({ isOpen, onClose, userData, onSave, isDarkMode, isSemesterMode, setIsSemesterMode, isSurvivalMode, setIsSurvivalMode }: any) {
  const [income, setIncome] = useState(userData.monthlyIncome);
  const [bills, setBills] = useState<Bill[]>(userData.fixedExpenses);
  const [goals, setGoals] = useState<SavingsGoal[]>(userData.savingsGoals);
  
  // Inputs
  const [newBillTitle, setNewBillTitle] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const modalBg = isDarkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-black/5';
  const inputBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';
  const itemBg = isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200';

  useEffect(() => {
    if (isOpen) {
      setIncome(userData.monthlyIncome);
      setBills(userData.fixedExpenses);
      setGoals(userData.savingsGoals);
    }
  }, [isOpen, userData]);

  if (!isOpen) return null;

  // Bill Logic
  const handleAddBill = () => {
    if (!newBillTitle || !newBillAmount) return;
    const newBill: Bill = { id: Date.now().toString(), title: newBillTitle, amount: parseFloat(newBillAmount) };
    setBills([...bills, newBill]);
    setNewBillTitle(''); setNewBillAmount('');
  };
  const removeBill = (id: string) => setBills(bills.filter((b) => b.id !== id));

  // Goal Logic
  const handleAddGoal = () => {
    if (!newGoalTitle || !newGoalTarget) return;
    const newGoal: SavingsGoal = { 
      id: Date.now().toString(), 
      title: newGoalTitle, 
      target: parseFloat(newGoalTarget), 
      current: 0 
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle(''); setNewGoalTarget('');
  };

  const handleSave = () => {
     onSave({ ...userData, monthlyIncome: income, fixedExpenses: bills, savingsGoals: goals });
     onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className={`${modalBg} w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl border backdrop-blur-xl p-6 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl h-[85vh] sm:h-auto overflow-y-auto`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-2xl font-bold tracking-tight ${textMain}`}>Settings</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>✕</button>
        </div>

        {/* MODES */}
        <div className="mb-8 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-4">
           <label className="text-xs text-slate-500 font-bold tracking-widest uppercase">Student Modes</label>
           
           <div className="flex justify-between items-center">
              <div><span className={`block font-bold ${textMain}`}>📅 Semester Mode</span><span className="text-xs text-slate-500">Plan for 4 months (120 days)</span></div>
              <button onClick={() => setIsSemesterMode(!isSemesterMode)} className={`w-12 h-7 rounded-full transition-colors relative ${isSemesterMode ? 'bg-blue-500' : 'bg-slate-600'}`}>
                 <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isSemesterMode ? 'left-6' : 'left-1'}`} />
              </button>
           </div>

           <div className="flex justify-between items-center">
              <div><span className={`block font-bold ${isSurvivalMode ? 'text-red-500' : textMain}`}>🚨 Survival Mode</span><span className="text-xs text-slate-500">Hide fun stuff. Focus on food.</span></div>
              <button onClick={() => setIsSurvivalMode(!isSurvivalMode)} className={`w-12 h-7 rounded-full transition-colors relative ${isSurvivalMode ? 'bg-red-500' : 'bg-slate-600'}`}>
                 <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isSurvivalMode ? 'left-6' : 'left-1'}`} />
              </button>
           </div>
        </div>
        
        {/* INCOME */}
        <div className="mb-8 space-y-2">
          <label className="text-xs text-emerald-500 font-bold tracking-widest uppercase ml-1">{isSemesterMode ? 'Total Semester Fund' : 'Monthly Income'}</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">₵</span>
            <input type="number" className={`w-full ${inputBg} p-4 pl-10 rounded-2xl border outline-none text-2xl font-bold ${textMain}`} value={income} onChange={(e) => setIncome(parseFloat(e.target.value) || 0)} />
          </div>
        </div>

        {/* FIXED BILLS */}
        <div className="mb-8">
          <label className="text-xs text-red-400 font-bold tracking-widest uppercase ml-1 mb-3 block">Fixed Bills</label>
          <div className="space-y-3 mb-4">
            {bills.map((bill) => (
              <div key={bill.id} className={`flex justify-between items-center ${itemBg} p-4 rounded-xl border`}>
                <span className={`font-medium ${textMain}`}>{bill.title}</span>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${textMain}`}>₵{bill.amount}</span>
                  <button onClick={() => removeBill(bill.id)} className="text-slate-400 hover:text-red-500 p-1">×</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input placeholder="Bill Name" className={`${inputBg} p-3 rounded-xl text-sm w-full border outline-none font-medium ${textMain}`} value={newBillTitle} onChange={(e) => setNewBillTitle(e.target.value)} />
            <input type="number" placeholder="Amt" className={`${inputBg} p-3 rounded-xl text-sm w-24 border outline-none font-medium ${textMain}`} value={newBillAmount} onChange={(e) => setNewBillAmount(e.target.value)} />
            <button onClick={handleAddBill} className="bg-white/10 text-white p-3 rounded-xl font-bold">＋</button>
          </div>
        </div>

        {/* ADD GOAL */}
        <div className="mb-8">
          <label className="text-xs text-blue-400 font-bold tracking-widest uppercase ml-1 mb-3 block">Add New Goal</label>
          <div className="flex gap-2">
            <input placeholder="Goal (e.g. PS5)" className={`${inputBg} p-3 rounded-xl text-sm w-full border outline-none font-medium ${textMain}`} value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)} />
            <input type="number" placeholder="Target" className={`${inputBg} p-3 rounded-xl text-sm w-24 border outline-none font-medium ${textMain}`} value={newGoalTarget} onChange={(e) => setNewGoalTarget(e.target.value)} />
            <button onClick={handleAddGoal} className="bg-white/10 text-white p-3 rounded-xl font-bold">＋</button>
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all">Save Changes</button>
      </div>
    </div>
  );
}

// B. ADD EXPENSE MODAL (With Fee Logic)
function AddExpenseModal({ isOpen, onClose, onSave, isDarkMode }: any) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [feeType, setFeeType] = useState('none');

  const modalBg = isDarkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-black/5';
  const inputBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';

  if (!isOpen) return null;

  const rawAmount = parseFloat(amount) || 0;
  let fee = 0;
  if (feeType === 'cashout') { fee = Math.min(rawAmount * 0.01, 10); } 
  else if (feeType === 'transfer') { fee = rawAmount * 0.0075; }
  
  const totalAmount = rawAmount + fee;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className={`${modalBg} w-full sm:max-w-sm sm:rounded-3xl rounded-t-3xl border backdrop-blur-xl p-6 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold tracking-tight ${textMain}`}>New Expense</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>✕</button>
        </div>

        <div className="space-y-5">
          <div><input autoFocus type="text" placeholder="What did you buy?" className={`w-full ${inputBg} p-4 rounded-2xl border outline-none font-medium ${textMain}`} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₵</span><input type="number" placeholder="0.00" className={`w-full ${inputBg} p-4 pl-10 rounded-2xl border outline-none text-2xl font-bold ${textMain}`} value={amount} onChange={(e) => setAmount(e.target.value)} /></div>

          <div className="space-y-2">
             <label className="text-xs text-slate-500 font-bold tracking-widest uppercase ml-1">Category</label>
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                   <button key={cat.name} onClick={() => setCategory(cat.name)} className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap border transition-all ${category === cat.name ? 'bg-emerald-500 border-emerald-500 text-white' : `${inputBg} opacity-60`}`}><span className="mr-2">{cat.icon}</span>{cat.name}</button>
                ))}
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs text-slate-500 font-bold tracking-widest uppercase ml-1">Fee</label>
             <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setFeeType('none')} className={`p-3 rounded-xl text-xs font-bold border ${feeType === 'none' ? 'bg-slate-700 text-white' : `${inputBg} opacity-70`}`}><Banknote size={16} className="mx-auto mb-1"/> None</button>
                <button onClick={() => setFeeType('cashout')} className={`p-3 rounded-xl text-xs font-bold border ${feeType === 'cashout' ? 'bg-yellow-600 text-white' : `${inputBg} opacity-70`}`}><ArrowDownLeft size={16} className="mx-auto mb-1"/> Cash Out</button>
                <button onClick={() => setFeeType('transfer')} className={`p-3 rounded-xl text-xs font-bold border ${feeType === 'transfer' ? 'bg-blue-600 text-white' : `${inputBg} opacity-70`}`}><Send size={16} className="mx-auto mb-1"/> Transfer</button>
             </div>
             {fee > 0 && <div className="text-right text-xs font-bold text-emerald-500 mt-1">+ ₵{fee.toFixed(2)} Fee</div>}
          </div>

          <button onClick={() => { if(!title || !amount) return; onSave(title, totalAmount, category); setTitle(''); setAmount(''); setFeeType('none'); onClose(); }} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98]">Save (Total: ₵{totalAmount.toFixed(2)})</button>
        </div>
      </div>
    </div>
  );
}

// C. ADD DEBT MODAL
function AddDebtModal({ isOpen, onClose, onSave, isDarkMode }: any) {
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'owed_to_me' | 'i_owe'>('owed_to_me');

  const modalBg = isDarkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-black/5';
  const inputBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className={`${modalBg} w-full sm:max-w-sm sm:rounded-3xl rounded-t-3xl border backdrop-blur-xl p-6 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold tracking-tight ${textMain}`}>Track Debt</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>✕</button>
        </div>

        <div className="space-y-5">
           <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/20">
              <button onClick={() => setType('owed_to_me')} className={`py-3 rounded-xl text-sm font-bold transition-all ${type === 'owed_to_me' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>They Owe Me</button>
              <button onClick={() => setType('i_owe')} className={`py-3 rounded-xl text-sm font-bold transition-all ${type === 'i_owe' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>I Owe Them</button>
           </div>
          <div><input autoFocus type="text" placeholder="Person's Name" className={`w-full ${inputBg} p-4 rounded-2xl border outline-none font-medium ${textMain}`} value={person} onChange={(e) => setPerson(e.target.value)} /></div>
          <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₵</span><input type="number" placeholder="0.00" className={`w-full ${inputBg} p-4 pl-10 rounded-2xl border outline-none text-2xl font-bold ${textMain}`} value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <button onClick={() => { if(!person || !amount) return; onSave(person, parseFloat(amount), type); setPerson(''); setAmount(''); onClose(); }} className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98]">Save Debt</button>
        </div>
      </div>
    </div>
  );
}

// D. UPDATE GOAL MODAL
function UpdateGoalModal({ isOpen, onClose, goal, onUpdate, onDelete, isDarkMode }: any) {
  const [current, setCurrent] = useState('');
  const modalBg = isDarkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-black/5';
  const inputBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200';
  const textMain = isDarkMode ? 'text-white' : 'text-slate-900';

  useEffect(() => { if (goal) setCurrent(goal.current.toString()); }, [goal]);
  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className={`${modalBg} w-full sm:max-w-sm sm:rounded-3xl rounded-t-3xl border backdrop-blur-xl p-6 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <div><h2 className={`text-xl font-bold ${textMain}`}>Update Goal</h2><p className="text-sm text-slate-500">{goal.title}</p></div>
          <button onClick={onClose} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>✕</button>
        </div>
        <div className="space-y-4">
          <label className="text-xs text-slate-500 font-bold tracking-widest uppercase">Total Saved</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl font-bold">₵</span>
             <input autoFocus type="number" className={`w-full ${inputBg} p-4 pl-10 rounded-2xl border outline-none text-3xl font-bold ${textMain}`} value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => onDelete(goal.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-4 rounded-2xl transition-all active:scale-95">Delete</button>
            <button onClick={() => onUpdate(goal.id, parseFloat(current) || 0)} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- 3. MAIN DASHBOARD ---
export default function StashDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSemesterMode, setIsSemesterMode] = useState(false); // NEW
  const [isSurvivalMode, setIsSurvivalMode] = useState(false); // NEW

  const [isLoaded, setIsLoaded] = useState(false);
  const [safeToSpend, setSafeToSpend] = useState(0);
  const [status, setStatus] = useState('good');
  const [disposableIncome, setDisposableIncome] = useState(0);
  const [today, setToday] = useState('');

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedData = localStorage.getItem('stash_data_v6');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserProfile(parsed.profile || DEFAULT_USER);
      setTransactions(parsed.transactions || []);
      setIsDarkMode(parsed.isDarkMode ?? true);
      setIsSemesterMode(parsed.isSemesterMode ?? false);
      setIsSurvivalMode(parsed.isSurvivalMode ?? false);
    }
    setToday(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const dataToSave = { profile: userProfile, transactions, isDarkMode, isSemesterMode, isSurvivalMode };
      localStorage.setItem('stash_data_v6', JSON.stringify(dataToSave));
    }
  }, [userProfile, transactions, isDarkMode, isSemesterMode, isSurvivalMode, isLoaded]);

  // --- MATH ENGINE ---
  useEffect(() => {
    const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
    const totalFixedBills = userProfile.fixedExpenses.reduce((acc, e) => acc + e.amount, 0);
    const disposable = userProfile.monthlyIncome - totalFixedBills;
    const remaining = disposable + totalSpent;
    
    setDisposableIncome(disposable);
    
    // SEMESTER MODE LOGIC: Divide by 120 days (4 months) instead of 30
    const daysDivisor = isSemesterMode ? 120 : 30;
    setSafeToSpend(remaining / daysDivisor);
    setStatus(remaining / daysDivisor < 10 ? 'danger' : 'good');
    
  }, [transactions, userProfile, isSemesterMode]);

  const handleAddTransaction = (title: string, amount: number, category: string) => {
    const newTx: Transaction = { id: Date.now().toString(), title, amount: -amount, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), category };
    setTransactions((prev) => [newTx, ...prev]);
  };
  
  const handleAddDebt = (person: string, amount: number, type: 'owed_to_me' | 'i_owe') => {
    const newDebt: Debt = { id: Date.now().toString(), person, amount, type, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) };
    setUserProfile({ ...userProfile, debts: [...(userProfile.debts || []), newDebt] });
  };
  
  const handleSettleDebt = (id: string) => {
    setUserProfile({ ...userProfile, debts: userProfile.debts.filter(d => d.id !== id) });
  };

  const handleUpdateProfile = (newData: UserProfile) => setUserProfile(newData);
  const handleUpdateGoal = (id: string, newAmount: number) => { setUserProfile({ ...userProfile, savingsGoals: userProfile.savingsGoals.map(g => g.id === id ? { ...g, current: newAmount } : g) }); setEditingGoal(null); };
  const handleDeleteGoal = (id: string) => { setUserProfile({ ...userProfile, savingsGoals: userProfile.savingsGoals.filter(g => g.id !== id) }); setEditingGoal(null); }

  const categoryTotals = CATEGORIES.map(cat => {
     const total = transactions.filter(t => t.category === cat.name).reduce((sum, t) => sum + Math.abs(t.amount), 0);
     return { ...cat, total };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  // SURVIVAL MODE: Filter out non-essentials if active
  const displayedCategories = isSurvivalMode 
    ? categoryTotals.filter(c => c.isEssential) 
    : categoryTotals;

  const pageBg = isSurvivalMode ? 'bg-red-950' : (isDarkMode ? 'bg-slate-950' : 'bg-slate-100');
  const textMain = isDarkMode || isSurvivalMode ? 'text-white' : 'text-slate-900';
  const textSub = isDarkMode || isSurvivalMode ? 'text-slate-400' : 'text-slate-500';
  const cardStyle = isDarkMode || isSurvivalMode ? 'bg-slate-900/60 backdrop-blur-xl border border-white/5 shadow-2xl' : 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/50';

  if (!isLoaded) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white tracking-widest font-bold">LOADING STASH...</div>;

  return (
    <div className={`min-h-screen ${pageBg} font-sans p-6 relative transition-colors duration-500 selection:bg-emerald-500/30`}>
      <div className={`fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b ${isSurvivalMode ? 'from-red-900/40' : (isDarkMode ? 'from-emerald-900/20' : 'from-emerald-100')} to-transparent pointer-events-none`} />

      <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddTransaction} isDarkMode={isDarkMode} />
      <AddDebtModal isOpen={isDebtModalOpen} onClose={() => setIsDebtModalOpen(false)} onSave={handleAddDebt} isDarkMode={isDarkMode} />
      <BudgetSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userData={userProfile} onSave={handleUpdateProfile} isDarkMode={isDarkMode} isSemesterMode={isSemesterMode} setIsSemesterMode={setIsSemesterMode} isSurvivalMode={isSurvivalMode} setIsSurvivalMode={setIsSurvivalMode} />
      <UpdateGoalModal isOpen={!!editingGoal} onClose={() => setEditingGoal(null)} goal={editingGoal} onUpdate={handleUpdateGoal} onDelete={handleDeleteGoal} isDarkMode={isDarkMode} />

      {/* HEADER */}
      <header className="relative flex justify-between items-end mb-10 z-10">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <p className={`text-xs font-bold tracking-widest uppercase ${isSurvivalMode ? 'text-red-400' : (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')}`}>{today}</p>
             {isSemesterMode && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">SEMESTER MODE</span>}
             {isSurvivalMode && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">SURVIVAL MODE</span>}
           </div>
           <h1 className={`text-4xl font-black tracking-tighter ${textMain}`}>Stash</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white shadow-sm hover:scale-105'}`}>{isDarkMode ? '☀️' : '🌑'}</button>
          <button onClick={() => setIsSettingsOpen(true)} title="Open settings" aria-label="Open settings" className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white shadow-sm hover:scale-105'}`}><Menu className={textSub} size={20} /></button>
        </div>
      </header>

      {/* 1. HERO CARD */}
      <div className={`relative p-8 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl transition-all duration-500 ${isSurvivalMode ? 'bg-gradient-to-br from-red-600 to-red-900 border border-red-500/50' : (status === 'danger' ? 'bg-gradient-to-br from-red-500 to-orange-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600')}`}>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
             <p className="text-white/80 text-sm font-bold tracking-widest uppercase">{isSemesterMode ? 'Daily Limit (Sem)' : 'Daily Limit'}</p>
             <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md"><Wallet className="text-white" size={20} /></div>
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter mb-2">₵{safeToSpend.toFixed(2)}</h2>
          <p className="text-white/90 font-medium text-sm flex items-center gap-2">
            {isSurvivalMode ? '🚨 SURVIVAL MODE: ESSENTIALS ONLY!' : (status === 'danger' ? '⚠️ Slow down!' : '✨ You are doing great!')}
          </p>
        </div>
      </div>

      {/* 2. DEBT TRACKER */}
      <div className="mb-8 z-10 relative">
         <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${textMain}`}><Users size={18} className="text-purple-500"/> Debt Tracker</h3>
            <button onClick={() => setIsDebtModalOpen(true)} className="text-xs font-bold text-purple-500 hover:text-purple-400">+ Add Debt</button>
         </div>
         <div className={`${cardStyle} p-4 rounded-3xl space-y-3`}>
            {(!userProfile.debts || userProfile.debts.length === 0) && <p className="text-center text-xs text-slate-500 py-4">No debts tracked. You are free! 🎉</p>}
            {(userProfile.debts || []).map(debt => (
               <div key={debt.id} className={`flex justify-between items-center p-3 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-xl text-xs font-bold ${debt.type === 'owed_to_me' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>{debt.type === 'owed_to_me' ? 'IN' : 'OUT'}</div>
                     <div><p className={`font-bold text-sm ${textMain}`}>{debt.person}</p><p className="text-[10px] text-slate-500">{debt.date}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={`font-bold ${textMain}`}>₵{debt.amount}</span>
                     <button onClick={() => handleSettleDebt(debt.id)} title="Mark Paid" className="p-2 rounded-full hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-500 transition-colors"><CheckCircle size={18} /></button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 3. SPENDING BREAKDOWN */}
      {displayedCategories.length > 0 && (
         <div className="mb-8 z-10 relative">
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textMain}`}><PieChart size={18} className="text-emerald-500"/> Breakdown {isSurvivalMode && <span className="text-xs text-red-500">(Filtered)</span>}</h3>
            <div className={`${cardStyle} p-6 rounded-3xl space-y-5`}>
               {displayedCategories.map(cat => (
                  <div key={cat.name}>
                     <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className={`flex items-center gap-2 ${textSub}`}>{cat.icon} {cat.name}</span>
                        <span className={textMain}>₵{cat.total.toFixed(2)}</span>
                     </div>
                     <div className="h-3 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color} opacity-90`} style={{ width: `${Math.min(100, (cat.total / (userProfile.monthlyIncome || 1)) * 100 * 5)}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* 4. GOALS */}
      {!isSurvivalMode && (
        <div className="mb-8 z-10 relative">
          <h3 className={`text-lg font-bold mb-4 ${textMain}`}>Goals</h3>
          <div className="space-y-4">
            {userProfile.savingsGoals.map((goal) => (
              <div key={goal.id} onClick={() => setEditingGoal(goal)} className={`${cardStyle} p-5 rounded-3xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group`}>
                <div className="flex justify-between mb-3">
                  <div><span className={`block font-bold text-lg ${textMain}`}>{goal.title}</span><span className="text-xs text-slate-500 font-medium">Target: ₵{goal.target}</span></div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10 group-hover:bg-emerald-500/20' : 'bg-slate-100 group-hover:bg-emerald-100'} transition-colors`}><ArrowUpRight size={18} className={isDarkMode ? 'text-white' : 'text-slate-900'} /></div>
                </div>
                <div className="h-4 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden p-[2px]">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold text-slate-500"><span>{Math.round((goal.current / goal.target) * 100)}%</span><span>₵{goal.current} saved</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TRANSACTIONS */}
      <div className="pb-24 z-10 relative"> 
        <h3 className={`text-lg font-bold mb-4 ${textMain}`}>History</h3>
        <div className="space-y-3">
          {transactions.map((t) => {
             const cat = CATEGORIES.find(c => c.name === t.category) || CATEGORIES[4];
             if (isSurvivalMode && !cat.isEssential) return null; // Hide history in survival mode too
             return (
               <div key={t.id} className={`flex justify-between items-center ${cardStyle} p-4 rounded-2xl group`}>
                 <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>{cat.icon}</div>
                   <div><p className={`font-bold ${textMain}`}>{t.title}</p><p className="text-xs text-slate-500 font-medium">{t.date}</p></div>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className={`font-bold ${t.amount > 0 ? "text-emerald-500" : textMain}`}>{t.amount > 0 ? '+' : '-'}₵{Math.abs(t.amount).toFixed(2)}</span>
                   <button onClick={(e) => { e.stopPropagation(); setTransactions(transactions.filter(tx => tx.id !== t.id)); }} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"><span className="text-xl">×</span></button>
                 </div>
               </div>
             );
          })}
        </div>
      </div>

      <button onClick={() => setIsAddModalOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full shadow-2xl shadow-emerald-500/40 flex items-center justify-center active:scale-90 transition-transform z-50 hover:brightness-110"><span className="text-4xl font-light mb-1">+</span></button>
    </div>
  );
}