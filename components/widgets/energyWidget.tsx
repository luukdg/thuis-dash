import { Card, CardContent, CardHeader } from "@components/ui/card";
import { glassCard } from "@/lib/constants/glassCard";

export function EnergyWidget() {
  return (
    <Card className={`h-full ${glassCard}`}>
      <CardHeader className="text-xl">Energie & Gas</CardHeader>
      <CardContent className="flex flex-col gap-3"></CardContent>
    </Card>
  );
}
