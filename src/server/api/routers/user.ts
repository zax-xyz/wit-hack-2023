import { z } from "zod";
import argon2 from "argon2";
import {
  authorizedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { setCookie } from "cookies-next";
import { signJwt } from "~/server/utils/jwt";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user
        .create({
          data: {
            email: input.email,
            password: await argon2.hash(input.password),
            name: input.name,
          },
        })
        .catch((reason?: string) => {
          console.error("failed to create user:", reason);
          throw new TRPCError({ code: "BAD_REQUEST", message: reason });
        });

      ctx.session.uid = user.id;
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await prisma.user.findFirstOrThrow({
          where: { email: input.email },
        });

        if (!(await argon2.verify(user.password, input.password))) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid credentials",
          });
        }

        const { req, res } = ctx;
        const token = await signJwt(user.id);
        setCookie("access_token", token, { req, res });
        setCookie("authenticated", true, { req, res });

        return {
          name: user.name,
          email: user.email,
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials",
        });
      }
    }),

  logout: authorizedProcedure.mutation(({ ctx: { req, res } }) => {
    setCookie("access_token", "", { req, res });
    setCookie("authenticated", false, { req, res });

    return {
      status: "success",
    };
  }),

  self: authorizedProcedure.query(({ ctx }) => {
    const user = ctx.user;
    return {
      name: user.name,
      email: user.email,
    };
  }),
});
