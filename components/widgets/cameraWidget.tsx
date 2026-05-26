import { Card, CardContent, CardHeader } from "@components/ui/card";

export function CameraWidget() {
  return (
    <Card className="h-full">
      <CardHeader className="text-xl">Camera</CardHeader>
      <CardContent className="flex flex-col gap-3"></CardContent>
    </Card>
  );
}
