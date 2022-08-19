import accountService from './../api/accountService.js';
import session from './../common/session.js';
import { init } from './rooms.js';
import settingService from '../api/settingService.js';

const redirectToAuth = () => {
	$('#Main').addClass('d-none');
	$('#Authorization').removeClass('d-none');
};

$(async function () {
	const initMain = async () => {
		await init();

		let settings = await settingService.getAll(session.nickname);

		if (settings != null) {
			session.settings = settings;
		}
	};

	const initPlayer = async () => {
		if (session.isAuth()) {
			$('#Main').removeClass('d-none');
			$('#Authorization').addClass('d-none');

			$('#Settings').removeClass('d-none');
			$('[data-bs-target="#CreateRoomModal"]').removeClass('d-none');

			$('#Logout').removeClass('d-none');
			$('#Auth').addClass('d-none');

			$('#NicknameInput').val(session.nickname);
			$('#NicknameInput').attr('disabled', true);

			await initMain();
		} else {
			redirectToAuth();
		}
	};

	await initPlayer();

	$('#LoginBtn').click(async function () {
		try {
			let nickname = $('#Login').val();

			if (nickname == '') {
				toastr.warning('Введите логин!');
				return;
			}

			let password = $('#Password').val();

			if (password == '') {
				toastr.warning('Введите пароль!');
				return;
			}

			let token = await accountService.login(nickname, password);

			if (token == null) {
				return;
			}

			session.nickname = nickname;
			session.token = token;

			await initPlayer();
		} catch {}
	});

	$('#Logout').click(async function () {
		session.logout();
		await initPlayer();
	});

	$('#CreateAccount').click(function () {
		$('#Authorization').addClass('d-none');
		$('#Register').removeClass('d-none');
	});

	$('#ReturnLogin').click(function () {
		$('#Authorization').removeClass('d-none');
		$('#Register').addClass('d-none');
	});

	$('#RegisterBtn').click(async function () {
		let nickname = $('#LoginRegister').val();
		let password = $('#PasswordRegister').val();
		let passwordRepeat = $('#PasswordRegisterRepeat').val();

		if (nickname == '') {
			toastr.warning('Поле логин пустое!');
			return;
		}

		if (password == '') {
			toastr.warning('Поле пароль пустое!');
			return;
		}

		if (passwordRepeat == '') {
			toastr.warning('Поле повтор пароля пустое!');
			return;
		}

		if (passwordRepeat != password) {
			toastr.warning('Пароли не совпадают!');
			return;
		}

		try {
			await accountService.register(nickname, password);

			$('#Authorization').removeClass('d-none');
			$('#Register').addClass('d-none');

			$('#LoginRegister').val('');
			$('#PasswordRegister').val('');
			$('#PasswordRegisterRepeat').val('');

			$('#Login').val('');
			$('#Password').val('');
		} catch (error) {
			console.log(error);
		}
	});
});

export default redirectToAuth;
