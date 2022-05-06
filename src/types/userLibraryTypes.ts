import * as Mongoose from "mongoose";

export interface appUserLibraryModel extends Mongoose.Document {
    id: string;
    user_id: string;
    image_url: string;
    album_name: string;
    artist_name: string;
    album_release_date: string;
    createdAt: Date
}
