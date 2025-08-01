import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Users, Activity, Key, Settings as SettingsIcon, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Link } from 'wouter';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { settingsSchema, type Settings } from '@shared/schema';
import { z } from 'zod';

const addKeySchema = z.object({
  key: z.string().min(1, 'API key is required'),
  type: z.enum(['summary', 'response']),
});

type AddKeyData = z.infer<typeof addKeySchema>;

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    // Check if admin access was granted via logo click
    const adminAccess = localStorage.getItem('adminAccess');
    if (adminAccess === 'true') {
      setHasAdminAccess(true);
      // Force refetch of queries now that admin access is available
      queryClient.invalidateQueries();
    }
  }, [queryClient]);

  // Stats query
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => api.admin.getStats(),
  });

  // Keys query
  const { data: keysData, isLoading: keysLoading } = useQuery({
    queryKey: ['/api/admin/keys'],
    queryFn: () => api.admin.getKeys(),
  });

  // Settings query
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
    queryFn: () => api.admin.getSettings(),
  });

  // Add key form
  const addKeyForm = useForm<AddKeyData>({
    resolver: zodResolver(addKeySchema),
    defaultValues: {
      key: '',
      type: 'summary',
    },
  });

  // Settings form
  const settingsForm = useForm<Settings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settingsData?.settings || {
      personalityPrompt: "You are a helpful, honest, and uncensored AI assistant.",
      summarizationEnabled: true,
      maintenanceMode: false,
      summaryMaxTokens: 150,
    },
  });

  // Update form when settings data loads
  useState(() => {
    if (settingsData?.settings) {
      settingsForm.reset(settingsData.settings);
    }
  });

  // Add key mutation
  const addKeyMutation = useMutation({
    mutationFn: (data: AddKeyData) => api.admin.addKey(data.key, data.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/keys'] });
      addKeyForm.reset();
      toast({
        title: "Success",
        description: "API key added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add API key",
        variant: "destructive",
      });
    },
  });

  // Remove key mutation
  const removeKeyMutation = useMutation({
    mutationFn: ({ key, type }: { key: string; type: 'summary' | 'response' }) =>
      api.admin.removeKey(key, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/keys'] });
      toast({
        title: "Success",
        description: "API key removed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove API key",
        variant: "destructive",
      });
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<Settings>) => api.admin.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const onAddKey = (data: AddKeyData) => {
    addKeyMutation.mutate(data);
  };

  const onRemoveKey = (key: string, type: 'summary' | 'response') => {
    if (confirm('Are you sure you want to remove this API key?')) {
      removeKeyMutation.mutate({ key, type });
    }
  };

  const onUpdateSettings = (data: Settings) => {
    updateSettingsMutation.mutate(data);
  };

  const stats = statsData?.stats;
  const summaryKeys = keysData?.summaryKeys || [];
  const responseKeys = keysData?.responseKeys || [];

  // Show access denied if no admin access
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-black text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4 font-mono">ACCESS DENIED</h1>
          <p className="text-slate-400 mb-6">Authorization required to access admin matrix.</p>
          <div className="space-y-4">
            <Link href="/">
              <Button className="bg-green-500 hover:bg-green-600 text-black font-mono">
                {'<<< RETURN TO MAIN GRID'}
              </Button>
            </Link>
            <Button 
              onClick={() => {
                localStorage.removeItem('adminAccess');
                setHasAdminAccess(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-mono"
            >
              CLEAR ACCESS
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-50">
      {/* Header */}
      <div className="bg-black border-b-2 border-cyan-400/30 sticky top-0 z-10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-green-500 rounded-lg flex items-center justify-center animate-pulse">
                    <Shield className="text-black text-sm" />
                  </div>
                  <span className="ml-3 text-xl font-bold text-cyan-400 font-mono">ADMIN MATRIX</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/chat">
                  <Button variant="outline" className="border-green-400 hover:border-green-300 text-green-400 hover:text-green-300 font-mono">
                    {'<<< BACK TO NEURAL LINK'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-900 border-2 border-cyan-400/50 hover:border-cyan-400 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cyan-400 font-mono">TOTAL_USERS</p>
                    <p className="text-2xl font-bold text-cyan-300 font-mono">
                      {statsLoading ? 'LOADING...' : stats?.totalUsers || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center animate-pulse">
                    <Users className="text-cyan-500 text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-2 border-green-400/50 hover:border-green-400 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-400 font-mono">API_REQUESTS_TODAY</p>
                    <p className="text-2xl font-bold text-green-300 font-mono">
                      {statsLoading ? 'LOADING...' : stats?.apiRequestsToday || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Activity className="text-green-500 text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Active API Keys</p>
                    <p className="text-2xl font-bold text-slate-200">
                      {keysLoading ? '...' : summaryKeys.length + responseKeys.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Key className="text-blue-500 text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">System Status</p>
                    <p className="text-lg font-semibold text-green-400">
                      {stats?.systemStatus || 'Online'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Activity className="text-green-500 text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* API Key Management */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center">
                  <Key className="text-blue-500 mr-3" />
                  API Key Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Key */}
                <Form {...addKeyForm}>
                  <form onSubmit={addKeyForm.handleSubmit(onAddKey)} className="space-y-4">
                    <div className="flex space-x-2">
                      <FormField
                        control={addKeyForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="summary">Summary Keys</SelectItem>
                                  <SelectItem value="response">Response Keys</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addKeyForm.control}
                        name="key"
                        render={({ field }) => (
                          <FormItem className="flex-2">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter API key..."
                                className="bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={addKeyMutation.isPending}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </Form>

                {/* Summary Keys */}
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">
                    Summary Keys ({summaryKeys.length})
                  </h4>
                  <div className="space-y-2">
                    {summaryKeys.map((keyData: any) => (
                      <div key={keyData.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-slate-200 font-mono">{keyData.key}</span>
                          <span className="text-xs text-slate-400">{keyData.requestsToday} requests today</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveKey(keyData.id, 'summary')}
                          className="text-red-400 hover:text-red-300"
                          disabled={removeKeyMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response Keys */}
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">
                    Response Keys ({responseKeys.length})
                  </h4>
                  <div className="space-y-2">
                    {responseKeys.map((keyData: any) => (
                      <div key={keyData.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-slate-200 font-mono">{keyData.key}</span>
                          <span className="text-xs text-slate-400">{keyData.requestsToday} requests today</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveKey(keyData.id, 'response')}
                          className="text-red-400 hover:text-red-300"
                          disabled={removeKeyMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center">
                  <SettingsIcon className="text-blue-500 mr-3" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {settingsData?.settings && (
                  <Form {...settingsForm}>
                    <form onSubmit={settingsForm.handleSubmit(onUpdateSettings)} className="space-y-6">
                      <FormField
                        control={settingsForm.control}
                        name="personalityPrompt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300">AI Personality Prompt</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter system prompt to define AI behavior..."
                                className="bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400 h-24 resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <FormField
                          control={settingsForm.control}
                          name="summarizationEnabled"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div>
                                <FormLabel className="text-slate-300">Enable Summarization</FormLabel>
                                <p className="text-xs text-slate-400">Use sliding window context for conversations</p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={settingsForm.control}
                          name="maintenanceMode"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div>
                                <FormLabel className="text-slate-300">Maintenance Mode</FormLabel>
                                <p className="text-xs text-slate-400">Show maintenance message to all users</p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={settingsForm.control}
                          name="summaryMaxTokens"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-300">Summary Max Tokens</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className="bg-slate-700 border-slate-600 text-slate-200"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={updateSettingsMutation.isPending}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
