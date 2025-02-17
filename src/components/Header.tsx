import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 fixed top-0 w-full z-50">
      <Link href="/" className="text-2xl font-bold">
        Darts Tracker
      </Link>
      <nav className="flex gap-4">
        <Link href="/" className={buttonVariants({ variant: "ghost" })}>
          Home
        </Link>
        <Link href="/features" className={buttonVariants({ variant: "ghost" })}>
          Features
        </Link>
        <Link href="/pricing" className={buttonVariants({ variant: "ghost" })}>
          Pricing
        </Link>
      </nav>
      <SignedOut>
        <div className="flex gap-4">
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="outline">Sign Up</Button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex gap-4">
          <Link href="/dashboard" className={buttonVariants()}>
            Dashboard
          </Link>
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}
