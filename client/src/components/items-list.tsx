import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, X, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function ItemsList() {
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/items"],
  });

  const { mutate: createItem, isPending: isCreating } = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/items", {
        content,
        order: items.length,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      setNewItem("");
      toast({
        description: "Item added successfully",
      });
    },
  });

  const { mutate: updateItem } = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      return apiRequest("PATCH", `/api/items/${id}`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      setEditingId(null);
      toast({
        description: "Item updated successfully",
      });
    },
  });

  const { mutate: deleteItem } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        description: "Item deleted successfully",
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
          placeholder="Add new item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && newItem.trim()) {
              createItem(newItem.trim());
            }
          }}
        />
        <Button
          size="icon"
          onClick={() => newItem.trim() && createItem(newItem.trim())}
          disabled={isCreating || !newItem.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-2 rounded-md bg-card hover:bg-accent/50 group"
          >
            {editingId === item.id ? (
              <>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && editValue.trim()) {
                      updateItem({ id: item.id, content: editValue.trim() });
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    editValue.trim() &&
                    updateItem({ id: item.id, content: editValue.trim() })
                  }
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
                  className="opacity

-0 group-hover:opacity-100"
                  onClick={() => {
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
              onClick={() => deleteItem(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
