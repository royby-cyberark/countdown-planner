import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Countdown from "@/components/countdown";
import Agenda from "@/components/agenda";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/95 py-12 px-4">
      <div className="container mx-auto max-w-2xl space-y-8">
        <Card className="border-primary/20 bg-card/95 backdrop-blur">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Event Countdown
            </h1>
            <Countdown />
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/95 backdrop-blur">
          <CardContent className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-center bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
              Agenda
            </h2>
            <Separator className="mb-6 bg-primary/20" />
            <Agenda />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
