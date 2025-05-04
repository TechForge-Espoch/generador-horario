import { Buffer } from "node:buffer";
import cryptojs from "npm:crypto-js";

export const getFileHashMD5 = async (file: File) => {
    const base64file = await file.arrayBuffer().then((buffer) =>
        Buffer.from(buffer).toString("base64")
    );
    return cryptojs.MD5(base64file).toString();
};
