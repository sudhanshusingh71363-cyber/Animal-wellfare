import React, { useState, useEffect, useRef } from 'react';
import {
  AnimalType,
  AssistantMessage,
  ConversationState,
  SymptomQuestion as SymptomQuestionType,
} from '../../types/assistant';
import {
  INITIAL_BOT_MESSAGE,
  createNewConversationState,
  detectCategoryFromText,
  processUserResponse,
  checkImmediateEmergency,
  analyzeWithGeminiIfConfigured,
} from '../../lib/assistantService';
import { CONCERN_CATEGORIES, getQuestionsForConcern } from '../../lib/symptomKnowledgeBase';
import { ChatMessage } from './ChatMessage';
import { SymptomQuestion } from './SymptomQuestion';
import { TriageResult } from './TriageResult';
import { ImageUploader } from './ImageUploader';
import {
  Send,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  MapPin,
  Bot,
  ShieldCheck,
} from 'lucide-react';

interface AnimalAssistantProps {
  initialCategory?: string;
  initialAnimalType?: AnimalType;
  onNavigateToClinics: () => void;
}

export const AnimalAssistant: React.FC<AnimalAssistantProps> = ({
  initialCategory,
  initialAnimalType = 'dog',
  onNavigateToClinics,
}) => {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>(initialAnimalType);
  const [state, setState] = useState<ConversationState>(() =>
    createNewConversationState(initialAnimalType)
  );
  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_BOT_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state.isCompleted]);

  // Handle pre-filled category from home quick cards
  useEffect(() => {
    if (initialCategory && !state.selectedCategory) {
      handleSelectCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleAnimalChange = (newAnimal: AnimalType) => {
    setSelectedAnimal(newAnimal);
    handleReset(newAnimal);
  };

  const handleReset = (animal: AnimalType = selectedAnimal) => {
    const newState = createNewConversationState(animal);
    setState(newState);
    setMessages([
      {
        ...INITIAL_BOT_MESSAGE,
        id: `msg-init-${Date.now()}`,
        text: `Hi, I'm PawCare. I'm here to help you take the next safe step for this ${animal} in need.

You don't need to know anything about animals. I'll ask a few simple questions and guide you.

What have you noticed?`,
      },
    ]);
    setAttachedImage(undefined);
    setInputText('');
  };

  // User selects an initial concern category
  const handleSelectCategory = (categoryId: string) => {
    const questions = getQuestionsForConcern(selectedAnimal, categoryId);
    const categoryDef = CONCERN_CATEGORIES.find((c) => c.id === categoryId);

    const userMessage: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: categoryDef?.name || categoryId,
      timestamp: new Date().toISOString(),
    };

    const firstQuestion = questions[0];

    const updatedState: ConversationState = {
      ...state,
      selectedCategory: categoryId,
      currentQuestionIndex: 0,
    };

    setState(updatedState);

    let introText = `I'm sorry the ${selectedAnimal} isn't feeling well. I'll help you check what to do next.\n\nFirst, let's look for signs that may need urgent veterinary attention:`;

    if (categoryId === 'poisoning') {
      introText = `⚠️ **Potential Toxin Exposure:** Time is critical for suspected poison. Let's check vital safety indicators immediately:`;
    } else if (categoryId === 'injury') {
      introText = `I'll guide you to check the injury safely without putting you or the ${selectedAnimal} at risk. Let's check for severe bleeding first:`;
    }

    const botReply: AssistantMessage = {
      id: `bot-intro-${Date.now()}`,
      sender: 'bot',
      text: introText,
      timestamp: new Date().toISOString(),
      question: firstQuestion,
    };

    setMessages((prev) => [...prev, userMessage, botReply]);
  };

  // User answers a structured question
  const handleAnswerQuestion = (
    question: SymptomQuestionType,
    selectedIds: string[],
    selectedLabels: string[]
  ) => {
    const userMessage: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: selectedLabels.join(', '),
      timestamp: new Date().toISOString(),
    };

    const { updatedState, nextBotMessage } = processUserResponse(
      state,
      question,
      selectedIds,
      selectedLabels
    );

    setState(updatedState);
    setMessages((prev) => [...prev, userMessage, nextBotMessage]);
  };

  // User submits free-text input
  const handleSendFreeText = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text && !attachedImage) return;

    const currentImage = attachedImage;
    setInputText('');
    setAttachedImage(undefined);
    setIsProcessing(true);

    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text || 'Uploaded image for observation.',
      timestamp: new Date().toISOString(),
      imageUrl: currentImage,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Check immediate emergency in text
    const emergencyCheck = checkImmediateEmergency(state, text);

    if (emergencyCheck.isEmergency) {
      const { updatedState, nextBotMessage } = processUserResponse(
        state,
        {
          id: 'free_text_emergency',
          text: 'Free text triage check',
          concernCategory: state.selectedCategory || 'emergency',
          type: 'single_choice',
          choices: [],
          order: 99,
        },
        ['emergency_flag'],
        ['Emergency flagged from description'],
        text
      );

      setState(updatedState);
      setMessages((prev) => [...prev, nextBotMessage]);
      setIsProcessing(false);
      return;
    }

    // If no category selected yet, auto-detect category
    if (!state.selectedCategory) {
      const { category } = detectCategoryFromText(text);
      handleSelectCategory(category);
      setIsProcessing(false);
      return;
    }

    // Optional AI observation if Gemini is configured
    const aiResult = await analyzeWithGeminiIfConfigured(text, state.animalType, currentImage);

    // Fallback conversational reply
    const botResponseText = aiResult
      ? `${aiResult.text}\n\nLet's continue checking the essential safety questions:`
      : `Thank you for sharing those details. I've noted that. Let's make sure we check all critical signs:`;

    const questions = getQuestionsForConcern(state.animalType, state.selectedCategory);
    const currentQ = questions[state.currentQuestionIndex];

    const botMsg: AssistantMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botResponseText,
      timestamp: new Date().toISOString(),
      question: currentQ,
      imageObservation: currentImage ? 'Photo uploaded. Never delay urgent care waiting for photo evaluation.' : undefined,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsProcessing(false);
  };

  // Find the active pending question (the last question in messages, if not completed)
  const lastBotMessageWithQuestion = !state.isCompleted
    ? [...messages].reverse().find((m) => m.question !== undefined)
    : undefined;
  const currentQuestion = lastBotMessageWithQuestion?.question;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Header & Species Selector */}
      <div className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-card mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-sageLight text-brand-forest flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-brand-forestDark flex items-center gap-2">
                PawCare Assistant
                <span className="text-[11px] font-semibold bg-brand-forest text-white px-2 py-0.5 rounded-full">
                  AI First-Aid
                </span>
              </h1>
              <p className="text-xs text-brand-muted">
                Step-by-step guidance for anyone encountering a sick or injured animal
              </p>
            </div>
          </div>

          {/* Animal Species Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-brand-offwhite p-1 rounded-xl border border-brand-border self-stretch sm:self-auto overflow-x-auto">
            {(['dog', 'cat', 'cow', 'bird', 'other'] as AnimalType[]).map((animal) => (
              <button
                key={animal}
                onClick={() => handleAnimalChange(animal)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 ${
                  selectedAnimal === animal
                    ? 'bg-brand-forest text-white shadow-xs'
                    : 'text-brand-charcoal/70 hover:text-brand-forest hover:bg-brand-sage/40'
                }`}
              >
                {animal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-brand-offwhite/50 border border-brand-border rounded-2xl shadow-card overflow-hidden flex flex-col min-h-[580px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[640px]">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Initial Category Selection Chips if not yet chosen */}
          {!state.selectedCategory && (
            <div className="my-5 p-4 sm:p-5 bg-white rounded-2xl border border-brand-border shadow-subtle animate-fadeIn">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-forest mb-3">
                Select What Best Describes The Issue:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CONCERN_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className="p-3 rounded-xl border border-brand-border hover:border-brand-forest hover:bg-brand-sageLight text-left transition-all flex items-start gap-2.5 group"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-forest mt-1.5 group-hover:scale-125 transition-transform shrink-0"></span>
                    <div>
                      <div className="text-sm font-semibold text-brand-charcoal group-hover:text-brand-forest">
                        {cat.name}
                      </div>
                      <div className="text-[11px] text-brand-muted leading-tight mt-0.5">
                        {cat.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Question Input Box */}
          {currentQuestion && !state.isCompleted && (
            <SymptomQuestion
              question={currentQuestion}
              onAnswer={(selectedIds, selectedLabels) =>
                handleAnswerQuestion(currentQuestion, selectedIds, selectedLabels)
              }
              disabled={isProcessing}
            />
          )}

          {/* Triage Completed Result Card */}
          {state.triageResult && (
            <TriageResult
              result={state.triageResult}
              state={state}
              onFindNearbyClinics={onNavigateToClinics}
              onRestart={() => handleReset()}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom User Text Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-brand-border">
          <form onSubmit={handleSendFreeText} className="flex items-center gap-2">
            <ImageUploader
              onImageSelected={(url) => setAttachedImage(url)}
              onClear={() => setAttachedImage(undefined)}
              selectedImageUrl={attachedImage}
              disabled={isProcessing}
            />

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Describe symptoms in your own words (e.g. "dog is vomiting foam, swollen belly")...`}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-brand-border focus:outline-hidden focus:border-brand-forest focus:ring-1 focus:ring-brand-forest bg-brand-offwhite/50 text-brand-charcoal"
            />

            <button
              type="submit"
              disabled={isProcessing || (!inputText.trim() && !attachedImage)}
              className="px-4 py-2.5 rounded-xl bg-brand-forest text-white text-sm font-semibold hover:bg-brand-forestLight disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

          {/* Subtext info */}
          <div className="flex items-center justify-between text-[11px] text-brand-muted mt-2 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-forest" />
              <span>Deterministic Clinical Safety Guardrails Active</span>
            </span>
            <button
              onClick={() => handleReset()}
              className="text-brand-muted hover:text-brand-charcoal flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restart Flow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
