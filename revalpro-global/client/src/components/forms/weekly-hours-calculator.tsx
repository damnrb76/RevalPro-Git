import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Plus, Minus, Edit2, Save, X } from "lucide-react";
import { format, startOfWeek, addWeeks, differenceInWeeks, isWithinInterval } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface WeeklyEntry {
  weekStart: Date;
  weekEnd: Date;
  scheduledHours: number;
  actualHours: number;
  adjustments: { date: string; hours: number; reason: string }[];
  isEditing: boolean;
  isCompleted: boolean;
  completedHours: number; // Hours to count toward total (only if completed)
}

interface WeeklyHoursCalculatorProps {
  startDate: Date;
  endDate: Date;
  onHoursCalculated: (totalHours: number, weeklyBreakdown: WeeklyEntry[]) => void;
  initialWeeklyHours?: number;
  existingData?: WeeklyEntry[];
}

export default function WeeklyHoursCalculator({
  startDate,
  endDate,
  onHoursCalculated,
  initialWeeklyHours = 37.5,
  existingData = []
}: WeeklyHoursCalculatorProps) {
  const [weeklyHours, setWeeklyHours] = useState(initialWeeklyHours);
  const [isEditingWeeklyHours, setIsEditingWeeklyHours] = useState(false);
  const [weeklyEntries, setWeeklyEntries] = useState<WeeklyEntry[]>([]);

  // Calculate weeks between dates
  const calculateWeeks = () => {
    const weeks: WeeklyEntry[] = [];
    const totalWeeks = differenceInWeeks(endDate, startDate) + 1;
    const today = new Date();
    
    for (let i = 0; i < totalWeeks; i++) {
      const weekStart = addWeeks(startOfWeek(startDate, { weekStartsOn: 1 }), i);
      const weekEnd = addWeeks(weekStart, 1);
      
      // Check if this week overlaps with our date range
      const actualWeekStart = weekStart < startDate ? startDate : weekStart;
      const actualWeekEnd = weekEnd > endDate ? endDate : weekEnd;
      
      if (actualWeekStart <= actualWeekEnd) {
        const daysInWeek = Math.ceil((actualWeekEnd.getTime() - actualWeekStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const proportionalHours = (weeklyHours / 7) * Math.min(daysInWeek, 7);
        
        // Week is completed if the week end date is in the past
        const isCompleted = actualWeekEnd < today;
        const scheduledHours = Math.round(proportionalHours * 10) / 10;
        
        weeks.push({
          weekStart: actualWeekStart,
          weekEnd: actualWeekEnd,
          scheduledHours,
          actualHours: scheduledHours,
          adjustments: [],
          isEditing: false,
          isCompleted,
          completedHours: isCompleted ? scheduledHours : 0
        });
      }
    }
    
    return weeks;
  };

  // Initialize or recalculate weeks when dates or weekly hours change
  useEffect(() => {
    if (existingData.length > 0) {
      setWeeklyEntries(existingData);
    } else {
      const calculatedWeeks = calculateWeeks();
      setWeeklyEntries(calculatedWeeks);
    }
  }, [startDate, endDate, weeklyHours, existingData]);

  // Calculate total hours from completed weeks only
  useEffect(() => {
    const totalHours = weeklyEntries.reduce((sum, entry) => sum + entry.completedHours, 0);
    onHoursCalculated(Math.round(totalHours * 10) / 10, weeklyEntries);
  }, [weeklyEntries, onHoursCalculated]);

  const updateWeeklyHours = (newHours: number) => {
    setWeeklyHours(newHours);
    setIsEditingWeeklyHours(false);
    
    // Recalculate all weeks with new weekly hours
    const updatedEntries = weeklyEntries.map(entry => {
      const daysInWeek = Math.ceil((entry.weekEnd.getTime() - entry.weekStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const proportionalHours = (newHours / 7) * Math.min(daysInWeek, 7);
      const baseHours = Math.round(proportionalHours * 10) / 10;
      
      // Apply existing adjustments
      const adjustmentTotal = entry.adjustments.reduce((sum, adj) => sum + adj.hours, 0);
      const actualHours = Math.round((baseHours + adjustmentTotal) * 10) / 10;
      
      return {
        ...entry,
        scheduledHours: baseHours,
        actualHours,
        completedHours: entry.isCompleted ? actualHours : 0
      };
    });
    
    setWeeklyEntries(updatedEntries);
  };

  const addAdjustment = (weekIndex: number, hours: number, reason: string) => {
    const updatedEntries = [...weeklyEntries];
    updatedEntries[weekIndex].adjustments.push({
      date: new Date().toISOString().split('T')[0],
      hours,
      reason
    });
    const actualHours = Math.round(
      (updatedEntries[weekIndex].scheduledHours + 
       updatedEntries[weekIndex].adjustments.reduce((sum, adj) => sum + adj.hours, 0)) * 10
    ) / 10;
    updatedEntries[weekIndex].actualHours = actualHours;
    updatedEntries[weekIndex].completedHours = updatedEntries[weekIndex].isCompleted ? actualHours : 0;
    setWeeklyEntries(updatedEntries);
  };

  const removeAdjustment = (weekIndex: number, adjustmentIndex: number) => {
    const updatedEntries = [...weeklyEntries];
    updatedEntries[weekIndex].adjustments.splice(adjustmentIndex, 1);
    const actualHours = Math.round(
      (updatedEntries[weekIndex].scheduledHours + 
       updatedEntries[weekIndex].adjustments.reduce((sum, adj) => sum + adj.hours, 0)) * 10
    ) / 10;
    updatedEntries[weekIndex].actualHours = actualHours;
    updatedEntries[weekIndex].completedHours = updatedEntries[weekIndex].isCompleted ? actualHours : 0;
    setWeeklyEntries(updatedEntries);
  };

  const setWeekEditing = (weekIndex: number, editing: boolean) => {
    const updatedEntries = [...weeklyEntries];
    updatedEntries[weekIndex].isEditing = editing;
    setWeeklyEntries(updatedEntries);
  };

  const totalHours = weeklyEntries.reduce((sum, entry) => sum + entry.completedHours, 0);
  const pendingHours = weeklyEntries.reduce((sum, entry) => sum + (entry.isCompleted ? 0 : entry.actualHours), 0);

  return (
    <div className="space-y-4">
      {/* Weekly Hours Setting */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Hours Configuration
          </CardTitle>
          <CardDescription>
            Set your contracted weekly hours to automatically calculate practice time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="weekly-hours">Current Contract Hours:</Label>
                {isEditingWeeklyHours ? (
                  <div className="flex items-center gap-2">
                    <Input
                      id="weekly-hours"
                      type="number"
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(Number(e.target.value))}
                      className="w-20"
                      step="0.5"
                      min="0"
                      max="70"
                    />
                    <Button size="sm" onClick={() => updateWeeklyHours(weeklyHours)}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingWeeklyHours(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {weeklyHours} hours/week
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingWeeklyHours(true)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-medium text-blue-900 mb-1">
                Contract Hours Changed Mid-Period?
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>Click the edit button above to update your weekly hours. The system will automatically recalculate all weeks while preserving any adjustments you've made for holidays, sick days, or extra shifts.</div>
                <div className="font-medium">Example:</div>
                <div>• Started with 37.5 hours/week, reduced to 30 hours/week from week 8</div>
                <div>• Update your weekly hours to 30 - all remaining weeks recalculate automatically</div>
                <div>• Your individual week adjustments (holidays, sick days) remain intact</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Breakdown
          </CardTitle>
          <CardDescription>
            Calculated hours for each week with adjustment options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyEntries.map((entry, index) => (
            <WeekEntry
              key={index}
              entry={entry}
              weekIndex={index}
              onAddAdjustment={addAdjustment}
              onRemoveAdjustment={removeAdjustment}
              onSetEditing={setWeekEditing}
            />
          ))}
          
          <Separator />
          
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Completed Practice Hours:</span>
              <Badge variant="default" className="text-lg px-3 py-1">
                {totalHours} hours
              </Badge>
            </div>
            
            {pendingHours > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending (incomplete weeks):</span>
                <Badge variant="secondary" className="text-sm px-2 py-1">
                  {pendingHours} hours
                </Badge>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground mt-2">
              * Only completed weeks count toward your total practice hours
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Individual week entry component
function WeekEntry({
  entry,
  weekIndex,
  onAddAdjustment,
  onRemoveAdjustment,
  onSetEditing
}: {
  entry: WeeklyEntry;
  weekIndex: number;
  onAddAdjustment: (weekIndex: number, hours: number, reason: string) => void;
  onRemoveAdjustment: (weekIndex: number, adjustmentIndex: number) => void;
  onSetEditing: (weekIndex: number, editing: boolean) => void;
}) {
  const [adjustmentHours, setAdjustmentHours] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");

  const handleAddAdjustment = () => {
    if (adjustmentHours !== 0 && adjustmentReason.trim()) {
      onAddAdjustment(weekIndex, adjustmentHours, adjustmentReason);
      setAdjustmentHours(0);
      setAdjustmentReason("");
      onSetEditing(weekIndex, false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">
              Week {weekIndex + 1}: {format(entry.weekStart, 'MMM d')} - {format(entry.weekEnd, 'MMM d, yyyy')}
            </h4>
            {entry.isCompleted ? (
              <Badge variant="default" className="text-xs">
                Completed
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Pending
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Scheduled: {entry.scheduledHours}h → Actual: {entry.actualHours}h
            {entry.isCompleted ? ` → Counted: ${entry.completedHours}h` : " → Not counted yet"}
          </div>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSetEditing(weekIndex, !entry.isEditing)}
        >
          {entry.isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Existing adjustments */}
      {entry.adjustments.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">Adjustments:</Label>
          {entry.adjustments.map((adjustment, adjIndex) => (
            <div key={adjIndex} className="flex items-center justify-between bg-muted/50 rounded px-3 py-2">
              <span className="text-sm">
                {adjustment.hours > 0 ? '+' : ''}{adjustment.hours}h - {adjustment.reason}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveAdjustment(weekIndex, adjIndex)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add adjustment form */}
      {entry.isEditing && (
        <div className="border-t pt-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor={`hours-${weekIndex}`} className="text-sm">Hours</Label>
              <Input
                id={`hours-${weekIndex}`}
                type="number"
                value={adjustmentHours}
                onChange={(e) => setAdjustmentHours(Number(e.target.value))}
                placeholder="±0"
                step="0.5"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor={`reason-${weekIndex}`} className="text-sm">Reason</Label>
              <Input
                id={`reason-${weekIndex}`}
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="e.g., Sick leave, Holiday, Extra shift"
              />
            </div>
          </div>
          <Button size="sm" onClick={handleAddAdjustment} disabled={!adjustmentReason.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Add Adjustment
          </Button>
        </div>
      )}
    </div>
  );
}