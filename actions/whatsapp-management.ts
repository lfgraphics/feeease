"use server"

import dbConnect from "@/lib/db";
import School from "@/models/School";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getSchoolPublicUrl(schoolId: string) {
    const school = await School.findById(schoolId).select('deployment').lean();
    if (!school || !school.deployment?.publicAppUrl) {
        throw new Error("School public URL not configured");
    }
    return school.deployment.publicAppUrl;
}

export async function syncWhatsAppPricing(schoolId: string, pricePerRequest: number, effectiveFrom: Date) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.role.includes('admin')) {
        return { success: false, error: 'Unauthorised' };
    }

    try {
        const publicUrl = await getSchoolPublicUrl(schoolId);
        const res = await fetch(`${publicUrl}/api/whatsapp/manage`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.WORKER_WEBHOOK_SECRET}`
            },
            body: JSON.stringify({
                type: 'pricing',
                pricePerRequest,
                effectiveFrom: effectiveFrom.toISOString()
            })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Communication failed' }));
            throw new Error(err.error || "Failed to sync pricing with product app");
        }

        return { success: true };
    } catch (error: any) {
        console.error("[WhatsApp Management Error SyncPricing]:", error);
        return { success: false, error: error.message };
    }
}

export async function addWhatsAppPayment(schoolId: string, amount: number, description: string, transactionId?: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.role.includes('admin')) {
        return { success: false, error: 'Unauthorised' };
    }

    try {
        const publicUrl = await getSchoolPublicUrl(schoolId);
        const res = await fetch(`${publicUrl}/api/whatsapp/manage`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.WORKER_WEBHOOK_SECRET}`
            },
            body: JSON.stringify({
                type: 'payment',
                amount,
                description,
                transactionId
            })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Communication failed' }));
            throw new Error(err.error || "Failed to add payment to product app");
        }

        return { success: true };
    } catch (error: any) {
        console.error("[WhatsApp Management Error AddPayment]:", error);
        return { success: false, error: error.message };
    }
}

export async function getWhatsAppBillingSummary(schoolId: string) {
    try {
        const publicUrl = await getSchoolPublicUrl(schoolId);
        const res = await fetch(`${publicUrl}/api/whatsapp/manage`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${process.env.WORKER_WEBHOOK_SECRET}`
            }
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("[WhatsApp Management Error GetSummary]:", error);
        return null;
    }
}
