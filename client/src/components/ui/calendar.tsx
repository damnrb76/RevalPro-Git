import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Month names
const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// Custom navigation component with next/prev controls
function MonthYearNavigation({
  className,
  currentMonth,
  goToMonth
}: {
  className?: string;
  currentMonth: Date;
  goToMonth: (date: Date) => void;
}) {
  // Get current year for range calculation
  const currentYear = new Date().getFullYear();
  
  // Generate array of years (10 years back, 10 years forward)
  const years = React.useMemo(() => {
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }, [currentYear]);
  
  // Handle month select change
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(parseInt(event.target.value));
    goToMonth(newMonth);
  };
  
  // Handle year select change
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = new Date(currentMonth);
    newYear.setFullYear(parseInt(event.target.value));
    goToMonth(newYear);
  };
  
  return (
    <div className={cn("flex justify-center items-center space-x-2 p-1 rounded-lg", className)}>
      {/* Month dropdown */}
      <select
        value={currentMonth.getMonth()}
        onChange={handleMonthChange}
        className="px-2 py-1 bg-background border border-input rounded-md text-sm font-medium h-9 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Select month"
      >
        {MONTHS.map((month, index) => (
          <option key={month} value={index}>
            {month}
          </option>
        ))}
      </select>
      
      {/* Year dropdown */}
      <select
        value={currentMonth.getFullYear()}
        onChange={handleYearChange}
        className="px-2 py-1 bg-background border border-input rounded-md text-sm font-medium h-9 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Select year"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  // Add state to keep track of current month
  const [month, setMonth] = React.useState<Date>(props.defaultMonth || new Date());

  return (
    <div className="space-y-4">
      {/* Add custom month/year selection at the top */}
      <MonthYearNavigation 
        currentMonth={month} 
        goToMonth={setMonth} 
      />
      
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "hidden", // Hide the default caption since we have our custom navigation
          nav: "hidden", // Hide the default navigation
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }