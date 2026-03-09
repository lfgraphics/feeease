import dbConnect from "@/lib/db";
import School from "@/models/School";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function LicensesPage() {
  await dbConnect();
  // Fetch schools with active licenses
  const schools = await School.find({ "license.licenseKey": { $exists: true, $ne: null } }).sort({ "license.expiresAt": 1 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Licenses</h1>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Active Licenses</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>School</TableHead>
                        <TableHead>License Key</TableHead>
                        <TableHead>Issued At</TableHead>
                        <TableHead>Expires At</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schools.map((school) => (
                        <TableRow key={school._id.toString()}>
                            <TableCell className="font-medium">{school.name}</TableCell>
                            <TableCell className="font-mono text-xs">{school.license.licenseKey}</TableCell>
                            <TableCell>{school.license.issuedAt ? new Date(school.license.issuedAt).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>{school.license.expiresAt ? new Date(school.license.expiresAt).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>
                                <Badge variant={school.license.status === 'active' ? 'default' : 'destructive'}>
                                    {school.license.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                    {schools.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                No active licenses found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
