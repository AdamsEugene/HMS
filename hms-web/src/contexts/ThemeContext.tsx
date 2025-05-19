import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

// Define theme interface with comprehensive color properties
export interface Theme {
  name: string;
  color: string; // Primary brand color
  bgClass?: string; // CSS class for background
  isDark?: boolean; // Is this a dark theme
  isAccessible?: boolean; // Is this an accessible theme

  // Basic color palette
  primaryColor: string; // Primary brand color
  secondaryColor: string; // Secondary brand color
  accentColor: string; // Accent color for highlights

  // UI Component colors - Light mode
  light: {
    // Background colors
    background: {
      primary: string; // Main background
      secondary: string; // Secondary/alternative background
      tertiary: string; // Tertiary background (e.g., for hover states)
    };

    // Text colors
    text: {
      primary: string; // Primary text
      secondary: string; // Secondary text
      muted: string; // Muted/subtle text
      inverse: string; // Inverse text (for dark backgrounds)
    };

    // Header colors
    header: {
      background: string; // Header background
      text: string; // Header text
      border: string; // Header border
      icon: string; // Header icons
    };

    // Sidebar colors
    sidebar: {
      background: string; // Sidebar background
      text: string; // Sidebar text
      activeBackground: string; // Active item background
      activeText: string; // Active item text
      hoverBackground: string; // Hover background
      border: string; // Sidebar border
      icon: string; // Sidebar icons
    };

    // Card colors
    card: {
      background: string; // Card background
      border: string; // Card border
      shadow: string; // Card shadow
      headerBackground: string; // Card header background
      headerText: string; // Card header text
    };

    // Button colors
    button: {
      primary: {
        background: string; // Primary button background
        text: string; // Primary button text
        hover: string; // Primary button hover
        active: string; // Primary button active
        border: string; // Primary button border
      };
      secondary: {
        background: string; // Secondary button background
        text: string; // Secondary button text
        hover: string; // Secondary button hover
        active: string; // Secondary button active
        border: string; // Secondary button border
      };
      danger: {
        background: string; // Danger button background
        text: string; // Danger button text
        hover: string; // Danger button hover
        active: string; // Danger button active
        border: string; // Danger button border
      };
    };

    // Form colors
    form: {
      inputBackground: string; // Input background
      inputBorder: string; // Input border
      inputText: string; // Input text
      inputPlaceholder: string; // Input placeholder
      inputFocus: string; // Input focus border/ring
      label: string; // Form label
      error: string; // Error message/indicator
    };

    // Border colors
    border: {
      light: string; // Light border
      medium: string; // Medium border
      heavy: string; // Heavy/prominent border
      divider: string; // Dividers
    };

    // Status colors
    status: {
      success: string; // Success indicator
      error: string; // Error indicator
      warning: string; // Warning indicator
      info: string; // Info indicator
    };

    // Icon colors
    icon: {
      primary: string; // Primary icons
      secondary: string; // Secondary icons
      muted: string; // Muted icons
    };

    // Selection
    selection: {
      background: string; // Selected item background
      text: string; // Selected item text
    };

    // Shadows
    shadow: {
      small: string; // Small shadow
      medium: string; // Medium shadow
      large: string; // Large shadow
    };
  };

  // UI Component colors - Dark mode
  dark: {
    // Background colors
    background: {
      primary: string; // Main background
      secondary: string; // Secondary/alternative background
      tertiary: string; // Tertiary background (e.g., for hover states)
    };

    // Text colors
    text: {
      primary: string; // Primary text
      secondary: string; // Secondary text
      muted: string; // Muted/subtle text
      inverse: string; // Inverse text (for dark backgrounds)
    };

    // Header colors
    header: {
      background: string; // Header background
      text: string; // Header text
      border: string; // Header border
      icon: string; // Header icons
    };

    // Sidebar colors
    sidebar: {
      background: string; // Sidebar background
      text: string; // Sidebar text
      activeBackground: string; // Active item background
      activeText: string; // Active item text
      hoverBackground: string; // Hover background
      border: string; // Sidebar border
      icon: string; // Sidebar icons
    };

    // Card colors
    card: {
      background: string; // Card background
      border: string; // Card border
      shadow: string; // Card shadow
      headerBackground: string; // Card header background
      headerText: string; // Card header text
    };

    // Button colors
    button: {
      primary: {
        background: string; // Primary button background
        text: string; // Primary button text
        hover: string; // Primary button hover
        active: string; // Primary button active
        border: string; // Primary button border
      };
      secondary: {
        background: string; // Secondary button background
        text: string; // Secondary button text
        hover: string; // Secondary button hover
        active: string; // Secondary button active
        border: string; // Secondary button border
      };
      danger: {
        background: string; // Danger button background
        text: string; // Danger button text
        hover: string; // Danger button hover
        active: string; // Danger button active
        border: string; // Danger button border
      };
    };

    // Form colors
    form: {
      inputBackground: string; // Input background
      inputBorder: string; // Input border
      inputText: string; // Input text
      inputPlaceholder: string; // Input placeholder
      inputFocus: string; // Input focus border/ring
      label: string; // Form label
      error: string; // Error message/indicator
    };

    // Border colors
    border: {
      light: string; // Light border
      medium: string; // Medium border
      heavy: string; // Heavy/prominent border
      divider: string; // Dividers
    };

    // Status colors
    status: {
      success: string; // Success indicator
      error: string; // Error indicator
      warning: string; // Warning indicator
      info: string; // Info indicator
    };

    // Icon colors
    icon: {
      primary: string; // Primary icons
      secondary: string; // Secondary icons
      muted: string; // Muted icons
    };

    // Selection
    selection: {
      background: string; // Selected item background
      text: string; // Selected item text
    };

    // Shadows
    shadow: {
      small: string; // Small shadow
      medium: string; // Medium shadow
      large: string; // Large shadow
    };
  };

  // Legacy properties (for backward compatibility)
  headerBg?: string; // Header background color
  headerText?: string; // Header text color
  backgroundColor?: string; // Page background color
  cardColor?: string; // Card background color
  textColor?: string; // Main text color
  textColorSecondary?: string; // Secondary text color
  borderColor?: string; // Border color
}

// Available themes with comprehensive properties
export const AVAILABLE_THEMES: Theme[] = [
  // Default/Blue theme
  {
    name: "Default",
    color: "#3B82F6",
    bgClass: "bg-blue-500",
    primaryColor: "#3B82F6", // Blue-500
    secondaryColor: "#60A5FA", // Blue-400
    accentColor: "#2563EB", // Blue-600

    // Light mode
    light: {
      background: {
        primary: "#F9FAFB", // Gray-50
        secondary: "#F3F4F6", // Gray-100
        tertiary: "#E5E7EB", // Gray-200
      },
      text: {
        primary: "#111827", // Gray-900
        secondary: "#4B5563", // Gray-600
        muted: "#9CA3AF", // Gray-400
        inverse: "#FFFFFF", // White
      },
      header: {
        background: "#1F2937", // Gray-800
        text: "#FFFFFF", // White
        border: "#374151", // Gray-700
        icon: "#D1D5DB", // Gray-300
      },
      sidebar: {
        background: "#111827", // Gray-900
        text: "#D1D5DB", // Gray-300
        activeBackground: "#3B82F6", // Blue-500
        activeText: "#FFFFFF", // White
        hoverBackground: "#374151", // Gray-700
        border: "#1F2937", // Gray-800
        icon: "#9CA3AF", // Gray-400
      },
      card: {
        background: "#FFFFFF", // White
        border: "#E5E7EB", // Gray-200
        shadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        headerBackground: "#F9FAFB", // Gray-50
        headerText: "#111827", // Gray-900
      },
      button: {
        primary: {
          background: "#3B82F6", // Blue-500
          text: "#FFFFFF", // White
          hover: "#2563EB", // Blue-600
          active: "#1D4ED8", // Blue-700
          border: "transparent",
        },
        secondary: {
          background: "#FFFFFF", // White
          text: "#4B5563", // Gray-600
          hover: "#F3F4F6", // Gray-100
          active: "#E5E7EB", // Gray-200
          border: "#D1D5DB", // Gray-300
        },
        danger: {
          background: "#EF4444", // Red-500
          text: "#FFFFFF", // White
          hover: "#DC2626", // Red-600
          active: "#B91C1C", // Red-700
          border: "transparent",
        },
      },
      form: {
        inputBackground: "#FFFFFF", // White
        inputBorder: "#D1D5DB", // Gray-300
        inputText: "#111827", // Gray-900
        inputPlaceholder: "#9CA3AF", // Gray-400
        inputFocus: "#3B82F6", // Blue-500
        label: "#374151", // Gray-700
        error: "#EF4444", // Red-500
      },
      border: {
        light: "#F3F4F6", // Gray-100
        medium: "#E5E7EB", // Gray-200
        heavy: "#D1D5DB", // Gray-300
        divider: "#E5E7EB", // Gray-200
      },
      status: {
        success: "#10B981", // Emerald-500
        error: "#EF4444", // Red-500
        warning: "#F59E0B", // Amber-500
        info: "#3B82F6", // Blue-500
      },
      icon: {
        primary: "#4B5563", // Gray-600
        secondary: "#9CA3AF", // Gray-400
        muted: "#D1D5DB", // Gray-300
      },
      selection: {
        background: "#DBEAFE", // Blue-100
        text: "#1E40AF", // Blue-800
      },
      shadow: {
        small: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        large:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },

    // Dark mode
    dark: {
      background: {
        primary: "#111827", // Gray-900
        secondary: "#1F2937", // Gray-800
        tertiary: "#374151", // Gray-700
      },
      text: {
        primary: "#F9FAFB", // Gray-50
        secondary: "#D1D5DB", // Gray-300
        muted: "#9CA3AF", // Gray-400
        inverse: "#111827", // Gray-900
      },
      header: {
        background: "#0F172A", // Slate-900
        text: "#F9FAFB", // Gray-50
        border: "#1F2937", // Gray-800
        icon: "#D1D5DB", // Gray-300
      },
      sidebar: {
        background: "#0F172A", // Slate-900
        text: "#D1D5DB", // Gray-300
        activeBackground: "#3B82F6", // Blue-500
        activeText: "#FFFFFF", // White
        hoverBackground: "#1F2937", // Gray-800
        border: "#0F172A", // Slate-900
        icon: "#9CA3AF", // Gray-400
      },
      card: {
        background: "#1F2937", // Gray-800
        border: "#374151", // Gray-700
        shadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.24)",
        headerBackground: "#374151", // Gray-700
        headerText: "#F9FAFB", // Gray-50
      },
      button: {
        primary: {
          background: "#3B82F6", // Blue-500
          text: "#FFFFFF", // White
          hover: "#2563EB", // Blue-600
          active: "#1D4ED8", // Blue-700
          border: "transparent",
        },
        secondary: {
          background: "#374151", // Gray-700
          text: "#D1D5DB", // Gray-300
          hover: "#4B5563", // Gray-600
          active: "#6B7280", // Gray-500
          border: "#1F2937", // Gray-800
        },
        danger: {
          background: "#EF4444", // Red-500
          text: "#FFFFFF", // White
          hover: "#DC2626", // Red-600
          active: "#B91C1C", // Red-700
          border: "transparent",
        },
      },
      form: {
        inputBackground: "#374151", // Gray-700
        inputBorder: "#4B5563", // Gray-600
        inputText: "#F9FAFB", // Gray-50
        inputPlaceholder: "#9CA3AF", // Gray-400
        inputFocus: "#3B82F6", // Blue-500
        label: "#D1D5DB", // Gray-300
        error: "#EF4444", // Red-500
      },
      border: {
        light: "#374151", // Gray-700
        medium: "#4B5563", // Gray-600
        heavy: "#6B7280", // Gray-500
        divider: "#374151", // Gray-700
      },
      status: {
        success: "#10B981", // Emerald-500
        error: "#EF4444", // Red-500
        warning: "#F59E0B", // Amber-500
        info: "#3B82F6", // Blue-500
      },
      icon: {
        primary: "#D1D5DB", // Gray-300
        secondary: "#9CA3AF", // Gray-400
        muted: "#6B7280", // Gray-500
      },
      selection: {
        background: "#2563EB", // Blue-600
        text: "#FFFFFF", // White
      },
      shadow: {
        small: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.36)",
        large:
          "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
      },
    },

    // Legacy properties
    headerBg: "#1F2937",
    headerText: "#FFFFFF",
    backgroundColor: "#F9FAFB",
    cardColor: "#FFFFFF",
    textColor: "#111827",
    textColorSecondary: "#4B5563",
    borderColor: "#E5E7EB",
  },

  // Green theme
  {
    name: "Green",
    color: "#10B981",
    bgClass: "bg-emerald-500",
    primaryColor: "#10B981", // Emerald-500
    secondaryColor: "#34D399", // Emerald-400
    accentColor: "#059669", // Emerald-600

    // Light mode
    light: {
      background: {
        primary: "#ECFDF5", // Emerald-50
        secondary: "#D1FAE5", // Emerald-100
        tertiary: "#A7F3D0", // Emerald-200
      },
      text: {
        primary: "#064E3B", // Emerald-900
        secondary: "#065F46", // Emerald-800
        muted: "#34D399", // Emerald-400
        inverse: "#FFFFFF", // White
      },
      header: {
        background: "#064E3B", // Emerald-900
        text: "#FFFFFF", // White
        border: "#065F46", // Emerald-800
        icon: "#D1FAE5", // Emerald-100
      },
      sidebar: {
        background: "#064E3B", // Emerald-900
        text: "#D1FAE5", // Emerald-100
        activeBackground: "#10B981", // Emerald-500
        activeText: "#FFFFFF", // White
        hoverBackground: "#065F46", // Emerald-800
        border: "#064E3B", // Emerald-900
        icon: "#A7F3D0", // Emerald-200
      },
      card: {
        background: "#FFFFFF", // White
        border: "#D1FAE5", // Emerald-100
        shadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        headerBackground: "#ECFDF5", // Emerald-50
        headerText: "#064E3B", // Emerald-900
      },
      button: {
        primary: {
          background: "#10B981", // Emerald-500
          text: "#FFFFFF", // White
          hover: "#059669", // Emerald-600
          active: "#047857", // Emerald-700
          border: "transparent",
        },
        secondary: {
          background: "#FFFFFF", // White
          text: "#065F46", // Emerald-800
          hover: "#D1FAE5", // Emerald-100
          active: "#A7F3D0", // Emerald-200
          border: "#6EE7B7", // Emerald-300
        },
        danger: {
          background: "#EF4444", // Red-500
          text: "#FFFFFF", // White
          hover: "#DC2626", // Red-600
          active: "#B91C1C", // Red-700
          border: "transparent",
        },
      },
      form: {
        inputBackground: "#FFFFFF", // White
        inputBorder: "#6EE7B7", // Emerald-300
        inputText: "#064E3B", // Emerald-900
        inputPlaceholder: "#34D399", // Emerald-400
        inputFocus: "#10B981", // Emerald-500
        label: "#065F46", // Emerald-800
        error: "#EF4444", // Red-500
      },
      border: {
        light: "#D1FAE5", // Emerald-100
        medium: "#A7F3D0", // Emerald-200
        heavy: "#6EE7B7", // Emerald-300
        divider: "#A7F3D0", // Emerald-200
      },
      status: {
        success: "#10B981", // Emerald-500
        error: "#EF4444", // Red-500
        warning: "#F59E0B", // Amber-500
        info: "#3B82F6", // Blue-500
      },
      icon: {
        primary: "#065F46", // Emerald-800
        secondary: "#10B981", // Emerald-500
        muted: "#6EE7B7", // Emerald-300
      },
      selection: {
        background: "#A7F3D0", // Emerald-200
        text: "#065F46", // Emerald-800
      },
      shadow: {
        small: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        large:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },

    // Dark mode
    dark: {
      background: {
        primary: "#064E3B", // Emerald-900
        secondary: "#065F46", // Emerald-800
        tertiary: "#047857", // Emerald-700
      },
      text: {
        primary: "#ECFDF5", // Emerald-50
        secondary: "#D1FAE5", // Emerald-100
        muted: "#34D399", // Emerald-400
        inverse: "#064E3B", // Emerald-900
      },
      header: {
        background: "#064E3B", // Emerald-900
        text: "#ECFDF5", // Emerald-50
        border: "#065F46", // Emerald-800
        icon: "#A7F3D0", // Emerald-200
      },
      sidebar: {
        background: "#064E3B", // Emerald-900
        text: "#A7F3D0", // Emerald-200
        activeBackground: "#10B981", // Emerald-500
        activeText: "#FFFFFF", // White
        hoverBackground: "#065F46", // Emerald-800
        border: "#064E3B", // Emerald-900
        icon: "#34D399", // Emerald-400
      },
      card: {
        background: "#065F46", // Emerald-800
        border: "#047857", // Emerald-700
        shadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.24)",
        headerBackground: "#047857", // Emerald-700
        headerText: "#ECFDF5", // Emerald-50
      },
      button: {
        primary: {
          background: "#10B981", // Emerald-500
          text: "#FFFFFF", // White
          hover: "#059669", // Emerald-600
          active: "#047857", // Emerald-700
          border: "transparent",
        },
        secondary: {
          background: "#047857", // Emerald-700
          text: "#A7F3D0", // Emerald-200
          hover: "#065F46", // Emerald-800
          active: "#064E3B", // Emerald-900
          border: "#065F46", // Emerald-800
        },
        danger: {
          background: "#EF4444", // Red-500
          text: "#FFFFFF", // White
          hover: "#DC2626", // Red-600
          active: "#B91C1C", // Red-700
          border: "transparent",
        },
      },
      form: {
        inputBackground: "#047857", // Emerald-700
        inputBorder: "#065F46", // Emerald-800
        inputText: "#ECFDF5", // Emerald-50
        inputPlaceholder: "#34D399", // Emerald-400
        inputFocus: "#10B981", // Emerald-500
        label: "#A7F3D0", // Emerald-200
        error: "#EF4444", // Red-500
      },
      border: {
        light: "#047857", // Emerald-700
        medium: "#065F46", // Emerald-800
        heavy: "#064E3B", // Emerald-900
        divider: "#047857", // Emerald-700
      },
      status: {
        success: "#10B981", // Emerald-500
        error: "#EF4444", // Red-500
        warning: "#F59E0B", // Amber-500
        info: "#3B82F6", // Blue-500
      },
      icon: {
        primary: "#A7F3D0", // Emerald-200
        secondary: "#34D399", // Emerald-400
        muted: "#059669", // Emerald-600
      },
      selection: {
        background: "#059669", // Emerald-600
        text: "#FFFFFF", // White
      },
      shadow: {
        small: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.36)",
        large:
          "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
      },
    },

    // Legacy properties
    headerBg: "#064E3B",
    headerText: "#FFFFFF",
    backgroundColor: "#ECFDF5",
    cardColor: "#FFFFFF",
    textColor: "#064E3B",
    textColorSecondary: "#065F46",
    borderColor: "#D1FAE5",
  },

  // Purple theme
  {
    name: "Purple",
    color: "#8B5CF6",
    bgClass: "bg-violet-500",
    primaryColor: "#8B5CF6", // Violet-500
    secondaryColor: "#A78BFA", // Violet-400
    accentColor: "#7C3AED", // Violet-600

    // Light mode and dark mode configurations similar to above themes
    light: {
      // Light mode configuration for Purple theme
      // Similar structure as above themes
      background: {
        primary: "#F5F3FF", // Violet-50
        secondary: "#EDE9FE", // Violet-100
        tertiary: "#DDD6FE", // Violet-200
      },
      text: {
        primary: "#4C1D95", // Violet-900
        secondary: "#5B21B6", // Violet-800
        muted: "#A78BFA", // Violet-400
        inverse: "#FFFFFF", // White
      },
      // ... other light mode properties
      header: {
        background: "#4C1D95", // Violet-900
        text: "#FFFFFF", // White
        border: "#5B21B6", // Violet-800
        icon: "#EDE9FE", // Violet-100
      },
      sidebar: {
        background: "#4C1D95", // Violet-900
        text: "#EDE9FE", // Violet-100
        activeBackground: "#8B5CF6", // Violet-500
        activeText: "#FFFFFF", // White
        hoverBackground: "#5B21B6", // Violet-800
        border: "#4C1D95", // Violet-900
        icon: "#DDD6FE", // Violet-200
      },
      // ... remaining light mode properties following the same pattern
      card: {
        background: "#FFFFFF",
        border: "#EDE9FE",
        shadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        headerBackground: "#F5F3FF",
        headerText: "#4C1D95",
      },
      button: {
        primary: {
          background: "#8B5CF6",
          text: "#FFFFFF",
          hover: "#7C3AED",
          active: "#6D28D9",
          border: "transparent",
        },
        secondary: {
          background: "#FFFFFF",
          text: "#5B21B6",
          hover: "#EDE9FE",
          active: "#DDD6FE",
          border: "#C4B5FD",
        },
        danger: {
          background: "#EF4444",
          text: "#FFFFFF",
          hover: "#DC2626",
          active: "#B91C1C",
          border: "transparent",
        },
      },
      form: {
        inputBackground: "#FFFFFF",
        inputBorder: "#C4B5FD",
        inputText: "#4C1D95",
        inputPlaceholder: "#A78BFA",
        inputFocus: "#8B5CF6",
        label: "#5B21B6",
        error: "#EF4444",
      },
      border: {
        light: "#EDE9FE",
        medium: "#DDD6FE",
        heavy: "#C4B5FD",
        divider: "#DDD6FE",
      },
      status: {
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
      },
      icon: {
        primary: "#5B21B6",
        secondary: "#8B5CF6",
        muted: "#C4B5FD",
      },
      selection: {
        background: "#DDD6FE",
        text: "#5B21B6",
      },
      shadow: {
        small: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        large:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
    dark: {
      // Dark mode configuration for Purple theme
      background: {
        primary: "#4C1D95",
        secondary: "#5B21B6",
        tertiary: "#6D28D9",
      },
      text: {
        primary: "#F5F3FF",
        secondary: "#EDE9FE",
        muted: "#A78BFA",
        inverse: "#4C1D95",
      },
      header: {
        background: "#4C1D95",
        text: "#F5F3FF",
        border: "#5B21B6",
        icon: "#DDD6FE",
      },
      sidebar: {
        background: "#4C1D95",
        text: "#DDD6FE",
        activeBackground: "#8B5CF6",
        activeText: "#FFFFFF",
        hoverBackground: "#5B21B6",
        border: "#4C1D95",
        icon: "#A78BFA",
      },
      card: {
        background: "#5B21B6",
        border: "#6D28D9",
        shadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.24)",
        headerBackground: "#6D28D9",
        headerText: "#F5F3FF",
      },
      button: {
        primary: {
          background: "#8B5CF6",
          text: "#FFFFFF",
          hover: "#7C3AED",
          active: "#6D28D9",
          border: "transparent",
        },
        secondary: {
          background: "#6D28D9",
          text: "#DDD6FE",
          hover: "#5B21B6",
          active: "#4C1D95",
          border: "#5B21B6",
        },
        danger: {
          background: "#EF4444",
          text: "#FFFFFF",
          hover: "#DC2626",
          active: "#B91C1C",
          border: "transparent",
        },
      },
      form: {
        inputBackground: "#6D28D9",
        inputBorder: "#5B21B6",
        inputText: "#F5F3FF",
        inputPlaceholder: "#A78BFA",
        inputFocus: "#8B5CF6",
        label: "#DDD6FE",
        error: "#EF4444",
      },
      border: {
        light: "#6D28D9",
        medium: "#5B21B6",
        heavy: "#4C1D95",
        divider: "#6D28D9",
      },
      status: {
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
      },
      icon: {
        primary: "#DDD6FE",
        secondary: "#A78BFA",
        muted: "#7C3AED",
      },
      selection: {
        background: "#7C3AED",
        text: "#FFFFFF",
      },
      shadow: {
        small: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.36)",
        large:
          "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
      },
    },

    // Legacy properties
    headerBg: "#4C1D95",
    headerText: "#FFFFFF",
    backgroundColor: "#F5F3FF",
    cardColor: "#FFFFFF",
    textColor: "#4C1D95",
    textColorSecondary: "#5B21B6",
    borderColor: "#EDE9FE",
  },

  // Dark theme (only showing important differences - would have full set in a real implementation)
  {
    name: "Dark",
    color: "#1F2937",
    bgClass: "bg-gray-800",
    isDark: true,
    primaryColor: "#1F2937",
    secondaryColor: "#4B5563",
    accentColor: "#374151",

    light: {
      background: {
        primary: "#1F2937", // Gray-800
        secondary: "#111827", // Gray-900
        tertiary: "#374151", // Gray-700
      },
      text: {
        primary: "#F9FAFB", // Gray-50
        secondary: "#D1D5DB", // Gray-300
        muted: "#6B7280", // Gray-500
        inverse: "#111827", // Gray-900
      },
      header: {
        background: "#111827", // Gray-900
        text: "#F9FAFB", // Gray-50
        border: "#1F2937", // Gray-800
        icon: "#D1D5DB", // Gray-300
      },
      sidebar: {
        background: "#111827", // Gray-900
        text: "#D1D5DB", // Gray-300
        activeBackground: "#374151", // Gray-700
        activeText: "#FFFFFF", // White
        hoverBackground: "#1F2937", // Gray-800
        border: "#111827", // Gray-900
        icon: "#9CA3AF", // Gray-400
      },
      card: {
        background: "#1F2937", // Gray-800
        border: "#374151", // Gray-700
        shadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.24)",
        headerBackground: "#374151", // Gray-700
        headerText: "#F9FAFB", // Gray-50
      },
      button: {
        primary: {
          background: "#4B5563", // Gray-600
          text: "#FFFFFF", // White
          hover: "#374151", // Gray-700
          active: "#1F2937", // Gray-800
          border: "transparent",
        },
        secondary: {
          background: "#1F2937", // Gray-800
          text: "#D1D5DB", // Gray-300
          hover: "#374151", // Gray-700
          active: "#4B5563", // Gray-600
          border: "#111827", // Gray-900
        },
        danger: {
          background: "#EF4444", // Red-500
          text: "#FFFFFF", // White
          hover: "#DC2626", // Red-600
          active: "#B91C1C", // Red-700
          border: "transparent",
        },
      },
      form: {
        inputBackground: "#374151", // Gray-700
        inputBorder: "#4B5563", // Gray-600
        inputText: "#F9FAFB", // Gray-50
        inputPlaceholder: "#9CA3AF", // Gray-400
        inputFocus: "#4B5563", // Gray-600
        label: "#D1D5DB", // Gray-300
        error: "#EF4444", // Red-500
      },
      border: {
        light: "#374151", // Gray-700
        medium: "#4B5563", // Gray-600
        heavy: "#6B7280", // Gray-500
        divider: "#374151", // Gray-700
      },
      status: {
        success: "#10B981", // Emerald-500
        error: "#EF4444", // Red-500
        warning: "#F59E0B", // Amber-500
        info: "#3B82F6", // Blue-500
      },
      icon: {
        primary: "#D1D5DB", // Gray-300
        secondary: "#9CA3AF", // Gray-400
        muted: "#6B7280", // Gray-500
      },
      selection: {
        background: "#4B5563", // Gray-600
        text: "#FFFFFF", // White
      },
      shadow: {
        small: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.36)",
        large:
          "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
      },
    },
    dark: {
      background: {
        primary: "#111827", // Gray-900
        secondary: "#1F2937", // Gray-800
        tertiary: "#374151", // Gray-700
      },
      text: {
        primary: "#F9FAFB", // Gray-50
        secondary: "#D1D5DB", // Gray-300
        muted: "#6B7280", // Gray-500
        inverse: "#111827", // Gray-900
      },
      header: {
        background: "#111827", // Gray-900
        text: "#F9FAFB", // Gray-50
        border: "#1F2937", // Gray-800
        icon: "#D1D5DB", // Gray-300
      },
      sidebar: {
        background: "#111827", // Gray-900
        text: "#D1D5DB", // Gray-300
        activeBackground: "#374151", // Gray-700
        activeText: "#FFFFFF", // White
        hoverBackground: "#1F2937", // Gray-800
        border: "#111827", // Gray-900
        icon: "#9CA3AF", // Gray-400
      },
      card: {
        background: "#1F2937", // Gray-800
        border: "#374151", // Gray-700
        shadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.24)",
        headerBackground: "#374151", // Gray-700
        headerText: "#F9FAFB", // Gray-50
      },
      button: {
        primary: {
          background: "#4B5563", // Gray-600
          text: "#FFFFFF", // White
          hover: "#374151", // Gray-700
          active: "#1F2937", // Gray-800
          border: "transparent",
        },
        secondary: {
          background: "#1F2937", // Gray-800
          text: "#D1D5DB", // Gray-300
          hover: "#374151", // Gray-700
          active: "#4B5563", // Gray-600
          border: "#111827", // Gray-900
        },
        danger: {
          background: "#EF4444", // Red-500
          text: "#FFFFFF", // White
          hover: "#DC2626", // Red-600
          active: "#B91C1C", // Red-700
          border: "transparent",
        },
      },
      form: {
        inputBackground: "#374151", // Gray-700
        inputBorder: "#4B5563", // Gray-600
        inputText: "#F9FAFB", // Gray-50
        inputPlaceholder: "#9CA3AF", // Gray-400
        inputFocus: "#4B5563", // Gray-600
        label: "#D1D5DB", // Gray-300
        error: "#EF4444", // Red-500
      },
      border: {
        light: "#374151", // Gray-700
        medium: "#4B5563", // Gray-600
        heavy: "#6B7280", // Gray-500
        divider: "#374151", // Gray-700
      },
      status: {
        success: "#10B981", // Emerald-500
        error: "#EF4444", // Red-500
        warning: "#F59E0B", // Amber-500
        info: "#3B82F6", // Blue-500
      },
      icon: {
        primary: "#D1D5DB", // Gray-300
        secondary: "#9CA3AF", // Gray-400
        muted: "#6B7280", // Gray-500
      },
      selection: {
        background: "#4B5563", // Gray-600
        text: "#FFFFFF", // White
      },
      shadow: {
        small: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.36)",
        large:
          "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
      },
    },

    // Legacy properties
    headerBg: "#111827",
    headerText: "#F9FAFB",
    backgroundColor: "#1F2937",
    cardColor: "#374151",
    textColor: "#F9FAFB",
    textColorSecondary: "#D1D5DB",
    borderColor: "#4B5563",
  },

  // High Contrast theme (specialized for accessibility)
  {
    name: "High Contrast",
    color: "#000000",
    bgClass: "bg-black",
    isAccessible: true,
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    accentColor: "#0000FF", // Pure blue

    light: {
      background: {
        primary: "#FFFFFF",
        secondary: "#F5F5F5",
        tertiary: "#EEEEEE",
      },
      text: {
        primary: "#000000",
        secondary: "#000000",
        muted: "#000000",
        inverse: "#FFFFFF",
      },
      header: {
        background: "#000000",
        text: "#FFFFFF",
        border: "#000000",
        icon: "#FFFFFF",
      },
      sidebar: {
        background: "#000000",
        text: "#FFFFFF",
        activeBackground: "#0000FF",
        activeText: "#FFFFFF",
        hoverBackground: "#333333",
        border: "#000000",
        icon: "#FFFFFF",
      },
      card: {
        background: "#FFFFFF",
        border: "#000000",
        shadow: "0 0 0 2px #000000",
        headerBackground: "#000000",
        headerText: "#FFFFFF",
      },
      button: {
        primary: {
          background: "#000000",
          text: "#FFFFFF",
          hover: "#333333",
          active: "#666666",
          border: "#000000",
        },
        secondary: {
          background: "#FFFFFF",
          text: "#000000",
          hover: "#EEEEEE",
          active: "#DDDDDD",
          border: "#000000",
        },
        danger: {
          background: "#FF0000",
          text: "#FFFFFF",
          hover: "#CC0000",
          active: "#990000",
          border: "#FF0000",
        },
      },
      form: {
        inputBackground: "#FFFFFF",
        inputBorder: "#000000",
        inputText: "#000000",
        inputPlaceholder: "#666666",
        inputFocus: "#0000FF",
        label: "#000000",
        error: "#FF0000",
      },
      border: {
        light: "#000000",
        medium: "#000000",
        heavy: "#000000",
        divider: "#000000",
      },
      status: {
        success: "#008000",
        error: "#FF0000",
        warning: "#FFA500",
        info: "#0000FF",
      },
      icon: {
        primary: "#000000",
        secondary: "#000000",
        muted: "#666666",
      },
      selection: {
        background: "#0000FF",
        text: "#FFFFFF",
      },
      shadow: {
        small: "0 0 0 1px #000000",
        medium: "0 0 0 2px #000000",
        large: "0 0 0 3px #000000",
      },
    },
    dark: {
      background: {
        primary: "#000000",
        secondary: "#000000",
        tertiary: "#222222",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#FFFFFF",
        muted: "#FFFFFF",
        inverse: "#000000",
      },
      header: {
        background: "#000000",
        text: "#FFFFFF",
        border: "#FFFFFF",
        icon: "#FFFFFF",
      },
      sidebar: {
        background: "#000000",
        text: "#FFFFFF",
        activeBackground: "#0000FF",
        activeText: "#FFFFFF",
        hoverBackground: "#333333",
        border: "#FFFFFF",
        icon: "#FFFFFF",
      },
      card: {
        background: "#000000",
        border: "#FFFFFF",
        shadow: "0 0 0 2px #FFFFFF",
        headerBackground: "#000000",
        headerText: "#FFFFFF",
      },
      button: {
        primary: {
          background: "#FFFFFF",
          text: "#000000",
          hover: "#CCCCCC",
          active: "#999999",
          border: "#FFFFFF",
        },
        secondary: {
          background: "#000000",
          text: "#FFFFFF",
          hover: "#333333",
          active: "#666666",
          border: "#FFFFFF",
        },
        danger: {
          background: "#FF0000",
          text: "#FFFFFF",
          hover: "#CC0000",
          active: "#990000",
          border: "#FF0000",
        },
      },
      form: {
        inputBackground: "#000000",
        inputBorder: "#FFFFFF",
        inputText: "#FFFFFF",
        inputPlaceholder: "#AAAAAA",
        inputFocus: "#0000FF",
        label: "#FFFFFF",
        error: "#FF0000",
      },
      border: {
        light: "#FFFFFF",
        medium: "#FFFFFF",
        heavy: "#FFFFFF",
        divider: "#FFFFFF",
      },
      status: {
        success: "#00FF00",
        error: "#FF0000",
        warning: "#FFA500",
        info: "#00FFFF",
      },
      icon: {
        primary: "#FFFFFF",
        secondary: "#FFFFFF",
        muted: "#AAAAAA",
      },
      selection: {
        background: "#0000FF",
        text: "#FFFFFF",
      },
      shadow: {
        small: "0 0 0 1px #FFFFFF",
        medium: "0 0 0 2px #FFFFFF",
        large: "0 0 0 3px #FFFFFF",
      },
    },

    // Legacy properties
    headerBg: "#000000",
    headerText: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    cardColor: "#FFFFFF",
    textColor: "#000000",
    textColorSecondary: "#000000",
    borderColor: "#000000",
  },
];

// Theme context interface
interface ThemeContextProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
  toggleHighContrastMode: (enabled: boolean) => void;
  highContrastMode: boolean;
  // Add color utility functions
  getHeaderStyle: () => { backgroundColor: string; color: string };
  getCardStyle: () => {
    backgroundColor: string;
    color: string;
    borderColor: string;
  };
  getTextStyle: () => { color: string };
  getGradientBackground: (theme: Theme) => { primary: string; content: string };
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Props for the ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme Provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // State for current theme and high contrast mode
  const [currentTheme, setCurrentTheme] = useState<Theme>(AVAILABLE_THEMES[0]);
  const [highContrastMode, setHighContrastMode] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedThemeIndex = parseInt(
          localStorage.getItem("selectedThemeIndex") || "0"
        );
        const savedTheme =
          AVAILABLE_THEMES[savedThemeIndex] || AVAILABLE_THEMES[0];
        setCurrentTheme(savedTheme);

        const savedHighContrast =
          localStorage.getItem("highContrastMode") === "true";
        setHighContrastMode(savedHighContrast);
      } catch (error) {
        console.error("Error loading theme:", error);
        // Fall back to default theme
        setCurrentTheme(AVAILABLE_THEMES[0]);
      }
    };

    loadTheme();
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    const mode = currentTheme.isDark ? "dark" : "light";
    const colors = currentTheme[mode];

    // Legacy properties for backward compatibility
    document.documentElement.style.setProperty(
      "--color-primary",
      currentTheme.color
    );
    if (currentTheme.secondaryColor) {
      document.documentElement.style.setProperty(
        "--color-secondary",
        currentTheme.secondaryColor
      );
    }
    if (currentTheme.backgroundColor) {
      document.documentElement.style.setProperty(
        "--color-background",
        currentTheme.backgroundColor
      );
    }
    if (currentTheme.textColor) {
      document.documentElement.style.setProperty(
        "--color-text",
        currentTheme.textColor
      );
    }
    if (currentTheme.cardColor) {
      document.documentElement.style.setProperty(
        "--color-card",
        currentTheme.cardColor
      );
    }
    if (currentTheme.borderColor) {
      document.documentElement.style.setProperty(
        "--color-border",
        currentTheme.borderColor
      );
    }

    // Apply comprehensive color system
    // Main colors
    document.documentElement.style.setProperty(
      "--color-primary",
      currentTheme.primaryColor
    );
    document.documentElement.style.setProperty(
      "--color-secondary",
      currentTheme.secondaryColor
    );
    document.documentElement.style.setProperty(
      "--color-accent",
      currentTheme.accentColor
    );

    // Background colors
    document.documentElement.style.setProperty(
      "--color-bg-primary",
      colors.background.primary
    );
    document.documentElement.style.setProperty(
      "--color-bg-secondary",
      colors.background.secondary
    );
    document.documentElement.style.setProperty(
      "--color-bg-tertiary",
      colors.background.tertiary
    );

    // Text colors
    document.documentElement.style.setProperty(
      "--color-text-primary",
      colors.text.primary
    );
    document.documentElement.style.setProperty(
      "--color-text-secondary",
      colors.text.secondary
    );
    document.documentElement.style.setProperty(
      "--color-text-muted",
      colors.text.muted
    );
    document.documentElement.style.setProperty(
      "--color-text-inverse",
      colors.text.inverse
    );

    // Header colors
    document.documentElement.style.setProperty(
      "--color-header-bg",
      colors.header.background
    );
    document.documentElement.style.setProperty(
      "--color-header-text",
      colors.header.text
    );
    document.documentElement.style.setProperty(
      "--color-header-border",
      colors.header.border
    );
    document.documentElement.style.setProperty(
      "--color-header-icon",
      colors.header.icon
    );

    // Sidebar colors
    document.documentElement.style.setProperty(
      "--color-sidebar-bg",
      colors.sidebar.background
    );
    document.documentElement.style.setProperty(
      "--color-sidebar-text",
      colors.sidebar.text
    );
    document.documentElement.style.setProperty(
      "--color-sidebar-active-bg",
      colors.sidebar.activeBackground
    );
    document.documentElement.style.setProperty(
      "--color-sidebar-active-text",
      colors.sidebar.activeText
    );
    document.documentElement.style.setProperty(
      "--color-sidebar-hover-bg",
      colors.sidebar.hoverBackground
    );
    document.documentElement.style.setProperty(
      "--color-sidebar-border",
      colors.sidebar.border
    );
    document.documentElement.style.setProperty(
      "--color-sidebar-icon",
      colors.sidebar.icon
    );

    // Card colors
    document.documentElement.style.setProperty(
      "--color-card-bg",
      colors.card.background
    );
    document.documentElement.style.setProperty(
      "--color-card-border",
      colors.card.border
    );
    document.documentElement.style.setProperty(
      "--color-card-shadow",
      colors.card.shadow
    );
    document.documentElement.style.setProperty(
      "--color-card-header-bg",
      colors.card.headerBackground
    );
    document.documentElement.style.setProperty(
      "--color-card-header-text",
      colors.card.headerText
    );

    // Button colors
    document.documentElement.style.setProperty(
      "--color-btn-primary-bg",
      colors.button.primary.background
    );
    document.documentElement.style.setProperty(
      "--color-btn-primary-text",
      colors.button.primary.text
    );
    document.documentElement.style.setProperty(
      "--color-btn-primary-hover",
      colors.button.primary.hover
    );
    document.documentElement.style.setProperty(
      "--color-btn-primary-active",
      colors.button.primary.active
    );
    document.documentElement.style.setProperty(
      "--color-btn-primary-border",
      colors.button.primary.border
    );

    document.documentElement.style.setProperty(
      "--color-btn-secondary-bg",
      colors.button.secondary.background
    );
    document.documentElement.style.setProperty(
      "--color-btn-secondary-text",
      colors.button.secondary.text
    );
    document.documentElement.style.setProperty(
      "--color-btn-secondary-hover",
      colors.button.secondary.hover
    );
    document.documentElement.style.setProperty(
      "--color-btn-secondary-active",
      colors.button.secondary.active
    );
    document.documentElement.style.setProperty(
      "--color-btn-secondary-border",
      colors.button.secondary.border
    );

    document.documentElement.style.setProperty(
      "--color-btn-danger-bg",
      colors.button.danger.background
    );
    document.documentElement.style.setProperty(
      "--color-btn-danger-text",
      colors.button.danger.text
    );
    document.documentElement.style.setProperty(
      "--color-btn-danger-hover",
      colors.button.danger.hover
    );
    document.documentElement.style.setProperty(
      "--color-btn-danger-active",
      colors.button.danger.active
    );
    document.documentElement.style.setProperty(
      "--color-btn-danger-border",
      colors.button.danger.border
    );

    // Form colors
    document.documentElement.style.setProperty(
      "--color-input-bg",
      colors.form.inputBackground
    );
    document.documentElement.style.setProperty(
      "--color-input-border",
      colors.form.inputBorder
    );
    document.documentElement.style.setProperty(
      "--color-input-text",
      colors.form.inputText
    );
    document.documentElement.style.setProperty(
      "--color-input-placeholder",
      colors.form.inputPlaceholder
    );
    document.documentElement.style.setProperty(
      "--color-input-focus",
      colors.form.inputFocus
    );
    document.documentElement.style.setProperty(
      "--color-label",
      colors.form.label
    );
    document.documentElement.style.setProperty(
      "--color-error",
      colors.form.error
    );

    // Border colors
    document.documentElement.style.setProperty(
      "--color-border-light",
      colors.border.light
    );
    document.documentElement.style.setProperty(
      "--color-border-medium",
      colors.border.medium
    );
    document.documentElement.style.setProperty(
      "--color-border-heavy",
      colors.border.heavy
    );
    document.documentElement.style.setProperty(
      "--color-divider",
      colors.border.divider
    );

    // Status colors
    document.documentElement.style.setProperty(
      "--color-success",
      colors.status.success
    );
    document.documentElement.style.setProperty(
      "--color-error",
      colors.status.error
    );
    document.documentElement.style.setProperty(
      "--color-warning",
      colors.status.warning
    );
    document.documentElement.style.setProperty(
      "--color-info",
      colors.status.info
    );

    // Icon colors
    document.documentElement.style.setProperty(
      "--color-icon-primary",
      colors.icon.primary
    );
    document.documentElement.style.setProperty(
      "--color-icon-secondary",
      colors.icon.secondary
    );
    document.documentElement.style.setProperty(
      "--color-icon-muted",
      colors.icon.muted
    );

    // Selection colors
    document.documentElement.style.setProperty(
      "--color-selection-bg",
      colors.selection.background
    );
    document.documentElement.style.setProperty(
      "--color-selection-text",
      colors.selection.text
    );

    // Shadow values
    document.documentElement.style.setProperty(
      "--shadow-sm",
      colors.shadow.small
    );
    document.documentElement.style.setProperty(
      "--shadow-md",
      colors.shadow.medium
    );
    document.documentElement.style.setProperty(
      "--shadow-lg",
      colors.shadow.large
    );

    // Apply dark mode
    if (currentTheme.isDark) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }

    // Apply high contrast mode
    if (currentTheme.isAccessible || highContrastMode) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    // Save theme preferences
    const themeIndex = AVAILABLE_THEMES.findIndex(
      (t) => t.name === currentTheme.name
    );
    localStorage.setItem("selectedThemeIndex", themeIndex.toString());
    localStorage.setItem("highContrastMode", highContrastMode.toString());
  }, [currentTheme, highContrastMode]);

  // Set theme function
  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  // Toggle high contrast mode
  const toggleHighContrastMode = (enabled: boolean) => {
    setHighContrastMode(enabled);
  };

  // Helper functions for common styles
  const getHeaderStyle = () => ({
    backgroundColor: currentTheme.headerBg || currentTheme.color,
    color: currentTheme.headerText || "#FFFFFF",
  });

  const getCardStyle = () => ({
    backgroundColor: currentTheme.cardColor || "#FFFFFF",
    color: currentTheme.textColor || "#111827",
    borderColor: currentTheme.borderColor || "#E5E7EB",
  });

  const getTextStyle = () => ({
    color: currentTheme.textColor || "#111827",
  });

  // Make sure gradients work well with all themes
  const getGradientBackground = (theme: Theme) => {
    if (theme.isDark) {
      return {
        primary: `linear-gradient(135deg, ${theme.color}22 0%, ${theme.backgroundColor || "#1F2937"}99 100%)`,
        content: `linear-gradient(135deg, ${theme.backgroundColor || "#1F2937"}99 0%, ${theme.color}11 100%)`,
      };
    }
    return {
      primary: `linear-gradient(135deg, ${theme.color}22 0%, ${theme.color}11 100%)`,
      content: `linear-gradient(135deg, ${theme.backgroundColor || "#F9FAFB"}99 0%, ${theme.color}11 100%)`,
    };
  };

  // Create context value
  const contextValue: ThemeContextProps = {
    currentTheme,
    setTheme,
    availableThemes: AVAILABLE_THEMES,
    toggleHighContrastMode,
    highContrastMode,
    getHeaderStyle,
    getCardStyle,
    getTextStyle,
    getGradientBackground,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
