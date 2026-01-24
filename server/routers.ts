import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { appointmentsRouter } from "./routers/appointments";
import { stripeRouter } from "./lib/trpc/routers/stripe";
import { referralsRouter } from "./routers/referrals";
import { leadsRouter } from "./routers/leads";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Feature routers
  appointments: appointmentsRouter,
  stripe: stripeRouter,
  referrals: referralsRouter,
  leads: leadsRouter,
});

export type AppRouter = typeof appRouter;
