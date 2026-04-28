import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: "#ff7f66",
        peach: "#ffe9e3",
        mint: "#4fc5a2",
        ink: "#202534"
      }
    }
  },
  plugins: []
} satisfies Config;
