export default function BannerPromo() {
  return (
    <section className="card promo relative overflow-hidden h-full flex flex-col justify-center">
      <svg className="absolute -right-4 -top-4 w-32 h-32 text-white opacity-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
      <svg className="absolute right-10 bottom-4 w-16 h-16 text-white opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      <h2 className="w-2/3 leading-tight mb-4 relative z-10">Join Now and Get Discount Voucher Up To 20%</h2>
      <p className="w-2/3 text-[13px] relative z-10">Become a membership to get more benefits! A 20% discount is currently running until the end of March</p>
    </section>
  );
}
