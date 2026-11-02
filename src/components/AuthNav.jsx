
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ToastProvider";

function ProfileAvatar({ image, name }) {
  const [failedUrl, setFailedUrl] = useState(null);

  const showImage = Boolean(image) && failedUrl !== image;

  return (
    <div className="avatar">
      <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary">
        {showImage ? (
          <Image
            src={image}
            alt={name || "User profile"}
            width={40}
            height={40}
            unoptimized
            onError={() => setFailedUrl(image)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary font-semibold text-primary-content">
            {name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthNav() {
  const toast = useToast();
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
        <ProfileAvatar
          image={session.user.image}
          name={session.user.name}
        />

        <span className="hidden text-sm font-medium sm:inline">
          {session.user.name}
        </span>

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
