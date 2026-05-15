import { StyleSheet, Platform } from "react-native";
import { COLORS } from "./theme";

const mono = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

const shadow = {
  ...Platform.select({
    web: {
      boxShadow: "0 14px 34px rgba(17, 21, 24, 0.12)",
    },
    default: {
      shadowColor: COLORS.ink,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 4,
    },
  }),
};

const glass = {
  backgroundColor: COLORS.glassWarm,
  ...Platform.select({
    web: {
      backdropFilter: "blur(18px) saturate(150%)",
      WebkitBackdropFilter: "blur(18px) saturate(150%)",
    },
    default: {},
  }),
};

const liquidSurface = {
  ...Platform.select({
    web: {
      backdropFilter: "blur(18px) saturate(170%)",
      WebkitBackdropFilter: "blur(18px) saturate(170%)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(17,21,24,0.08), 0 10px 24px rgba(17,21,24,0.12)",
    },
    default: {
      shadowColor: COLORS.ink,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 3,
    },
  }),
};

/**
 * Styles
 * Shared styling for layout and components.
 */
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  screenContent: {
    flex: 1,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },

  backdropBlock: {
    position: "absolute",
    borderWidth: 1,
    borderColor: COLORS.border,
    opacity: 0.85,
  },

  backdropBlockMint: {
    top: 58,
    right: -48,
    width: 172,
    height: 172,
    backgroundColor: COLORS.primary,
  },

  backdropBlockPink: {
    bottom: 58,
    left: -44,
    width: 136,
    height: 136,
    backgroundColor: COLORS.popPink,
  },

  backdropBlockYellow: {
    top: "38%",
    left: "68%",
    width: 78,
    height: 78,
    backgroundColor: COLORS.popYellow,
  },

  backdropBlockBlue: {
    top: "22%",
    left: -38,
    width: 88,
    height: 88,
    backgroundColor: COLORS.popBlue,
  },

  backdropBlockLavender: {
    bottom: "28%",
    right: -24,
    width: 96,
    height: 96,
    backgroundColor: COLORS.popLavender,
  },

  halftoneField: {
    position: "absolute",
    top: 134,
    left: 58,
    width: 126,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    opacity: 0.72,
  },

  halftoneDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.ink,
  },

  verticalSignal: {
    position: "absolute",
    right: 9,
    top: 160,
    fontFamily: mono,
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.inkSoft,
    textTransform: "uppercase",
    transform: [{ rotate: "90deg" }],
  },

  pulseRing: {
    position: "absolute",
    left: "50%",
    top: "47%",
    width: 184,
    height: 184,
    marginLeft: -92,
    marginTop: -92,
    borderRadius: 92,
    borderWidth: 1,
    borderColor: "rgba(17, 21, 24, 0.12)",
  },

  pulseRingSmall: {
    width: 112,
    height: 112,
    marginLeft: -56,
    marginTop: -56,
    borderRadius: 56,
  },

  ledgerLine: {
    position: "absolute",
    width: 1,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.borderSoft,
  },

  ledgerLineLeft: {
    left: 28,
  },

  ledgerLineRight: {
    right: 28,
  },

  backBubble: {
    position: "absolute",
    top: 14,
    left: 24,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.inkGlass,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 60,
    ...liquidSurface,
  },

  backText: {
    color: COLORS.paper,
    fontSize: 22,
    fontWeight: "800",
  },

  headerBar: {
    marginTop: Platform.OS === "ios" ? 14 : 10,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    ...glass,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
  },

  headerRight: {
    position: "absolute",
    right: 10,
    top: 8,
    bottom: 8,
    justifyContent: "center",
  },

  headerPill: {
    backgroundColor: COLORS.primaryGlass,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...liquidSurface,
  },

  headerPillText: {
    color: COLORS.ink,
    fontWeight: "900",
    fontSize: 13,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  centerTop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 96,
  },

  loginPanel: {
    width: "100%",
    maxWidth: 420,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    ...glass,
    padding: 18,
    ...shadow,
  },

  formPanel: {
    width: "100%",
    maxWidth: 390,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    ...glass,
    padding: 20,
    ...shadow,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.paper,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  brandMarkInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  eyebrow: {
    fontFamily: mono,
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primaryDark,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  appTitle: {
    fontSize: 44,
    lineHeight: 46,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 8,
  },

  appSubtitle: {
    color: COLORS.inkSoft,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    marginBottom: 16,
  },

  pageTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 14,
  },

  pageSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    marginBottom: 18,
  },

  muted: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "700",
  },

  buttonStack: {
    gap: 10,
  },

  button: {
    backgroundColor: COLORS.inkGlass,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 6,
    width: 260,
    alignItems: "center",
    ...liquidSurface,
  },

  buttonPink: {
    backgroundColor: COLORS.pinkGlass,
  },

  buttonCyan: {
    backgroundColor: COLORS.cyanGlass,
  },

  buttonYellow: {
    backgroundColor: COLORS.yellowGlass,
  },

  buttonLavender: {
    backgroundColor: COLORS.lavenderGlass,
  },

  buttonText: {
    color: COLORS.paper,
    fontWeight: "900",
    fontSize: 16,
  },

  buttonTextInk: {
    color: COLORS.ink,
  },

  linkButton: {
    marginTop: 12,
    alignItems: "center",
  },

  linkText: {
    color: COLORS.primaryDark,
    fontWeight: "900",
    fontSize: 14,
  },

  ledgerStrip: {
    marginTop: 18,
    borderTopWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  ledgerItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 248, 232, 0.76)",
    ...Platform.select({
      web: {
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      },
      default: {},
    }),
  },

  ledgerCode: {
    fontFamily: mono,
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 3,
  },

  ledgerValue: {
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: "900",
  },

  signalRail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
    marginBottom: 14,
  },

  signalChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: COLORS.glass,
    ...liquidSurface,
  },

  signalChipText: {
    fontFamily: mono,
    color: COLORS.ink,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  puppyHero: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: COLORS.ink,
  },

  puppyHeroCompact: {
    marginTop: 2,
  },

  puppyHeroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  puppyTile: {
    width: "50%",
    height: 82,
    borderColor: COLORS.border,
    overflow: "hidden",
  },

  puppyTileLarge: {
    height: 96,
  },

  puppyTilePink: {
    backgroundColor: COLORS.popPink,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },

  puppyTileCyan: {
    backgroundColor: COLORS.popCyan,
    borderBottomWidth: 1,
  },

  puppyTileYellow: {
    backgroundColor: COLORS.popYellow,
    borderRightWidth: 1,
  },

  puppyTileLavender: {
    backgroundColor: COLORS.popLavender,
  },

  puppyImage: {
    position: "absolute",
    right: -10,
    bottom: -18,
    width: 128,
    height: 128,
    opacity: 0.88,
  },

  puppyImageLarge: {
    width: 146,
    height: 146,
  },

  puppyTileLabel: {
    position: "absolute",
    left: 8,
    top: 8,
    zIndex: 4,
    fontFamily: mono,
    color: COLORS.ink,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  puppyScanner: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    height: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "rgba(255,255,255,0.42)",
    zIndex: 4,
  },

  puppyScannerFill: {
    width: "68%",
    height: "100%",
    backgroundColor: COLORS.primary,
  },

  puppyHeroCaption: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 248, 232, 0.78)",
    zIndex: 5,
    ...Platform.select({
      web: {
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      },
      default: {},
    }),
  },

  puppyHeroCaptionText: {
    fontFamily: mono,
    color: COLORS.ink,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  roleLabel: {
    marginTop: 10,
    marginBottom: 8,
    color: COLORS.ink,
    fontWeight: "900",
  },

  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },

  roleChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 15,
    backgroundColor: COLORS.glassWarm,
    ...liquidSurface,
  },

  roleChipActive: {
    backgroundColor: COLORS.primaryGlass,
  },

  roleChipText: {
    color: COLORS.muted,
    fontWeight: "900",
  },

  roleChipTextActive: {
    color: COLORS.ink,
  },

  stage: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },

  emptyCard: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    ...shadow,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 6,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "700",
    textAlign: "center",
  },

  card: {
    flex: 1,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    backgroundColor: COLORS.card,
    ...shadow,
  },

  infoBehind: {
    flex: 1,
    backgroundColor: COLORS.glassWarm,
    ...Platform.select({
      web: {
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      },
      default: {},
    }),
  },

  infoTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 10,
  },

  infoLine: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 7,
    lineHeight: 20,
  },

  infoLabel: {
    fontWeight: "900",
    color: COLORS.primaryDark,
  },

  infoHint: {
    marginTop: 12,
    fontFamily: mono,
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.borderSoft,
    marginVertical: 12,
  },

  contactButton: {
    marginTop: 14,
    backgroundColor: COLORS.primaryGlass,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    ...liquidSurface,
  },

  contactButtonText: {
    color: COLORS.ink,
    fontWeight: "900",
    fontSize: 14,
  },

  photoFront: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  photo: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  star: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.glassWarm,
    justifyContent: "center",
    alignItems: "center",
    ...liquidSurface,
  },

  starActive: {
    backgroundColor: COLORS.yellowGlass,
  },

  starText: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
  },

  overlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: "rgba(255, 248, 232, 0.76)",
    ...Platform.select({
      web: {
        backdropFilter: "blur(18px) saturate(150%)",
        WebkitBackdropFilter: "blur(18px) saturate(150%)",
      },
      default: {},
    }),
  },

  dogSignalBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 11,
    backgroundColor: COLORS.yellowGlass,
    ...liquidSurface,
  },

  dogSignalText: {
    fontFamily: mono,
    color: COLORS.ink,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  dogPosterStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 8,
    bottom: 0,
    backgroundColor: COLORS.popPink,
  },

  dogDotCluster: {
    position: "absolute",
    top: 72,
    left: 16,
    width: 58,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },

  dogDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.ink,
    opacity: 0.72,
  },

  name: {
    color: COLORS.ink,
    fontSize: 22,
    fontWeight: "900",
  },

  meta: {
    marginTop: 4,
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: "900",
  },

  overlayFooter: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  overlayMetaGroup: {
    flex: 1,
  },

  overlayContactButton: {
    backgroundColor: COLORS.primaryGlass,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
    ...liquidSurface,
  },

  overlayFavoriteButton: {
    backgroundColor: COLORS.yellowGlass,
  },

  overlayContactText: {
    color: COLORS.ink,
    fontSize: 12,
    fontWeight: "900",
  },

  overlayActionRow: {
    flexDirection: "row",
    gap: 8,
  },

  formMessage: {
    marginTop: 10,
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
  },

  formMessageError: {
    color: COLORS.popRed,
  },

  bottomRow: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  roundBtn: {
    backgroundColor: COLORS.pinkGlass,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    ...liquidSurface,
  },

  roundBtnText: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.text,
  },

  roundBtnPrimary: {
    backgroundColor: COLORS.cyanGlass,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 31,
    paddingHorizontal: 22,
    height: 62,
    justifyContent: "center",
    alignItems: "center",
    ...liquidSurface,
  },

  roundBtnPrimaryText: {
    color: COLORS.ink,
    fontWeight: "900",
    fontSize: 14,
  },

  hintLine: {
    textAlign: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    fontFamily: mono,
    fontSize: 11,
    color: COLORS.inkSoft,
    fontWeight: "800",
  },

  favEmpty: {
    paddingTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    padding: 16,
  },

  favRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    ...shadow,
  },

  favImg: {
    width: 58,
    height: 58,
    borderRadius: 8,
    marginRight: 12,
  },

  favName: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },

  favMeta: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
    fontWeight: "700",
  },

  input: {
    width: 260,
    backgroundColor: COLORS.glassWarm,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.ink,
    fontWeight: "700",
    ...liquidSurface,
  },

  chatDogPanel: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    ...shadow,
  },

  chatDogName: {
    color: COLORS.ink,
    fontWeight: "900",
    fontSize: 16,
  },

  chatShelter: {
    marginTop: 4,
    color: COLORS.primaryDark,
    fontWeight: "900",
  },

  chatBubble: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.glassWarm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    maxWidth: "78%",
    ...liquidSurface,
  },

  chatBubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.pinkGlass,
  },

  chatSender: {
    fontWeight: "900",
    marginBottom: 4,
    color: COLORS.ink,
  },

  chatBody: {
    color: COLORS.ink,
    fontWeight: "700",
  },

  chatInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  sendButtonCompact: {
    backgroundColor: COLORS.primaryGlass,
    width: 92,
    marginVertical: 0,
  },
});
