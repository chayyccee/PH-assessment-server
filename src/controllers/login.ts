import { Request, Response } from "express";
import 'dotenv/config';
import generateRandomString from "../utils/randomString";

const client_id: string = process.env.CLIENT_ID!;
const auth_url: string = process.env.AUTH_URL!;
// const client_secret: string = process.env.CLIENT_SECRET!;
const redirect_uri: string = process.env.CALLBACK_URI!;

const stateKey = 'spotify_auth_state';

export const userLogin = (_req: Request, res: Response) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope: Array<string> = [
        "ugc-image-upload",
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
        "playlist-modify-private",
        "user-library-read",
        "user-library-modify",
        "user-follow-read",
        "user-follow-modify",
        "user-read-recently-played",
        "user-top-read",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-read-recently-played",
        "streaming",
        "app-remote-control",
        "user-read-currently-playing",
    ];

    const params = new URLSearchParams(
        `client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join("%20")}&response_type=code&state=${state}`
    );

    res
        .redirect(`${auth_url}?${params.toString()}`);
}

