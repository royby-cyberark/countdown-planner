import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Countdown from "@/components/countdown";
import ItemsList from "@/components/items-list";
import Agenda from "@/components/agenda";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Event Countdown
            </h1>
            <Countdown />
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Items</h2>
              <Separator className="mb-4" />
              <ItemsList />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Agenda</h2>
              <Separator className="mb-4" />
              <Agenda />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
