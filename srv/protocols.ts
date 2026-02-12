import { Request } from "@sap/cds";

export type FullReuqestParams<ExpectedResult> = Request & {
    results: ExpectedResult;
}  