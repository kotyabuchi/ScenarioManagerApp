'use client';

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
} from '@nextui-org/react';
import {
  House,
  BookOpen,
  UsersRound,
  Notebook,
  LogOut,
  CircleHelp,
  MessageSquareMore,
  Settings,
  User,
} from 'lucide-react';
import { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import { Key, useState } from 'react';
import { signout } from '@/app/actions/signout';
import { toast } from 'sonner';

export default function SideBar({ session }: { session: Session | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [update, setUpdate] = useState(true);

  const logout = async () => {
    const result = await signout();
    if (result) {
      toast.success('ログアウトしました');
      router.push('/');
      router.refresh();
      setUpdate(update ? false : true);
    } else {
      toast.error('ログアウトに失敗しました');
    }
  };

  const menuItems = [
    {
      name: 'ホーム',
      href: '/dashboard',
      icon: House,
    },
    {
      name: 'シナリオ',
      href: '/dashboard/scenarios',
      icon: BookOpen,
    },
    {
      name: 'ユーザー',
      href: '/dashboard/users',
      icon: UsersRound,
    },
    {
      name: 'セッション',
      href: '/dashboard/sessions',
      icon: Notebook,
    },
  ];

  const menuItemAction = async (key: Key) => {
    router.push(`/${key}`);
  };

  return (
    <div className='m-6 hidden w-fit max-w-64 shrink-0 flex-col justify-between rounded-xl bg-white p-2 shadow-soft-md md:flex'>
      <div className='flex flex-col gap-4'>
        <Link
          href='/'
          color='foreground'
          className='flex flex-row justify-start p-4'
        >
          <Image
            className='relative h-10 min-h-10 w-10 min-w-10 object-cover'
            src='/mascot.png'
            alt='シナプレ管理くん'
            width={40}
            height={40}
          />
          <p className='ml-2 text-lg font-bold'>シナプレ管理くん</p>
        </Link>
        <div className='flex flex-col gap-2'>
          {session &&
            menuItems.map((item, index) => {
              if (index > 3) return;
              const isActive = pathname === item.href;
              const LinkIcon = item.icon;
              return (
                <Button
                  as={Link}
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  color={isActive ? 'primary' : 'default'}
                  variant={isActive ? 'flat' : 'light'}
                  size='lg'
                  className='w-full justify-start'
                >
                  <LinkIcon size={20} />
                  {item.name}
                </Button>
              );
            })}
        </div>
      </div>
      {session && (
        <div className='flex flex-col gap-2'>
          <Dropdown placement='top-start'>
            <DropdownTrigger>
              <Button
                variant='light'
                size='lg'
                className='h-12 w-full justify-start px-4'
              >
                <Avatar
                  isBordered
                  className='bg-slate-50 transition-transform'
                  name={session?.user?.nickname || 'セッション取得中...'}
                  size='sm'
                  src={session?.user?.avatar || '/default_avatar.png'}
                />
                {session?.user?.nickname}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Profile Actions'
              variant='flat'
              onAction={menuItemAction}
            >
              <DropdownItem
                key='profile'
                startContent={<User size={18} />}
                textValue='プロフィールリンク'
              >
                プロフィール
              </DropdownItem>
              <DropdownItem
                key='setting'
                startContent={<Settings size={18} />}
                textValue='設定リンク'
              >
                設定
              </DropdownItem>
              <DropdownItem
                key='help'
                startContent={<CircleHelp size={18} />}
                textValue='ヘルプリンク'
              >
                ヘルプ
              </DropdownItem>
              <DropdownItem
                key='feedback'
                startContent={<MessageSquareMore size={18} />}
                textValue='フィードバックリンク'
              >
                フィードバック
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            color={'danger'}
            variant='light'
            size='lg'
            className='w-full justify-start'
            onPress={logout}
          >
            <LogOut size={20} />
            ログアウト
          </Button>
        </div>
      )}
    </div>
  );
}
