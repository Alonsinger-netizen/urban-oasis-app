import React, { useState, useEffect, useRef, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import * as Icons from 'lucide-react'
import './index.css'

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const TOTAL_ROOMS = 40;
const OCC = { occupied:29, available:9, maintenance:2, checkIns:5, checkOuts:3 };

const CHECKINS = [
  { id:1, guest:'David Levi',    room:'204', floor:2, time:'14:00', nights:3, type:'Deluxe',   status:'confirmed',
    phone:'+972 50 123 4567', email:'david.levi@gmail.com',       nat:'🇮🇱 Israeli',
    checkIn:'May 5, 2026', checkOut:'May 8, 2026',  total:'₪ 1,260', loyalty:'Gold',
    requests:['Extra pillows','No smoking room','High floor preferred'] },
  { id:2, guest:'Sarah Cohen',   room:'315', floor:3, time:'15:30', nights:2, type:'Suite',    status:'vip',
    phone:'+972 54 987 6543', email:'sarah.c@business.co.il',    nat:'🇮🇱 Israeli',
    checkIn:'May 5, 2026', checkOut:'May 7, 2026',  total:'₪ 3,200', loyalty:'Platinum',
    requests:['Champagne on arrival','Pool towels','Airport transfer'] },
  { id:3, guest:'Mark Williams', room:'108', floor:1, time:'16:00', nights:5, type:'Standard', status:'confirmed',
    phone:'+1 310 555 0199',  email:'mark.w@gmail.com',           nat:'🇺🇸 American',
    checkIn:'May 5, 2026', checkOut:'May 10, 2026', total:'₪ 2,100', loyalty:'Silver',
    requests:['Twin beds','Daily newspaper'] },
  { id:4, guest:'Aisha Patel',   room:'412', floor:4, time:'17:00', nights:1, type:'Deluxe',   status:'confirmed',
    phone:'+44 20 7946 0432', email:'aisha.patel@outlook.com',   nat:'🇬🇧 British',
    checkIn:'May 5, 2026', checkOut:'May 6, 2026',  total:'₪ 420',   loyalty:'Bronze',
    requests:['Vegetarian breakfast','Quiet room'] },
  { id:5, guest:'Tom Eriksson',  room:'301', floor:3, time:'18:30', nights:4, type:'Suite',    status:'late',
    phone:'+46 70 123 4567',  email:'tom.e@nordmail.se',          nat:'🇸🇪 Swedish',
    checkIn:'May 5, 2026', checkOut:'May 9, 2026',  total:'₪ 5,600', loyalty:'Gold',
    requests:['Late check-in','Business desk setup','Extra hangers'] },
];


/* ═══════════════════════════════════════════════
   MIGRATED INVENTORY & STAFF PAGES
═══════════════════════════════════════════════ */
const WEEK_DAYS = [
  { key:'Sun', label:'Sun', date:3,  iso:'2026-05-03', today:false },
  { key:'Mon', label:'Mon', date:4,  iso:'2026-05-04', today:false },
  { key:'Tue', label:'Tue', date:5,  iso:'2026-05-05', today:false },
  { key:'Wed', label:'Wed', date:6,  iso:'2026-05-06', today:true  },
  { key:'Thu', label:'Thu', date:7,  iso:'2026-05-07', today:false },
  { key:'Fri', label:'Fri', date:8,  iso:'2026-05-08', today:false },
  { key:'Sat', label:'Sat', date:9,  iso:'2026-05-09', today:false },
];

const WEEK_STAFF = [
  { name:'Maya Goldberg', dept:'Reception', role:'Front Desk Mgr', av:'MG', Sun:null, Mon:[7,15], Tue:[7,15], Wed:[7,15], Thu:[7,15], Fri:[7,15], Sat:null },
  { name:'Elan Friedman', dept:'Reception', role:'Receptionist', av:'EF', Sun:null, Mon:[7,15], Tue:null, Wed:[7,15], Thu:null, Fri:[7,15], Sat:[7,15] },
  { name:'Tali Rosen', dept:'Reception', role:'Receptionist', av:'TR', Sun:[15,23], Mon:null, Tue:[15,23], Wed:[15,23], Thu:[15,23], Fri:null, Sat:[15,23] },
  { name:'Ana Popescu', dept:'Housekeeping', role:'Head Housekeeper', av:'AP', Sun:null, Mon:[8,16], Tue:[8,16], Wed:[8,16], Thu:[8,16], Fri:[8,16], Sat:null },
  { name:'Daria Kovac', dept:'Housekeeping', role:'Housekeeper', av:'DK', Sun:null, Mon:[8,16], Tue:[8,16], Wed:null, Thu:[8,16], Fri:[8,16], Sat:[8,16] },
  { name:'Miriam Osei', dept:'Housekeeping', role:'Housekeeper', av:'MO', Sun:null, Mon:[10,18], Tue:[10,18], Wed:[10,18], Thu:null, Fri:[10,18], Sat:[10,18] },
  { name:'Leila Nazari', dept:'Housekeeping', role:'Housekeeper', av:'LN', Sun:[12,20], Mon:null, Tue:null, Wed:[12,20], Thu:[12,20], Fri:[12,20], Sat:[12,20] },
  { name:'Roi Shemesh', dept:'Pool', role:'Pool Supervisor', av:'RS', Sun:null, Mon:[7,15], Tue:[7,15], Wed:[7,15], Thu:[7,15], Fri:[7,15], Sat:[7,15] },
  { name:'Noa Bar', dept:'Pool', role:'Lifeguard', av:'NB', Sun:[7,15], Mon:[7,15], Tue:[7,15], Wed:null, Thu:[7,15], Fri:[7,15], Sat:[7,15] },
  { name:'Yossi Adler', dept:'Maintenance', role:'Chief Engineer', av:'YA', Sun:null, Mon:[8,16], Tue:[8,16], Wed:[8,16], Thu:[8,16], Fri:[8,16], Sat:null },
  { name:'Sami Haddad', dept:'Maintenance', role:'Technician', av:'SH', Sun:null, Mon:[8,16], Tue:[8,16], Wed:null, Thu:[8,16], Fri:[8,16], Sat:[8,16] },
];

const STAFF_DEPT_CFG = {
  Reception:    { icon:'concierge-bell', dot:'bg-violet-400', bg:'#F5F3FF', bd:'#DDD6FE', tc:'#5B21B6', textCls:'text-violet-700', sepBg:'#FAFAFF', avCls:'bg-violet-600' },
  Housekeeping: { icon:'sparkles', dot:'bg-sky-400', bg:'#F0F9FF', bd:'#BAE6FD', tc:'#0369A1', textCls:'text-sky-700', sepBg:'#F7FBFF', avCls:'bg-sky-600' },
  Pool:         { icon:'waves', dot:'bg-cyan-400', bg:'#ECFEFF', bd:'#A5F3FC', tc:'#0E7490', textCls:'text-cyan-700', sepBg:'#F5FEFF', avCls:'bg-cyan-600' },
  Maintenance:  { icon:'wrench', dot:'bg-amber-400', bg:'#FFFBEB', bd:'#FDE68A', tc:'#92400E', textCls:'text-amber-700', sepBg:'#FFFEF5', avCls:'bg-amber-600' },
};
const STAFF_DEPTS = ['All', 'Reception', 'Housekeeping', 'Pool', 'Maintenance'];

const INVENTORY_DEPT_CFG = {
  'Front Desk':   { icon:'concierge-bell', avCls:'bg-violet-600', sepBg:'#F8F5F0' },
  'Housekeeping': { icon:'sparkles', avCls:'bg-sky-600', sepBg:'#F8F5F0' },
  'Maintenance':  { icon:'wrench', avCls:'bg-amber-600', sepBg:'#F8F5F0' },
};

const INVENTORY_STATUS_CFG = {
  ok:  { label:'In Stock', bg:'#EDF3EE', bd:'#AECFB2', tc:'#314E37', dotCls:'bg-teal-500', bar:'#4E7854' },
  low: { label:'Low Stock', bg:'#F5F0E8', bd:'#D2BF90', tc:'#664A1E', dotCls:'bg-amber-400', bar:'#A88440' },
  out: { label:'Out of Stock', bg:'#F4ECEB', bd:'#C09090', tc:'#7A3030', dotCls:'bg-red-400', bar:'#A87070' },
};

const INVENTORY_SEED = {
  'Front Desk': [
    { id:'fd-1', name:'Key Cards', icon:'credit-card', qty:47, max:100, unit:'cards' },
    { id:'fd-2', name:'Stationery Sets', icon:'pen-line', qty:12, max:50, unit:'sets' },
    { id:'fd-3', name:'Welcome Kits', icon:'gift', qty:23, max:60, unit:'kits' },
    { id:'fd-4', name:'Luggage Tags', icon:'tag', qty:4, max:80, unit:'pcs' },
    { id:'fd-5', name:'Parking Permits', icon:'square-parking', qty:8, max:30, unit:'passes' },
  ],
  'Housekeeping': [
    { id:'hk-1', name:'Shampoo', icon:'droplets', qty:84, max:200, unit:'btls' },
    { id:'hk-2', name:'Bath Towels', icon:'layers', qty:62, max:120, unit:'pcs' },
    { id:'hk-3', name:'Coffee Kits', icon:'coffee', qty:18, max:80, unit:'kits' },
    { id:'hk-4', name:'Shower Caps', icon:'circle-user', qty:0, max:100, unit:'pcs' },
    { id:'hk-5', name:'Hand Towels', icon:'layers', qty:15, max:120, unit:'pcs' },
  ],
  'Maintenance': [
    { id:'mt-1', name:'LED Bulbs', icon:'lightbulb', qty:18, max:50, unit:'pcs' },
    { id:'mt-2', name:'AA Batteries', icon:'battery', qty:6, max:60, unit:'pcs' },
    { id:'mt-3', name:'Extension Cords', icon:'plug', qty:0, max:12, unit:'pcs' },
    { id:'mt-4', name:'Door Lock Sets', icon:'lock', qty:7, max:15, unit:'units' },
  ],
};

const LOAN_STOCK = [
  { id:'ls-1', name:'USB-C Charger', icon:'cable', total:8 },
  { id:'ls-2', name:'Universal Adapter', icon:'globe', total:6 },
  { id:'ls-3', name:'Iron & Board', icon:'zap', total:4 },
  { id:'ls-4', name:'Hairdryer', icon:'wind', total:6 },
];

const INITIAL_LOANS = [
  { id:'ln-1', item:'USB-C Charger', room:'204', guest:'David Levi', time:'09:30', returned:false },
  { id:'ln-2', item:'Universal Adapter', room:'315', guest:'Sarah Cohen', time:'11:00', returned:false },
  { id:'ln-3', item:'Iron & Board', room:'108', guest:'Mark Williams', time:'14:20', returned:false },
  { id:'ln-4', item:'Hairdryer', room:'209', guest:'Marco Rossi', time:'16:00', returned:false },
];

const INVENTORY_TABS = ['All', 'Front Desk', 'Housekeeping', 'Maintenance', 'Guest Loans'];
let _inventoryToastId = 0;
let _staffToastId = 0;

function getInvStatus(qty, max) {
  if (qty === 0) return 'out';
  if (qty / max < 0.25) return 'low';
  return 'ok';
}

function fmtShift([s, e]) { return `${String(s).padStart(2,'0')}:00 – ${String(e).padStart(2,'0')}:00`; }
function fmtISO(isoDate, hour) { return `${isoDate}T${String(hour).padStart(2,'0')}:00:00`; }
function shiftLabel(h) { return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'; }
function makeEventId(name, day) { return `evt-${name.replace(/\s+/g,'-').toLowerCase()}-${day.toLowerCase()}`; }

function initEventIds() {
  const ids = {};
  WEEK_STAFF.forEach(person => {
    WEEK_DAYS.forEach(d => {
      if (person[d.key] !== null) ids[`${person.name}||${d.key}`] = makeEventId(person.name, d.key);
    });
  });
  return ids;
}

function OpsToastBar({ toasts, onDismiss, onRetry }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          <div className="toast-icon">
            {t.type === 'success' && <Icon name="check-circle" size={17} cls="text-teal-600" />}
            {t.type === 'cached'  && <Icon name="cloud-off" size={17} cls="text-amber-500" />}
            {t.type === 'warn'    && <Icon name="send" size={17} cls="text-amber-500" />}
            {t.type === 'error'   && <Icon name="alert-circle" size={17} cls="text-red-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-slate-800 leading-tight">{t.title}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{t.msg}</p>
          </div>
          {t.type === 'cached' && onRetry && (
            <button onClick={() => onRetry(t.id)} className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 shrink-0 px-2">Retry</button>
          )}
          <button onClick={() => onDismiss(t.id)} className="text-slate-300 hover:text-slate-500 shrink-0 ml-1">
            <Icon name="x" size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

function InventoryStatusBadge({ status }) {
  const c = INVENTORY_STATUS_CFG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap"
      style={{background:c.bg, borderColor:c.bd, color:c.tc}}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dotCls} shrink-0`} />
      {c.label}
    </span>
  );
}

function NewLoanModal({ onSave, onClose }) {
  const [item, setItem] = useState('');
  const [room, setRoom] = useState('');
  const [guest, setGuest] = useState('');
  const canSave = item && room.trim() && guest.trim();

  return (
    <div className="modal-bg fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box w-full max-w-sm anim-pop">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Icon name="hand-heart" size={16} cls="[&_svg]:stroke-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Lend Item</p>
              <p className="text-[11px] text-slate-400">Log an item lent to a guest</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-outline w-8 h-8 rounded-lg flex items-center justify-center">
            <Icon name="x" size={14} cls="text-slate-400" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Item</label>
            <div className="relative">
              <select className="modal-input pr-8 cursor-pointer" style={{appearance:'none'}} value={item} onChange={e => setItem(e.target.value)}>
                <option value="">Select item…</option>
                {LOAN_STOCK.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="chevron-down" size={14} /></span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Room #</label>
              <input className="modal-input" placeholder="e.g. 204" value={room} onChange={e => setRoom(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Guest Name</label>
              <input className="modal-input" placeholder="Full name" value={guest} onChange={e => setGuest(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-outline px-5 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
          <button onClick={() => canSave && onSave({item, room:room.trim(), guest:guest.trim()})}
            disabled={!canSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium ${canSave ? 'btn-teal' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
            <Icon name="plus" size={14} cls={canSave ? '[&_svg]:stroke-white' : 'text-slate-400'} />
            Log Loan
          </button>
        </div>
      </div>
    </div>
  );
}

function InventoryPage() {
  const [tab, setTab] = useState('All');
  const [items, setItems] = useState(() => {
    const m = {};
    Object.values(INVENTORY_SEED).flat().forEach(i => { m[i.id] = {...i}; });
    return m;
  });
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [loanModal, setLoanModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const pushToast = (type, title, msg) => {
    const id = ++_inventoryToastId;
    setToasts(p => [...p, {id, type, title, msg}]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 5000);
  };
  const dismissToast = id => setToasts(p => p.filter(t => t.id !== id));

  const adjustQty = (id, delta) => {
    setItems(prev => {
      const item = prev[id];
      const next = Math.max(0, Math.min(item.max, item.qty + delta));
      const wasOk = getInvStatus(item.qty, item.max) === 'ok';
      const nowOut = next === 0;
      const nowLow = !nowOut && next / item.max < 0.25;
      if (wasOk && nowLow) pushToast('warn', 'Low Stock', `${item.name} is running low (${next} left).`);
      if (wasOk && nowOut) pushToast('warn', 'Out of Stock', `${item.name} is now out of stock.`);
      return { ...prev, [id]: { ...item, qty: next } };
    });
  };

  const markReturned = loanId => {
    const loan = loans.find(l => l.id === loanId);
    setLoans(prev => prev.map(l => l.id === loanId ? {...l, returned:true} : l));
    pushToast('success', 'Item Returned', `${loan?.item} returned by ${loan?.guest?.split(' ')[0]} (Rm ${loan?.room})`);
  };

  const addLoan = ({item, room, guest}) => {
    setLoans(prev => [...prev, {id:`ln-${Date.now()}`, item, room, guest, time:now(), returned:false}]);
    setLoanModal(false);
    pushToast('success', 'Loan Logged', `${item} issued to ${guest.split(' ')[0]} (Rm ${room})`);
  };

  const flatItems = Object.values(items);
  const lowCount = flatItems.filter(i => getInvStatus(i.qty, i.max) === 'low').length;
  const outCount = flatItems.filter(i => i.qty === 0).length;
  const activeLoans = loans.filter(l => !l.returned).length;
  const depts = tab === 'All' ? ['Front Desk','Housekeeping','Maintenance'] : tab === 'Guest Loans' ? [] : [tab];

  const loanAvail = name => {
    const stock = LOAN_STOCK.find(s => s.name === name);
    const out = loans.filter(l => l.item === name && !l.returned).length;
    return { total:stock?.total || 0, out, available:(stock?.total || 0) - out };
  };

  return (
    <div className="p-6">
      <PageHeader icon="package" title="Operational Inventory" sub="Real-time stock · Shift manager view" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label:'Items Tracked', value:flatItems.length, icon:'package', cls:'text-slate-600' },
          { label:'Low Stock', value:lowCount, icon:'alert-triangle', cls:'text-amber-500' },
          { label:'Out of Stock', value:outCount, icon:'x-circle', cls:'text-red-500' },
          { label:'Active Loans', value:activeLoans, icon:'hand-heart', cls:'text-teal-600' },
        ].map((s, i) => (
          <div key={i} className="card stat-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
              <Icon name={s.icon} size={18} cls={s.cls} />
            </div>
            <div>
              <p className="text-[22px] font-bold text-slate-800 leading-none tabular-nums" style={{letterSpacing:'-.03em'}}>{s.value}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 p-1 bg-white border border-slate-100 rounded-xl w-fit mb-6 shadow-sm overflow-x-auto max-w-full">
        {INVENTORY_TABS.map(d => (
          <button key={d} onClick={() => setTab(d)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === d ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
            {d}
          </button>
        ))}
      </div>

      {depts.map(deptName => {
        const cfg = INVENTORY_DEPT_CFG[deptName];
        const deptItems = Object.values(INVENTORY_SEED[deptName]).map(i => items[i.id] || i);
        const alerts = deptItems.filter(i => getInvStatus(i.qty, i.max) !== 'ok').length;
        return (
          <div key={deptName} className="card mb-5">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50" style={{background:cfg.sepBg}}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${cfg.avCls} flex items-center justify-center shrink-0`}>
                  <Icon name={cfg.icon} size={16} cls="[&_svg]:stroke-white" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-700">{deptName}</p>
                  <p className="text-[11px] text-slate-400">{deptItems.length} items
                    {alerts > 0 && <span className="ml-1.5 text-amber-500 font-semibold">· {alerts} alert{alerts !== 1 ? 's' : ''}</span>}
                  </p>
                </div>
              </div>
              <button onClick={() => pushToast('warn', 'Refill Requested', `Procurement alert sent for ${deptName}.`)}
                className="btn-outline flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium">
                <Icon name="send" size={13} cls="text-slate-400" />
                Request Refill
              </button>
            </div>

            {deptItems.map(item => {
              const status = getInvStatus(item.qty, item.max);
              const sCfg = INVENTORY_STATUS_CFG[status];
              const pct = Math.round((item.qty / item.max) * 100);
              return (
                <div key={item.id} className="inv-row">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg ${cfg.avCls} flex items-center justify-center shrink-0`}>
                      <Icon name={item.icon} size={14} cls="[&_svg]:stroke-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-700 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.qty} / {item.max} {item.unit}</p>
                    </div>
                  </div>
                  <div className="inv-bar">
                    <div className="inv-bar-fill" style={{width:`${pct}%`, background:sCfg.bar}} />
                  </div>
                  <div className="flex items-center justify-end gap-2.5">
                    <InventoryStatusBadge status={status} />
                    <div className="flex items-center gap-1.5 ml-2">
                      <button className="qty-btn" onClick={() => adjustQty(item.id, -1)} disabled={item.qty === 0}><Icon name="minus" size={11} /></button>
                      <span className="text-[14px] font-bold text-slate-800 w-8 text-center tabular-nums">{item.qty}</span>
                      <button className="qty-btn" onClick={() => adjustQty(item.id, +1)} disabled={item.qty === item.max}><Icon name="plus" size={11} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {(tab === 'All' || tab === 'Guest Loans') && (
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50" style={{background:'#F8F5F0'}}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
                <Icon name="hand-heart" size={16} cls="[&_svg]:stroke-white" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700">Guest Loans</p>
                <p className="text-[11px] text-slate-400">{activeLoans} active · {loans.filter(l => l.returned).length} returned today</p>
              </div>
            </div>
            <button onClick={() => setLoanModal(true)} className="btn-dark flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium">
              <Icon name="plus" size={13} cls="[&_svg]:stroke-white" />
              Lend Item
            </button>
          </div>

          <div className="px-5 py-4 border-b border-slate-50">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Item Availability</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {LOAN_STOCK.map(s => {
                const { total, available } = loanAvail(s.name);
                const allOut = available === 0;
                return (
                  <div key={s.id} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${allOut ? 'bg-red-100' : 'bg-teal-50'}`}>
                      <Icon name={s.icon} size={14} cls={allOut ? 'text-red-400' : 'text-teal-600'} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-700 truncate">{s.name}</p>
                      <p className={`text-[10px] font-medium ${allOut ? 'text-red-500' : 'text-slate-400'}`}>{available}/{total} available</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="loan-hdr">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Item</p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Room</p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Guest</p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Since</p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Action</p>
          </div>
          {loans.map(loan => (
            <div key={loan.id} className={`loan-row ${loan.returned ? 'returned' : ''}`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${loan.returned ? 'bg-slate-100' : 'bg-teal-50'}`}>
                  <Icon name={LOAN_STOCK.find(s => s.name === loan.item)?.icon || 'package'} size={12} cls={loan.returned ? 'text-slate-400' : 'text-teal-600'} />
                </div>
                <p className="text-[12px] font-medium text-slate-700 truncate">{loan.item}</p>
              </div>
              <p className="text-[12px] font-semibold text-slate-700">Rm {loan.room}</p>
              <p className="text-[12px] text-slate-600 truncate">{loan.guest}</p>
              <p className="text-[11px] text-slate-400 tabular-nums">{loan.time}</p>
              <div>
                {loan.returned ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-100 text-[11px] font-semibold text-teal-700">
                    <Icon name="check" size={11} cls="text-teal-500" /> Returned
                  </span>
                ) : (
                  <button onClick={() => markReturned(loan.id)} className="btn-teal flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold">
                    <Icon name="check" size={11} cls="[&_svg]:stroke-white" />
                    Mark Returned
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {loanModal && <NewLoanModal onSave={addLoan} onClose={() => setLoanModal(false)} />}
      <OpsToastBar toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function AddShiftModal({ staffShifts, onSave, onClose }) {
  const [staff, setStaff] = useState('');
  const [days, setDays] = useState([]);
  const [startHr, setStartHr] = useState('7');
  const [endHr, setEndHr] = useState('15');
  const [phase, setPhase] = useState('form');
  const [timeErr, setTimeErr] = useState('');
  const deptGroups = ['Reception','Housekeeping','Pool','Maintenance'];
  const hrs = Array.from({length:24}, (_, i) => i);

  const toggleDay = d => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const conflicts = staff ? days.filter(d => staffShifts.find(s => s.name === staff)?.[d] !== null) : [];
  const canSave = staff && days.length > 0 && !timeErr;

  const validateTime = (s, e) => setTimeErr(parseInt(e) <= parseInt(s) ? 'End time must be after start time. Please use HH:MM format.' : '');
  const handleStartChange = v => { setStartHr(v); validateTime(v, endHr); };
  const handleEndChange = v => { setEndHr(v); validateTime(startHr, v); };

  const handleSave = () => {
    if (!canSave) return;
    const s = parseInt(startHr);
    const e = parseInt(endHr);
    if (e <= s) { setTimeErr('End time must be after start time. Please use HH:MM format.'); return; }
    const payload = days.map(d => {
      const dayInfo = WEEK_DAYS.find(x => x.key === d);
      return { summary:`${staff} - Shift`, start:fmtISO(dayInfo.iso, s), end:fmtISO(dayInfo.iso, e), duration:`${e - s}h`, calendarId:'Staff Schedule' };
    });
    console.log('[Calendar API] generic_calendar.create_event payload:', payload);
    setPhase('syncing');
    setTimeout(() => {
      setPhase('done');
      onSave({ staff, days, startHr:s, endHr:e, success:Math.random() > 0.2, payload });
    }, 1400);
  };

  if (phase === 'syncing') {
    return (
      <div className="modal-bg fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="modal-box w-full max-w-xs px-8 py-10 flex flex-col items-center gap-4 anim-pop">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
            <Icon name="calendar-clock" size={26} cls="text-teal-600" />
          </div>
          <p className="text-[13px] font-semibold text-slate-700">Syncing to Calendar…</p>
          <div className="flex gap-1.5 items-center">
            <span className="w-2 h-2 rounded-full bg-teal-400 dot1"></span>
            <span className="w-2 h-2 rounded-full bg-teal-400 dot2"></span>
            <span className="w-2 h-2 rounded-full bg-teal-400 dot3"></span>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Calling <code className="text-slate-600 font-medium">generic_calendar.create_event</code><br/>
            Calendar ID: <span className="text-teal-700 font-medium">Staff Schedule</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-bg fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box w-full max-w-md anim-pop">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Icon name="calendar-plus" size={16} cls="[&_svg]:stroke-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Add Shift</p>
              <p className="text-[11px] text-slate-400">May 3 – 9, 2026 · Staff Schedule</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-outline w-8 h-8 rounded-lg flex items-center justify-center">
            <Icon name="x" size={14} cls="text-slate-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Team Member</label>
            <div className="relative">
              <select className="modal-select pr-8" value={staff} onChange={e => { setStaff(e.target.value); setDays([]); }}>
                <option value="">Select staff member…</option>
                {deptGroups.map(g => (
                  <optgroup key={g} label={g}>
                    {WEEK_STAFF.filter(s => s.dept === g).map(s => <option key={s.name} value={s.name}>{s.name} — {s.role}</option>)}
                  </optgroup>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="chevron-down" size={14} /></span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Days</label>
            <div className="flex gap-1.5 flex-wrap">
              {WEEK_DAYS.map(d => {
                const selected = days.includes(d.key);
                const isConflict = staff && staffShifts.find(x => x.name === staff)?.[d.key] !== null;
                return (
                  <button key={d.key} onClick={() => toggleDay(d.key)}
                    className={`flex flex-col items-center px-3 py-2 rounded-xl border text-[11px] font-semibold transition-all relative
                      ${selected
                        ? isConflict ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-900 text-white border-slate-900'
                        : isConflict ? 'bg-white text-amber-500 border-amber-200 hover:border-amber-300' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'}`}>
                    <span>{d.label}</span>
                    <span className={`text-[10px] font-normal mt-0.5 ${selected ? (isConflict ? 'text-amber-400' : 'text-slate-400') : 'text-slate-300'}`}>{d.date}</span>
                    {isConflict && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border border-white"></span>}
                  </button>
                );
              })}
            </div>
            {conflicts.length > 0 && (
              <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-3.5 py-3">
                <Icon name="alert-triangle" size={14} cls="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-700 leading-snug">
                  <strong>{staff.split(' ')[0]}</strong> already has a shift on {conflicts.join(', ')}. Saving will overwrite it.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Start Time</label>
              <div className="relative">
                <select className="modal-select pr-8" value={startHr} onChange={e => handleStartChange(e.target.value)}>
                  {hrs.map(h => <option key={h} value={h}>{String(h).padStart(2,'0')}:00</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="chevron-down" size={14} /></span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">End Time</label>
              <div className="relative">
                <select className="modal-select pr-8" value={endHr} onChange={e => handleEndChange(e.target.value)}>
                  {hrs.map(h => <option key={h} value={h}>{String(h).padStart(2,'0')}:00</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="chevron-down" size={14} /></span>
              </div>
            </div>
          </div>

          {timeErr && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3.5 py-3">
              <Icon name="alert-circle" size={14} cls="text-red-500 shrink-0" />
              <p className="text-[11px] text-red-600">{timeErr}</p>
            </div>
          )}

          {staff && days.length > 0 && !timeErr && (
            <div className="rounded-xl bg-teal-50 border border-teal-100 px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="calendar-check" size={13} cls="text-teal-600" />
                <p className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">Calendar Event Preview</p>
              </div>
              <div className="space-y-1">
                <p className="text-[12px] font-semibold text-teal-900">{staff} · {WEEK_STAFF.find(s => s.name === staff)?.role}</p>
                <p className="text-[11px] text-teal-700">{days.join(', ')} · {String(startHr).padStart(2,'0')}:00 – {String(endHr).padStart(2,'0')}:00</p>
                <p className="text-[10px] text-teal-600 font-medium">Summary: "{staff} · {shiftLabel(parseInt(startHr))} Shift"</p>
                <p className="text-[10px] text-teal-500 font-mono">
                  {fmtISO(WEEK_DAYS.find(d => d.key === days[0])?.iso || '2026-05-03', parseInt(startHr))}
                  {days.length > 1 ? ` + ${days.length - 1} more` : ''}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-outline px-5 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
          <button onClick={handleSave} disabled={!canSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium ${canSave ? 'btn-teal' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
            <Icon name="calendar-plus" size={14} cls={canSave ? '[&_svg]:stroke-white' : 'text-slate-400'} />
            Save to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

function StaffPage() {
  const [dept, setDept] = useState('All');
  const [addShift, setAddShift] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [staffShifts, setStaffShifts] = useState(() => WEEK_STAFF.map(s => ({...s})));
  const [confirmed, setConfirmed] = useState(new Set());
  const [eventIds, setEventIds] = useState(initEventIds);
  const [deletingCells, setDeletingCells] = useState(new Set());

  const pushToast = (type, title, msg) => {
    const id = ++_staffToastId;
    setToasts(prev => [...prev, {id, type, title, msg}]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  const dismissToast = id => setToasts(prev => prev.filter(t => t.id !== id));
  const retryToast = id => { dismissToast(id); pushToast('success', 'Sync successful', 'Calendar re-sync completed.'); };

  const handleShiftSave = ({ staff, days, startHr, endHr, success }) => {
    setStaffShifts(prev => prev.map(s => s.name === staff ? { ...s, ...Object.fromEntries(days.map(d => [d, [startHr, endHr]])) } : s));
    setConfirmed(prev => { const n = new Set(prev); days.forEach(d => n.add(`${staff}||${d}`)); return n; });
    setEventIds(prev => {
      const n = {...prev};
      days.forEach(d => { n[`${staff}||${d}`] = makeEventId(staff, d); });
      return n;
    });
    setAddShift(false);
    if (success) {
      pushToast('success', 'Shift saved', `${staff.split(' ')[0]} · ${days.join(', ')} · ${String(startHr).padStart(2,'0')}:00–${String(endHr).padStart(2,'0')}:00 → Calendar`);
    } else {
      pushToast('cached', 'Calendar unreachable', 'Shift cached locally. Tap Retry to re-sync.');
    }
  };

  const handleRemoveShift = (name, dayKey) => {
    const cellKey = `${name}||${dayKey}`;
    const eventId = eventIds[cellKey] || makeEventId(name, dayKey);
    console.log('[Calendar API] generic_calendar.delete_event:', { eventId, calendarId:'Staff Schedule' });
    setDeletingCells(prev => new Set([...prev, cellKey]));

    setTimeout(() => {
      setStaffShifts(prev => prev.map(s => s.name === name ? { ...s, [dayKey]:null } : s));
      setConfirmed(prev => { const n = new Set(prev); n.delete(cellKey); return n; });
      setEventIds(prev => { const n = {...prev}; delete n[cellKey]; return n; });
      setDeletingCells(prev => { const n = new Set(prev); n.delete(cellKey); return n; });
      pushToast('success', 'Shift removed', `${name.split(' ')[0]} · ${dayKey} removed from calendar`);
    }, 850);
  };

  const filtered = dept === 'All' ? staffShifts : staffShifts.filter(s => s.dept === dept);
  const groups = ['Reception','Housekeeping','Pool','Maintenance']
    .map(d => ({ dept:d, staff:filtered.filter(s => s.dept === d) }))
    .filter(g => g.staff.length > 0);
  const dayCount = k => filtered.filter(s => s[k] !== null).length;
  const totalShifts = staffShifts.reduce((acc, s) => acc + WEEK_DAYS.filter(d => s[d.key] !== null).length, 0);
  const todayCount = staffShifts.filter(s => s.Wed !== null).length;

  return (
    <div className="p-6">
      <PageHeader icon="users" title="Staff Roster" sub={`${staffShifts.length} staff · ${totalShifts} shifts this week · ${todayCount} on shift today`}>
        <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Icon name="calendar" size={13} cls="text-slate-400" />
          <span className="text-[12px] font-semibold text-slate-600">May 3 – 9, 2026</span>
        </div>
        <button onClick={() => setAddShift(true)} className="btn-dark flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium">
          <Icon name="plus" size={15} cls="[&_svg]:stroke-white" />
          Add Shift
        </button>
      </PageHeader>

      <div className="flex items-center gap-1 p-1 bg-white border border-slate-100 rounded-xl w-fit mb-5 shadow-sm overflow-x-auto max-w-full">
        {STAFF_DEPTS.map(d => (
          <button key={d} onClick={() => setDept(d)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${dept === d ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
            {d}
          </button>
        ))}
      </div>

      <div className="rounded-[14px] border border-slate-200 overflow-x-auto" style={{boxShadow:'0 1px 3px rgba(15,23,42,.04)'}}>
        <div className="min-w-[980px]">
          <div className="roster-header">
            <div className="r-hname flex items-end pb-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Team Member</p>
            </div>
            {WEEK_DAYS.map(d => (
              <div key={d.key} className={`r-hday ${d.today ? 'today-col' : ''}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${d.today ? 'text-teal-600' : 'text-slate-400'}`}>{d.label}</p>
                <p className={`text-[17px] font-bold mt-0.5 leading-none ${d.today ? 'text-teal-700' : 'text-slate-700'}`}>{d.date}</p>
                <div className={`mt-1 text-[9px] font-medium ${d.today ? 'text-teal-500' : 'text-slate-300'}`}>{dayCount(d.key)} shifts</div>
                {d.today && <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mx-auto mt-1"></div>}
              </div>
            ))}
          </div>

          {groups.map(({ dept: deptName, staff }) => (
            <React.Fragment key={deptName}>
              {dept === 'All' && (
                <div className="dept-sep" style={{background:STAFF_DEPT_CFG[deptName].sepBg}}>
                  <Icon name={STAFF_DEPT_CFG[deptName].icon} size={12} cls={STAFF_DEPT_CFG[deptName].textCls} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${STAFF_DEPT_CFG[deptName].textCls}`}>{deptName}</span>
                  <span className={`text-[10px] opacity-55 ${STAFF_DEPT_CFG[deptName].textCls}`}>{staff.length} staff</span>
                </div>
              )}

              {staff.map(person => {
                const cfg = STAFF_DEPT_CFG[person.dept];
                return (
                  <div key={person.name} className="roster-row">
                    <div className="r-name">
                      <Av ini={person.av} color={cfg.avCls} size="sm" />
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-slate-700 leading-tight truncate">{person.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{person.role}</p>
                      </div>
                    </div>

                    {WEEK_DAYS.map(d => {
                      const cellKey = `${person.name}||${d.key}`;
                      const shift = person[d.key];
                      const isNew = confirmed.has(cellKey);
                      const isDeleting = deletingCells.has(cellKey);
                      return (
                        <div key={d.key} className={`r-day ${d.today ? 'today-col' : ''}`}>
                          {isDeleting ? (
                            <div className="shift-pill shift-deleting" style={{background:cfg.bg, borderColor:cfg.bd}}>
                              <div className="flex items-center justify-center gap-1 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dot1"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dot2"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dot3"></span>
                              </div>
                            </div>
                          ) : shift ? (
                            <div className={`shift-pill ${isNew ? 'confirmed' : ''}`} style={{background:cfg.bg, borderColor:cfg.bd}}>
                              <button className="remove-btn" title="Remove shift" onClick={e => { e.stopPropagation(); handleRemoveShift(person.name, d.key); }}>
                                <Icon name="x" size={9} cls="text-slate-600" />
                              </button>
                              <div className="flex items-center gap-1 mb-0.5 pr-3">
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`}></span>
                                <p className="text-[10px] font-semibold leading-tight truncate" style={{color:cfg.tc}}>{fmtShift(shift)}</p>
                                {isNew && <span className="ml-auto shrink-0"><Icon name="check-circle" size={10} cls="text-teal-500" /></span>}
                              </div>
                              <p className="text-[9px] truncate" style={{color:cfg.tc, opacity:.6}}>{isNew ? '✓ Confirmed' : person.role}</p>
                            </div>
                          ) : (
                            <span className="text-[12px] text-slate-200 font-light mx-auto select-none">—</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5 mt-4 px-1 flex-wrap">
        {Object.entries(STAFF_DEPT_CFG).map(([deptName, cfg]) => (
          <div key={deptName} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border" style={{background:cfg.bg, borderColor:cfg.bd}}></div>
            <span className="text-[11px] text-slate-400">{deptName}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{boxShadow:'0 0 0 1.5px #0D9488'}}></div>
          <span className="text-[11px] text-slate-400">Confirmed</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[13px] text-slate-300 font-light leading-none">—</span>
          <span className="text-[11px] text-slate-400">Day off</span>
        </div>
      </div>

      {addShift && <AddShiftModal staffShifts={staffShifts} onSave={handleShiftSave} onClose={() => setAddShift(false)} />}
      <OpsToastBar toasts={toasts} onDismiss={dismissToast} onRetry={retryToast} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD & PAGES
═══════════════════════════════════════════════ */
const CHECKOUTS = [
  { id:1, guest:'Rachel Green', room:'210', floor:2, time:'10:00', paid:true, nights:2, type:'Deluxe', amount:840, total:'₪ 840', inv:'INV-2026-0841',
    phone:'+972 52 345 6789', email:'rachel.g@mail.com', nat:'🇮🇱 Israeli',
    checkIn:'May 3, 2026', checkOut:'May 5, 2026', loyalty:'Silver', requests:['Late checkout approved'],
    extras:[{label:'Minibar',amount:45},{label:'Room Service',amount:120}] },
  { id:2, guest:'James Park',   room:'118', floor:1, time:'11:00', paid:false, nights:3, type:'Standard', amount:560,  total:'₪ 560',  inv:'INV-2026-0842',
    phone:'+82 10 1234 5678', email:'jamespark@korea.net',    nat:'🇰🇷 Korean',
    checkIn:'May 2, 2026', checkOut:'May 5, 2026', loyalty:'Bronze', requests:[],
    extras:[] },
  { id:3, guest:'Nina Volkov',  room:'320', floor:3, time:'11:30', paid:true,  nights:4, type:'Suite',    amount:1200, total:'₪ 1,200', inv:'INV-2026-0843',
    phone:'+7 495 123 4567',  email:'nina.volkov@rusmail.ru', nat:'🇷🇺 Russian',
    checkIn:'May 1, 2026', checkOut:'May 5, 2026', loyalty:'Gold', requests:['Daily laundry','Gym access'],
    extras:[{label:'Minibar',amount:85},{label:'Laundry',amount:60},{label:'Spa',amount:200}] },
];

const ROOMS = [
  { room:'102', guest:'John Meyer',   floor:1, type:'Standard', issue:'Room Service',    priority:'normal', time:'12 min ago',
    phone:'+49 30 12345678', email:'john.m@ger.de',        checkOut:'May 7, 2026', notes:'Requested dinner for two, asked about the menu options.' },
  { room:'215', guest:'Lior Shapiro', floor:2, type:'Deluxe',   issue:'AC Not Working',  priority:'urgent', time:'34 min ago',
    phone:'+972 53 888 2233',email:'lior.s@mail.il',       checkOut:'May 6, 2026', notes:'Guest very uncomfortable. Escalated to maintenance. Offer complimentary upgrade if unresolved within 1h.' },
  { room:'309', guest:'Amy Chen',     floor:3, type:'Suite',    issue:'Extra Towels',    priority:'normal', time:'1h ago',
    phone:'+86 138 1234 5678',email:'amy.c@china.cn',      checkOut:'May 8, 2026', notes:'Requested 4 extra bath towels and a robe.' },
  { room:'114', guest:'Ben Katz',     floor:1, type:'Standard', issue:'Late Checkout',   priority:'medium', time:'2h ago',
    phone:'+972 50 777 4455',email:'ben.k@mail.com',       checkOut:'May 5, 2026', notes:'Requesting checkout at 14:00 instead of 12:00. Awaiting manager approval.' },
  { room:'401', guest:'Dana Fischer', floor:4, type:'Suite',    issue:'Mini-bar Refill', priority:'normal', time:'2h ago',
    phone:'+972 54 333 1122',email:'dana.f@corp.il',       checkOut:'May 9, 2026', notes:'Full mini-bar restock requested. VIP guest — prioritize.' },
];

const STAFF = {
  Reception:   [
    { name:'Maya Goldberg', role:'Front Desk Mgr',   shift:'07:00–15:00', av:'MG', status:'active'   },
    { name:'Elan Friedman', role:'Receptionist',     shift:'07:00–15:00', av:'EF', status:'active'   },
    { name:'Tali Rosen',    role:'Receptionist',     shift:'15:00–23:00', av:'TR', status:'upcoming' },
  ],
  Cleaning:    [
    { name:'Ana Popescu',   role:'Head Housekeeper', shift:'08:00–16:00', av:'AP', status:'active'   },
    { name:'Daria Kovac',   role:'Housekeeper',      shift:'08:00–16:00', av:'DK', status:'active'   },
    { name:'Miriam Osei',   role:'Housekeeper',      shift:'10:00–18:00', av:'MO', status:'active'   },
    { name:'Leila Nazari',  role:'Housekeeper',      shift:'12:00–20:00', av:'LN', status:'upcoming' },
  ],
  Pool:        [
    { name:'Roi Shemesh',   role:'Pool Supervisor',  shift:'07:00–15:00', av:'RS', status:'active'   },
    { name:'Noa Bar',       role:'Lifeguard',         shift:'07:00–15:00', av:'NB', status:'active'   },
  ],
  Maintenance: [
    { name:'Yossi Adler',   role:'Chief Engineer',   shift:'08:00–16:00', av:'YA', status:'active'   },
    { name:'Sami Haddad',   role:'Technician',        shift:'08:00–16:00', av:'SH', status:'active'   },
  ],
};

const NAV = [
  { label:'Dashboard',    icon:'layout-dashboard', page:'dashboard' },
  { label:'Rooms Map',    icon:'map',               page:'rooms'     },
  { label:'Staff Roster', icon:'users',             page:'staff'     },
  { label:'Inventory',    icon:'package',            page:'inventory' },
];

const SEARCH_POOL = [
  ...CHECKINS.map(c  => ({ tag:'checkin',  label:c.guest,         sub:`Room ${c.room} · Check-in`, icon:'log-in',       col:'text-teal-600',   data:c, mtype:'guest' })),
  ...CHECKOUTS.map(c => ({ tag:'checkout', label:c.guest,         sub:`Room ${c.room} · Check-out`,icon:'log-out',      col:'text-amber-600',  data:c, mtype:'guest' })),
  ...ROOMS.map(r     => ({ tag:'room',     label:`Room ${r.room}`,sub:`${r.guest} · ${r.issue}`,   icon:'alert-circle', col:'text-red-500',    data:r, mtype:'room'  })),
];

const BOT_REPLIES = [
  "Room 215 has an urgent AC issue. Yossi Adler from Maintenance is on shift — I'd recommend dispatching him immediately.",
  "Today's peak arrival window is 14:00–18:30. 5 guests expected. I suggest ensuring all rooms are verified ready by 13:30.",
  "James Park's checkout payment of ₪560 is still pending. Would you like me to flag it for the front desk team?",
  "Current occupancy stands at 72.5%. Estimated RevPAR for today is ₪435, which is 3% above last Monday's figure.",
  "I don't have specific data on that right now. You can check the Reports page for historical trends and detailed analytics.",
  "There are 4 staff from Cleaning currently active. Leila Nazari starts at 12:00 and can assist with any afternoon requests.",
];

const ALL_ROOMS = [
  { room:'101', floor:1, type:'Standard', status:'occupied',  guest:'Samuel Torres',   checkIn:'May 2',  checkOut:'May 8',  nights:6, total:'₪ 1,440' },
  { room:'102', floor:1, type:'Standard', status:'occupied',  guest:'John Meyer',      checkIn:'May 4',  checkOut:'May 7',  nights:3, total:'₪ 720'   },
  { room:'103', floor:1, type:'Standard', status:'available', guest:null,              checkIn:null,     checkOut:null,     nights:0, total:null       },
  { room:'104', floor:1, type:'Standard', status:'occupied',  guest:'Hana Mizrahi',    checkIn:'May 3',  checkOut:'May 6',  nights:3, total:'₪ 720'   },
  { room:'105', floor:1, type:'Standard', status:'available', guest:null,              checkIn:null,     checkOut:null,     nights:0, total:null       },
  { room:'106', floor:1, type:'Standard', status:'available', guest:null,              checkIn:null,     checkOut:null,     nights:0, total:null       },
  { room:'107', floor:1, type:'Standard', status:'occupied',  guest:'Luca Ricci',      checkIn:'May 1',  checkOut:'May 6',  nights:5, total:'₪ 1,200' },
  { room:'108', floor:1, type:'Standard', status:'occupied',  guest:'Mark Williams',   checkIn:'May 5',  checkOut:'May 10', nights:5, total:'₪ 2,100' },
  { room:'109', floor:1, type:'Standard', status:'occupied',  guest:'James Park',      checkIn:'May 2',  checkOut:'May 5',  nights:3, total:'₪ 560'   },
  { room:'110', floor:1, type:'Standard', status:'occupied',  guest:'Fatima Al-Said',  checkIn:'May 3',  checkOut:'May 7',  nights:4, total:'₪ 960'   },
  { room:'201', floor:2, type:'Deluxe',   status:'occupied',  guest:'Benjamin Harris', checkIn:'May 2',  checkOut:'May 7',  nights:5, total:'₪ 2,100' },
  { room:'202', floor:2, type:'Deluxe',   status:'occupied',  guest:'Yuki Tanaka',     checkIn:'May 3',  checkOut:'May 8',  nights:5, total:'₪ 2,100' },
  { room:'203', floor:2, type:'Deluxe',   status:'available', guest:null,              checkIn:null,     checkOut:null,     nights:0, total:null       },
  { room:'204', floor:2, type:'Deluxe',   status:'occupied',  guest:'David Levi',      checkIn:'May 5',  checkOut:'May 8',  nights:3, total:'₪ 1,260' },
  { room:'205', floor:2, type:'Deluxe',   status:'occupied',  guest:'Lior Shapiro',    checkIn:'May 3',  checkOut:'May 6',  nights:3, total:'₪ 1,260' },
  { room:'206', floor:2, type:'Deluxe',   status:'occupied',  guest:'Oren Katz',       checkIn:'May 1',  checkOut:'May 8',  nights:7, total:'₪ 2,940' },
  { room:'207', floor:2, type:'Deluxe',   status:'available', guest:null,              checkIn:null,     checkOut:null,     nights:0, total:null       },
  { room:'208', floor:2, type:'Deluxe',   status:'occupied',  guest:'Claire Dubois',   checkIn:'May 4',  checkOut:'May 9',  nights:5, total:'₪ 2,100' },
  { room:'209', floor:2, type:'Deluxe',   status:'occupied',  guest:'Marco Rossi',     checkIn:'May 2',  checkOut:'May 6',  nights:4, total:'₪ 1,680' },
  { room:'210', floor:2, type:'Deluxe',   status:'occupied',  guest:'Rachel Green',    checkIn:'May 3',  checkOut:'May 5',  nights:2, total:'₪ 840'   },
  { room:'301', floor:3, type:'Deluxe',   status:'occupied',  guest:'Tom Eriksson',    checkIn:'May 5',  checkOut:'May 9',  nights:4, total:'₪ 5,600' },
  { room:'302', floor:3, type:'Deluxe',   status:'occupied',  guest:'Priya Singh',     checkIn:'May 3',  checkOut:'May 7',  nights:4, total:'₪ 1,680' },
  { room:'303', floor:3, type:'Deluxe',   status:'occupied',  guest:'Diego Herrera',   checkIn:'May 2',  checkOut:'May 7',  nights:5, total:'₪ 2,100' },
  { room:'304', floor:3, type:'Deluxe',   status:'available', guest:null,              checkIn:null,     checkOut:null,     nights:0, total:null       },
  { room:'305', floor:3, type:'Suite',    status:'occupied',  guest:'Sarah Cohen',     checkIn:'May 5',  checkOut:'May 7',  nights:2, total:'₪ 3,200' },
  { room:'306', floor:3, type:'Suite',    status:'occupied',  guest:'Ivan Petrov',     checkIn:'May 1',  checkOut:'May 8',  nights:7, total:'₪ 8,400' },
  { room:'307', floor:3, type:'Suite',    status:'occupied',  guest:'Miriam Cohen',    checkIn:'May 2',  checkOut:'May 6',  nights:4, total:'₪ 4,800' },
  { room:'308', floor:3, type:'Suite',    status:'available', guest:null,              checkIn:null,     checkOut:null,     nights:0, total:null       },
  { room:'309', floor:3, type:'Suite',    status:'occupied',  guest:'Amy Chen',        checkIn:'May 3',  checkOut:'May 8',  nights:5, total:'₪ 6,000' },
  { room:'310', floor:3, type:'Suite',    status:'occupied',  guest:'Nina Volkov',     checkIn:'May 1',  checkOut:'May 5',  nights:4, total:'₪ 1,200' },
  { room:'401', floor:4, type:'Suite',    status:'occupied',  guest:'Dana Fischer',    checkIn:'May 3',  checkOut:'May 9',  nights:6, total:'₪ 7,200' },
  { room:'402', floor:4, type:'Suite',    status:'occupied',  guest:'Aisha Patel',     checkIn:'May 5',  checkOut:'May 6',  nights:1, total:'₪ 420'   },
  { room:'403', floor:4, type:'Suite',    status:'available', guest:null,              checkIn:null,     checkOut:null,     nights:0, total:null       },
  { room:'404', floor:4, type:'Suite',    status:'occupied',  guest:'Carlos Mendez',   checkIn:'May 2',  checkOut:'May 8',  nights:6, total:'₪ 7,200' },
  { room:'405', floor:4, type:'Suite',    status:'occupied',  guest:'Sophie Laurent',  checkIn:'May 3',  checkOut:'May 9',  nights:6, total:'₪ 7,200' },
  { room:'406', floor:4, type:'Suite',    status:'available', guest:null,              checkIn:null,     checkOut:null,     nights:0, total:null       },
  { room:'407', floor:4, type:'Suite',    status:'occupied',  guest:'Akira Yoshida',   checkIn:'May 1',  checkOut:'May 7',  nights:6, total:'₪ 7,200' },
  { room:'408', floor:4, type:'Suite',    status:'occupied',  guest:'Elena Popescu',   checkIn:'May 2',  checkOut:'May 6',  nights:4, total:'₪ 4,800' },
  { room:'409', floor:4, type:'Suite',    status:'available', guest:null,              checkIn:null,     checkOut:null,     nights:0, total:null       },
  { room:'410', floor:4, type:'Suite',    status:'occupied',  guest:'Omar Abdullah',   checkIn:'May 3',  checkOut:'May 7',  nights:4, total:'₪ 4,800' },
];

const STATUS_CONFIG = {
  occupied:  { cardCls:'room-card-dark',  legendBg:'#475569', label:'Occupied',  dot:'bg-slate-300',   textCls:'text-slate-200' },
  available: { cardCls:'room-card-vacant', legendBg:'#D1FAE5', label:'Available', dot:'bg-emerald-400', textCls:'text-slate-500'  },
};

/* ═══════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════ */
const AV_COLORS = ['bg-teal-600','bg-sky-600','bg-violet-600','bg-pink-600','bg-indigo-600','bg-slate-600','bg-amber-600','bg-rose-600','bg-cyan-600','bg-purple-600'];
function avColor(n) { let h=0; for(const c of n) h=(h*31+c.charCodeAt(0))|0; return AV_COLORS[Math.abs(h)%AV_COLORS.length]; }
function ini(name) { return name.split(' ').map(n=>n[0]).join('').toUpperCase(); }

/* Icon — wraps lucide-react; cls on the span so [&_svg]:stroke-* selectors reach the svg child */
function Icon({ name, size=18, cls='' }) {
  const key = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  const Ic = Icons[key];
  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${cls}`}>
      {Ic && <Ic size={size} strokeWidth={1.8} />}
    </span>
  );
}

function Av({ ini:i, color='bg-teal-600', size='md' }) {
  const s = size==='sm'?'w-7 h-7 text-[10px]':size==='lg'?'w-14 h-14 text-base':'w-9 h-9 text-xs';
  return <div className={`${s} rounded-full ${color} flex items-center justify-center text-white font-semibold shrink-0`}>{i}</div>;
}

function StatusDot({ status }) {
  const map = {
    confirmed:{ dot:'bg-teal-500',  label:'Confirmed' },
    vip:      { dot:'bg-amber-500', label:'VIP'       },
    late:     { dot:'bg-red-500',   label:'Late'      },
    paid:     { dot:'bg-teal-500',  label:'Paid'      },
    pending:  { dot:'bg-red-500',   label:'Pending'   },
    active:   { dot:'bg-teal-500',  label:'Active'    },
    upcoming: { dot:'bg-slate-300', label:'Upcoming'  },
  };
  const { dot, label } = map[status] || { dot:'bg-slate-300', label:status };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`}></span>
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
    </span>
  );
}

function PriDot({ level }) {
  const map = { urgent:'bg-red-500', medium:'bg-amber-400', normal:'bg-slate-300', resolved:'bg-teal-500' };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${map[level]||'bg-slate-300'} shrink-0`}></span>
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{level}</span>
    </span>
  );
}

const LOYALTY_CLS = {
  Platinum:'bg-slate-200 text-slate-700',
  Gold:    'bg-amber-100 text-amber-800',
  Silver:  'bg-slate-100 text-slate-600',
  Bronze:  'bg-orange-100 text-orange-700',
};

const STATUS_ICON = { occupied:'bed-double', available:'circle' };
const ICON_CLS   = { occupied:'[&_svg]:stroke-slate-300', available:'text-emerald-300' };

function RoomCard({ room, onClick }) {
  const cfg = STATUS_CONFIG[room.status];
  const isDark = room.status === 'occupied';
  return (
    <div className={`room-card rounded-xl p-3 flex flex-col ${cfg.cardCls}`} onClick={() => onClick(room)}>
      <div className="flex items-start justify-between mb-1">
        <span className={`text-[15px] font-bold leading-none ${isDark ? 'text-white' : 'text-slate-800'}`}>{room.room}</span>
        <Icon name={STATUS_ICON[room.status]} size={12} cls={ICON_CLS[room.status]} />
      </div>
      <p className={`text-[8px] font-bold uppercase tracking-wider mb-auto ${isDark ? 'text-slate-300' : 'text-slate-400'}`}>{room.type}</p>
      {room.guest && (
        <p className={`text-[10px] font-medium truncate mt-1.5 ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
          {room.guest.split(' ')[0]}
        </p>
      )}
      <div className="flex items-center gap-1 mt-1.5">
        <span className={`text-[8px] font-semibold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-400'}`}>{cfg.label}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════ */
function Modal({ modal, onClose }) {
  useEffect(() => {
    const h = e => { if(e.key==='Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  if (!modal) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-bg anim-fade" onClick={onClose}>
      <div className="modal-box w-full max-w-lg max-h-[90vh] overflow-y-auto sb anim-pop" onClick={e=>e.stopPropagation()}>
        {modal.type==='guest' && <GuestModal data={modal.data} onClose={onClose} />}
        {modal.type==='room'  && <RoomModal  data={modal.data} onClose={onClose} />}
      </div>
    </div>
  );
}

function MHead({ title, sub, onClose }) {
  return (
    <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-slate-100">
      <div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
      </div>
      <button onClick={onClose} className="btn-outline w-8 h-8 rounded-lg flex items-center justify-center ml-4 shrink-0">
        <Icon name="x" size={14} cls="text-slate-500" />
      </button>
    </div>
  );
}

function InfoPair({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{background:'#F2EFE9',border:'1px solid rgba(20,16,8,.07)'}}>
        <Icon name={icon} size={13} cls="text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

function GuestModal({ data, onClose }) {
  const color = avColor(data.guest);
  const isOut = !!data.inv;
  return (
    <>
      <MHead title="Guest Profile" sub={isOut ? `Invoice ${data.inv}` : `Arriving at ${data.time}`} onClose={onClose} />
      <div className="px-6 pb-6 space-y-5 pt-5">
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{background:'#F5F2EC',border:'1px solid rgba(20,16,8,.07)'}}>
          <Av ini={ini(data.guest)} color={color} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-800">{data.guest}</h3>
            <p className="text-slate-500 text-xs mt-0.5">{data.nat}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${LOYALTY_CLS[data.loyalty]||'bg-slate-100 text-slate-600'}`}>{data.loyalty} Member</span>
              <StatusDot status={isOut ? (data.paid?'paid':'pending') : data.status} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-slate-400">Total</p>
            <p className="text-xl font-bold text-teal-600">{data.total}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Stay Details</p>
          <div className="grid grid-cols-2 gap-x-4">
            <InfoPair label="Room"       value={`${data.room} · ${data.type} · F${data.floor}`} icon="bed-double" />
            <InfoPair label="Check-in"   value={data.checkIn}                                   icon="log-in"     />
            <InfoPair label="Check-out"  value={data.checkOut}                                  icon="log-out"    />
            <InfoPair label="Duration"   value={`${data.nights} night${data.nights>1?'s':''}`} icon="moon"       />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
          <InfoPair label="Phone" value={data.phone} icon="phone" />
          <InfoPair label="Email" value={data.email} icon="mail"  />
        </div>
        {data.requests?.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Special Requests</p>
            <div className="space-y-1.5">
              {data.requests.map((r,i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#F5F2EC] border border-[rgba(20,16,8,.07)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                  <p className="text-sm text-slate-600">{r}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 pt-1">
          <button className="btn-dark flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
            <Icon name="phone" size={14} cls="[&_svg]:stroke-white" /> Call Guest
          </button>
          <button className="btn-outline flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
            <Icon name="mail" size={14} cls="text-slate-500" /> Send Email
          </button>
        </div>
      </div>
    </>
  );
}

function RoomModal({ data, onClose }) {
  const [pri, setPri] = useState(data.priority);
  return (
    <>
      <MHead title={`Room ${data.room}`} sub={`Floor ${data.floor} · ${data.type}`} onClose={onClose} />
      <div className="px-6 pb-6 space-y-5 pt-5">
        <div className={`px-4 py-3 rounded-xl border-l-4 bg-[#F5F2EC] border border-[rgba(20,16,8,.07)] flex items-start gap-3
          ${pri==='urgent'?'border-l-red-500':pri==='medium'?'border-l-amber-400':'border-l-slate-300'}`}>
          <Icon name={pri==='urgent'?'alert-triangle':'info'} size={17} cls={`mt-0.5 shrink-0 ${pri==='urgent'?'text-red-500':pri==='medium'?'text-amber-500':'text-slate-400'}`} />
          <div>
            <p className="text-sm font-semibold text-slate-700">{data.issue}</p>
            <p className="text-xs text-slate-400 mt-0.5">Reported {data.time}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Current Guest</p>
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F5F2EC] border border-[rgba(20,16,8,.07)]">
            <Av ini={ini(data.guest)} color={avColor(data.guest)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700">{data.guest}</p>
              <p className="text-xs text-slate-400">Checkout: {data.checkOut}</p>
            </div>
            <div className="text-right text-xs text-slate-400 shrink-0">
              <p>{data.phone}</p><p className="truncate max-w-[140px]">{data.email}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Staff Notes</p>
          <div className="p-3.5 rounded-xl bg-[#F5F2EC] border border-[rgba(20,16,8,.07)]">
            <p className="text-sm text-slate-600 leading-relaxed">{data.notes}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Update Priority</p>
          <div className="grid grid-cols-4 gap-2">
            {['normal','medium','urgent','resolved'].map(p => (
              <button key={p} onClick={() => setPri(p)}
                className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide border transition-all
                  ${pri===p
                    ? p==='urgent' ? 'bg-red-50 border-red-200 text-red-600'
                    : p==='medium' ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : p==='resolved' ? 'bg-teal-50 border-teal-200 text-teal-600'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                    : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button className="btn-dark flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
            <Icon name="user-check" size={14} cls="[&_svg]:stroke-white" /> Assign Staff
          </button>
          <button className="btn-outline px-4 py-2.5 rounded-xl text-teal-600 text-sm font-semibold flex items-center gap-2">
            <Icon name="check-circle" size={14} cls="text-teal-500" /> Resolve
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   CHAT PANEL
═══════════════════════════════════════════════ */
const SUGGESTIONS = ["What's the current occupancy?","Any urgent room issues?","Who's on shift now?"];
function now() { return new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); }

function ChatPanel({ open, onClose }) {
  const [messages, setMessages] = useState([
    { from:'bot', text:"Hi! I'm your Hotel Co-pilot. Ask me anything about your hotel operations, guests, or staff.", time:'09:00' },
    { from:'bot', text:"I can help with room assignments, guest requests, occupancy analysis, and more.", time:'09:00' },
  ]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const endRef   = useRef(null);
  const inputRef = useRef(null);
  const botIdx   = useRef(0);
  const showSuggestions = messages.length <= 2;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, typing]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 320); }, [open]);

  const send = useCallback((text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    const t = now();
    setMessages(prev => [...prev, { from:'user', text:msg, time:t }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from:'bot', text:BOT_REPLIES[botIdx.current % BOT_REPLIES.length], time:now() }]);
      botIdx.current++;
    }, 1000 + Math.random() * 800);
  }, [input]);

  const onKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className={`chat-panel ${open ? 'open' : ''}`}>
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
          <Icon name="bot" size={17} cls="[&_svg]:stroke-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">Co-pilot</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span className="text-[10px] text-slate-400 font-medium">Online · AI-powered</span>
          </div>
        </div>
        <button onClick={onClose} className="btn-outline w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
          <Icon name="x" size={14} cls="text-slate-400" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto sb px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-end gap-2.5 ${m.from==='user' ? 'flex-row-reverse' : ''}`}>
            {m.from==='bot' && (
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mb-0.5">
                <Icon name="bot" size={13} cls="[&_svg]:stroke-white" />
              </div>
            )}
            <div className={`max-w-[78%] ${m.from==='user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-3.5 py-2.5 text-sm leading-relaxed ${m.from==='bot' ? 'bubble-bot text-slate-700' : 'bubble-user'}`}>
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 px-1">{m.time}</span>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-end gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
              <Icon name="bot" size={13} cls="[&_svg]:stroke-white" />
            </div>
            <div className="bubble-bot px-4 py-3 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dot1"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dot2"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dot3"></span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {showSuggestions && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0">
          {SUGGESTIONS.map((s,i) => (
            <button key={i} onClick={() => send(s)}
              className="text-[11px] font-medium text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1.5 rounded-lg hover:bg-teal-100 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="px-4 py-4 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
            placeholder="Ask me anything…"
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none" />
          <button onClick={() => send()} disabled={!input.trim()}
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all
              ${input.trim() ? 'bg-slate-900 hover:bg-slate-800 scale-100' : 'bg-slate-200 scale-95 cursor-not-allowed'}`}>
            <Icon name="send-horizontal" size={14} cls={input.trim() ? '[&_svg]:stroke-white' : 'text-slate-400'} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">AI responses are illustrative placeholders.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════ */
function Topbar({ onResult, chatOpen, onToggleChat }) {
  const [q, setQ]       = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const results = q.trim().length > 0
    ? SEARCH_POOL.filter(i => i.label.toLowerCase().includes(q.toLowerCase()) || i.sub.toLowerCase().includes(q.toLowerCase())).slice(0,6)
    : [];

  useEffect(() => {
    const h = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const dateStr = new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  return (
    <header className="topbar h-14 flex items-center px-6 gap-3 sticky top-0 z-20">
      <p className="text-slate-400 text-xs hidden lg:block flex-1 shrink-0">{dateStr}</p>
      <div ref={ref} className="relative flex-1 max-w-xs">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Icon name="search" size={14} />
          </span>
          <input className="search-input w-full pl-8 pr-8 py-2 rounded-xl text-sm"
            placeholder="Search guest or room…" value={q}
            onChange={e => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)} />
          {q && (
            <button onClick={() => { setQ(''); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <Icon name="x" size={12} />
            </button>
          )}
        </div>
        {open && results.length > 0 && (
          <div className="search-dd absolute top-full mt-2 left-0 right-0 z-50">
            {results.map((r,i) => (
              <button key={i}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                onClick={() => { onResult({type:r.mtype,data:r.data}); setQ(''); setOpen(false); }}>
                <Icon name={r.icon} size={14} cls={r.col} />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-slate-700 truncate">{r.label}</p>
                  <p className="text-xs text-slate-400 truncate">{r.sub}</p>
                </div>
                <Icon name="arrow-right" size={12} cls="text-slate-300 shrink-0" />
              </button>
            ))}
          </div>
        )}
        {open && q && results.length === 0 && (
          <div className="search-dd absolute top-full mt-2 left-0 right-0 px-4 py-3 z-50">
            <p className="text-sm text-slate-400">No results for "{q}"</p>
          </div>
        )}
      </div>
      <button className="relative btn-outline p-2 rounded-xl">
        <Icon name="bell" size={16} cls="text-slate-500" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
      </button>
      <button onClick={onToggleChat}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all
          ${chatOpen ? 'bg-slate-900 text-white' : 'btn-outline text-slate-700'}`}>
        <Icon name="bot" size={15} cls={chatOpen ? '[&_svg]:stroke-white' : 'text-slate-500'} />
        <span>Co-pilot</span>
        {!chatOpen && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>}
      </button>
    </header>
  );
}

/* ═══════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════ */
function Sidebar({ page, onNav, collapsed, onToggle }) {
  return (
    <aside className={`sidebar sidebar-wrap fixed left-0 top-0 h-screen flex flex-col z-30 overflow-hidden ${collapsed?'collapsed':''}`}>
      {collapsed ? (
        <div className="flex flex-col items-center py-4 border-b border-white/[.05] gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
            <Icon name="building-2" size={15} cls="[&_svg]:stroke-white" />
          </div>
          <button onClick={onToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[.06] transition-colors"
            title="Expand sidebar">
            <Icon name="chevrons-right" size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-[18px] border-b border-white/[.05]">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
            <Icon name="building-2" size={15} cls="[&_svg]:stroke-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight tracking-tight">Urban Oasis</p>
            <p className="text-slate-500 text-[11px]">Hotel Management</p>
          </div>
          <button onClick={onToggle}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-white hover:bg-white/[.06] transition-colors shrink-0"
            title="Collapse sidebar">
            <Icon name="chevrons-left" size={15} />
          </button>
        </div>
      )}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto sb sb-dark">
        {!collapsed && <p className="text-slate-700 text-[9px] font-semibold uppercase tracking-widest px-2.5 mb-3">Main Menu</p>}
        {NAV.map(item => {
          const active = page === item.page;
          return (
            <div key={item.page} className="tip-wrap">
              <button onClick={() => onNav(item.page)}
                className={`nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                  ${active ? 'nav-active' : 'text-slate-500 hover:text-slate-200'}`}>
                <Icon name={item.icon} size={16} cls={active?'text-teal-500':''} />
                <span className="sb-label">{item.label}</span>
              </button>
              {collapsed && <span className="tip">{item.label}</span>}
            </div>
          );
        })}
      </nav>
      <div className="px-3 py-3.5 border-t border-white/[.05] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white text-xs font-bold shrink-0">GM</div>
        <div className="sb-extra flex-1 min-w-0">
          <p className="text-white text-[12px] font-medium truncate">General Manager</p>
          <p className="text-slate-600 text-[10px] truncate">alonsinger102@gmail.com</p>
        </div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════
   CARDS
═══════════════════════════════════════════════ */
function OccupancyCard() {
  const pct = Math.round((OCC.occupied / TOTAL_ROOMS) * 100);
  const r = 50; const circ = 2 * Math.PI * r;
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Room Occupancy</p>
          <p className="text-slate-500 text-xs mt-0.5">{TOTAL_ROOMS} total rooms · Live</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
          <Icon name="bed-double" size={17} cls="text-teal-600" />
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <svg width="114" height="114" viewBox="0 0 114 114">
            <circle cx="57" cy="57" r={r} fill="none" stroke="#EDE9E3" strokeWidth="11"/>
            <circle cx="57" cy="57" r={r} fill="none"
              stroke="#0D9488" strokeWidth="11" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ-(pct/100)*circ}
              className="arc" transform="rotate(-90 57 57)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">{pct}%</span>
            <span className="text-[10px] text-slate-400 font-medium">Occupied</span>
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-2.5">
          {[['Occupied',OCC.occupied,'bg-teal-500'],['Available',OCC.available,'bg-slate-200'],['Maintenance',OCC.maintenance,'bg-amber-400']].map(([l,v,c])=>(
            <div key={l} className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full ${c} shrink-0`}></span>
              <span className="text-[12px] text-slate-500 flex-1 truncate">{l}</span>
              <span className="text-[13px] font-semibold text-slate-700 shrink-0" style={{fontVariantNumeric:'tabular-nums'}}>{v}</span>
            </div>
          ))}
          <div className="pt-2 border-t flex justify-between text-xs" style={{borderColor:'#EAE6DF'}}>
            <span className="text-slate-400">Revenue today</span>
            <span className="font-semibold text-teal-600">₪ 18,450</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckInsCard({ onOpen }) {
  const [arrivedIds, setArrivedIds] = useState(new Set());
  const markArrived = (id, e) => { e.stopPropagation(); setArrivedIds(s => new Set([...s, id])); };
  const shown = CHECKINS.filter(c => !arrivedIds.has(c.id));
  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-slate-50 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Today's Check-ins</p>
          <p className="text-[22px] font-bold text-slate-800 mt-0.5 leading-tight" style={{letterSpacing:'-.03em'}}>{shown.length} <span className="text-sm font-normal text-slate-400" style={{letterSpacing:'normal'}}>rooms</span></p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500">
            <path d="M9.88889 9V9.00889M1 17H17M2.77778 17V2.77778C2.77778 2.30628 2.96508 1.8541 3.29848 1.5207C3.63187 1.1873 4.08406 1 4.55556 1H9.88889M13.4444 10.3333V17M17 4.55556H10.7778M13.4444 7.22222L10.7778 4.55556L13.4444 1.88889" />
          </svg>
        </div>
      </div>
      <div className="overflow-y-auto sb max-h-60 divide-y divide-slate-100">
        {shown.map(c => (
          <div key={c.id} className="row flex items-center gap-3 px-5 py-3 cursor-pointer" onClick={()=>onOpen({type:'guest',data:c})}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{c.guest}</p>
              <p className="text-xs text-slate-400">Rm {c.room} · {c.type} · {c.nights}n · {c.time}</p>
            </div>
            <button className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-600 text-white hover:bg-slate-700 transition-colors" onClick={e=>markArrived(c.id,e)}>
              Check-in
            </button>
          </div>
        ))}
        {shown.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-xs text-slate-400">All guests checked in</p>
          </div>
        )}
      </div>
      <div className="px-5 py-3 border-t border-slate-50">
        <button className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1 transition-colors">
          All reservations <Icon name="chevron-right" size={13} cls="text-teal-500" />
        </button>
      </div>
    </div>
  );
}

function CheckOutsCard({ onOpen }) {
  const [departedIds, setDepartedIds] = useState(new Set());
  const [localPaid, setLocalPaid] = useState(() => Object.fromEntries(CHECKOUTS.map(c => [c.id, c.paid])));
  const markDeparted = (id, e) => { e.stopPropagation(); setDepartedIds(s => new Set([...s, id])); };
  const markPaid = (id, e) => { e.stopPropagation(); setLocalPaid(p => ({...p, [id]: true})); };
  const shown = CHECKOUTS.filter(c => !(departedIds.has(c.id) && localPaid[c.id]));
  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-slate-50 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Today's Check-outs</p>
          <p className="text-[22px] font-bold text-slate-800 mt-0.5 leading-tight" style={{letterSpacing:'-.03em'}}>{shown.length} <span className="text-sm font-normal text-slate-400" style={{letterSpacing:'normal'}}>rooms</span></p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
            <path d="M9.88889 9V9.00889M1 17H17M2.77778 17V2.77778C2.77778 2.30628 2.96508 1.8541 3.29848 1.5207C3.63187 1.1873 4.08406 1 4.55556 1H11.2222M13.4444 10.3333V17M10.7778 4.55556H17M14.3333 7.22222L17 4.55556L14.3333 1.88889" />
          </svg>
        </div>
      </div>
      <div className="overflow-y-auto sb max-h-60 divide-y divide-slate-100">
        {shown.map(c => (
          <div key={c.id} className="row flex items-center gap-3 px-5 py-3.5 cursor-pointer" onClick={()=>onOpen({type:'guest',data:c})}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-700 truncate">{c.guest}</p>
                {localPaid[c.id]
                  ? <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Paid</span>
                  : <button className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" onClick={e=>markPaid(c.id,e)}>Pending</button>
                }
              </div>
              <p className="text-xs text-slate-400">Rm {c.room} · Out {c.time}</p>
              {c.extras && c.extras.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {c.extras.map(e => (
                    <span key={e.label} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                      {e.label} <span className="font-semibold text-slate-600">₪{e.amount}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {departedIds.has(c.id)
              ? <span className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-400">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1,6 4,9 11,2"/></svg>
                  Check-out
                </span>
              : <button className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold btn-dark" onClick={e=>markDeparted(c.id,e)}>
                  Check-out
                </button>
            }
          </div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-slate-50">
        <button className="text-xs text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1 transition-colors">
          Process payments <Icon name="chevron-right" size={13} cls="text-amber-500" />
        </button>
      </div>
    </div>
  );
}

function RoomStatusCard({ onOpen }) {
  const [filter,   setFilter]   = useState('all');
  const [requests, setRequests] = useState(ROOMS);
  const [pris,     setPris]     = useState(() => Object.fromEntries(ROOMS.map(r=>[r.room, r.priority])));
  const [showAdd,  setShowAdd]  = useState(false);
  const [newRoom,  setNewRoom]  = useState('');
  const [newIssue, setNewIssue] = useState('');
  const [newPri,   setNewPri]   = useState('normal');

  const shown = filter==='all' ? requests : requests.filter(r=>pris[r.room]===filter);

  const handleAdd = () => {
    if (!newRoom.trim() || !newIssue.trim()) return;
    const req = { room:newRoom.trim(), floor:0, type:'', issue:newIssue.trim(), priority:newPri, time:'just now', guest:'', phone:'', email:'', checkOut:'', notes:'' };
    setRequests(r => [req, ...r]);
    setPris(p => ({...p, [newRoom.trim()]: newPri}));
    setNewRoom(''); setNewIssue(''); setNewPri('normal'); setShowAdd(false);
  };

  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-slate-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Room Requests & Issues</p>
            <p className="text-[22px] font-bold text-slate-800 mt-0.5 leading-tight" style={{letterSpacing:'-.03em'}}>{requests.length} <span className="text-sm font-normal text-slate-400" style={{letterSpacing:'normal'}}>active</span></p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <Icon name="alert-circle" size={17} cls="text-red-400" />
          </div>
        </div>
        <div className="flex gap-1">
          {['all','urgent','medium','normal'].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${filter===f?'pill-on':'pill-off'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-y-auto sb max-h-64 divide-y divide-slate-100">
        {shown.map((r,i) => (
          <div key={i} className={`row flex items-center gap-3 px-5 py-3 pri-${pris[r.room]}`}>
            <button
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0 hover:bg-slate-100 transition-colors cursor-pointer"
              onClick={()=>onOpen({type:'room',data:{...r,priority:pris[r.room]}})}>
              <span className="text-xs font-bold text-slate-700">{r.room}</span>
              <span className="text-[9px] text-slate-400 font-medium">F{r.floor}</span>
            </button>
            <div className="flex-1 min-w-0 cursor-pointer" onClick={()=>onOpen({type:'room',data:{...r,priority:pris[r.room]}})}>
              <p className="text-sm font-medium text-slate-700 truncate">{r.issue}</p>
              <p className="text-xs text-slate-400 truncate">{r.guest} · {r.type}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <select className="ls" value={pris[r.room]}
                onChange={e=>setPris(p=>({...p,[r.room]:e.target.value}))}
                onClick={e=>e.stopPropagation()}>
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="urgent">Urgent</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="px-5 py-3 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex gap-2">
            <input value={newRoom} onChange={e=>setNewRoom(e.target.value)} placeholder="Room"
              className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 transition-colors" />
            <input value={newIssue} onChange={e=>setNewIssue(e.target.value)} placeholder="Describe the request…"
              className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
              onKeyDown={e=>{if(e.key==='Enter') handleAdd();}} />
          </div>
          <div className="flex items-center gap-2">
            <select value={newPri} onChange={e=>setNewPri(e.target.value)} className="ls flex-1">
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="urgent">Urgent</option>
            </select>
            <button onClick={handleAdd}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${newRoom.trim()&&newIssue.trim()?'btn-dark':'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
              Submit
            </button>
            <button onClick={()=>{setShowAdd(false);setNewRoom('');setNewIssue('');setNewPri('normal');}}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold btn-outline text-slate-500">
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
        <div className="flex gap-3 text-[10px] text-slate-400">
          <span>{Object.values(pris).filter(p=>p==='urgent').length} urgent</span>
          <span>{Object.values(pris).filter(p=>p==='medium').length} medium</span>
        </div>
        <button onClick={()=>setShowAdd(v=>!v)} className="text-xs text-slate-500 font-semibold hover:text-slate-700 flex items-center gap-1 transition-colors">
          Submit Request <Icon name="plus" size={13} cls="text-slate-400" />
        </button>
      </div>
    </div>
  );
}

const DEPT_CLS   = { Reception:'bg-violet-100 text-violet-700', Cleaning:'bg-sky-100 text-sky-700', Pool:'bg-cyan-100 text-cyan-700', Maintenance:'bg-amber-100 text-amber-700' };
const DEPT_ICON  = { Reception:'concierge-bell', Cleaning:'sparkles', Pool:'waves', Maintenance:'wrench' };
const DEPT_AVCLR = { Reception:'bg-violet-600',  Cleaning:'bg-sky-600',  Pool:'bg-cyan-600',  Maintenance:'bg-amber-600' };

function StaffCard() {
  const [exp, setExp] = useState('Reception');
  const depts = Object.keys(STAFF);
  const total  = depts.reduce((a,d)=>a+STAFF[d].length,0);
  const active = depts.reduce((a,d)=>a+STAFF[d].filter(s=>s.status==='active').length,0);
  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-slate-50 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Staff on Shift</p>
          <p className="text-2xl font-bold text-slate-800 mt-0.5">
            <span style={{letterSpacing:'-.03em'}}>{active}</span> <span className="text-sm font-normal text-slate-400" style={{letterSpacing:'normal'}}>active</span>
            <span className="text-sm font-normal text-slate-300" style={{letterSpacing:'normal'}}> / {total}</span>
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
          <Icon name="users" size={17} cls="text-violet-500" />
        </div>
      </div>
      <div className="overflow-y-auto sb max-h-72 divide-y divide-slate-100">
        {depts.map(dept => {
          const isOpen = exp === dept;
          const ac = STAFF[dept].filter(s=>s.status==='active').length;
          return (
            <div key={dept}>
              <button onClick={()=>setExp(isOpen?null:dept)} className="row w-full flex items-center gap-3 px-5 py-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${DEPT_CLS[dept]}`}>
                  <Icon name={DEPT_ICON[dept]} size={13} />
                </div>
                <span className="flex-1 text-sm font-semibold text-slate-700 text-left">{dept}</span>
                <span className="text-[10px] text-slate-400 mr-1">{ac}/{STAFF[dept].length}</span>
                <Icon name={isOpen?'chevron-up':'chevron-down'} size={14} cls="text-slate-400" />
              </button>
              {isOpen && STAFF[dept].map((s,i)=>(
                <div key={i} className="row flex items-center gap-3 px-5 py-2.5 pl-14 bg-slate-50/50">
                  <Av ini={s.av} color={DEPT_AVCLR[dept]} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{s.name}</p>
                    <p className="text-[10px] text-slate-400">{s.role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-500 mb-0.5">{s.shift}</p>
                    <StatusDot status={s.status} />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="px-5 py-3 border-t border-slate-50">
        <button className="text-xs text-violet-600 font-semibold hover:text-violet-700 flex items-center gap-1 transition-colors">
          View full roster <Icon name="chevron-right" size={13} cls="text-violet-500" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOMS MAP
═══════════════════════════════════════════════ */
function RoomMapModal({ room, onClose, onToggle }) {
  const cfg = STATUS_CONFIG[room.status];
  const isDark = room.status === 'occupied';
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-bg anim-fade" onClick={onClose}>
      <div className="modal-box w-full max-w-sm anim-pop" onClick={e => e.stopPropagation()}>
        <div className={`px-6 pt-6 pb-5 ${isDark ? 'modal-strip-dark' : 'modal-strip-light'}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`}></span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-400'}`}>{cfg.label}</span>
              </div>
              <h2 className={`text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`} style={{letterSpacing:'-.03em'}}>Room {room.room}</h2>
              <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-400'}`}>Floor {room.floor} · {room.type}</p>
            </div>
            <button onClick={onClose}
              className={`w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 transition-colors shrink-0
                ${isDark ? 'bg-white/[.08] hover:bg-white/[.14]' : 'btn-outline'}`}>
              <Icon name="x" size={14} cls={isDark ? '[&_svg]:stroke-slate-300' : 'text-slate-400'} />
            </button>
          </div>
        </div>
        <div className="px-6 pb-6 pt-5 space-y-4">
          {room.guest ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F5F2EC] border border-[rgba(20,16,8,.07)]">
              <Av ini={ini(room.guest)} color={avColor(room.guest)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{room.guest}</p>
                <p className="text-xs text-slate-400 mt-0.5">{room.checkIn} → {room.checkOut}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{room.nights} night{room.nights > 1 ? 's' : ''}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-slate-400 mb-0.5">Total</p>
                <p className="text-sm font-bold text-teal-600">{room.total}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F5F2EC] border border-[rgba(20,16,8,.07)]">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3EE] flex items-center justify-center shrink-0">
                <Icon name="circle-check" size={17} cls="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Available</p>
                <p className="text-xs text-slate-400 mt-0.5">Ready for next guest</p>
              </div>
            </div>
          )}
          <div className="pt-1">
            {room.status === 'occupied'
              ? <button className="w-full btn-outline py-2.5 rounded-xl text-sm font-semibold text-slate-600 flex items-center justify-center gap-2" onClick={onToggle}>
                  <Icon name="circle-check" size={14} cls="text-slate-400" /> Mark as Available
                </button>
              : <button className="w-full btn-dark py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" onClick={onToggle}>
                  <Icon name="bed-double" size={14} cls="[&_svg]:stroke-white" /> Mark as Occupied
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function NewBookingModal({ availableRooms, onClose, onConfirm }) {
  const [guest,    setGuest]    = useState('');
  const [room,     setRoom]     = useState(availableRooms[0]?.room || '');
  const [checkIn,  setCheckIn]  = useState('');
  const [checkOut, setCheckOut] = useState('');
  const canSubmit = guest.trim() && room;
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-bg anim-fade" onClick={onClose}>
      <div className="modal-box w-full max-w-sm anim-pop" onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-5 modal-strip-light">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">New Reservation</p>
              <h2 className="text-2xl font-bold text-slate-800" style={{letterSpacing:'-.03em'}}>Book a Room</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg btn-outline flex items-center justify-center mt-0.5">
              <Icon name="x" size={14} cls="text-slate-400" />
            </button>
          </div>
        </div>
        <div className="px-6 pb-6 pt-5 space-y-4">
          {availableRooms.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No available rooms at the moment.</p>
          ) : (<>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Guest Name</label>
              <input className="search-input w-full px-3 py-2.5 rounded-xl text-sm"
                placeholder="Full name" value={guest} onChange={e => setGuest(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Room</label>
              <select className="search-input w-full px-3 py-2.5 rounded-xl text-sm"
                value={room} onChange={e => setRoom(e.target.value)}>
                {availableRooms.map(r => (
                  <option key={r.room} value={r.room}>Room {r.room} · {r.type} · Floor {r.floor}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Check-in</label>
                <input type="date" className="search-input w-full px-3 py-2.5 rounded-xl text-sm"
                  value={checkIn} onChange={e => setCheckIn(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Check-out</label>
                <input type="date" className="search-input w-full px-3 py-2.5 rounded-xl text-sm"
                  value={checkOut} onChange={e => setCheckOut(e.target.value)} />
              </div>
            </div>
            <button
              className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${canSubmit ? 'btn-dark' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              onClick={() => { if (canSubmit) onConfirm({room, guest: guest.trim(), checkIn, checkOut}); }}
              disabled={!canSubmit}>
              <Icon name="calendar-check" size={14} cls={canSubmit ? '[&_svg]:stroke-white' : 'text-slate-400'} />
              Confirm Booking
            </button>
          </>)}
        </div>
      </div>
    </div>
  );
}

function RoomsPage() {
  const [floor, setFloor] = useState(1);
  const [sel, setSel] = useState(null);
  const [statuses, setStatuses] = useState(() => Object.fromEntries(ALL_ROOMS.map(r => [r.room, r.status])));
  const [guestData, setGuestData] = useState({});
  const [showBooking, setShowBooking] = useState(false);

  const roomsWithStatus = ALL_ROOMS.map(r => ({...r, status: statuses[r.room], ...(guestData[r.room] || {})}));
  const floorRooms = roomsWithStatus.filter(r => r.floor === floor);
  const north = floorRooms.slice(0, 5);
  const south = floorRooms.slice(5);
  const floorLabel = ['Standard', 'Deluxe', 'Deluxe & Suite', 'Penthouse Suite'][floor - 1];

  const counts = {};
  Object.keys(STATUS_CONFIG).forEach(s => { counts[s] = floorRooms.filter(r => r.status === s).length; });
  const totalCounts = {};
  Object.keys(STATUS_CONFIG).forEach(s => { totalCounts[s] = roomsWithStatus.filter(r => r.status === s).length; });

  const availableRooms = roomsWithStatus.filter(r => r.status === 'available');
  const handleConfirmBooking = ({room, guest, checkIn, checkOut}) => {
    setStatuses(s => ({...s, [room]: 'occupied'}));
    setGuestData(g => ({...g, [room]: {guest, checkIn, checkOut}}));
    setShowBooking(false);
  };

  return (
    <div className="p-7">
      <PageHeader icon="map" title="Rooms Map" sub={`${TOTAL_ROOMS} rooms · 4 floors · Live status`}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="legend-dot" style={{background: cfg.legendBg, borderColor: key==='occupied' ? '#334155' : undefined}}></div>
            <span className="text-[11px] text-slate-500">{totalCounts[key]} {cfg.label}</span>
          </div>
        ))}
        <button className="btn-dark px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ml-1" onClick={() => setShowBooking(true)}>
          <Icon name="plus" size={14} cls="[&_svg]:stroke-white" /> New Booking
        </button>
      </PageHeader>
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <div className="flex gap-1.5">
          {[1,2,3,4].map(f => (
            <button key={f} onClick={() => setFloor(f)}
              className={`floor-btn px-4 py-2 rounded-xl text-sm font-semibold ${floor===f ? 'floor-btn-active' : ''}`}>
              F{f}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-slate-200 shrink-0"></div>
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) =>
            counts[key] > 0 ? (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-sm ${cfg.dot}`}></span>
                <span className="text-xs text-slate-500">{counts[key]} {cfg.label}</span>
              </div>
            ) : null
          )}
        </div>
      </div>
      <div className="floor-bg rounded-[14px] border border-[#D5D0CB] p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Floor {floor} — {floorLabel}</p>
          <p className="text-[11px] text-slate-400">10 rooms</p>
        </div>
        <div className="flex gap-3 items-stretch">
          <div className="service-box shrink-0 w-12" style={{justifyContent:'center'}}>
            <Icon name="arrow-up-down" size={15} cls="text-slate-400" />
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 text-center leading-tight">Lift</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#A8A39D] mb-2 pl-0.5">North Wing</p>
            <div className="grid grid-cols-5 gap-2">
              {north.map(r => <RoomCard key={r.room} room={r} onClick={setSel} />)}
            </div>
            <div className="corridor-line">
              <span className="corridor-label">Corridor · Floor {floor}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {south.map(r => <RoomCard key={r.room} room={r} onClick={setSel} />)}
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#A8A39D] mt-2 pl-0.5">South Wing</p>
          </div>
          <div className="service-box shrink-0 w-12" style={{justifyContent:'center'}}>
            <Icon name="chevrons-up" size={15} cls="text-slate-400" />
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 text-center leading-tight">Stairs</span>
          </div>
        </div>
      </div>
      <div className="card rounded-xl px-5 py-3.5 flex flex-wrap gap-x-5 gap-y-2.5 stat-card">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-full">Status Legend</p>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="legend-dot" style={{background: cfg.legendBg, borderColor: key==='occupied' ? '#334155' : undefined}}></div>
            <span className="text-xs text-slate-500">{cfg.label}</span>
          </div>
        ))}
      </div>
      {sel && <RoomMapModal
        room={{...sel, status: statuses[sel.room], ...(guestData[sel.room] || {})}}
        onClose={() => setSel(null)}
        onToggle={() => {
          const next = statuses[sel.room] === 'occupied' ? 'available' : 'occupied';
          setStatuses(s => ({...s, [sel.room]: next}));
          if (next === 'available') setGuestData(g => { const n = {...g}; delete n[sel.room]; return n; });
          setSel(null);
        }}
      />}
      {showBooking && <NewBookingModal
        availableRooms={availableRooms}
        onClose={() => setShowBooking(false)}
        onConfirm={handleConfirmBooking}
      />}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD & PAGES
═══════════════════════════════════════════════ */
function PageHeader({ icon, title, sub, children }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0">
          <Icon name={icon} size={16} cls="[&_svg]:stroke-white" />
        </div>
        <div>
          <h1 className="text-[17px] font-bold text-slate-800 leading-tight tracking-tight">{title}</h1>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-3 flex-wrap">{children}</div>}
    </div>
  );
}

function Dashboard({ onModal }) {
  return (
    <div className="p-7">
      <PageHeader icon="layout-dashboard" title="Dashboard" sub="Live operations overview" />
      <div className="grid grid-cols-12 gap-6 dash-grid">
        <div className="col-span-4 min-w-0"><OccupancyCard /></div>
        <div className="col-span-4 min-w-0"><CheckInsCard  onOpen={onModal} /></div>
        <div className="col-span-4 min-w-0"><CheckOutsCard onOpen={onModal} /></div>
        <div className="col-span-7 min-w-0"><RoomStatusCard onOpen={onModal} /></div>
        <div className="col-span-5 min-w-0"><StaffCard /></div>
      </div>
    </div>
  );
}

function Placeholder({ title, icon }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[72vh]">
      <div className="text-center">
        <div className="w-14 h-14 card rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon name={icon} size={24} cls="text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-600 mb-2">{title}</h2>
        <p className="text-slate-400 text-sm">This page is in development.</p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 btn-outline rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed">
          <Icon name="clock" size={14} cls="text-slate-400" /> Coming Soon
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   APP
═══════════════════════════════════════════════ */
const PAGE_ICONS = { rooms:'map', reservations:'calendar-check', staff:'users', inventory:'package', settings:'settings' };

function App() {
  const [page,      setPage]      = useState(() => {
    const p = new URLSearchParams(window.location.search).get('page');
    return ['dashboard','rooms','staff','inventory'].includes(p) ? p : 'dashboard';
  });
  const [modal,     setModal]     = useState(null);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sb-collapsed') === 'true');
  const [chatOpen,  setChatOpen]  = useState(false);

  const handleToggle = () => setCollapsed(c => { const next = !c; localStorage.setItem('sb-collapsed', String(next)); return next; });
  const handleNav = nextPage => {
    setPage(nextPage);
    const url = nextPage === 'dashboard' ? window.location.pathname : `${window.location.pathname}?page=${nextPage}`;
    window.history.pushState(null, '', url);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--sw', collapsed ? '68px' : '240px');
  }, [collapsed]);

  useEffect(() => {
    document.documentElement.style.setProperty('--cw', chatOpen ? '360px' : '0px');
  }, [chatOpen]);

  return (
    <div className="min-h-screen">
      <Sidebar page={page} onNav={handleNav} collapsed={collapsed} onToggle={handleToggle} />
      <div className="main-content flex flex-col min-h-screen">
        <Topbar onResult={setModal} chatOpen={chatOpen} onToggleChat={()=>setChatOpen(c=>!c)} />
        <main key={page} className="flex-1 anim-fade">
          {page==='dashboard'
            ? <Dashboard onModal={setModal} />
            : page==='rooms'
            ? <RoomsPage />
            : page==='staff'
            ? <StaffPage />
            : page==='inventory'
            ? <InventoryPage />
            : <Placeholder title={NAV.find(n=>n.page===page)?.label||page} icon={PAGE_ICONS[page]||'layers'} />
          }
        </main>
      </div>
      <ChatPanel open={chatOpen} onClose={()=>setChatOpen(false)} />
      <Modal modal={modal} onClose={()=>setModal(null)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
