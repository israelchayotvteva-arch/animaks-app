const e = React.createElement;
const { useState, useEffect } = React;

// נתוני מערכת מתוך הגיבוי והסרטון
const initialData = {
  instructors: [
    { id: 1, name: "יצי קהאן", password: "1234" },
    { id: 2, name: "יונתן כהן", password: "1234" },
    { id: 3, name: "שלמה אליאך", password: "1234" },
    { id: 4, name: "ישראל סופר", password: "1234" }
  ],
  institutions: [
    { id: 1, name: "פולה בן גוריון", instructorRate: 90 },
    { id: 2, name: "בית ספר אדי", instructorRate: 70 },
    { id: 3, name: "צהרונים בית שמש", instructorRate: 60 },
    { id: 4, name: "חברת אריאל", instructorRate: 70 },
    { id: 5, name: "מועדוניות עלי שיח", instructorRate: 70 }
  ],
  events: [
    { id: 'e1', name: "פינת חי", pay: 500 },
    { id: 'e2', name: "סדנה", pay: 400 },
    { id: 'e3', name: "מופע", pay: 600 }
  ],
  animals: ["🐰 ארנבון", "🦎 לטאה", "🐍 נחש", "🐹 אוגר", "🐢 צב", "🦜 תוכי", "🦔 קיפוד", "🐭 עכבר", "🦗 חרקים", "🐓 תרנגולת"]
};

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // home, report, library, tasks
  const [reports, setReports] = useState([]);
  
  // טופס דיווח מעודכן (לפי האפיון הסופי)
  const [reportForm, setReportForm] = useState({
    date: new Date().toISOString().split('T')[0],
    targetId: '',
    numGroups: 1,
    animalUsed: '',
    cashReceived: '',
    bonus: '',
    notes: ''
  });

  // פונקציית הגשת דיווח עם לוגיקה פיננסית
  const handleReportSubmit = () => {
    if (!reportForm.targetId || !reportForm.animalUsed) return alert("נא למלא את כל השדות");
    
    const isEvent = reportForm.targetId.startsWith('e');
    const source = isEvent ? initialData.events : initialData.institutions;
    const selected = source.find(s => s.id == reportForm.targetId);
    
    const baseRate = isEvent ? selected.pay : selected.instructorRate;
    const totalActivity = baseRate * reportForm.numGroups;
    
    const newReport = {
      ...reportForm,
      id: Date.now(),
      instructorId: user.id,
      activityName: selected.name,
      basePay: totalActivity,
      finalPay: (totalActivity + Number(reportForm.bonus || 0)) - Number(reportForm.cashReceived || 0)
    };

    setReports([newReport, ...reports]);
    alert("הדיווח נשלח בהצלחה!");
    setActiveTab('home');
    setReportForm({ ...reportForm, targetId: '', numGroups: 1, animalUsed: '', cashReceived: '', bonus: '', notes: '' });
  };

  if (!user) {
    return e('div', { className: 'min-h-screen flex items-center justify-center bg-[#f0fdf4] p-6' },
      e('div', { className: 'bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center' },
        e('div', { className: 'text-5xl mb-4' }, '🐨'),
        e('h1', { className: 'text-2xl font-bold text-[#15803d] mb-2' }, 'ישראל חיות וטבע'),
        e('p', { className: 'text-gray-500 mb-8' }, 'מערכת ניהול חכמה'),
        e('input', { id: 'u', placeholder: 'שם מלא', className: 'w-full p-4 border rounded-2xl mb-4 text-right bg-gray-50' }),
        e('input', { id: 'p', type: 'password', placeholder: 'סיסמה', className: 'w-full p-4 border rounded-2xl mb-6 text-right bg-gray-50' }),
        e('button', { 
          onClick: () => {
            const u = document.getElementById('u').value;
            const p = document.getElementById('p').value;
            const found = initialData.instructors.find(i => i.name === u && i.password === p);
            if (found) setUser({ ...found, role: 'instructor' });
            else if (u === 'admin') setUser({ role: 'admin', name: 'מנהל' });
            else alert("פרטים לא נכונים");
          },
          className: 'w-full bg-[#15803d] text-white p-4 rounded-2xl font-bold text-lg hover:bg-[#166534] transition-all' 
        }, 'כניסה למערכת')
      )
    );
  }

  // תצוגת בית (שכר וסיכומים)
  const HomeView = () => {
    const instructorReports = reports.filter(r => r.instructorId === user.id);
    const totalFinal = instructorReports.reduce((sum, r) => sum + r.finalPay, 0);

    return e('div', { className: 'p-4 pb-24' },
      e('div', { className: 'bg-[#15803d] p-8 rounded-[2rem] text-white shadow-lg text-center mb-6' },
        e('div', { className: 'text-sm opacity-80 mb-1' }, 'נטו לתשלום החודש'),
        e('div', { className: 'text-5xl font-black' }, `₪${totalFinal}`),
        e('div', { className: 'mt-4 flex justify-center gap-4 text-xs opacity-90' },
          e('span', null, `דיווחים: ${instructorReports.length}`),
          e('span', null, `|`),
          e('span', null, `חודש: ינואר 2026`)
        )
      ),
      e('h3', { className: 'font-bold text-gray-800 mb-4 px-2' }, 'דיווחים אחרונים'),
      instructorReports.map(r => e('div', { key: r.id, className: 'bg-white p-4 rounded-2xl mb-3 shadow-sm flex justify-between items-center border-r-4 border-green-500' },
        e('div', { className: 'text-left' }, 
          e('div', { className: 'font-bold text-green-700' }, `₪${r.finalPay}`),
          e('div', { className: 'text-[10px] text-gray-400' }, r.date)
        ),
        e('div', { className: 'text-right' },
          e('div', { className: 'font-bold text-sm' }, r.activityName),
          e('div', { className: 'text-xs text-gray-500' }, `${r.numGroups} קבוצות | ${r.animalUsed}`)
        )
      ))
    );
  };

  // תצוגת ספרייה (התיקיות הצבעוניות מהסרטון)
  const LibraryView = () => e('div', { className: 'p-4 pb-24 grid gap-4' },
    [
      { n: 'מערכי שיעור', c: 'bg-blue-50 text-blue-600', i: '📚' },
      { n: 'מידע על חיות', c: 'bg-green-50 text-green-600', i: '🦎' },
      { n: 'סרטוני הדרכה', c: 'bg-red-50 text-red-600', i: '🎥' },
      { n: 'אישורים ורישיונות', c: 'bg-purple-50 text-purple-600', i: '📜' },
      { n: 'מסמכי עבודה', c: 'bg-orange-50 text-orange-600', i: '📂' }
    ].map(f => e('div', { key: f.n, className: `${f.c} p-6 rounded-2xl flex justify-between items-center cursor-pointer active:scale-95 transition-transform shadow-sm` },
      e('span', { className: 'text-2xl' }, '📂'),
      e('div', { className: 'text-right' },
        e('div', { className: 'font-bold' }, f.n),
        e('div', { className: 'text-[10px] opacity-70' }, 'לחץ לצפייה בקבצים')
      ),
      e('span', { className: 'text-2xl opacity-40' }, f.i)
    ))
  );

  return e('div', { className: 'min-h-screen bg-[#f8fafc] font-sans', dir: 'rtl' },
    // Header
    e('header', { className: 'p-4 bg-white flex justify-between items-center shadow-sm sticky top-0 z-10' },
      e('button', { onClick: () => setUser(null), className: 'text-xs text-red-500 font-bold' }, 'התנתק'),
      e('div', { className: 'text-lg font-bold text-[#15803d]' }, 'ישראל חיות וטבע'),
      e('div', { className: 'w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm' }, '👤')
    ),

    // Main Content View
    activeTab === 'home' && HomeView(),
    activeTab === 'report' && e('div', { className: 'p-4 pb-32 max-w-md mx-auto' },
      e('h2', { className: 'text-xl font-bold mb-6 text-center' }, 'דיווח פעילות'),
      e('label', { className: 'block text-xs font-bold mb-1' }, 'בחר מוסד / אירוע'),
      e('select', { className: 'w-full p-4 rounded-2xl border mb-4 bg-white shadow-sm', onChange: e => setReportForm({...reportForm, targetId: e.target.value}) },
        e('option', null, '--- בחר ---'),
        ...initialData.institutions.map(i => e('option', { value: i.id }, i.name)),
        ...initialData.events.map(ev => e('option', { value: ev.id }, `🌟 ${ev.name}`))
      ),
      e('label', { className: 'block text-xs font-bold mb-2' }, 'מספר קבוצות'),
      e('div', { className: 'grid grid-cols-5 gap-2 mb-6' },
        [1,2,3,4,5].map(n => e('button', {
          key: n,
          onClick: () => setReportForm({...reportForm, numGroups: n}),
          className: `p-4 rounded-xl font-bold ${reportForm.numGroups === n ? 'bg-green-600 text-white' : 'bg-white border'}`
        }, n))
      ),
      e('div', { className: 'grid grid-cols-2 gap-4 mb-4' },
        e('div', null,
          e('label', { className: 'block text-[10px] font-bold mb-1' }, 'בונוס / נסיעות'),
          e('input', { type: 'number', placeholder: '₪', className: 'w-full p-4 rounded-xl border', onChange: e => setReportForm({...reportForm, bonus: e.target.value}) })
        ),
        e('div', null,
          e('label', { className: 'block text-[10px] font-bold mb-1' }, 'מזומן שנתקבל'),
          e('input', { type: 'number', placeholder: '₪', className: 'w-full p-4 rounded-xl border', onChange: e => setReportForm({...reportForm, cashReceived: e.target.value}) })
        )
      ),
      e('label', { className: 'block text-xs font-bold mb-1' }, 'בעל חיים'),
      e('select', { className: 'w-full p-4 rounded-2xl border mb-6 bg-white shadow-sm', onChange: e => setReportForm({...reportForm, animalUsed: e.target.value}) },
        e('option', null, '--- בחר ---'),
        ...initialData.animals.map(a => e('option', { value: a }, a))
      ),
      e('button', { onClick: handleReportSubmit, className: 'w-full bg-green-700 text-white p-5 rounded-2xl font-bold shadow-lg' }, 'שלח דיווח למערכת')
    ),
    activeTab === 'library' && LibraryView(),

    // Floating WhatsApp Button (מהסרטון)
    e('a', { 
      href: 'https://wa.me/972500000000', 
      className: 'fixed bottom-24 left-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-20 text-2xl active:scale-90 transition-transform' 
    }, '💬'),

    // Bottom Navigation (כרטיסיות מהסרטון)
    e('nav', { className: 'fixed bottom-0 inset-x-0 bg-white border-t flex justify-around p-3 pb-6 z-30' },
      [
        { id: 'home', l: 'שכר', i: '💰' },
        { id: 'report', l: 'דיווח', i: '📝' },
        { id: 'library', l: 'ספרייה', i: '📚' },
        { id: 'tasks', l: 'משימות', i: '📋' }
      ].map(t => e('button', {
        key: t.id,
        onClick: () => setActiveTab(t.id),
        className: `flex flex-col items-center gap-1 ${activeTab === t.id ? 'text-green-700' : 'text-gray-400'}`
      }, 
        e('span', { className: 'text-xl' }, t.i),
        e('span', { className: 'text-[10px] font-bold' }, t.l)
      ))
    ),
    
    // Global Footer
    e('footer', { className: 'hidden' }, '© כל הזכויות שמורות לישראל חיות וטבע')
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
