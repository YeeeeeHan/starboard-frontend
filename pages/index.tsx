import { Default } from 'components/layouts/Default';
import type { NextPage } from 'next';
import CreateAuction from './createAuction';

const HomePage: NextPage = () => {
  return (
    <Default pageName="Home">
      <CreateAuction />
    </Default>
  );
};

export default HomePage;
