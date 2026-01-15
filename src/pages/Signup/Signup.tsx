import { Outlet } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';

const Signup = () => {
  return (
    <PageLayout showHeader={false} showNavbar={false} showFooter={false}>
      <Outlet />
    </PageLayout>
  );
};

export default Signup;
