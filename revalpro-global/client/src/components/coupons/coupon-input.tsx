import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2, AlertCircle, Tag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ValidCoupon {
  code: string;
  description: string;
  planId: string;
  period: string;
  isPromotional?: boolean;
  promotionalPrice?: number; // in pence
  promotionalDuration?: number; // in months
  regularPrice?: number; // in pence
}

interface CouponInputProps {
  onValidCoupon?: (coupon: ValidCoupon) => void;
  onRedeemSuccess?: (coupon: ValidCoupon) => void;
  disabled?: boolean;
  className?: string;
  autoRedeem?: boolean; // If true, automatically redeem when valid coupon is found
  showRedeemButton?: boolean; // If false, only validates but doesn't show redeem option
}

export default function CouponInput({
  onValidCoupon,
  onRedeemSuccess,
  disabled = false,
  className = "",
  autoRedeem = false,
  showRedeemButton = true
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [validCoupon, setValidCoupon] = useState<ValidCoupon | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    setError(null);
    setValidCoupon(null);

    try {
      const response = await apiRequest("POST", "/api/coupons/validate", {
        couponCode: couponCode.trim()
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setValidCoupon(data.coupon);
        onValidCoupon?.(data.coupon);
        
        // Auto-redeem if configured
        if (autoRedeem) {
          await redeemCoupon();
        }
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

  const redeemCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsRedeeming(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiRequest("POST", "/api/coupons/redeem", {
        couponCode: couponCode.trim()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(data.message);
        setValidCoupon(null);
        setCouponCode("");
        onRedeemSuccess?.(data.coupon);
      } else {
        setError(data.error || "Failed to redeem coupon");
      }
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      setError("Failed to redeem coupon code");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isValidating && !isRedeeming) {
      if (validCoupon && showRedeemButton) {
        redeemCoupon();
      } else {
        validateCoupon();
      }
    }
  };

  const handleInputChange = (value: string) => {
    setCouponCode(value.toUpperCase());
    setError(null);
    setSuccess(null);
    setValidCoupon(null);
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
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-blue-600" />
          Enter Coupon Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coupon-code">Coupon Code</Label>
          <div className="flex gap-2">
            <Input
              id="coupon-code"
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled || isValidating || isRedeeming}
              className="uppercase"
              maxLength={50}
            />
            {!validCoupon && (
              <Button
                onClick={validateCoupon}
                disabled={disabled || isValidating || isRedeeming || !couponCode.trim()}
                className="shrink-0"
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Validate"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Valid Coupon Display */}
        {validCoupon && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p className="font-semibold">✓ Valid Coupon: {validCoupon.code}</p>
                <p className="text-sm">{validCoupon.description}</p>
                
                {/* Show promotional pricing details */}
                {validCoupon.isPromotional && validCoupon.promotionalPrice && validCoupon.regularPrice ? (
                  <div className="bg-green-100 p-3 rounded-md border border-green-200">
                    <p className="font-semibold text-green-900 mb-1">🎉 Special Promotional Offer!</p>
                    <div className="text-sm space-y-1">
                      <p>• <strong>First {validCoupon.promotionalDuration} month{(validCoupon.promotionalDuration || 0) > 1 ? 's' : ''}:</strong> £{(validCoupon.promotionalPrice / 100).toFixed(2)}</p>
                      <p>• <strong>Then:</strong> £{(validCoupon.regularPrice / 100).toFixed(2)}/month</p>
                      <p>• <strong>Plan:</strong> {getPlanDisplayName(validCoupon.planId)} features</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">
                    Plan: {getPlanDisplayName(validCoupon.planId)} ({getPeriodDisplayName(validCoupon.period)})
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Redeem Button */}
        {validCoupon && showRedeemButton && (
          <Button
            onClick={redeemCoupon}
            disabled={disabled || isRedeeming}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isRedeeming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Redeeming Coupon...
              </>
            ) : (
              "Redeem Coupon"
            )}
          </Button>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        {!validCoupon && !error && !success && (
          <div className="text-sm text-gray-600">
            <p>Enter a valid coupon code to receive subscription benefits instantly.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}