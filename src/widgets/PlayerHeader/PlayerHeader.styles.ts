export const headerStyle = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  height: 80,
  display: "flex",
  alignItems: "center",
  padding: "0 20px",
  background: "linear-gradient(#2c2c2c, #1a1a1a)",
  color: "#fff",
  zIndex: 10,
};

export const avatarStyle = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: "#555",
  marginRight: 16,
};

export const levelBarWrapper = {
  width: 160,
  height: 8,
  background: "#444",
  borderRadius: 4,
  overflow: "hidden",
};

export const levelBarFill = {
  width: "60%",
  height: "100%",
  background: "linear-gradient(#ffd700, #ffae00)",
};

export const currenciesStyle = {
  display: "flex",
  gap: 20,
};
