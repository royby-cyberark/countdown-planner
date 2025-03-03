import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus, X, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import VideoPlayer from "./video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Agenda } from "@shared/schema";

const DEFAULT_AGENDA_ITEMS: Agenda[] = [
  { id: 1, content: "10:00-10:20: Welcome and Introduction", order: 0, highlighted: true },
  { id: 2, content: "10:20-11:10: Project Timeline Review", order: 1, highlighted: false },
  { id: 3, content: "11:10-12:00: Technical Requirements Discussion", order: 2, highlighted: false },
  { id: 4, content: "12:00-13:30: Lunch Break", order: 3, highlighted: false },
  { id: 5, content: "13:30-14:20: Next Steps and Action Items", order: 4, highlighted: false },
];

type AgendaProps = {
  onHeaderChange: (header: string) => React.ReactNode;
};

export default function AgendaComponent({ onHeaderChange }: AgendaProps) {
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [localAgenda, setLocalAgenda] = useState(DEFAULT_AGENDA_ITEMS);
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("agenda");

  const { mutate: createAgenda, isPending: isCreating } = useMutation({
    mutationFn: async (content: string) => {
      const newItem = {
        id: localAgenda.length + 1,
        content,
        order: localAgenda.length,
        highlighted: false,
      };
      setLocalAgenda(prev => [...prev, newItem]);
      return newItem;
    },
    onSuccess: () => {
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
      setLocalAgenda(prev => {
        const newAgenda = [...prev];
        if (data.highlighted) {
          // Unset all other highlighted items
          newAgenda.forEach(item => {
            if (item.id !== id) item.highlighted = false;
          });
        }
        const itemIndex = newAgenda.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
          newAgenda[itemIndex] = { ...newAgenda[itemIndex], ...data };
        }
        return newAgenda;
      });
      return { id, ...data };
    },
    onSuccess: () => {
      setEditingId(null);
      toast({
        description: "Agenda item updated successfully",
      });
    },
  });

  const { mutate: deleteAgenda } = useMutation({
    mutationFn: async (id: number) => {
      setLocalAgenda(prev => prev.filter(item => item.id !== id));
      return id;
    },
    onSuccess: () => {
      toast({
        description: "Agenda item deleted successfully",
      });
    },
  });

  const getItemClasses = (item: Agenda) =>
    cn(
      "flex items-center gap-1 py-1.5 px-2 rounded-md transition-all duration-200 cursor-pointer group",
      "border border-transparent hover:border-primary/30",
      {
        "bg-primary/20 hover:bg-primary/30 shadow-sm shadow-primary/10":
          item.highlighted,
        "bg-card/60 hover:bg-accent/30 backdrop-blur": !item.highlighted,
      },
    );

  const buttonClasses =
    "opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6";

  return (
    <Tabs 
      defaultValue="agenda" 
      className="w-full"
      onValueChange={(value) => {
        setCurrentTab(value);
        onHeaderChange(value === "agenda" ? "Agenda" : "Video Player");
      }}
    >
      {onHeaderChange(currentTab === "agenda" ? "Agenda" : "Video Player")}
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="agenda">Agenda</TabsTrigger>
        <TabsTrigger value="video">Video Player</TabsTrigger>
      </TabsList>
      
      <TabsContent value="agenda" className="space-y-3">
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
            className="backdrop-blur bg-card/60 h-8"
          />
          <Button
            size="icon"
            onClick={() => newItem.trim() && createAgenda(newItem.trim())}
            disabled={isCreating || !newItem.trim()}
            className="bg-primary/80 hover:bg-primary shadow-sm shadow-primary/20 h-8 w-8"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-1">
          {localAgenda.map((item) => (
            <div
              key={item.id}
              className={getItemClasses(item)}
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
                    className="flex-1 bg-background/50 h-6 text-sm"
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
                    className={buttonClasses}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm">{item.content}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={buttonClasses}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(item.id);
                      setEditValue(item.content);
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </>
              )}
              <Button
                size="icon"
                variant="ghost"
                className={`${buttonClasses} hover:text-destructive`}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAgenda(item.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="video">
        <VideoPlayer />
      </TabsContent>
    </Tabs>
  );
}
