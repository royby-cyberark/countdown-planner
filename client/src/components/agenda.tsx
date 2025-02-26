import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, X, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

export default function Agenda() {
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();

  const { data: agenda = [], isLoading } = useQuery({
    queryKey: ["/api/agenda"],
  });

  const { mutate: createAgenda, isPending: isCreating } = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/agenda", {
        content,
        order: agenda.length,
        highlighted: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agenda"] });
      setNewItem("");
      toast({
        description: "Agenda item added successfully",
      });
    },
  });

  const { mutate: updateAgenda } = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: number;
      content?: string;
      highlighted?: boolean;
    }) => {
      return apiRequest("PATCH", `/api/agenda/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agenda"] });
      setEditingId(null);
      toast({
        description: "Agenda item updated successfully",
      });
    },
  });

  const { mutate: deleteAgenda } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/agenda/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agenda"] });
      toast({
        description: "Agenda item deleted successfully",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add agenda item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && newItem.trim()) {
              createAgenda(newItem.trim());
            }
          }}
        />
        <Button
          size="icon"
          onClick={() => newItem.trim() && createAgenda(newItem.trim())}
          disabled={isCreating || !newItem.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {agenda.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-2 p-2 rounded-md transition-colors cursor-pointer group",
              item.highlighted
                ? "bg-primary/10 hover:bg-primary/20"
                : "bg-card hover:bg-accent/50"
            )}
            onClick={() =>
              updateAgenda({ id: item.id, highlighted: !item.highlighted })
            }
          >
            {editingId === item.id ? (
              <>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && editValue.trim()) {
                      updateAgenda({ id: item.id, content: editValue.trim() });
                    }
                  }}
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    editValue.trim() &&
                      updateAgenda({ id: item.id, content: editValue.trim() });
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1">{item.content}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(item.id);
                    setEditValue(item.content);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                deleteAgenda(item.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
