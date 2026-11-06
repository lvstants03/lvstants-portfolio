# UI/UX DESIGN SYSTEM SPECIFICATION
**Project:** Ly Van My (LVSTANTS) Portfolio  
**Version:** 1.0.0  
**Last Updated:** November 6, 2026  

---

## 1. Design Philosophy
The portfolio UI is engineered around an **Obsidian Cyberpunk Minimalist** aesthetic seamlessly blended with high-precision **Glassmorphism**:
- **Maximized Visual Contrast:** Deep obsidian and absolute black canvases establish structural depth, ensuring code, metrics, and case studies remain prominently readable.
- **Intentional Accentuation:** Amber/Yellow is reserved strictly for primary calls-to-action (CTAs), laser indicators, and critical active states.
- **Multimodal Interaction:** Visuals are tightly coupled with ambient soundscapes, voice feedback, and touchless computer-vision gesture controls.

---

## 2. Standardized Color Tokens

### 2.1 Surfaces & Backgrounds
| Token Name | Tailwind Class | Hex Value | Target Usage |
|---|---|---|---|
| **Canvas Deep Black** | `bg-[#030303]` | `#030303` | Global body background, standalone error/fullscreen views |
| **Obsidian Base** | `bg-[#09090b]` | `#09090b` | Base layer for page sections, subpages, and Footer |
| **Glass Card L1** | `bg-zinc-900/40` | `rgba(24, 24, 27, 0.4)` | Primary section cards, CTA banners, legal containers |
| **Glass Card L2** | `bg-zinc-950/50` | `rgba(9, 9, 11, 0.5)` | Embedded items, contact information rows, list items |
| **Elevated HUD** | `bg-zinc-950/95` | `rgba(9, 9, 11, 0.95)` | Camera AI Vision HUD, floating widgets, dialogs |

### 2.2 Brand & Accent Tokens
| Token Name | Tailwind Class | Hex Value | Target Usage |
|---|---|---|---|
| **Accent Primary** | `text-yellow-400` / `bg-yellow-400` | `#facc15` | Hero highlights, active state badges, primary buttons |
| **Accent Hover** | `bg-yellow-300` | `#fde047` | Interactive hover transitions on primary actions |
| **Accent Muted** | `bg-yellow-400/10` | `rgba(250, 204, 21, 0.1)` | Pill badge backgrounds, icon container backgrounds |
| **Accent Border** | `border-yellow-500/20` | `rgba(234, 179, 8, 0.2)` | Pill borders, card hover borders (`hover:border-yellow-500/40`) |
| **Accent Glow** | `shadow-yellow-500/10` | `rgba(234, 179, 8, 0.1)` | Subtle volumetric drop shadow on key interactive elements |

### 2.3 Semantic State Tokens
| State | Text | Background | Border | System Application |
|---|---|---|---|---|
| **Success / Active** | `text-emerald-400` | `bg-emerald-400/10` | `border-emerald-500/20` | Available badge, active camera state, success toast |
| **Alert / Danger** | `text-red-400` | `bg-red-950/40` | `border-red-500/30` | Fist brake trigger, validation error messages |
| **Info / Tech** | `text-blue-400` | `bg-blue-400/10` | `border-blue-500/20` | Fintech/Banking category tags, secondary ambient glow |

---

## 3. Typography System

### 3.1 Font Family Declarations
1. **Primary Sans-serif (Display & Body):** `Inter` (`--font-inter`)  
   - Powers 90% of user interface, headings, descriptions, inputs, and buttons.
2. **Classical Serif Accent:** `Cormorant Garamond` (`--font-cormorant`)  
   - Reserved for editorial subheadings, artistic pull quotes, and signature branding.
3. **Technical Monospace:** `font-mono` (ui-monospace, SFMono-Regular, Menlo, Monaco)  
   - Applied to section numbering, numeric metrics, status badges, HUD radars, and code snippets.

### 3.2 Visual Hierarchy Specifications
```tsx
// 1. Hero / Section Main Heading
<h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
  Architectural Core <span className="text-yellow-400">Engineering</span>
</h1>

// 2. Sub-section Heading
<h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
  Scalable Distributed Systems
</h2>

// 3. Body Copy
<p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
  High-performance architecture engineered with strict type safety, zero regressions, and low latency.
</p>

// 4. Section Pill Label
<span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
  01 // CORE DOSSIER
</span>
```

---

## 4. Component Design Specifications

### 4.1 Section Pill Badge
Primary identifier rendered at the top of every section and view:
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/20 text-yellow-400 text-xs font-mono font-bold tracking-widest uppercase">
  <Sparkles className="w-3.5 h-3.5" />
  <span>01 // GET IN TOUCH</span>
</div>
```

### 4.2 Primary Call-to-Action (CTA) Button
Primary interaction button with elevated contrast:
```tsx
<button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-yellow-500/10 cursor-pointer">
  <Send className="w-4 h-4" />
  <span>Send Message</span>
</button>
```

### 4.3 Standard 36x36px Icon Button
Universal square container for secondary actions, copy triggers, and social links:
```tsx
<a 
  href="#" 
  className="w-9 h-9 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/40 flex items-center justify-center text-zinc-400 hover:text-yellow-400 transition-all duration-200"
>
  <Github className="w-4 h-4" />
</a>
```

### 4.4 Form Controls (Input / Select / Textarea)
Unified interactive field standards with explicit focus rings:
- **Base Style:** `w-full px-4 py-2.5 rounded-xl bg-zinc-950/70 border text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:ring-2`
- **Default State:** `border-zinc-800 hover:border-zinc-700 focus:border-yellow-500/60 focus:ring-yellow-500/15`
- **Validation Error State:** `border-red-500/60 focus:border-red-500 focus:ring-red-500/15`

### 4.5 Floating HUD & Micro-Widget Window
Floating interactive heads-up display used in computer-vision tracking:
- Positioning: `fixed z-50 pointer-events-auto`
- Border Radius: `rounded-2xl`
- Backdrop & Surface: `bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 shadow-2xl`
- Radar Canvas: Inverted horizontal scale `-scale-x-100` with yellow laser tracking dot `rgba(234, 179, 8, 0.9)`.

---

## 5. Atmosphere, Lighting & Motion

### 5.1 Ambient Volumetric Lighting
Dual diffuse background light sources configured as non-blocking overlays:
```tsx
<div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-yellow-500/5 rounded-full blur-[140px] pointer-events-none" />
<div className="absolute top-10 right-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
```

### 5.2 Motion Rules (Framer Motion)
1. **Standard Fade In Up:** `initial={{ opacity: 0, y: 16 }}` -> `animate={{ opacity: 1, y: 0 }}` with `transition={{ duration: 0.4, ease: "easeOut" }}`.
2. **Viewport Lazy Trigger:** `whileInView={{ opacity: 1, y: 0 }}` with `viewport={{ once: true, margin: "-60px" }}` to eliminate paint bottlenecks.
3. **State Pulsing:** `animate-ping` and `animate-pulse` reserved for recording indicators, radar sweeps, and live availability indicators.
