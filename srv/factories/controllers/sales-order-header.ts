import { SalesOrderHeaderControllerImpl } from "srv/controller/sales-order-header/implementation";
import { salesOrderHeaderService } from "../services/sales-order-header";
import { SalesOrderHeaderController } from "srv/controller/sales-order-header/protocols";

export const makeSalesOrderHeaderController = (): SalesOrderHeaderController => {
    const service = salesOrderHeaderService;
    return new SalesOrderHeaderControllerImpl(salesOrderHeaderService);
}

export const salesOrderHeaderController = makeSalesOrderHeaderController();