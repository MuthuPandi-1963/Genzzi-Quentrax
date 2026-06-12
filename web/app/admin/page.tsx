// app/admin/page.tsx — Complete admin dashboard

"use client";

import { HeroSection } from "@/components/admin/HeroSection";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { PendingApprovals } from "@/components/admin/PendingApprovals";
import { SystemHealthCheck } from "@/components/admin/SystemHealthCheck";
import { TopPerformers } from "@/components/admin/TopPerformers";
import { QuickActions } from "@/components/admin/QuickActions";
import { RecentQuizzes } from "@/components/admin/RecentQuizzes";
import { UserTable } from "@/components/admin/UserTable";
import { StreakCard } from "@/components/admin/StreakCard";
import { CoinsWidget } from "@/components/admin/CoinsWidget";

export default function AdminDashboardPage() {
  return (
      <div className="space-y-6 max-w-400 mx-auto">
        {/* Hero + Stats */}
        <HeroSection />

        {/* Main Grid: 2/3 + 1/3 */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            <UserTable />
            <RecentQuizzes />
            <ActivityFeed />
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            <QuickActions />
            <SystemHealthCheck />
            <TopPerformers />
            <PendingApprovals />
            <StreakCard />
            <CoinsWidget />
          </div>
        </div>
      </div>
  );
}