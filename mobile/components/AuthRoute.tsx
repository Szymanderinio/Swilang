import { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { getApiToken } from '../utils/storage';

type Props = {
  children: JSX.Element;
};

const AuthRoute = ({ children }: Props) => {
  const changeRoute = useAppStore((state) => state.changeRoute);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const apiToken = await getApiToken();

        if (!apiToken) {
          changeRoute(ROUTES.login);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkIfLoggedIn();
  }, []);

  return children;
};

export default AuthRoute;
