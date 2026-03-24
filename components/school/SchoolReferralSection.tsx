"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gift, Users, Award, Calendar, Copy, CheckCircle2, TrendingUp, School } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/SchoolProfileActions";

interface ReferredSchool {
  schoolId: string;
  schoolName: string;
  onboardedAt: string;
}

interface OfferProgress {
  offerId: string;
  offerTitle: string;
  offerDescription?: string;
  referralTarget: number;
  rewardMonths: number;
  validUntil: string;
  eligibleCount: number;
  progress: number;
  achieved: boolean;
}

interface SchoolReferralSectionProps {
  referralCode?: string;
  referredSchools: ReferredSchool[];
  offerRewardMonthsRemaining: number;
  offerGrantedAt?: string | null;
  offersProgress: OfferProgress[];
  showReferralCode?: boolean; // false in admin view
}

export function SchoolReferralSection({
  referralCode,
  referredSchools,
  offerRewardMonthsRemaining,
  offerGrantedAt,
  offersProgress,
  showReferralCode = true,
}: SchoolReferralSectionProps) {
  return (
    <div className="space-y-6">
      {/* Referral Code Card */}
      {showReferralCode && referralCode && (
        <Card className="border-primary/20 bg-linear-to-r from-primary/5 to-secondary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Your Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Share this code with other schools. When they register using your code, they count towards your referral offers.
            </p>
            <div className="flex items-center justify-between gap-2 py-2 px-4 rounded-lg bg-muted border border-border">
              <code className="text-xl font-mono font-bold text-foreground tracking-widest">
                {referralCode}
              </code>
              <CopyButton text={referralCode} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Free Months Reward Banner */}
      {offerRewardMonthsRemaining > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-linear-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
          <CardContent className="pt-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl shrink-0">
                <Award className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-amber-800 dark:text-amber-200 text-lg">
                  🎉 Offer Reward Active!
                </h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                  You have <span className="font-bold text-lg">{offerRewardMonthsRemaining} months</span> of free recurring payments remaining.
                  {offerGrantedAt && (
                    <span className="block mt-1 text-xs opacity-80">
                      Reward granted on {format(new Date(offerGrantedAt), "dd MMM yyyy")}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offers Progress */}
      {offersProgress.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="h-5 w-5 text-primary" />
              Referral Offers Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {offersProgress.map((offer) => {
              const isExpired = new Date(offer.validUntil) < new Date();
              return (
                <div key={offer.offerId} className={`space-y-3 p-4 rounded-lg border ${offer.achieved ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20' : isExpired ? 'border-border opacity-60' : 'border-border'}`}>
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm">{offer.offerTitle}</h4>
                        {offer.achieved ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Achieved!
                          </Badge>
                        ) : isExpired ? (
                          <Badge variant="secondary" className="text-xs">Expired</Badge>
                        ) : null}
                      </div>
                      {offer.offerDescription && (
                        <p className="text-xs text-muted-foreground mt-0.5">{offer.offerDescription}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                      <Calendar className="h-3.5 w-3.5" />
                      Valid until {format(new Date(offer.validUntil), "dd MMM yyyy")}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{offer.eligibleCount}</span> / {offer.referralTarget} schools referred
                      </span>
                      <span className="font-semibold text-primary">{offer.progress}%</span>
                    </div>
                    <Progress
                      value={offer.progress}
                      className={`h-2.5 ${offer.achieved ? '[&>div]:bg-green-500' : ''}`}
                    />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      Refer <strong>{offer.referralTarget}</strong> schools
                    </span>
                    <span>→</span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                      <Award className="h-3.5 w-3.5" />
                      Get <strong>{offer.rewardMonths} months</strong> free
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Referred Schools Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <School className="h-5 w-5 text-primary" />
            Schools You Referred
            <Badge variant="secondary" className="ml-auto">{referredSchools.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referredSchools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <TrendingUp className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">No referrals yet</p>
              <p className="text-sm mt-1">Share your referral code to start earning rewards.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>School Name</TableHead>
                    <TableHead>Onboarded On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...referredSchools]
                    .sort((a, b) => new Date(b.onboardedAt).getTime() - new Date(a.onboardedAt).getTime())
                    .map((school, idx) => (
                      <TableRow key={school.schoolId}>
                        <TableCell className="font-mono text-muted-foreground text-sm">{idx + 1}</TableCell>
                        <TableCell className="font-medium">{school.schoolName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(school.onboardedAt), "dd MMM yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
