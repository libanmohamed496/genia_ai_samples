import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { getAllDataPrompt, systemPrompts } from '../prompts';
import type { Paradigm, CarsData } from '../types';
import './ChatPanel.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  fullWidth?: boolean;
  paradigm: Paradigm;
  data?: CarsData;
}

const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
];

export function ChatPanel({ fullWidth = false, paradigm, data }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini-api-key') || '');
  const [tempApiKey, setTempApiKey] = useState('');
  const [model, setModel] = useState(() => localStorage.getItem('gemini-model') || 'gemini-2.5-flash');
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openSettings = () => {
    setTempApiKey(apiKey);
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('gemini-api-key', tempApiKey);
    localStorage.setItem('gemini-model', model);
    setShowSettings(false);
  };

  const getSystemPrompt = (): string => {
    if ((paradigm === 'all-data' || paradigm === 'full-chat') && data) {
      return getAllDataPrompt(data);
    }
    return systemPrompts[paradigm as keyof typeof systemPrompts];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      setError('Please set your Gemini API key in settings');
      return;
    }

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });

      // Build conversation history
      const history = messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Add current user message
      const contents = [
        ...history,
        { role: 'user', parts: [{ text: input }] },
      ];

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: getSystemPrompt(),
        },
      });

      const text = response.text ?? '';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chat-panel ${fullWidth ? 'full-width' : ''}`}>
      <div className="chat-header">
        <h3>Chat</h3>
        <button
          className="settings-btn"
          onClick={openSettings}
          title="API Settings"
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <h4>Gemini Settings</h4>

            <label>
              API Key:
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
              />
            </label>

            <label>
              Model:
              <select value={model} onChange={(e) => setModel(e.target.value)}>
                {GEMINI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="settings-buttons">
              <button onClick={handleSaveSettings}>Save</button>
              <button onClick={() => setShowSettings(false)}>Cancel</button>
            </div>

            <p className="settings-note">
              Get your API key from{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </a>
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>No messages yet. Start a conversation!</p>
            {!apiKey && (
              <p className="hint">Set your Gemini API key in settings (⚙️) to begin.</p>
            )}
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
          disabled={isLoading}
        />
        <button type="submit" className="send-btn" disabled={isLoading}>
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
