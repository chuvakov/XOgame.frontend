import appConsts from './common/appConsts.js';
import settingService from './api/settingService.js';
import session from './common/session.js';

$(async function () {
	$('body').tooltip({
		selector: '[data-bs-toggle="tooltip"]',
	});

	$('#Version').text(appConsts.VERSION);

	let settings = await settingService.getAll(session.nickname);

	if (settings != null) {
		session.settings = settings;
	}
});
