'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Library, ShoppingBag, Settings, Heart,
  Loader2, LogOut, Camera, Save, Key,
  Package, Calendar, CheckCircle2, Clock, XCircle,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  items?: JsonOrderItem[];
}

interface JsonOrderItem {
  game_id?: string;
  title?: string;
  name?: string;
  price?: number;
  poster_url?: string;
  image_url?: string;
}

interface WishlistGame {
  id: string;
  title: string;
  price: number;
  discount_price: number | null;
  poster_url: string | null;
}

interface WishlistItem {
  id: string;
  game_id: string;
  games: WishlistGame | null;
}

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="w-3.5 h-3.5" />,
  pending: <Clock className="w-3.5 h-3.5" />,
  cancelled: <XCircle className="w-3.5 h-3.5" />,
  processing: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
};

export default function AccountPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [library, setLibrary] = useState<JsonOrderItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Profile settings state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileData) {
        setProfile(profileData);
        setNewUsername(profileData.username ?? '');
      }

      // Fetch orders (items stored as JSONB in orders.items)
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (ordersData) {
        setOrders(ordersData);
        // Library = unique games from completed orders (from JSONB items)
        const allItems: JsonOrderItem[] = ordersData
          .filter((o: Order) => o.status === 'completed')
          .flatMap((o: Order) => Array.isArray(o.items) ? o.items : []);
        const seen = new Set<string>();
        setLibrary(allItems.filter((item) => {
          const key = item.game_id ?? item.title ?? '';
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        }));
      }

      // Fetch wishlist joined with games
      const { data: wishlistData } = await supabase
        .from('wishlist')
        .select('id, game_id, games(id, title, price, discount_price, poster_url)')
        .eq('user_id', user.id);
      if (wishlistData) setWishlist(wishlistData as unknown as WishlistItem[]);

      setPageLoading(false);
    }
    init();
  }, []);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsMsg(null);
    setSettingsLoading(true);
    try {
      if (newUsername.trim() && newUsername.trim() !== profile?.username) {
        const { error } = await supabase
          .from('profiles')
          .update({ username: newUsername.trim() })
          .eq('id', user!.id);
        if (error) throw error;
        setProfile((p) => p ? { ...p, username: newUsername.trim() } : p);
      }

      if (newPassword) {
        if (newPassword !== confirmNewPassword) throw new Error('Passwords do not match.');
        if (newPassword.length < 6) throw new Error('Password must be at least 6 characters.');
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        setNewPassword('');
        setConfirmNewPassword('');
      }
      setSettingsMsg({ type: 'success', text: 'Settings saved successfully.' });
    } catch (err: any) {
      setSettingsMsg({ type: 'error', text: err.message ?? 'Failed to save.' });
    } finally {
      setSettingsLoading(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const avatarUrl = data.publicUrl;
      await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
      setProfile((p) => p ? { ...p, avatar_url: avatarUrl } : p);
    } catch (err: any) {
      console.error('Avatar upload failed:', err.message);
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleRemoveWishlist(wishlistId: string) {
    await supabase.from('wishlist').delete().eq('id', wishlistId);
    setWishlist((w) => w.filter((item) => item.id !== wishlistId));
  }

  async function handleSignOut() {
    setSignOutLoading(true);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  if (pageLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#080c14]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const displayName = profile?.username ?? user?.email?.split('@')[0] ?? 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#080c14] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 bg-[#0d1117] border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-cyan-500/30">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-cyan-500/10 text-cyan-400 text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center hover:bg-cyan-400 transition-colors"
              >
                {avatarUploading
                  ? <Loader2 className="w-3 h-3 animate-spin text-black" />
                  : <Camera className="w-3 h-3 text-black" />
                }
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{displayName}</h1>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Member since {new Date(user?.created_at ?? '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5 gap-2"
            onClick={handleSignOut}
            disabled={signOutLoading}
          >
            {signOutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Sign Out
          </Button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="library" className="space-y-6">
            <TabsList className="bg-[#0d1117] border border-slate-800 p-1 rounded-xl w-full grid grid-cols-4 h-auto">
              {[
                { value: 'library', label: 'My Library', icon: Library },
                { value: 'orders', label: 'Order History', icon: ShoppingBag },
                { value: 'settings', label: 'Settings', icon: Settings },
                { value: 'wishlist', label: 'Wishlist', icon: Heart },
              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center gap-2 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/20 text-slate-400 rounded-lg py-2.5 text-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* MY LIBRARY */}
            <TabsContent value="library">
              <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Library className="w-5 h-5 text-cyan-400" />
                  My Library
                  <Badge className="ml-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{library.length}</Badge>
                </h2>
                {library.length === 0 ? (
                  <EmptyState
                    icon={<Package className="w-10 h-10 text-slate-600" />}
                    title="No games yet"
                    description="Complete a purchase to see your games here."
                    action={{ label: 'Browse Store', href: '/store' }}
                  />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {library.map((item, idx) => {
                      const gameName = item.title ?? item.name ?? 'Unknown Game';
                      const imgUrl = item.poster_url ?? item.image_url;
                      return (
                        <div
                          key={item.game_id ?? idx}
                          className="group bg-[#080c14] border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-colors"
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={gameName}
                              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full aspect-video bg-slate-800 flex items-center justify-center">
                              <Package className="w-8 h-8 text-slate-600" />
                            </div>
                          )}
                          <div className="p-3">
                            <p className="text-sm font-medium text-slate-200 line-clamp-1">{gameName}</p>
                            <p className="text-xs text-green-400 mt-0.5">Owned</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ORDER HISTORY */}
            <TabsContent value="orders">
              <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-cyan-400" />
                  Order History
                  <Badge className="ml-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{orders.length}</Badge>
                </h2>
                {orders.length === 0 ? (
                  <EmptyState
                    icon={<ShoppingBag className="w-10 h-10 text-slate-600" />}
                    title="No orders yet"
                    description="Your purchase history will appear here."
                    action={{ label: 'Shop Now', href: '/store' }}
                  />
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const orderItems: JsonOrderItem[] = Array.isArray(order.items) ? order.items : [];
                      return (
                        <div
                          key={order.id}
                          className="bg-[#080c14] border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-medium text-slate-200">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric', month: 'short', day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${STATUS_COLORS[order.status] ?? STATUS_COLORS.pending}`}
                              >
                                {STATUS_ICONS[order.status] ?? STATUS_ICONS.pending}
                                {order.status}
                              </span>
                              <span className="text-sm font-bold text-white">
                                ${order.total_amount?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {orderItems.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {orderItems.map((item, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full"
                                >
                                  {item.title ?? item.name ?? 'Game'}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* PROFILE SETTINGS */}
            <TabsContent value="settings">
              <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  Profile Settings
                </h2>
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-lg">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-300">Username</Label>
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Your username"
                      className="bg-[#080c14] border-slate-700 text-slate-200 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500 h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Email</Label>
                    <Input
                      value={user?.email ?? ''}
                      readOnly
                      className="bg-[#080c14] border-slate-700 text-slate-400 cursor-not-allowed h-11"
                    />
                    <p className="text-xs text-slate-500">Email cannot be changed from here.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-[#0d1117] text-slate-500 flex items-center gap-1">
                        <Key className="w-3 h-3" /> Change Password
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-[#080c14] border-slate-700 text-slate-200 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500 h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword" className="text-slate-300">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="bg-[#080c14] border-slate-700 text-slate-200 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500 h-11"
                    />
                  </div>

                  {settingsMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-sm px-3 py-2 rounded-lg border ${
                        settingsMsg.type === 'success'
                          ? 'text-green-400 bg-green-500/10 border-green-500/20'
                          : 'text-red-400 bg-red-500/10 border-red-500/20'
                      }`}
                    >
                      {settingsMsg.text}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold gap-2 h-11"
                    disabled={settingsLoading}
                  >
                    {settingsLoading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Save className="w-4 h-4" />
                    }
                    Save Changes
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* WISHLIST */}
            <TabsContent value="wishlist">
              <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-cyan-400" />
                  Wishlist
                  <Badge className="ml-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{wishlist.length}</Badge>
                </h2>
                {wishlist.length === 0 ? (
                  <EmptyState
                    icon={<Heart className="w-10 h-10 text-slate-600" />}
                    title="Your wishlist is empty"
                    description="Save games you want to buy later."
                    action={{ label: 'Explore Games', href: '/store' }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.map((item) => {
                      const game = item.games;
                      if (!game) return null;
                      const price = game.discount_price ?? game.price;
                      return (
                        <div
                          key={item.id}
                          className="group bg-[#080c14] border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-colors"
                        >
                          {game.poster_url && (
                            <img
                              src={game.poster_url}
                              alt={game.title}
                              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="p-3 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-200 truncate">{game.title}</p>
                              <p className="text-sm font-bold text-cyan-400 mt-0.5">${price.toFixed(2)}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveWishlist(item.id)}
                              className="flex-shrink-0 p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

function EmptyState({
  icon, title, description, action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4">{icon}</div>
      <p className="text-slate-300 font-medium mb-1">{title}</p>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      <a
        href={action.href}
        className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
      >
        {action.label}
      </a>
    </div>
  );
}
