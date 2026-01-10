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
    name: 'RevalPro Vibrant', 
    description: 'The new vibrant RevalPro heart and arrow palette',
    colors: ['#1FB6E1', '#17918F', '#095D7D', '#FFFFFF']
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
    
    // Apply the color variables to the document root with HSL values
    const convertHexToHSL = (hex: string) => {
      // Remove the # from the beginning
      hex = hex.replace(/^#/, '');
      
      // Parse the RGB values
      let r = parseInt(hex.substring(0, 2), 16) / 255;
      let g = parseInt(hex.substring(2, 4), 16) / 255;
      let b = parseInt(hex.substring(4, 6), 16) / 255;
      
      // Find the min and max values to calculate lightness
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
          default: h = 0;
        }
        
        h /= 6;
      }
      
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    };
    
    // Convert hex colors to HSL values
    const primaryHSL = convertHexToHSL(palette.colors[0]);
    const secondaryHSL = convertHexToHSL(palette.colors[1]);
    const accentHSL = convertHexToHSL(palette.colors[2]);
    
    // Apply HSL values to CSS variables in the format Tailwind expects
    document.documentElement.style.setProperty('--revalpro-blue', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
    document.documentElement.style.setProperty('--revalpro-dark-blue', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
    document.documentElement.style.setProperty('--revalpro-teal', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
    
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