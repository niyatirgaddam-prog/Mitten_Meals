'use client';

import { useState } from 'react';
import type { SeekerProfile } from '../lib/auth';

interface FoodSupportChatProps {
  profile?: SeekerProfile;
}

interface SupportLink {
  label: string;
  href: string;
}

interface ChatMessage {
  id: number;
  sender: 'assistant' | 'you';
  text: string;
  links?: SupportLink[];
  places?: FoodPlace[];
}

interface FoodPlace {
  name: string;
  address: string;
  mapUrl: string;
  websiteUrl?: string;
}

const supportLinks = {
  map: { label: 'Open the food support map', href: '/map' },
  michigan211: { label: 'Michigan 211 food assistance', href: 'https://mi211.org/' },
  snap: { label: 'Michigan benefits and food assistance', href: 'https://www.michigan.gov/mdhhs/assistance-programs/food' },
  gleaners: { label: 'Gleaners Community Food Bank', href: 'https://www.gcfb.org/' },
  foodGatherers: { label: 'Food Gatherers', href: 'https://www.foodgatherers.org/' },
};

export default function FoodSupportChat({ profile }: FoodSupportChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: 'assistant',
      text: `Hi! I’m Foodie, your food support guide. Ask me about finding local food resources, dietary needs, accessibility, or Michigan food assistance.${profile?.dietaryNeeds.trim() ? ` I’ll keep your dietary needs in mind (${profile.dietaryNeeds.trim()}).` : ''}`,
      links: [supportLinks.map, supportLinks.michigan211],
    },
  ]);
  const [question, setQuestion] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const sendMessage = async (text: string) => {
    const trimmedQuestion = text.trim();
    if (!trimmedQuestion || isSearching) {
      return;
    }

    const history = messages
      .filter((message) => message.sender === 'you' || message.sender === 'assistant')
      .map((message) => ({
        role: message.sender === 'you' ? 'user' as const : 'assistant' as const,
        content: message.text,
      }))
      .slice(-10);
    setMessages((current) => [
      ...current,
      { id: current.length, sender: 'you', text: trimmedQuestion },
    ]);
    setQuestion('');
    setIsSearching(true);

    try {
      const response = await fetch('/api/foodie/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedQuestion, history, profile }),
      });
      const result = (await response.json()) as {
        answer?: string;
        error?: string;
        places?: FoodPlace[];
        placesUnavailable?: boolean;
      };
      if (!response.ok || !result.answer) {
        setMessages((current) => [
          ...current,
          {
            id: current.length,
            sender: 'assistant',
            text: result.error ?? 'Foodie couldn’t respond just now. Please try again.',
            links: [supportLinks.map, supportLinks.michigan211],
          },
        ]);
        return;
      }

      const placesNote = result.placesUnavailable
        ? ' Live nearby place search isn’t configured or available right now.'
        : '';
      setMessages((current) => [
        ...current,
        {
          id: current.length,
          sender: 'assistant',
          text: `${result.answer}${placesNote}`,
          links: [supportLinks.map, supportLinks.michigan211, supportLinks.snap],
          places: result.places,
        },
      ]);
    } catch (error: unknown) {
      console.error('Unable to send message to Foodie.', error);
      setMessages((current) => [
        ...current,
        {
          id: current.length,
          sender: 'assistant',
          text: 'Foodie could not connect to its AI service. Please try again in a moment.',
          links: [supportLinks.map, supportLinks.michigan211],
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="rounded-[2rem] border border-sky-200 bg-white/95 p-6 shadow-sm" aria-labelledby="food-support-chat-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-700">Food support assistant</p>
          <h2 id="food-support-chat-title" className="mt-1 text-2xl font-semibold text-slate-950">Chat with Foodie</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Ask about food support, or include a 5-digit ZIP code to find specific nearby places. Foodie uses your signup preferences when available.</p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">Here to help</span>
      </div>

      <div className="mt-5 max-h-96 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-4" aria-live="polite" aria-relevant="additions">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${message.sender === 'you' ? 'bg-blue-700 text-white' : 'border border-sky-100 bg-white text-slate-800'}`}>
              <p className="whitespace-pre-line text-sm leading-6">{message.text}</p>
              {message.places?.length ? (
                <ul className="mt-3 space-y-3">
                  {message.places.map((place) => (
                    <li key={`${place.name}-${place.address}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="font-semibold text-slate-900">{place.name}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{place.address}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <a href={place.mapUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700 underline underline-offset-2">
                          View on Google Maps
                        </a>
                        {place.websiteUrl ? (
                          <a href={place.websiteUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700 underline underline-offset-2">
                            Provider website
                          </a>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
              {message.links?.length ? (
                <ul className="mt-3 space-y-1.5">
                  {message.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                        className="text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {['I need food today', 'I have dietary needs', 'How do I find nearby help?'].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => void sendMessage(prompt)}
            disabled={isSearching}
            className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800 transition hover:border-sky-400 hover:bg-sky-100"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage(question);
        }}
      >
        <label htmlFor="food-support-question" className="sr-only">Ask Foodie a question</label>
        <input
          id="food-support-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Ask about food support..."
          maxLength={500}
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={!question.trim() || isSearching}
          className="rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSearching ? 'Searching…' : 'Send'}
        </button>
      </form>

      <p className="mt-3 text-xs leading-5 text-slate-500">Foodie uses Gemini AI. Your messages and food-support preferences are sent to Google to generate replies; avoid sharing sensitive personal information. Foodie cannot confirm live inventory or eligibility, so check details with each provider.</p>
    </section>
  );
}
