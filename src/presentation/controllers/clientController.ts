import { HttpStatusCode } from "@/helper/constants/statusCodes";
import { ClientRepositoryDb } from "../../infrastructure/repositories/clientRepositoryDb";
import { CreateClient } from "../../user-cases/client/CreateClientUsecase";
import { GetAllInvoices } from "../../user-cases/client/GetAllInvoicesUseCase";
import { UpdateClient } from "../../user-cases/client/UpdateClientUseCase";

export class ClientController {
    
    private clientRepository: ClientRepositoryDb;
    private createClientUseCase: CreateClient;
    private updateClientUseCase: UpdateClient;
    private getAllInvoicesUseCase: GetAllInvoices;

    constructor() {
        this.clientRepository = new ClientRepositoryDb();
        this.createClientUseCase = new CreateClient(this.clientRepository);
        this.updateClientUseCase = new UpdateClient(this.clientRepository);
        this.getAllInvoicesUseCase = new GetAllInvoices(this.clientRepository);
    }

    async createClient(req: any, res: any): Promise<void> {
        try {
            const { userId } = req.user;
            const result = await this.createClientUseCase.execute(req.body, userId);
            res
                .status(HttpStatusCode.CREATED)
                .json({ message: "new client created", success: true });
        } catch (error: unknown) {
            const err = error as { message: string };
            res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: err.message, success: false });
        }
    }

    async updateClient(req: any, res: any): Promise<void> {
        try {
            const result = await this.updateClientUseCase.execute(
                req.body,
                req.params.clientId
            );
            res
                .status(HttpStatusCode.CREATED)
                .json({ message: "Cilent updated Succssfully", success: true });
        } catch (error: unknown) {
            const err = error as { message: string };
            res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: err.message, success: false });
        }
    }

    async getAllInvoices(req: any, res: any): Promise<void> {
        try {
            const { clientId } = req.params;
            const { filter, currentPage } = req.query;
            const result = await this.getAllInvoicesUseCase.execute(
                clientId,
                filter,
                currentPage
            );
            res.status(HttpStatusCode.CREATED).json({
                message: "Invoices loaded",
                invoices: result.invoices,
                totalPages: result.totalPages,
                success: true,
            });
        } catch (error: unknown) {
            const err = error as { message: string };
            res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: err.message, success: false });
        }
    }
}
