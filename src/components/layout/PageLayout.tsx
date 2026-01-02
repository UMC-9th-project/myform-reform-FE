import Header from './Header/Header';
import HeaderNav from './Header/HeaderNav';
import Footer from './Footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
  showHeader: boolean;
  showNavbar: boolean;
}

const PageLayout = ({
  children,
  showHeader = true,
  showNavbar = true,
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      {showNavbar && <HeaderNav />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
