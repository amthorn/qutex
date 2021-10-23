import { toast } from "react-toastify";

export const request = (url, options, requestOptions) => {
    const update = {
        ...options,

        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        }
    };

    return fetch(url, update).then((response) => response.json().then((data) => {
        const notificationsEnabled = requestOptions?.notifications !== false;
        const messageInData = "message" in data;
        const sendMessages = notificationsEnabled && messageInData;

        if (sendMessages && "raw" in data.message) {
            for(const value of Object.entries(data.message.raw)){
                toast[data.message.priority](`${value[0]}: ${value[1]}`);
            }
        } else if (sendMessages) {
            toast[data.message.priority](data.message.text);
        } else {
            // Notifications explicitly ignored
        }

        return { response, data };
    }));
};