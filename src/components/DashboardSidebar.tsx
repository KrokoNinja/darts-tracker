import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Gamepad2Icon, HomeIcon, UsersIcon } from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    label: "Players",
    href: "/players",
    icon: <UsersIcon />,
  },
  {
    label: "Games",
    href: "/games",
    icon: <Gamepad2Icon />,
  },
];

export default function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="text-lg font-bold">
          Darts Tracker
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href} className="list-none">
            <SidebarMenuButton asChild>
              <Link href={item.href} className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton redirectUrl="/">
          <Button>Sign Out</Button>
        </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  );
}
