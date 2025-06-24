import { initRoutes } from './utils/pagerouter';

export default {
  afterRoutes() {
    const customRoutes = initRoutes();
    console.log('=========customRoutes=========\n', customRoutes, '\n====================');
    return customRoutes;
  },
};
