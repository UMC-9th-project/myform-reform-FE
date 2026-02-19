import SignupForm from '../../components/domain/signup/form/SignupForm';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logos/logo.svg';


const SignupFormPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex items-center justify-center pb-[7.5rem] pt-[5rem] px-[28rem]">
      <div className="w-[543px] flex flex-col items-center gap-[5.8125rem]">
        <div className="h-[6.25rem] flex items-center justify-center cursor-pointer" onClick={() => navigate('/home')}>
          <img src={logo} alt="logo" className="h-[2.78875rem]" />
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupFormPage;
