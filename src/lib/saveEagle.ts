import { storage } from "wxt/storage";

const apiTokenStorage = storage.defineItem<string>("local:apiTokenStorage", {
	defaultValue: "",
});

export async function getApiToken() {
	return await apiTokenStorage.getValue();
}

export async function setApiToken(token: string) {
	return await apiTokenStorage.setValue(token);
}

export async function save() {
	const apiToken = await getApiToken();
	if (apiToken === "") {
		throw new Error("set API Token");
	}
	const data = {
		token: apiToken,
		url: "https://cdn.dribbble.com/users/674925/screenshots/12020761/media/6420a7ec85751c11e5254282d6124950.png",
		name: "Work",
		website: "https://dribbble.com/shots/12020761-Work",
		tags: ["Illustration", "Design"],
		modificationTime: 1591325171766,
		headers: {
			referer: "dribbble.com",
		},
	};

	const requestOptions: RequestInit = {
		method: "POST",
		body: JSON.stringify(data),
		redirect: "follow",
	};

	const url = "http://localhost:41595/api/item/addFromURL";
	fetch(url, requestOptions)
		.then((response) => response.json())
		.then((result) => console.log(result))
		.catch((error) => console.log("error", error));
}
