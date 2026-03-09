import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { EditUserDialog } from "@/components/admin/EditUserDialog";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  
  // Ensure we sort by latest created
  const users = await AdminUser.find({}).sort({ createdAt: -1 });
  
  const isSuperAdmin = session?.user?.role === "super_admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
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
                        {isSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id.toString()}>
                            <TableCell className="font-medium">{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="capitalize">{user.role?.replace('_', ' ')}</TableCell>
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
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
