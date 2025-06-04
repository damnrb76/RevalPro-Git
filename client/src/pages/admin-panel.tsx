import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Shield, Users, BarChart3, Settings, Crown, 
  Search, Eye, Edit, Trash2, Plus, AlertTriangle 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatDateFull } from "@/lib/date-utils";

interface AdminUser {
  id: number;
  username: string;
  email: string | null;
  currentPlan: string;
  subscriptionStatus: string;
  created: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

interface BetaApplication {
  id: number;
  name: string;
  email: string;
  nmcPin: string;
  nursingSpecialty: string;
  workLocation: string;
  experience: string;
  currentChallenges: string;
  expectations: string;
  testingAvailability: string;
  agreeToTerms: boolean;
  allowContact: boolean;
  submittedAt: string;
}

interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  standardUsers: number;
  premiumUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Check if user has admin access
  if (!user?.isSuperAdmin && !user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch admin statistics
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.isSuperAdmin || !!user?.isAdmin,
  });

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isSuperAdmin || !!user?.isAdmin,
  });

  // Filter users based on search term
  const filteredUsers = users?.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const updateUserPlan = useMutation({
    mutationFn: async ({ userId, plan }: { userId: number; plan: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/plan`, { plan });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "User Updated",
        description: "User subscription plan has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update user subscription plan.",
        variant: "destructive",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "User Deleted",
        description: "User has been permanently deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    },
  });

  const handlePlanUpdate = (userId: number, newPlan: string) => {
    updateUserPlan.mutate({ userId, plan: newPlan });
  };

  const handleDeleteUser = (userId: number, username: string) => {
    if (userId === user?.id) {
      toast({
        title: "Cannot Delete",
        description: "You cannot delete your own account.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      deleteUser.mutate(userId);
    }
  };

  const getPlanBadge = (plan: string) => {
    const variants = {
      free: "secondary",
      standard: "default", 
      premium: "destructive"
    } as const;
    
    return (
      <Badge variant={variants[plan as keyof typeof variants] || "secondary"}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-revalpro-blue" />
        <div>
          <h1 className="text-3xl font-bold text-revalpro-blue">Admin Panel</h1>
          <p className="text-muted-foreground">
            {user?.isSuperAdmin ? "Super Administrator" : "Administrator"} Dashboard
          </p>
        </div>
        {user?.isSuperAdmin && (
          <Crown className="h-6 w-6 text-yellow-500 ml-auto" />
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {statsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-revalpro-blue" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Premium Users</p>
                      <p className="text-3xl font-bold">{stats?.premiumUsers || 0}</p>
                    </div>
                    <Crown className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                      <p className="text-3xl font-bold">{stats?.activeSubscriptions || 0}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      <p className="text-3xl font-bold">£{stats?.totalRevenue || 0}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-revalpro-blue" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts, subscriptions, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {usersLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email || "—"}</TableCell>
                          <TableCell>{getPlanBadge(user.currentPlan)}</TableCell>
                          <TableCell>
                            <Badge variant={user.subscriptionStatus === "active" ? "default" : "secondary"}>
                              {user.subscriptionStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDateFull(new Date(user.created))}</TableCell>
                          <TableCell>
                            {user.isSuperAdmin ? (
                              <Badge variant="destructive">Super Admin</Badge>
                            ) : user.isAdmin ? (
                              <Badge variant="default">Admin</Badge>
                            ) : (
                              <Badge variant="secondary">User</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Select
                                value={user.currentPlan}
                                onValueChange={(newPlan) => handlePlanUpdate(user.id, newPlan)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="free">Free</SelectItem>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="premium">Premium</SelectItem>
                                </SelectContent>
                              </Select>
                              {!user.isSuperAdmin && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id, user.username)}
                                  disabled={deleteUser.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="font-medium text-blue-900 mb-2">Admin Privileges</h3>
                  <p className="text-sm text-blue-800">
                    {user?.isSuperAdmin 
                      ? "You have full super administrator access to all system functions."
                      : "You have administrator access with user management capabilities."
                    }
                  </p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">User Registration</h4>
                      <p className="text-sm text-muted-foreground">
                        New user registration is currently enabled.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Subscription Plans</h4>
                      <p className="text-sm text-muted-foreground">
                        All subscription tiers are active and available.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}