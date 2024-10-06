export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='w-[440px] -m-6 flex flex-col items-center justify-center'>
      <div className='flex h-dvh w-full flex-col items-center justify-center gap-10 bg-white p-8 text-slate-800 shadow-soft-sm md:h-fit md:max-w-md md:rounded-xl'>
        {children}
      </div>
    </main>
  );
}
