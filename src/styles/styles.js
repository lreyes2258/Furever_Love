import { StyleSheet, Platform } from "react-native";
import { COLORS } from "./theme";

/**
 * Styles
 * Shared styling for layout and components
 */
export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  backBubble: {
    position: "absolute",
    top: Platform.OS === "ios" ? 52 : 18,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 60,
  },

  backText: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
  },

  headerBar: {
    marginTop: Platform.OS === "ios" ? 14 : 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
  },

  headerRight: {
    position: "absolute",
    right: 16,
    top: 10,
    bottom: 10,
    justifyContent: "center",
  },

  headerPill: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  headerPillText: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 13,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  appTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 20,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 14,
  },

  muted: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "700",
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginVertical: 10,
    width: 240,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
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
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
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
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "white",
  },

  infoBehind: {
    flex: 1,
    backgroundColor: "white",
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 10,
  },

  infoLine: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
  },

  infoLabel: {
    fontWeight: "900",
    color: COLORS.text,
  },

  infoHint: {
    marginTop: 12,
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },

  contactButton: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
  },

  contactButtonText: {
    color: "white",
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
    resizeMode: "cover",
    position: "absolute",
  },

  star: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  starActive: {
    backgroundColor: "rgba(255, 209, 102, 0.95)",
  },

  starText: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
  },

  meta: {
    marginTop: 4,
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },

  bottomRow: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  roundBtn: {
    backgroundColor: "white",
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
  },

  roundBtnText: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.text,
  },

  roundBtnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 31,
    paddingHorizontal: 22,
    height: 62,
    justifyContent: "center",
    alignItems: "center",
  },

  roundBtnPrimaryText: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
  },

  hintLine: {
    textAlign: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "800",
  },

  favRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },

  favImg: {
    width: 56,
    height: 56,
    borderRadius: 12,
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
});