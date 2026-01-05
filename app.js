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
            e('p', { style: { fontSize: '32px', fontWeight: 'bold', color: '#92400e' }
