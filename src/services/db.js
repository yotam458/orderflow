import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;


// Initial Dummy Data for Camping/Outdoor Store
const INITIAL_ORDERS = [
  {
    id: '1001',
    customerName: 'ישראל ישראלי',
    customerPhone: '052-1234567',
    customerEmail: 'israel@gmail.com',
    items: 'אוהל Coleman instant cabin ל-4 אנשים, מזרן מתנפח יחיד חגור',
    orderDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    dueTime: '18:00',
    receiptNumber: 'REC-74892',
    status: 'ready', // ready = ממתין לאיסוף, in_progress = בתהליך, awaiting_update = ממתין לעדכון, delivered = נאסף
    paymentStatus: 'paid_full', // paid_full = שולם במלואו, paid_deposit = שולמה מקדמה, unpaid = לא שולם
    location: 'in_store', // in_store = בחנות, on_the_way = בדרך
    sourceBranch: 'סניף תל אביב',
    internalNotes: 'הלקוח ממהר מאוד, ביקש לוודא שכל יתדות האוהל נמצאות בתוך התיק.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdByEmployeeName: 'מיכאל',
    createdByEmployeeNumber: 'EMP-101',
    logs: [
      {
        id: 'l1',
        userName: 'מיכאל',
        userNumber: 'EMP-101',
        action: 'יצירת הזמנה חדשה במערכת',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'l2',
        userName: 'רועי',
        userNumber: 'EMP-102',
        action: 'עדכון מיקום פיזי ל: בחנות',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'l3',
        userName: 'רועי',
        userNumber: 'EMP-102',
        action: 'שינוי סטטוס מ"בתהליך" ל"ממתין לאיסוף"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '1002',
    customerName: 'מיכל אברהם',
    customerPhone: '054-9876543',
    customerEmail: 'michal.ab@outlook.com',
    items: 'תרמיל טיולים Osprey Ariel 65L צבע כחול, פנס ראש Black Diamond Storm 450',
    orderDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().split('T')[0], // Today
    dueTime: '14:00',
    receiptNumber: 'REC-74910',
    status: 'in_progress',
    paymentStatus: 'paid_deposit',
    location: 'on_the_way',
    sourceBranch: 'סניף חיפה',
    internalNotes: 'שולמה מקדמה של 200 ש"ח בקופה. נותר לגבות 750 ש"ח בעת האיסוף.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    createdByEmployeeName: 'רועי',
    createdByEmployeeNumber: 'EMP-102',
    logs: [
      {
        id: 'l4',
        userName: 'רועי',
        userNumber: 'EMP-102',
        action: 'יצירת הזמנה חדשה במערכת',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '1003',
    customerName: 'דניאל גולן',
    customerPhone: '050-5551234',
    customerEmail: 'danielg@walla.co.il',
    items: 'גזייה אלפינית Kovea Spider, 3 מיכלי גז הברגה 230 גרם',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    dueTime: '12:00',
    receiptNumber: 'REC-74922',
    status: 'awaiting_update',
    paymentStatus: 'unpaid',
    location: 'on_the_way',
    sourceBranch: 'מחסן ראשי',
    internalNotes: 'חסרה הגזייה במלאי סניף תל אביב. מחכים למשאית הספקה שבועית ביום שני בבוקר.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdByEmployeeName: 'מיכאל',
    createdByEmployeeNumber: 'EMP-101',
    logs: [
      {
        id: 'l5',
        userName: 'מיכאל',
        userNumber: 'EMP-101',
        action: 'יצירת הזמנה חדשה במערכת',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '1004',
    customerName: 'יובל רפפורט',
    customerPhone: '053-4447788',
    customerEmail: 'yuval.rap@gmail.com',
    items: 'נעלי הרים Lowa Renegade GTX מידה 44 חום',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
    dueTime: '10:00',
    receiptNumber: 'REC-74811',
    status: 'delivered',
    paymentStatus: 'paid_full',
    location: 'in_store',
    sourceBranch: 'סניף תל אביב',
    internalNotes: 'הגיע לאסוף עם בן הזוג. נמדד בחנות ונמצא מתאים.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdByEmployeeName: 'רועי',
    createdByEmployeeNumber: 'EMP-102',
    logs: [
      {
        id: 'l6',
        userName: 'רועי',
        userNumber: 'EMP-102',
        action: 'יצירת הזמנה חדשה במערכת',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'l7',
        userName: 'רועי',
        userNumber: 'EMP-102',
        action: 'שינוי סטטוס מ"בתהליך" ל"ממתין לאיסוף"',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'l8',
        userName: 'מיכאל',
        userNumber: 'EMP-101',
        action: 'שינוי סטטוס ל"נאסף" - נמסר פיזית ללקוח בחנות',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];

const INITIAL_TEAM = [
  { id: '1', name: 'מיכאל', birthdate: '1991-04-15', phone: '052-1111111', email: 'manager@orderflow.com', role: 'manager', employeeNumber: 'EMP-101' },
  { id: '2', name: 'רועי', birthdate: '1998-08-20', phone: '054-2222222', email: 'roy@orderflow.com', role: 'employee', employeeNumber: 'EMP-102' }
];

const DEFAULT_SETTINGS = {
  whatsappTemplate: 'היי {שם}, שמחים לעדכן שההזמנה שלך {פריטים} מוכנה לאיסוף בסניף תל אביב! היא מחכה לך ב{מיקום}. נשמח לראותך!',
  emailTemplate: 'שלום {שם},\n\nההזמנה שלך ב-OrderFlow מוכנה לאיסוף!\n\nפירוט הפריטים:\n{פריטים}\n\nמיקום האיסוף בסניף: {מיקום}\nמספר קבלה: {קבלה}\n\nנשמח לעמוד לשירותך בכל עת.'
};

// LocalStorage Keys
const KEYS = {
  ORDERS: 'orderflow_orders_v4',
  TEAM: 'orderflow_team_v3',
  SETTINGS: 'orderflow_settings',
  CURRENT_USER: 'orderflow_current_user',
  CUSTOMERS: 'orderflow_customers_v1'
};

// Initialize LocalStorage if empty
const initLocalData = () => {
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(KEYS.TEAM)) {
    localStorage.setItem(KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem(KEYS.CUSTOMERS)) {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify([]));
  }
  // Set default logged in user if not set
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(INITIAL_TEAM[1])); // Roy by default
  }
};

if (typeof window !== 'undefined') {
  initLocalData();
  // Clear any old insecure persistent login from localStorage
  if (localStorage.getItem(KEYS.CURRENT_USER)) {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

// Helper: Get storage item (Uses sessionStorage for auth, localStorage for data)
const getLocalItem = (key) => {
  if (typeof window === 'undefined') return null;
  const storage = key === KEYS.CURRENT_USER ? sessionStorage : localStorage;
  const val = storage.getItem(key);
  return val ? JSON.parse(val) : null;
};
// Helper: Set storage item
const setLocalItem = (key, val) => {
  if (typeof window === 'undefined') return;
  const storage = key === KEYS.CURRENT_USER ? sessionStorage : localStorage;
  storage.setItem(key, JSON.stringify(val));
};

export const dbService = {
  // Authentication
  auth: {
    login: async (email, password) => {
      if (isSupabaseConfigured) {
        const { data: employee, error } = await supabase
          .from('employees')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .single();
        
        if (error || !employee) throw new Error('אימייל או סיסמה שגויים');
        
        const user = { 
          id: employee.id, 
          name: employee.name, 
          email: employee.email, 
          role: employee.role,
          employeeNumber: employee.employeeNumber
        };
        setLocalItem(KEYS.CURRENT_USER, user);
        return user;
      } else {
        // Mock Auth
        const team = getLocalItem(KEYS.TEAM);
        const matched = team.find(member => member.email.toLowerCase() === email.toLowerCase());
        if (matched && password === '123456') { // Simple global password for demo
          setLocalItem(KEYS.CURRENT_USER, matched);
          return matched;
        }
        throw new Error('אימייל או סיסמה שגויים (במצב הדגמה השתמש בסיסמה 123456)');
      }
    },
    logout: async () => {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      sessionStorage.removeItem(KEYS.CURRENT_USER);
      localStorage.removeItem(KEYS.CURRENT_USER);
    },
    getCurrentUser: () => {
      return getLocalItem(KEYS.CURRENT_USER);
    }
  },

  // Orders Management
  orders: {
    getAll: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('createdAt', { ascending: false });
        if (error) throw error;
        return data;
      } else {
        return getLocalItem(KEYS.ORDERS).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    },
    getById: async (id) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } else {
        const orders = getLocalItem(KEYS.ORDERS);
        return orders.find(o => o.id === id) || null;
      }
    },
    create: async (orderData) => {
      const currentUser = getLocalItem(KEYS.CURRENT_USER) || { name: 'מערכת' };
      // Find the next chronological ID (highest numerical ID + 1, starting at 1001)
      let ordersList = [];
      if (isSupabaseConfigured) {
        const { data } = await supabase.from('orders').select('id');
        if (data) ordersList = data;
      } else {
        ordersList = getLocalItem(KEYS.ORDERS) || [];
      }
      let nextNumId = 1001;
      if (ordersList.length > 0) {
        const ids = ordersList.map(o => parseInt(o.id, 10)).filter(id => !isNaN(id));
        if (ids.length > 0) {
          nextNumId = Math.max(...ids) + 1;
        }
      }
      const newId = String(nextNumId);
      const newOrder = {
        id: newId,
        ...orderData,
        createdAt: new Date().toISOString(),
        createdByEmployeeName: currentUser.name,
        createdByEmployeeNumber: currentUser.employeeNumber || 'מערכת',
        logs: [
          {
            id: String(Date.now()),
            userName: currentUser.name,
            userNumber: currentUser.employeeNumber || 'מערכת',
            action: 'יצירת הזמנה חדשה במערכת',
            timestamp: new Date().toISOString()
          }
        ]
      };

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders')
          .insert([newOrder])
          .select()
          .single();
        if (error) throw error;
        
        // Push audit log
        await supabase.from('order_audit').insert({
          orderId: newId,
          userName: currentUser.name,
          userNumber: currentUser.employeeNumber || 'מערכת',
          action: 'יצירת הזמנה חדשה במערכת',
          timestamp: new Date().toISOString()
        });
        
        return data;
      } else {
        const orders = getLocalItem(KEYS.ORDERS);
        orders.push(newOrder);
        setLocalItem(KEYS.ORDERS, orders);
        return newOrder;
      }
    },
    update: async (id, updatedFields) => {
      const currentUser = getLocalItem(KEYS.CURRENT_USER) || { name: 'מערכת' };
      
      if (isSupabaseConfigured) {
        // First get the current order to compute audit logs
        const { data: currentOrder } = await supabase.from('orders').select('logs, status, location, sourceBranch').eq('id', id).single();
        
        const logs = [...(currentOrder.logs || [])];
        const newLogEntries = [];
        const statusLabels = { ready: 'ממתין לאיסוף', in_progress: 'בתהליך', awaiting_update: 'ממתין לעדכון', delivered: 'נאסף' };
        const locationLabels = { in_store: 'בחנות', on_the_way: 'בדרך' };
        
        const createLog = (action) => ({
          id: String(Date.now() + Math.random()),
          userName: currentUser.name,
          userNumber: currentUser.employeeNumber || 'מערכת',
          action,
          timestamp: new Date().toISOString()
        });

        // Detect changes and generate log actions
        if (updatedFields.status && updatedFields.status !== currentOrder.status) {
          const log = createLog(`שינוי סטטוס ל"${statusLabels[updatedFields.status] || updatedFields.status}"`);
          logs.push(log);
          newLogEntries.push(log);
        }
        if (updatedFields.location && updatedFields.location !== currentOrder.location) {
          const log = createLog(`עדכון מיקום פיזי ל: ${locationLabels[updatedFields.location] || updatedFields.location}`);
          logs.push(log);
          newLogEntries.push(log);
        }
        if (updatedFields.sourceBranch && updatedFields.sourceBranch !== currentOrder.sourceBranch) {
          const log = createLog(`עדכון סניף מקור ל: ${updatedFields.sourceBranch}`);
          logs.push(log);
          newLogEntries.push(log);
        }
        if (Object.keys(updatedFields).some(k => k !== 'status' && k !== 'location' && k !== 'sourceBranch' && updatedFields[k] !== currentOrder[k])) {
          const log = createLog(`עדכון פרטי הזמנה`);
          logs.push(log);
          newLogEntries.push(log);
        }
        
        const payload = { ...updatedFields, logs };
        const { data, error } = await supabase
          .from('orders')
          .update(payload)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;

        // Push new logs to order_audit table
        if (newLogEntries.length > 0) {
          await supabase.from('order_audit').insert(
            newLogEntries.map(l => ({
              orderId: id,
              userName: l.userName,
              userNumber: l.userNumber,
              action: l.action,
              timestamp: l.timestamp
            }))
          );
        }

        return data;
      } else {
        const orders = getLocalItem(KEYS.ORDERS);
        const orderIndex = orders.findIndex(o => o.id === id);
        if (orderIndex === -1) throw new Error('הזמנה לא נמצאה');

        const currentOrder = orders[orderIndex];
        const logs = [...(currentOrder.logs || [])];
        const statusLabels = { ready: 'ממתין לאיסוף', in_progress: 'בתהליך', awaiting_update: 'ממתין לעדכון', delivered: 'נאסף' };
        const locationLabels = { in_store: 'בחנות', on_the_way: 'בדרך' };

        if (updatedFields.status && updatedFields.status !== currentOrder.status) {
          logs.push({
            id: String(Date.now()),
            userName: currentUser.name,
            userNumber: currentUser.employeeNumber || 'מערכת',
            action: `שינוי סטטוס ל"${statusLabels[updatedFields.status] || updatedFields.status}"`,
            timestamp: new Date().toISOString()
          });
        }
        if (updatedFields.location && updatedFields.location !== currentOrder.location) {
          logs.push({
            id: String(Date.now() + 1),
            userName: currentUser.name,
            userNumber: currentUser.employeeNumber || 'מערכת',
            action: `עדכון מיקום פיזי ל: ${locationLabels[updatedFields.location] || updatedFields.location}`,
            timestamp: new Date().toISOString()
          });
        }
        if (updatedFields.sourceBranch && updatedFields.sourceBranch !== currentOrder.sourceBranch) {
          logs.push({
            id: String(Date.now() + 2),
            userName: currentUser.name,
            userNumber: currentUser.employeeNumber || 'מערכת',
            action: `עדכון סניף מקור ל: ${updatedFields.sourceBranch}`,
            timestamp: new Date().toISOString()
          });
        }
        if (Object.keys(updatedFields).some(k => k !== 'status' && k !== 'location' && k !== 'sourceBranch' && updatedFields[k] !== currentOrder[k])) {
          logs.push({
            id: String(Date.now() + 3),
            userName: currentUser.name,
            userNumber: currentUser.employeeNumber || 'מערכת',
            action: `עדכון פרטי הזמנה`,
            timestamp: new Date().toISOString()
          });
        }

        const updatedOrder = {
          ...currentOrder,
          ...updatedFields,
          logs
        };

        orders[orderIndex] = updatedOrder;
        setLocalItem(KEYS.ORDERS, orders);
        return updatedOrder;
      }
    },
    delete: async (id) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } else {
        const orders = getLocalItem(KEYS.ORDERS);
        const filtered = orders.filter(o => o.id !== id);
        setLocalItem(KEYS.ORDERS, filtered);
      }
      return true;
    }
  },

  // Team Management
  team: {
    getAll: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('employees')
          .select('*');
        if (error) throw error;
        return data;
      } else {
        return getLocalItem(KEYS.TEAM);
      }
    },
    addMember: async (member) => {
      if (isSupabaseConfigured) {
        const newMember = {
          name: member.name,
          email: member.email,
          phone: member.phone,
          role: member.role,
          password: '123456',
          "employeeNumber": member.employeeNumber || `EMP-${Math.floor(Math.random()*1000)}`
        };
        const { data, error } = await supabase
          .from('employees')
          .insert([newMember])
          .select()
          .single();
        if (error) throw error;

        // Log branch audit
        const currentUser = getLocalItem(KEYS.CURRENT_USER) || { name: 'מערכת' };
        await supabase.from('branch_audit').insert({
          userName: currentUser.name,
          userNumber: currentUser.employeeNumber || 'מערכת',
          actionType: 'הוספת עובד',
          actionDetails: `נוסף עובד חדש: ${member.name}`
        });

        return data;
      } else {
        const newMember = { id: String(Date.now()), ...member };
        const team = getLocalItem(KEYS.TEAM);
        team.push(newMember);
        setLocalItem(KEYS.TEAM, team);
        return newMember;
      }
    },
    removeMember: async (id) => {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', id);
        if (error) throw error;

        // Log branch audit
        const currentUser = getLocalItem(KEYS.CURRENT_USER) || { name: 'מערכת' };
        await supabase.from('branch_audit').insert({
          userName: currentUser.name,
          userNumber: currentUser.employeeNumber || 'מערכת',
          actionType: 'מחיקת עובד',
          actionDetails: `נמחק עובד מהמערכת`
        });
      } else {
        const team = getLocalItem(KEYS.TEAM);
        const filtered = team.filter(m => m.id !== id);
        setLocalItem(KEYS.TEAM, filtered);
      }
      return true;
    },
    updateMember: async (id, updatedData) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('employees')
          .update(updatedData)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;

        // Log branch audit
        const currentUser = getLocalItem(KEYS.CURRENT_USER) || { name: 'מערכת' };
        await supabase.from('branch_audit').insert({
          userName: currentUser.name,
          userNumber: currentUser.employeeNumber || 'מערכת',
          actionType: 'עדכון פרטי עובד',
          actionDetails: `עודכנו פרטים עבור: ${data.name}`
        });

        return data;
      } else {
        const team = getLocalItem(KEYS.TEAM);
        const index = team.findIndex(m => m.id === id);
        if (index === -1) throw new Error('עובד לא נמצא');
        
        const updatedMember = {
          ...team[index],
          ...updatedData
        };
        team[index] = updatedMember;
        setLocalItem(KEYS.TEAM, team);
        return updatedMember;
      }
    }
  },

  // Settings & Templates
  settings: {
    get: async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();
        if (error) return DEFAULT_SETTINGS;
        return data;
      } else {
        const stored = getLocalItem(KEYS.SETTINGS);
        if (!stored || !stored.whatsappTemplate) {
          setLocalItem(KEYS.SETTINGS, DEFAULT_SETTINGS);
          return DEFAULT_SETTINGS;
        }
        return stored;
      }
    },
    update: async (newSettings) => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('settings')
          .upsert({ id: 1, ...newSettings })
          .select()
          .single();
        if (error) throw error;

        // Log branch audit
        const currentUser = getLocalItem(KEYS.CURRENT_USER) || { name: 'מערכת' };
        await supabase.from('branch_audit').insert({
          userName: currentUser.name,
          userNumber: currentUser.employeeNumber || 'מערכת',
          actionType: 'עדכון הגדרות',
          actionDetails: 'עודכנו תבניות הודעה או הגדרות מערכת'
        });

        return data;
      } else {
        setLocalItem(KEYS.SETTINGS, newSettings);
        return newSettings;
      }
    }
  },

  // Customers list extraction (derived from all orders and assigned persistent unique IDs)
  customers: {
    getAll: async () => {
      let orders = [];
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && data) orders = data;
      } else {
        orders = getLocalItem(KEYS.ORDERS) || [];
      }

      // Get saved customer mappings to maintain consistent IDs
      let savedCustomers = getLocalItem(KEYS.CUSTOMERS) || [];

      const customerMap = {};
      orders.forEach(order => {
        if (!order.customerName) return;

        // Use ID number as primary key, fall back to normalized phone
        const idNumber = (order.customerIdNumber || '').trim();
        const normalizedPhone = (order.customerPhone || '').replace(/[-\s]/g, '').trim();
        const key = idNumber || normalizedPhone || order.customerName.trim();

        if (!customerMap[key]) {
          // Check if this customer already exists in saved registry (by ID number first, then phone)
          let savedCust = null;
          if (idNumber) {
            savedCust = savedCustomers.find(c => (c.idNumber || '').trim() === idNumber);
          }
          if (!savedCust && normalizedPhone) {
            savedCust = savedCustomers.find(c => {
              const savedNorm = (c.phone || '').replace(/[-\s]/g, '').trim();
              return savedNorm && savedNorm === normalizedPhone;
            });
          }

          let customerId = savedCust ? savedCust.id : null;
          if (!customerId) {
            const currentCount = savedCustomers.length + Object.keys(customerMap).length;
            customerId = `CUST-${101 + currentCount}`;
          }

          customerMap[key] = {
            id: customerId,
            idNumber: idNumber || (savedCust ? savedCust.idNumber || '' : ''),
            name: order.customerName.trim(),
            phone: (order.customerPhone || 'לא צוין').trim(),
            email: (order.customerEmail || 'לא צוין').trim(),
            orders: []
          };
        } else {
          // Update ID number if we now have it and didn't before
          if (idNumber && !customerMap[key].idNumber) {
            customerMap[key].idNumber = idNumber;
          }
        }
        
        customerMap[key].orders.push({
          id: order.id,
          date: order.orderDate,
          status: order.status,
          items: order.items
        });
      });

      // Persist the updated customer registry (including idNumber)
      const updatedRegistry = Object.values(customerMap).map(c => ({
        id: c.id,
        idNumber: c.idNumber || '',
        name: c.name,
        phone: c.phone,
        email: c.email
      }));
      setLocalItem(KEYS.CUSTOMERS, updatedRegistry);

      return Object.values(customerMap);
    },

    update: async (id, updates) => {
      const savedCustomers = getLocalItem(KEYS.CUSTOMERS) || [];
      const idx = savedCustomers.findIndex(c => c.id === id);
      if (idx === -1) return false;

      const old = savedCustomers[idx];
      const updated = { ...old, ...updates };
      savedCustomers[idx] = updated;
      setLocalItem(KEYS.CUSTOMERS, savedCustomers);

      // Propagate name/phone/email/idNumber changes to all matching orders
      const orders = getLocalItem(KEYS.ORDERS) || [];
      const oldPhoneNorm = (old.phone || '').replace(/[-\s]/g, '').trim();
      const oldIdNumber = (old.idNumber || '').trim();

      const updatedOrders = orders.map(o => {
        const orderPhoneNorm = (o.customerPhone || '').replace(/[-\s]/g, '').trim();
        const orderIdNum = (o.customerIdNumber || '').trim();
        const matchById = oldIdNumber && orderIdNum === oldIdNumber;
        const matchByPhone = !oldIdNumber && oldPhoneNorm && orderPhoneNorm === oldPhoneNorm;
        if (matchById || matchByPhone) {
          return {
            ...o,
            customerName: updates.name ?? o.customerName,
            customerPhone: updates.phone ?? o.customerPhone,
            customerEmail: updates.email ?? o.customerEmail,
            customerIdNumber: updates.idNumber ?? o.customerIdNumber,
          };
        }
        return o;
      });
      setLocalItem(KEYS.ORDERS, updatedOrders);
      return true;
    },

    delete: async (id) => {
      const savedCustomers = getLocalItem(KEYS.CUSTOMERS) || [];
      const targetCust = savedCustomers.find(c => c.id === id);
      if (!targetCust) return false;

      const updatedRegistry = savedCustomers.filter(c => c.id !== id);
      setLocalItem(KEYS.CUSTOMERS, updatedRegistry);

      const normalizedPhone = targetCust.phone.replace(/[-\s]/g, '').trim();
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('customerPhone', targetCust.phone);
      } else {
        const orders = getLocalItem(KEYS.ORDERS) || [];
        const filteredOrders = orders.filter(o => {
          const orderPhone = (o.customerPhone || '').replace(/[-\s]/g, '').trim();
          return orderPhone !== normalizedPhone;
        });
        setLocalItem(KEYS.ORDERS, filteredOrders);
      }
      return true;
    }
  },

  // Migration Helper: Push LocalData to Supabase
  migrateToSupabase: async () => {
    if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase is not configured.');
    
    let logs = [];

    // 1. Migrate Team -> Employees
    const team = getLocalItem(KEYS.TEAM) || [];
    for (const member of team) {
      const { id, birthdate, employeeNumber, ...employeeData } = member;
      const { error } = await supabase.from('employees').upsert({
        ...employeeData,
        password: '123456', // Default password for migrated users
        "employeeNumber": employeeNumber || `EMP-${Math.floor(Math.random()*1000)}`
      }, { onConflict: 'email' });
      if (error) logs.push(`Error migrating employee ${member.name}: ${error.message}`);
    }

    // 2. Migrate Settings
    const settings = getLocalItem(KEYS.SETTINGS) || DEFAULT_SETTINGS;
    const { error: settingsError } = await supabase.from('settings').upsert(settings);
    if (settingsError) logs.push(`Error migrating settings: ${settingsError.message}`);

    // 3. Migrate Customers
    const customers = getLocalItem(KEYS.CUSTOMERS) || [];
    for (const cust of customers) {
      const { id, idNumber, ...custData } = cust;
      const { error } = await supabase.from('customers').upsert({
        ...custData,
        "idNumber": idNumber || null
      }, { onConflict: '"idNumber"' });
      if (error) logs.push(`Error migrating customer ${cust.name}: ${error.message}`);
    }

    // Fetch cloud customers to get their UUIDs
    const { data: cloudCustomers } = await supabase.from('customers').select('*');

    // 4. Migrate Orders and Audits
    const orders = getLocalItem(KEYS.ORDERS) || [];
    for (const order of orders) {
      // Find matching customer UUID
      let customerId = null;
      if (cloudCustomers) {
        const match = cloudCustomers.find(c => 
          (order.customerIdNumber && c.idNumber === order.customerIdNumber) || 
          (c.name === order.customerName && c.phone === order.customerPhone)
        );
        if (match) customerId = match.id;
      }

      // Extract logs before upserting order
      const orderLogs = order.logs || [];
      const orderToUpsert = { ...order, customerId };
      // Delete the logs from the order object to avoid conflicts if the schema changes, 
      // but the schema still has a JSONB logs column so we can keep it as is, just copy it to order_audit.

      const { error } = await supabase.from('orders').upsert(orderToUpsert, { onConflict: 'id' });
      if (error) {
        logs.push(`Error migrating order ${order.id}: ${error.message}`);
      } else {
        // Push to order_audit table
        for (const log of orderLogs) {
          await supabase.from('order_audit').insert({
            orderId: order.id,
            userName: log.userName,
            userNumber: log.userNumber,
            action: log.action,
            timestamp: log.timestamp
          });
        }
      }
    }
    
    if (logs.length > 0) {
      console.error('Migration errors:', logs);
      throw new Error('היו שגיאות במהלך ההגירה, אנא בדוק בקונסול');
    }

    return true;
  }
};


