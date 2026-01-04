import Navbar from './Nav/Navbar';
import Footer from './Footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
  footerVariant?: 'dark' | 'light';
}

const PageLayout = ({ children, footerVariant = 'dark' }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer variant={footerVariant} />
    </div>
  );
};

export default PageLayout;
