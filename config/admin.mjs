import AdminBro from 'admin-bro';
import AdminBroMongoose from 'admin-bro-mongoose';
import AdminBroExpress from 'admin-bro-expressjs';

import User from '../app/models/user';
import Items from '../app/models/items';
import Categories from '../app/models/categories';

AdminBro.registerAdapter(AdminBroMongoose);

const AdminBroOptions = {
  resources: [User, Categories, Items],
  rootPath: '/admin'
}
const adminBro = new AdminBro(AdminBroOptions);
const adminRouter = AdminBroExpress.buildRouter(adminBro);

export default {
  adminBro,
  adminRouter
};