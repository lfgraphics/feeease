"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database, Zap, RefreshCw, Loader2, HardDrive, Server, Globe, Activity } from "lucide-react";
import { getGlobalSystemStats } from "@/actions/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SystemStats() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getGlobalSystemStats();
            setStats(data);
        } catch (e) {
            console.error("Failed to fetch global stats", e);
            setError("Could not retrieve system data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatMB = (mb: number) => {
        if (!mb) return '0 MB';
        if (mb >= 1024) return (mb / 1024).toFixed(1) + ' GB';
        return mb.toFixed(1) + ' MB';
    };

    const formatBytes = (bytes: number) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const sizes = ['B', 'KB', 'MB', 'GB'];
        return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
    };

    if (loading && !stats) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="h-40 bg-muted/50 rounded-lg" />
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold tracking-tight">System Infrastructure</h3>
                </div>
                <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading} className="gap-2">
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                    Refresh
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Main MongoDB */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                    <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <CardTitle className="text-sm font-bold">App Database</CardTitle>
                            </div>
                            {stats?.mongodb?.plan && (
                                <Badge variant="secondary" className="text-[9px] h-4 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-none">
                                    {stats.mongodb.plan}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        <span>Main Storage</span>
                        <span className="font-mono">{formatMB(stats?.mongodb?.used)} / {stats?.mongodb?.total > 0 ? formatMB(stats?.mongodb?.total) : 'Unlimited'}</span>
                    </div>
                    {stats?.mongodb?.total > 0 ? (
                        <Progress 
                            value={(stats?.mongodb?.used / stats?.mongodb?.total) * 100} 
                            className="h-2" 
                        />
                    ) : (
                        <div className="h-2 w-full bg-blue-500/10 rounded-full flex items-center px-1">
                            <div className="h-1 w-1/3 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                    )}
                    <p className="text-[10px] text-muted-foreground italic">
                        {stats?.mongodb?.total > 0 
                            ? "Current disk space consumption for the main application." 
                            : "Local database detected. Storage is limited only by your disk space."}
                    </p>

                    </CardContent>
                </Card>

                {/* Redis Rate Limiter */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                                    <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <CardTitle className="text-sm font-bold">Rate Limiter</CardTitle>
                            </div>
                            <Badge variant="outline" className="text-[9px] h-4 font-normal">Upstash Redis</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Memory Used</p>
                                <p className="text-sm font-mono font-bold text-foreground">{formatBytes(stats?.redis?.usedMemory)}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Live Clients</p>
                                <p className="text-sm font-mono font-bold text-foreground">{stats?.redis?.connectedClients}</p>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-muted/50 flex items-center justify-between">
                            <p className="text-[10px] text-muted-foreground">Total Requests Received</p>
                            <span className="text-xs font-mono font-semibold">{stats?.redis?.totalConnections.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Global Cloudinary - Only show if credentials found */}
                {stats?.cloudinary && (
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                                        <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <CardTitle className="text-sm font-bold">Global Assets</CardTitle>
                                </div>
                                {stats?.cloudinary?.plan && (
                                    <Badge variant="secondary" className="text-[9px] h-4 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-none">
                                        {stats.cloudinary.plan}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] uppercase font-semibold text-muted-foreground">
                                    <span>Storage</span>
                                    <span className="font-mono">{formatMB(stats?.cloudinary?.used)} / {formatMB(stats?.cloudinary?.total)}</span>
                                </div>
                                <Progress value={(stats?.cloudinary?.total > 0 ? (stats?.cloudinary?.used / stats?.cloudinary?.total) : 0) * 100} className="h-1" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] uppercase font-semibold text-muted-foreground">
                                    <span>Bandwidth</span>
                                    <span className="font-mono">{formatMB(stats?.cloudinary?.bandwidth?.used)} / {formatMB(stats?.cloudinary?.bandwidth?.total)}</span>
                                </div>
                                <Progress value={(stats?.cloudinary?.bandwidth?.total > 0 ? (stats?.cloudinary?.bandwidth?.used / stats?.cloudinary?.bandwidth?.total) : 0) * 100} className="h-1" />
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
}
