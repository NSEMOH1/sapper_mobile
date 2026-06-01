/**
 * useIcon / AppIcon
 * ─────────────────
 * A unified icon component that tries Ionicons first, then falls back to
 * MaterialCommunityIcons, then Feather — all from @expo/vector-icons.
 *
 * Usage (drop-in replacement for <Ionicons …/>):
 *   import AppIcon from "@/components/useIcon";
 *   <AppIcon name="piggy-bank-outline" size={24} color="#213400" />
 *
 * You can also use the hook directly if you need the resolved name/set:
 *   const { IconComponent, resolvedName } = useIcon("piggy-bank-outline");
 */

import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];
type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type FeatherName = React.ComponentProps<typeof Feather>["name"];
type FontAwesomeName = React.ComponentProps<typeof FontAwesome>["name"];

export type AppIconName =
  | IoniconsName
  | MCIName
  | FeatherName
  | FontAwesomeName
  | string; // allow arbitrary strings so callers don't get type errors

interface ResolvedIcon {
  /** The component to render */
  IconComponent: typeof Ionicons | typeof MaterialCommunityIcons | typeof Feather | typeof FontAwesome;
  /** The icon name valid for that component */
  resolvedName: string;
}

// ─── Fallback Map ────────────────────────────────────────────────────────────
//
// Keys   = names your app uses (Ionicons-style, kebab-case).
// Values = { set, name } describing where to find the icon instead.
//
// Add entries here whenever you discover a missing Ionicons icon.

type FallbackEntry =
  | { set: "mci"; name: MCIName }
  | { set: "feather"; name: FeatherName }
  | { set: "fontawesome"; name: FontAwesomeName };

const FALLBACK_MAP: Record<string, FallbackEntry> = {
  // ── Finance / Banking ──────────────────────────────────────────────────────
  "piggy-bank-outline": { set: "mci", name: "piggy-bank-outline" },
  "piggy-bank": { set: "mci", name: "piggy-bank" },
  "bank-outline": { set: "mci", name: "bank-outline" },
  bank: { set: "mci", name: "bank" },
  "cash-outline": { set: "mci", name: "cash" },
  "wallet-outline": { set: "mci", name: "wallet-outline" },
  wallet: { set: "mci", name: "wallet" },
//   "currency-exchange": { set: "mci", name: "currency-usd-circle-outline" },
  "trending-up-outline": { set: "feather", name: "trending-up" },
  "trending-down-outline": { set: "feather", name: "trending-down" },
  "bar-chart-outline": { set: "feather", name: "bar-chart-2" },
  "pie-chart-outline": { set: "feather", name: "pie-chart" },

  // ── Household / Appliances ────────────────────────────────────────────────
//   "tv-outline": { set: "mci", name: "television-outline" },
  tv: { set: "mci", name: "television" },
  "washing-machine": { set: "mci", name: "washing-machine" },
  "fridge-outline": { set: "mci", name: "fridge-outline" },
  "microwave-outline": { set: "mci", name: "microwave" },
  "air-conditioner": { set: "mci", name: "air-conditioner" },

  // ── Property ──────────────────────────────────────────────────────────────
  "house-outline": { set: "mci", name: "home-outline" },
  "building-outline": { set: "mci", name: "office-building-outline" },
  "apartment-outline": { set: "mci", name: "city-variant-outline" },
  "land-outline": { set: "mci", name: "land-plots-circle-variant" },

  // ── Transport ─────────────────────────────────────────────────────────────
  "car-outline": { set: "mci", name: "car-outline" },
  "motorcycle-outline": { set: "mci", name: "motorbike" },
  "bicycle-outline": { set: "mci", name: "bicycle" },
  "truck-outline": { set: "mci", name: "truck-outline" },

  // ── People / Social ───────────────────────────────────────────────────────
  "people-outline": { set: "mci", name: "account-group-outline" },
  "person-add-outline": { set: "mci", name: "account-plus-outline" },
  "person-remove-outline": { set: "mci", name: "account-minus-outline" },
  "contacts-outline": { set: "mci", name: "contacts-outline" },

  // ── Documents / Files ─────────────────────────────────────────────────────
  "document-attach-outline": { set: "mci", name: "paperclip" },
  "document-lock-outline": { set: "mci", name: "file-lock-outline" },
  "file-tray-full-outline": { set: "mci", name: "tray-full" },
  "folder-open-outline": { set: "feather", name: "folder" },

  // ── Communication ─────────────────────────────────────────────────────────
  "chatbubbles-outline": { set: "mci", name: "chat-outline" },
  "chatbubble-ellipses-outline": { set: "mci", name: "dots-horizontal-circle-outline" },
  "megaphone-outline": { set: "mci", name: "bullhorn-outline" },

  // ── Misc / UI ─────────────────────────────────────────────────────────────
  "color-palette-outline": { set: "mci", name: "palette-outline" },
  "shield-checkmark-outline": { set: "mci", name: "shield-check-outline" },
  "finger-print": { set: "mci", name: "fingerprint" },
  "qr-code-outline": { set: "mci", name: "qrcode" },
  "scan-outline": { set: "mci", name: "line-scan" },
  "grid-outline": { set: "feather", name: "grid" },
  "layers-outline": { set: "feather", name: "layers" },
  "sliders-outline": { set: "feather", name: "sliders" },
  "toggle-outline": { set: "feather", name: "toggle-left" },
  "speedometer-outline": { set: "mci", name: "speedometer-medium" },
  "trophy-outline": { set: "mci", name: "trophy-outline" },
  "medal-outline": { set: "mci", name: "medal-outline" },
  "gift-outline": { set: "mci", name: "gift-outline" },
  "tag-outline": { set: "mci", name: "tag-outline" },
  "pricetag-outline": { set: "mci", name: "tag-outline" },
  "ticket-outline": { set: "mci", name: "ticket-outline" },
  "clipboard-outline": { set: "mci", name: "clipboard-outline" },
  "clipboard-check-outline": { set: "mci", name: "clipboard-check-outline" },
};

// ─── Known Ionicons (subset that actually ship) ───────────────────────────────
//
// Rather than maintaining a huge allow-list, we attempt to detect missing icons
// at runtime by checking whether the glyph map contains the name.
// @expo/vector-icons exposes a static `glyphMap` on each component.

function isIoniconsName(name: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return name in (Ionicons as any).glyphMap;
}

function isMCIName(name: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return name in (MaterialCommunityIcons as any).glyphMap;
}

function isFeatherName(name: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return name in (Feather as any).glyphMap;
}

function isFontAwesomeName(name: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return name in (FontAwesome as any).glyphMap;
}

// ─── Core resolver ───────────────────────────────────────────────────────────

export function useIcon(name: AppIconName): ResolvedIcon {
  const nameStr = name as string;

  // 1. Explicit fallback map takes priority (avoids wrong Ionicons glyph)
  if (nameStr in FALLBACK_MAP) {
    const entry = FALLBACK_MAP[nameStr];
    if (entry.set === "mci") {
      return { IconComponent: MaterialCommunityIcons as any, resolvedName: entry.name };
    }
    if (entry.set === "fontawesome") {
      return { IconComponent: FontAwesome as any, resolvedName: entry.name };
    }
    return { IconComponent: Feather as any, resolvedName: entry.name };
  }

  // 2. Try Ionicons natively
  if (isIoniconsName(nameStr)) {
    return { IconComponent: Ionicons as any, resolvedName: nameStr };
  }

  // 3. Try MaterialCommunityIcons
  if (isMCIName(nameStr)) {
    return { IconComponent: MaterialCommunityIcons as any, resolvedName: nameStr };
  }

  // 4. Try Feather
  if (isFeatherName(nameStr)) {
    return { IconComponent: Feather as any, resolvedName: nameStr };
  }

    // 5. Try FontAwesome
    if (isFontAwesomeName(nameStr)) {
      return { IconComponent: FontAwesome as any, resolvedName: nameStr };
    }

  // 5. Final fallback — render a question-mark so the app doesn't crash
  console.warn(
    `[AppIcon] Icon "${nameStr}" not found in Ionicons, MaterialCommunityIcons, or Feather. ` +
      `Falling back to "help-circle-outline".`
  );
  return { IconComponent: Ionicons as any, resolvedName: "help-circle-outline" };
}

// ─── AppIcon component ────────────────────────────────────────────────────────

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  style?: object;
}

/**
 * Drop-in replacement for <Ionicons />.
 * Falls back to MaterialCommunityIcons → Feather automatically.
 */
const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  color = "#000",
  style,
}) => {
  const { IconComponent, resolvedName } = useIcon(name);
  return (
    <IconComponent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name={resolvedName as any}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default AppIcon;

// ─── Convenience re-exports ───────────────────────────────────────────────────
// So consumers can still import specific sets when they know which one they need.
export { Feather, Ionicons, MaterialCommunityIcons };