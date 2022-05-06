import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import 'dotenv/config';
import logger from "../utils/logger";
import SpotifyUser from "../models/spotifyUserModel";
import { SpotifyUserModel } from "../types/spotifyUserModelTypes";

const redirect_uri: string = process.env.CALLBACK_URI!;
const spotify_token_url: string = process.env.TOKEN_URL!;
const getSpotify_User_Info_Url: string = process.env.USER_PROFILE_URL!;
const password_string : string = process.env.PASSWORD_STRING!;

export const callbackController = (req: Request, res: Response) => {
    const {code} = req.query;

    axios({
        method: "post",
        url: spotify_token_url,
        data: new URLSearchParams(
            `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`
        ).toString(),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID!}:${process.env.CLIENT_SECRET!}`).toString("base64")}`,
        }
    })
        .then((response: {
            status: number;
            data: {
                access_token: string;
                refresh_token: string;
                token_type: string;
                expires_in: string; // seconds
                scope: string;
            }; 
}) => {
           if (response.status === StatusCodes.OK) {

            const {
                access_token,
                refresh_token,
                token_type,
                expires_in,
             } = response.data;

            const params = new URLSearchParams({
                access_token,
                refresh_token,
                expires_in
            }).toString();
               
               try {
                    axios({
                        method: "get",
                        url: getSpotify_User_Info_Url,
                        headers: {
                            Authorization: `${token_type} ${access_token}`,
                        }
                    }).then((response: {
                        status: number;
                        data: {
                            country: string;
                            display_name: string;
                            email: string;
                            explicit_content: {
                                filter_enabled: boolean;
                                filter_locked: boolean;
                            },
                            external_urls: {
                                spotify: string;
                            },
                            followers: {
                                href: string | null;
                                total: number;
                            },
                            href: string;
                            id: string;
                            images: [
                                {
                                    height: number;
                                    url: string;
                                    width: number;
                                }
                            ]
                            product: string;
                            type: string;
                            uri: string;
                        };
                    }) => {
                        const {
                            country,
                            display_name,
                            email,
                            explicit_content,
                            external_urls,
                            followers,
                            href,
                            id,
                            images,
                            product,
                            type,
                            uri
                        } = response.data;

                        const password = `${email}${password_string}`;

                        if (email) {
                            SpotifyUser
                            .findOne({spotifyUserEmail: email}) // find user by email
                            .then((user: SpotifyUserModel | null) => {
                                if (user) {
                                    logger.info(`User ${user.spotifyUserName} already exists`);
                                    res.status(StatusCodes.OK);
                                } else {
                                    const newUser = new SpotifyUser({
                                        spotifyUserCountry: country,
                                        spotifyUserName: display_name,
                                        spotifyUserEmail: email,
                                        spotifyUserExplicitContent: explicit_content,
                                        spotifyUserExternalUrls: external_urls,
                                        spotifyUserFollowers: followers,
                                        spotifyUserHref: href,
                                        spotifyUserId: id,
                                        spotifyUserImage: images,
                                        spotifyUserProduct: product,
                                        spotifyUserType: type,
                                        spotifyUserURI: uri,
                                        password
                                    });

                                    newUser.save()
                                        .then((user: SpotifyUserModel) => {
                                            logger.info(`User ${user.spotifyUserName} has been created`);
                                            res.status(StatusCodes.OK).send(`User: ${user.spotifyUserName} has been created in the database`);
                                        })
                                        .catch((error: Error) => {
                                            logger.error(error);
                                        });
                                }
                            })
                            .catch((err: Error) => {
                                logger.error(err);
                            })
                        } /* else {
                            logger.error("No email found");
                            res.redirect(`http://localhost:3000?${params}`);
                        } */
                    }).catch((error: any) => {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                        logger.error(error);
                    });
                   // end of try in try catch
               } catch (error) {
                    logger.error(error);
               }
               // redirect to the react home page and pass the access token in the query params to the react app
              res.redirect(`http://localhost:3000?${params}`);
             // res.redirect('http://localhost:3000/app/dashboard');
              res.status(StatusCodes.OK);
           } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response.data);
              }
})
        .catch((error: any) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        });
}
