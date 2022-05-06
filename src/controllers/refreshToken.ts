import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import logger from "../utils/logger";

const client_id: string = process.env.CLIENT_ID!;
const token_url: string = process.env.TOKEN_URL!;
const client_secret: string = process.env.CLIENT_SECRET!;

export const userRefreshToken = (req: Request, res: Response) => {
    const { refresh_token } = req.query;

        axios({
            method: "post",
            url: token_url,
            data: new URLSearchParams(
                `grant_type=refresh_token&refresh_token=${refresh_token}`
            ).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from( `${client_id}:${client_secret}`).toString("base64")}`,
            }
        })
        .then((response: {
            status: number;
            data: {
                access_token: string; // new access token
                refresh_token: string;
                token_type: string;
                expires_in: number; // seconds
                scope: string;
            }; }) => {
            logger.info(response.data);
            res.status(StatusCodes.ACCEPTED).send(response.data);
        })
        .catch((error: any) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        });
}
