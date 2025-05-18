import { useState, useEffect } from 'react';
import { Check, Palette } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Available color palettes
const colorPalettes = [
  { 
    id: 'default', 
    name: 'RevalPro Blue', 
    description: 'The classic RevalPro blue and teal palette',
    colors: ['#4196FF', '#00B894', '#0057A6', '#FFFFFF']
  },
  { 
    id: 'purple', 
    name: 'Lavender Fields', 
    description: 'A calm purple and lavender palette',
    colors: ['#9C54D8', '#B47EE5', '#7E22CE', '#FFFFFF'] 
  },
  { 
    id: 'green', 
    name: 'Forest Green', 
    description: 'A refreshing green palette',
    colors: ['#10B981', '#059669', '#047857', '#FFFFFF'] 
  },
  { 
    id: 'orange', 
    name: 'Warm Orange', 
    description: 'A vibrant and warm palette',
    colors: ['#F97316', '#EA580C', '#C2410C', '#FFFFFF'] 
  },
  { 
    id: 'pink', 
    name: 'Vibrant Pink', 
    description: 'A bold and energetic palette',
    colors: ['#EC4899', '#DB2777', '#BE185D', '#FFFFFF'] 
  }
];

export default function ColorPaletteSelector() {
  const [selectedPalette, setSelectedPalette] = useLocalStorage<string>('revalpro-color-palette', 'default');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Apply the selected color palette by adding CSS variables
  useEffect(() => {
    const palette = colorPalettes.find(p => p.id === selectedPalette);
    if (!palette) return;
    
    // Apply the color variables to the document root
    document.documentElement.style.setProperty('--palette-primary', palette.colors[0]);
    document.documentElement.style.setProperty('--palette-secondary', palette.colors[1]);
    document.documentElement.style.setProperty('--palette-accent', palette.colors[2]);
    
    // Add a data attribute for potential CSS targeting
    document.documentElement.setAttribute('data-color-palette', selectedPalette);
    
  }, [selectedPalette]);

  const handleSelectPalette = (paletteId: string) => {
    setSelectedPalette(paletteId);
    
    // Show toast confirmation
    const palette = colorPalettes.find(p => p.id === paletteId);
    toast({
      title: "Color Palette Updated",
      description: `Now using the ${palette?.name} theme`,
    });
    
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette size={16} />
          <span className="hidden md:inline">Color Theme</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Choose Color Palette</h3>
          <p className="text-xs text-muted-foreground">
            Personalize your RevalPro experience with different color themes
          </p>
          
          <div className="grid gap-2 mt-4">
            {colorPalettes.map((palette) => (
              <button
                key={palette.id}
                className={`
                  flex items-center gap-3 p-2 rounded-md text-left
                  ${selectedPalette === palette.id ? 'bg-muted' : 'hover:bg-muted/50'}
                  transition-colors
                `}
                onClick={() => handleSelectPalette(palette.id)}
              >
                <div className="flex gap-1">
                  {palette.colors.slice(0, 3).map((color, i) => (
                    <div 
                      key={i}
                      className="w-5 h-5 rounded-full" 
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium text-sm">{palette.name}</div>
                  <div className="text-xs text-muted-foreground">{palette.description}</div>
                </div>
                
                {selectedPalette === palette.id && (
                  <Check size={16} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}