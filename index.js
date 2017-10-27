const devtoolHook = 
	typeof window !== 'undefined' && window.__SAN_DEVTOOLS_GLOBAL_HOOK__;
window.__SYS_SAN_APP_DETECTED_TARGET__ = 'san';

function searchStateChangeById(store, actionId) {
	const length = store.stateChangeLogs.length;
	for (let i = length - 1; i >= 0; i--) {
		if (store.stateChangeLogs[i].id === actionId) {
			const stateChangeLog = store.stateChangeLogs[i];
			const actionListLength = store.actionCtrl.list.length;
			for (let j = actionListLength - 1; j >= 0; j--) {
				if (store.actionCtrl.list[j].id === actionId) {
					return {
						...stateChangeLog,
						...store.actionCtrl.list[j],
						state: store.raw
					};
				}
			}
		}
	}
	return null;
}

function installHook(hook) {
	return store => {
		hook.emit('san:init', San);
		hook.emit('san-store:init', store);

		hook.on('san-store:travel-to-state', targetState => {
			// modify component's state map
			// there needs design a middleware of store.
		});

		function communicate2devtools() {
			const done = store.actionCtrl.done;
			store.actionCtrl.__proto__.done = function(actionId) {
				done.apply(this, arguments);

				const stateChangeInfo = searchStateChangeById(store, actionId);
				if (stateChangeInfo) hook.emit('san-store:dispatch', stateChangeInfo);
			}
		}
		communicate2devtools();
	};
}

export default installHook(devtoolHook);
