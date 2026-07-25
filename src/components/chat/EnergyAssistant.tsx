"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, X } from "lucide-react";

type Message = { role: "assistant" | "user"; text: string };

const quickQuestions = [
  "Which service may suit my home?",
  "Can I check funding eligibility?",
  "How do I book a survey?"
];

function getReply(input: string) {
  const text = input.toLowerCase();
  if (text.includes("fund") || text.includes("grant") || text.includes("eligib")) {
    return "Funding or scheme eligibility depends on the household, property and available programme. Use the eligibility form and our team will review your details.";
  }
  if (text.includes("solar")) {
    return "Solar panels may suit homes with suitable roof space, limited shading and an appropriate roof condition. A property assessment is needed before recommending a system.";
  }
  if (text.includes("loft")) {
    return "Loft insulation can help reduce heat loss through the roof. We first check access, existing insulation, ventilation and the loft condition.";
  }
  if (text.includes("cavity") || text.includes("wall")) {
    return "Wall-insulation suitability depends on the construction and condition of the property. Warm Life offers cavity, internal and external wall options after an appropriate survey.";
  }
  if (text.includes("heat pump") || text.includes("heating")) {
    return "A heat pump should be designed around the property's heat loss, insulation and heating emitters. We can help assess whether it is a practical option for your home.";
  }
  if (text.includes("survey") || text.includes("book") || text.includes("contact")) {
    return "You can start through the contact and eligibility page. Add your preferred service and property details, and the team can arrange the appropriate next step.";
  }
  if (text.includes("service") || text.includes("suit")) {
    return "The best starting point is a whole-home review. Solar supports electricity generation, insulation improves heat retention, and heat pumps or controls improve heating performance.";
  }
  return "I can guide you on solar panels, loft or wall insulation, heat pumps, heating controls, EPC support and eligibility. For a property-specific answer, please use the eligibility form.";
}

export default function EnergyAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi, I’m the Warm Life Energy Assistant. Ask me about services, surveys or eligibility." }
  ]);
  const logRef = useRef<HTMLDivElement>(null);
  const canSend = useMemo(() => input.trim().length > 0, [input]);

  function submit(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [...current, { role: "user", text: clean }, { role: "assistant", text: getReply(clean) }]);
    setInput("");
    window.setTimeout(() => logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }), 30);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit(input);
  }

  return (
    <div className={`energyAssistant ${open ? "isOpen" : ""}`}>
      {open && (
        <section className="assistantPanel" aria-label="Warm Life Energy Assistant">
          <header>
            <div className="assistantAvatar"><Bot size={20} /></div>
            <div><strong>Energy Assistant</strong><span><i /> Online now</span></div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant"><X size={18} /></button>
          </header>
          <div className="assistantIntro"><Sparkles size={15} /><span>Instant guidance for your home-energy journey</span></div>
          <div className="assistantMessages" ref={logRef} aria-live="polite">
            {messages.map((message, index) => <p className={message.role} key={`${message.role}-${index}`}>{message.text}</p>)}
          </div>
          {messages.length < 3 && <div className="assistantQuick">{quickQuestions.map((question) => <button key={question} onClick={() => submit(question)}>{question}</button>)}</div>}
          <form onSubmit={handleSubmit}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." aria-label="Ask the Energy Assistant" />
            <button disabled={!canSend} aria-label="Send message"><Send size={17} /></button>
          </form>
          <footer><Link href="/contact#eligibility">Start full eligibility check</Link><ChevronDown size={14} /></footer>
        </section>
      )}
      <button className="assistantLauncher" onClick={() => setOpen((current) => !current)} aria-label={open ? "Close Energy Assistant" : "Open Energy Assistant"}>
        {open ? <X size={22} /> : <MessageCircle size={23} />}
        {!open && <span>Ask Warm Life</span>}
      </button>
    </div>
  );
}
