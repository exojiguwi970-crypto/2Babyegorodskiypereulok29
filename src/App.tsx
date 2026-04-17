import { motion, AnimatePresence } from 'motion/react';
import { ReactNode, useState } from 'react';
import { MapPin, Compass, Trees, Waves, Phone, X, CheckCircle, ArrowDown } from 'lucide-react';

import img1 from '../29jk-1.jpeg';
import img2 from '../29jk-2.jpeg';
import img3 from '../29jk-3.jpeg';

// ─── Palette ────────────────────────────────────────────────
const CREAM  = '#EDEBE6';
const DARK   = '#1B1B19';
const MID    = '#7A7772';

async function collectMeta() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const utm = utmKeys.filter(k => params.get(k)).map(k => `${k}=${params.get(k)}`).join(' / ');
  const ref = document.referrer;
  const referrer = ref ? (() => { try { return new URL(ref).hostname; } catch { return ref; } })() : 'Прямой заход';
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  const browser = /Edg/.test(ua) ? 'Edge' : /Chrome/.test(ua) ? 'Chrome' : /Firefox/.test(ua) ? 'Firefox' : /Safari/.test(ua) ? 'Safari' : 'Другой';
  const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac/.test(ua) ? 'macOS' : 'Другое';
  const device = `${isMobile ? 'Мобильный' : 'Десктоп'} · ${browser} · ${os}`;
  let city = '';
  try { const g = await fetch('https://ipapi.co/json/').then(r => r.json()); city = g.city ? `${g.city}, ${g.country_name}` : ''; } catch (_) {}
  return { utm, referrer, device, city };
}

// ─── Helpers ────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Lead Form ───────────────────────────────────────────────
type FS = 'idle' | 'loading' | 'success';

function LeadForm({ dark = false, onSuccess }: { dark?: boolean; onSuccess?: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+7');
  const [state, setState] = useState<FS>('idle');
  const [phoneError, setPhoneError] = useState(false);

  const inputCls = dark
    ? 'bg-transparent border-b border-white/30 text-white placeholder:text-white/40 focus:border-white/70 py-3 text-sm w-full outline-none transition-colors'
    : 'bg-transparent border-b border-[#1B1B19]/30 text-[#1B1B19] placeholder:text-[#1B1B19]/40 focus:border-[#1B1B19]/70 py-3 text-sm w-full outline-none transition-colors';

  const btnCls = dark
    ? 'w-full bg-[#EDEBE6] text-[#1B1B19] py-3.5 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-white transition-colors mt-2'
    : 'w-full bg-[#1B1B19] text-[#EDEBE6] py-3.5 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-black transition-colors mt-2';

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 11) { setPhoneError(true); return; }
    setState('loading');
    const meta = await collectMeta();
    try {
      await fetch('https://lidoweb-theta.vercel.app/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, site: 'ЖК 2-й Бабьегородский, 29', ...meta }),
      });
    } catch (_) {}
    setState('success');
    onSuccess?.();
  };

  if (state === 'success') return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4 py-8 text-center">
      <CheckCircle className={`w-10 h-10 ${dark ? 'text-white/60' : 'text-[#1B1B19]/60'}`} />
      <p className={`font-light text-lg ${dark ? 'text-white' : 'text-[#1B1B19]'}`}>Заявка принята</p>
      <p className={`text-sm ${dark ? 'text-white/50' : 'text-[#7A7772]'}`}>Свяжемся в течение 15 минут</p>
    </motion.div>
  );

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <input type="text" placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value.replace(/[^а-яёА-ЯЁa-zA-Z\s\-]/g, ''))} className={inputCls} />
      <input
        type="tel"
        placeholder="+7 XXX XXX XX XX"
        value={phone}
        onChange={e => {
          const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
          if (!raw) { setPhone('+7'); setPhoneError(false); return; }
          let d = raw.startsWith('8') ? '7' + raw.slice(1) : raw.startsWith('7') ? raw : '7' + raw;
          d = d.slice(0, 11);
          let s = '+' + d[0];
          if (d.length > 1) s += ' ' + d.slice(1, 4);
          if (d.length > 4) s += ' ' + d.slice(4, 7);
          if (d.length > 7) s += ' ' + d.slice(7, 9);
          if (d.length > 9) s += ' ' + d.slice(9, 11);
          setPhone(s);
          setPhoneError(false);
        }}
        onFocus={() => { if (!phone) setPhone('+7'); }}
        className={inputCls}
      />
      {phoneError && <p className={`text-[11px] -mt-2 ${dark ? 'text-red-400' : 'text-red-500'}`}>Введите российский номер: +7 XXX XXX XX XX</p>}
      <button type="submit" disabled={state === 'loading'} className={btnCls}>
        {state === 'loading' ? 'Отправка...' : 'Узнать цену'}
      </button>
      <p className={`text-[10px] leading-relaxed ${dark ? 'text-white/30' : 'text-[#7A7772]'}`}>
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  );
}

// ─── Modal ───────────────────────────────────────────────────
function LeadModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex"
      onClick={onClose}>
      {/* dark half */}
      <div className="hidden md:block md:w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${img3})` }}>
        <div className="w-full h-full bg-[#1B1B19]/70" />
      </div>
      {/* form half */}
      <motion.div
        initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-1/2 h-full bg-[#1B1B19] flex flex-col justify-center px-10 md:px-16 relative"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">Якиманка · Делюкс</p>
        <h3 className="font-serif text-4xl font-light text-white mb-2 leading-tight">
          2-й Бабьегородский,<br />29
        </h3>
        <div className="w-8 h-px bg-white/30 my-6" />
        <p className="text-white/50 text-sm font-light mb-10 leading-relaxed">
          Получите актуальные цены и планировки первыми
        </p>
        <LeadForm dark onSuccess={() => setTimeout(onClose, 2500)} />
      </motion.div>
    </motion.div>
  );
}

// ─── App ─────────────────────────────────────────────────────
export default function App() {
  const [modal, setModal] = useState(false);

  return (
    <div className="bg-[#EDEBE6] text-[#1B1B19]">
      <AnimatePresence>{modal && <LeadModal onClose={() => setModal(false)} />}</AnimatePresence>

      {/* Floating CTA */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={() => setModal(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#1B1B19] text-[#EDEBE6] px-5 py-3 text-[10px] tracking-[0.2em] uppercase shadow-2xl">
        <Phone className="w-3.5 h-3.5" />
        Обсудить детали с менеджером
      </motion.button>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-[#EDEBE6]/90 backdrop-blur-sm border-b border-[#1B1B19]/10">
        <span className="text-[11px] tracking-[0.25em] uppercase font-medium">Бабьегородский 29</span>
        <div className="hidden md:flex gap-8 text-[10px] tracking-[0.2em] uppercase text-[#7A7772]">
          <a href="#params" className="hover:text-[#1B1B19] transition-colors">Проект</a>
          <a href="#location" className="hover:text-[#1B1B19] transition-colors">Локация</a>
          <a href="#gallery" className="hover:text-[#1B1B19] transition-colors">Галерея</a>
          <a href="#zayavka" className="hover:text-[#1B1B19] transition-colors">Заявка</a>
        </div>
        <button onClick={() => setModal(true)}
          className="border border-[#1B1B19] text-[#1B1B19] px-5 py-2 text-[10px] tracking-[0.2em] uppercase hover:bg-[#1B1B19] hover:text-[#EDEBE6] transition-all">
          Следить за стартом
        </button>
      </nav>

      {/* ── HERO ── full-screen photo with light overlay */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img1})` }}>
          {/* light vignette from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#EDEBE6] via-[#EDEBE6]/10 to-transparent" />
          {/* subtle top bar */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#EDEBE6]/30 via-transparent to-transparent" />
        </div>

        {/* bottom-left text */}
        <div className="absolute bottom-16 left-8 md:left-16 z-10 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#1B1B19]/60 mb-4">Москва · Якиманка · Делюкс</p>
            <h1 className="font-serif font-light text-[52px] md:text-[72px] leading-[0.95] text-[#1B1B19]">
              2-й Бабьегородский<br />
              <span style={{ color: MID }}>переулок,</span> 29
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 flex gap-4">
            <button onClick={() => setModal(true)}
              className="bg-[#1B1B19] text-[#EDEBE6] px-7 py-3.5 text-[10px] tracking-[0.2em] uppercase hover:bg-black transition-colors">
              Узнать цену
            </button>
            <button onClick={() => setModal(true)}
              className="border border-[#1B1B19]/40 text-[#1B1B19] px-7 py-3.5 text-[10px] tracking-[0.2em] uppercase hover:border-[#1B1B19] transition-colors">
              Записаться
            </button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 right-8 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#1B1B19]/50">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          Листать
        </motion.div>
      </section>

      {/* ── INTRO ── dark section */}
      <section className="bg-[#1B1B19] py-28 px-8 md:px-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <FadeIn>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6">О проекте</p>
            <h2 className="font-serif font-light text-[42px] md:text-[56px] leading-[1.0] text-white">
              Камерный<br />редевелопмент<br />
              <em className="text-white/40">в сердце Москвы</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="w-8 h-px bg-white/20 mb-8" />
            <p className="text-white/60 font-light text-base leading-relaxed mb-10">
              Элитный жилой комплекс на месте старых административных зданий в Якиманке.
              Авторская архитектура бюро «Сивил» — два корпуса с контрастными черно-белыми фасадами
              у парка искусств «Музеон».
            </p>
            <div className="grid grid-cols-2 gap-8">
              {[
                { v: '9–11', u: 'этажей' },
                { v: '2', u: 'корпуса' },
                { v: 'Делюкс', u: 'класс' },
                { v: 'Якиманка', u: 'ЦАО' },
              ].map((s, i) => (
                <div key={i} className="border-t border-white/10 pt-4">
                  <div className="text-3xl font-light text-white mb-1">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-white/30">{s.u}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PARAMS ── light section */}
      <section id="params" className="py-28 px-8 md:px-20 bg-[#EDEBE6]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7A7772] mb-16">Параметры проекта</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-l border-[#1B1B19]/10">
            {[
              { label: 'Локация', value: 'Якиманка, ЦАО' },
              { label: 'Высотность', value: '9–11 этажей' },
              { label: 'Корпуса', value: '2 корпуса' },
              { label: 'Паркинг', value: 'Подземный' },
              { label: 'Класс', value: 'Делюкс' },
              { label: 'Архитектура', value: '«Сивил»' },
              { label: 'Двор', value: 'Закрытый' },
              { label: 'Парк', value: 'Музеон — 2 мин.' },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="border-r border-b border-[#1B1B19]/10 p-6">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-[#7A7772] mb-2">{s.label}</div>
                  <div className="text-[15px] font-light text-[#1B1B19]">{s.value}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO FULL ── second photo full-bleed dark */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img2})` }}>
          <div className="absolute inset-0 bg-[#1B1B19]/50" />
        </div>
        <FadeIn className="relative z-10 h-full flex flex-col justify-end pb-16 px-8 md:px-20">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">Архитектура</p>
          <h2 className="font-serif font-light text-[40px] md:text-[56px] text-white leading-tight max-w-xl">
            Ансамбль контрастов<br />
            <em className="text-white/50">от бюро «Сивил»</em>
          </h2>
        </FadeIn>
      </section>

      {/* ── ARCHITECTURE DETAIL ── light */}
      <section className="py-28 px-8 md:px-20 bg-[#EDEBE6]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20">
          <FadeIn>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7A7772] mb-8">Концепция</p>
            <p className="text-[#1B1B19]/70 font-light text-base leading-relaxed mb-10">
              Строгий минимализм и контрастные черно-белые фасады, подчёркивающие статус
              комплекса. Малое количество квартир формирует настоящую клубную атмосферу.
            </p>
            <div className="space-y-0 border-t border-[#1B1B19]/10">
              {[
                'Клубный формат — малое количество квартир',
                'Приватный благоустроенный двор',
                'Подземный паркинг для резидентов',
                'Панорамное остекление и террасы',
                'Консьерж-сервис',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b border-[#1B1B19]/10 text-[13px] font-light text-[#1B1B19]/70">
                  <span className="text-[#7A7772] text-[10px]">0{i + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.15} className="flex items-start">
            <div className="w-full border border-[#1B1B19]/10 overflow-hidden">
              <img src={img2} alt="ЖК 2-й Бабьегородский 29 — архитектура"
                className="w-full object-cover aspect-[4/5]" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── LOCATION ── dark */}
      <section id="location" className="bg-[#1B1B19] py-28 px-8 md:px-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-16">Пешком от комплекса</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-0">
              {[
                { icon: <Trees className="w-4 h-4" />, name: 'Парк искусств «Музеон»', time: '2 мин.' },
                { icon: <Compass className="w-4 h-4" />, name: 'Метро «Октябрьская»', time: '6 мин.' },
                { icon: <Trees className="w-4 h-4" />, name: 'Парк Горького', time: '10 мин.' },
                { icon: <Waves className="w-4 h-4" />, name: 'Крымская набережная', time: '15 мин.' },
                { icon: <MapPin className="w-4 h-4" />, name: 'Красная площадь', time: '20 мин.' },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <div className="flex items-center justify-between py-5 border-b border-white/10">
                    <span className="flex items-center gap-4 text-white/50 text-[13px] font-light">
                      <span className="text-white/20">{item.icon}</span>
                      {item.name}
                    </span>
                    <span className="text-white text-[13px] font-light">{item.time}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.2}>
              <div className="border border-white/10 overflow-hidden">
                <img src={img1} alt="ЖК 2-й Бабьегородский 29 — вид"
                  className="w-full object-cover aspect-square" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── light */}
      <section id="gallery" className="py-28 px-8 md:px-20 bg-[#EDEBE6]">
        <FadeIn>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#7A7772] mb-16">Визуализации</p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[img1, img2, img3].map((src, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="overflow-hidden border border-[#1B1B19]/8 group">
                <img src={src} alt={`ЖК 2-й Бабьегородский 29 — визуализация ${i + 1}`}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── LEAD FORM ── split dark/light */}
      <section id="zayavka" className="flex flex-col md:flex-row min-h-[60vh]">
        {/* left dark */}
        <div className="w-full md:w-1/2 bg-[#1B1B19] p-12 md:p-20 flex flex-col justify-center">
          <FadeIn>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6">Старт продаж</p>
            <h3 className="font-serif font-light text-[42px] text-white leading-tight mb-8">
              Узнайте цену<br />
              <em className="text-white/40">первыми</em>
            </h3>
            <div className="w-8 h-px bg-white/20 mb-8" />
            <ul className="space-y-0">
              {['Актуальные цены', 'Все планировки', 'Ипотека и рассрочка', 'Приоритетный выбор'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 py-4 border-b border-white/10 text-[13px] font-light text-white/50">
                  <span className="text-white/20 text-[10px]">0{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
        {/* right light */}
        <div className="w-full md:w-1/2 bg-[#EDEBE6] p-12 md:p-20 flex flex-col justify-center">
          <FadeIn delay={0.1}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7A7772] mb-8">Оставить заявку</p>
            <LeadForm />
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── light */}
      <section className="py-28 px-8 md:px-20 bg-[#EDEBE6] border-t border-[#1B1B19]/10">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#7A7772] mb-16">Вопросы и ответы</p>
          </FadeIn>
          {[
            { q: 'Когда старт продаж ЖК 2-й Бабьегородский 29?', a: 'Проект на стадии согласования. Оставьте заявку — сообщим о старте первыми.' },
            { q: 'Сколько этажей в ЖК 2-й Бабьегородский 29?', a: '9–11 этажей. Клубный формат с малым количеством квартир.' },
            { q: 'Как добраться до 2-го Бабьегородского переулка, 29?', a: 'Метро «Октябрьская» — 6 минут пешком. Рядом Крымская набережная и парк Горького.' },
            { q: 'Какой класс жилья?', a: 'Делюкс. Авторская архитектура бюро «Сивил», черно-белые фасады, приватный двор.' },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <details className="group border-b border-[#1B1B19]/10 py-6 cursor-pointer">
                <summary className="flex justify-between items-center text-[#1B1B19] font-light text-[15px] list-none">
                  {item.q}
                  <span className="text-[#7A7772] group-open:rotate-45 transition-transform duration-300 text-xl leading-none ml-4 flex-shrink-0">+</span>
                </summary>
                <p className="mt-4 text-[#7A7772] text-[13px] font-light leading-relaxed">{item.a}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── dark */}
      <footer className="bg-[#1B1B19] py-16 px-8 md:px-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <p className="font-serif font-light text-white/30 text-[28px] italic mb-6">
              «Минимализм и контраст<br />в сердце города»
            </p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/20">
              © {new Date().getFullYear()} · 2-й Бабьегородский переулок, 29
            </p>
          </div>
          <div className="text-[10px] tracking-[0.15em] uppercase text-white/20 text-left md:text-right leading-relaxed">
            Якиманка · ЦАО · Москва<br />
            Неофициальное превью<br />
            Не является публичной офертой
          </div>
        </div>
      </footer>
    </div>
  );
}
