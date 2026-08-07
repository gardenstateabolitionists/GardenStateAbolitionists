'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Newspaper, FileText, ImageIcon, RefreshCw, ArrowUpRight, Users, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PinDialog } from '@/components/ui/pin-dialog';
import Link from 'next/link';
import { getDashboardStats, exportAllData } from '@/lib/actions/dashboard-actions';
import { DashboardStats } from '@/types';

const quickActions = [
  {
    icon: Mail,
    label: 'View Inquiries',
    href: '/admin/dashboard/inquiries',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: Newspaper,
    label: 'Manage News',
    href: '/admin/dashboard/news',
    color: 'bg-green-500/10 text-green-600',
  },
  {
    icon: FileText,
    label: 'View Petitions',
    href: '/admin/dashboard/petitions',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    icon: ImageIcon,
    label: 'Manage Gallery',
    href: '/admin/dashboard/gallery',
    color: 'bg-orange-500/10 text-orange-600',
  },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [error, setError] = useState(false);

  const stats = [
    {
      title: 'Total Inquiries',
      value: data?.totalInquiries ?? 0,
      description: 'Contact form submissions',
      icon: <Mail size={20} />,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Pending Inquiries',
      value: data?.pendingInquiries ?? 0,
      description: 'Awaiting response',
      icon: <Mail size={20} />,
      color: 'bg-yellow-500/10 text-yellow-600',
    },
    {
      title: 'News Articles',
      value: data?.totalNews ?? 0,
      description: 'Published and draft articles',
      icon: <Newspaper size={20} />,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Petition Signatures',
      value: data?.totalSignatures ?? 0,
      description: 'People who signed the petition',
      icon: <FileText size={20} />,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Gallery Photos',
      value: data?.totalPhotos ?? 0,
      description: 'Photos in the media gallery',
      icon: <ImageIcon size={20} />,
      color: 'bg-orange-500/10 text-orange-600',
    },
    {
      title: 'Subscribers',
      value: data?.totalSubscribers ?? 0,
      description: 'Newsletter subscribers',
      icon: <Users size={20} />,
      color: 'bg-teal-500/10 text-teal-600',
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getDashboardStats();
      if ('error' in res) {
        setError(true);
      } else {
        setData(res);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const res = await exportAllData();
      if ('error' in res) {
        alert(res.error);
        return;
      }

      const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
      const date = new Date().toISOString().split('T')[0];
      const fmtDate = (d?: Date | string) => d ? new Date(d).toLocaleDateString() : '';

      const sections: string[] = [];

      // Inquiries
      sections.push('INQUIRIES');
      sections.push(['Name', 'Email', 'Subject', 'Message', 'Status', 'Date'].map(q).join(','));
      res.inquiries.forEach((i) => {
        sections.push([i.name, i.email, i.subject || '', i.message, i.status, fmtDate(i.created_at)].map(q).join(','));
      });

      sections.push('');

      // News Articles
      sections.push('NEWS ARTICLES');
      sections.push(['Title', 'Slug', 'Excerpt', 'Published', 'Created', 'Updated'].map(q).join(','));
      res.articles.forEach((a) => {
        sections.push([a.title, a.slug, a.excerpt, a.published ? 'Yes' : 'No', fmtDate(a.created_at), fmtDate(a.updated_at)].map(q).join(','));
      });

      sections.push('');

      // Petition Signatures
      sections.push('PETITION SIGNATURES');
      sections.push(['Name', 'Email', 'City', 'State', 'Zip Code', 'Subscribed', 'Date Signed'].map(q).join(','));
      res.signatures.forEach((s) => {
        sections.push([s.name, s.email, s.city || '', s.state || '', s.zipcode || '', s.subscribed ? 'Yes' : 'No', fmtDate(s.created_at)].map(q).join(','));
      });

      sections.push('');

      // Gallery Photos
      sections.push('GALLERY PHOTOS');
      sections.push(['URL', 'Caption', 'Sort Order', 'Date Added'].map(q).join(','));
      res.photos.forEach((p) => {
        sections.push([p.url, p.caption || '', String(p.sortOrder || 0), fmtDate(p.created_at)].map(q).join(','));
      });

      const csv = sections.join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gsa-full-export-${date}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPinDialog(true)} disabled={exporting || loading} className="flex-shrink-0">
            <Download size={14} className={exporting ? 'animate-pulse' : ''} />
            <span className="ml-2 hidden sm:inline">{exporting ? 'Exporting...' : 'Export All'}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="flex-shrink-0">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 flex items-center justify-between">
          <p>Error fetching dashboard data. Please try again.</p>
          <Button variant="outline" size="sm" onClick={fetchData}>
            Retry
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href}>
              <div className="group flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <action.icon size={20} />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>{stat.icon}</div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-20 mb-1" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <PinDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        title="Confirm Data Export"
        description="Enter your admin PIN to export all site data."
        onVerified={handleExportAll}
        loading={exporting}
      />
    </div>
  );
}
