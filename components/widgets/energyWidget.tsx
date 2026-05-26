import { Card, CardContent, CardHeader } from "@components/ui/card";

export function EnergyWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="text-xl">Energie & Gas</CardHeader>
      <CardContent className="flex flex-col gap-3"></CardContent>
    </Card>
  );
}
