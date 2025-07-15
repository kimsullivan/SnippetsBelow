import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // INSTRUMENTL BRAND COLORS
        
        // Primary Colors
        persimmon: {
          DEFAULT: "#FF6F61",
          50: "#FFF8F7",
          100: "#FFEBE5",
          200: "#FFDDD4",
          300: "#FFD9D4",
          400: "#FF6F61",
          500: "#FF4A38",
          600: "#FF339E",
          700: "#F62B00",
          800: "#CA2300",
          900: "#9E1B00",
        },
        
        eggplant: {
          DEFAULT: "#64447C",
          100: "#8B655A",
          200: "#745091",
          300: "#64447C",
          400: "#523866",
          500: "#412A53",
          600: "#2F1C3E",
          700: "#1E1129",
          800: "#0C0614",
          900: "#000000",
        },

        // Accent Colors - Brights
        tomato: {
          DEFAULT: "#D55447",
          lighter: "#tomato",
        },
        jazzy: {
          DEFAULT: "#6F339E",
          50: "#E7CD5",
          100: "#AE7CD5",
          200: "#8C46C3",
          300: "#AE7CD5",
          400: "#8C46C3",
          500: "#6F339E",
          600: "#572B7B",
          700: "#3C1C55",
          800: "#200E30",
          900: "#05000A",
        },
        bubblegum: {
          DEFAULT: "#F9A1EB",
          50: "#FDD8F7",
          100: "#FBBCF1",
          200: "#F9A1EB",
          300: "#F787E5",
          400: "#F66FE0",
          500: "#F458DA",
          600: "#F242D4",
          700: "#EF2CCE",
          800: "#ED17C8",
          900: "#EB02C2",
        },
        golden: {
          DEFAULT: "#FDC05A",
          50: "#FEF6E7",
          100: "#FEECBD",
          200: "#FED38B",
          300: "#FDC05A",
          400: "#FCAD28",
          500: "#FB9A00",
          600: "#C87700",
          700: "#965400",
          800: "#643100",
          900: "#320F00",
        },

        // Neutral Colors
        blackish: {
          DEFAULT: "#44433D",
        },
        whitish: {
          DEFAULT: "#F6F6F5",
        },
        silver: {
          DEFAULT: "#C5D1D4",
          50: "#F8FBFD",
          100: "#F2F5F7",
          150: "#E4EAEC",
          200: "#DBE3E6",
          300: "#C5D1D4",
          350: "#A8AFB1",
          400: "#8C9699",
          500: "#455C63",
        },

        // Twilight Color System
        twilight: {
          DEFAULT: "#5A56B3",
          50: "#F1F1F9",
          100: "#F1F1F9",
          150: "#E0D6F5",
          200: "#DDDDF8",
          250: "#C0C0F2",
          300: "#5A56B3",
          350: "#3D3A82",
          400: "#090830",
          500: "#5A56B3",
          600: "#572B7B",
          700: "#3C1C55",
          800: "#200E30",
          900: "#05000A",
        },

        // Text Colors
        sblack: {
          DEFAULT: "#333333",
        },
        ssmoke: {
          300: "#747171",
        },

        // Alert Colors
        danger: {
          text: "#B80000", // Text on red background
          bg: "#CC0000",   // Red background
        },
        warning: {
          text: "#B85C00", // Text on orange background  
          bg: "#FF8C00",   // Orange background
        },
        attention: {
          light: {
            text: "#8B4500", // Text for large text/icons
            bg: "#FFD700",   // Background
          },
          regular: {
            text: "#8B4500", // Text for regular text
            bg: "#FFA500",   // Background
          }
        },
        info: {
          text: "#005C8B", // Text on blue background
          bg: "#0080CC",   // Blue background
        },
        promotional: {
          text: "#4B0080", // Text on purple background
          bg: "#6A0DAD",   // Purple background
        },
        success: {
          text: "#006B3C", // Text on green background
          bg: "#00A86B",   // Green background
        },

        // Status Colors
        status: {
          researching: "#FFE38F",
          planned: "#ACEAFC", 
          loiInProgress: "#FED7F5",
          applicationInProgress: "#F3D9FC",
          loiSubmitted: "#E1D8FD",
          applicationSubmitted: "#D3D9F8",
          awarded: "#C4F4B8",
          closed: "#FED2B9",
          declined: "#FFC2C2",
          abandoned: "#C3D1D5",
        },

        // Spectrum Colors for Statuses
        vanilla: {
          50: "#FFF8E1",
          100: "#FFEDB6",
          200: "#FFE38F",
          300: "#DD7101",
          400: "#3E5806",
        },
        azure: {
          50: "#EAFAFF",
          100: "#CBFAFD",
          200: "#ABEAFC",
          250: "#00B2E8",
          300: "#0099C7",
          400: "#00799E",
        },
        raspberry: {
          100: "#ABEAFC",
          200: "#FED7F5",
          300: "#BB0695",
          400: "#BB0695",
        },
        grape: {
          100: "#F7E7FD",
          200: "#F3D9FC",
          300: "#9F11D5",
          400: "#9F11D5",
        },
        electric: {
          100: "#ECE6FE",
          200: "#E1D8FD",
          300: "#6331F7",
          400: "#6331F7",
        },
        jeans: {
          100: "#E9ECFC",
          200: "#D3D9F8",
          300: "#2E4DE0",
          400: "#2E4DE0",
        },
        grass: {
          100: "#DAF8D3",
          200: "#C4F4B8",
          300: "#236E11",
          400: "#236E11",
        },
        rust: {
          100: "#FEE2D2",
          200: "#FED2B9",
          300: "#A63D03",
          400: "#A63D03",
        },
        brick: {
          100: "#FFF1F0",
          200: "#FFD6D6",
          300: "#FFC2C2",
          400: "#B80000",
        },

        // Skin Tones
        blush: {
          100: "#FCDCD2",
          200: "#F9C6A9",
          300: "#F8B691",
        },
        peach: {
          100: "#F9DCB1",
          200: "#FED1A5",
          300: "#F7BF87",
        },
        bronze: {
          100: "#DBB189",
          200: "#D09A71",
          300: "#C0773F",
        },
        umber: {
          100: "#A65E35",
          200: "#864C2B",
          300: "#563117",
        },

        // Product UI Colors
        lilac: {
          50: "#F6F3FC",
          100: "#F3EFFB", 
          150: "#E0D6F5",
          200: "#D1C2F0",
          300: "#5D5AB5",
        },
        jade: {
          100: "#3ACCA",
          200: "#2BA86F",
        },

        // Labels
        recipient: "#CFE0F4",
        funder: "#E0EDD6", 
        pastDue: "#E39292",
        partialMatch: "#FBF1BD",
        exactMatch: "#D4F7CC",
        savedIcon: "#D0E4D5",

        // Data Visualization
        magenta: {
          400: "#A745BF",
          300: "#C586D5", 
          200: "#D7ABE2",
          100: "#E6CAED",
        },
        insights: {
          steal: "#3A8FA1",
          splum: "#B35FC8",
          sblueberry: "#347FEE",
        },

        // Greys
        smoke: {
          50: "#F6F6F5",
          100: "#E5E5E5",
          200: "#8C9699",
          250: "#888888",
          300: "#747171",
          350: "#666666",
          400: "#4D4D4D",
        },

        // UI Misc Colors
        'slight-grayish-cyan': "#F0F8FF",
        'slight-lilac': "#F8F6FF", 
        'spinkish-grey': "#F5F5F5",
        'spure-blue': "#0066CC", // default browser checkbox blue
        'slight-grayish-blue': "#F0F4FF",

        // Background Options
        backgrounds: {
          light: {
            silver100: "#silver-100",
            whitish: "#whitish",
            jazzy100: "#jazzy-100", 
            twilight200: "#twilight-200",
            twilight100: "#twilight-100",
          },
          dark: {
            blackish: "#blackish",
            eggplant400: "#eggplant-400",
            eggplant300: "#eggplant-300", 
            twilight300: "#twilight-300",
            twilight300_alt: "#twilight-300",
          }
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
