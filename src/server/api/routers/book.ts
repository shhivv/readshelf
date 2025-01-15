import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const BookStatus = z.enum(['CURRENTLY_READING', 'READ', 'WANT_TO_READ']);

export const bookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ 
      name: z.string().min(1),
      author: z.string().min(1),
      status: BookStatus,
      coverUrl: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.book.create({
        data: {
          name: input.name,
          author: input.author,
          status: input.status,
          coverUrl: input.coverUrl,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getBooksByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { name: input.username },
      });

      if (!user) return null;

      return ctx.db.book.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
      });
    }),

  getAllBooks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.book.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { updatedAt: "desc" },
    });
  }),

  getBooksByStatus: protectedProcedure
    .input(z.object({ status: BookStatus }))
    .query(async ({ ctx, input }) => {
      return ctx.db.book.findMany({
        where: { 
          userId: ctx.session.user.id,
          status: input.status,
        },
        orderBy: { updatedAt: "desc" },
      });
    }),
});
