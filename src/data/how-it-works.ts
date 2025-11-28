import { HomeIcon, Sparkles, CreditCard, PartyPopper } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Step {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const steps: Step[] = [
  {
    step: 1,
    icon: HomeIcon,
    title: "Choose Your House",
    description: "Browse our collection of luxury party houses across the UK. Filter by location, group size, and features like hot tubs and pools.",
  },
  {
    step: 2,
    icon: Sparkles,
    title: "Add Experiences",
    description: "Enhance your stay with cocktail classes, butlers in the buff, private chefs, spa treatments, and more.",
  },
  {
    step: 3,
    icon: CreditCard,
    title: "Pay Your Deposit",
    description: "Secure your booking with a 25% deposit. The remaining balance is due 8 weeks before arrival.",
  },
  {
    step: 4,
    icon: PartyPopper,
    title: "Final Balance & Enjoy",
    description: "Pay the final balance 8 weeks before arrival, then relax and get ready for an unforgettable celebration.",
  },
];

export const faqs: FAQ[] = [
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking 3-6 months in advance, especially for peak dates like bank holiday weekends and summer. Popular properties can book up to a year ahead for prime dates.",
  },
  {
    question: "What's included in the rental price?",
    answer: "The rental price includes full use of the property and all its amenities. Utilities, WiFi, linen, and towels are provided. Cleaning fees and security deposits are additional.",
  },
  {
    question: "Can I extend my stay?",
    answer: "Extensions are subject to availability. Contact us as soon as possible if you'd like to extend, and we'll check if the property is free for additional nights.",
  },
  {
    question: "What happens if we damage something?",
    answer: "Minor wear and tear is expected and covered. Any damage beyond normal use will be deducted from your security deposit. We'll provide photos and receipts for any repairs needed.",
  },
  {
    question: "Are pets allowed?",
    answer: "Some properties are pet-friendly. Look for the 'Pet Friendly' badge on property listings. There may be an additional pet fee, and pets must be well-behaved and supervised.",
  },
  {
    question: "Can we have visitors who aren't staying overnight?",
    answer: "Day visitors must be pre-approved and cannot exceed the property's maximum occupancy at any time. All guests must respect house rules and quiet hours.",
  },
  {
    question: "What if someone in our group cancels?",
    answer: "You're responsible for the full booking amount regardless of individual cancellations. We recommend taking out group travel insurance to cover these situations.",
  },
  {
    question: "Is there a noise curfew?",
    answer: "Most properties have quiet hours between 11pm and 8am. This means keeping music, conversation, and activities to a reasonable level out of respect for neighbours.",
  },
];
