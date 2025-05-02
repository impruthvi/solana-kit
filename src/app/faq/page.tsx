import FaqAccordion from "@/components/faq-accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">
            Frequently Asked Questions
          </CardTitle>
          <CardDescription className="text-center">
            Find answers to common questions about the SOL airdrop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FaqAccordion />
        </CardContent>
      </Card>
    </div>
  );
}
