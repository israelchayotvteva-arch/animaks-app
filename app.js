import { initialInstructors, initialInstitutions, initialEvents, availableAnimals } from './data.js';

const e = React.createElement;
const { useState } = React;

function App() {
  const [userRole, setUserRole] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  
  // Login
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  // Data
  const [instructors, setInstructors] = useState(initialInstructors);
  const [institutions, setInstitutions] = useState(initialInstitutions);
  const [events, setEvents] = useState(initialEvents);
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'החתם את הגננת על דף נוכחות', assignedTo: 4, assignedToType: 'instructor', status: 'pending', dueDate: '2025-01-10', priority: 'high' },
    { id: 2, title: 'הזמן חולצות חדשות', assignedTo: 'secretary', assignedToType: 'secretary', status: 'pending', dueDate: '2025-01-12', priority: 'medium' }
  ]);
  const [expenses, setExpenses] = useState([]);
  
  // Report form
  const [reportForm, setReportForm] = useState({
    date: new Date().toISOString().split('T')[0],
    institutionId: '',
    numGroups: 1,
    animalUsed: '',
    notes: ''
  });

  // Expense form
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: '',
    receipt: null
  });

  // Institution form
  const [institutionForm, setInstitutionForm] = useState({
    name: '',
    location: '',
    clientRate: '',
    instructorRate: '',
    duration: '',
    vat: 'פלוס מע"מ',
    assignedInstructors: [],
    scheduleType: 'weekly',
    dayOfWeek: 1,
    time: '10:00'
  });

  const [editingInstitution, setEditingInstitution] = useState(null);
  const [showInstitutionForm, setShowInstitutionForm] = useState(false);

  const handleLogin = () => {
    setLoginError('');
    if (loginForm.username === 'admin' && loginForm.password === '1234') {
      setUserRole('admin');
      setLoginForm({ username: '', password: '' });
    } else if (loginForm.username === 'secretary' && loginForm.password === '1234') {
      setUserRole('secretary');
      setLoginForm({ username: '', password: '' });
    } else {
      const instructor = instructors.find(i => i.name === loginForm.username && i.password === loginForm.password);
      if (instructor) {
        setUserRole('instructor');
        setSelectedInstructor(instructor.id);
        setLoginForm({ username: '', password: '' });
      } else {
        setLoginError('שם משתמש או סיסמה שגויים');
      }
    }
  };

  const submitReport = () => {
    if (!selectedInstructor || !reportForm.institutionId || !reportForm.animalUsed) {
      alert('נא למלא את כל השדות');
      return;
    }
    
    const inst = institutions.find(i => i.id === parseInt(reportForm.institutionId));
    const basePay = inst.instructorRate * reportForm.numGroups;
    
    const newReport = {
      id: reports.length + 1,
      instructorId: selectedInstructor,
      instructorName: instructors.find(i => i.id === selectedInstructor)?.name,
      date: reportForm.date,
      institutionId: inst.id,
      activityName: inst.name,
      numGroups: reportForm.numGroups,
      animalUsed: reportForm.animalUsed,
      basePay,
      notes: reportForm.notes,
      finalPay: basePay
    };
    
    setReports([...reports, newReport]);
    setReportForm({
      date: new Date().toISOString().split('T')[0],
      institutionId: '',
      numGroups: 1,
      animalUsed: '',
      notes: ''
    });
    alert('✓ הדיווח נשלח בהצלחה!');
    setCurrentView('salary');
  };

  const submitExpense = () => {
    if (!expenseForm.category || !expenseForm.amount || !expenseForm.description) {
      alert('נא למלא את כל השדות');
      return;
    }

    const newExpense = {
      id: expenses.length + 1,
      instructorId: selectedInstructor,
      instructorName: instructors.find(i => i.id === selectedInstructor)?.name,
      date: expenseForm.date,
      category: expenseForm.category,
      amount: parseFloat(expenseForm.amount),
      description: expenseForm.description,
      status: 'pending'
    };

    setExpenses([...expenses, newExpense]);
    setExpenseForm({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: '',
      description: '',
      receipt: null
    });
    alert('✓ ההוצאה נשלחה לאישור!');
  };

  const approveExpense = (expenseId) => {
    setExpenses(expenses.map(e => 
      e.id === expenseId ? {...e, status: 'approved'} : e
    ));
  };

  const rejectExpense = (expenseId) => {
    setExpenses(expenses.map(e => 
      e.id === expenseId ? {...e, status: 'rejected'} : e
    ));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? {...t, status: t.status === 'pending' ? 'completed' : 'pending'} : t
    ));
  };

  const saveInstitution = () => {
    if (!institutionForm.name || !institutionForm.clientRate || !institutionForm.instructorRate) {
      alert('נא למלא את כל השדות החובה');
      return;
    }

    if (editingInstitution) {
      setInstitutions(institutions.map(inst =>
        inst.id === editingInstitution.id ? {
          ...institutionForm,
          id: editingInstitution.id,
          clientRate: parseFloat(institutionForm.clientRate),
          instructorRate: parseFloat(institutionForm.instructorRate)
        } : inst
      ));
      alert('✓ המוסד עודכן בהצלחה!');
    } else {
      const newInstitution = {
        id: institutions.length + 1,
        ...institutionForm,
        clientRate: parseFloat(institutionForm.clientRate),
        instructorRate: parseFloat(institutionForm.instructorRate)
      };
      setInstitutions([...institutions, newInstitution]);
      alert('✓ המוסד נוסף בהצלחה!');
    }

    setInstitutionForm({
      name: '',
      location: '',
      clientRate: '',
      instructorRate: '',
      duration: '',
      vat: 'פלוס מע"מ',
      assignedInstructors: [],
      scheduleType: 'weekly',
      dayOfWeek: 1,
      time: '10:00'
    });
    setEditingInstitution(null);
    setShowInstitutionForm(false);
  };

  const editInstitution = (inst) => {
    setEditingInstitution(inst);
    setInstitutionForm({
      name: inst.name,
      location: inst.location,
      clientRate: inst.clientRate.toString(),
      instructorRate: inst.instructorRate.toString(),
      duration: inst.duration,
      vat: inst.vat,
      assignedInstructors: inst.assignedInstructors || [],
      scheduleType: inst.scheduleType,
      dayOfWeek: inst.dayOfWeek,
      time: inst.time
    });
    setShowInstitutionForm(true);
  };

  const deleteInstitution = (instId) => {
    if (confirm('האם אתה בטוח שברצונך למחוק מוסד זה?')) {
      setInstitutions(institutions.filter(inst => inst.id !== instId));
      alert('✓ המוסד נמחק בהצלחה!');
    }
  };

  const calculateMonthlyTotal = (instructorId) => {
    const now = new Date();
    const instructorReports = reports.filter(r => {
      const reportDate = new Date(r.date);
      return r.instructorId === instructorId && 
             reportDate.getMonth() === now.getMonth() && 
             reportDate.getFullYear() === now.getFullYear();
    });
    
    const totalEarned = instructorReports.reduce((sum, r) => sum + r.basePay, 0);
    const approvedExpenses = expenses
      .filter(e => e.instructorId === instructorId && e.status === 'approved')
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      totalEarned,
      approvedExpenses,
      netPay: totalEarned + approvedExpenses,
      reportsCount: instructorReports.length
    };
  };

  // Login Screen
  if (!userRole) {
    return e('div', { 
      style: { 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #f0fdf4, #dcfce7)',
        fontFamily: 'sans-serif',
        padding: '20px'
      }
    },
      e('div', { 
        style: { 
          background: 'white', 
          padding: '40px', 
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }
      },
        e('div', { style: { textAlign: 'center', marginBottom: '30px' } },
          e('div', { style: { fontSize: '64px', marginBottom: '10px' } }, '🐨'),
          e('h1', { style: { fontSize: '28px', color: '#15803d', marginBottom: '10px', fontWeight: 'bold' } }, 'ישראל חיות וטבע'),
          e('p', { style: { color: '#166534' } }, 'מערכת ניהול תפעולית ופיננסית')
        ),
        loginError && e('div', { 
          style: { 
            background: '#fee', 
            border: '1px solid #fcc', 
            color: '#c33', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center'
          } 
        }, loginError),
        e('div', { style: { marginBottom: '20px' } },
          e('label', { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' } }, 'שם משתמש'),
          e('input', {
            type: 'text',
            value: loginForm.username,
            onChange: (ev) => setLoginForm({...loginForm, username: ev.target.value}),
            onKeyPress: (ev) => ev.key === 'Enter' && handleLogin(),
            style: { 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #d1d5db', 
              borderRadius: '8px', 
              fontSize: '16px',
              boxSizing: 'border-box'
            },
            placeholder: 'הכנס שם משתמש'
          })
        ),
        e('div', { style: { marginBottom: '20px' } },
          e('label', { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' } }, 'סיסמה'),
          e('input', {
            type: 'password',
            value: loginForm.password,
            onChange: (ev) => setLoginForm({...loginForm, password: ev.target.value}),
            onKeyPress: (ev) => ev.key === 'Enter' && handleLogin(),
            style: { 
              width: '100%', 
              padding: '12px', 
              border: '2px solid #d1d5db', 
              borderRadius: '8px', 
              fontSize: '16px',
              boxSizing: 'border-box'
            },
            placeholder: 'הכנס סיסמה'
          })
        ),
        e('button', {
          onClick: handleLogin,
          style: { 
            width: '100%', 
            padding: '16px', 
            background: '#15803d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            marginBottom: '20px'
          }
        }, 'כניסה'),
        e('div', { 
          style: { 
            padding: '16px', 
            background: '#dbeafe', 
            borderRadius: '8px', 
            fontSize: '14px' 
          } 
        },
          e('p', { style: { fontWeight: 'bold', marginBottom: '8px' } }, '💡 פרטי כניסה ראשוניים:'),
          e('p', { style: { margin: '4px 0' } }, 'מנהל: admin / 1234'),
          e('p', { style: { margin: '4px 0' } }, 'מזכירה: secretary / 1234'),
          e('p', { style: { margin: '4px 0' } }, 'מדריכים: שם מלא / 1234')
        )
      )
    );
  }

  // Main App
  const userInstitutions = userRole === 'instructor' 
    ? institutions.filter(i => i.assignedInstructors && i.assignedInstructors.includes(selectedInstructor))
    : institutions;

  const userTasks = tasks.filter(t => {
    if (userRole === 'instructor') return t.assignedTo === selectedInstructor && t.assignedToType === 'instructor';
    if (userRole === 'secretary') return t.assignedToType === 'secretary';
    return true;
  });

  const pendingTasksCount = userTasks.filter(t => t.status === 'pending').length;
  const pendingExpensesCount = userRole === 'instructor' 
    ? expenses.filter(e => e.instructorId === selectedInstructor && e.status === 'pending').length
    : expenses.filter(e => e.status === 'pending').length;

  return e('div', { style: { minHeight: '100vh', background: '#f0fdf4' } },
    // Header
    e('div', { 
      style: { 
        background: '#15803d', 
        color: 'white', 
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      } 
    },
      e('div', { style: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: '15px' } },
          e('div', { style: { fontSize: '48px' } }, '🐨'),
          e('div', null,
            e('h1', { style: { fontSize: '24px', fontWeight: 'bold', margin: 0 } }, 'ישראל חיות וטבע'),
            e('p', { style: { fontSize: '14px', opacity: 0.9, margin: '4px 0 0 0' } }, 
              userRole === 'admin' ? 'פאנל ניהול' : 
              userRole === 'secretary' ? 'פאנל מזכירה' : 
              `שלום, ${instructors.find(i => i.id === selectedInstructor)?.name}`
            )
          )
        ),
        e('button', {
          onClick: () => { setUserRole(null); setSelectedInstructor(null); setCurrentView('home'); },
          style: { 
            background: '#166534', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }
        }, 'התנתק')
      )
    ),

    // Navigation
    e('div', { style: { background: 'white', borderBottom: '2px solid #e5e7eb', padding: '10px 0' } },
      e('div', { style: { maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '10px', padding: '0 20px', overflowX: 'auto' } },
        userRole === 'instructor' && [
          e('button', {
            key: 'report',
            onClick: () => setCurrentView('report'),
            style: { 
              padding: '12px 24px', 
              background: currentView === 'report' ? '#15803d' : '#f3f4f6',
              color: currentView === 'report' ? 'white' : '#374151',
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          }, '📅 דיווח חדש'),
          e('button', {
            key: 'salary',
            onClick: () => setCurrentView('salary'),
            style: { 
              padding: '12px 24px', 
              background: currentView === 'salary' ? '#15803d' : '#f3f4f6',
              color: currentView === 'salary' ? 'white' : '#374151',
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          }, '💰 השכר שלי'),
          e('button', {
            key: 'tasks',
            onClick: () => setCurrentView('tasks'),
            style: { 
              padding: '12px 24px', 
              background: currentView === 'tasks' ? '#15803d' : '#f3f4f6',
              color: currentView === 'tasks' ? 'white' : '#374151',
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              position: 'relative'
            }
          }, 
            '📋 משימות',
            pendingTasksCount > 0 && e('span', {
              style: {
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#dc2626',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }
            }, pendingTasksCount)
          ),
          e('button', {
            key: 'expenses',
            onClick: () => setCurrentView('expenses'),
            style: { 
              padding: '12px 24px', 
              background: currentView === 'expenses' ? '#15803d' : '#f3f4f6',
              color: currentView === 'expenses' ? 'white' : '#374151',
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          }, '💳 הוצאות')
        ],
        (userRole === 'admin' || userRole === 'secretary') && [
          e('button', {
            key: 'dashboard',
            onClick: () => setCurrentView('dashboard'),
            style: { 
              padding: '12px 24px', 
              background: currentView === 'dashboard' ? '#15803d' : '#f3f4f6',
              color: currentView === 'dashboard' ? 'white' : '#374151',
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          }, '💰 סיכום שכר'),
          e('button', {
            key: 'tasks',
            onClick: () => setCurrentView('tasks'),
            style: { 
              padding: '12px 24px', 
              background: currentView === 'tasks' ? '#15803d' : '#f3f4f6',
              color: currentView === 'tasks' ? 'white' : '#374151',
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              position: 'relative'
            }
          }, 
            '📋 משימות',
            pendingTasksCount > 0 && e('span', {
              style: {
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#dc2626',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }
            }, pendingTasksCount)
          ),
          e('button', {
            key: 'expenses',
            onClick: () => setCurrentView('expenses'),
            style: { 
              padding: '12px 24px', 
              background: currentView === 'expenses' ? '#15803d' : '#f3f4f6',
              color: currentView === 'expenses' ? 'white' : '#374151',
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              position: 'relative'
            }
          }, 
            '💳 הוצאות',
            pendingExpensesCount > 0 && e('span', {
              style: {
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#f59e0b',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }
            }, pendingExpensesCount)
          ),
          e('button', {
            key: 'institutions',
            onClick: () => setCurrentView('institutions'),
            style: { 
              padding: '12px 24px', 
              background: currentView === 'institutions' ? '#15803d' : '#f3f4f6',
              color: currentView === 'institutions' ? 'white' : '#374151',
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          }, '🏢 מוסדות')
        ]
      )
    ),

    // Main Content
    e('div', { style: { maxWidth: '1200px', margin: '0 auto', padding: '20px' } },
      
      // Report View
      currentView === 'report' && userRole === 'instructor' && e('div', { style: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
        e('h2', { style: { fontSize: '24px', fontWeight: 'bold', color: '#15803d', marginBottom: '20px' } }, '📅 דיווח פעילות חדש'),
        
        e('div', { style: { marginBottom: '20px' } },
          e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'תאריך'),
          e('input', {
            type: 'date',
            value: reportForm.date,
            onChange: (ev) => setReportForm({...reportForm, date: ev.target.value}),
            style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }
          })
        ),
        
        e('div', { style: { marginBottom: '20px' } },
          e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'בחר מוסד'),
          e('select', {
            value: reportForm.institutionId,
            onChange: (ev) => setReportForm({...reportForm, institutionId: ev.target.value}),
            style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }
          },
            e('option', { value: '' }, '-- בחר מוסד --'),
            userInstitutions.map(inst => 
              e('option', { key: inst.id, value: inst.id }, `${inst.name} - ₪${inst.instructorRate}`)
            )
          )
        ),
        
        reportForm.institutionId && e('div', { style: { marginBottom: '20px' } },
          e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'כמה קבוצות?'),
          e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '8px' } },
            [1,2,3,4,5,6,7,8,9].map(num =>
              e('button', {
                key: num,
                onClick: () => setReportForm({...reportForm, numGroups: num}),
                style: {
                  padding: '12px',
                  background: reportForm.numGroups === num ? '#2563eb' : '#f3f4f6',
                  color: reportForm.numGroups === num ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }
              }, num)
            )
          )
        ),
        
        e('div', { style: { marginBottom: '20px' } },
          e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'באיזה בעל חיים השתמשת?'),
          e('select', {
            value: reportForm.animalUsed,
            onChange: (ev) => setReportForm({...reportForm, animalUsed: ev.target.value}),
            style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }
          },
            e('option', { value: '' }, '-- בחר בעל חיים --'),
            availableAnimals.map((animal, idx) => 
              e('option', { key: idx, value: animal }, animal)
            )
          )
        ),
        
        e('div', { style: { marginBottom: '20px' } },
          e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'הערות'),
          e('textarea', {
            value: reportForm.notes,
            onChange: (ev) => setReportForm({...reportForm, notes: ev.target.value}),
            style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', minHeight: '80px', boxSizing: 'border-box' },
            placeholder: 'הערות נוספות...'
          })
        ),
        
        e('button', {
          onClick: submitReport,
          disabled: !reportForm.institutionId || !reportForm.animalUsed,
          style: {
            width: '100%',
            padding: '16px',
            background: reportForm.institutionId && reportForm.animalUsed ? '#15803d' : '#d1d5db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: reportForm.institutionId && reportForm.animalUsed ? 'pointer' : 'not-allowed'
          }
        }, 'שלח דיווח')
      ),

      // Salary View
      currentView === 'salary' && userRole === 'instructor' && (() => {
        const totals = calculateMonthlyTotal(selectedInstructor);
        return e('div', { style: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
          e('h2', { style: { fontSize: '24px', fontWeight: 'bold', color: '#15803d', marginBottom: '20px' } }, '💰 סיכום שכר חודשי'),
          
          e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' } },
            e('div', { style: { background: '#dbeafe', padding: '20px', borderRadius: '12px', textAlign: 'center' } },
              e('p', { style: { color: '#1e3a8a', fontSize: '14px', marginBottom: '8px' } }, 'פעילויות החודש'),
              e('p', { style: { fontSize: '32px', fontWeight: 'bold', color: '#1e40af' } }, totals.reportsCount)
            ),
            e('div', { style: { background: '#dcfce7', padding: '20px', borderRadius: '12px', textAlign: 'center' } },
              e('p', { style: { color: '#166534', fontSize: '14px', marginBottom: '8px' } }, 'שכר בסיס'),
              e('p', { style: { fontSize: '32px', fontWeight: 'bold', color: '#15803d' } }, `₪${totals.totalEarned}`)
            ),
            e('div', { style: { background: '#fce7f3', padding: '20px', borderRadius: '12px', textAlign: 'center' } },
              e('p', { style: { color: '#831843', fontSize: '14px', marginBottom: '8px' } }, 'החזר הוצאות'),
              e('p', { style: { fontSize: '32px', fontWeight: 'bold', color: '#9f1239' } }, `+₪${totals.approvedExpenses}`)
            )
          ),
          
          e('div', { style: { background: '#15803d', color: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center' } },
            e('p', { style: { fontSize: '20px', marginBottom: '10px', opacity: 0.9 } }, 'סה"כ לתשלום'),
            e('p', { style: { fontSize: '48px', fontWeight: 'bold' } }, `₪${totals.netPay}`)
          ),
          
          reports.filter(r => r.instructorId === selectedInstructor).length > 0 && e('div', { style: { marginTop: '30px' } },
            e('h3', { style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' } }, 'דיווחים אחרונים'),
            reports
              .filter(r => r.instructorId === selectedInstructor)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map(report =>
                e('div', { key: report.id, style: { background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '10px' } },
                  e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' } },
                    e('div', null,
                      e('p', { style: { fontWeight: 'bold', marginBottom: '4px' } }, report.activityName),
                      e('p', { style: { fontSize: '14px', color: '#6b7280' } }, `${report.date} • ${report.animalUsed} • ${report.numGroups} קבוצות`)
                    ),
                    e('p', { style: { fontSize: '20px', fontWeight: 'bold', color: '#15803d' } }, `₪${report.finalPay}`)
                  )
                )
              )
          )
        );
      })(),

      // Tasks View
      currentView === 'tasks' && e('div', { style: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
        e('h2', { style: { fontSize: '24px', fontWeight: 'bold', color: '#15803d', marginBottom: '20px' } }, '📋 המשימות שלי'),
        
        e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' } },
          e('div', { style: { background: '#fef3c7', padding: '20px', borderRadius: '12px', textAlign: 'center' } },
            e('p', { style: { color: '#78350f', fontSize: '14px', marginBottom: '8px' } }, 'ממתינות'),
            e('p', { style: { fontSize: '32px', fontWeight: 'bold', color: '#92400e' } }, userTasks.filter(t => t.status === 'pending').length)
          ),
          e('div', { style: { background: '#dcfce7', padding: '20px', borderRadius: '12px', textAlign: 'center' } },
            e('p', { style: { color: '#166534', fontSize: '14px', marginBottom: '8px' } }, 'הושלמו'),
            e('p', { style: { fontSize: '32px', fontWeight: 'bold', color: '#15803d' } }, userTasks.filter(t => t.status === 'completed').length)
          )
        ),
        
        userTasks.length === 0 ? 
          e('div', { style: { textAlign: 'center', padding: '40px', color: '#9ca3af' } },
            e('div', { style: { fontSize: '64px', marginBottom: '10px' } }, '✓'),
            e('p', { style: { fontSize: '18px' } }, 'אין משימות פתוחות')
          )
        :
        userTasks.map(task =>
          e('div', { 
            key: task.id, 
            style: { 
              background: task.status === 'completed' ? '#f0fdf4' : '#fef9c3',
              border: `2px solid ${task.status === 'completed' ? '#86efac' : '#fde047'}`,
              padding: '20px', 
              borderRadius: '12px', 
              marginBottom: '15px'
            } 
          },
            e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' } },
              e('div', { style: { flex: 1 } },
                e('h3', { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' } }, task.title),
                e('div', { style: { display: 'flex', gap: '10px', fontSize: '14px', color: '#6b7280' } },
                  e('span', null, `📅 ${task.dueDate}`),
                  e('span', null, task.priority === 'high' ? '🔴 דחוף' : task.priority === 'medium' ? '🟡 רגיל' : '🟢 נמוך')
                )
              ),
              e('button', {
                onClick: () => toggleTaskStatus(task.id),
                style: {
                  padding: '10px 20px',
                  background: task.status === 'completed' ? '#86efac' : '#15803d',
                  color: task.status === 'completed' ? '#166534' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }
              }, task.status === 'completed' ? '✓ הושלם' : 'סמן כהושלם')
            )
          )
        )
      ),

      // Expenses View
      currentView === 'expenses' && e('div', { style: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
        e('h2', { style: { fontSize: '24px', fontWeight: 'bold', color: '#15803d', marginBottom: '20px' } }, '💳 ניהול הוצאות'),
        
        // Instructor expense form
        userRole === 'instructor' && e('div', { style: { background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '30px' } },
          e('h3', { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' } }, 'הגש בקשה להחזר הוצאה'),
          
          e('div', { style: { marginBottom: '15px' } },
            e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'תאריך'),
            e('input', {
              type: 'date',
              value: expenseForm.date,
              onChange: (ev) => setExpenseForm({...expenseForm, date: ev.target.value}),
              style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }
            })
          ),
          
          e('div', { style: { marginBottom: '15px' } },
            e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'קטגוריה'),
            e('select', {
              value: expenseForm.category,
              onChange: (ev) => setExpenseForm({...expenseForm, category: ev.target.value}),
              style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }
            },
              e('option', { value: '' }, '-- בחר קטגוריה --'),
              e('option', { value: 'דלק' }, '⛽ דלק'),
              e('option', { value: 'חניה' }, '🅿️ חניה'),
              e('option', { value: 'ציוד' }, '📦 ציוד'),
              e('option', { value: 'מזון לחיות' }, '🥕 מזון לחיות'),
              e('option', { value: 'אחר' }, '📝 אחר')
            )
          ),
          
          e('div', { style: { marginBottom: '15px' } },
            e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'סכום (₪)'),
            e('input', {
              type: 'number',
              value: expenseForm.amount,
              onChange: (ev) => setExpenseForm({...expenseForm, amount: ev.target.value}),
              style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' },
              placeholder: '0.00'
            })
          ),
          
          e('div', { style: { marginBottom: '15px' } },
            e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'תיאור'),
            e('textarea', {
              value: expenseForm.description,
              onChange: (ev) => setExpenseForm({...expenseForm, description: ev.target.value}),
              style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', minHeight: '80px', boxSizing: 'border-box' },
              placeholder: 'תאר את ההוצאה...'
            })
          ),
          
          e('button', {
            onClick: submitExpense,
            disabled: !expenseForm.category || !expenseForm.amount || !expenseForm.description,
            style: {
              width: '100%',
              padding: '14px',
              background: expenseForm.category && expenseForm.amount && expenseForm.description ? '#15803d' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: expenseForm.category && expenseForm.amount && expenseForm.description ? 'pointer' : 'not-allowed'
            }
          }, 'שלח לאישור')
        ),
        
        // Expenses list
        e('div', null,
          e('h3', { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' } }, 
            userRole === 'instructor' ? 'ההוצאות שלי' : 'כל ההוצאות'
          ),
          
          expenses.filter(exp => 
            userRole === 'instructor' ? exp.instructorId === selectedInstructor : true
          ).length === 0 ?
            e('div', { style: { textAlign: 'center', padding: '40px', color: '#9ca3af' } },
              e('div', { style: { fontSize: '64px', marginBottom: '10px' } }, '💳'),
              e('p', { style: { fontSize: '18px' } }, 'אין הוצאות להצגה')
            )
          :
          expenses
            .filter(exp => userRole === 'instructor' ? exp.instructorId === selectedInstructor : true)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(expense =>
              e('div', { 
                key: expense.id, 
                style: { 
                  background: expense.status === 'approved' ? '#f0fdf4' : 
                             expense.status === 'rejected' ? '#fef2f2' : '#fffbeb',
                  border: `2px solid ${expense.status === 'approved' ? '#86efac' : 
                                       expense.status === 'rejected' ? '#fca5a5' : '#fde047'}`,
                  padding: '20px', 
                  borderRadius: '12px', 
                  marginBottom: '15px'
                } 
              },
                e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' } },
                  e('div', { style: { flex: 1 } },
                    e('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' } },
                      e('h4', { style: { fontSize: '18px', fontWeight: 'bold' } }, expense.category),
                      e('span', { 
                        style: { 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: 'bold',
                          background: expense.status === 'approved' ? '#86efac' : 
                                    expense.status === 'rejected' ? '#fca5a5' : '#fde047',
                          color: expense.status === 'approved' ? '#166534' : 
                                expense.status === 'rejected' ? '#991b1b' : '#92400e'
                        } 
                      }, 
                        expense.status === 'approved' ? '✓ אושר' : 
                        expense.status === 'rejected' ? '✗ נדחה' : '⏳ ממתין'
                      )
                    ),
                    (userRole === 'admin' || userRole === 'secretary') && 
                      e('p', { style: { fontSize: '14px', color: '#6b7280', marginBottom: '4px' } }, `מדריך: ${expense.instructorName}`),
                    e('p', { style: { fontSize: '14px', color: '#6b7280', marginBottom: '4px' } }, `תאריך: ${expense.date}`),
                    e('p', { style: { fontSize: '14px', color: '#374151' } }, expense.description)
                  ),
                  e('div', { style: { textAlign: 'left' } },
                    e('p', { style: { fontSize: '24px', fontWeight: 'bold', color: '#15803d', marginBottom: '10px' } }, `₪${expense.amount}`),
                    (userRole === 'admin' || userRole === 'secretary') && expense.status === 'pending' &&
                      e('div', { style: { display: 'flex', gap: '8px' } },
                        e('button', {
                          onClick: () => approveExpense(expense.id),
                          style: {
                            padding: '8px 16px',
                            background: '#15803d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }
                        }, '✓ אשר'),
                        e('button', {
                          onClick: () => rejectExpense(expense.id),
                          style: {
                            padding: '8px 16px',
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }
                        }, '✗ דחה')
                      )
                  )
                )
              )
            )
        )
      ),

      // Dashboard View (Admin/Secretary)
      currentView === 'dashboard' && (userRole === 'admin' || userRole === 'secretary') && e('div', { style: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
        e('h2', { style: { fontSize: '24px', fontWeight: 'bold', color: '#15803d', marginBottom: '20px' } }, '💰 סיכום שכר - כל המדריכים'),
        
        // Overall stats
        e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' } },
          e('div', { style: { background: '#dbeafe', padding: '20px', borderRadius: '12px', textAlign: 'center' } },
            e('p', { style: { color: '#1e3a8a', fontSize: '14px', marginBottom: '8px' } }, 'סה"כ פעילויות החודש'),
            e('p', { style: { fontSize: '32px', fontWeight: 'bold', color: '#1e40af' } }, reports.length)
          ),
          e('div', { style: { background: '#dcfce7', padding: '20px', borderRadius: '12px', textAlign: 'center' } },
            e('p', { style: { color: '#166534', fontSize: '14px', marginBottom: '8px' } }, 'סה"כ שכר בסיס'),
            e('p', { style: { fontSize: '32px', fontWeight: 'bold', color: '#15803d' } }, 
              `₪${instructors.reduce((sum, inst) => sum + calculateMonthlyTotal(inst.id).totalEarned, 0)}`
            )
          ),
          e('div', { style: { background: '#fce7f3', padding: '20px', borderRadius: '12px', textAlign: 'center' } },
            e('p', { style: { color: '#831843', fontSize: '14px', marginBottom: '8px' } }, 'סה"כ החזר הוצאות'),
            e('p', { style: { fontSize: '32px', fontWeight: 'bold', color: '#9f1239' } }, 
              `₪${expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0)}`
            )
          )
        ),
        
        // Per-instructor breakdown
        e('h3', { style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' } }, 'פירוט לפי מדריך'),
        instructors.map(instructor => {
          const totals = calculateMonthlyTotal(instructor.id);
          return e('div', { 
            key: instructor.id, 
            style: { 
              background: '#f9fafb', 
              padding: '20px', 
              borderRadius: '12px', 
              marginBottom: '15px'
            } 
          },
            e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
              e('h4', { style: { fontSize: '18px', fontWeight: 'bold' } }, instructor.name),
              e('div', { style: { display: 'flex', gap: '20px', alignItems: 'center' } },
                e('div', { style: { textAlign: 'center' } },
                  e('p', { style: { fontSize: '12px', color: '#6b7280' } }, 'פעילויות'),
                  e('p', { style: { fontSize: '18px', fontWeight: 'bold', color: '#2563eb' } }, totals.reportsCount)
                ),
                e('div', { style: { textAlign: 'center' } },
                  e('p', { style: { fontSize: '12px', color: '#6b7280' } }, 'שכר'),
                  e('p', { style: { fontSize: '18px', fontWeight: 'bold', color: '#15803d' } }, `₪${totals.totalEarned}`)
                ),
                e('div', { style: { textAlign: 'center' } },
                  e('p', { style: { fontSize: '12px', color: '#6b7280' } }, 'הוצאות'),
                  e('p', { style: { fontSize: '18px', fontWeight: 'bold', color: '#9f1239' } }, `₪${totals.approvedExpenses}`)
                ),
                e('div', { style: { textAlign: 'center', background: '#15803d', padding: '10px 15px', borderRadius: '8px' } },
                  e('p', { style: { fontSize: '12px', color: 'white', opacity: 0.9 } }, 'סה"כ'),
                  e('p', { style: { fontSize: '20px', fontWeight: 'bold', color: 'white' } }, `₪${totals.netPay}`)
                )
              )
            )
          );
        })
      ),

      // Institutions View (Admin/Secretary)
      currentView === 'institutions' && (userRole === 'admin' || userRole === 'secretary') && e('div', { style: { background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
        e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
          e('h2', { style: { fontSize: '24px', fontWeight: 'bold', color: '#15803d' } }, '🏢 ניהול מוסדות'),
          e('button', {
            onClick: () => {
              setShowInstitutionForm(true);
              setEditingInstitution(null);
              setInstitutionForm({
                name: '',
                location: '',
                clientRate: '',
                instructorRate: '',
                duration: '',
                vat: 'פלוס מע"מ',
                assignedInstructors: [],
                scheduleType: 'weekly',
                dayOfWeek: 1,
                time: '10:00'
              });
            },
            style: {
              padding: '12px 24px',
              background: '#15803d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }
          }, '+ הוסף מוסד חדש')
        ),
        
        // Institution form
        showInstitutionForm && e('div', { style: { background: '#f9fafb', padding: '25px', borderRadius: '12px', marginBottom: '30px' } },
          e('h3', { style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' } }, 
            editingInstitution ? 'ערוך מוסד' : 'מוסד חדש'
          ),
          
          e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' } },
            e('div', null,
              e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'שם המוסד *'),
              e('input', {
                type: 'text',
                value: institutionForm.name,
                onChange: (ev) => setInstitutionForm({...institutionForm, name: ev.target.value}),
                style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' },
                placeholder: 'לדוגמה: בית ספר...'
              })
            ),
            e('div', null,
              e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'מיקום'),
              e('input', {
                type: 'text',
                value: institutionForm.location,
                onChange: (ev) => setInstitutionForm({...institutionForm, location: ev.target.value}),
                style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' },
                placeholder: 'עיר...'
              })
            )
          ),
          
          e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' } },
            e('div', null,
              e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'תעריף לקוח (₪) *'),
              e('input', {
                type: 'number',
                value: institutionForm.clientRate,
                onChange: (ev) => setInstitutionForm({...institutionForm, clientRate: ev.target.value}),
                style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' },
                placeholder: '0'
              })
            ),
            e('div', null,
              e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'תשלום למדריך (₪) *'),
              e('input', {
                type: 'number',
                value: institutionForm.instructorRate,
                onChange: (ev) => setInstitutionForm({...institutionForm, instructorRate: ev.target.value}),
                style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' },
                placeholder: '0'
              })
            ),
            e('div', null,
              e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'משך פעילות'),
              e('input', {
                type: 'text',
                value: institutionForm.duration,
                onChange: (ev) => setInstitutionForm({...institutionForm, duration: ev.target.value}),
                style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' },
                placeholder: '45 דקות'
              })
            )
          ),
          
          e('div', { style: { marginBottom: '15px' } },
            e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'מע"מ'),
            e('select', {
              value: institutionForm.vat,
              onChange: (ev) => setInstitutionForm({...institutionForm, vat: ev.target.value}),
              style: { width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }
            },
              e('option', { value: 'פלוס מע"מ' }, 'פלוס מע"מ'),
              e('option', { value: 'כולל מע"מ' }, 'כולל מע"מ')
            )
          ),
          
          e('div', { style: { marginBottom: '15px' } },
            e('label', { style: { display: 'block', fontWeight: 'bold', marginBottom: '8px' } }, 'מדריכים משויכים'),
            e('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } },
              instructors.map(inst =>
                e('label', { 
                  key: inst.id, 
                  style: { 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px 12px',
                    background: institutionForm.assignedInstructors.includes(inst.id) ? '#dcfce7' : '#f3f4f6',
                    border: `2px solid ${institutionForm.assignedInstructors.includes(inst.id) ? '#86efac' : '#d1d5db'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  } 
                },
                  e('input', {
                    type: 'checkbox',
                    checked: institutionForm.assignedInstructors.includes(inst.id),
                    onChange: (ev) => {
                      if (ev.target.checked) {
                        setInstitutionForm({
                          ...institutionForm,
                          assignedInstructors: [...institutionForm.assignedInstructors, inst.id]
                        });
                      } else {
                        setInstitutionForm({
                          ...institutionForm,
                          assignedInstructors: institutionForm.assignedInstructors.filter(id => id !== inst.id)
                        });
                      }
                    },
                    style: { cursor: 'pointer' }
                  }),
                  e('span', null, inst.name)
                )
              )
            )
          ),
          
          e('div', { style: { display: 'flex', gap: '10px' } },
            e('button', {
              onClick: saveInstitution,
              style: {
                flex: 1,
                padding: '14px',
                background: '#15803d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }
            }, editingInstitution ? 'עדכן מוסד' : 'הוסף מוסד'),
            e('button', {
              onClick: () => {
                setShowInstitutionForm(false);
                setEditingInstitution(null);
              },
              style: {
                padding: '14px 24px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }
            }, 'ביטול')
          )
        ),
        
        // Institutions list
        e('div', null,
          institutions.length === 0 ?
            e('div', { style: { textAlign: 'center', padding: '40px', color: '#9ca3af' } },
              e('div', { style: { fontSize: '64px', marginBottom: '10px' } }, '🏢'),
              e('p', { style: { fontSize: '18px' } }, 'אין מוסדות להצגה')
            )
          :
          institutions.map(inst =>
            e('div', { 
              key: inst.id, 
              style: { 
                background: '#f9fafb',
                border: '2px solid #e5e7eb',
                padding: '20px', 
                borderRadius: '12px', 
                marginBottom: '15px'
              } 
            },
              e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' } },
                e('div', { style: { flex: 1 } },
                  e('h4', { style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' } }, inst.name),
                  e('div', { style: { display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '14px', color: '#6b7280', marginBottom: '10px' } },
                    inst.location && e('span', null, `📍 ${inst.location}`),
                    e('span', null, `⏱️ ${inst.duration}`),
                    e('span', null, `${inst.vat}`)
                  ),
                  e('div', { style: { display: 'flex', gap: '20px', marginBottom: '10px' } },
                    e('div', null,
                      e('span', { style: { fontSize: '14px', color: '#6b7280' } }, 'תעריף לקוח: '),
                      e('span', { style: { fontWeight: 'bold', color: '#2563eb' } }, `₪${inst.clientRate}`)
                    ),
                    e('div', null,
                      e('span', { style: { fontSize: '14px', color: '#6b7280' } }, 'תשלום למדריך: '),
                      e('span', { style: { fontWeight: 'bold', color: '#15803d' } }, `₪${inst.instructorRate}`)
                    )
                  ),
                  inst.assignedInstructors && inst.assignedInstructors.length > 0 &&
                    e('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
                      inst.assignedInstructors.map(instrId => {
                        const instructor = instructors.find(i => i.id === instrId);
                        return instructor && e('span', { 
                          key: instrId,
                          style: { 
                            padding: '4px 12px',
                            background: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: 'bold'
                          } 
                        }, instructor.name);
                      })
                    )
                ),
                e('div', { style: { display: 'flex', gap: '8px' } },
                  e('button', {
                    onClick: () => editInstitution(inst),
                    style: {
                      padding: '10px 20px',
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }
                  }, '✏️ ערוך'),
                  e('button', {
                    onClick: () => deleteInstitution(inst.id),
                    style: {
                      padding: '10px 20px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }
                  }, '🗑️ מחק')
                )
              )
            )
          )
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
