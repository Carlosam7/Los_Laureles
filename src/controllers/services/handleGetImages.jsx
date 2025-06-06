import supabase from "../../utils/supabase";
import Image from "../../models/classes/Image";

export const handleGetImages = async () => {
    try {
        const { data, error } = await supabase
            .from("image")
            .select('*');

        if (error) {
            return error;
        }

        // if (!data || data.length === 0) {
        //     throw new Error("No images found");
        // }

        // console.log(data)
        //Llenar un array de objetos de imágenes
        const images = data.map(image => {
            return new Image(
                image.id_type_room,
                image.url,
            );
        });

        return images;
    } catch (error) {
        console.error("Error fetching images:", error);
        return []
    }
};

