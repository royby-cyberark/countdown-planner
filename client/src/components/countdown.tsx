import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function Countdown() {
  const [editMode, setEditMode] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const { toast } = useToast();

  const { data: countdown, isLoading } = useQuery({
    queryKey: ["/api/countdown"],
  });

  const { mutate: setCountdown, isPending } = useMutation({
    mutationFn: async (targetTime: Date) => {
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update countdown",
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
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              const targetTime = new Date(`${date}T${time}`);
              setCountdown(targetTime);
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
    <div className="flex flex-col items-center space-y-4">
      {targetTime ? (
        <>
          <div className="text-4xl font-bold">
            {formatDistanceToNow(targetTime, { addSuffix: true })}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(targetTime, "PPPp")}</span>
          </div>
        </>
      ) : (
        <div className="text-muted-foreground">No countdown set</div>
      )}
      <Button variant="outline" onClick={() => setEditMode(true)}>
        {targetTime ? "Edit Time" : "Set Time"}
      </Button>
    </div>
  );
}
