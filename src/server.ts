import { env } from "./config/env";
import app from "./app";

/**
 * Local development: start an HTTP server.
 * In production (Vercel), the `app` is exported as a serverless function handler
 * via vercel.json — no app.listen() is needed.
 */
if (env.NODE_ENV === "development") {
  app.listen(env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${env.PORT}`);
  });
}

export default app;
