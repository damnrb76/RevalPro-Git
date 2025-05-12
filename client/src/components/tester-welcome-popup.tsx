import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

// Import the logo
import logo from "@assets/Leonardo_Phoenix_10_design_a_vibrant_and_professional_logo_for_3.jpg";

export default function TesterWelcomePopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [, navigate] = useLocation();

  const handleOpenFeedbackForm = () => {
    setIsOpen(false);
    navigate("/tester-feedback");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex justify-center mb-4">
                <img 
                  src={logo} 
                  alt="RevalPro Logo" 
                  className="h-16 object-contain" 
                />
              </div>
              
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2 text-revalpro-blue">
                  <MessageCircle className="h-5 w-5 text-amber-500" />
                  Welcome to RevalPro Tester Program
                </DialogTitle>
                <DialogDescription className="text-base pt-2">
                  Thank you for helping test the RevalPro nursing revalidation application!
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                  <h3 className="font-medium mb-2">How the Tester Feedback System Works:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Use the <strong>"Tester Feedback"</strong> menu option to submit your thoughts</li>
                    <li>You can provide general feedback, report bugs, or suggest features</li>
                    <li>Add screenshots or details to help us understand your experience</li>
                    <li>All feedback is private and only visible to administrators</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-600">
                  Your insights are invaluable in helping us create the best possible tool for UK nurses.
                  Damon and Dan sincerely appreciate your time and expertise in this testing phase.
                </p>
              </div>

              <DialogFooter className="flex gap-2 sm:gap-0">
                <Button
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Later
                </Button>
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  onClick={handleOpenFeedbackForm}
                >
                  Open Feedback Form
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}