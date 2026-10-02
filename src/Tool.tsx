// Kitful: a media kit page with audience numbers, rates and past partners, shared as a single link.
import { moneyFmt } from "./lib/money";
import { uid, useStored } from "./lib/store";
import { useShared } from "./lib/useShared";
import { CurrencySelect, Section, ShareBox } from "./ui/kit";

const T = "kitful";
type Platform = { id: string; name: string; handle: string; followers: number; avgViews: number; engagement: number };
type Rate = { id: string; what: string; price: number };
type Kit = {
  name: string; tagline: string; bio: string; email: string; location: string; color: string; currency: string;
  platforms: Platform[]; rates: Rate[]; brands: string; audience: { women: number; age: string; topCountries: string }; updated: string;
};
const SAMPLE: Kit = {
  name: "Hana Studio", tagline: "Slow ceramics, honest pricing, and the mess in between.", email: "hello@hanastudio.tn", location: "Nabeul, Tunisia", color: "#FF6C2F", currency: "USD",
  bio: "I make functional ceramics and film the whole process, failures included. My audience is makers and small shop owners who want to turn a craft into a living.",
  platforms: [
    { id: "p1", name: "Instagram", handle: "@hanastudio", followers: 48200, avgViews: 21000, engagement: 6.1 },
    { id: "p2", name: "TikTok", handle: "@hana.clay", followers: 132000, avgViews: 64000, engagement: 8.4 },
    { id: "p3", name: "YouTube", handle: "Hana Studio", followers: 18500, avgViews: 9400, engagement: 5.2 },
  ],
  rates: [{ id: "r1", what: "Instagram Reel", price: 450 }, { id: "r2", what: "TikTok video", price: 600 }, { id: "r3", what: "YouTube integration (60s)", price: 900 }],
  brands: "Glazeco, Atelier Tools, Maison Jasmin",
  audience: { women: 68, age: "25 to 34", topCountries: "Tunisia, France, Canada" },
  updated: new Date().toISOString().slice(0, 10),
};
const short = (n: number) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}K` : String(n);

function KitPage({ kit }: { kit: Kit }) {
  const money = moneyFmt(kit.currency);
  const reach = kit.platforms.reduce((a, p) => a + p.followers, 0);
  return (
    <article className="kf" style={{ ["--kc" as string]: kit.color }}>
      <header className="kf-head">
        <p className="kf-eyebrow">Media kit · {kit.location}</p>
        <h2>{kit.name}</h2>
        <p className="kf-tag">{kit.tagline}</p>
      </header>
      <div className="kf-big">
        <div><b>{short(reach)}</b><span>Total followers</span></div>
        <div><b>{short(kit.platforms.reduce((a, p) => a + p.avgViews, 0))}</b><span>Average views per post, all platforms</span></div>
        <div><b>{kit.audience.women}%</b><span>Women</span></div>
        <div><b>{kit.audience.age}</b><span>Main age group</span></div>
      </div>
      <p className="kf-bio">{kit.bio}</p>
      <div className="kf-grid">
        {kit.platforms.map(p => (
          <div key={p.id} className="kf-card">
            <p className="kf-eyebrow">{p.name}</p><strong>{p.handle}</strong>
            <dl><div><dt>Followers</dt><dd>{short(p.followers)}</dd></div><div><dt>Avg views</dt><dd>{short(p.avgViews)}</dd></div><div><dt>Engagement</dt><dd>{p.engagement}%</dd></div></dl>
          </div>
        ))}
      </div>
      <div className="kf-two">
        <div><p className="kf-eyebrow">Rates</p><table className="t"><tbody>{kit.rates.map(r => <tr key={r.id}><td>{r.what}</td><td className="r"><strong>{money(r.price)}</strong></td></tr>)}</tbody></table></div>
        <div><p className="kf-eyebrow">Audience</p><p>Top countries: {kit.audience.topCountries}</p>{kit.brands && <><p className="kf-eyebrow" style={{ marginTop: 14 }}>Worked with</p><p>{kit.brands}</p></>}</div>
      </div>
      <footer className="kf-foot"><span>{kit.email}</span><span>Numbers updated {kit.updated}</span></footer>
    </article>
  );
}

export default function Kitful() {
  const shared = useShared<Kit>();
  const [kit, setKit] = useStored<Kit>(T, "kit", SAMPLE);
  const style = <style>{`.kf{background:#fff;color:#151933;border-radius:14px;overflow:hidden;box-shadow:var(--shadow)}.kf-head{background:var(--kc);color:#fff;padding:36px 32px}.kf-head h2{font-size:clamp(40px,6vw,64px);line-height:1}.kf-tag{font-size:18px;margin-top:8px;opacity:.95}
  .kf-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.75;margin-bottom:6px}.kf-big{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:#e3e5ec}.kf-big div{background:#fff;padding:20px 24px}.kf-big b{display:block;font-family:var(--serif);font-weight:400;font-size:40px;line-height:1.05}.kf-big span{font-size:13px;color:#555C78}
  .kf-bio{padding:24px 32px 0;font-size:17px;max-width:62ch}.kf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;padding:24px 32px}.kf-card{border:1px solid #e3e5ec;border-radius:10px;padding:16px}.kf-card dl{display:grid;gap:4px;margin:10px 0 0}.kf-card dl div{display:flex;justify-content:space-between}.kf-card dt{color:#555C78;font-size:14px}.kf-card dd{margin:0;font-weight:700}
  .kf-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;padding:0 32px 24px}.kf .t td{border-color:#e3e5ec}.kf-foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;padding:16px 32px;border-top:1px solid #e3e5ec;font-size:14px;color:#555C78}`}</style>;

  if (shared.loading) return <p className="empty-note">Loading media kit…</p>;
  if (shared.data) return <div className="stack">{style}<KitPage kit={shared.data} /><p className="note">This media kit was shared with Kitful. <a href="/t/kitful">Make your own</a>.</p></div>;

  const set = (p: Partial<Kit>) => setKit({ ...kit, ...p, updated: new Date().toISOString().slice(0, 10) });
  const setPl = (id: string, p: Partial<Platform>) => set({ platforms: kit.platforms.map(x => (x.id === id ? { ...x, ...p } : x)) });
  const setRate = (id: string, p: Partial<Rate>) => set({ rates: kit.rates.map(x => (x.id === id ? { ...x, ...p } : x)) });
  return (
    <div className="stack">
      {style}
      <div className="grid2">
        <Section title="About you">
          <div className="stack" style={{ gap: 10 }}>
            <div className="row"><label className="field"><span>Name</span><input id="kf-name" className="input" value={kit.name} onChange={e => set({ name: e.target.value })} /></label><label className="field"><span>Location</span><input id="kf-loc" className="input" value={kit.location} onChange={e => set({ location: e.target.value })} /></label></div>
            <label className="field"><span>Tagline</span><input id="kf-tag" className="input" value={kit.tagline} onChange={e => set({ tagline: e.target.value })} /></label>
            <label className="field"><span>Short bio</span><textarea id="kf-bio" className="input" rows={3} value={kit.bio} onChange={e => set({ bio: e.target.value })} /></label>
            <div className="row"><label className="field"><span>Contact email</span><input id="kf-email" className="input" value={kit.email} onChange={e => set({ email: e.target.value })} /></label>
              <label className="field" style={{ flex: "0 0 90px" }}><span>Colour</span><input id="kf-color" type="color" className="input" style={{ padding: 2, height: 42 }} value={kit.color} onChange={e => set({ color: e.target.value })} /></label></div>
            <div className="row"><label className="field"><span>Women in audience %</span><input id="kf-w" className="input num" value={kit.audience.women} onChange={e => set({ audience: { ...kit.audience, women: Math.min(100, +e.target.value || 0) } })} /></label>
              <label className="field"><span>Main age group</span><input id="kf-age" className="input" value={kit.audience.age} onChange={e => set({ audience: { ...kit.audience, age: e.target.value } })} /></label></div>
            <label className="field"><span>Top countries</span><input id="kf-c" className="input" value={kit.audience.topCountries} onChange={e => set({ audience: { ...kit.audience, topCountries: e.target.value } })} /></label>
            <label className="field"><span>Brands you have worked with</span><input id="kf-brands" className="input" value={kit.brands} onChange={e => set({ brands: e.target.value })} /></label>
          </div>
        </Section>
        <div className="stack">
          <Section title="Platforms">
            <div className="stack" style={{ gap: 10 }}>
              {kit.platforms.map(p => (
                <div key={p.id} className="row">
                  <label className="field" style={{ flexBasis: 100 }}><span>Platform</span><input id={`kf-pn-${p.id}`} className="input" value={p.name} onChange={e => setPl(p.id, { name: e.target.value })} /></label>
                  <label className="field" style={{ flexBasis: 110 }}><span>Handle</span><input id={`kf-ph-${p.id}`} className="input" value={p.handle} onChange={e => setPl(p.id, { handle: e.target.value })} /></label>
                  <label className="field" style={{ flexBasis: 90 }}><span>Followers</span><input id={`kf-pf-${p.id}`} className="input num" value={p.followers} onChange={e => setPl(p.id, { followers: +e.target.value.replace(/\D/g, "") || 0 })} /></label>
                  <label className="field" style={{ flexBasis: 90 }}><span>Avg views</span><input id={`kf-pv-${p.id}`} className="input num" value={p.avgViews} onChange={e => setPl(p.id, { avgViews: +e.target.value.replace(/\D/g, "") || 0 })} /></label>
                  <label className="field" style={{ flexBasis: 70 }}><span>Eng. %</span><input id={`kf-pe-${p.id}`} className="input num" value={p.engagement} onChange={e => setPl(p.id, { engagement: parseFloat(e.target.value) || 0 })} /></label>
                  <button className="btn ghost small danger" onClick={() => set({ platforms: kit.platforms.filter(x => x.id !== p.id) })}>Remove</button>
                </div>
              ))}
              <button className="btn small" style={{ alignSelf: "flex-start" }} onClick={() => set({ platforms: [...kit.platforms, { id: uid(), name: "", handle: "", followers: 0, avgViews: 0, engagement: 0 }] })}>Add a platform</button>
            </div>
          </Section>
          <Section title="Rates" aside={<CurrencySelect id="kf-cur" value={kit.currency} onChange={c => set({ currency: c })} />}>
            <div className="stack" style={{ gap: 8 }}>
              {kit.rates.map(r => (
                <div key={r.id} className="row">
                  <input className="input" style={{ flex: 3 }} aria-label="Deliverable" value={r.what} onChange={e => setRate(r.id, { what: e.target.value })} />
                  <input className="input num" style={{ flex: 1 }} aria-label="Price" value={r.price} onChange={e => setRate(r.id, { price: parseFloat(e.target.value) || 0 })} />
                  <button className="btn ghost small danger" onClick={() => set({ rates: kit.rates.filter(x => x.id !== r.id) })}>Remove</button>
                </div>
              ))}
              <button className="btn small" style={{ alignSelf: "flex-start" }} onClick={() => set({ rates: [...kit.rates, { id: uid(), what: "", price: 0 }] })}>Add a rate</button>
            </div>
          </Section>
        </div>
      </div>
      <Section title="Send it to brands"><ShareBox slug={T} data={kit} label="Copy media kit link" message={`Here is my media kit:`} /></Section>
      <KitPage kit={kit} />
    </div>
  );
}
