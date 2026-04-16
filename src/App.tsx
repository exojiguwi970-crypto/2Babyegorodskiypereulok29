import { MapPin, Compass, Trees, Waves, AlertCircle, Info, Phone, X, CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';

import img1 from '../29jk-1.jpeg';
import img2 from '../29jk-2.jpeg';
import img3 from '../29jk-3.jpeg';

// --- Components ---

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type FormState = 'idle' | 'loading' | 'success';

function LeadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState<FormState>('idle');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setState('loading');
    try {
      await fetch('https://lidoweb.vercel.app/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, site: 'ЖК 2-й Бабьегородский, 29' }),
      });
    } catch (_) {}
    setState('success');
    onSuccess?.();
  };

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-6 gap-4 text-center"
      >
        <CheckCircle className="w-10 h-10 text-accent" />
        <p className="text-main text-lg font-medium">Заявка принята!</p>
        <p className="text-muted text-sm">Менеджер свяжется с вами в течение 15 минут</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)}
        className="border border-border px-4 py-3 text-sm text-main bg-white focus:outline-none focus:border-accent transition-colors placeholder:text-muted" />
      <input type="tel" placeholder="Телефон *" required value={phone} onChange={(e) => setPhone(e.target.value)}
        className="border border-border px-4 py-3 text-sm text-main bg-white focus:outline-none focus:border-accent transition-colors placeholder:text-muted" />
      <button type="submit" disabled={state === 'loading'}
        className="bg-accent text-white px-6 py-3 text-[11px] tracking-[2px] uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
        {state === 'loading' ? 'Отправка...' : 'Узнать цену'}
      </button>
      <p className="text-muted text-[10px] leading-relaxed">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
    </form>
  );
}

function LeadModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center px-4 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
        transition={{ ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-border w-full max-w-md p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-main transition-colors">
          <X className="w-5 h-5" />
        </button>
        <span className="text-[10px] uppercase tracking-[2px] text-muted block mb-2">Старт продаж · Делюкс</span>
        <h3 className="font-serif text-2xl font-normal text-main mb-2">2-й Бабьегородский, 29</h3>
        <p className="text-muted text-sm mb-6 leading-relaxed">Оставьте заявку — получите цены и планировки первыми</p>
        <LeadForm onSuccess={() => setTimeout(onClose, 2500)} />
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yParallax = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-bg text-main selection:bg-accent selection:text-white" ref={containerRef}>

      <AnimatePresence>{modalOpen && <LeadModal onClose={() => setModalOpen(false)} />}</AnimatePresence>

      {/* Floating CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}
        className="fixed bottom-6 right-6 z-50">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-accent text-white px-5 py-3 text-[11px] tracking-[1px] uppercase font-medium shadow-2xl">
          <Phone className="w-4 h-4" />
          Обсудить детали с менеджером
        </motion.button>
      </motion.div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/95 backdrop-blur-sm text-main border-b border-border">
        <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center text-[11px] tracking-[2px] uppercase">
          <div className="font-bold">Бабьегородский 29</div>
          <div className="hidden md:flex gap-8">
            <a href="#params" className="text-muted hover:text-main transition-colors">Параметры</a>
            <a href="#location" className="text-muted hover:text-main transition-colors">Локация</a>
            <a href="#architecture" className="text-muted hover:text-main transition-colors">Архитектура</a>
            <a href="#zayavka" className="text-muted hover:text-main transition-colors">Заявка</a>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="bg-accent text-white px-5 py-2.5 font-medium hover:opacity-90 transition-opacity">
            Следить за стартом
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-8 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 flex flex-col justify-center">
            <FadeIn>
              <span className="text-[11px] uppercase tracking-[2px] text-muted mb-4 block">Москва · Якиманка · Делюкс</span>
              <h1 className="font-serif font-normal text-[48px] md:text-[56px] leading-[1.1] mb-8">
                2-й Бабьегородский переулок, 29
              </h1>
              <p className="text-[16px] leading-[1.6] text-muted mb-12 max-w-md">
                Элитный жилой комплекс на месте старых административных зданий. Камерный редевелопмент у парка «Музеон». Авторская архитектура в одном из лучших районов ЦАО.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="border-t border-border pt-3">
                  <div className="text-[10px] uppercase tracking-[1px] text-muted mb-1.5">Класс</div>
                  <div className="text-[14px] font-medium">Делюкс</div>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="text-[10px] uppercase tracking-[1px] text-muted mb-1.5">Объем</div>
                  <div className="text-[14px] font-medium">2 корпуса</div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setModalOpen(true)}
                  className="bg-accent text-white px-7 py-3.5 text-[11px] tracking-[2px] uppercase font-medium hover:opacity-90 transition-opacity">
                  Узнать цену
                </button>
                <button onClick={() => setModalOpen(true)}
                  className="border border-border text-main px-7 py-3.5 text-[11px] tracking-[2px] uppercase font-medium hover:border-accent transition-colors">
                  Записаться
                </button>
              </div>
            </FadeIn>
          </div>
          <div className="flex-1 bg-visual-bg p-8 md:p-16 flex justify-center items-center relative border border-border/50">
            <FadeIn delay={0.2} className="w-full">
              <motion.div style={{ y: yParallax }} className="w-full shadow-[0_40px_80px_rgba(0,0,0,0.05)] bg-white overflow-hidden relative group">
                <img src={img1} alt="ЖК 2-й Бабьегородский 29 — фасад"
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute bottom-6 right-6 bg-accent text-white px-5 py-3 text-[12px] tracking-[1px] uppercase shadow-lg">
                  Подготовка проекта
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Parameters */}
      <section id="params" className="py-24 px-8 max-w-6xl mx-auto border-t border-border">
        <FadeIn>
          <span className="text-[11px] uppercase tracking-[2px] text-muted mb-10 block">Параметры проекта</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Локация', value: 'Якиманка, ЦАО' },
              { label: 'Высотность', value: '9–11 этажей' },
              { label: 'Площадь участ.', value: '~0,1 га' },
              { label: 'Паркинг', value: 'Подземный' },
            ].map((s, i) => (
              <div key={i} className="border-t border-border pt-3">
                <div className="text-[10px] uppercase tracking-[1px] text-muted mb-1.5">{s.label}</div>
                <div className="text-[14px] font-medium">{s.value}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Location */}
      <section id="location" className="py-24 px-8 bg-visual-bg relative border-t border-border flex justify-center">
        <div className="w-full max-w-4xl bg-white p-12 md:p-16 shadow-[0_40px_80px_rgba(0,0,0,0.02)] border border-border">
          <FadeIn>
            <span className="text-[11px] uppercase tracking-[2px] text-muted mb-10 block">Пешком от комплекса</span>
            <div className="flex flex-col gap-6">
              {[
                { icon: <Trees className="w-4 h-4 opacity-70" />, name: 'Парк искусств «Музеон»', time: '2 мин.' },
                { icon: <Compass className="w-4 h-4 opacity-70" />, name: 'Метро «Октябрьская»', time: '6 мин.' },
                { icon: <Trees className="w-4 h-4 opacity-70" />, name: 'Парк Горького', time: '10 мин.' },
                { icon: <Waves className="w-4 h-4 opacity-70" />, name: 'Крымская набережная', time: '15 мин.' },
                { icon: <MapPin className="w-4 h-4 opacity-70" />, name: 'Красная площадь', time: '20 мин.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[13px] border-b border-dashed border-border pb-3">
                  <span className="flex items-center gap-3 text-muted">{item.icon}{item.name}</span>
                  <strong className="text-[14px] font-medium text-main">{item.time}</strong>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-24 px-8 max-w-6xl mx-auto border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <div className="order-2 lg:order-1 flex justify-center w-full">
            <FadeIn className="w-full">
              <div className="relative shadow-[0_40px_80px_rgba(0,0,0,0.05)] w-full max-w-[420px] mx-auto bg-white p-6 border border-border">
                <img src={img2} alt="ЖК 2-й Бабьегородский 29 — архитектурная концепция"
                  className="w-full aspect-[4/5] object-cover" />
              </div>
            </FadeIn>
          </div>
          <div className="order-1 lg:order-2">
            <FadeIn>
              <span className="text-[11px] uppercase tracking-[2px] text-muted mb-4 block">Архитектура</span>
              <h2 className="font-serif text-[36px] md:text-[42px] font-normal leading-[1.1] mb-6">
                Ансамбль контрастов от <i className="text-muted">«Сивил»</i>
              </h2>
              <p className="text-[16px] leading-[1.6] text-muted mb-10">
                Два корпуса в едином ансамбле. Строгий минимализм и контрастные черно-белые фасады подчёркивают статус комплекса делюкс-класса.
              </p>
              <div className="space-y-6">
                {[
                  'Малое количество квартир для настоящей клубной атмосферы',
                  'Приватный благоустроенный внутренний двор',
                  'Вместительный подземный паркинг для резидентов',
                  'Панорамное остекление и собственные террасы',
                ].map((item, i) => (
                  <div key={i} className="border-t border-border pt-4">
                    <div className="text-[14px] font-medium">{item}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section id="zayavka" className="py-24 px-8 border-t border-border bg-visual-bg">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <span className="text-[11px] uppercase tracking-[2px] text-muted mb-4 block">Старт продаж</span>
            <h3 className="font-serif text-[32px] font-normal text-main mb-6 leading-tight">
              Узнайте цену<br /><i className="text-muted">первыми</i>
            </h3>
            <ul className="space-y-0">
              {['Актуальные цены на старте продаж', 'Все доступные планировки', 'Условия рассрочки и ипотеки', 'Приоритетный выбор этажа и вида'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 border-t border-border py-3 text-muted text-sm">
                  <span className="w-1 h-1 rounded-full bg-muted flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="bg-white border border-border p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
              <p className="text-main font-medium text-lg mb-6">Оставьте заявку</p>
              <LeadForm />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-8 max-w-6xl mx-auto border-t border-border">
        <FadeIn>
          <span className="text-[11px] uppercase tracking-[2px] text-muted mb-10 block">Визуализации</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[img1, img2, img3].map((src, i) => (
              <div key={i} className="overflow-hidden border border-border group">
                <img src={src} alt={`ЖК 2-й Бабьегородский 29 — визуализация ${i + 1}`}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Potential & Risks */}
      <section className="py-24 px-8 border-t border-border bg-bg">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-[11px] uppercase tracking-[2px] text-muted mb-4 block">Перспектива</span>
              <h2 className="font-serif text-[36px] md:text-[42px] font-normal leading-[1.1]">Потенциал & <i className="text-muted">Статус</i></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-border p-10 bg-white">
                <h3 className="text-[10px] uppercase font-bold tracking-[2px] text-muted mb-6 border-b border-border pb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Преимущества
                </h3>
                <p className="text-[14px] leading-[1.6] text-main">Высочайший спрос на элитное жилье в Якиманке. Камерный редевелопмент в центре города гарантирует эксклюзивность, высокую ликвидность и приватную атмосферу.</p>
              </div>
              <div className="border border-border p-10 bg-white">
                <h3 className="text-[10px] uppercase font-bold tracking-[2px] text-muted mb-6 border-b border-border pb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Нюансы
                </h3>
                <p className="text-[14px] leading-[1.6] text-main">Проект находится на стадии согласования. Возможны вопросы к прозрачности девелопера до старта продаж.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-8 border-t border-border bg-visual-bg">
        <div className="max-w-3xl mx-auto">
          <FadeIn><span className="text-[11px] uppercase tracking-[2px] text-muted mb-16 block">Вопросы и ответы</span></FadeIn>
          <div className="divide-y divide-border">
            {[
              { q: 'Когда старт продаж ЖК 2-й Бабьегородский 29?', a: 'Проект на стадии согласования. Оставьте заявку — сообщим о старте первыми.' },
              { q: 'Сколько этажей в ЖК 2-й Бабьегородский 29?', a: '9–11 этажей. Камерный клубный формат с малым количеством квартир.' },
              { q: 'Как добраться до 2-го Бабьегородского переулка, 29?', a: 'Метро «Октябрьская» — 6 минут пешком. Рядом Крымская набережная и парк Горького.' },
              { q: 'Какой класс жилья в ЖК Бабьегородский 29?', a: 'Делюкс. Авторская архитектура от бюро «Сивил», черно-белые фасады, приватный двор.' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <details className="group py-6 cursor-pointer">
                  <summary className="flex justify-between items-center text-main font-medium text-[15px] list-none">
                    {item.q}
                    <span className="text-muted group-open:rotate-45 transition-transform duration-300 text-2xl leading-none ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-4 text-muted text-[14px] leading-relaxed">{item.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-visual-bg py-20 px-8 border-t border-border text-center">
        <FadeIn>
          <p className="font-serif font-normal text-[24px] md:text-[28px] italic text-muted max-w-2xl mx-auto mb-16">
            «Минимализм и контраст в сердце города»
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-[10px] tracking-[2px] uppercase text-muted">
            <span>© {new Date().getFullYear()} Неофициальное превью</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-border" />
            <span>2-й Бабьегородский переулок, 29</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-border" />
            <span>Якиманка, ЦАО</span>
          </div>
        </FadeIn>
      </footer>
    </div>
  );
}
