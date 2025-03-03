import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Countdown } from "@shared/schema";

function formatTimeLeft(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "00:00:00";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function Countdown() {
  const [editMode, setEditMode] = useState(false);
  const [date, setDate] = useState(localStorage.getItem("countdownDate") || format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(localStorage.getItem("countdownTime") || "");
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const { toast } = useToast();

  const { data: countdown, isLoading } = useQuery<Countdown>({
    queryKey: ["/api/countdown"],
  });

  useEffect(() => {
    if (!countdown?.targetTime) return;

    const targetDate = new Date(countdown.targetTime);
    const updateTimer = () => {
      setTimeLeft(formatTimeLeft(targetDate));
    };

    // Update immediately
    updateTimer();

    // Then update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [countdown?.targetTime]);

  const { mutate: setCountdown, isPending } = useMutation({
    mutationFn: async (targetTime: string) => {
      return apiRequest("POST", "/api/countdown", { targetTime });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/countdown"] });
      setEditMode(false);
      toast({
        title: "Success",
        description: "Countdown updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update countdown",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="h-24 flex items-center justify-center">Loading...</div>;
  }

  if (editMode) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              localStorage.setItem("countdownDate", e.target.value);
            }}
          />
          <Input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              localStorage.setItem("countdownTime", e.target.value);
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (!date || !time) return;
              // Create a local date string from the date and time inputs
              const targetDate = new Date(`${date}T${time}`);
              setCountdown(targetDate.toISOString());
            }}
            disabled={!date || !time || isPending}
          >
            Save
          </Button>
          <Button
            variant="outline"
            onClick={() => setEditMode(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  const targetTime = countdown?.targetTime ? new Date(countdown.targetTime) : null;

  return (
    <div className="flex flex-col items-center space-y-6">
      {targetTime ? (
        <>
          <div className="text-7xl font-bold font-mono tracking-wider bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            {timeLeft}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground/80">
            <Calendar className="h-4 w-4" />
            <span>{format(targetTime, "PPPp")}</span>
          </div>
        </>
      ) : (
        <div className="text-muted-foreground/80">No countdown set</div>
      )}
      <Button
        variant="outline"
        onClick={() => setEditMode(true)}
        className="border-primary/30 hover:border-primary/50 transition-colors"
      >
        {targetTime ? "Edit Time" : "Set Time"}
      </Button>
    </div>
  );
}