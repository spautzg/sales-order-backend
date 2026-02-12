import { CustomerControllerImpl } from "srv/controller/customer/implementation";
import { CustomerController } from "srv/controller/customer/protocols";
import { customerService } from "../services/customer";

const makeCustomerController = (): CustomerController => {
    return new CustomerControllerImpl(customerService);
}

export const customerController = makeCustomerController();
