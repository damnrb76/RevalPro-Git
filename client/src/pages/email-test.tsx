import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function EmailTestPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);

  const sendTestEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
    onSuccess: (data) => {
      setResult({ success: true, data });
    },
    onError: (error) => {
      setResult({ success: false, error });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setResult(null);
    sendTestEmailMutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="border-b bg-white rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-slate-800">
            SendGrid Email Diagnostic Tool
          </CardTitle>
          <CardDescription>
            Use this tool to verify your SendGrid configuration and debug email delivery issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Recipient Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Enter an email address you have access to.
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={sendTestEmailMutation.isPending || !email}
            >
              {sendTestEmailMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Test Email...
                </>
              ) : (
                "Send Test Email"
              )}
            </Button>
          </form>

          {result && (
            <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1 overflow-hidden">
                  <h4 className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? 'Email Sent Successfully' : 'Failed to Send Email'}
                  </h4>
                  
                  <div className="mt-2 text-xs font-mono bg-white/50 p-2 rounded overflow-x-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(result.success ? result.data : result.error, null, 2)}
                  </div>
                  
                  {!result.success && result.error?.details && (
                    <div className="mt-4 text-sm text-red-700">
                      <strong>Common Fixes:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {JSON.stringify(result.error).includes("unauthorized") && (
                          <li>Check if your API Key is correct and has "Mail Send" permissions.</li>
                        )}
                        {JSON.stringify(result.error).includes("sender") && (
                          <li>Verify that "noreply@revalpro.co.uk" is a verified sender in SendGrid.</li>
                        )}
                        {JSON.stringify(result.error).includes("credits") && (
                          <li>Check if your SendGrid account has available email credits.</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
