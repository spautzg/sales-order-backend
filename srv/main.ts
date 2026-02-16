import cds, { db, Request, Service } from '@sap/cds';
import { Customers, Product, Products, SalesOrderHeaders, SalesOrderItem, SalesOrderItems } from '@models/sales';
import { customerController } from './factories/controllers/customer';
import { salesOrderHeaderController } from './factories/controllers/sales-order-header';
import { FullReuqestParams } from './protocols';

export default (service: Service) => {
    service.before('READ', '*', (request: Request) => {
        console.log(request.user.is('read_only_user'));
        if (!request.user.is('read_only_user')) {
            return request.reject(403, 'Não autorizado');
        }
    });
    service.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is('admin')) {
            return request.reject(403, 'Não autorizada a escrita/deleção');
        }
    });

    service.after('READ', 'Customers', (customerList: Customers, request) => {

        (request as unknown as FullReuqestParams<Customers>).results = customerController.afterRead(customerList);
    });
    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const result = await salesOrderHeaderController.beforeCreate(request.data);
        if (result.hasError) {
            return request.reject(400, result.error?.message as string);
        }
        // const items: SalesOrderItems = params.items;
        // if (!params.customer_id) {
        //     return request.reject(400, 'Invalid Customer');
        // }
        // if (!params.items || params.items?.length === 0) {
        //     return request.reject(400, 'invalid items');
        // }
        // const customerQuery = SELECT.one.from('sales.Customers').where({ id: params.customer_id });
        // const customer = await cds.run(customerQuery);
        // if (!customer) {
        //     return request.reject(404, 'customer not found');
        // }
        // const productsIds: string[] = params.items.map((item: SalesOrderItem) => item.product_id);
        // const productsQuery = SELECT.from('sales.products').where({ id: productsIds });
        // const products: Products = await cds.run(productsQuery);
        // for (const item of items) {
        //     const dbProduct = products.find(product => product.id === item.product_id);
        //     if (!dbProduct) {
        //         return request.reject(404, `Produto ${item.product_id} não encontrado`);
        //     }
        //     if (dbProduct.stock === 0) {
        //         return request.reject(400, `Produto ${dbProduct.name}(${dbProduct.id}) sem estoque disponível`);
        //     }
        // }
        // let totalAmount = 0;
        // items.forEach(item => {
        //     totalAmount += (item.price as number) * (item.quantity as number);
        // });
        console.log(`antes do desconto: ${result.totalAmount}`);
        // if (totalAmount > 30000) {
        //     const discount = totalAmount * (10/100);
        //     totalAmount = totalAmount - discount;
        // }
        console.log(`total com desconto: ${result.totalAmount}`);
        request.data.totalAmount = result.totalAmount;
    });
    service.after('CREATE', 'SalesOrderHeaders', async (results: SalesOrderHeaders, request: Request) => {
        const headersAsArray = Array.isArray(results) ? results : [results] as SalesOrderHeaders;
        for (const header of headersAsArray) {
            const items = header.items as SalesOrderItems;
            const productsData = items.map(item => ({
                id: item.product_id as string,
                quantity: item.quantity as number
            }));
            const productsIds: string[] = productsData.map((productData) => productData.id);
            const productsQuery = SELECT.from('sales.Products').where({ id: productsIds });
            const products: Products = await cds.run(productsQuery);
            for (const productData of productsData) {
                const foundProduct = products.find(product => product.id === productData.id) as Product;
                foundProduct.stock = (foundProduct.stock as number) - productData.quantity;
                await cds.update('sales.Products').where({ id: foundProduct.id }).with({ stock: foundProduct.stock });
            }
            const headerAsString = JSON.stringify(header);
            const userAsString = JSON.stringify(request.user);
            const log = [{
                header_id: header.id,
                userData: userAsString,
                orderData: headerAsString
            }];
            await cds.create('sales.SalesOrderLogs').entries(log)
        }
    })
}