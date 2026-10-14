"use client";
import { useEffect, useState } from "react";
import { money } from "@/lib/products";

const EMPTY = { id: "", name: "", category: "Women", sub: "", price: "", was: "", tag: "", sizes: "", desc: "" };
const photo = (p) => p.image || `/products/${p.id}.jpg`;

export default function Admin() {
  const [state, setState] = useState("loading"); // loading | login | disabled | ready
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [storage, setStorage] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [form, setForm] = useState(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    const r = await fetch("/api/admin/products", { cache: "no-store" });
    if (r.status === 503) return setState("disabled");
    if (r.status === 401) return setState("login");
    const d = await r.json();
    setProducts(d.products); setCats(d.categories); setStorage(d.storage); setState("ready");
  }
  useEffect(() => { load(); }, []);

  async function login(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    const d = await r.json(); setBusy(false);
    if (!r.ok) return setErr(d.error || "Login failed.");
    setPw(""); load();
  }
  async function logout() { await fetch("/api/admin/login", { method: "DELETE" }); setState("login"); }

  function edit(p) {
    setErr(""); setFile(null);
    setForm({ id: p.id, name: p.name, category: p.category, sub: p.sub || "", price: p.price, was: p.was || "", tag: p.tag || "", sizes: (p.sizes || []).join(", "), desc: p.desc || "", image: photo(p) });
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    const fd = new FormData();
    ["id", "name", "category", "sub", "price", "was", "tag", "sizes", "desc"].forEach((k) => fd.append(k, form[k] ?? ""));
    if (file) fd.append("image", file);
    const r = await fetch("/api/admin/products", { method: "POST", body: fd });
    const d = await r.json(); setBusy(false);
    if (!r.ok) return setErr(d.error || "Could not save.");
    setForm(null); setFile(null); load();
  }
  async function del(p) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const r = await fetch(`/api/admin/products?id=${p.id}`, { method: "DELETE" });
    if (r.ok) load(); else alert((await r.json()).error || "Could not delete.");
  }

  if (state === "loading") return <main className="adm"><p>Loading…</p></main>;
  if (state === "disabled") return <main className="adm"><div className="adm-box"><h1>Admin is turned off</h1><p>Set an <b>ADMIN_PASSWORD</b> (at least 8 characters) in your environment settings, then reload this page.</p></div></main>;
  if (state === "login") return (
    <main className="adm"><form className="adm-box" onSubmit={login}>
      <h1>Falestix admin</h1>
      <label htmlFor="pw">Password</label>
      <input id="pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
      {err && <p className="err" role="alert">{err}</p>}
      <button className="cta" disabled={busy || !pw}>{busy ? "Checking…" : "Log in"}</button>
    </form></main>
  );

  const shown = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const subs = [...new Set(products.map((p) => p.sub).filter(Boolean))];

  return (
    <main className="adm wide">
      <div className="adm-head">
        <h1>Products ({products.length})</h1>
        <div>
          <a href="/" target="_blank" rel="noopener">View store</a>
          <button className="adm-btn" onClick={() => { setErr(""); setFile(null); setForm({ ...EMPTY, category: cats[0] }); }}>+ Add product</button>
          <button className="adm-btn ghost" onClick={logout}>Log out</button>
        </div>
      </div>
      {storage === "local-files" && <p className="adm-note">Test mode: products are saved on this computer only. Connect Vercel Blob (see README) so changes appear on your live website.</p>}
      <input className="adm-search" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />

      <div className="adm-list">
        {shown.map((p) => (
          <div className="adm-row" key={p.id}>
            <div className="adm-thumb"><img src={photo(p)} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} /></div>
            <div className="adm-info"><b>{p.name}</b><span>{p.category}{p.sub ? ` / ${p.sub}` : ""}{p.tag ? ` · ${p.tag}` : ""}</span></div>
            <div className="adm-price">{money(p.price)}{p.was ? <s>{money(p.was)}</s> : null}</div>
            <div className="adm-actions"><button className="adm-btn ghost" onClick={() => edit(p)}>Edit</button><button className="adm-btn danger" onClick={() => del(p)}>Delete</button></div>
          </div>
        ))}
        {shown.length === 0 && <p className="empty">No products found.</p>}
      </div>

      {form && (
        <div className="modal" onClick={() => setForm(null)}>
          <form className="adm-form" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>{form.id ? "Edit product" : "Add product"}</h2>
            <label htmlFor="f-name">Product name</label><input id="f-name" required value={form.name} onChange={set("name")} />
            <div className="two2">
              <div><label htmlFor="f-cat">Category</label><select id="f-cat" value={form.category} onChange={set("category")}>{cats.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div><label htmlFor="f-sub">Sub-category</label><input id="f-sub" list="subs" value={form.sub} onChange={set("sub")} placeholder="e.g. Cookware" /><datalist id="subs">{subs.map((s) => <option key={s} value={s} />)}</datalist></div>
            </div>
            <div className="two2">
              <div><label htmlFor="f-price">Price (Rs)</label><input id="f-price" type="number" min="1" required value={form.price} onChange={set("price")} /></div>
              <div><label htmlFor="f-was">Old price (optional)</label><input id="f-was" type="number" min="0" value={form.was} onChange={set("was")} placeholder="for sale items" /></div>
            </div>
            <div className="two2">
              <div><label htmlFor="f-tag">Label</label><select id="f-tag" value={form.tag} onChange={set("tag")}><option value="">None</option><option value="new">New</option><option value="sale">Sale</option></select></div>
              <div><label htmlFor="f-sizes">Sizes (optional)</label><input id="f-sizes" value={form.sizes} onChange={set("sizes")} placeholder="S, M, L, XL" /></div>
            </div>
            <label htmlFor="f-desc">Description</label><textarea id="f-desc" rows="3" value={form.desc} onChange={set("desc")} />
            <label htmlFor="f-img">Photo (JPG, PNG or WebP, up to 4 MB)</label>
            <input id="f-img" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files[0] || null)} />
            {(file || form.image) && <img className="adm-preview" src={file ? URL.createObjectURL(file) : form.image} alt="Preview" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
            {err && <p className="err" role="alert">{err}</p>}
            <div className="adm-actions" style={{ marginTop: 16 }}>
              <button className="cta" style={{ marginTop: 0 }} disabled={busy}>{busy ? "Saving…" : "Save product"}</button>
              <button type="button" className="adm-btn ghost" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
