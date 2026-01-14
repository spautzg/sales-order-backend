using { sales } from '../db/schema';

service MainService {

    entity SalesOrderHearder as projection on sales.SalesOrderHeaders;

}
