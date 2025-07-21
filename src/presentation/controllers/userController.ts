import { Request, Response } from "express";
import { CreateUser } from "../../user-cases/user/CreatUserUsecase";
import { UserRepositoryDb } from "../../infrastructure/repositories/userRepositoryDb";
import { LoginUser } from "../../user-cases/user/loginUserUsecase";
import { UpdateUser } from "../../user-cases/user/UpdateUserUsecase";
import { GetUserProfile } from "../../user-cases/user/GetUserProfileUseCase";
import { GetMyClients } from "../../user-cases/user/GetMyClientsUseCase";
import { GetSingleClient } from "../../user-cases/user/GetSingleClientUseCase";
import generateToken from "../../utils/jwt/generateToken";
import { HttpStatusCode } from "@/helper/constants/statusCodes";

export class UserController {
    private userRepository: UserRepositoryDb;
    private signupUserUsecase: CreateUser;
    private loginUserUsecase: LoginUser;
    private getUserProfileUsecase: GetUserProfile;
    private updateUserUsecase: UpdateUser;
    private getMyClientUsecase: GetMyClients;
    private getSingleClientUsecase: GetSingleClient;

    constructor() {
        this.userRepository = new UserRepositoryDb();
        this.signupUserUsecase = new CreateUser(this.userRepository);
        this.loginUserUsecase = new LoginUser(this.userRepository);
        this.getUserProfileUsecase = new GetUserProfile(this.userRepository);
        this.updateUserUsecase = new UpdateUser(this.userRepository);
        this.getMyClientUsecase = new GetMyClients(this.userRepository);
        this.getSingleClientUsecase = new GetSingleClient(this.userRepository);
    }

    async signupUser(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.signupUserUsecase.execute(req.body);

            res
                .status(HttpStatusCode.CREATED)
                .json({ message: "new user created", success: true });
        } catch (error: unknown) {
            const err = error as { message: string };
            res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: err.message, success: false });
        }
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.loginUserUsecase.execute(req.body);
            const { accessToken, refreshToken } = generateToken(user._id);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });

            res.status(HttpStatusCode.OK).json({
                message: "Loggedin Successfull",
                user,
                accessToken,
                success: true,
            });
        } catch (error: unknown) {
            const err = error as { message: string };
            res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: err.message, success: false });
        }
    }

    async getUserProfile(req: any, res: Response): Promise<void> {
        try {
            const { userId } = req.user;
            const user = await this.getUserProfileUsecase.execute(userId);

            res
                .status(HttpStatusCode.OK)
                .json({ message: "User load successfully", user, success: true });
        } catch (error: unknown) {
            const err = error as { message: string };
            res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: err.message, success: false });
        }
    }

    async updateUser(req: any, res: Response): Promise<void> {
        try {
            const user = await this.updateUserUsecase.execute(
                req.body,
                req.user.userId
            );

            res
                .status(HttpStatusCode.CREATED)
                .json({ message: "User updated ", user, success: true });
        } catch (error: unknown) {
            const err = error as { message: string };
            res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: err.message, success: false });
        }
    }

    async getMyClients(req: any, res: Response): Promise<void> {
        try {
            const { userId } = req.user;
            const clients = await this.getMyClientUsecase.execute(userId);

            res
                .status(HttpStatusCode.OK)
                .json({ message: "Clients loaded", clients, success: true });
        } catch (error: unknown) {
            const err = error as { message: string };
            res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: err.message, success: false });
        }
    }

    async getSingleClient(req: any, res: Response): Promise<void> {
        try {
            const { clientId } = req.params;
            const client = await this.getSingleClientUsecase.execute(clientId);

            res
                .status(HttpStatusCode.OK)
                .json({ message: "Clients loaded", client, success: true });
        } catch (error: unknown) {
            const err = error as { message: string };
            res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: err.message, success: false });
        }
    }
}
