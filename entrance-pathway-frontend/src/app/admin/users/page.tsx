"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { DataTable, Column, ConfirmDialog } from "@/components/molecules/admin";
import { Users, MoreHorizontal, Shield, UserCheck, GraduationCap } from "lucide-react";
import { getUsers, updateUserRole, type User, type UserRole } from "@/actions";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [newRole, setNewRole] = React.useState<string>("");
  const [showRoleDialog, setShowRoleDialog] = React.useState(false);
  const [updatingRole, setUpdatingRole] = React.useState(false);

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    const result = await getUsers({
      role: roleFilter === "all" ? undefined : (roleFilter as UserRole),
      limit: 50,
    });
    if (result.success) {
      setUsers(result.data);
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setLoading(false);
  }, [roleFilter, toast]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = (user: User, role: string) => {
    setSelectedUser(user);
    setNewRole(role);
    setShowRoleDialog(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    setUpdatingRole(true);
    const result = await updateUserRole(selectedUser.id, newRole as UserRole);
    if (result.success) {
      toast({
        title: "Role updated",
        description: `User role has been changed to ${newRole}`,
      });
      setShowRoleDialog(false);
      loadUsers();
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
    setUpdatingRole(false);
  };

  // Filter by search
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns: Column<User>[] = [
    {
      key: "user",
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName || "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (user) => (
        <div className="flex items-center gap-2">
          {user.role === "admin" && <Shield className="w-4 h-4 text-red-500" />}
          {user.role === "mentor" && <UserCheck className="w-4 h-4 text-blue-500" />}
          {user.role === "student" && <GraduationCap className="w-4 h-4 text-green-500" />}
          <span className="capitalize">{user.role}</span>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cell: (user) => user.phone || "-",
    },
    {
      key: "createdAt",
      header: "Joined",
      cell: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleRoleChange(user, "student")}
              disabled={user.role === "student"}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Make Student
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleChange(user, "mentor")}
              disabled={user.role === "mentor"}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Make Mentor
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleRoleChange(user, "admin")}
              disabled={user.role === "admin"}
              className="text-red-600"
            >
              <Shield className="w-4 h-4 mr-2" />
              Make Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            User Management
          </Title>
          <Paragraph className="text-muted-foreground">
            Manage user accounts and roles
          </Paragraph>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="mentor">Mentors</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={filteredUsers}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search users..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            emptyMessage="No users found"
          />
        </CardContent>
      </Card>

      {/* Role Change Confirmation Dialog */}
      <ConfirmDialog
        open={showRoleDialog}
        onOpenChange={setShowRoleDialog}
        title="Change User Role"
        description={`Are you sure you want to change ${selectedUser?.fullName}'s role to ${newRole}? This will affect their permissions and access.`}
        confirmLabel="Change Role"
        onConfirm={confirmRoleChange}
        loading={updatingRole}
      />
    </div>
  );
}
