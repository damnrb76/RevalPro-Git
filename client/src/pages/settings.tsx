import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ui/theme-provider";
import { 
  AlertTriangle, Download, Upload, Trash2, 
  Moon, Sun, Info, Shield, User
} from "lucide-react";
import { 
  userProfileStorage, 
  exportAllData, 
  importData, 
  clearAllData,
  getSetting,
  setSetting
} from "@/lib/storage";
import { downloadRawData, downloadSummaryReport } from "@/lib/pdf-generator";
import UserProfileForm from "@/components/forms/user-profile-form";
import ProfileImageUploader from "@/components/profile/profile-image-uploader";
import type { UserProfile } from "@shared/schema";

export default function SettingsPage() {
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Get tab from URL if present, otherwise default to "profile"
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'profile';
  });
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  
  // Fetch user profile
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      return userProfileStorage.getCurrent();
    },
  });
  
  // Notification settings
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  
  // Load notification settings
  useQuery({
    queryKey: ['notificationSettings'],
    queryFn: async () => {
      const enabled = await getSetting('notificationsEnabled', true);
      setNotificationsEnabled(enabled);
      return enabled;
    },
  });
  
  const handleProfileFormClose = () => {
    setIsProfileFormOpen(false);
  };
  
  const handleProfileFormSuccess = () => {
    setIsProfileFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  const handleExportData = async () => {
    try {
      await downloadRawData();
      toast({
        title: "Data exported",
        description: "Your revalidation data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export data.",
        variant: "destructive",
      });
    }
  };
  
  const handleExportSummary = async () => {
    try {
      await downloadSummaryReport();
      toast({
        title: "Summary exported",
        description: "Your revalidation summary has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export summary.",
        variant: "destructive",
      });
    }
  };
  
  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    try {
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);
      
      await importData(data);
      
      queryClient.invalidateQueries();
      
      toast({
        title: "Data imported",
        description: "Your revalidation data has been imported successfully.",
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import data. Make sure the file format is correct.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset the input field
      event.target.value = '';
    }
  };
  
  const handleClearData = async () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      setIsClearing(true);
      
      try {
        await clearAllData();
        queryClient.invalidateQueries();
        
        toast({
          title: "Data cleared",
          description: "All your revalidation data has been cleared.",
        });
      } catch (error) {
        toast({
          title: "Clear failed",
          description: error instanceof Error ? error.message : "Failed to clear data.",
          variant: "destructive",
        });
      } finally {
        setIsClearing(false);
      }
    }
  };
  
  const toggleNotifications = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    await setSetting('notificationsEnabled', enabled);
    
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
      description: enabled 
        ? "You will receive notifications about your revalidation deadlines." 
        : "You will not receive notifications about your revalidation deadlines.",
    });
  };
  
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nhs-black">Settings</h1>
        <p className="text-nhs-dark-grey">Manage your profile and application settings</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-nhs-blue" />
                User Profile
              </CardTitle>
              <CardDescription>
                Manage your personal and registration details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProfile ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Image Column */}
                    <div className="flex flex-col items-center justify-start">
                      <ProfileImageUploader
                        currentImageUrl={userProfile.profileImage || null}
                        initials={userProfile.name.split(' ').map(n => n[0]).join('')}
                        onImageUpload={async (imageDataUrl) => {
                          try {
                            // Use the built-in method to update the profile image
                            await userProfileStorage.updateProfileImage(imageDataUrl);
                            
                            // Update the auth user data to show in header
                            const currentUser = queryClient.getQueryData(["/api/user"]);
                            if (currentUser) {
                              queryClient.setQueryData(["/api/user"], {
                                ...currentUser,
                                profilePicture: imageDataUrl
                              });
                            }
                            
                            // Refresh profile data
                            queryClient.invalidateQueries({queryKey: ['userProfile']});
                          } catch (error) {
                            console.error("Error updating profile image:", error);
                            throw error;
                          }
                        }}
                        onImageRemove={async () => {
                          try {
                            // Use the built-in method to remove the profile image
                            await userProfileStorage.removeProfileImage();
                            
                            // Update auth user data
                            const currentUser = queryClient.getQueryData(["/api/user"]);
                            if (currentUser) {
                              queryClient.setQueryData(["/api/user"], {
                                ...currentUser,
                                profilePicture: null
                              });
                            }
                            
                            // Refresh profile data
                            queryClient.invalidateQueries({queryKey: ['userProfile']});
                          } catch (error) {
                            console.error("Error removing profile image:", error);
                            throw error;
                          }
                        }}
                      />
                    </div>
                    
                    {/* Personal Details Column */}
                    <div>
                      <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Personal Details</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-x-2 text-sm">
                          <div className="text-nhs-dark-grey">Name:</div>
                          <div>{userProfile.name}</div>
                          
                          <div className="text-nhs-dark-grey">Email:</div>
                          <div>{userProfile.email || "Not provided"}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Registration Details Column */}
                    <div>
                      <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Registration Details</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-x-2 text-sm">
                          <div className="text-nhs-dark-grey">NMC PIN:</div>
                          <div>{userProfile.registrationNumber}</div>
                          
                          <div className="text-nhs-dark-grey">Expiry Date:</div>
                          <div>{new Date(userProfile.expiryDate).toLocaleDateString("en-GB")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <AlertTriangle className="mx-auto h-12 w-12 text-nhs-warm-yellow mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Profile Not Set Up</h3>
                  <p className="text-nhs-dark-grey mb-4">
                    You haven't set up your profile yet. Please add your details to track your revalidation progress.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setIsProfileFormOpen(true)}>
                {userProfile ? "Edit Profile" : "Set Up Profile"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Data Management */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export, import, or clear your revalidation data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Export Data</h3>
                <p className="text-sm text-nhs-dark-grey mb-4">
                  Export your revalidation data for backup or to transfer to another device.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Raw Data
                  </Button>
                  <Button variant="outline" onClick={handleExportSummary}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Summary
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Import Data</h3>
                <p className="text-sm text-nhs-dark-grey mb-4">
                  Import revalidation data from a previous export. This will replace all current data.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".json"
                    className="max-w-sm"
                    onChange={handleImportData}
                    disabled={isImporting}
                  />
                  <Button variant="outline" disabled={isImporting}>
                    {isImporting ? (
                      <>Importing...</>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Clear Data</h3>
                <p className="text-sm text-nhs-dark-grey mb-4">
                  Clear all your revalidation data. This action cannot be undone.
                </p>
                <Button variant="destructive" onClick={handleClearData} disabled={isClearing}>
                  {isClearing ? (
                    <>Clearing...</>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All Data
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-nhs-dark-grey">
                    Choose between light and dark mode
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={theme === "light" ? "bg-nhs-blue text-white" : ""}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={theme === "dark" ? "bg-nhs-blue text-white" : ""}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications</Label>
                  <p className="text-sm text-nhs-dark-grey">
                    Enable or disable notifications about revalidation deadlines
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={toggleNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Privacy */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-nhs-blue" />
                Privacy
              </CardTitle>
              <CardDescription>
                Information about data privacy and storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Local Data Storage</AlertTitle>
                <AlertDescription>
                  All your revalidation data is stored locally on your device using your browser's storage. 
                  No data is sent to or stored on remote servers.
                </AlertDescription>
              </Alert>
              
              <div>
                <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Data Storage</h3>
                <p className="text-sm text-nhs-dark-grey">
                  This application uses IndexedDB for data storage, which is a browser technology that 
                  allows for persistent storage of data on your device. The data remains on your device 
                  and is not synchronized with any remote servers.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Data Security</h3>
                <p className="text-sm text-nhs-dark-grey">
                  While your data is stored locally, it's important to note that other applications or 
                  users with access to your device may potentially access this data. For added security, 
                  we recommend:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-nhs-dark-grey">
                  <li>Using device encryption if available</li>
                  <li>Using strong passwords for your device</li>
                  <li>Regularly backing up your data using the export feature</li>
                  <li>Clearing your data when using shared devices</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-nhs-dark-grey mb-2">Disclaimer</h3>
                <p className="text-sm text-nhs-dark-grey">
                  This application is not affiliated with the Nursing & Midwifery Council (NMC). It is a 
                  tool designed to help nurses with their revalidation process but does not replace the 
                  official NMC guidance or requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* User Profile Form Dialog */}
      {isProfileFormOpen && (
        <UserProfileForm 
          initialData={userProfile as UserProfile}
          onClose={handleProfileFormClose}
          onSuccess={handleProfileFormSuccess}
        />
      )}
    </main>
  );
}
