import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 h-dvh">
      <h1 className="text-4xl font-bold">The #1 Darts Tracker</h1>
      <p className="text-lg text-muted-foreground">
        Track your darts scores and improve your game with our easy-to-use
        platform.
      </p>
      <SignInButton>
        <Button>Get Started</Button>
      </SignInButton>
    </main>
  );
}
