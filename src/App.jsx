import React, { useState, useEffect, useRef } from 'react';
import { dbService } from './services/db';
import {
  FiHome,
  FiList,
  FiPlusCircle,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiMessageCircle,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiUser,
  FiDollarSign,
  FiAlertTriangle,
  FiMenu,
  FiPrinter,
  FiUsers,
  FiActivity,
  FiRefreshCw
} from 'react-icons/fi';

function App() {
  // Screens: 'login', 'dashboard', 'orders', 'new_order', 'edit_order', 'settings', 'audit'
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Data State
  const [orders, setOrders] = useState([]);
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState({ whatsappTemplate: '', emailTemplate: '' });
  
  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Selected Order for Edit/Detail view
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('roy@orderflow.com');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [loginError, setLoginError] = useState('');
  
  // New Order Form
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerIdNumber: '',
    items: '',
    orderDate: new Date().toISOString().split('T')[0],
    dueTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
    receiptNumber: '',
    status: 'in_progress',
    paymentStatus: 'unpaid',
    location: 'on_the_way',
    sourceBranch: '',
    internalNotes: ''
  });

  // Settings & Templates form state
  const [settingsForm, setSettingsForm] = useState({
    whatsappTemplate: '',
    emailTemplate: ''
  });
  
  // Team addition form state
  const [newMember, setNewMember] = useState({ name: '', birthdate: '', phone: '', email: '', role: 'employee', employeeNumber: '' });
  
  // Team editing form state
  const [editingMember, setEditingMember] = useState(null);

  // Customers state
  const [customers, setCustomers] = useState([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null); // { id, name, phone, email, idNumber }

  // Quick inline status change in orders list
  const [quickStatusOrderId, setQuickStatusOrderId] = useState(null);


  // Audit log screen state
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditUserFilter, setAuditUserFilter] = useState('all');

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Omnibar (Command Palette) state
  const [isOmnibarOpen, setIsOmnibarOpen] = useState(false);
  const [omnibarQuery, setOmnibarQuery] = useState('');
  const [omnibarSelectedIndex, setOmnibarSelectedIndex] = useState(0);

  // Global Shortcut for Command Palette: Ctrl + K or Cmd + K
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOmnibarOpen(prev => {
          const newVal = !prev;
          if (newVal) {
            setOmnibarQuery('');
            setOmnibarSelectedIndex(0);
          }
          return newVal;
        });
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Load Initial Data
  useEffect(() => {
    const user = dbService.auth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentScreen('dashboard');
    }
  }, []);

  // Pre-fill date and time dynamically when navigating to New Order Form
  useEffect(() => {
    if (currentScreen === 'new_order') {
      setOrderForm(prev => ({
        ...prev,
        orderDate: new Date().toISOString().split('T')[0],
        dueTime: new Date().toTimeString().split(' ')[0].substring(0, 5)
      }));
    }
  }, [currentScreen]);

  // Fetch all database records when screen changes or user logs in
  const fetchData = async () => {
    try {
      const allOrders = await dbService.orders.getAll();
      const allTeam = await dbService.team.getAll();
      const allSettings = await dbService.settings.get();
      const allCustomers = await dbService.customers.getAll();
      
      setOrders(allOrders);
      setTeam(allTeam);
      setSettings(allSettings);
      setSettingsForm(allSettings);
      setCustomers(allCustomers);
    } catch (err) {
      console.error("שגיאה בטעינת נתונים:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, currentScreen]);

  // Fetch specific order when selected
  useEffect(() => {
    const fetchSelectedOrder = async () => {
      if (selectedOrderId) {
        try {
          const order = await dbService.orders.getById(selectedOrderId);
          setSelectedOrder(order);
        } catch (err) {
          console.error("שגיאה בטעינת הזמנה:", err);
        }
      }
    };
    fetchSelectedOrder();
  }, [selectedOrderId]);

  // Migration Handler
  const [isMigrating, setIsMigrating] = useState(false);
  const handleMigration = async () => {
    if (window.confirm("האם אתה בטוח שברצונך לסנכרן את כל הנתונים המקומיים לענן? זה עשוי לדרוס נתונים קיימים בענן.")) {
      setIsMigrating(true);
      try {
        await dbService.migrateToSupabase();
        alert("הסנכרון לענן הושלם בהצלחה! כל הנתונים שלך בטוחים ב-Supabase.");
      } catch (err) {
        alert("שגיאה בסנכרון: " + err.message);
      } finally {
        setIsMigrating(false);
      }
    }
  };

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const user = await dbService.auth.login(loginEmail, loginPassword);
      setCurrentUser(user);
      setCurrentScreen('dashboard');
    } catch (err) {
      setLoginError(err.message || 'אימייל או סיסמה שגויים');
    }
  };

  const handleLogout = async () => {
    await dbService.auth.logout();
    setCurrentUser(null);
    setCurrentScreen('login');
    setMobileMenuOpen(false);
  };

  // Order Handlers
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const createdOrder = await dbService.orders.create(orderForm);
      // Automatically trigger logistics label print
      handlePrintLabel(createdOrder);
      await fetchData();
      
      // Reset form
      setOrderForm({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerIdNumber: '',
        items: '',
        orderDate: new Date().toISOString().split('T')[0],
        dueTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
        receiptNumber: '',
        status: 'in_progress',
        paymentStatus: 'unpaid',
        location: 'on_the_way',
        sourceBranch: '',
        internalNotes: ''
      });
      setCurrentScreen('orders');
    } catch (err) {
      alert("שגיאה ביצירת הזמנה: " + err.message);
    }
  };

  const handleCreateOrderForCustomer = (cust) => {
    setOrderForm({
      customerName: cust.name,
      customerPhone: cust.phone,
      customerEmail: cust.email === 'לא צוין' ? '' : cust.email,
      customerIdNumber: cust.idNumber || '',
      items: '',
      orderDate: new Date().toISOString().split('T')[0],
      dueTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
      receiptNumber: '',
      status: 'in_progress',
      paymentStatus: 'unpaid',
      location: 'on_the_way',
      sourceBranch: '',
      internalNotes: ''
    });
    setCurrentScreen('new_order');
  };

  const handleDeleteOrder = async (orderId) => {
    if (currentUser.role !== 'manager') {
      alert("פעולה זו מורשית למנהלים בלבד!");
      return;
    }
    if (window.confirm(`האם אתה בטוח שברצונך למחוק לצמיתות את הזמנה #${orderId}?`)) {
      try {
        await dbService.orders.delete(orderId);
        alert("ההזמנה נמחקה מהמערכת בהצלחה.");
        fetchData();
        if (selectedOrderId === orderId) {
          setSelectedOrderId(null);
          setCurrentScreen('orders');
        }
      } catch (err) {
        alert("שגיאה במחיקת הזמנה: " + err.message);
      }
    }
  };

  const handleDeleteCustomer = async (id, name) => {
    if (currentUser.role !== 'manager') {
      alert("פעולה זו מורשית למנהלים בלבד!");
      return;
    }
    if (window.confirm(`האם אתה בטוח שברצונך למחוק לצמיתות את הלקוח "${name}" ואת כל ההזמנות המשוייכות אליו?`)) {
      try {
        await dbService.customers.delete(id);
        alert("הלקוח וכל הזמנותיו נמחקו בהצלחה מהמערכת.");
        fetchData();
      } catch (err) {
        alert("שגיאה במחיקת לקוח: " + err.message);
      }
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    try {
      await dbService.customers.update(editingCustomer.id, {
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        email: editingCustomer.email,
        idNumber: editingCustomer.idNumber,
      });
      alert("פרטי הלקוח עודכנו בהצלחה!");
      setEditingCustomer(null);
      fetchData();
    } catch (err) {
      alert("שגיאה בעדכון פרטי לקוח: " + err.message);
    }
  };

  // Inline quick status change from the orders list
  const handleInlineStatusChange = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      await dbService.orders.update(orderId, { ...order, status: newStatus });
      setQuickStatusOrderId(null);
      fetchData();
    } catch (err) {
      alert("שגיאה בשינוי סטטוס: " + err.message);
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const updated = await dbService.orders.update(selectedOrder.id, selectedOrder);
      setSelectedOrder(updated);
      alert("ההזמנה עודכנה בהצלחה!");
      fetchData();
    } catch (err) {
      alert("שגיאה בעדכון הזמנה: " + err.message);
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await dbService.orders.update(id, { status: newStatus });
      fetchData();
      if (selectedOrder && selectedOrder.id === id) {
        const updated = await dbService.orders.getById(id);
        setSelectedOrder(updated);
      }
    } catch (err) {
      alert("שגיאה בעדכון סטטוס: " + err.message);
    }
  };

  const handleQuickLocationChange = async (id, newLoc) => {
    try {
      await dbService.orders.update(id, { location: newLoc });
      fetchData();
      if (selectedOrder && selectedOrder.id === id) {
        const updated = await dbService.orders.getById(id);
        setSelectedOrder(updated);
      }
    } catch (err) {
      alert("שגיאה בעדכון מיקום: " + err.message);
    }
  };


  // Team & Settings Handlers
  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      await dbService.team.addMember(newMember);
      setNewMember({ name: '', birthdate: '', phone: '', email: '', role: 'employee', employeeNumber: '' });
      fetchData();
    } catch (err) {
      alert("שגיאה בהוספת איש צוות: " + err.message);
    }
  };

  const handleRemoveTeamMember = async (id) => {
    if (window.confirm("האם להסיר עובד זה מהצוות?")) {
      try {
        await dbService.team.removeMember(id);
        fetchData();
      } catch (err) {
        alert("שגיאה בהסרת איש צוות: " + err.message);
      }
    }
  };

  const handleUpdateTeamMember = async (e) => {
    e.preventDefault();
    if (!editingMember) return;
    try {
      await dbService.team.updateMember(editingMember.id, editingMember);
      alert("פרטי העובד עודכנו בהצלחה!");
      setEditingMember(null);
      fetchData();
      
      // If the updated member is the CURRENT logged-in user, sync currentUser state!
      if (currentUser && currentUser.id === editingMember.id) {
        const freshUser = await dbService.team.getAll();
        const me = freshUser.find(u => u.id === currentUser.id);
        if (me) {
          setCurrentUser(me);
          localStorage.setItem('orderflow_current_user', JSON.stringify(me));
        }
      }
    } catch (err) {
      alert("שגיאה בעדכון פרטי עובד: " + err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await dbService.settings.update(settingsForm);
      setSettings(settingsForm);
      alert("ההגדרות נשמרו בהצלחה!");
    } catch (err) {
      alert("שגיאה בשמירת הגדרות: " + err.message);
    }
  };

  // Translation Helper for location keys
  const translateLocation = (loc) => {
    if (loc === 'in_store') return 'בחנות';
    if (loc === 'on_the_way') return 'בדרך';
    return loc;
  };

  // Helper to dynamically calculate age based on birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return '';
    const birthDateObj = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  // Helper to check if an order has been in the system for a week and is not yet completed
  const isOrderCritical = (order) => {
    if (!order || order.status === 'delivered') return false;
    const createdDate = new Date(order.createdAt);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return createdDate <= oneWeekAgo;
  };

  // Logistics Barcode Label Printing (Zebra / Thermal / Standard Printer)
  const handlePrintLabel = (order) => {
    const printWindow = window.open('', '_blank', 'width=450,height=400');
    if (!printWindow) {
      alert("אנא אפשר חלונות קופצים (Pop-ups) בדפדפן כדי להדפיס מדבקות לוגיסטיות.");
      return;
    }
    
    // Barcode 39 requires asterisks as start/stop characters
    const barcodeText = `*${order.id}*`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="he" dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>הדפסת מדבקה #${order.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&family=Libre+Barcode+39&display=swap');
          
          body {
            font-family: 'Rubik', sans-serif;
            margin: 0;
            padding: 8px;
            width: 70mm; /* Standard 3"x2" or 80mm labels */
            box-sizing: border-box;
            background: #ffffff;
            color: #000000;
            text-align: center;
          }
          
          .label-wrapper {
            border: 2px solid #000000;
            padding: 8px;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            min-height: 44mm;
          }

          .title {
            font-size: 11px;
            font-weight: 700;
            border-bottom: 1px dashed #000000;
            width: 100%;
            padding-bottom: 4px;
            letter-spacing: 0.5px;
          }

          .order-id {
            font-size: 22px;
            font-weight: 900;
            margin: 4px 0;
          }

          .name {
            font-size: 15px;
            font-weight: 700;
            margin: 2px 0;
          }

          .phone {
            font-size: 12px;
            margin-bottom: 4px;
          }

          .items {
            font-size: 10px;
            font-weight: 600;
            border-top: 1px dashed #000000;
            padding-top: 4px;
            width: 100%;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 4px 0;
            text-align: right;
          }

          .info-row {
            font-size: 10px;
            display: flex;
            justify-content: space-between;
            width: 100%;
            border-bottom: 1px dashed #000000;
            padding-bottom: 4px;
          }

          .barcode {
            font-family: 'Libre Barcode 39', sans-serif;
            font-size: 44px;
            margin: 6px 0 2px 0;
            letter-spacing: 2px;
            line-height: 1;
          }

          .barcode-label {
            font-size: 9px;
            font-weight: 700;
            margin-top: -2px;
          }

          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .label-wrapper {
              border: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="label-wrapper">
          <div class="title">ORDERFLOW LOGISTICS</div>
          <div class="order-id">הזמנה #${order.id}</div>
          <div class="name">${order.customerName}</div>
          <div class="phone">${order.customerPhone}</div>
          <div class="info-row">
            <span>סניף מקור: ${order.sourceBranch || 'לא צוין'}</span>
            <span>מיקום: ${order.location === 'in_store' ? 'בחנות' : 'בדרך'}</span>
          </div>
          <div class="items">${order.items}</div>
          <div class="barcode">${barcodeText}</div>
          <div class="barcode-label">#${order.id}</div>
        </div>
        <script>
          document.fonts.ready.then(function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 600);
          });
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Communication Link Generators
  const generateWhatsAppLink = (order) => {
    if (!order) return '#';
    let text = settings.whatsappTemplate || '';
    text = text
      .replace(/{שם}/g, order.customerName)
      .replace(/{פריטים}/g, order.items)
      .replace(/{מיקום}/g, translateLocation(order.location) || 'החנות')
      .replace(/{קבלה}/g, order.receiptNumber || '');
    
    // Clean phone number (replace space, hyphens)
    let phone = order.customerPhone.replace(/[-\s]/g, '');
    if (phone.startsWith('0')) {
      phone = '972' + phone.substring(1);
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const generateEmailBody = (order) => {
    if (!order) return '';
    let body = settings.emailTemplate || '';
    body = body
      .replace(/{שם}/g, order.customerName)
      .replace(/{פריטים}/g, order.items)
      .replace(/{מיקום}/g, translateLocation(order.location) || 'החנות')
      .replace(/{קבלה}/g, order.receiptNumber || '');
    return body;
  };

  // Render Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'ready':
        return <span className="chip chip-ready"><FiClock /> ממתין לאיסוף</span>;
      case 'in_progress':
        return <span className="chip chip-in_progress"><FiClock /> בתהליך</span>;
      case 'awaiting_update':
        return <span className="chip chip-awaiting_stock"><FiAlertTriangle /> ממתין לעדכון</span>;
      case 'delivered':
        return <span className="chip chip-delivered"><FiCheckCircle /> נאסף</span>;
      default:
        return <span className="chip">{status}</span>;
    }
  };

  const renderPaymentStatusBadge = (payment) => {
    switch (payment) {
      case 'paid_full':
        return <span className="chip chip-ready"><FiDollarSign /> שולם מלא</span>;
      case 'paid_deposit':
        return <span className="chip chip-awaiting_stock"><FiDollarSign /> שולמה מקדמה</span>;
      case 'unpaid':
        return <span className="chip chip-delivered" style={{backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)'}}><FiDollarSign /> לא שולם</span>;
      default:
        return <span className="chip">{payment}</span>;
    }
  };

  // Filter orders for display
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      order.id.includes(searchQuery) ||
      (order.receiptNumber && order.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesStatus = false;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'critical') {
      matchesStatus = isOrderCritical(order);
    } else {
      matchesStatus = order.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  // Filter customers for display
  const filteredCustomers = customers.filter(cust => {
    const query = customerSearchQuery.toLowerCase();
    return (
      cust.name.toLowerCase().includes(query) ||
      cust.phone.includes(query) ||
      cust.email.toLowerCase().includes(query) ||
      (cust.idNumber || '').includes(query)
    );
  });

  // Calculate statistics
  const stats = {
    ready: orders.filter(o => o.status === 'ready').length,
    in_progress: orders.filter(o => o.status === 'in_progress').length,
    awaiting_update: orders.filter(o => o.status === 'awaiting_update').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    critical: orders.filter(isOrderCritical).length
  };

  // Extract all logs for Dashboard "Recent Activity"
  const recentLogs = orders
    .flatMap(o => (o.logs || []).map(l => ({ ...l, orderId: o.id, customerName: o.customerName })))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  // Full audit log for manager's audit screen
  const allAuditLogs = orders
    .flatMap(o => (o.logs || []).map(l => ({
      ...l,
      orderId: o.id,
      customerName: o.customerName,
      orderStatus: o.status,
    })))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filteredAuditLogs = allAuditLogs.filter(log => {
    const q = auditSearchQuery.toLowerCase();
    const matchSearch = !q ||
      (log.action || '').toLowerCase().includes(q) ||
      (log.userName || '').toLowerCase().includes(q) ||
      String(log.orderId || '').includes(q) ||
      (log.customerName || '').toLowerCase().includes(q);
    const matchUser = auditUserFilter === 'all' || log.userName === auditUserFilter;
    return matchSearch && matchUser;
  });

  // Unique users list for filter dropdown
  const auditUsers = [...new Set(allAuditLogs.map(l => l.userName).filter(Boolean))];

  // Live auto-refresh every 30s when on audit screen
  useEffect(() => {
    if (currentScreen !== 'audit') return;
    const interval = setInterval(() => { fetchData(); }, 30000);
    return () => clearInterval(interval);
  }, [currentScreen]);

  // Get active open orders, sorted by the date the order was taken (oldest first)
  const urgentOrders = orders
    .filter(o => o.status !== 'delivered')
    .sort((a, b) => {
      const dateCompare = (a.orderDate || '').localeCompare(b.orderDate || '');
      if (dateCompare !== 0) return dateCompare;
      return (a.dueTime || '').localeCompare(b.dueTime || '');
    })
    .slice(0, 10);
  // Omnibar (Command Palette) results calculation
  const getOmnibarResults = () => {
    const query = omnibarQuery.trim().toLowerCase();
    
    // Define base commands
    const baseCommands = [
      { id: 'cmd_dashboard', type: 'command', category: 'פעולות מערכת', title: 'עבור ללוח הבקרה (דשבורד)', subtitle: 'מסך ראשי, סטטיסטיקות ופעילות אחרונה', action: () => { setCurrentScreen('dashboard'); setIsOmnibarOpen(false); } },
      { id: 'cmd_orders', type: 'command', category: 'פעולות מערכת', title: 'עבור לספר הזמנות', subtitle: 'רשימת כל ההזמנות, חיפושים וסינונים', action: () => { setCurrentScreen('orders'); setStatusFilter('all'); setIsOmnibarOpen(false); } },
      { id: 'cmd_customers', type: 'command', category: 'פעולות מערכת', title: 'עבור למאגר הלקוחות', subtitle: 'רשימת הלקוחות והיסטוריית הרכישות וההזמנות שלהם', action: () => { setCurrentScreen('customers'); setCustomerSearchQuery(''); setIsOmnibarOpen(false); } },
      { id: 'cmd_new_order', type: 'command', category: 'פעולות מערכת', title: 'צור הזמנה חדשה', subtitle: 'טופס קליטת הזמנה או טיוטה חדשה', action: () => { setCurrentScreen('new_order'); setIsOmnibarOpen(false); } },
      { id: 'cmd_settings', type: 'command', category: 'פעולות מערכת', title: 'עבור להגדרות סניף', subtitle: 'ניהול תבניות הודעה וצוות עובדים', action: () => { setCurrentScreen('settings'); setIsOmnibarOpen(false); } },
      { id: 'cmd_status_progress', type: 'command', category: 'פעולות מערכת', title: 'הצג הזמנות: בתהליך', subtitle: 'סינון הזמנות בסטטוס בתהליך עבודה', action: () => { setCurrentScreen('orders'); setStatusFilter('in_progress'); setIsOmnibarOpen(false); } },
      { id: 'cmd_status_awaiting', type: 'command', category: 'פעולות מערכת', title: 'הצג הזמנות: ממתין לעדכון', subtitle: 'סינון הזמנות הממתינות לעדכון פרטים/ספק', action: () => { setCurrentScreen('orders'); setStatusFilter('awaiting_update'); setIsOmnibarOpen(false); } },
      { id: 'cmd_status_ready', type: 'command', category: 'פעולות מערכת', title: 'הצג הזמנות: ממתין לאיסוף', subtitle: 'סינון הזמנות המוכנות לאיסוף עצמי של הלקוח', action: () => { setCurrentScreen('orders'); setStatusFilter('ready'); setIsOmnibarOpen(false); } },
      { id: 'cmd_status_delivered', type: 'command', category: 'פעולות מערכת', title: 'הצג הזמנות: נאסף', subtitle: 'סינון הזמנות שנמסרו ונאספו בהצלחה', action: () => { setCurrentScreen('orders'); setStatusFilter('delivered'); setIsOmnibarOpen(false); } },
    ];

    if (!query) {
      return baseCommands;
    }

    const filteredCommands = baseCommands.filter(c => c.title.toLowerCase().includes(query) || c.subtitle.toLowerCase().includes(query));
    
    // Filter matching orders
    const matchedOrders = orders
      .filter(o => 
        o.id.includes(query) || 
        (o.receiptNumber && o.receiptNumber.toLowerCase().includes(query)) ||
        o.items.toLowerCase().includes(query)
      )
      .map(o => ({
        id: 'order_' + o.id,
        type: 'order',
        category: 'הזמנות תואמות',
        title: `הזמנה #${o.id} - ${o.receiptNumber || 'ללא מספר קבלה'}`,
        subtitle: o.items,
        action: () => { setSelectedOrderId(o.id); setCurrentScreen('edit_order'); setIsOmnibarOpen(false); }
      }));

    // Filter matching customers
    const matchedCustomers = customers
      .filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.phone.includes(query) || 
        c.id.toLowerCase().includes(query) ||
        (c.email && c.email.toLowerCase().includes(query))
      )
      .map(c => ({
        id: 'cust_' + c.id,
        type: 'customer',
        category: 'לקוחות תואמים',
        title: `${c.name} (${c.id})`,
        subtitle: `טלפון: ${c.phone} | כמות הזמנות: ${c.orders.length}`,
        action: () => { setCurrentScreen('customers'); setCustomerSearchQuery(c.phone); setIsOmnibarOpen(false); }
      }));

    // Combine results: customers first, then orders, then commands
    return [...matchedCustomers, ...matchedOrders, ...filteredCommands];
  };

  const handleOmnibarKeyDown = (e) => {
    const results = getOmnibarResults();
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOmnibarSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOmnibarSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[omnibarSelectedIndex]) {
        results[omnibarSelectedIndex].action();
      }
    }
  };

  return (
    <div className="app-container">
      {/* 1. LOGIN SCREEN */}
      {currentScreen === 'login' && (
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-logo">OrderFlow</h1>
            <p className="login-subtitle">מערכת תפעולית לניהול ומעקב הזמנות בסניף</p>
            
            {loginError && (
              <div className="card" style={{borderColor: 'var(--color-error)', backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)', padding: '10px', fontSize: '13px', textAlign: 'center', marginBottom: '16px'}}>
                {loginError}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">כתובת אימייל</label>
                <input 
                  type="email"
                  list="saved-emails"
                  className="form-input" 
                  value={loginEmail} 
                  placeholder="הזן כתובת אימייל"
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (e.target.value === 'roy@orderflow.com') setLoginPassword('123456');
                    if (e.target.value === 'manager@orderflow.com') setLoginPassword('123456');
                  }}
                />
                <datalist id="saved-emails">
                  <option value="roy@orderflow.com">רועי (אחראי משמרת)</option>
                  <option value="manager@orderflow.com">מיכאל (מנהל חנות)</option>
                </datalist>
              </div>
              <div className="form-group">
                <label className="form-label">סיסמה</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  placeholder="הקלד סיסמה לחיבור"
                />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
                התחבר למערכת
              </button>
            </form>
            <div style={{marginTop: '20px', fontSize: '12px', color: 'var(--color-outline)', textAlign: 'center'}}>
              במצב הדגמה מקומי, השתמש בסיסמה <strong>123456</strong>
            </div>
          </div>
        </div>
      )}

      {/* RENDER APP CORE IF LOGGED IN */}
      {currentScreen !== 'login' && currentUser && (
        <>
          {/* SIDEBAR NAVIGATION */}
          <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="sidebar-brand">
              <span className="sidebar-logo">OrderFlow</span>
            </div>
            
            <nav className="sidebar-menu">
              <button 
                onClick={() => { setCurrentScreen('dashboard'); setMobileMenuOpen(false); }} 
                className={`sidebar-item ${currentScreen === 'dashboard' ? 'active' : ''}`}
              >
                <FiHome /> דשבורד
              </button>
              <button 
                onClick={() => { setCurrentScreen('orders'); setMobileMenuOpen(false); }} 
                className={`sidebar-item ${currentScreen === 'orders' ? 'active' : ''}`}
              >
                <FiList /> ספר הזמנות כללי
              </button>
              <button 
                onClick={() => { setCurrentScreen('customers'); setMobileMenuOpen(false); }} 
                className={`sidebar-item ${currentScreen === 'customers' ? 'active' : ''}`}
              >
                <FiUsers /> מאגר לקוחות
              </button>
              <button 
                onClick={() => { setCurrentScreen('new_order'); setMobileMenuOpen(false); }} 
                className={`sidebar-item ${currentScreen === 'new_order' ? 'active' : ''}`}
              >
                <FiPlusCircle /> הזמנה חדשה
              </button>
              {currentUser.role === 'manager' && (
                <button 
                  onClick={() => { setCurrentScreen('audit'); setMobileMenuOpen(false); }} 
                  className={`sidebar-item ${currentScreen === 'audit' ? 'active' : ''}`}
                >
                  <FiActivity /> יומן פעילות
                </button>
              )}
              <button 
                onClick={() => { setCurrentScreen('settings'); setMobileMenuOpen(false); }} 
                className={`sidebar-item ${currentScreen === 'settings' ? 'active' : ''}`}
              >
                <FiSettings /> הגדרות וצוות
              </button>
            </nav>
            
            <div className="sidebar-user">
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-surface-container-highest)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--color-primary)'}}>
                  <FiUser />
                </div>
                <div className="user-info">
                  <span className="user-name">{currentUser.name}</span>
                  <span className="user-role">{currentUser.role === 'manager' ? 'מנהל סניף' : currentUser.role === 'employee' ? 'אחראי משמרת' : 'מוכרן'}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn" title="התנתק">
                <FiLogOut />
              </button>
            </div>
          </aside>

          {/* MAIN APPLICATION CONTAINER */}
          <div className="main-wrapper">
            {/* TOP HEADER HEADER */}
            <header className="main-header">
              <div className="header-title-area">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                  style={{display: 'none', background: 'none', border: 'none', color: '#ffffff', fontSize: '24px', cursor: 'pointer'}}
                  className="mobile-toggle"
                >
                  <FiMenu />
                </button>
                <h2 className="headline-md" style={{color: '#ffffff'}}>
                  {currentScreen === 'dashboard' && 'דשבורד בקרה'}
                  {currentScreen === 'orders' && 'ספר הזמנות מרכזי'}
                  {currentScreen === 'customers' && 'מאגר לקוחות סניף'}
                  {currentScreen === 'new_order' && 'קליטת הזמנה חדשה'}
                  {currentScreen === 'edit_order' && `פרטי הזמנה #${selectedOrderId}`}
                  {currentScreen === 'settings' && 'הגדרות מערכת וצוות'}
                </h2>
              </div>
              
              <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <button 
                  onClick={() => {
                    setIsOmnibarOpen(true);
                    setOmnibarQuery('');
                    setOmnibarSelectedIndex(0);
                  }}
                  className="btn btn-secondary hide-mobile" 
                  style={{padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}
                  title="חיפוש מהיר ופקודות (Ctrl+K)"
                >
                  <FiSearch />
                  <span>חיפוש מהיר...</span>
                  <span className="search-trigger-hint">Ctrl K</span>
                </button>

                <div style={{fontSize: '13px', color: 'var(--color-outline)'}} className="hide-mobile">
                  משמרת פעילה: {new Date().toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                {currentScreen !== 'new_order' && (
                  <button onClick={() => setCurrentScreen('new_order')} className="btn btn-primary">
                    <FiPlusCircle /> הזמנה חדשה
                  </button>
                )}
              </div>
            </header>

            {/* SCREEN SPECIFIC VIEWS */}
            <main className="main-content">

              {/* 2. DASHBOARD VIEW */}
              {currentScreen === 'dashboard' && (
                <div>
                  {/* Stats Summary Panel */}
                   <div className="stats-grid">
                    <div className="stat-card ready" style={{cursor: 'pointer'}} onClick={() => { setStatusFilter('ready'); setCurrentScreen('orders'); }}>
                      <div className="stat-icon"><FiClock /></div>
                      <div className="stat-info">
                        <span className="stat-label">ממתין לאיסוף</span>
                        <span className="stat-value">{stats.ready}</span>
                      </div>
                    </div>
                    <div className="stat-card in_progress" style={{cursor: 'pointer'}} onClick={() => { setStatusFilter('in_progress'); setCurrentScreen('orders'); }}>
                      <div className="stat-icon"><FiClock /></div>
                      <div className="stat-info">
                        <span className="stat-label">בתהליך</span>
                        <span className="stat-value">{stats.in_progress}</span>
                      </div>
                    </div>
                    <div className="stat-card awaiting_stock" style={{cursor: 'pointer'}} onClick={() => { setStatusFilter('awaiting_update'); setCurrentScreen('orders'); }}>
                      <div className="stat-icon"><FiAlertTriangle /></div>
                      <div className="stat-info">
                        <span className="stat-label">ממתין לעדכון</span>
                        <span className="stat-value">{stats.awaiting_update}</span>
                      </div>
                    </div>
                    <div className="stat-card" style={{cursor: 'pointer', borderColor: 'var(--color-error)', backgroundColor: 'rgba(255, 180, 171, 0.08)'}} onClick={() => { setStatusFilter('critical'); setCurrentScreen('orders'); }}>
                      <div className="stat-icon" style={{color: 'var(--color-error)'}}><FiAlertTriangle /></div>
                      <div className="stat-info">
                        <span className="stat-label" style={{color: 'var(--color-error)'}}>קריטי (שבוע+)</span>
                        <span className="stat-value" style={{color: 'var(--color-error)'}}>{stats.critical}</span>
                      </div>
                    </div>
                    <div className="stat-card delivered" style={{cursor: 'pointer'}} onClick={() => { setStatusFilter('delivered'); setCurrentScreen('orders'); }}>
                      <div className="stat-icon"><FiCheckCircle /></div>
                      <div className="stat-info">
                        <span className="stat-label">נאסף</span>
                        <span className="stat-value">{stats.delivered}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard layout */}
                  <div className="dashboard-grid">
                    {/* Open Orders In Progress */}
                    <div className="card">
                      <div className="card-header">
                        <h3 className="headline-sm">הזמנות פתוחות בטיפול ({urgentOrders.length})</h3>
                        <button onClick={() => { setStatusFilter('all'); setCurrentScreen('orders'); }} className="btn btn-secondary" style={{padding: '4px 10px', fontSize: '12px'}}>צפייה בכל ההזמנות</button>
                      </div>
                      
                      {urgentOrders.length === 0 ? (
                        <div style={{padding: '40px 0', textAlign: 'center', color: 'var(--color-outline)'}}>
                          אין הזמנות פתוחות בטיפול. עבודה מצוינת!
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>מזהה</th>
                                <th>לקוח</th>
                                <th>פריטים</th>
                                <th>תאריך לקיחה</th>
                                <th>מיקום וסניף</th>
                                <th>סטטוס</th>
                                <th>פעולות</th>
                              </tr>
                            </thead>
                            <tbody>
                              {urgentOrders.map(order => (
                                <tr key={order.id}>
                                  <td style={{fontWeight: '700', color: 'var(--color-primary)'}}>
                                    #{order.id}
                                    {isOrderCritical(order) && (
                                      <span style={{
                                        backgroundColor: 'var(--color-error-container)',
                                        color: 'var(--color-error)',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                        marginRight: '8px',
                                        border: '1px solid var(--color-error)'
                                      }}>
                                        קריטי ⚠️
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <div style={{fontWeight: '600'}}>{order.customerName}</div>
                                    <div style={{fontSize: '12px', color: 'var(--color-outline)'}}>{order.customerPhone}</div>
                                  </td>
                                  <td style={{maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={order.items}>
                                    {order.items}
                                  </td>
                                  <td>{order.orderDate} {order.dueTime && `| ${order.dueTime}`}</td>
                                  <td>
                                    <div style={{fontSize: '13px'}}>
                                      <span style={{backgroundColor: 'var(--color-surface-container-highest)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px'}}>
                                        <FiMapPin style={{marginLeft: '4px', verticalAlign: 'middle'}} />
                                        {translateLocation(order.location) || 'לא הוגדר'}
                                      </span>
                                      {order.sourceBranch && (
                                        <span style={{display: 'block', fontSize: '11px', color: 'var(--color-primary)'}}>
                                          סניף: {order.sourceBranch}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td>{renderStatusBadge(order.status)}</td>
                                  <td>
                                    <div style={{display: 'flex', gap: '6px'}}>
                                      <button 
                                        onClick={() => handlePrintLabel(order)}
                                        className="btn btn-secondary" 
                                        style={{padding: '6px', color: 'var(--color-primary)'}}
                                        title="הדפס מדבקת ברקוד לוגיסטית"
                                      >
                                        <FiPrinter />
                                      </button>
                                      <button 
                                        onClick={() => { setSelectedOrderId(order.id); setCurrentScreen('edit_order'); }}
                                        className="btn btn-secondary" 
                                        style={{padding: '6px'}}
                                        title="עריכה ועדכון"
                                      >
                                        <FiEdit2 />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Recent audit activity */}
                    <div className="card">
                      <div className="card-header">
                        <h3 className="headline-sm">פעילות אחרונה בסניף</h3>
                      </div>
                      
                      <div className="timeline">
                        {recentLogs.map((log) => (
                          <div key={log.id} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <span className="timeline-action">
                              <strong>{log.userName}</strong>: {log.action}
                            </span>
                            <span className="timeline-meta">
                              הזמנה #{log.orderId} ({log.customerName}) | {new Date(log.timestamp).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        ))}
                        {recentLogs.length === 0 && (
                          <div style={{padding: '20px 0', textAlign: 'center', color: 'var(--color-outline)', fontSize: '13px'}}>
                            טרם נרשמו פעולות במערכת.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. ORDER MANAGEMENT DIRECTORY VIEW */}
              {currentScreen === 'orders' && (
                <div className="card">
                  <div className="card-header" style={{flexWrap: 'wrap', gap: '12px'}}>
                    {/* Search & Filters */}
                    <div className="search-wrapper" style={{position: 'relative'}}>
                      <FiSearch className="search-icon" />
                      <input 
                        type="text" 
                        placeholder="חפש הזמנות, לקוחות, או פקודות מערכת... (Ctrl+K)" 
                        className="search-input"
                        value=""
                        onClick={() => {
                          setIsOmnibarOpen(true);
                          setOmnibarQuery('');
                          setOmnibarSelectedIndex(0);
                        }}
                        onFocus={(e) => {
                          e.target.blur();
                          setIsOmnibarOpen(true);
                          setOmnibarQuery('');
                          setOmnibarSelectedIndex(0);
                        }}
                        readOnly
                      />
                      <span className="search-trigger-hint" style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', margin: '0', pointerEvents: 'none'}}>Ctrl K</span>
                    </div>
                    
                    {/* Status Tabs */}
                    <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                      <button 
                        onClick={() => setStatusFilter('all')} 
                        className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{padding: '8px 14px', fontSize: '13px'}}
                      >
                        הכל ({orders.length})
                      </button>
                      <button 
                        onClick={() => setStatusFilter('in_progress')} 
                        className={`btn ${statusFilter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{padding: '8px 14px', fontSize: '13px'}}
                      >
                        בתהליך ({orders.filter(o => o.status === 'in_progress').length})
                      </button>
                      <button 
                        onClick={() => setStatusFilter('awaiting_update')} 
                        className={`btn ${statusFilter === 'awaiting_update' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{padding: '8px 14px', fontSize: '13px'}}
                      >
                        ממתין לעדכון ({orders.filter(o => o.status === 'awaiting_update').length})
                      </button>
                      <button 
                        onClick={() => setStatusFilter('ready')} 
                        className={`btn ${statusFilter === 'ready' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{padding: '8px 14px', fontSize: '13px'}}
                      >
                        ממתין לאיסוף ({orders.filter(o => o.status === 'ready').length})
                      </button>
                      <button 
                        onClick={() => setStatusFilter('critical')} 
                        className={`btn ${statusFilter === 'critical' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                          padding: '8px 14px', 
                          fontSize: '13px',
                          color: statusFilter === 'critical' ? '#ffffff' : 'var(--color-error)',
                          borderColor: statusFilter === 'critical' ? 'var(--color-error)' : 'rgba(255, 180, 171, 0.2)',
                          backgroundColor: statusFilter === 'critical' ? 'rgba(255, 180, 171, 0.15)' : ''
                        }}
                      >
                        ⚠️ קריטי ({orders.filter(isOrderCritical).length})
                      </button>
                      <button 
                        onClick={() => setStatusFilter('delivered')} 
                        className={`btn ${statusFilter === 'delivered' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{padding: '8px 14px', fontSize: '13px'}}
                      >
                        נאסף ({orders.filter(o => o.status === 'delivered').length})
                      </button>
                    </div>
                  </div>

                  {/* Orders Table */}
                  {filteredOrders.length === 0 ? (
                    <div style={{padding: '60px 0', textAlign: 'center', color: 'var(--color-outline)'}}>
                      לא נמצאו הזמנות התואמות לחיפוש/סינון הנוכחי.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>מזהה</th>
                            <th>שם לקוח</th>
                            <th>טלפון</th>
                            <th>פירוט פריטים</th>
                            <th>תאריך הזמנה</th>
                            <th>מיקום במחסן וסניף</th>
                            <th>סטטוס</th>
                            <th>תשלום</th>
                            <th>פעולות מהירות</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map(order => (
                            <tr key={order.id}>
                              <td style={{fontWeight: '700', color: 'var(--color-primary)'}}>
                                #{order.id}
                                {isOrderCritical(order) && (
                                  <span style={{
                                    backgroundColor: 'var(--color-error-container)',
                                    color: 'var(--color-error)',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                    border: '1px solid var(--color-error)'
                                  }}>
                                    קריטי ⚠️
                                  </span>
                                )}
                              </td>
                              <td style={{fontWeight: '600'}}>{order.customerName}</td>
                              <td dir="ltr" style={{textAlign: 'right'}}>{order.customerPhone}</td>
                              <td style={{maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={order.items}>
                                {order.items}
                              </td>
                              <td>{order.orderDate} {order.dueTime && `| ${order.dueTime}`}</td>
                              <td>
                                <div style={{fontSize: '13px'}}>
                                  <span style={{backgroundColor: 'var(--color-surface-container-high)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px'}}>
                                    <FiMapPin style={{marginLeft: '4px', verticalAlign: 'middle'}} />
                                    {translateLocation(order.location) || 'לא צוין'}
                                  </span>
                                  {order.sourceBranch && (
                                    <span style={{display: 'block', fontSize: '11px', color: 'var(--color-primary)'}}>
                                      סניף: {order.sourceBranch}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>
                                {quickStatusOrderId === order.id ? (
                                  <div style={{display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '145px'}}>
                                    <select
                                      className="form-select"
                                      style={{fontSize: '12px', padding: '4px 8px'}}
                                      defaultValue={order.status}
                                      autoFocus
                                      onChange={e => handleInlineStatusChange(order.id, e.target.value)}
                                    >
                                      <option value="in_progress">בתהליך</option>
                                      <option value="ready">מוכן לאיסוף</option>
                                      <option value="awaiting_update">ממתין לעדכון</option>
                                      <option value="delivered">נאסף</option>
                                    </select>
                                    <button className="btn btn-secondary" style={{padding: '2px 8px', fontSize: '11px'}} onClick={() => setQuickStatusOrderId(null)}>ביטול</button>
                                  </div>
                                ) : (
                                  <div onClick={() => setQuickStatusOrderId(order.id)} style={{cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px'}} title="לחץ לשינוי סטטוס מהיר">
                                    {renderStatusBadge(order.status)}
                                    <span style={{fontSize: '10px', color: 'var(--color-outline)', opacity: 0.7}}>✏️</span>
                                  </div>
                                )}
                              </td>
                              <td>{renderPaymentStatusBadge(order.paymentStatus)}</td>
                              <td>
                                <div style={{display: 'flex', gap: '6px'}}>
                                  <button 
                                    onClick={() => handlePrintLabel(order)}
                                    className="btn btn-secondary" 
                                    style={{padding: '6px', color: 'var(--color-primary)'}}
                                    title="הדפס מדבקת ברקוד לוגיסטית"
                                  >
                                    <FiPrinter />
                                  </button>
                                  <button 
                                    onClick={() => { setSelectedOrderId(order.id); setCurrentScreen('edit_order'); }}
                                    className="btn btn-secondary" 
                                    style={{padding: '6px'}}
                                    title="צפייה ועריכה"
                                  >
                                    <FiEdit2 />
                                  </button>
                                  {order.status === 'ready' && (
                                    <a 
                                      href={generateWhatsAppLink(order)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-whatsapp"
                                      style={{padding: '6px'}}
                                      title="שלח וואטסאפ מוכן לאיסוף"
                                    >
                                      <FiMessageCircle />
                                    </a>
                                  )}
                                  {order.status !== 'delivered' && (
                                    <button 
                                      onClick={() => handleQuickStatusChange(order.id, 'delivered')}
                                      className="btn btn-success" 
                                      style={{padding: '6px', border: '1px solid var(--color-outline-variant)'}}
                                      title="סמן כנמסר לקוח"
                                    >
                                      <FiCheckCircle />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 3.1 CUSTOMERS DATABASE VIEW */}
              {currentScreen === 'customers' && (
                <div className="card">
                  <div className="card-header" style={{flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <h3 className="headline-sm">מאגר לקוחות סניף</h3>
                      <p style={{fontSize: '12px', color: 'var(--color-outline)', marginTop: '4px'}}>רשימת הלקוחות והיסטוריית הרכישות וההזמנות שלהם</p>
                    </div>
                    
                    <div className="search-wrapper" style={{maxWidth: '340px', width: '100%'}}>
                      <FiSearch className="search-icon" />
                      <input 
                        type="text" 
                        placeholder="חפש לפי שם, טלפון, ת.ז..." 
                        className="search-input"
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {filteredCustomers.length === 0 ? (
                    <div style={{padding: '60px 0', textAlign: 'center', color: 'var(--color-outline)'}}>
                      לא נמצאו לקוחות במאגר.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>תעודת זהות</th>
                            <th>שם לקוח</th>
                            <th>טלפון</th>
                            <th>אימייל</th>
                            <th>כמות הזמנות</th>
                            <th>היסטוריית הזמנות בסניף</th>
                            <th>פעולות</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomers.map((cust, idx) => (
                            <tr key={idx}>
                              <td style={{fontWeight: '600', color: 'var(--color-primary)', letterSpacing: '0.5px', fontFamily: 'monospace'}}>
                                {cust.idNumber ? cust.idNumber : <span style={{color: 'var(--color-outline)', fontSize: '12px'}}>לא צוין</span>}
                              </td>
                              <td style={{fontWeight: '600', color: '#ffffff'}}>{cust.name}</td>
                              <td dir="ltr" style={{textAlign: 'right'}}>{cust.phone}</td>
                              <td>{cust.email}</td>
                              <td style={{fontWeight: '700', color: 'var(--color-primary)'}}>{cust.orders.length}</td>
                              <td>
                                <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                                  {cust.orders.map(o => (
                                    <button
                                      key={o.id}
                                      onClick={() => {
                                        setSelectedOrderId(o.id);
                                        setCurrentScreen('edit_order');
                                      }}
                                      className={`chip ${
                                        o.status === 'ready' ? 'chip-ready' : 
                                        o.status === 'in_progress' ? 'chip-in_progress' : 
                                        o.status === 'awaiting_update' ? 'chip-awaiting_stock' : 
                                        'chip-delivered'
                                      }`}
                                      style={{padding: '3px 8px', fontSize: '11px', cursor: 'pointer', border: '1px solid var(--color-border)'}}
                                      title={`מוצרים: ${o.items}`}
                                    >
                                      #{o.id} ({o.status === 'ready' ? 'מוכן לאיסוף' : o.status === 'delivered' ? 'נאסף' : o.status === 'awaiting_update' ? 'ממתין לעדכון' : 'בתהליך'})
                                    </button>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                                  <button
                                    onClick={() => handleCreateOrderForCustomer(cust)}
                                    className="btn btn-secondary"
                                    style={{padding: '6px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)'}}
                                    title="צור הזמנה חדשה ללקוח זה"
                                  >
                                    <FiPlusCircle /> צור הזמנה
                                  </button>
                                  {currentUser.role === 'manager' && (
                                    <>
                                      <button
                                        onClick={() => setEditingCustomer({ id: cust.id, name: cust.name, phone: cust.phone === 'לא צוין' ? '' : cust.phone, email: cust.email === 'לא צוין' ? '' : cust.email, idNumber: cust.idNumber || '' })}
                                        className="btn btn-secondary"
                                        style={{padding: '6px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)'}}
                                        title="ערוך פרטי לקוח"
                                      >
                                        <FiEdit2 /> ערוך
                                      </button>
                                      <button
                                        onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                                        className="btn btn-danger"
                                        style={{padding: '6px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px'}}
                                        title="מחק לקוח לצמיתות"
                                      >
                                        <FiTrash2 /> מחק
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 3.2 AUDIT LOG SCREEN (manager only) */}
              {currentScreen === 'audit' && (
                <div className="card">
                  <div className="card-header" style={{flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between'}}>
                    <div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <h3 className="headline-sm">יומן פעילות סניף</h3>
                        <span style={{
                          backgroundColor: 'var(--color-primary)', color: '#000',
                          fontSize: '11px', fontWeight: '700', padding: '2px 8px',
                          borderRadius: '20px', letterSpacing: '0.5px'
                        }}>
                          🔴 LIVE
                        </span>
                      </div>
                      <p style={{fontSize: '12px', color: 'var(--color-outline)', marginTop: '4px'}}>
                        כל הפעולות שבוצעו על ההזמנות במערכת — רענון אוטומטי כל 30 שניות
                      </p>
                    </div>
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                      {/* User filter */}
                      <select
                        className="form-select"
                        style={{fontSize: '13px', padding: '6px 12px', minWidth: '150px'}}
                        value={auditUserFilter}
                        onChange={e => setAuditUserFilter(e.target.value)}
                      >
                        <option value="all">כל העובדים</option>
                        {auditUsers.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      {/* Search */}
                      <div className="search-wrapper" style={{maxWidth: '260px', width: '100%'}}>
                        <FiSearch className="search-icon" />
                        <input
                          type="text"
                          placeholder="חפש פעולה, עובד, הזמנה..."
                          className="search-input"
                          value={auditSearchQuery}
                          onChange={e => setAuditSearchQuery(e.target.value)}
                        />
                      </div>
                      {/* Manual refresh */}
                      <button
                        className="btn btn-secondary"
                        style={{padding: '7px 12px', display: 'flex', alignItems: 'center', gap: '6px'}}
                        onClick={() => fetchData()}
                        title="רענן נתונים עכשיו"
                      >
                        <FiRefreshCw style={{fontSize: '14px'}} /> רענן
                      </button>
                    </div>
                  </div>

                  {/* Stats strip */}
                  <div style={{display: 'flex', gap: '16px', padding: '12px 0', borderBottom: '1px solid var(--color-border)', marginBottom: '12px', flexWrap: 'wrap'}}>
                    <span style={{fontSize: '13px', color: 'var(--color-outline)'}}>
                      סה"כ פעולות: <strong style={{color: '#fff'}}>{allAuditLogs.length}</strong>
                    </span>
                    <span style={{fontSize: '13px', color: 'var(--color-outline)'}}>
                      מוצג: <strong style={{color: 'var(--color-primary)'}}>{filteredAuditLogs.length}</strong>
                    </span>
                    <span style={{fontSize: '13px', color: 'var(--color-outline)'}}>
                      עובדים פעילים: <strong style={{color: '#fff'}}>{auditUsers.length}</strong>
                    </span>
                  </div>

                  {filteredAuditLogs.length === 0 ? (
                    <div style={{padding: '60px 0', textAlign: 'center', color: 'var(--color-outline)'}}>
                      לא נמצאו פעולות התואמות לחיפוש.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>תאריך ושעה</th>
                            <th>עובד</th>
                            <th>מס' עובד</th>
                            <th>פעולה</th>
                            <th>הזמנה</th>
                            <th>לקוח</th>
                            <th>סטטוס הזמנה</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAuditLogs.map((log, idx) => {
                            const ts = new Date(log.timestamp);
                            const dateStr = ts.toLocaleDateString('he-IL');
                            const timeStr = ts.toLocaleTimeString('he-IL', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
                            const isCreate = (log.action || '').includes('יצירה') || (log.action || '').includes('חדשה');
                            const isDelete = (log.action || '').includes('מחיקה') || (log.action || '').includes('נמחק');
                            const isStatus = (log.action || '').includes('סטטוס') || (log.action || '').includes('מיקום');
                            let actionColor = 'var(--color-outline)';
                            if (isCreate) actionColor = '#4ade80';
                            else if (isDelete) actionColor = 'var(--color-error)';
                            else if (isStatus) actionColor = 'var(--color-primary)';
                            return (
                              <tr key={log.id || idx}>
                                <td style={{whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '12px'}}>
                                  <div>{dateStr}</div>
                                  <div style={{color: 'var(--color-outline)', fontSize: '11px'}}>{timeStr}</div>
                                </td>
                                <td style={{fontWeight: '600', color: '#fff'}}>{log.userName || '—'}</td>
                                <td style={{fontSize: '12px', color: 'var(--color-outline)', fontFamily: 'monospace'}}>{log.userNumber || '—'}</td>
                                <td>
                                  <span style={{color: actionColor, fontWeight: '500'}}>{log.action}</span>
                                </td>
                                <td>
                                  <button
                                    onClick={() => { setSelectedOrderId(log.orderId); setCurrentScreen('edit_order'); }}
                                    className="btn btn-secondary"
                                    style={{padding: '3px 10px', fontSize: '12px', color: 'var(--color-primary)', fontWeight: '700'}}
                                  >
                                    #{log.orderId}
                                  </button>
                                </td>
                                <td style={{fontSize: '13px'}}>{log.customerName}</td>
                                <td>{renderStatusBadge(log.orderStatus)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 4. NEW ORDER VIEW */}
              {currentScreen === 'new_order' && (
                <div className="card" style={{maxWidth: '800px', margin: '0 auto'}}>
                  <div className="card-header">
                    <h3 className="headline-sm">הזנת פרטי הזמנה חדשה</h3>
                    <button onClick={() => setCurrentScreen('dashboard')} className="btn btn-secondary" style={{padding: '4px 10px'}}>חזור</button>
                  </div>
                  
                  <form onSubmit={handleCreateOrder} style={{marginTop: '16px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                      <div className="form-group">
                        <label className="form-label">שם הלקוח *</label>
                        <input 
                          type="text" 
                          required
                          className="form-input" 
                          placeholder="ישראל ישראלי"
                          value={orderForm.customerName}
                          onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">מספר טלפון *</label>
                        <input 
                          type="tel" 
                          required
                          className="form-input" 
                          placeholder="050-1234567"
                          value={orderForm.customerPhone}
                          onChange={(e) => setOrderForm({...orderForm, customerPhone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
                      <div className="form-group">
                        <label className="form-label">תעודת זהות *</label>
                        <input 
                          type="text" 
                          required
                          className="form-input" 
                          placeholder="123456789"
                          maxLength={9}
                          value={orderForm.customerIdNumber}
                          onChange={(e) => setOrderForm({...orderForm, customerIdNumber: e.target.value.replace(/\D/g, '')})}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">כתובת אימייל</label>
                        <input 
                          type="email" 
                          className="form-input" 
                          placeholder="customer@gmail.com"
                          value={orderForm.customerEmail}
                          onChange={(e) => setOrderForm({...orderForm, customerEmail: e.target.value})}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">מספר קבלה/חשבונית</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="REC-12345"
                          value={orderForm.receiptNumber}
                          onChange={(e) => setOrderForm({...orderForm, receiptNumber: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">פירוט הפריטים בהזמנה *</label>
                      <textarea 
                        required
                        className="form-textarea" 
                        placeholder="לדוגמה: אוהל קולמן 4 אנשים, שק שינה 15- מעלות"
                        value={orderForm.items}
                        onChange={(e) => setOrderForm({...orderForm, items: e.target.value})}
                      />
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                      <div className="form-group">
                        <label className="form-label">תאריך לקיחת הזמנה מהלקוח *</label>
                        <input 
                          type="date" 
                          required
                          className="form-input" 
                          value={orderForm.orderDate}
                          onChange={(e) => setOrderForm({...orderForm, orderDate: e.target.value})}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">שעת לקיחה</label>
                        <input 
                          type="time" 
                          className="form-input" 
                          value={orderForm.dueTime}
                          onChange={(e) => setOrderForm({...orderForm, dueTime: e.target.value})}
                        />
                      </div>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                      <div className="form-group">
                        <label className="form-label">נלקח מסניף (סניף מקור)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="לדוגמה: סניף תל אביב, סניף חיפה"
                          value={orderForm.sourceBranch}
                          onChange={(e) => setOrderForm({...orderForm, sourceBranch: e.target.value})}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">מיקום מוצר במעקב *</label>
                        <select 
                          className="form-select"
                          value={orderForm.location}
                          onChange={(e) => setOrderForm({...orderForm, location: e.target.value})}
                        >
                          <option value="on_the_way">בדרך</option>
                          <option value="in_store">בחנות</option>
                        </select>
                      </div>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                      <div className="form-group">
                        <label className="form-label">סטטוס ראשוני</label>
                        <select 
                          className="form-select"
                          value={orderForm.status}
                          onChange={(e) => setOrderForm({...orderForm, status: e.target.value})}
                        >
                          <option value="in_progress">בתהליך</option>
                          <option value="awaiting_update">ממתין לעדכון</option>
                          <option value="ready">ממתין לאיסוף</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">מצב תשלום</label>
                        <select 
                          className="form-select"
                          value={orderForm.paymentStatus}
                          onChange={(e) => setOrderForm({...orderForm, paymentStatus: e.target.value})}
                        >
                          <option value="unpaid">לא שולם</option>
                          <option value="paid_deposit">שולמה מקדמה</option>
                          <option value="paid_full">שולם במלואו</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">הערות פנימיות לצוות</label>
                      <textarea 
                        className="form-textarea" 
                        placeholder="מידע שישמש את אחראי המשמרת הבאים (לא נשלח ללקוח)"
                        value={orderForm.internalNotes}
                        onChange={(e) => setOrderForm({...orderForm, internalNotes: e.target.value})}
                      />
                    </div>

                    <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
                      <button 
                        type="button" 
                        onClick={() => setCurrentScreen('dashboard')} 
                        className="btn btn-secondary"
                      >
                        ביטול
                      </button>
                      <button 
                        type="button" 
                        onClick={async () => {
                          if (!orderForm.customerName || !orderForm.customerPhone || !orderForm.items || !orderForm.orderDate) {
                            alert("אנא מלא את כל שדות החובה המסומנים בכוכבית (*)");
                            return;
                          }
                          try {
                            const draft = { ...orderForm, status: 'in_progress', internalNotes: '[טיוטה] ' + orderForm.internalNotes };
                            const createdDraft = await dbService.orders.create(draft);
                            alert("טיוטת הזמנה נשמרה בהצלחה!");
                            handlePrintLabel(createdDraft);
                            await fetchData();
                            setCurrentScreen('dashboard');
                          } catch (err) {
                            alert(err.message);
                          }
                        }} 
                        className="btn btn-secondary"
                        style={{borderStyle: 'dashed'}}
                      >
                        שמור כטיוטה
                      </button>
                      <button type="submit" className="btn btn-primary">
                        שמור הזמנה וסנכרן
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 5. EDIT & DETAILS VIEW */}
              {currentScreen === 'edit_order' && selectedOrder && (
                <div className="dashboard-grid">
                  {/* Edit Form */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="headline-sm">עדכון פרטי הזמנה #{selectedOrder.id}</h3>
                      <div style={{display: 'flex', gap: '8px'}}>
                        {currentUser.role === 'manager' && (
                          <button 
                            type="button"
                            onClick={() => handleDeleteOrder(selectedOrder.id)} 
                            className="btn btn-danger" 
                            style={{padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px'}}
                          >
                            <FiTrash2 /> מחק הזמנה
                          </button>
                        )}
                        <button onClick={() => setCurrentScreen('orders')} className="btn btn-secondary" style={{padding: '4px 10px'}}>חזור לרשימה</button>
                      </div>
                    </div>

                    <div style={{fontSize: '12px', color: 'var(--color-outline)', margin: '16px 20px -8px 20px', direction: 'rtl'}}>
                      נוצר על ידי עובד: <strong style={{color: 'var(--color-primary)'}}>{selectedOrder.createdByEmployeeName || 'מערכת'} ({selectedOrder.createdByEmployeeNumber || 'לא צוין'})</strong> בתאריך {new Date(selectedOrder.createdAt).toLocaleString('he-IL')}
                    </div>

                    {isOrderCritical(selectedOrder) && (
                      <div className="card" style={{
                        borderColor: 'var(--color-error)',
                        backgroundColor: 'rgba(255, 180, 171, 0.08)',
                        color: 'var(--color-error)',
                        padding: '12px 16px',
                        margin: '16px 20px -8px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderRadius: 'var(--radius-default)',
                        borderWidth: '2px',
                        direction: 'rtl'
                      }}>
                        <FiAlertTriangle style={{fontSize: '24px', flexShrink: 0}} />
                        <div>
                          <strong style={{display: 'block', fontSize: '14px', marginBottom: '2px'}}>שים לב: הזמנה זו קריטית! ⚠️</strong>
                          <span style={{fontSize: '12px'}}>ההזמנה נוצרה לפני למעלה משבוע (ב-{new Date(selectedOrder.createdAt).toLocaleDateString('he-IL')}) וטרם נאספה על ידי הלקוח. יש לטפל בה במיידי.</span>
                        </div>
                      </div>
                    )}

                    <div style={{display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', backgroundColor: 'var(--color-surface-container-low)', padding: '10px', borderRadius: 'var(--radius-default)', border: '1px solid var(--color-border)'}}>
                      <span style={{fontSize: '13px', alignSelf: 'center', marginLeft: '10px', fontWeight: 'bold'}}>שינוי סטטוס מהיר:</span>
                      <button 
                        type="button"
                        onClick={() => handleQuickStatusChange(selectedOrder.id, 'in_progress')} 
                        className={`btn ${selectedOrder.status === 'in_progress' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{padding: '6px 12px', fontSize: '13px'}}
                      >
                        בתהליך
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleQuickStatusChange(selectedOrder.id, 'awaiting_update')} 
                        className={`btn ${selectedOrder.status === 'awaiting_update' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{padding: '6px 12px', fontSize: '13px'}}
                      >
                        ממתין לעדכון
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleQuickStatusChange(selectedOrder.id, 'ready')} 
                        className={`btn ${selectedOrder.status === 'ready' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{padding: '6px 12px', fontSize: '13px'}}
                      >
                        ממתין לאיסוף 🟢
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleQuickStatusChange(selectedOrder.id, 'delivered')} 
                        className={`btn ${selectedOrder.status === 'delivered' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{padding: '6px 12px', fontSize: '13px'}}
                      >
                        נאסף
                      </button>
                    </div>

                    <form onSubmit={handleUpdateOrder}>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
                        <div className="form-group">
                          <label className="form-label">שם הלקוח</label>
                          <input 
                            type="text" 
                            required
                            className="form-input" 
                            value={selectedOrder.customerName}
                            onChange={(e) => setSelectedOrder({...selectedOrder, customerName: e.target.value})}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">מספר טלפון</label>
                          <input 
                            type="tel" 
                            required
                            className="form-input" 
                            value={selectedOrder.customerPhone}
                            onChange={(e) => setSelectedOrder({...selectedOrder, customerPhone: e.target.value})}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">תעודת זהות</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="123456789"
                            maxLength={9}
                            value={selectedOrder.customerIdNumber || ''}
                            onChange={(e) => setSelectedOrder({...selectedOrder, customerIdNumber: e.target.value.replace(/\D/g, '')})}
                          />
                        </div>
                      </div>


                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        <div className="form-group">
                          <label className="form-label">תאריך לקיחת הזמנה מהלקוח</label>
                          <input 
                            type="date" 
                            required
                            className="form-input" 
                            value={selectedOrder.orderDate || ''}
                            onChange={(e) => setSelectedOrder({...selectedOrder, orderDate: e.target.value})}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">שעת לקיחה</label>
                          <input 
                            type="time" 
                            className="form-input" 
                            value={selectedOrder.dueTime || ''}
                            onChange={(e) => setSelectedOrder({...selectedOrder, dueTime: e.target.value})}
                          />
                        </div>
                      </div>

                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        <div className="form-group">
                          <label className="form-label">נלקח מסניף (סניף מקור)</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="לדוגמה: סניף תל אביב, סניף חיפה"
                            value={selectedOrder.sourceBranch || ''}
                            onChange={(e) => setSelectedOrder({...selectedOrder, sourceBranch: e.target.value})}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">מיקום מוצר במעקב *</label>
                          <select 
                            className="form-select"
                            value={selectedOrder.location || 'on_the_way'}
                            onChange={(e) => setSelectedOrder({...selectedOrder, location: e.target.value})}
                          >
                            <option value="on_the_way">בדרך</option>
                            <option value="in_store">בחנות</option>
                          </select>
                        </div>
                      </div>

                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        <div className="form-group">
                          <label className="form-label">כתובת אימייל</label>
                          <input 
                            type="email" 
                            className="form-input" 
                            value={selectedOrder.customerEmail || ''}
                            onChange={(e) => setSelectedOrder({...selectedOrder, customerEmail: e.target.value})}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">מספר קבלה/חשבונית</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={selectedOrder.receiptNumber || ''}
                            onChange={(e) => setSelectedOrder({...selectedOrder, receiptNumber: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">פירוט פריטי ההזמנה</label>
                        <textarea 
                          required
                          className="form-textarea" 
                          value={selectedOrder.items}
                          onChange={(e) => setSelectedOrder({...selectedOrder, items: e.target.value})}
                        />
                      </div>

                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        <div className="form-group">
                          <label className="form-label">סטטוס</label>
                          <select 
                            className="form-select"
                            value={selectedOrder.status}
                            onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
                          >
                            <option value="in_progress">בתהליך</option>
                            <option value="awaiting_update">ממתין לעדכון</option>
                            <option value="ready">ממתין לאיסוף</option>
                            <option value="delivered">נאסף</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">מצב תשלום</label>
                          <select 
                            className="form-select"
                            value={selectedOrder.paymentStatus}
                            onChange={(e) => setSelectedOrder({...selectedOrder, paymentStatus: e.target.value})}
                          >
                            <option value="unpaid">לא שולם</option>
                            <option value="paid_deposit">שולמה מקדמה</option>
                            <option value="paid_full">שולם במלואו</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">הערות פנימיות לצוות</label>
                        <textarea 
                          className="form-textarea" 
                          value={selectedOrder.internalNotes || ''}
                          onChange={(e) => setSelectedOrder({...selectedOrder, internalNotes: e.target.value})}
                        />
                      </div>

                      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '24px'}}>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteOrder(selectedOrder.id)} 
                          className="btn btn-danger"
                        >
                          <FiTrash2 /> מחק הזמנה
                        </button>
                        
                        <div style={{display: 'flex', gap: '12px'}}>
                          <button 
                            type="button" 
                            onClick={() => handlePrintLabel(selectedOrder)} 
                            className="btn btn-secondary"
                            style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}
                          >
                            <FiPrinter style={{marginLeft: '6px'}} /> הדפס מדבקת לוגיסטיקה
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setCurrentScreen('orders')} 
                            className="btn btn-secondary"
                          >
                            ביטול
                          </button>
                          <button type="submit" className="btn btn-primary">
                            שמור שינויים
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Sidebar Tools (WhatsApp generation + Audit Log) */}
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    
                    {/* Communications Box */}
                    <div className="card">
                      <div className="card-header">
                        <h3 className="headline-sm">עדכון לקוח אוטומטי</h3>
                      </div>
                      
                      <p className="body-md" style={{marginBottom: '16px'}}>
                        שלח הודעת עדכון מהירה ללקוח בלחיצה אחת:
                      </p>

                      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <a 
                          href={generateWhatsAppLink(selectedOrder)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-whatsapp"
                          style={{width: '100%'}}
                        >
                          <FiMessageCircle style={{marginLeft: '8px'}} />
                          שלח הודעת WhatsApp
                        </a>

                        <button 
                          onClick={() => {
                            const subject = encodeURIComponent("הזמנתך ב-OrderFlow מוכנה לאיסוף!");
                            const body = encodeURIComponent(generateEmailBody(selectedOrder));
                            window.open(`mailto:${selectedOrder.customerEmail}?subject=${subject}&body=${body}`);
                          }}
                          className="btn btn-secondary"
                          style={{width: '100%'}}
                          disabled={!selectedOrder.customerEmail}
                        >
                          שלח עדכון בדואר אלקטרוני
                        </button>
                        {!selectedOrder.customerEmail && (
                          <span style={{fontSize: '11px', color: 'var(--color-error)', textAlign: 'center'}}>
                            * לא הוגדרה כתובת אימייל עבור הזמנה זו
                          </span>
                        )}
                      </div>

                      <div style={{marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '16px'}}>
                        <span className="label-sm">תצוגה מקדימה להודעה (WhatsApp):</span>
                        <div style={{backgroundColor: 'var(--color-surface-container-lowest)', padding: '10px', borderRadius: '4px', fontSize: '13px', marginTop: '6px', color: '#dddddd', direction: 'rtl', whiteSpace: 'pre-wrap'}}>
                          {settings.whatsappTemplate
                            ? settings.whatsappTemplate
                              .replace(/{שם}/g, selectedOrder.customerName)
                              .replace(/{פריטים}/g, selectedOrder.items)
                              .replace(/{מיקום}/g, selectedOrder.location || 'החנות')
                              .replace(/{קבלה}/g, selectedOrder.receiptNumber || '')
                            : 'טוען תבנית...'
                          }
                        </div>
                      </div>
                    </div>

                    {/* Timeline Log (Audit Trail) */}
                    <div className="card">
                      <div className="card-header">
                        <h3 className="headline-sm">היסטוריית שינויים — הזמנה #{selectedOrder.id}</h3>
                        <span style={{fontSize: '12px', color: 'var(--color-outline)'}}>
                          {(selectedOrder.logs || []).length} פעולות
                        </span>
                      </div>
                      {(selectedOrder.logs || []).length === 0 ? (
                        <div style={{padding: '20px', textAlign: 'center', color: 'var(--color-outline)', fontSize: '13px'}}>
                          טרם נרשמו פעולות להזמנה זו.
                        </div>
                      ) : (
                        <div className="table-responsive" style={{marginTop: '8px'}}>
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>תאריך</th>
                                <th>שעה</th>
                                <th>עובד</th>
                                <th>פעולה</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...(selectedOrder.logs || [])].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map((log, idx) => {
                                const ts = new Date(log.timestamp);
                                const isCreate = (log.action||'').includes('יצירה') || (log.action||'').includes('חדשה');
                                const isDelete = (log.action||'').includes('מחיקה');
                                const isStatus = (log.action||'').includes('סטטוס') || (log.action||'').includes('מיקום');
                                let actionColor = '#ffffff';
                                if (isCreate) actionColor = '#4ade80';
                                else if (isDelete) actionColor = 'var(--color-error)';
                                else if (isStatus) actionColor = 'var(--color-primary)';
                                return (
                                  <tr key={log.id || idx}>
                                    <td style={{fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'nowrap'}}>
                                      {ts.toLocaleDateString('he-IL')}
                                    </td>
                                    <td style={{fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-outline)', whiteSpace: 'nowrap'}}>
                                      {ts.toLocaleTimeString('he-IL', {hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                                    </td>
                                    <td style={{fontWeight: '600'}}>
                                      {log.userName}
                                      {log.userNumber && <span style={{fontWeight: '400', color: 'var(--color-outline)', fontSize: '11px', marginRight: '6px'}}>({log.userNumber})</span>}
                                    </td>
                                    <td style={{color: actionColor, fontWeight: '500'}}>{log.action}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* 6. SETTINGS VIEW */}
              {currentScreen === 'settings' && (
                <div className="dashboard-grid">
                  {/* Templates editing panel */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="headline-sm">תבניות הודעות לקוח</h3>
                    </div>
                    
                    <form onSubmit={handleSaveSettings}>
                      <div className="form-group">
                        <label className="form-label">תבנית הודעת WhatsApp</label>
                        <textarea 
                          className="form-textarea" 
                          style={{minHeight: '120px'}}
                          value={settingsForm.whatsappTemplate}
                          onChange={(e) => setSettingsForm({...settingsForm, whatsappTemplate: e.target.value})}
                        />
                        <span className="label-sm" style={{marginTop: '-4px'}}>
                          תגיות זמינות: {"{שם}"} - שם הלקוח, {"{פריטים}"} - פירוט הזמנה, {"{מיקום}"} - מיקום במחסן, {"{קבלה}"} - מספר קבלה.
                        </span>
                      </div>

                      <div className="form-group" style={{marginTop: '16px'}}>
                        <label className="form-label">תבנית הודעת אימייל (Email)</label>
                        <textarea 
                          className="form-textarea" 
                          style={{minHeight: '150px'}}
                          value={settingsForm.emailTemplate}
                          onChange={(e) => setSettingsForm({...settingsForm, emailTemplate: e.target.value})}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{marginTop: '16px'}}>
                        שמור תבניות הודעה
                      </button>
                    </form>
                  </div>

                  {/* Cloud Migration panel */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="headline-sm">סנכרון נתונים לענן</h3>
                    </div>
                    <div className="form-group" style={{padding: '16px 0'}}>
                      <p style={{marginBottom: '16px', fontSize: '14px', color: 'var(--color-on-surface-variant)'}}>
                        מערכת זו פועלת כרגע עם זיכרון מקומי. לחיצה על הכפתור למטה תעתיק את כל הלקוחות, ההזמנות, וההגדרות שלך אל מסד הנתונים בענן (Supabase).
                      </p>
                      <button 
                        className="btn btn-primary" 
                        onClick={handleMigration} 
                        disabled={isMigrating}
                        style={{backgroundColor: '#3ECF8E', color: 'white'}}
                      >
                        {isMigrating ? "מסנכרן..." : "☁️ העלה נתונים לענן"}
                      </button>
                    </div>
                  </div>

                  {/* Team management panel */}
                  <div className="card">
                    <div className="card-header">
                      <h3 className="headline-sm">ניהול עובדים והרשאות צוות</h3>
                    </div>

                    {/* Team List */}
                    <div style={{marginBottom: '24px'}}>
                      <span className="label-sm" style={{display: 'block', marginBottom: '8px'}}>עובדים רשומים בסניף:</span>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                        {team.map(member => (
                          <div key={member.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'var(--color-surface-container-high)', borderRadius: 'var(--radius-default)', border: '1px solid var(--color-border)'}}>
                            <div>
                              <div style={{fontWeight: '600', color: '#ffffff'}}>
                                {member.name} 
                                {member.employeeNumber && <span style={{fontSize: '11px', color: 'var(--color-primary)', marginRight: '8px', backgroundColor: 'var(--color-surface-container-highest)', padding: '2px 6px', borderRadius: '4px'}}>עובד: {member.employeeNumber}</span>}
                              </div>
                              <div style={{fontSize: '12px', color: 'var(--color-outline)'}}>
                                {member.email}
                                {member.phone && ` | טלפון: ${member.phone}`}
                                {member.birthdate && ` | גיל: ${calculateAge(member.birthdate)} (${new Date(member.birthdate).toLocaleDateString('he-IL')})`}
                              </div>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                              <span className="chip" style={{fontSize: '11px', backgroundColor: member.role === 'manager' ? 'rgba(173,198,255,0.15)' : member.role === 'employee' ? 'rgba(255,185,95,0.1)' : 'var(--color-surface-container-highest)', color: member.role === 'manager' ? 'var(--color-primary)' : member.role === 'employee' ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)'}}>
                                {member.role === 'manager' ? 'מנהל סניף' : member.role === 'employee' ? 'אחראי משמרת' : 'מוכרן'}
                              </span>
                              {currentUser.role === 'manager' && (
                                <button 
                                  onClick={() => setEditingMember(member)}
                                  className="btn btn-secondary" 
                                  style={{padding: '4px 6px', fontSize: '11px'}}
                                  title="ערוך פרטי עובד"
                                >
                                  <FiEdit2 />
                                </button>
                              )}
                              {currentUser.role === 'manager' && member.id !== currentUser.id && (
                                <button 
                                  onClick={() => handleRemoveTeamMember(member.id)}
                                  className="btn btn-danger" 
                                  style={{padding: '4px 6px', fontSize: '11px'}}
                                  title="הסר עובד"
                                >
                                  <FiTrash2 />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add member form (Admin/Manager only) */}
                    {currentUser.role === 'manager' ? (
                      <div style={{borderTop: '1px solid var(--color-border)', paddingTop: '16px'}}>
                        <span className="label-sm" style={{display: 'block', marginBottom: '12px', fontWeight: 'bold'}}>הוספת איש צוות חדש:</span>
                        <form onSubmit={handleAddTeamMember} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                            <div className="form-group" style={{marginBottom: '0'}}>
                              <input 
                                type="text" 
                                required
                                className="form-input" 
                                placeholder="שם מלא של העובד *"
                                value={newMember.name}
                                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                              />
                            </div>
                            <div className="form-group" style={{marginBottom: '0'}}>
                              <input 
                                type="text" 
                                required
                                className="form-input" 
                                placeholder="מספר עובד (לדוגמה: EMP-103) *"
                                value={newMember.employeeNumber}
                                onChange={(e) => setNewMember({...newMember, employeeNumber: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                            <div className="form-group" style={{marginBottom: '0', display: 'flex', flexDirection: 'column'}}>
                              <span style={{fontSize: '11px', color: 'var(--color-outline)', marginBottom: '2px', marginRight: '4px'}}>תאריך לידה *</span>
                              <input 
                                type="date" 
                                required
                                className="form-input" 
                                value={newMember.birthdate}
                                onChange={(e) => setNewMember({...newMember, birthdate: e.target.value})}
                              />
                            </div>
                            <div className="form-group" style={{marginBottom: '0'}}>
                              <input 
                                type="text" 
                                required
                                className="form-input" 
                                placeholder="מספר טלפון *"
                                value={newMember.phone}
                                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{marginBottom: '0'}}>
                            <input 
                              type="email" 
                              required
                              className="form-input" 
                              placeholder="כתובת אימייל להתחברות *"
                              value={newMember.email}
                              onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                            />
                          </div>

                          <div className="form-group" style={{marginBottom: '0'}}>
                            <select 
                              className="form-select"
                              value={newMember.role}
                              onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                            >
                              <option value="employee">אחראי משמרת</option>
                              <option value="salesperson">מוכרן</option>
                              <option value="manager">מנהל סניף</option>
                            </select>
                          </div>
                          <button type="submit" className="btn btn-secondary" style={{width: '100%', borderStyle: 'dashed'}}>
                            <FiUserPlus style={{marginLeft: '6px'}} /> הוסף עובד לצוות
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div style={{backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: 'var(--radius-default)', display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <FiAlertTriangle style={{color: 'var(--color-warning)', fontSize: '20px', flexShrink: '0'}} />
                        <span style={{fontSize: '12px', color: 'var(--color-outline)'}}>
                          הוספת/הסרת עובדים מהצוות זמינה למנהלי סניף בלבד. המשתמש הנוכחי שלך ({currentUser.name}) הוא בעל הרשאת אחראי משמרת.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </main>
          </div>
        </>
      )}

      {/* 7. OMNIBAR / COMMAND PALETTE MODAL OVERLAY */}
      {isOmnibarOpen && (
        <div className="omnibar-backdrop" onClick={() => setIsOmnibarOpen(false)}>
          <div className="omnibar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="omnibar-search-box">
              <FiSearch className="omnibar-search-icon" />
              <input
                type="text"
                autoFocus
                className="omnibar-input"
                placeholder="חפש הזמנות, לקוחות, או פקודות מערכת... (לדוגמה: הגדרות)"
                value={omnibarQuery}
                onChange={(e) => {
                  setOmnibarQuery(e.target.value);
                  setOmnibarSelectedIndex(0);
                }}
                onKeyDown={handleOmnibarKeyDown}
              />
            </div>

            <div className="omnibar-results">
              {(() => {
                const results = getOmnibarResults();
                if (results.length === 0) {
                  return (
                    <div className="omnibar-empty">
                      לא נמצאו תוצאות עבור "{omnibarQuery}"
                    </div>
                  );
                }

                // Group results by category
                const categories = {};
                results.forEach((item) => {
                  if (!categories[item.category]) {
                    categories[item.category] = [];
                  }
                  categories[item.category].push(item);
                });

                return Object.keys(categories).map((categoryName) => (
                  <div key={categoryName}>
                    <div className="omnibar-category-title">{categoryName}</div>
                    {categories[categoryName].map((item) => {
                      const itemFlatIndex = results.findIndex(r => r.id === item.id);
                      const isActive = itemFlatIndex === omnibarSelectedIndex;
                      
                      // Resolve Icon
                      let icon = <FiSearch />;
                      if (item.type === 'command') {
                        if (item.id.includes('dashboard')) icon = <FiHome />;
                        else if (item.id.includes('settings')) icon = <FiSettings />;
                        else if (item.id.includes('new_order')) icon = <FiPlusCircle />;
                        else icon = <FiList />;
                      } else if (item.type === 'customer') {
                        icon = <FiUser />;
                      } else if (item.type === 'order') {
                        icon = <FiList />;
                      }

                      return (
                        <div
                          key={item.id}
                          className={`omnibar-item ${isActive ? 'active' : ''}`}
                          onClick={() => item.action()}
                          onMouseEnter={() => setOmnibarSelectedIndex(itemFlatIndex)}
                        >
                          <div className="omnibar-item-content">
                            <span className="omnibar-item-icon">{icon}</span>
                            <div className="omnibar-item-text">
                              <span className="omnibar-item-title">{item.title}</span>
                              <span className="omnibar-item-subtitle">{item.subtitle}</span>
                            </div>
                          </div>
                          <span className="omnibar-item-badge">
                            {item.type === 'command' ? 'פעולה' : item.type === 'customer' ? 'לקוח' : 'הזמנה'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>

            <div className="omnibar-footer">
              <div className="omnibar-shortcuts">
                <span>ביטול <span className="omnibar-key">Esc</span></span>
              </div>
              <div>
                <span>ניווט <span className="omnibar-key">↑↓</span></span>
                <span style={{marginRight: '12px'}}>בחירה <span className="omnibar-key">Enter</span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. EDIT TEAM MEMBER MODAL OVERLAY */}
      {editingMember && (
        <div className="omnibar-backdrop" onClick={() => setEditingMember(null)}>
          <div className="omnibar-modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px', padding: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px'}}>
              <h3 className="headline-sm" style={{margin: 0, color: '#ffffff'}}>עריכת פרטי עובד: {editingMember.name}</h3>
              <button className="btn btn-secondary" style={{padding: '4px 10px'}} onClick={() => setEditingMember(null)}>סגור</button>
            </div>
            
            <form onSubmit={handleUpdateTeamMember} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div className="form-group">
                <label className="form-label">שם מלא *</label>
                <input 
                  type="text" 
                  required
                  className="form-input" 
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div className="form-group">
                  <label className="form-label">מספר עובד *</label>
                  <input 
                    type="text" 
                    required
                    className="form-input" 
                    value={editingMember.employeeNumber || ''}
                    onChange={(e) => setEditingMember({...editingMember, employeeNumber: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">תאריך לידה *</label>
                  <input 
                    type="date" 
                    required
                    className="form-input" 
                    value={editingMember.birthdate || ''}
                    onChange={(e) => setEditingMember({...editingMember, birthdate: e.target.value})}
                  />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div className="form-group">
                  <label className="form-label">מספר טלפון *</label>
                  <input 
                    type="text" 
                    required
                    className="form-input" 
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">תפקיד</label>
                  <select 
                    className="form-select"
                    value={editingMember.role || 'employee'}
                    onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                    disabled={editingMember.id === currentUser.id}
                  >
                    <option value="employee">אחראי משמרת</option>
                    <option value="salesperson">מוכרן</option>
                    <option value="manager">מנהל סניף</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">כתובת אימייל *</label>
                <input 
                  type="email" 
                  required
                  className="form-input" 
                  value={editingMember.email || ''}
                  onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                />
              </div>

              <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px'}}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingMember(null)}>
                  ביטול
                </button>
                <button type="submit" className="btn btn-primary">
                  שמור שינויים
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL — root level, renders from any screen */}
      {editingCustomer && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }} onClick={(e) => { if (e.target === e.currentTarget) setEditingCustomer(null); }}>
          <div className="card" style={{width: '100%', maxWidth: '520px', margin: '16px', padding: '28px'}}>
            <div className="card-header" style={{marginBottom: '20px'}}>
              <h3 className="headline-sm">עריכת פרטי לקוח</h3>
              <button onClick={() => setEditingCustomer(null)} className="btn btn-secondary" style={{padding: '4px 12px'}}>סגור</button>
            </div>
            <form onSubmit={handleUpdateCustomer} style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px'}}>
                <div className="form-group">
                  <label className="form-label">שם מלא *</label>
                  <input type="text" required className="form-input"
                    value={editingCustomer.name}
                    onChange={e => setEditingCustomer({...editingCustomer, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">תעודת זהות</label>
                  <input type="text" className="form-input" maxLength={9} placeholder="123456789"
                    value={editingCustomer.idNumber}
                    onChange={e => setEditingCustomer({...editingCustomer, idNumber: e.target.value.replace(/\D/g,'')})}
                  />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px'}}>
                <div className="form-group">
                  <label className="form-label">טלפון</label>
                  <input type="tel" className="form-input"
                    value={editingCustomer.phone}
                    onChange={e => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">אימייל</label>
                  <input type="email" className="form-input"
                    value={editingCustomer.email}
                    onChange={e => setEditingCustomer({...editingCustomer, email: e.target.value})}
                  />
                </div>
              </div>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px'}}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCustomer(null)}>בטל</button>
                <button type="submit" className="btn btn-primary">שמור שינויים</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
