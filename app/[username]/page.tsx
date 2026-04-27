import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  category: string;
  image_url: string | null;
}

// Platform icons as SVG
const PlatformIcon = ({ platform, className }: { platform: string; className?: string }) => {
  const iconPaths: Record<string, string> = {
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.15-.672.149-.198.297-.771.967-.945 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.15-.174.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.149-.672-1.62-.921-2.218-.242-.582-.488-.504-.672-.513-.174-.008-.372-.01-.57-.01-.198 0-.52.074-.792.371-.272.297-1.04 1.016-1.04 2.475 0 1.46 1.062 2.87 1.21 3.07.148.198 2.09 3.19 5.06 4.47.708.305 1.26.487 1.69.624.71.228 1.356.196 1.868.119.57-.086 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.304 0-9.6-4.296-9.6-9.6 0-5.304 4.296-9.6 9.6-9.6 5.304 0 9.6 4.296 9.6 9.6 0 5.304-4.296 9.6-9.6 9.6z",
    email: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    phone: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
    snapchat: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm5-5c-.6.6-1.4.9-2.3.9-.3 0-.6-.1-.9-.2-.3.4-.7.7-1.1.9-.4.2-.9.3-1.4.3-.5 0-1-.1-1.4-.3-.4-.2-.8-.5-1.1-.9-.3.1-.6.2-.9.2-.9 0-1.7-.3-2.3-.9-.3-.3-.4-.7-.3-1.1.1-.4.4-.7.8-.9.2-.1.4-.2.6-.2.2 0 .3-.1.4-.2.1-.1.1-.3.1-.4 0-.2-.1-.4-.3-.5-.2-.1-.4-.1-.6-.1-.3 0-.6.1-.8.2-.1.1-.2.1-.3 0-.1-.1 0-.2.1-.3.4-.3.9-.5 1.4-.5.2 0 .3-.1.4-.2.1-.1.1-.2.1-.4 0-.2-.1-.4-.2-.5-.4-.4-.6-.9-.6-1.5 0-1.4 1.1-2.5 2.5-2.5.3 0 .6.1.9.2.2.1.4.1.6.1.3 0 .5 0 .8-.1.3-.1.6-.2.9-.2 1.4 0 2.5 1.1 2.5 2.5 0 .6-.2 1.1-.6 1.5-.1.1-.2.3-.2.5 0 .2.1.3.2.4.1.1.2.2.4.2.5 0 1 .2 1.4.5.1.1.2.2.1.3-.1.1-.2.1-.3 0-.2-.1-.5-.2-.8-.2-.2 0-.4 0-.6.1-.2.1-.3.3-.3.5 0 .1 0 .3.1.4.1.1.2.2.4.2.2 0 .4.1.6.2.4.2.7.5.8.9.1.4 0 .8-.3 1.1z",
    pinterest: "M12 2C6.48 2 2 6.48 2 12c0 4.14 2.62 7.66 6.33 9.01-.09-.76-.17-1.94.04-2.78.19-.79 1.22-5.17 1.22-5.17s-.31-.62-.31-1.54c0-1.44.83-2.52 1.87-2.52.88 0 1.31.66 1.31 1.45 0 .88-.56 2.2-.85 3.42-.24 1.02.51 1.85 1.52 1.85 1.82 0 3.05-2.34 3.05-5.12 0-2.11-1.42-3.69-4.01-3.69-2.93 0-4.75 2.18-4.75 4.62 0 .84.25 1.43.64 1.89.18.21.2.3.13.54-.04.16-.14.55-.18.7-.06.22-.24.3-.45.22-1.26-.52-1.84-1.9-1.84-3.45 0-2.56 2.16-5.63 6.44-5.63 3.44 0 5.71 2.49 5.71 5.16 0 3.53-1.96 6.17-4.84 6.17-.97 0-1.88-.52-2.19-1.12 0 0-.52 2.07-.63 2.47-.19.7-.56 1.39-.9 1.93.73.23 1.5.35 2.29.35 3.86 0 7-3.14 7-7s-3.14-7-7-7z",
    tiktok: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.76-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
    twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z",
    youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z",
    github: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
    website: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    appstore: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17.36 3 13.75 4.06 11.11c.52-1.33 1.45-2.43 2.55-3.06 1.1-.63 2.44-.85 3.74-.57.47.1.92.27 1.33.5.33.18.73.29 1.1.29.36 0 .74-.11 1.07-.28.58-.3 1.23-.46 1.88-.48.83-.02 1.63.19 2.33.58.71.39 1.3.96 1.76 1.65-1.47.89-2.2 2.53-1.85 4.1.32 1.44 1.54 2.62 3.06 2.95-.37 1.08-.86 2.07-1.42 2.95zM15.5 4.5c.66-.8 1.1-1.87 1.01-2.99-1.02.07-2.19.68-2.91 1.51-.64.74-1.07 1.74-.99 2.8 1.06.07 2.13-.57 2.89-1.32z",
    googleplay: "M3.6 3.8c-.3.3-.5.7-.5 1.2v14c0 .5.2.9.5 1.2l.2.2L14.6 12 3.8 3.6l-.2.2zM16.5 9.8L4.9 3.1l.1-.1c.2-.1.4-.2.7-.2h9.5c.5 0 1 .2 1.4.5l-1.1 6.5zM21 11.5c-.3-.2-.6-.3-1-.3h-2.5l-1 6.2h2.5c.4 0 .7-.1 1-.3.5-.4.8-.9.8-1.5v-2.6c0-.6-.3-1.1-.8-1.5zM4.9 20.9c.2.1.4.2.7.2h9.5c.5 0 1-.2 1.4-.5l-1.1-6.5-12.4 7.2.1.1z",
  };

  const path = iconPaths[platform];
  if (!path) {
    return <div className={className} style={{ width: 40, height: 40, backgroundColor: '#333', borderRadius: 8 }}></div>;
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d={path} />
    </svg>
  );
};

// Platform display names
const getPlatformName = (platform: string): string => {
  const names: Record<string, string> = {
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    email: 'Email',
    phone: 'Phone',
    snapchat: 'Snapchat',
    pinterest: 'Pinterest',
    tiktok: 'TikTok',
    twitter: 'Twitter',
    youtube: 'YouTube',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    website: 'Website',
    appstore: 'App Store',
    googleplay: 'Google Play',
  };
  return names[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
};

async function getProfile(username: string) {
  const { data: profile, error } = await supabase
    .from('flaunts_profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error || !profile) {
    return null;
  }

  const { data: socialLinks } = await supabase
    .from('flaunts_social_links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('order_index', { ascending: true });

  const { data: services } = await supabase
    .from('flaunts_services')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  return { profile, socialLinks: socialLinks || [], services: services || [] };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const data = await getProfile(username);

  if (!data) {
    notFound();
  }

  const { profile, socialLinks, services } = data;
  const accentColor = profile.bg_color || '#8B5CF6';
  const hasBanner = !!profile.banner_url;
  const hasServices = services.length > 0;

  const getLinkUrl = (platform: string, url: string) => {
    if (!url) return '#';
    
    if (platform === 'whatsapp') {
      let phone = url.replace(/[^0-9+]/g, '');
      if (!phone.startsWith('+')) phone = '+' + phone;
      return `https://wa.me/${phone.replace('+', '')}`;
    }
    if (platform === 'email') return `mailto:${url}`;
    if (platform === 'phone') return `tel:${url.replace(/[^0-9+]/g, '')}`;
    if (!url.startsWith('http')) return `https://${url}`;
    return url;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Banner Section - Only if exists */}
      {hasBanner && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={profile.banner_url!}
            alt="Banner"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* No banner spacer */}
      {!hasBanner && <div className="h-8" />}

      <div className="max-w-md mx-auto px-4 pb-12">
        {/* Avatar - Adjust top margin based on banner presence */}
        <div className={`flex justify-center ${hasBanner ? '-mt-12' : 'mt-0'} mb-4`}>
          {profile.avatar_url ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 shadow-lg" style={{ borderColor: accentColor }}>
              <Image
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          ) : (
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 shadow-lg"
              style={{ backgroundColor: accentColor, borderColor: accentColor }}
            >
              {(profile.display_name || profile.username).charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Username */}
        <h1 className="text-2xl font-bold text-center" style={{ color: accentColor }}>
          {profile.display_name || profile.username}
        </h1>
        <p className="text-center text-sm text-white opacity-60 mt-1">
          @{profile.username}
        </p>

        {/* Bio */}
        {profile.bio && (
          <p className="text-center mt-3 text-sm text-white opacity-60">
            {profile.bio}
          </p>
        )}

        {/* SOCIAL LINKS SECTION - Two different layouts based on services */}
        {socialLinks.length > 0 && (
          <>
            {hasServices ? (
              // Layout 1: Icons only grid (when user has services) - NO TEXT, JUST ICONS
              <div className="mt-8">
                <div className="flex flex-wrap justify-center gap-5">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={getLinkUrl(link.platform, link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:opacity-80"
                      style={{ backgroundColor: '#333' }}
                      title={getPlatformName(link.platform)}
                    >
                      <PlatformIcon platform={link.platform} className="w-6 h-6 text-white" />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              // Layout 2: List view (when NO services) - SHOW PLATFORM NAME, NO URL
              <div className="mt-8 space-y-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={getLinkUrl(link.platform, link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:opacity-80 group"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderLeft: `3px solid ${accentColor}`
                    }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <PlatformIcon platform={link.platform} className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-base">
                        {getPlatformName(link.platform)}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-white opacity-40 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {/* Services Section - Only if has services */}
        {hasServices && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: accentColor }}>
              Services
            </h2>
            <div className="space-y-4">
              {services.map((service: Service) => (
                <div
                  key={service.id}
                  className="rounded-xl overflow-hidden shadow-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderLeft: `4px solid ${accentColor}` }}
                >
                  {service.image_url && (
                    <div className="relative w-full h-48">
                      <Image
                        src={service.image_url}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 448px"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {service.title}
                    </h3>
                    <p className="text-sm text-white opacity-60 mt-1">
                      {service.category}
                    </p>
                    {service.description && (
                      <p className="text-sm text-white opacity-60 mt-2">
                        {service.description}
                      </p>
                    )}
                    {service.price && (
                      <p className="text-lg font-bold mt-3 text-white">
                        {service.currency} {service.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 pt-6 border-t border-gray-800">
          <Link 
            href="https://flaunts.me"
            target="_blank"
            className="text-sm text-white hover:opacity-80 transition"
          >
            Get your free flaunts.me →
          </Link>
          <p className="text-xs text-white opacity-60 mt-2">
            Powered by C5-DEV
          </p>
        </footer>
      </div>
    </div>
  );
}