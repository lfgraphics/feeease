"use server"

import dbConnect from "@/lib/db";
import School from "@/models/School";
import Expense from "@/models/Expense";
import AdminUser from "@/models/AdminUser";
import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getFinanceStats() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
        throw new Error("Unauthorized");
    }

    return unstable_cache(async () => {
        await dbConnect();
        
        // Calculate Total Income
        const incomes = await Expense.find({ type: 'income', status: 'approved' });
        const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

        // Calculate Total Expenses
        const expenses = await Expense.find({ type: 'expense', status: 'approved' });
        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

        return {
            totalIncome,
            totalExpenses,
            netProfit: totalIncome - totalExpenses
        };
    }, ['finance-stats'], { revalidate: 3600, tags: ['finance-stats'] })();
}

export async function getExpenses(cursor?: string, limit: number = 10, filters?: any) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
        throw new Error("Unauthorized");
    }

    await dbConnect();
    let query: any = {};
    
    // REMOVED: No longer filtering by type: 'expense'. We want ALL transactions.
    // if (filters?.type) { query.type = filters.type } 
    // ^ If you wanted to support filtering later, you could add this back. 
    // But for "Transactions" tab, showing everything is the goal.

    if (cursor) {
        query._id = { $lt: cursor };
    }

    if (filters?.startDate && filters?.endDate) {
        query.date = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    if (filters?.category) {
        query.category = filters.category;
    }

    const expenses = await Expense.find(query)
        .sort({ date: -1, _id: -1 })
        .limit(limit + 1)
        .populate('paidTo', 'fullName email')
        .populate('approvedBy', 'fullName')
        .lean();

    const serializedExpenses = expenses.map((expense: any) => ({
        ...expense,
        _id: expense._id.toString(),
        paidTo: expense.paidTo ? { ...expense.paidTo, _id: expense.paidTo._id.toString() } : null,
        approvedBy: expense.approvedBy ? { ...expense.approvedBy, _id: expense.approvedBy._id.toString() } : null,
        schoolId: expense.schoolId ? expense.schoolId.toString() : null,
        date: expense.date ? expense.date.toISOString() : null,
        createdAt: expense.createdAt ? expense.createdAt.toISOString() : null,
        updatedAt: expense.updatedAt ? expense.updatedAt.toISOString() : null,
    }));

    const hasNextPage = serializedExpenses.length > limit;
    const data = hasNextPage ? serializedExpenses.slice(0, limit) : serializedExpenses;
    const nextCursor = hasNextPage ? data[data.length - 1]._id : null;

    return {
        expenses: data,
        nextCursor
    };
}

export type CreateExpenseParams = {
    description: string;
    amount: number;
    category: string;
    paidToName?: string;
    paidTo?: string; // Marketing User ID
    date: Date;
};

export async function createExpense(data: CreateExpenseParams) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
        throw new Error("Unauthorized");
    }

    await dbConnect();
    
    const expense = await Expense.create({
        ...data,
        type: 'expense',
        approvedBy: session.user.id,
        status: 'approved'
    });

    return JSON.parse(JSON.stringify(expense));
}

export async function deleteExpense(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
        throw new Error("Unauthorized");
    }

    await dbConnect();
    await Expense.findByIdAndDelete(id);
    return { success: true };
}

export async function getMarketingUsers() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
        throw new Error("Unauthorized");
    }

    await dbConnect();
    const users = await AdminUser.find({ role: 'marketing' }).select('_id fullName email').lean();
    return JSON.parse(JSON.stringify(users));
}

export async function getSchoolPayments(schoolId: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");
    
    await dbConnect();
    const payments = await Expense.find({ schoolId, type: 'income' }).sort({ date: -1 }).lean();
    return JSON.parse(JSON.stringify(payments.map((p: any) => ({
        ...p,
        // Map category back to 'type' expected by frontend
        type: p.category === 'Installation' ? 'installation' : (p.category === 'Recurring' ? 'recurring' : 'other'),
        // Map paymentMethod to method
        method: p.paymentMethod
    }))));
}

export async function getMarketingPerformance(startDate?: Date, endDate?: Date) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
        throw new Error("Unauthorized");
    }

    await dbConnect();

    // 1. Get all marketing users
    const marketingUsers = await AdminUser.find({ role: 'marketing' }).select('_id fullName email referralCode').lean();

    // 2. Aggregate stats for each user
    const stats = await Promise.all(marketingUsers.map(async (user: any) => {
        // Find schools referred by this user
        const schoolsDocs = await School.find({ 'referral.referredBy': user._id }).select('name').lean();
        
        let incomeGenerated = 0;
        const schoolsData: any[] = [];

        await Promise.all(schoolsDocs.map(async (school: any) => {
            const incomeQuery: any = { 
                schoolId: school._id, 
                type: 'income', 
                status: 'approved' 
            };

            if (startDate && endDate) {
                incomeQuery.date = { $gte: startDate, $lte: endDate };
            } else if (startDate) {
                incomeQuery.date = { $gte: startDate };
            } else if (endDate) {
                incomeQuery.date = { $lte: endDate };
            }

            const incomes = await Expense.find(incomeQuery).select('amount').lean();
            const schoolIncome = incomes.reduce((acc, curr: any) => acc + curr.amount, 0);
            
            incomeGenerated += schoolIncome;
            schoolsData.push({
                id: school._id.toString(),
                name: school.name,
                income: schoolIncome
            });
        }));

        // Find expenses paid to this user
        const expenseQuery: any = { paidTo: user._id, status: 'approved', type: 'expense' };
        if (startDate && endDate) {
            expenseQuery.date = { $gte: startDate, $lte: endDate };
        } else if (startDate) {
            expenseQuery.date = { $gte: startDate };
        } else if (endDate) {
            expenseQuery.date = { $lte: endDate };
        }

        const expenses = await Expense.find(expenseQuery).select('amount').lean();
        const totalPaid = expenses.reduce((acc, curr: any) => acc + curr.amount, 0);

        return {
            userId: user._id.toString(),
            name: user.fullName,
            email: user.email,
            referralCode: user.referralCode,
            schoolsCount: schoolsDocs.length,
            incomeGenerated,
            totalPaid,
            net: incomeGenerated - totalPaid,
            schools: schoolsData
        };
    }));

    return stats;
}