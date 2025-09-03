# Quest Log 🗒️✨

A retro notebook–styled, gamified task tracker. Add quests, earn XP, level up, and watch your productivity grow—100% vanilla HTML + CSS + JavaScript (no build step, no frameworks).

## 🔥 Preview

| Desktop                                   | Completed                                 | Edit / Favorite                           |
| ----------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| ![Preview 1](./screenshots/preview-1.png) | ![Preview 2](./screenshots/preview-2.png) | ![Preview 3](./screenshots/preview-3.png) |

Live Demo : https://Quest-Log.ankankun.me/

---

## 🎯 Concept

Turn a plain to‑do list into a tiny RPG ritual:

- Tasks become **quests**.
- Completing them grants **XP** & levels.
- Favorites (⭐) auto-float to the top.
- Notebook aesthetic + micro-interactions keep it tactile.

---

## ✨ Features

- Add quests with optional due date (labels: Today / Tomorrow / Overdue).
- Inline edit (double‑click quest text).
- Mark complete for XP + floating star + celebratory flash.
- XP & Level system with scaling requirements.
- Favorites sort above others automatically.
- Dynamic spiral binding holes based on height.
- Local persistence via `localStorage` (tasks, XP, level).
- Accessible focus states + keyboard usage.
- Pure CSS design tokens for fast theming.

---

## 🧪 XP & Level Mechanics

| Action                      | XP  |
| --------------------------- | --- |
| Add quest                   | +5  |
| Complete quest (first time) | +10 |

Level requirement: `100 + (level - 1) * 20`.
Excess XP rolls into the next level. A banner appears on level-up.

---

## 🗂️ Structure

```
Quest-Log/
  index.html        # Markup
  style.css         # Styles, tokens, animations
  script.js         # Logic: state, XP, rendering
  assets/           # add.png, calendar.png, check.png
  design-tokens.json
  style-guide.md
  component-breakdown.md
  README.md
  screenshots/     # The website previews
```

---

## 🏛️ Architecture

| Part              | Role                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| Global state vars | `tasks`, `xp`, `level`                                                   |
| Persistence       | `localStorage` (keys: `questLog_tasks`, `questLog_xp`, `questLog_level`) |
| Rendering         | Full list rebuild via template cloning (simple & predictable)            |
| Sorting           | favorites → incomplete → complete → newest                               |
| Gamification      | `xpForLevel()`, `addXP()`, rollover logic                                |
| Dynamic UI        | inline editing, star toggle, animated completion                         |

---

## 📄 Key Functions (script.js)

- `render()` – Rebuilds quest list (keeps code understandable).
- `addXP(amount)` – Adds XP and handles level overflow.
- `xpForLevel(level)` – Progressive difficulty.
- `updateBindingHoles()` – Generates spiral holes based on container height.
- `formatDue(dateStr)` – Human-friendly due labels.

---

## ♿ Accessibility

- Descriptive `aria-label`s for controls.
- `:focus-visible` usage for keyboard-only outlines.
- Buttons instead of divs for interactive elements.

---

## 🎨 Theming

All major colors & fonts live at the top of `style.css` under `:root`. Example:

```css
:root {
  --paper-bg: #f8f5e6;
  --ink-primary: #4a3e2a;
  --progress-bar: #a4c3a2;
  --reward-star: #d4b556;
}
```

---

## 💾 Persistence Details

| Data  | Key              | Format            |
| ----- | ---------------- | ----------------- |
| Tasks | `questLog_tasks` | JSON string array |
| XP    | `questLog_xp`    | Integer           |
| Level | `questLog_level` | Integer           |

Isolation: browser + device + profile. Incognito/private windows reset on close.

---

## 📈 Possible Enhancements

- Daily streaks & achievements
- Tag / category filters
- Export / import UI
- Search & batch actions
- Dark / sepia themes
- Cloud sync (Supabase / Firebase)
- Keyboard shortcuts (e.g., `N` for new quest)

---

## 🧪 Learning Exercises

| Goal               | Start In                       |
| ------------------ | ------------------------------ |
| Change level curve | `xpForLevel()`                 |
| Add bulk complete  | New toolbar + iterate tasks    |
| Add search         | Filter inside `render()`       |
| Swap tick graphic  | `.checkbox.checked` background |
| Add animations     | Extend CSS keyframes           |

---

## ⚙️ Performance Notes

- Re-render is O(n); fine for typical personal use (< 1–2k tasks).
- No virtual DOM; clarity > micro-optimization.
- Minimal layout thrash (single rebuild per action).

---

## 🛡️ License

MIT License © 2025 Ankankun .

---

## 🤝 Acknowledgements

- Fonts: Google Fonts (Courier Prime, Indie Flower)
- Textures: transparenttextures.com
- Inspiration: stationery + light gamification.

---

## 🔗 Use in Portfolio / LinkedIn

Narrative hook ideas:

- "Built a gamified task app with zero frameworks to highlight core web fundamentals."
- "Implemented scalable level system + dynamic visual affordances (spiral binding)."
- "Focused on reverse-engineer‑able code for teaching/interview contexts."

---

Happy questing! Feel free to fork and extend.
