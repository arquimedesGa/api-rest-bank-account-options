const routes = express.Router();
const controllers = require('./controllers/accountcontroller');


routes.get('/accounts', intermediarioSenh, controllers.listofAccounts);

routes.post('/accounts', controllers.creatingBankAccount);

routes.put('/accounts/:accountnumber/', controllers.modifiedAccounts);

routes.delete('/accounts/:accountnumber', controllers.DeleteAccounts);

routes.post('/transaction/deposit', controllers.accountDeposit);

routes.post('/transaction/withdraw', controllers.withdrawAccount);

routes.post('/transaction/transfer', controllers.transferAccount);

routes.get('/accounts/balance', controllers.accountBalance);

routes.get('/accounts/extract', controllers.extractAccount);

module.exports = routes;