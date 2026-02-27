import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const GOOGLE_TOKENINFO = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=";

type GoogleTokenInfo = {
  sub: string;
  email?: string;
  email_verified?: string;
  name?: string;
  picture?: string;
  error?: string;
  error_description?: string;
};

export function registerAuthRoutes(app: import("express").Express): void {
  app.post("/api/auth/google", async (req: Request, res: Response) => {
    const accessToken =
      typeof req.body?.accessToken === "string" ? req.body.accessToken.trim() : null;

    if (!accessToken) {
      return res.status(400).json({ message: "Missing accessToken" });
    }

    try {
      const url = `${GOOGLE_TOKENINFO}${encodeURIComponent(accessToken)}`;
      const tokenRes = await fetch(url);
      const data = (await tokenRes.json()) as GoogleTokenInfo;

      if (data.error || !data.sub) {
        const message = data.error_description || data.error || "Invalid Google token";
        return res.status(401).json({ message });
      }

      const user = {
        id: data.sub,
        email: data.email ?? undefined,
        name: data.name ?? undefined,
        picture: data.picture ?? undefined,
      };

      const token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({ token, user });
    } catch (err) {
      console.error("auth/google error:", err);
      return res.status(500).json({ message: "Authentication failed" });
    }
  });
}
