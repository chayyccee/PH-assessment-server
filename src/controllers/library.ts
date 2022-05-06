import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppUserLibrary from "../models/userLibrary";
import logger from "../utils/logger";

export const LibraryController = async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { user_id } = req.params;
    const {
        album_id,
        image_url,
        album_name, 
        artist_name,
        album_release_date,
       } = req.body;

    if (!token) {
        logger.error("No token provided");
        return res.status(StatusCodes.UNAUTHORIZED).send({
            message: "No token provided",
        });
    } else {
    
    try {
       // const { user_id } = req.params;
        const userLibrary = await AppUserLibrary.findOne({
            user_id,
            album_id,
        });
        if (userLibrary) {
            logger.info(`${user_id} already has ${album_id} in their library`);
            return res.status(StatusCodes.OK).json({
                status: "success",
                message: `${user_id} already has ${album_id} in their library`,
            });
        }
        const newUserLibrary = new AppUserLibrary({
            user_id,
            album_id,
            image_url,
            album_name,
            artist_name,
            album_release_date,
        });
        await newUserLibrary.save();
        logger.info(`${user_id} added ${album_id} to their library`);
        return res.status(StatusCodes.OK).json({
            status: "success",
            message: `${user_id} added ${album_id} to their library`,
        });
    } catch (error: any) {
        logger.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message,
        });
    }
}
}
