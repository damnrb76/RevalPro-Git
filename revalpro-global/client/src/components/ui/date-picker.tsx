import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Month names for the direct selector
const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  id?: string;
  className?: string;
}

export function DatePicker({ date, setDate, id, className }: DatePickerProps) {
  // Get current year for range calculation
  const currentYear = new Date().getFullYear();
  
  // Generate array of years (10 years back, 10 years forward)
  const years = React.useMemo(() => {
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }, [currentYear]);

  // Local state for direct year/month selection
  const [selectedYear, setSelectedYear] = React.useState<number>(
    date ? date.getFullYear() : currentYear
  );
  const [selectedMonth, setSelectedMonth] = React.useState<number>(
    date ? date.getMonth() : new Date().getMonth()
  );

  // Handle direct date creation from selectors  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    
    if (date) {
      const newDate = new Date(date);
      newDate.setFullYear(year);
      setDate(newDate);
    } else {
      const newDate = new Date();
      newDate.setFullYear(year);
      newDate.setMonth(selectedMonth);
      setDate(newDate);
    }
  };
  
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    
    if (date) {
      const newDate = new Date(date);
      newDate.setMonth(month);
      setDate(newDate);
    } else {
      const newDate = new Date();
      newDate.setFullYear(selectedYear);
      newDate.setMonth(month);
      setDate(newDate);
    }
  };

  return (
    <div className="space-y-2">
      {/* Direct year/month selection above the date picker */}
      <div className="flex items-center space-x-2">
        <select
          value={date ? date.getMonth() : selectedMonth}
          onChange={handleMonthChange}
          className="flex-1 h-10 px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground"
          aria-label="Select month"
        >
          {MONTHS.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
        
        <select
          value={date ? date.getFullYear() : selectedYear}
          onChange={handleYearChange}
          className="flex-1 h-10 px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground"
          aria-label="Select year"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      
      {/* Original date picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a specific day</span>}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            month={date || new Date(selectedYear, selectedMonth)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}