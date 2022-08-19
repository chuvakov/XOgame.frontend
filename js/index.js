import appConsts from './common/appConsts.js';


$(async function () {
	$('body').tooltip({
		selector: '[data-bs-toggle="tooltip"]',
	});

	$('#Version').text(appConsts.VERSION);
});
