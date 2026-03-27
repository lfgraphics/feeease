"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database, Image, AlertCircle, RefreshCw, Loader2, HardDrive } from "lucide-react";
import { getStorageUsage } from "@/actions/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SchoolStorageStatsProps {
    mongoDbUri?: string;
    cloudinary?: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    title?: string;
    description?: string;
}

export function SchoolStorageStats({ mongoDbUri, cloudinary, title = "Storage Details", description = "Usage from external services" }: SchoolStorageStatsProps) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getStorageUsage(mongoDbUri, cloudinary);
            setStats(data);
        } catch (e) {
            console.error("Failed to fetch storage stats", e);
            setError("Could not retrieve storage data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [mongoDbUri, cloudinary]);

    // No longer return null, since we have fallbacks in the server action


    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 MB';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // Assuming mb values from server action
    const formatMB = (mb: number) => {
        if (mb >= 1024) {
            return (mb / 1024).toFixed(2) + ' GB';
        }
        return mb.toFixed(1) + ' MB';
    };

    return (
        <Card className="h-full w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <HardDrive className="h-5 w-5 text-primary" />
                        {title}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={fetchStats}
                    disabled={loading}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {loading && !stats && (
                    <div className="space-y-4 py-4 animate-pulse">
                        <div className="h-24 bg-muted rounded-lg" />
                        <div className="h-24 bg-muted rounded-lg" />
                    </div>
                )}

                {stats?.mongodb && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                    <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold">MongoDB Atlas</p>
                                    <p className="text-xs text-muted-foreground">Database Usage</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge variant="outline" className="text-xs font-mono">
                                    {formatMB(stats.mongodb.used)} / {formatMB(stats.mongodb.total)}
                                </Badge>
                            </div>
                        </div>
                        <Progress
                            value={(stats.mongodb.total > 0 ? (stats.mongodb.used / stats.mongodb.total) : 0) * 100}
                            className="h-2"
                        />

                        {stats.mongodb.error && (
                            <p className="text-[10px] text-destructive mt-1 italic">{stats.mongodb.error}</p>
                        )}
                    </div>
                )}

                {stats?.cloudinary && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                                    <Image className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold">Cloudinary</p>
                                    <p className="text-xs text-muted-foreground">Media Assets</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge variant="outline" className="text-xs font-mono">
                                    {formatMB(stats.cloudinary.used)} / {formatMB(stats.cloudinary.total)}
                                </Badge>
                            </div>
                        </div>
                        <Progress
                            value={(stats.cloudinary.total > 0 ? (stats.cloudinary.used / stats.cloudinary.total) : 0) * 100}
                            className="h-2"
                        />

                        {stats.cloudinary.error && (
                            <p className="text-[10px] text-destructive mt-1 italic">{stats.cloudinary.error}</p>
                        )}
                    </div>
                )}

                {!loading && !stats?.mongodb && !stats?.cloudinary && !error && (
                    <div className="text-center py-6 text-muted-foreground">
                        <Database className="h-10 w-10 mx-auto opacity-20 mb-2" />
                        <p className="text-sm italic">No external storage configuration found</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
