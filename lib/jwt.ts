// JWT token işlemleri için yardımcı fonksiyonlar

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Token expiration check failed:", error);
    return true;
  }
};

export const decodeToken = (token: string) => {
  try {
    if (!token || typeof token !== "string") {
      console.error("Invalid token format");
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT token structure");
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Token decode failed:", error);
    return null;
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp;
  } catch (error) {
    console.error("Token expiration time extraction failed:", error);
    return null;
  }
};
