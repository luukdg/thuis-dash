import { Card, CardContent, CardHeader } from "@components/ui/card";

export function TodoWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="text-xl">To-do</CardHeader>
      <CardContent className="flex flex-col gap-3"></CardContent>
    </Card>
  );
}
