import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2, AlertCircle, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ValidCoupon {
  code: string;
  description: string;
  planId: string;
  period: string;
}

interface InlineCouponInputProps {
  onValidCoupon?: (coupon: ValidCoupon) => void;
  onRemoveCoupon?: () => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  label?: string;
  showLabel?: boolean;
}

export default function InlineCouponInput({
  onValidCoupon,
  onRemoveCoupon,
  disabled = false,
  className = "",
  placeholder = "Enter coupon code",
  label = "Coupon Code (Optional)",
  showLabel = true
}: InlineCouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [validCoupon, setValidCoupon] = useState<ValidCoupon | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/coupons/validate", {
        couponCode: couponCode.trim()
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setValidCoupon(data.coupon);
        onValidCoupon?.(data.coupon);
      } else {
        setError(data.error || "Invalid coupon code");
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setError("Failed to validate coupon code");
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isValidating && !validCoupon) {
      validateCoupon();
    }
  };

  const handleInputChange = (value: string) => {
    setCouponCode(value.toUpperCase());
    setError(null);
    if (validCoupon) {
      setValidCoupon(null);
      onRemoveCoupon?.();
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setValidCoupon(null);
    setError(null);
    onRemoveCoupon?.();
  };

  const getPlanDisplayName = (planId: string) => {
    const planNames: Record<string, string> = {
      standard: "Standard",
      premium: "Premium",
    };
    return planNames[planId] || planId;
  };

  const getPeriodDisplayName = (period: string) => {
    return period === "annual" ? "Annual" : "Monthly";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabel && (
        <Label htmlFor="inline-coupon-code">{label}</Label>
      )}
      
      <div className="space-y-2">
        {/* Input Row */}
        <div className="flex gap-2">
          <Input
            id="inline-coupon-code"
            type="text"
            placeholder={placeholder}
            value={couponCode}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled || isValidating}
            className="uppercase flex-1"
            maxLength={50}
          />
          {!validCoupon ? (
            <Button
              onClick={validateCoupon}
              disabled={disabled || isValidating || !couponCode.trim()}
              variant="outline"
              size="default"
              className="shrink-0"
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          ) : (
            <Button
              onClick={removeCoupon}
              variant="outline"
              size="default"
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Valid Coupon Display */}
        {validCoupon && (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-green-800">
                  {validCoupon.code} Applied
                </p>
                <p className="text-xs text-green-700 truncate">
                  {getPlanDisplayName(validCoupon.planId)} ({getPeriodDisplayName(validCoupon.period)})
                </p>
              </div>
            </div>
            <Button
              onClick={removeCoupon}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}