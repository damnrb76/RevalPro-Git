import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-revalpro-grey/20">
      <Card className="w-full max-w-md mx-4 border-revalpro-blue">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-revalpro-pink" />
            <h1 className="text-2xl font-bold text-revalpro-dark-blue">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-revalpro-black">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
