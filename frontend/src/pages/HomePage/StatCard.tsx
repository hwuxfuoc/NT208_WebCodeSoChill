export default function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  const iconColor = color.match(/\[(.*?)\]/)?.[1] || 'currentColor';

  return (
    <div className={`relative overflow-hidden rounded-[18px] pl-[10px] pr-[16px] py-[16px] border-none shadow-sm flex items-center gap-2 ${color}`}>
      <div
        className="w-[44px] h-[44px] rounded-[12px] flex-shrink-0 flex items-center justify-center bg-white shadow-sm z-10"
        style={{ color: iconColor }}
      >
        {icon}
      </div>
      <div className="flex flex-col z-10">
        <strong className="text-white text-[22px] leading-[1.1] font-extrabold mb-0.5">{value}</strong>
        <span className="text-white/90 font-bold text-[12px]">{title}</span>
      </div>

      <div className="absolute -right-4 -bottom-4 text-white opacity-[0.15] z-0 pointer-events-none">
        {title === "Problems" && <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
        {title === "Contest per month" && <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>}
        {title === "Communities" && <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4" y1="12" x2="2" y2="12"></line><line x1="22" y1="12" x2="20" y2="12"></line><line x1="19.07" y1="4.93" x2="17.66" y2="6.34"></line><line x1="6.34" y1="17.66" x2="4.93" y2="19.07"></line><line x1="19.07" y1="19.07" x2="17.66" y2="17.66"></line><line x1="6.34" y1="6.34" x2="4.93" y2="4.93"></line></svg>}
      </div>
    </div>
  );
}
