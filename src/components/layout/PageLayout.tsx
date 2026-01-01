import Navbar from './Nav/Navbar';
import Footer from './Footer/Footer';
import Header from './Header/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
