"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AuthNav() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("Logout failed");
      return;
    }

    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  if (isPending) {
    return <span className="loading loading-spinner loading-sm" />;
  }

  if (session?.user) {
  return (
    <div className="hidden items-center gap-3 md:flex">

      {/* Profile Image */}
      <div className="avatar">
        <div className="w-10 rounded-full ring-2 ring-primary">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={40}
              height={40}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary text-white">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>
      </div>

      {/* User Name */}
      <span className="hidden text-sm font-medium sm:inline">
        {session.user.name}
      </span>

      {/* Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="btn btn-outline btn-sm"
      >
        Logout
      </button>

    </div>
  );
}

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="btn btn-ghost btn-sm">
        Login
      </Link>

      <Link href="/register" className="btn btn-primary btn-sm">
        Register
      </Link>
    </div>
  );
}