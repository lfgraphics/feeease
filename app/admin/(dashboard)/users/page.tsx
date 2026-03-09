import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { Users } from "lucide-react";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  // Filter out the current user and sort by latest created
  // "the admins should not see their own profile in the user management"
  const users = await AdminUser.find({ 
      _id: { $ne: session?.user?.id } 
  }).sort({ createdAt: -1 });
  
  const isSuperAdmin = session?.user?.role === "super_admin";

  // "in the user management only the main admin should be able to edit and manage user others can only see"
  // "the middle admin (operations_admin) should be able to do anything except user management" -> so they can see but not edit

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        </div>
        {/* Only super_admin can create users */}
        {isSuperAdmin && <CreateUserDialog />}
      </div>

      <Card>
        <CardHeader>
            <CardTitle>System Administrators</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        {/* Only super_admin can see Actions column */}
                        {isSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={isSuperAdmin ? 6 : 5} className="text-center py-8 text-muted-foreground">
                                No other users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user._id.toString()}>
                                <TableCell className="font-medium">{user.fullName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="capitalize">
                                    <Badge variant="outline">{user.role?.replace('_', ' ')}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-'}
                                </TableCell>
                                {isSuperAdmin && (
                                    <TableCell className="text-right">
                                        <EditUserDialog 
                                            user={{
                                                _id: user._id.toString(),
                                                fullName: user.fullName,
                                                email: user.email,
                                                mobileNumber: user.mobileNumber,
                                                role: user.role,
                                                isActive: user.isActive
                                            }} 
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
