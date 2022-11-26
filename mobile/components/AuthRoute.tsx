import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';

type Props = {
  children: JSX.Element;
};

const AuthRoute = ({ children }: Props) => {
  const apiToken = useAppStore((state) => state.apiToken);
  const changeRoute = useAppStore((state) => state.changeRoute);

  if (!apiToken) {
    changeRoute(ROUTES.login);

    return null;
  }

  return children;
};

export default AuthRoute;
