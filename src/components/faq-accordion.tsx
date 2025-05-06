"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqAccordion = () => {
  const faqItems = [
    {
      question: "What is Solana Kit?",
      answer:
        "Solana Kit is an all-in-one toolkit for interacting with the Solana blockchain. It allows users to create tokens, transfer SOL, view transaction history, and participate in events like airdrops — all from one interface.",
    },
    {
      question: "Can I still claim the SOL Airdrop?",
      answer:
        "Yes, the SOL Airdrop feature is still available. You can check eligibility and claim your tokens directly through the Airdrop section in Solana Kit.",
    },
    {
      question: "How do I create a custom token?",
      answer:
        "Solana Kit includes a token creation tool that lets you define the token name, symbol, total supply, and decimals. You'll need a small amount of SOL to cover the creation fees.",
    },
    {
      question: "How do I transfer SOL or tokens?",
      answer:
        "Go to the 'Transfer' section, enter the recipient's Solana address, select the asset (SOL or a token), and submit the transaction. Make sure you have enough SOL to cover transaction fees.",
    },
    {
      question: "How can I view my transaction history?",
      answer:
        "Solana Kit provides a history section where you can see recent transfers, token interactions, and airdrop claims. It fetches data directly from the blockchain.",
    },
    {
      question: "What wallets are supported?",
      answer:
        "Solana Kit supports major Solana wallets including Phantom, Solflare, and Torus. Make sure your wallet is connected to the Solana mainnet.",
    },
    {
      question: "Do I need to pay gas fees?",
      answer:
        "Yes, all operations on the Solana network require minimal transaction fees, payable in SOL. These are significantly lower than most other blockchains.",
    },
    {
      question: "I'm facing issues with the app. What should I do?",
      answer:
        "Please ensure your wallet is connected correctly and has sufficient SOL for fees. If the issue persists, reach out via our support channels on Discord or Twitter.",
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-400">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FaqAccordion;
