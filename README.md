# Vehicle Data Chat App

React SPA with three views for exploring vehicle data, powered by Gemini.

## Setup

```bash
npm install
npm run dev     # development
npm run build   # production build
```

## Views

Toggle between views using the button in the top-left corner.

1. **All Data** - Table view of all vehicles. Chat has full dataset context.
2. **Tree Nav** - Drill-down navigation: Brand → Vehicles → Details. Chat knows the data structure but not values.
3. **Full Chat** - Full-screen chat with complete dataset context.

## Gemini API Key

Click the ⚙️ icon in the chat panel to enter your API key. Get one from [Google AI Studio](https://aistudio.google.com/app/apikey). Keys are stored in browser localStorage.

## Data & Prompts

- `src/data/cars.json` - Mock vehicle dataset
- `src/prompts/index.ts` - System prompts for each view

## Structure

```
src/
├── components/
│   ├── ChatPanel.tsx      # Chat UI + Gemini integration
│   ├── AllDataView.tsx    # Table view
│   └── TreeNavView.tsx    # Tree navigation
├── data/
│   └── cars.json
├── prompts/
│   └── index.ts
├── App.tsx
└── types.ts
```
