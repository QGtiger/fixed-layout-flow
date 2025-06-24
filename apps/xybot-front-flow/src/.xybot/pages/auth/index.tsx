import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirect = searchParams.get('redirect');
    if (token && redirect) {
      localStorage.setItem('ACCESS_TOKEN', token);
      navigate(redirect, { replace: true });
    } else {
      navigate('/');
    }
  }, []);

  return <></>;
};

export default Auth;

export const setting = {
  layout: false
};
