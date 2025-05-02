"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const AirdropTimer = () => {
  // Set end date to June 30, 2025
  const endDate = new Date("2025-06-30T23:59:59").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          Airdrop Ends In
        </h2>
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {timeUnits.map((unit, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-secondary w-full py-3 rounded-md flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-mono font-bold text-primary">
                  {unit.value.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs md:text-sm mt-2 text-gray-400">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AirdropTimer;
