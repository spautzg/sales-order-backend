using { sales } from '../db/schema';

service MainService {

    entity SalesOrderHearder as projection on sales.SalesOrderHeaders;
    entity Customers as projection on sales.Customers;
    entity Products as projection on sales.Products;

}
