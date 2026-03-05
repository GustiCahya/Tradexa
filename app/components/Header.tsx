import Link from "next/link";
import { Activity } from "lucide-react";
import { auth, signOut } from "@/auth";
import getInitialName from "@/utils/getInitialName";

export default async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name || "User";
  const initials = getInitialName(userName);

  return (
    <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <Activity className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">TradeLog</span>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/overview" className="text-gray-400 hover:text-white transition-colors">
            Overview
          </Link>
          <Link href="/trade-input" className="text-gray-400 hover:text-white transition-colors">
            Trade Input
          </Link>
          <Link href="/summary" className="text-gray-400 hover:text-white transition-colors">
            Summary
          </Link>
        </nav>
        
        {/* Action */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative group">
              <div className="flex items-center gap-3 cursor-pointer py-2">
                <span className="text-sm font-medium text-white">{userName}</span>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/20">
                  {initials}
                </div>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full w-40 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                  <form action={async () => {
                    "use server";
                    await signOut({ redirectTo: '/login' });
                  }}>
                    <button type="submit" className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors cursor-pointer">
                      Log out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
