import React, { useEffect, useRef } from 'react';
import { Store, UserPlus, ArrowRight, ShieldCheck, TrendingUp, Clock, Star } from 'lucide-react';
import PageDecorations from './PageDecorations';

interface Props {
  onSelectRegister: () => void;
  onSelectLogin: () => void;
}

const Landing: React.FC<Props> = ({ onSelectRegister, onSelectLogin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16,185,129,${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${p.opacity})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const stats = [
    { value: '120s', label: 'Max Handoff' },
    { value: '24/7', label: 'Uptime' },
    { value: '0', label: 'Upfront Cost' },
    { value: '100%', label: 'Contactless' },
  ];

  return (
    <div className="flex-1 flex flex-col relative" style={{ minHeight: 'calc(100vh - 130px)' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Reusable Cinematic Decorations */}
      <PageDecorations variant="landing" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-10 px-5">
        <div className="animate-slideUp delay-100 flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-[9px] font-black tracking-widest uppercase text-brand-emerald animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
          Welcome to the Future of Retail
        </div>

        <div className="animate-slideUp delay-200 text-center mb-4">
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tighter mb-1 select-none">
            Grow your vendor
          </h1>
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tighter shimmer-text select-none">
            exponentially.
          </h1>
        </div>

        <p className="animate-slideUp delay-300 text-center max-w-lg mb-10 text-sm opacity-60 leading-relaxed font-medium">
          Join the Bezaw Partner network — the state-of-the-art curbside retail infrastructure in Ethiopia.
          Register in minutes, scale for years.
        </p>

        <div className="animate-slideUp delay-400 flex flex-wrap justify-center gap-2 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="px-5 py-3 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/10 text-center min-w-[110px] hover:bg-brand-emerald/10 transition-all hover:scale-105">
              <div className="font-display font-black text-2xl text-brand-emerald">{s.value}</div>
              <div className="text-[9px] font-black tracking-widest uppercase opacity-40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="animate-slideUp delay-500 grid sm:grid-cols-2 gap-6 w-full max-w-3xl">
          <button
            onClick={onSelectRegister}
            className="glass group p-8 rounded-[2.5rem] text-left hover:scale-[1.03] transition-all duration-500 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-emerald to-brand-dark flex items-center justify-center mb-6 shadow-glow">
              <UserPlus size={28} className="text-white" />
            </div>
            <h3 className="font-display font-black text-xl mb-2">Register Vendor</h3>
            <p className="text-sm opacity-60 mb-6 leading-relaxed">
              New to the platform? Create your primary business profile and start onboarding.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-black tracking-widest uppercase text-brand-emerald group-hover:translate-x-2 transition-transform">
              Begin Journey <ArrowRight size={16} />
            </div>
          </button>

          <button
            onClick={onSelectLogin}
            className="glass group p-8 rounded-[2.5rem] text-left hover:scale-[1.03] transition-all duration-500 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center mb-6 transition-all group-hover:bg-brand-emerald/20">
              <Store size={28} className="text-brand-emerald" />
            </div>
            <h3 className="font-display font-black text-xl mb-2">Branch Portal</h3>
            <p className="text-sm opacity-60 mb-6 leading-relaxed">
              Already a partner? Access your branch dashboard to manage staff and physical locations.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-black tracking-widest uppercase opacity-60 group-hover:text-brand-emerald group-hover:opacity-100 group-hover:translate-x-2 transition-all">
              Login to Portal <ArrowRight size={16} />
            </div>
          </button>
        </div>

        <div className="animate-slideUp delay-[600ms] flex flex-wrap justify-center gap-10 mt-16 opacity-40">
          {[
            { icon: <ShieldCheck size={16} />, text: 'Encrypted' },
            { icon: <Clock size={16} />, text: '5-Day Setup' },
            { icon: <TrendingUp size={16} />, text: 'High Growth' },
            { icon: <Star size={16} />, text: 'Premium' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
              {item.icon} {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;