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

		if (settings.avatar != null) {
			$('#imagePreview').attr('src', `data:img/png;base64,${settings.avatar}`);
		} else {
			$('#imagePreview').attr('src', '/img/player.png');
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

		let avatar = $('#imageUpload').get(0).files[0];
		let formData = new FormData();

		formData.append('avatar', avatar);

		await settingService.update(session.nickname, settings);
		await settingService.loadAvatar(session.nickname, formData);
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

	//Загрузка аватара
	function readURL(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('#imagePreview').attr('src', e.target.result);
				$('#imagePreview').hide();
				$('#imagePreview').fadeIn(650);
			};
			reader.readAsDataURL(input.files[0]);
		}
	}

	$('#imageUpload').change(function () {
		readURL(this);
	});
});
