import * as Mongoose from "mongoose";
import { appUserLibraryModel } from "../types/userLibraryTypes";

const userLibrary = new Mongoose.Schema({
    // userId: {
    //     type: Mongoose.Schema.Types.ObjectId,
    //     ref: 'SpotifyUser',
    // },
   // spotify_user_id: { type: String, required: true },
    album_id: { type: String, required: true },
    image_url: { type: String, required: true },
    album_name: { type: String, required: true },
    artist_name: { type: String, required: true },
    album_release_date: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const AppUserLibrary = Mongoose.model<appUserLibraryModel>("UserLibrary", userLibrary);

export default AppUserLibrary;
