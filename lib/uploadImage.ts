import { app } from "@/firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const uploadImage = async (file: File)  => {
    if(!file) return;
    const storage = getStorage();
    const storageRef = ref(storage, `todo-assets/${Date.now().toLocaleString()}`);

    let imageUrl: string | undefined = undefined;
    await uploadBytes(storageRef, file).then((snapshot) => {
        return getDownloadURL(snapshot.ref);
    }).then(downloadURL => {
        imageUrl = downloadURL ? downloadURL : undefined;
    });
    return imageUrl;
}