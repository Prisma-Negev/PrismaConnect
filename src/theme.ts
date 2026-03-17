/**
 * Prisma Negev CRM Theme
 * Colors: Navy Blue (#1e3a5f) + Gold (#e8a020)
 */

export const prismaLightTheme = {
  palette: {
    mode: "light" as const,
    primary: {
      main: "#1e3a5f",
      light: "#2d5a8e",
      dark: "#122540",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e8a020",
      light: "#f0b840",
      dark: "#c07810",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e3a5f",
      secondary: "#4a6080",
    },
    success: {
      main: "#2e7d32",
    },
    error: {
      main: "#c62828",
    },
    warning: {
      main: "#e8a020",
    },
    info: {
      main: "#1565c0",
    },
  },
  typography: {
    fontFamily: '"Heebo", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none" as const,
          fontWeight: 600,
          fontFamily: '"Heebo", "Arial", sans-serif',
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #122540 0%, #1e3a5f 100%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 12px rgba(30, 58, 95, 0.08)",
          borderRadius: "12px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Heebo", "Arial", sans-serif',
        },
      },
    },
  },
};

export const prismaDarkTheme = {
  palette: {
    mode: "dark" as const,
    primary: {
      main: "#4a90d9",
      light: "#6aacf0",
      dark: "#2d6aad",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f0b840",
      light: "#f5cd70",
      dark: "#c07810",
      contrastText: "#1a1a2e",
    },
    background: {
      default: "#0f1928",
      paper: "#1a2840",
    },
    text: {
      primary: "#e8edf5",
      secondary: "#8aadcc",
    },
  },
  typography: {
    fontFamily: '"Heebo", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
};
