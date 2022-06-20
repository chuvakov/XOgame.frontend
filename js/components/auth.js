import accountService from './../api/accountService.js';
import session from './../common/session.js';
import initLocks from './rooms.js';

$(function () {
	const initPlayer = () => {
		if (session.isAuth()) {
			$('[data-bs-target="#CreateRoomModal"]').removeClass('d-none');

			$('#Logout').removeClass('d-none');
			$('#Auth').addClass('d-none');

			$('#NicknameInput').val(session.nickname);
			$('#NicknameInput').attr('disabled', true);
		} else {
			$('[data-bs-target="#CreateRoomModal"]').addClass('d-none');

			$('#Logout').addClass('d-none');
			$('#Auth').removeClass('d-none');

			$('#NicknameInput').val('');
			$('#NicknameInput').attr('disabled', false);
		}
	};

	initPlayer();

	$('#Auth').click(async function () {
		try {
			let nickname = $('#NicknameInput').val();

			if (nickname == '') {
				toastr.warning('Введите ник!');
				return;
			}

			await accountService.login(nickname);
			session.nickname = nickname;

			initPlayer();
			initLocks();
		} catch {}
	});

	$('#Logout').click(function () {
		session.logout();

		initPlayer();
		initLocks();
	});
});
