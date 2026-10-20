"use client";
import { useEffect, useMemo, useState } from "react";
import { SHOP, money, totals } from "@/lib/products";

const EMPTY = { name: "", phone: "", city: "", street: "", email: "", note: "" };
const ICON = {
  Luxury: <><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20M9 3l-1 6 4 12 4-12-1-6" /></>,
  Decor: <><path d="M9 3h6M10 3v3c0 2-4 3-4 8a6 6 0 0 0 12 0c0-5-4-6-4-8V3" /><path d="M8 21h8" /></>,
  Kitchenware: <><path d="M4 10h16v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" /><path d="M2 10h2M20 10h2M9 6.5c0-1.2 1-1.2 1-2.5M14 6.5c0-1.2 1-1.2 1-2.5" /></>,
};
const TI = {
  cod: <><rect x="3" y="6" width="18" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.6" /></>,
  ship: <><path d="M2 6h11v10H2zM13 9h4.5L21 12.5V16h-8" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  swap: <><path d="M4 8h13l-3-3M20 16H7l3 3" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
};
const Ti = ({ k }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{TI[k]}</svg>;
const Icon = ({ c }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[c]}</svg>;
const Pic = ({ p, children }) => (
  <div className={`pic c-${p.category}`}>
    <Icon c={p.category} />
    <img src={p.image || `/products/${p.id}.jpg`} alt={p.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
    {children}
    <span className="qv" aria-hidden="true">Quick view</span>
  </div>
);
const hide = (e) => { e.currentTarget.style.display = "none"; };
const off = (p) => Math.round((1 - p.price / p.was) * 100);

export default function Store({ products }) {
  const PRODUCTS = products;
  const maxOff = Math.max(0, ...PRODUCTS.filter((p) => p.was).map(off));
  const menu = useMemo(() => Object.fromEntries(SHOP.categories.map((c) => [c, [...new Set(PRODUCTS.filter((p) => p.category === c).map((p) => p.sub).filter(Boolean))]])), [PRODUCTS]);
  const repOf = (c) => { const l = PRODUCTS.filter((p) => p.category === c); const p = l[1] || l[0]; return p ? p.image || `/products/${p.id}.jpg` : ""; };
  const [cart, setCart] = useState({});
  const [ready, setReady] = useState(false);
  const [cat, setCat] = useState("All");
  const [sub, setSub] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState(null);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => { try { setCart(JSON.parse(localStorage.getItem("fx_cart2") || "{}")); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem("fx_cart2", JSON.stringify(cart)); } catch {} }, [cart, ready]);
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") { setOpen(false); setView(null); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const lines = useMemo(() => Object.entries(cart).map(([key, qty]) => { const [id, size] = key.split("|"); const p = PRODUCTS.find((x) => x.id === +id); return p ? { ...p, key, size, qty } : null; }).filter(Boolean), [cart, PRODUCTS]);
  const t = totals(lines);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const cats = ["All", ...Object.keys(menu)];
  const shown = PRODUCTS
    .filter((p) => (cat === "All" || p.category === cat) && (!sub || p.sub === sub) && p.name.toLowerCase().includes(q.toLowerCase().trim()))
    .sort((a, b) => (sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : a.id - b.id));

  const go = (c, s = "") => { setCat(c); setSub(s); setQ(""); document.getElementById("shop")?.scrollIntoView(); };
  const openProduct = (p) => { setView(p); setSize(""); setQty(1); };
  const addToCart = () => {
    const key = `${view.id}|${size}`;
    setCart((c) => ({ ...c, [key]: Math.min(20, (c[key] || 0) + qty) }));
    setView(null); setStep("cart"); setOpen(true);
  };
  const change = (key, d) => setCart((c) => { const n = (c[key] || 0) + d; const x = { ...c }; if (n <= 0) delete x[key]; else x[key] = Math.min(n, 20); return x; });
  const remove = (key) => setCart((c) => { const x = { ...c }; delete x[key]; return x; });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const close = () => { setOpen(false); if (step === "done") setStep("cart"); };

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, consent, items: lines.map((l) => ({ id: l.id, qty: l.qty, size: l.size })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setOrder({ ...data, email: form.email });
      try { if (SHOP.whatsapp) window.open(`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(data.summary)}`, "_blank", "noopener"); } catch {}
      setCart({}); setConsent(false); setStep("done");
    } catch (err) { setError(err.message); }
    setBusy(false);
  }

  const checkout = step === "checkout";
  const shownTotal = checkout ? t.total : t.total - t.cod;
  const Sum = () => (
    <>
      <div className="row"><span>Subtotal</span><span>{money(t.subtotal)}</span></div>
      <div className="row"><span>Delivery</span><span>{t.shipping ? money(t.shipping) : "Free"}</span></div>
      {checkout && t.cod > 0 && <div className="row"><span>Cash on delivery fee</span><span>{money(t.cod)}</span></div>}
      <div className="row t"><span>Total</span><span>{money(shownTotal)}</span></div>
      
    </>
  );
  const Card = ({ p }) => (
    <article className="card">
      <button className="open" onClick={() => openProduct(p)} aria-label={`View ${p.name}`}>
        <Pic p={p}>{p.tag === "sale" && p.was ? <span className="badge">-{off(p)}%</span> : p.tag === "new" ? <span className="badge new">New</span> : null}</Pic>
        <h3>{p.name}</h3>
        <div className="price">{money(p.price)}{p.was && <s>{money(p.was)}</s>}</div>
      </button>
    </article>
  );
  const news = PRODUCTS.filter((p) => p.tag === "new").slice(0, 4);
  const sales = PRODUCTS.filter((p) => p.tag === "sale").slice(0, 4);

  return (
    <>
      <div className="util"><div className="wrap"><span>Free delivery over {money(SHOP.freeShippingFrom)} · Cash on delivery all over Pakistan</span><span>7-day exchange</span></div></div>
      <header>
        <div className="wrap top">
          <div className="search-wrap"><input className="search" type="search" placeholder="Search products" aria-label="Search products" value={q} onChange={(e) => { setQ(e.target.value); setCat("All"); setSub(""); }} /></div>
          <a className="logo" href="/">{SHOP.name.toUpperCase()}</a>
          <div className="tools"><button className="cartbtn" onClick={() => { setStep("cart"); setOpen(true); }} aria-label={`Open cart, ${count} items`}>Cart<b>{count}</b></button></div>
        </div>
        <div className="msearch"><input className="search" type="search" placeholder="Search products" aria-label="Search products" value={q} onChange={(e) => { setQ(e.target.value); setCat("All"); setSub(""); }} /></div>
        <nav className="nav" aria-label="Main">
          <ul>
            {Object.entries(menu).map(([c, subs]) => (
              <li key={c}>
                <button onClick={() => go(c)}>{c}</button>
                <div className="mega"><div className="wrap">
                  <div><b>{c}</b><button onClick={() => go(c)}>View all</button></div>
                  <div><b>Categories</b>{subs.map((s) => <button key={s} onClick={() => go(c, s)}>{s}</button>)}</div>
                </div></div>
              </li>
            ))}
            <li className="sale"><button onClick={() => document.getElementById("sale")?.scrollIntoView()}>Sale</button></li>
          </ul>
        </nav>
        <div className="chips" role="group" aria-label="Categories">
          {cats.map((c) => <button key={c} aria-pressed={c === cat} onClick={() => go(c)}>{c}</button>)}
        </div>
      </header>

      <section className="hero" aria-label="Featured collections">
        {SHOP.categories.map((c, i) => (
          <button key={c} className={`panel c-${c}${i === 0 ? " big" : ""}`} onClick={() => go(c)}>
            <Icon c={c} />
            {repOf(c) && <img className="bg" src={repOf(c)} alt="" onError={hide} />}
            {i === 0 && <span className="pct">New collection</span>}
            <h2>{c}</h2><p>{SHOP.info[c].line}</p><span className="btn">{SHOP.info[c].cta}</span>
          </button>
        ))}
      </section>

      {maxOff > 0 && <div className="sale-banner" id="sale"><b>Sale up to {maxOff}% off</b><a href="#shop" onClick={() => go("All")}>Shop all products</a></div>}

      <div className="trust">
        <div><Ti k="cod" /><div><b>Cash on delivery</b><span>Pay when your parcel arrives</span></div></div>
        <div><Ti k="ship" /><div><b>Free delivery</b><span>On orders over {money(SHOP.freeShippingFrom)}</span></div></div>
        <div><Ti k="swap" /><div><b>7-day exchange</b><span>On unused items</span></div></div>
        <div><Ti k="pin" /><div><b>Nationwide delivery</b><span>All cities of Pakistan</span></div></div>
      </div>

      <section className="wrap sec"><div className="head"><h2>Shop by category</h2></div>
        <div className="tiles">{Object.keys(menu).map((c) => <button key={c} className={`tile c-${c}`} onClick={() => go(c)}><Icon c={c} /><img className="bg" src={repOf(c)} alt="" loading="lazy" onError={hide} /><span>{c}</span></button>)}</div></section>
      <section className="story">
        <div className="story-txt"><span className="kicker">The {SHOP.name} promise</span><h2>Considered pieces for a beautiful home</h2><p>From soft luxury bedding to hand-finished stoneware, every piece is chosen for quality you can feel. Order easily, pay on delivery and exchange within 7 days.</p><button className="btn" onClick={() => go("All")}>Explore the collection</button></div>
        <div className="story-img">{repOf("Decor") && <img src={repOf("Decor")} alt="" loading="lazy" onError={hide} />}</div>
      </section>
      <section className="wrap sec"><div className="head"><h2>New arrivals</h2></div><div className="grid">{news.map((p) => <Card key={p.id} p={p} />)}</div></section>
      <section className="wrap sec"><div className="head"><h2>On sale</h2></div><div className="grid">{sales.map((p) => <Card key={p.id} p={p} />)}</div></section>

      <main className="wrap sec" id="shop">
        <div className="head"><h2>{sub || (cat === "All" ? "All products" : cat)}</h2></div>
        <div className="filters">
          {cats.map((c) => <button key={c} className="f" aria-pressed={c === cat && !sub} onClick={() => go(c)}>{c}</button>)}
          {cat !== "All" && menu[cat].map((s) => <button key={s} className="f" aria-pressed={s === sub} onClick={() => { setSub(sub === s ? "" : s); }}>{s}</button>)}
          <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
          </select>
        </div>
        <div className="grid">
          {shown.length === 0 && <p className="empty">No products match your selection.</p>}
          {shown.map((p) => <Card key={p.id} p={p} />)}
        </div>
      </main>

      <footer><div className="wrap">
        <div className="cols">
          <div><b>{SHOP.name.toUpperCase()}</b><p>Luxury bedding, home decor and kitchenware, delivered across Pakistan. Pay cash on delivery.</p></div>
          <div><h4>Shop</h4>{Object.keys(menu).map((c) => <button key={c} className="l" onClick={() => go(c)}>{c}</button>)}</div>
          <div><h4>Help</h4><a href="/shipping">Shipping</a><a href="/returns">Returns</a></div>
          <div><h4>Legal</h4><a href="/contact">Contact us</a><a href="/privacy">Privacy policy</a><a href="/terms">Terms</a></div>
        </div>
        <p className="copy">© {new Date().getFullYear()} {SHOP.name} · All prices in Pakistani rupees.</p>
      </div></footer>

      {view && (
        <div className="modal" onClick={() => setView(null)}>
          <div className="mbox" role="dialog" aria-label={view.name} onClick={(e) => e.stopPropagation()}>
            <button className="x" onClick={() => setView(null)} aria-label="Close">×</button>
            <Pic p={view} />
            <div className="info">
              <span className="small">{view.category} / {view.sub}</span>
              <h2>{view.name}</h2>
              <div className="price" style={{ fontSize: 20 }}>{money(view.price)}{view.was && <s>{money(view.was)}</s>}{view.was && <span className="pc">Save {off(view)}%</span>}</div>
              <p className="small">Delivery charges are calculated at checkout.</p>
              <p>{view.desc}</p>
              {view.sizes && (<>
                <b>Size</b>
                <div className="sizes" role="group" aria-label="Size">{view.sizes.map((s) => <button key={s} aria-pressed={s === size} onClick={() => setSize(s)}>{s}</button>)}</div>
              </>)}
              <div className="qty" style={{ margin: "16px 0" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button><span>{qty}</span><button onClick={() => setQty(Math.min(20, qty + 1))} aria-label="Increase quantity">+</button>
              </div>
              <button className="cta" style={{ marginTop: 0 }} disabled={!!view.sizes && !size} onClick={addToCart}>{view.sizes && !size ? "Select a size" : "Add to cart"}</button>
              <p className="small" style={{ marginTop: 14 }}>Cash on delivery · 7-day exchange · Free delivery over {money(SHOP.freeShippingFrom)}</p>
            </div>
          </div>
        </div>
      )}

      {open && <div className="ov" onClick={close} />}
      {open && (
        <aside className="drawer" role="dialog" aria-label="Shopping cart">
          <div className="dh">
            <h2>{checkout ? "Delivery details" : step === "done" ? "Order confirmed" : `Cart (${count})`}</h2>
            <button className="x" onClick={close} aria-label="Close">×</button>
          </div>

          {step === "done" && order && (<>
            <div className="db"><div className="done">
              <div className="tick">✓</div>
              <h2>Thank you for your order</h2>
              <p>Order <b>{order.id}</b> is confirmed. We will call you shortly to confirm your order.</p>
              <p>Please pay <b>{money(order.total)}</b> in cash to the rider on delivery.</p>
              {SHOP.whatsapp && (<>
                <p className="small">WhatsApp did not open? Tap the button and press send, so we get your order details right away.</p>
                <a className="btn wa" target="_blank" rel="noopener" href={`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(order.summary)}`}>Send order on WhatsApp</a>
              </>)}
            </div></div>
            <div className="df"><button className="cta" style={{ marginTop: 0 }} onClick={close}>Continue shopping</button></div>
          </>)}

          {step === "cart" && (lines.length === 0 ? (
            <div className="db"><p className="empty">Your cart is empty.</p></div>
          ) : (<>
            <div className="db">
              {lines.map((l) => (
                <div className="item" key={l.key}>
                  <Pic p={l} />
                  <div className="n">{l.name}<small>{l.size ? `Size ${l.size} · ` : ""}{money(l.price)}</small>
                    <div className="qty">
                      <button onClick={() => change(l.key, -1)} aria-label="Decrease quantity">−</button><span>{l.qty}</span><button onClick={() => change(l.key, 1)} aria-label="Increase quantity">+</button>
                      <button className="rm" onClick={() => remove(l.key)}>Remove</button>
                    </div>
                  </div>
                  <b>{money(l.price * l.qty)}</b>
                </div>
              ))}
            </div>
            <div className="df">
              <p className="free">{t.subtotal >= SHOP.freeShippingFrom ? "You have free delivery." : `Add ${money(SHOP.freeShippingFrom - t.subtotal)} more for free delivery.`}</p>
              <div className="bar2"><i style={{ width: Math.min(100, (t.subtotal / SHOP.freeShippingFrom) * 100) + "%" }} /></div>
              <Sum />
              <button className="cta" onClick={() => setStep("checkout")}>Checkout</button>
            </div>
          </>))}

          {checkout && (
            <form onSubmit={submit} style={{ display: "contents" }}>
              <div className="db">
                <label htmlFor="name">Full name</label><input id="name" required autoComplete="name" value={form.name} onChange={set("name")} />
                <label htmlFor="phone">Mobile number</label><input id="phone" type="tel" inputMode="tel" required autoComplete="tel" placeholder="0300 1234567" value={form.phone} onChange={set("phone")} />
                <label htmlFor="city">City</label><input id="city" list="cities" required autoComplete="address-level2" value={form.city} onChange={set("city")} />
                <datalist id="cities">{SHOP.cities.map((c) => <option key={c} value={c} />)}</datalist>
                <label htmlFor="street">Complete address (house, street, area)</label><input id="street" required autoComplete="street-address" value={form.street} onChange={set("street")} />
                <label htmlFor="email">Email (optional)</label><input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
                <label htmlFor="note">Note for delivery (optional)</label><input id="note" value={form.note} onChange={set("note")} />
                <div className="cod"><b>Payment: cash on delivery.</b> Pay the rider in cash when your parcel arrives.</div>
                <label className="chk" style={{ marginTop: 16 }}><input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>I accept the <a href="/terms">terms</a>, the <a href="/returns">returns policy</a> and the <a href="/privacy">privacy policy</a>.</span></label>
                {error && <p className="err" role="alert">{error}</p>}
              </div>
              <div className="df">
                <Sum />
                <button className="cta" type="submit" disabled={busy}>{busy ? "Placing order…" : `Place order · ${money(t.total)}`}</button>
                <button type="button" className="rm back" onClick={() => setStep("cart")}>Back to cart</button>
              </div>
            </form>
          )}
        </aside>
      )}
    </>
  );
}
