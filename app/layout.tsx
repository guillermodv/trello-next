import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './globals.css';
import { createClient } from '@/lib/supabase-server'; // Import server-side client

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient(); // Create server-side client
  const {
    data: { session },
  } = await supabase.auth.getSession(); // Fetch session server-side

  return (
    <html lang="en">
      <body>
        <Header />
        <Navbar initialSession={session} /> {/* Pass session as prop */}
        <main style={{ flexGrow: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}