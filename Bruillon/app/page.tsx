"use client"

import { useState } from "react"
import { ArrowUpRight, ChevronDown, CircleDot, Menu, Search, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const matches = [
  ["11 JUIN", "Mexique", "Afrique du Sud", "Estadio Azteca", "20:00"],
  ["12 JUIN", "Canada", "Australie", "BC Place", "20:00"],
  ["12 JUIN", "États-Unis", "Paraguay", "SoFi Stadium", "23:00"],
]
const ranking = [
  ["01", "France", "FRA", "—"],
  ["02", "Argentine", "ARG", "—"],
  ["03", "Brésil", "BRA", "—"],
  ["04", "Espagne", "ESP", "—"],
]

export default function Home() {
  const [menu, setMenu] = useState(false)
  const [filter, setFilter] = useState("Tous")
  const [search, setSearch] = useState("")
  const filtered = matches.filter((m) => filter === "Tous" || m[1] === filter || m[2] === filter).filter((m) => m.join(" ").toLowerCase().includes(search.toLowerCase()))

  return <main className="min-h-screen bg-[#050505] text-[#f1f0eb] selection:bg-[#ef3f30] selection:text-white">
    <header className="fixed top-0 z-40 flex w-full items-center justify-between px-5 py-5 mix-blend-difference md:px-10">
      <a href="#top" className="font-mono text-sm font-bold tracking-[-0.08em]">FIFA<span className="text-[#ee3d2f]">26</span><span className="ml-1 text-xs font-normal tracking-normal text-white/60">/ CONTROL</span></a>
      <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 md:flex"><a href="#overview" className="nav-link hover:text-white">Overview</a><a href="#matches" className="nav-link hover:text-white">Calendrier</a><a href="#ranking" className="nav-link hover:text-white">Classement</a><a href="#stats" className="nav-link hover:text-white">Stats</a></nav>
      <div className="flex items-center gap-2"><button aria-label="Ouvrir le menu" onClick={() => setMenu(!menu)} className="rounded-full border border-white/20 p-2.5 md:hidden">{menu ? <X size={15}/> : <Menu size={15}/>}</button><Link href="/connexion" className="hidden bg-[#f0efea] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-black transition-colors hover:bg-[#ef3f30] hover:text-white md:block">Connexion <ArrowUpRight className="ml-2 inline" size={13}/></Link></div>
    </header>
    {menu && <div className="fixed inset-0 z-30 bg-[#ef3f30] p-8 pt-28 md:hidden"><div className="flex flex-col gap-5 font-mono text-4xl uppercase tracking-tight"><a onClick={() => setMenu(false)} href="#overview">Overview</a><a onClick={() => setMenu(false)} href="#matches">Calendrier</a><a onClick={() => setMenu(false)} href="#ranking">Classement</a><a onClick={() => setMenu(false)} href="#stats">Stats</a><Link onClick={() => setMenu(false)} href="/connexion">Connexion <ArrowUpRight className="ml-2 inline" size={18}/></Link></div></div>}

    <section id="top" className="hero-section relative flex min-h-[92vh] items-end overflow-hidden border-b border-white/10 px-5 pb-10 pt-32 md:px-10 md:pb-16">
      <Image src="/world-cup-hero.png" alt="Ballon de football dans un stade abstrait" fill priority className="hero-image object-cover opacity-75" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/30 to-black/20" />
      <div className="hero-content relative z-10 w-full"><p className="mb-8 font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">Plateforme officielle de suivi // mise à jour 17.09.2026</p><h1 className="max-w-5xl text-[17vw] font-semibold leading-[.8] tracking-[-.09em] md:text-[12vw]">WORLD<br/><span className="text-[#ef3f30]">CONTROL</span><span className="align-top text-[5vw] tracking-[-.05em]">™</span></h1><div className="mt-10 flex flex-col justify-between gap-5 border-t border-white/20 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 md:flex-row"><span>Canada · Mexico · USA</span><span>11 Juin — 19 Juillet 2026</span><span className="text-white">[ Suivre le tournoi ]</span></div></div>
    </section>

    <section id="overview" className="grid gap-12 border-b border-white/10 px-5 py-24 md:grid-cols-[1fr_2fr] md:px-10 md:py-32"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">01 / Le tournoi</p><div><h2 className="max-w-4xl text-4xl font-medium leading-[.95] tracking-[-.055em] md:text-7xl">La donnée brute devient une <span className="text-[#ef3f30]">expérience vivante.</span></h2><p className="mt-8 max-w-xl text-lg leading-relaxed text-white/55">Un espace de contrôle pensé pour suivre les 48 équipes, 104 matchs et chaque moment décisif de la première Coupe du Monde à 48 nations.</p><div className="mt-12 grid grid-cols-2 gap-px border border-white/15 bg-white/15 md:grid-cols-4"><div className="stat-card"><Stat n="48" l="équipes"/></div><div className="stat-card"><Stat n="104" l="matchs"/></div><div className="stat-card"><Stat n="16" l="villes hôtes"/></div><div className="stat-card"><Stat n="3" l="pays"/></div></div></div></section>

    <section id="matches" className="border-b border-white/10 px-5 py-20 md:px-10 md:py-28"><div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">02 / Centre de matchs</p><h2 className="mt-5 text-5xl font-medium tracking-[-.07em] md:text-8xl">Prochains<br/><span className="text-[#ef3f30]">rendez-vous.</span></h2></div><div className="flex gap-2"><div className="flex items-center gap-2 border border-white/20 px-3 py-2"><Search size={13} className="text-white/40"/><input aria-label="Rechercher un match" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher" className="w-28 bg-transparent font-mono text-[10px] uppercase outline-none placeholder:text-white/35"/></div><select aria-label="Filtrer les équipes" value={filter} onChange={e=>setFilter(e.target.value)} className="border border-white/20 bg-[#050505] px-3 font-mono text-[10px] uppercase"><option>Tous</option><option>Mexique</option><option>Canada</option><option>États-Unis</option></select></div></div><div className="divide-y divide-white/10 border-y border-white/10">{filtered.map((m,i)=><article key={i} className="match-row group grid grid-cols-[.7fr_1.5fr_1fr_.5fr] items-center gap-3 py-6 font-mono text-[11px] uppercase md:grid-cols-[.7fr_1.8fr_1fr_.5fr]"><span className="text-white/40">{m[0]}</span><div className="text-xl font-sans font-medium normal-case tracking-tight md:text-3xl"><span>{m[1]}</span><span className="mx-3 text-[#ef3f30]">vs</span><span>{m[2]}</span></div><span className="text-white/45">{m[3]}</span><span className="text-right">{m[4]} <ArrowUpRight className="ml-2 hidden group-hover:inline" size={14}/></span></article>)}</div><p className="mt-4 font-mono text-[10px] uppercase text-white/35">Données de calendrier publiées par la FIFA · les résultats seront activés après chaque rencontre.</p></section>

    <section id="ranking" className="grid gap-12 border-b border-white/10 px-5 py-20 md:grid-cols-[1fr_2fr] md:px-10 md:py-28"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">03 / Classement mondial</p><div><div className="mb-10 flex items-end justify-between"><h2 className="text-5xl font-medium tracking-[-.07em] md:text-8xl">Top<br/><span className="text-[#ef3f30]">sélections.</span></h2><ChevronDown className="mb-2"/></div><div className="divide-y divide-white/15 border-y border-white/15">{ranking.map((r)=><div key={r[0]} className="grid grid-cols-[.4fr_1fr_.4fr_.3fr] items-center py-5 font-mono text-xs"><span className="text-white/35">{r[0]}</span><span className="font-sans text-2xl font-medium tracking-tight">{r[1]}</span><span className="text-white/40">{r[2]}</span><span className="text-right text-white/50">{r[3]}</span></div>)}</div></div></section>

    <section id="stats" className="relative overflow-hidden bg-[#ef3f30] px-5 py-24 text-black md:px-10 md:py-36"><div className="absolute right-10 top-10 opacity-20"><CircleDot size={180} strokeWidth={.6}/></div><p className="relative font-mono text-[10px] uppercase tracking-[0.2em]">04 / Intelligence joueur</p><div className="relative mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr]"><h2 className="text-[16vw] font-semibold leading-[.75] tracking-[-.1em] md:text-[11vw]">GAME<br/>DATA.</h2><div className="self-end border-t border-black/30 pt-4 font-mono text-xs uppercase leading-relaxed"><p>Meilleur buteur</p><p className="mt-3 text-5xl font-sans font-medium tracking-[-.08em]">—</p><p className="mt-6 max-w-sm normal-case text-black/60">Les statistiques individuelles se mettent à jour automatiquement dès le coup de sifflet final. Aucun résultat n’est inventé avant le tournoi.</p></div></div></section>

    <footer className="flex flex-col justify-between gap-8 px-5 py-8 font-mono text-[10px] uppercase tracking-[0.15em] text-white/45 md:flex-row md:px-10"><span>FIFA26 / CONTROL</span><span>© 2026 · Interface de suivi</span><span>Confidentialité · Admin</span></footer>
  </main>
}
function Stat({n,l}:{n:string,l:string}){return <div className="bg-[#050505] p-5 md:p-6"><p className="text-3xl font-sans tracking-[-.07em] md:text-5xl">{n}</p><p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-white/45">{l}</p></div>}
