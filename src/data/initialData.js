// Initial tickets data — devices currently in the shop
export const initialTickets = [
  {
    id: 'REP-1001',
    macmiil: 'Jaamac Cilmi',
    tel: '061555123',
    nooc: 'Laptop',
    model: 'Dell Latitude',
    cilaad: 'Shaashadda baa madow',
    qiimo: '25',
    taariikh: '2026-07-12',
    xaalad: 'Gacantaa lagu hayaa'
  },
  {
    id: 'REP-1003',
    macmiil: 'Nimco Ahmed',
    tel: '061555789',
    nooc: 'Printer',
    model: 'Canon MF3010',
    cilaad: 'Khadka waraaqaha wuu xumaaday',
    qiimo: '18',
    taariikh: '2026-07-13',
    xaalad: 'Baadhitaan'
  }
];

// Initial archive data — devices that have been returned to customers
export const initialArchive = [
  {
    id: 'REP-1002',
    macmiil: 'Xaliimo Cali',
    tel: '061555456',
    nooc: 'Printer',
    model: 'HP LaserJet',
    cilaad: 'Khadka ayaa ka dsilan',
    qiimo: '15',
    taariikh: '2026-07-14',
    xaalad: 'Waa Diyaar'
  }
];

// Status options for repair tickets
export const statusOptions = [
  { value: 'Baadhitaan', label: '🔴 Baadhitaan' },
  { value: 'Gacantaa lagu hayaa', label: '🟡 Gacantaa' },
  { value: 'Waa Diyaar', label: '🟢 Diyaar' }
];

// Device type options
export const deviceTypes = [
  { value: 'Laptop', label: '💻 Laptop' },
  { value: 'Printer', label: '🖨️ Printer' },
  { value: 'All-in-One', label: '📦 All-in-One' }
];
