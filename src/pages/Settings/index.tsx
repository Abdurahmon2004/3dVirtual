import { Box, useTheme } from '@mui/material';
import {
  Building,
  Users,
  Building2,
  Grid3x3,
  Globe,
  Home as HomeIcon,
  ArrowLeft,
} from 'lucide-react';
import { Link, useLocation, Navigate, Outlet, useNavigate } from 'react-router';

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const menuItems = [
    { id: 'companies', label: 'Kompaniyalar', icon: Building, path: '/settings/companies' },
    { id: 'users', label: 'Foydalanuvchilar', icon: Users, path: '/settings/users' },
    { id: 'objects', label: 'Obyektlar', icon: Building2, path: '/settings/objects' },
    { id: 'blocks', label: 'Bloklar', icon: Grid3x3, path: '/settings/blocks' },
    { id: 'plans', label: 'Rejalar', icon: Globe, path: '/settings/plans' },
    { id: 'homes', label: 'Uylar', icon: HomeIcon, path: '/settings/homes' },
  ];
  const activeItem = menuItems.find((item) => location.pathname === item.path);
  const defaultPath = menuItems[0].path;
  if (location.pathname === '/settings') {
    return <Navigate to={defaultPath} replace />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        height: 'calc(100vh - 64px)',
        bgcolor: 'transparent',
        gap: 2,
        p: 2,
        alignItems: 'stretch',
      }}
    >
      <Box
        sx={{
          width: 304,
          flexShrink: 0,
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          bgcolor: 'transparent',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <aside className={`w-[304px] ${isDarkMode ? 'text-slate-100' : 'text-slate-800'} px-3 py-4`}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={[
              'mb-4 flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition',
              isDarkMode
                ? 'bg-[#242F3D] text-white hover:bg-slate-800'
                : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-100',
            ].join(' ')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Ortga</span>
          </button>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.id} to={item.path} style={{ textDecoration: 'none' }}>
                  <div
                    className={[
                      'flex items-center gap-3 rounded-[12px] px-4 py-1.5 text-sm font-medium transition h-[48px] cursor-pointer',
                      isActive
                        ? 'bg-indigo-500 text-white'
                        : isDarkMode
                        ? 'bg-[#242F3D] text-slate-100 hover:bg-slate-800'
                        : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-8 w-8 items-center justify-center rounded-lg border text-base',
                        isActive
                          ? 'border-indigo-300/70 bg-indigo-400/40'
                          : isDarkMode
                          ? 'border-slate-700 bg-slate-900'
                          : 'border-slate-300 bg-slate-50',
                      ].join(' ')}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-left leading-snug">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          height: 'calc(100% - 16px)',
          overflowY: 'auto',
          p: 3,
          bgcolor: isDarkMode ? '#1E293B' : '#FFFFFF',
          borderRadius: '12px',
          border: isDarkMode ? 'none' : '1px solid #E2E8F0',
          boxShadow: isDarkMode ? 'none' : '0px 1px 3px rgba(0, 0, 0, 0.1)',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
