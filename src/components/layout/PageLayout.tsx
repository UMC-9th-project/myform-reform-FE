import Header from './Header/Header';
import HeaderNav from './Header/HeaderNav';
import Footer from './Footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNavbar?: boolean;
  showFooter?: boolean;
  footerVariant?: 'dark' | 'light';
}

const PageLayout = ({
  children,
  showHeader = true,
  showNavbar = true,
  showFooter = true,
  footerVariant = 'dark',
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      {showNavbar && <HeaderNav />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer variant={footerVariant} />}
    </div>
  );
};

export default PageLayout;
