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

import Expense from "@/models/Expense";
import { revalidatePath } from "next/cache";

export async function addWhatsAppPayment(schoolId: string, amount: number, description: string, transactionId?: string, paymentMethod?: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.role.includes('admin')) {
        return { success: false, error: 'Unauthorised' };
    }

    try {
        const publicUrl = await getSchoolPublicUrl(schoolId);
        
        // 1. Sync with the school's own database (remote)
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

        // 2. Record in our local financial ledger (Admin DB)
        await dbConnect();
        const schoolDoc = await School.findById(schoolId).select('name').lean();
        
        await Expense.create({
            type: 'income',
            amount,
            description: `[WhatsApp] ${description}`,
            category: 'WhatsApp',
            schoolId,
            paidToName: schoolDoc?.name || 'School', // Store school name for ledger consistency
            status: 'approved',
            approvedBy: session.user.id,
            date: new Date(),
            transactionId,
            paymentMethod: paymentMethod || 'Transfer'
        });

        revalidatePath(`/admin/schools/${schoolId}`);
        revalidatePath('/admin/finances'); // Also refresh finance dashboard

        return { success: true };
    } catch (error: any) {
        console.error("[WhatsApp Management Error AddPayment]:", error);
        return { success: false, error: error.message };
    }
}

export async function getWhatsAppBillingSummary(schoolId: string) {
    try {
        const publicUrl = await getSchoolPublicUrl(schoolId);
        const url = `${publicUrl}/api/whatsapp/manage`;
        
        const res = await fetch(url, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${process.env.WORKER_WEBHOOK_SECRET}`
            },
            next: { revalidate: 60 } // Cache for 1 min
        });

        if (!res.ok) {
            console.error(`[WhatsApp Billing] Remote Fetch Failed: ${res.status} ${res.statusText}`);
            return null;
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("[WhatsApp Management Error GetSummary]:", error);
        return null;
    }
}
