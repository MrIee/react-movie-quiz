import { Topbar } from '../components/Topbar';
import { Footer } from '../components/Footer';
import { Outlet } from 'react-router-dom';

export const LayoutContainer = (): JSX.Element => {
  return (
    <>
      <Topbar title="Movie Quiz" />
      <main className="tw-w-full tw-flex tw-justify-center tw-mt-14 sm:tw-mb-8 tw-absolute tw-top-0 tw-bottom-0">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
