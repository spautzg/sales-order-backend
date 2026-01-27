import { Customer, Customers} from '@models/sales'

const customer: Customer = {
    email: 'teste@teste.com',
    firstName: 'Gilvan',
    lastName: 'Spautz',
    id: '1234'
};

const customers: Customers = [customer]

const funcao = (variavel: string) => console.log(variavel);
funcao('123');