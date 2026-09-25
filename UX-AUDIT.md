# IT Sentinel: UX/UI and accessibility audit

**Standard:** WCAG 2.1 AA · **Date:** 24 Sep 2026 · **Scope:** Angular app (`src/`): Home, Login, Open ticket (`/chamado`), Dashboard

> The loose `index.html`, `login.html`, `dashboard.html`, `style.css`, `login.css` and `dashboard.css` files in the project root are the old static prototype. The Angular app doesn't use them, and they were left unchanged.

## Summary

**Issues found:** 38 · **Critical:** 7 · **Major:** 17 · **Minor:** 14. All of them are fixed in this version.

### Critical

| # | Issue | Where | Fix |
|---|-------|-------|-----|
| 1 | A valid login could never reach the Dashboard. `fazerLogin()` wrote `usuarioLogado` and then deleted it right away, so the guard always sent the user back to Home | Login | New `AuthService`. The session is saved **after** validation. The guard now redirects to `/login` and shows a pop-up explaining why |
| 2 | The "High contrast" button forced black and green on every `div` with `!important`. Most of the UI broke, and in the dashboard the text turned black on a dark background | Global | Replaced with a real **light/dark theme** built on CSS tokens. It follows the OS preference on the first visit, is saved in the browser, and applies before Angular loads, so there's no white flash |
| 3 | Dashboard text was unreadable in dark mode because of inline styles with fixed colors | Dashboard | Every color now comes from theme tokens. The drawers were rewritten with CSS classes |
| 4 | The auto-rotating carousel had no pause control (2.2.2) | Home | Pause/resume button. Rotation also pauses on hover or focus, and is off when *prefers-reduced-motion* is set |
| 5 | The side drawers weren't dialogs: no focus handling, no Esc, and focus wasn't returned | Dashboard | `role="dialog"` with `aria-modal`, focus moves to "Close", Tab is trapped inside, Esc and the backdrop close it, and focus returns to the button that opened it |
| 6 | Errors used `alert()` or loose text that screen readers didn't announce (3.3.1) | Login, ticket | Pop-up notifications (toasts) with `role="alert"`, plus an inline error under each field linked through `aria-invalid` and `aria-describedby` |
| 7 | The ticket-page fields had no `<label for>` (3.3.2 / 1.3.1) | Ticket | Every field has a linked label, required fields are marked, and the severity level uses a `fieldset` with a `legend` |

### Major

| # | Issue | Fix |
|---|-------|-----|
| 8 | The primary green `#3a894b` with white text scored 4.32:1, below AA | New primary green `#2e7d42` scores 5.09:1 |
| 9 | Grey text `#777` scored 4.48:1 | `#56665c` scores 6.09:1 |
| 10 | The font buttons applied `!important` percentages element by element, so the layout didn't scale | The whole layout uses `rem`, so A+/A− scale the root font size (100%, 112.5%, 125%). The setting is saved |
| 11 | No visible focus indicator: `outline: none` on inputs | Consistent `:focus-visible` style across the whole site |
| 12 | The icon next to the name was blurry and misplaced: a 16 px sun stretched to 28 px on its own line, and a 1254 px logo with wide margins shrunk to 32 px | Crisp SVG icons. The greeting icon now sits on the same line as the name and changes with the time of day. The logo was trimmed and resized to 128 px (474 KB down to 12 KB) |
| 13 | Header had no breakpoint between 450 px and desktop, so it overflowed on tablets | Hamburger menu below 1088 px, with `aria-expanded` and Esc to close |
| 14 | Dashboard wasn't responsive: fixed 260 px sidebar and a 4-column table | Off-canvas sidebar on tablet and mobile, cards in 2 or 1 columns, and the table turns into a card list on mobile |
| 15 | Dashboard search did nothing | It filters by machine, status, problem, requester and department, ignores accents, shows an empty state, and announces the result count to screen readers |
| 16 | "Ver diagnóstico" was a dead link (`javascript:void(0)`) | Opens the report for **that** machine |
| 17 | Menu items were `<a href="javascript:void(0)">` | They're now real `<button>` elements |
| 18 | Carousel dots were 9 px `<span>` elements you couldn't reach with the keyboard | Buttons with a 28×44 px target and `aria-label` and `aria-current` |
| 19 | Social links had empty `alt` text and a typo (`titlle`) | Icon only, with `aria-label` ("… opens in a new tab"), `title` and a 44 px target |
| 20 | "IT Sentinel" sat outside the card on the ticket page | The brand is inside the card, with a step indicator (Identification → Ticket details) |
| 21 | The "Back" links were weak and inconsistent | Standard "← Voltar para o início" pill button in the top bar of both pages |
| 22 | Hard-coded date ("Monday, 28 Sep 2026") and greeting | Built from today's date in pt-BR. The greeting switches between Bom dia, Boa tarde and Boa noite |
| 23 | Tickets were lost on reload, and the service mutated the array in place | Tickets are saved in `localStorage` and the list is updated without mutation |
| 24 | Pressing Enter didn't submit (no `<form>`) | Real forms with `ngSubmit` |

### Minor

`lang="en"` changed to `pt-BR` · added `<meta description>` and `theme-color` · skip link ("Pular para o conteúdo") · justified text removed (hurts readability) · better image `alt` text · consistent heading hierarchy (one `h1` per page) · headers on the dashboard table (`scope="col"`) · status shown as coloured badges, not colour alone · trends with arrow and colour (+12% / −2% / +1%) · health-index ring built with `conic-gradient` · carousel images converted to WebP (≈5 MB down to ≈200 KB) · dynamic copyright year · "Help" link opens the support WhatsApp · the pre-existing broken tests fixed (7 of 7 pass).

## Requested items

| Request | Done |
|---|---|
| Light/dark toggle in place of "high contrast" | ✅ Moon/sun button with `aria-pressed`, saved, works on every page |
| Black text in dashboard dark mode | ✅ |
| Header icon next to the name | ✅ |
| "Eye" to reveal the password | ✅ Login and ticket page (`aria-label` changes between Mostrar and Ocultar senha) |
| Required LGPD consent checkbox | ✅ Blocks login until ticked, with an inline error and a link to the law |
| Better Back to Home button | ✅ Login and ticket page |
| Icon-only social links in the footer | ✅ |
| "IT Sentinel" inside the card on the ticket page | ✅ |
| Pop-up for errors and successes | ✅ `ToastService`: close with a click, the X or Esc. Pauses on hover. Errors auto-close after 8 s, others after 5 s. A success clears earlier errors |
| "Keep me logged in" | ✅ Ticked: `localStorage` (survives closing the browser). Unticked: `sessionStorage` |

## Colour contrast (checked programmatically)

| Element | Foreground | Background | Ratio | Result |
|---|---|---|---|---|
| Primary button (light) | #ffffff | #2e7d42 | 5.09 | ✅ |
| Body text (light) | #1f2a24 | #ffffff | 14.84 | ✅ |
| Secondary text (light) | #56665c | #ffffff | 6.09 | ✅ |
| "Atenção" badge | #b45309 | #fff7e6 | 4.71 | ✅ |
| "Crítico" badge | #c62828 | #fdecec | 4.92 | ✅ |
| Body text (dark) | #e6efe9 | #17211b | 14.09 | ✅ |
| Secondary text (dark) | #a3b5aa | #17211b | 7.68 | ✅ |
| Primary button (dark) | #0f1612 | #5cc47a | 8.42 | ✅ |
| Input border (UI, 1.4.11) | #6b7f73 | #ffffff | 4.28 | ✅ (≥3) |

## Keyboard

| Component | Tab | Enter/Space | Esc |
|---|---|---|---|
| Mobile menu | Hamburger → links → actions | Opens/closes | Closes |
| Carousel | ‹ → dots → › → pause | Changes slide / pauses | n/a |
| Show-password eye | After the password field | Shows/hides | n/a |
| Dashboard drawer | Focus trapped inside | n/a | Closes and returns focus |
| Toasts | Close button | Closes | Closes |

## Architecture (new files)

- `src/styles.css`: design system (tokens for colour, radius, shadow, spacing; light and dark themes; buttons; fields; checkbox; auth layout)
- `services/preferencias.ts`: theme and font size
- `services/toast.ts` + `components/toast/`: pop-up notifications
- `services/auth.ts`: session with "keep me logged in"
- `components/icone/`: SVG icon set (Lucide style, ISC licence)
- `components/barra-acessibilidade/`: shared A+ / A− / theme / Libras bar

## Recommended next steps

1. Test with NVDA (Windows) and VoiceOver. The automated checks here don't replace a real screen reader.
2. Move login to a real backend. The password `12345678` is hard-coded on the front end.
3. Integrate the official VLibras widget instead of opening an external page.
4. Delete the old files in the project root so nobody confuses them with the real app.

---

## Round 2: access control, ticket flow, logout (24 Sep 2026)

### Access profiles
| Profile | Who | Access |
|---|---|---|
| **Administrator** | `admin@solutecno.com.br` | Dashboard: manages every ticket and moves each one through its stages |
| **Collaborator** | Any other `@solutecno.com.br` address (e.g. `renata.rosario@…`) | Help desk (`/chamado`): opens tickets and tracks their own |

Demo password for every account: `12345678`. The login page has a "Contas de demonstração" panel that fills in the fields.

- **The guard never redirects silently.** Without a session it sends you to `/login` with a message. A collaborator gets `/chamado` with the message "Acesso restrito ao administrador".
- **Collaborator on the admin login:** the credentials are accepted, but an in-page notice explains that the Dashboard is admin-only and offers **"Ir para meus chamados"** without a second login.
- The session stores the profile, and the profile is **always recalculated** from the admin list, so editing `localStorage` doesn't grant access. Keys from the old version (`usuarioLogado`) are removed.

### Ticket page
- Brand inside the card, with a "Central de chamados" badge. Identified-user bar with a **Sair** button. **Novo chamado / Meus chamados** tabs.
- 3-step indicator: **Identificação → Detalhes → Confirmação**.
- The identification step applies the **same rules as login**: corporate e-mail, password eye, required LGPD consent, and "Manter-me conectado". The session is shared with login.
- **After registering, the user moves to a confirmation screen** with the ticket number (CH-AAAA-NNNN), a summary, "O que acontece agora?" and three actions: *Acompanhar chamado*, *Abrir outro chamado*, *Voltar ao início*.
- **Meus chamados:** expandable list with the stage badge and the timeline of each ticket.

### Ticket lifecycle
`Aberto → Em análise → Em atendimento → Resolvido`, with a side state **Imprevisto** (with a reason) that can happen at any active stage. Resuming goes back to the stage where the ticket paused, and a resolved ticket can be reopened. Every change is recorded with date and time.

- **Admin (Dashboard):** "Gerenciar" opens the drawer with the timeline and the buttons *Avançar para…*, *Concluir chamado*, *Relatar imprevisto* (pick a reason), *Retomar atendimento* and *Reabrir chamado*. The table gained a **Etapa** column and the **Em aberto / Resolvidos / Todos** filters. The cards only count open tickets.
- **Collaborator (demo mode):** each ticket in "Meus chamados" has a dashed box, clearly marked as a demonstration, that simulates the IT team (advance, raise an issue, resume, reopen). This lets you walk through the whole flow without switching accounts.

### Other items
- **Help via WhatsApp:** the Dashboard sidebar shows the WhatsApp icon on a green badge, the text "Suporte via WhatsApp" and an external-link icon.
- **Logout with confirmation:** an accessible dialog (native `<dialog>`: traps focus, closes with Esc or a click outside) asks "Sair do sistema?". On confirm, a "Você saiu do sistema" pop-up appears. Same behaviour on the Dashboard and the help desk.
- **Pop-ups repositioned:** top-right below the header. When the drawer is open they move to its left so they never cover its buttons. On mobile they appear at the top.
