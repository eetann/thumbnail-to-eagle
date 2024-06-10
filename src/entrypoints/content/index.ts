import App from "./App.svelte";

async function waitForElm(selector: string): Promise<Element | undefined> {
	// NOTE: https://phuoc.ng/collection/html-dom/waiting-for-an-element-to-become-available/
	// https://macarthur.me/posts/use-mutation-observer-to-handle-nodes-that-dont-exist-yet/
	// setIntervalだと要素が多いと大変っぽい
	return new Promise((resolve) => {
		const elm = document.querySelector(selector);
		if (elm) {
			resolve(elm);
			return;
		}
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length === 0) {
					continue;
				}
				for (const node of mutation.addedNodes) {
					if (!(node instanceof HTMLElement)) continue;
					if (node.matches(selector)) {
						observer.disconnect();
						clearTimeout(timeout);
						resolve(node);
						return;
					}
				}
			}
			// const elm = document.querySelector(selector);
			// if (elm) {
			// 	observer.disconnect();
			//      clearTimeout(timeout);
			// 	resolve(elm);
			// 	return;
			// }
		});
		const timeout = setTimeout(() => {
			observer.disconnect();
			clearTimeout(timeout);
			resolve(undefined);
			return;
		}, 15000);
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

export default defineContentScript({
	matches: ["https://*.google.co.jp/*"],
	async main(ctx) {
		const anchor = await waitForElm("[role='navigation']");
		const ui = createIntegratedUi(ctx, {
			position: "overlay",
			alignment: "top-right",
			anchor: anchor,
			append: "after",
			onMount: (container) => {
				const app = new App({
					target: container,
				});
				return app;
			},
			onRemove: (app) => {
				app?.$destroy();
			},
		});
		ui.mount();
	},
});
