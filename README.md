# AI Chat Application

A modern, responsive chat application that integrates with OpenAI's GPT API to provide intelligent conversational AI capabilities.

## Features

- **Clean, Modern UI**: Responsive design with a professional chat interface
- **OpenAI Integration**: Seamlessly connects to OpenAI's GPT-3.5 API
- **Conversation History**: Maintains chat history with user and AI messages
- **Real-time Loading States**: Shows typing indicators and loading animations
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Secure API Key Management**: Local storage of API keys with show/hide functionality
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for beautiful, consistent icons
- **Build Tool**: Vite for fast development and building
- **API**: OpenAI GPT-3.5 Turbo

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account (or create one)
3. Navigate to the API Keys section
4. Click "Create new secret key"
5. Copy the generated key
6. Enter the key in the application when prompted

**Important**: Keep your API key secure and never share it publicly. The application stores it locally in your browser.

## Usage

1. **First Time Setup**: When you first open the application, you'll be prompted to enter your OpenAI API key
2. **Start Chatting**: Type your message in the input field and press Enter or click the send button
3. **View History**: All conversations are displayed in a chat-like interface with timestamps
4. **Clear History**: Use the trash icon in the header to clear all messages
5. **Update API Key**: Click the settings icon to update your API key

## Project Structure

```
src/
├── components/          # React components
│   ├── ApiKeyInput.tsx  # API key input form
│   ├── ChatHeader.tsx   # Chat header with controls
│   ├── ChatHistory.tsx  # Message history display
│   ├── ChatInput.tsx    # Message input form
│   ├── ChatMessage.tsx  # Individual message component
│   └── ErrorMessage.tsx # Error display component
├── hooks/               # Custom React hooks
│   ├── useChat.ts       # Chat state management
│   └── useLocalStorage.ts # Local storage utilities
├── services/            # API services
│   └── openai.ts        # OpenAI API integration
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Features Breakdown

### 1. Project Setup ✅
- Clean folder structure with separated components, services, and types
- TypeScript for type safety
- Modern React with hooks and functional components
- Vite for fast development experience

### 2. UI Design & Input Handling ✅
- Responsive design using Tailwind CSS
- Clean, modern interface with proper spacing and typography
- Text area with auto-resize functionality
- Submit button with loading states
- Mobile-first responsive design

### 3. AI API Integration ✅
- Full OpenAI GPT-3.5 integration
- Proper error handling for API failures
- Loading states with visual feedback
- Secure API key management
- Request/response formatting

### 4. Bonus: Conversation History ✅
- Chat-like message display with user and AI bubbles
- Timestamp tracking for all messages
- Clear history functionality
- Persistent conversation during session
- Smooth scrolling to new messages

## API Integration Details

The application uses OpenAI's Chat Completions API with the following configuration:
- **Model**: gpt-3.5-turbo
- **Max Tokens**: 1000
- **Temperature**: 0.7 (balanced creativity/consistency)

## Error Handling

The application handles various error scenarios:
- Invalid or missing API keys
- Network connectivity issues
- API rate limits and quota exceeded
- Invalid API responses
- General request failures

## Security Considerations

- API keys are stored locally in browser storage
- No API keys are transmitted to any servers other than OpenAI
- API keys are masked in the UI by default
- All API communications use HTTPS

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Browser Support

- Modern browsers with ES2020 support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).