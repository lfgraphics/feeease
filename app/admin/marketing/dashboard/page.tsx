import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMarketingDashboardData } from "@/actions/marketing-dashboard";
import { MarketingDashboardClient } from "@/components/marketing/MarketingDashboardClient";

export default async function MarketingDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "marketing") {
    if (session?.user?.role?.includes('admin')) {
       redirect('/admin');
    }
    redirect("/admin/login");
  }

  const userId = session.user.id;
  const { stats, schools, nextCursor } = await getMarketingDashboardData();
  
  // Use referral code from session to avoid DB call
  const referralCode = session.user.referralCode;

  return (
    <MarketingDashboardClient 
      initialSchools={schools}
      initialCursor={nextCursor}
      userId={userId}
      stats={stats}
      referralCode={referralCode}
    />
  );
}
