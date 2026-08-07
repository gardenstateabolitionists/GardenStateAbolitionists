'use client';

import { useUserStore } from '@/store/use-user';

export default function AppHeader() {
  const { user } = useUserStore();

  return (
    <div className="border-b bg-white h-14 px-3 sm:px-4 flex items-center justify-between gap-2 min-w-0">
      <h1 className="text-base sm:text-lg font-semibold truncate">Admin Dashboard</h1>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm text-gray-500 hidden sm:inline truncate max-w-[200px]">
          {user?.email || 'Admin'}
        </span>
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
          {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
        </div>
      </div>
    </div>
  );
}
