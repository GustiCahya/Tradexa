import Link from "next/link";
import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white mb-4">
              <Activity className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold tracking-tight">TradeLog</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The premium trading journal for serious traders. Track your performance, analyze your mistakes, and elevate your trading edge.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-white font-medium mb-4 text-sm">Product</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><Link href="/overview" className="hover:text-white transition-colors">Overview</Link></li>
              <li><Link href="/trade-input" className="hover:text-white transition-colors">Trade Input</Link></li>
              <li><Link href="/summary" className="hover:text-white transition-colors">Summary</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TradeLog. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Not investment advice.</p>
        </div>
      </div>
    </footer>
  );
}