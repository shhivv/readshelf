import Link from "next/link";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="font-serif text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl">
          ReadShelf
        </h1>
        <p className="text-xl text-gray-600">
          Your personal library, curated and shared.
        </p>
        
        <Button
          asChild
          variant="default"
          size="lg"
          className="mt-4 bg-red-800 hover:bg-[#723A10]"
        >
          <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
            {session ? "Sign out" : "Sign in"}
          </Link>
        </Button>
      </div>
    </main>
  );
}
