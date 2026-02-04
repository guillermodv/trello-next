import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { createClient } from '@/lib/supabase-server';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <Navbar initialSession={session} />
      <main style={{ flexGrow: 1 }}>
        {children}
      </main>
      <Footer />
    </>
  )
}