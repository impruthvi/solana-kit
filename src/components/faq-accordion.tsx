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
      question: "What is the SOL Airdrop?",
      answer:
        "The SOL Airdrop is a token distribution event where eligible Solana wallet addresses can claim a predetermined amount of SOL tokens for free. This airdrop aims to reward early supporters and users of the Solana ecosystem.",
    },
    {
      question: "How do I check if I'm eligible?",
      answer:
        "You can check your eligibility by connecting your Solana wallet on the Airdrop page or by entering your Solana wallet address in the Eligibility page. The system will automatically verify if your address meets the criteria for the airdrop.",
    },
    {
      question: "What are the eligibility criteria?",
      answer:
        "Eligibility for this airdrop is based on several factors including past interactions with Solana protocols, token holdings, and on-chain activity prior to the snapshot date. Specific details are kept private to prevent gaming the system.",
    },
    {
      question: "How many tokens can I claim?",
      answer:
        "The amount of tokens you can claim varies based on your level of participation in the Solana ecosystem. Once you check your eligibility, the system will display the exact amount you are eligible to receive.",
    },
    {
      question: "When is the airdrop deadline?",
      answer:
        "The airdrop claim period will end on June 30, 2025. After this date, unclaimed tokens will be returned to the community treasury for future initiatives.",
    },
    {
      question: "Do I need to pay gas fees to claim?",
      answer:
        "Yes, you will need a small amount of SOL in your wallet to cover the transaction fees on the Solana network. However, these fees are typically very minimal compared to other blockchains.",
    },
    {
      question: "What wallets are supported?",
      answer:
        "This airdrop supports major Solana wallets including Phantom, Solflare, and Torus. Make sure your wallet is connected to the Solana mainnet before attempting to claim.",
    },
    {
      question: "I'm having issues claiming my tokens. What should I do?",
      answer:
        "If you're experiencing issues, please ensure your wallet is properly connected and has sufficient SOL for transaction fees. If problems persist, please reach out to our support team through Discord or Twitter.",
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
