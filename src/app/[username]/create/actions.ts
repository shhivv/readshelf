"use server";

import { z } from "zod";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

const createBookSchema = z.object({
  name: z.string().min(1),
  author: z.string().min(1),
  status: z.enum(["WANT_TO_READ", "CURRENTLY_READING", "READ"]),
  coverUrl: z.string().url().optional(),
});

export async function createBook(formData: FormData) {
  const session = await auth();
  if (!session?.user?.name) {
    throw new Error("Not authenticated");
  }

  console.log(formData)
  const validatedFields = createBookSchema.safeParse({
    name: formData.get("name"),
    status: formData.get("status"),
    coverUrl: formData.get("coverUrl") || undefined,
    author: formData.get("author"),
  });

  if (!validatedFields.success) {
    throw new Error("Invalid form data");
  }


  await api.book.create(validatedFields.data);

  redirect(`/${session.user.name}`);
} 