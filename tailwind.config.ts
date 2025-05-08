import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // RevalPro colors from logo
        revalpro: {
          blue: "hsl(var(--revalpro-blue))",
          "dark-blue": "hsl(var(--revalpro-dark-blue))",
          orange: "hsl(var(--revalpro-orange))",
          green: "hsl(var(--revalpro-green))",
          purple: "hsl(var(--revalpro-purple))",
          pink: "hsl(var(--revalpro-pink))",
          black: "hsl(var(--revalpro-black))",
          white: "hsl(var(--revalpro-white))",
          "light-grey": "hsl(var(--revalpro-light-grey))",
          grey: "hsl(var(--revalpro-grey))",
        },
        // Legacy NHS colors (mapped to RevalPro)
        nhs: {
          blue: "hsl(var(--nhs-blue))",
          "dark-blue": "hsl(var(--nhs-dark-blue))",
          "bright-blue": "hsl(var(--nhs-bright-blue))",
          "light-blue": "hsl(var(--nhs-light-blue))",
          green: "hsl(var(--nhs-green))",
          "light-green": "hsl(var(--nhs-light-green))",
          yellow: "hsl(var(--nhs-yellow))",
          "warm-yellow": "hsl(var(--nhs-warm-yellow))",
          red: "hsl(var(--nhs-red))",
          black: "hsl(var(--nhs-black))",
          "dark-grey": "hsl(var(--nhs-dark-grey))",
          "mid-grey": "hsl(var(--nhs-mid-grey))",
          "pale-grey": "hsl(var(--nhs-pale-grey))",
          "light-grey": "hsl(var(--nhs-light-grey))",
          white: "hsl(var(--nhs-white))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
