"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ROUTES } from "@/constants";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Bell,
  Palette,
  Zap,
  LogOut,
  ChevronRight,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNotificationsStore } from "@/stores/notifications";
import { validateEmail, validatePhone, validatePasswordStrength } from "@/utils/validation";
import { Check, AlertCircle } from "lucide-react";

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SETTINGS_TABS: SettingsTab[] = [
  {
    id: "profile",
    label: "Profile",
    icon: <User size={20} />,
    description: "Your personal information",
  },
  {
    id: "account",
    label: "Account",
    icon: <Lock size={20} />,
    description: "Security and account settings",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell size={20} />,
    description: "Manage notification preferences",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: <Palette size={20} />,
    description: "Theme and display settings",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: <Zap size={20} />,
    description: "Connected services and apps",
  },
];

const NOTIFICATION_PREFERENCES = [
  { key: "email_tasks", label: "Email when assigned to task", enabled: true },
  { key: "email_comments", label: "Email on comments", enabled: true },
  { key: "email_mentions", label: "Email when mentioned", enabled: true },
  { key: "email_updates", label: "Email on project updates", enabled: false },
  { key: "push_notifications", label: "Push notifications enabled", enabled: true },
  { key: "digest_weekly", label: "Weekly digest email", enabled: false },
];

const INTEGRATIONS = [
  {
    name: "Slack",
    description: "Send notifications to Slack channels",
    status: "connected",
    icon: "💬",
  },
  {
    name: "GitHub",
    description: "Link tasks to GitHub issues and pull requests",
    status: "connected",
    icon: "🐙",
  },
  {
    name: "Google Calendar",
    description: "Sync tasks with Google Calendar",
    status: "not_connected",
    icon: "📅",
  },
  {
    name: "Microsoft Teams",
    description: "Share updates with your Teams channels",
    status: "not_connected",
    icon: "👥",
  },
];

function SettingsContent() {
  const router = useRouter();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState(NOTIFICATION_PREFERENCES);
  const [theme, setTheme] = useState("dark");
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" });
  const [newPassword, setNewPassword] = useState("");
  const [deleteCountdown, setDeleteCountdown] = useState(3);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    role: "Owner",
    department: "Engineering",
    bio: "Product engineer passionate about building great tools",
  });

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("flowpilot_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || formData);
        setTheme(parsed.theme || "dark");
        setNotifications(parsed.notifications || NOTIFICATION_PREFERENCES);
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
  }, []);

  // Mark as unsaved when form changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [formData, notifications, theme]);

  // Countdown timer for delete confirmation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showDeleteConfirm && deleteCountdown > 0) {
      timer = setTimeout(() => setDeleteCountdown(deleteCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showDeleteConfirm, deleteCountdown]);

  const validateProfileForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Please fix the errors in your profile before saving",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save to localStorage
      const settings = {
        formData,
        theme,
        notifications,
      };
      localStorage.setItem("flowpilot_settings", JSON.stringify(settings));

      setHasUnsavedChanges(false);
      addNotification({
        type: "success",
        title: "Profile Updated",
        message: "Your profile changes have been saved successfully",
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Save Failed",
        message: "Failed to save your profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTheme = () => {
    const settings = {
      formData,
      theme,
      notifications,
    };
    localStorage.setItem("flowpilot_settings", JSON.stringify(settings));

    addNotification({
      type: "success",
      title: "Theme Updated",
      message: `Theme changed to ${theme} mode`,
    });
  };

  const handleConfirmLogout = () => {
    // Clear localStorage
    localStorage.removeItem("flowpilot_auth");
    localStorage.removeItem("flowpilot_token");

    addNotification({
      type: "info",
      title: "Logged Out",
      message: "You have been logged out successfully",
    });

    // Redirect to login
    setTimeout(() => router.push("/login"), 500);
  };

  const handleConfirmDelete = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.removeItem("flowpilot_auth");
      localStorage.removeItem("flowpilot_token");
      localStorage.removeItem("flowpilot_settings");

      addNotification({
        type: "info",
        title: "Account Deleted",
        message: "Your account has been permanently deleted",
      });

      setTimeout(() => router.push("/login"), 500);
    } catch (error) {
      addNotification({
        type: "error",
        title: "Deletion Failed",
        message: "Failed to delete your account. Please try again.",
      });
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const toggleNotification = (key: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.key === key ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-secondary-text">Manage your account and preferences</p>
            </div>
            {hasUnsavedChanges && (
              <div className="px-3 py-2 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                <p className="text-xs font-medium text-yellow-600">Unsaved changes</p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Layout */}
        <div className="flex gap-6 flex-1">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-1">
              {SETTINGS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? "bg-black/10 text-primary-text border-l-4 border-primary-text"
                      : "text-secondary-text hover:text-primary-text hover:bg-card-bg"
                  }`}
                >
                  <div className="mt-0.5">{tab.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{tab.label}</p>
                    <p className="text-xs text-secondary-text">{tab.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-lg text-primary-text hover:bg-red-600/10 transition-colors"
            >
              <LogOut size={20} />
              <div className="text-left">
                <p className="font-medium">Logout</p>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Profile Picture */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-white text-3xl font-bold">
                        JD
                      </div>
                      <div className="space-y-2">
                        <Button className="flex items-center gap-2">
                          <Camera size={16} />
                          Upload Photo
                        </Button>
                        <p className="text-xs text-secondary-text">JPG, PNG, or GIF. Max 2MB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-text mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (errors.fullName) {
                            setErrors({ ...errors, fullName: "" });
                          }
                        }}
                        className={`w-full px-3 py-2 bg-secondary-bg border rounded-lg text-primary-text focus:outline-none focus:border-primary-text ${
                          errors.fullName ? "border-red-600" : "border-border"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-text mb-2">
                          <Mail size={14} className="inline mr-1" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-secondary-text opacity-50"
                        />
                        <p className="text-xs text-secondary-text mt-1">Cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-text mb-2">
                          <Phone size={14} className="inline mr-1" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (errors.phone) {
                              setErrors({ ...errors, phone: "" });
                            }
                          }}
                          className={`w-full px-3 py-2 bg-secondary-bg border rounded-lg text-primary-text focus:outline-none focus:border-primary-text ${
                            errors.phone ? "border-red-600" : "border-border"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-text mb-2">
                        <MapPin size={14} className="inline mr-1" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => {
                          setFormData({ ...formData, location: e.target.value });
                          if (errors.location) {
                            setErrors({ ...errors, location: "" });
                          }
                        }}
                        className={`w-full px-3 py-2 bg-secondary-bg border rounded-lg text-primary-text focus:outline-none focus:border-primary-text ${
                          errors.location ? "border-red-600" : "border-border"
                        }`}
                      />
                      {errors.location && (
                        <p className="text-xs text-red-600 mt-1">{errors.location}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-text mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Work Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Work Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-secondary-text mb-1">Role</p>
                        <p className="font-medium text-primary-text">{formData.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-text mb-1">Department</p>
                        <p className="font-medium text-primary-text">{formData.department}</p>
                      </div>
                    </div>
                    <p className="text-xs text-secondary-text">Contact your workspace admin to change role or department</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-text mb-2">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-text mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          const strength = validatePasswordStrength(e.target.value);
                          setPasswordStrength(strength);
                        }}
                        className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                      />
                      {newPassword && (
                        <div className="mt-3 space-y-2">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full ${
                                  i < passwordStrength.score
                                    ? passwordStrength.score <= 1
                                      ? "bg-red-600"
                                      : passwordStrength.score <= 2
                                      ? "bg-yellow-600"
                                      : passwordStrength.score <= 3
                                      ? "bg-blue-600"
                                      : "bg-green-600"
                                    : "bg-secondary-bg"
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-xs font-medium ${
                            passwordStrength.score <= 1
                              ? "text-red-600"
                              : passwordStrength.score <= 2
                              ? "text-yellow-600"
                              : passwordStrength.score <= 3
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}>
                            Password Strength: {passwordStrength.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-text mb-2">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                      />
                    </div>
                    <Button disabled={!newPassword || passwordStrength.score < 2}>
                      Update Password
                    </Button>
                    {newPassword && passwordStrength.score < 2 && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        Password must be at least {passwordStrength.score === 0 ? "stronger (8+ characters with mixed case)" : "stronger (add numbers and symbols)"}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-secondary-text">Two-factor authentication is not currently enabled.</p>
                    <Button variant="secondary">Enable 2FA</Button>
                  </CardContent>
                </Card>

                <Card className="border-red-600/20">
                  <CardHeader>
                    <CardTitle className="text-red-600">Delete Account</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-secondary-text mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button
                      variant="danger"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isSaving}
                    >
                      {isSaving ? "Deleting..." : "Delete Account"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {notifications.map((notif) => (
                      <div key={notif.key} className="flex items-center justify-between p-3 bg-secondary-bg rounded-lg">
                        <label className="text-sm font-medium text-primary-text cursor-pointer">{notif.label}</label>
                        <button
                          onClick={() => toggleNotification(notif.key)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notif.enabled ? "bg-black" : "bg-border"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                              notif.enabled ? "translate-x-6" : ""
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-secondary-text">Set your quiet hours to avoid notifications during specific times.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-text mb-2">Start Time</label>
                        <input
                          type="time"
                          defaultValue="22:00"
                          className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-text mb-2">End Time</label>
                        <input
                          type="time"
                          defaultValue="08:00"
                          className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Theme</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {["light", "dark", "system"].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => {
                          setTheme(themeOption);
                          const settings = {
                            formData,
                            theme: themeOption,
                            notifications,
                          };
                          localStorage.setItem("flowpilot_settings", JSON.stringify(settings));
                          addNotification({
                            type: "success",
                            title: "Theme Updated",
                            message: `Theme changed to ${themeOption} mode`,
                          });
                        }}
                        className={`w-full p-4 rounded-lg border-2 transition-colors text-left capitalize ${
                          theme === themeOption
                            ? "border-primary-text bg-black/5"
                            : "border-border hover:border-primary-text/50"
                        }`}
                      >
                        <p className="font-medium text-primary-text">{themeOption} Mode</p>
                        <p className="text-xs text-secondary-text mt-1">
                          {themeOption === "light" && "Always use light theme"}
                          {themeOption === "dark" && "Always use dark theme"}
                          {themeOption === "system" && "Follow system preferences"}
                        </p>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compact Mode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-3 bg-secondary-bg rounded-lg">
                      <label className="text-sm font-medium text-primary-text cursor-pointer">Enable compact view</label>
                      <button className="relative w-12 h-6 rounded-full bg-border">
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {INTEGRATIONS.map((integration) => (
                      <div
                        key={integration.name}
                        className="p-4 border border-border rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{integration.icon}</span>
                            <h3 className="font-semibold text-primary-text">{integration.name}</h3>
                          </div>
                          <p className="text-sm text-secondary-text">{integration.description}</p>
                        </div>
                        <Badge
                          variant={integration.status === "connected" ? "primary" : "secondary"}
                          className="capitalize"
                        >
                          {integration.status.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Confirm Logout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-secondary-text">Are you sure you want to logout?</p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => setShowLogoutConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      handleConfirmLogout();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-96 border-red-600/30 bg-card-bg">
              <CardHeader>
                <CardTitle className="text-red-600">Delete Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
                  <p className="text-red-600 font-semibold mb-2 text-sm">
                    ⚠️ This action cannot be undone.
                  </p>
                  <p className="text-secondary-text text-xs">
                    All your data will be permanently deleted from our servers.
                  </p>
                </div>

                {deleteCountdown > 0 && (
                  <div className="p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                    <p className="text-xs text-yellow-600">
                      Please wait <span className="font-bold">{deleteCountdown}</span> second{deleteCountdown !== 1 ? 's' : ''} before confirming deletion
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-secondary-text text-sm mb-2">
                    Type your email to confirm:
                  </p>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteCountdown(3);
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleConfirmDelete}
                    disabled={isSaving || deleteCountdown > 0}
                  >
                    {isSaving ? "Deleting..." : deleteCountdown > 0 ? `Delete (${deleteCountdown}s)` : "Delete My Account"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
