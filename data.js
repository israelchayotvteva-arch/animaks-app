export const initialInstructors = [
  { id: 1, name: 'יצי קהאן', password: '1234' },
  { id: 2, name: 'יונתן כהן', password: '1234' },
  { id: 3, name: 'שלמה אליאך', password: '1234' },
  { id: 4, name: 'ישראל סופר', password: '1234' }
];

export const initialInstitutions = [
  { id: 1, name: 'בית ספר פולה בן גוריון', location: 'ירושלים', clientRate: 170, instructorRate: 90, duration: '45 דקות', vat: 'פלוס מע"מ', assignedInstructors: [4], scheduleType: 'weekly', dayOfWeek: 1, time: '10:00' },
  { id: 2, name: 'בית ספר אדי', location: 'ירושלים', clientRate: 165, instructorRate: 70, duration: 'חצי שעה', vat: 'פלוס מע"מ', assignedInstructors: [2], scheduleType: 'weekly', dayOfWeek: 2, time: '14:00' },
  { id: 3, name: 'צהרונים בית שמש', location: 'בית שמש', clientRate: 180, instructorRate: 60, duration: 'חוג', vat: 'כולל מע"מ', assignedInstructors: [3], scheduleType: 'weekly', dayOfWeek: 3, time: '15:30' },
  { id: 4, name: 'חברת אריאל', location: 'ירושלים', clientRate: 165, instructorRate: 70, duration: 'חצי שעה', vat: 'פלוס מע"מ', assignedInstructors: [1], scheduleType: 'weekly', dayOfWeek: 4, time: '11:00' },
  { id: 5, name: 'מועדוניות עלי שיח', location: 'ירושלים', clientRate: 165, instructorRate: 70, duration: 'חצי שעה', vat: 'פלוס מע"מ', assignedInstructors: [], scheduleType: 'monthly', dayOfWeek: 0, time: '09:00' }
];

export const initialEvents = [
  { id: 1, name: 'פינת חי', type: 'פינת חי', instructorPay: 500 },
  { id: 2, name: 'סדנה', type: 'סדנה', instructorPay: 400 },
  { id: 3, name: 'מופע', type: 'מופע', instructorPay: 600 }
];

export const availableAnimals = [
  '🐰 ארנבון', '🦎 לטאה', '🐍 נחש', '🐹 אוגר', '🐢 צב',
  '🦜 תוכי', '🦔 קיפוד', '🐭 עכבר', '🦗 חרקים', '🐓 תרנגולת'
];
