# 🎭 Undercover AI

A high-energy multiplayer party game powered by AI-generated word pairs. Gather your crew, pass the device, drop subtle clues, and smoke out the imposters in this neon-streaked social deduction experience.

🎮 **[Play Live Demo](https://under-cover-game-jet.vercel.app/)**

## ✨ Features

- 🤖 **AI-Powered Word Generation** - Unique word pairs generated on-demand using Groq AI
- 👥 **Local Multiplayer** - Pass & Play mode for 3-8 players
- 🎨 **Retro Neon UI** - Eye-catching cyberpunk-inspired design with smooth animations
- 🔄 **Infinite Replayability** - Every game features fresh AI-generated content
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 💾 **Game History** - Track past games with MongoDB integration

## 🎯 How to Play

**Undercover** is a social deduction game where players receive secret words:
- Most players get the **Civilian** word
- A few players get the **Undercover** word (similar but different)
- One player might be **Mr. White** (no word at all)

Players take turns giving one-word clues about their word. After discussion, vote to eliminate suspects. The goal:
- **Civilians**: Identify and eliminate all Undercovers
- **Undercovers**: Survive or eliminate Civilians
- **Mr. White**: Guess the Civilian word to win

[Learn detailed rules →](https://en.wikipedia.org/wiki/Undercover_(party_game))

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Animations
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **AI Integration**: [Groq SDK](https://groq.com/) for word generation
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Groq API Key** ([Get one free](https://console.groq.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ArashadDodhiya/UnderCoverGame.git
cd undercover
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
undercover/
├── app/
│   ├── api/
│   │   ├── generate-words/    # AI word generation endpoint
│   │   └── get-word-image/    # Word image retrieval
│   ├── game/                  # Game page route
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── game/
│   │   ├── SetupPhase.tsx     # Player setup
│   │   ├── RevealPhase.tsx    # Word reveal
│   │   ├── CluePhase.tsx      # Clue giving
│   │   ├── VotePhase.tsx      # Voting
│   │   ├── ResultPhase.tsx    # Vote results
│   │   └── WinnerPhase.tsx    # Game end
│   └── ui/                    # Reusable UI components
├── context/
│   └── GameContext.tsx        # Game state management
├── lib/
│   ├── mongodb.ts             # Database connection
│   └── utils.ts               # Utility functions
└── models/
    └── Game.ts                # Mongoose schema
```

## 🎮 Game Flow

1. **Setup Phase** - Configure number of players, Undercovers, and Mr. White
2. **Reveal Phase** - Each player privately views their secret word
3. **Clue Phase** - Players take turns giving one-word clues
4. **Vote Phase** - Vote to eliminate a suspected Undercover
5. **Result Phase** - See who was eliminated
6. **Winner Phase** - Game ends when a team wins

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add environment variables (`GROQ_API_KEY`, `MONGODB_URI`)
4. Deploy!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ArashadDodhiya/UnderCoverGame/issues).

## 👨‍💻 Author

**Arashad Dodhiya**

- GitHub: [@ArashadDodhiya](https://github.com/ArashadDodhiya)

## 🙏 Acknowledgments

- Game concept based on the classic [Undercover party game](https://en.wikipedia.org/wiki/Undercover_(party_game))
- AI word generation powered by [Groq](https://groq.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)

---

Made with ❤️ and ☕ | [Report Bug](https://github.com/ArashadDodhiya/UnderCoverGame/issues) | [Request Feature](https://github.com/ArashadDodhiya/UnderCoverGame/issues)
