import settingService from '../api/settingService.js';
import session from '../common/session.js';

$(function () {
	//Инициализация раздела с настройками
	const openModal = async () => {
		let settings = await settingService.getAll(session.nickname);

		if (settings == null) {
			return;
		}

		session.settings = settings;

		$('#SwitchWin').prop('checked', settings.soundSettings.isEnabledWin);
		$('#SwitchLose').prop('checked', settings.soundSettings.isEnabledLose);
		$('#SwitchStartGame').prop('checked', settings.soundSettings.isEnabledStart);
		$('#SwitchStep').prop('checked', settings.soundSettings.isEnabledStep);
		$('#SwitchDraw').prop('checked', settings.soundSettings.isEnabledDraw);

		if ($('.soundSetting:checked').length != $('.soundSetting').length) {
			$('#SwitchSoundAll').prop('checked', false);
		} else {
			$('#SwitchSoundAll').prop('checked', true);
		}

		$('#SettingsModal').modal('show');
	};

	$('#Settings').on('click', async function (e) {
		await openModal();
	});

	//Обновление раздела с настройками (Изменение настроек)
	const update = async () => {
		let settings = {
			soundSettings: {
				isEnabledWin: $('#SwitchWin').is(':checked'),
				isEnabledLose: $('#SwitchLose').is(':checked'),
				isEnabledStep: $('#SwitchStep').is(':checked'),
				isEnabledDraw: $('#SwitchDraw').is(':checked'),
				isEnabledStart: $('#SwitchStartGame').is(':checked'),
			},
		};
		await settingService.update(session.nickname, settings);
		session.settings = settings;
	};

	$('#SwitchSoundAll').click(function () {
		let result = $(this).is(':checked');
		$('.soundSetting').prop('checked', result);
	});

	$('#SaveSettings').on('click', async function () {
		await update();
		$('#SettingsModal').modal('hide');
	});
});
