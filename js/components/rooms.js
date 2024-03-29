import roomService from './../api/roomService.js';
import session from './../common/session.js';
import playerService from './../api/playerService.js';
import APP_CONSTS from '../common/appConsts.js';
import { startGame } from './game.js';
import gameService from '../api/gameService.js';

// SignalR (Соединение)
const roomHub = new signalR.HubConnectionBuilder()
	.withUrl(APP_CONSTS.SERVER_URL + 'hubs/room', {
		skipNegotiation: true,
		transport: signalR.HttpTransportType.WebSockets,
	})
	.build();

roomHub.start();

export const returnToRoom = () => {
	$('#Game').addClass('d-none');
	$('#Room').removeClass('d-none');

	$('.playerStatus').text('Не готов');
	$('.playerStatus').removeClass('text-bg-success');
	$('.playerStatus').addClass('text-bg-danger');
	$('.playerStatus').removeClass('d-nonde');
	$('#ReadyBtn').text('Готов');
	$('#RoomFooter').removeClass('d-none');
};

//Отображение таблицы комнат на главной
export const init = async () => {
	let keyword = $('#SearchRoom').val();
	let rooms = await roomService.getAll(keyword);

	if (rooms === null) {
		$('#Rooms').addClass('d-none');
		$('#RoomsPlaceholder').removeClass('d-none');
		$('#RoomsPlaceholder').text('Не удалось загрузить информацию о комнатах!');
		return;
	}

	if (rooms.length > 0) {
		$('#Rooms').removeClass('d-none');
		$('#RoomsPlaceholder').addClass('d-none');
	} else {
		$('#Rooms').addClass('d-none');
		$('#RoomsPlaceholder').removeClass('d-none');
		$('#RoomsPlaceholder').text('Нет созданных комнат!');
	}

	$('#Rooms').empty();

	for (let room of rooms) {
		$('#Rooms').append(
			`
				<li class="room list-group-item d-flex align-items-center justify-content-between" data-name="${
					room.name
				}" data-is-have-password="${room.isHavePassword}"
				">
					<div class="d-flex align-items-center">
						${room.name}
						${room.isHavePassword ? `<i class="fa-solid fa-key ms-2" data-bs-toggle="tooltip" title="Комната с паролем"></i>` : ''}														
					</div>
					
					<div class="d-flex align-items-center">
						<div class="d-flex align-items-center">
							<i
								class="fa-solid fa-users me-1"
								data-bs-toggle="tooltip"
								data-bs-placement="top"
								title="Кол-во игроков"
							></i>
							${room.amountUsers} / ${room.maxAmountUsers}
						</div>
					</div>
				</li>
			`
		);
	}
};

$(function () {
	//Обработка клика по поиску комнаты
	$('#SearchButton').click(function () {
		init();
	});

	//Обработка нажатия клавиши Enter на поиске (код клавиши 13)
	$('#SearchRoom').on('keypress', function (e) {
		if (e.which == 13) {
			init();
			return;
		}
	});

	//Обновление модального окна комнаты
	const initRoom = (roomName, player, opponent) => {
		if (opponent != null) {
			$('#secondPlayer .playerName').text(opponent.nickname);

			if (opponent.role == 2) {
				$('#secondPlayer .crown').removeClass('d-none');
				$('#firstPlayer .crown').addClass('d-none');
			} else {
				$('#secondPlayer .crown').addClass('d-none');
			}

			if (opponent.isReady) {
				$('#secondPlayer .playerStatus').text('Готов');
				$('#secondPlayer .playerStatus').removeClass('text-bg-danger');
				$('#secondPlayer .playerStatus').addClass('text-bg-success');
				$('#secondPlayer .playerStatus').removeClass('d-nonde');
			} else {
				$('#secondPlayer .playerStatus').text('Не готов');
				$('#secondPlayer .playerStatus').removeClass('text-bg-success');
				$('#secondPlayer .playerStatus').addClass('text-bg-danger');
				$('#secondPlayer .playerStatus').removeClass('d-nonde');
			}

			if (opponent.avatar != null) {
				$('#secondPlayer .default-avatar').addClass('d-none');
				$('#secondPlayer .avatar').removeClass('d-none');
				$('#secondPlayer .avatar').attr('src', `data:img/png;base64,${opponent.avatar}`);
			} else {
				$('#secondPlayer .default-avatar').removeClass('d-none');
				$('#secondPlayer .avatar').addClass('d-none');
				$('#secondPlayer .avatar').attr('src', '');
			}

			$('#secondPlayer').removeClass('d-none');
		} else {
			$('#secondPlayer').addClass('d-none');
		}

		$('#firstPlayer .playerName').text(player.nickname);
		if (player.isReady) {
			$('#firstPlayer .playerStatus').text('Готов');
			$('#firstPlayer .playerStatus').removeClass('text-bg-danger');
			$('#firstPlayer .playerStatus').addClass('text-bg-success');
			$('#firstPlayer .playerStatus').removeClass('d-nonde');
			$('#ReadyBtn').text('Не готов');
		} else {
			$('#firstPlayer .playerStatus').text('Не готов');
			$('#firstPlayer .playerStatus').removeClass('text-bg-success');
			$('#firstPlayer .playerStatus').addClass('text-bg-danger');
			$('#firstPlayer .playerStatus').removeClass('d-nonde');
			$('#ReadyBtn').text('Готов');
		}

		if (player.avatar != null) {
			$('#firstPlayer .default-avatar').addClass('d-none');
			$('#firstPlayer .avatar').removeClass('d-none');
			$('#firstPlayer .avatar').attr('src', `data:img/png;base64,${player.avatar}`);
		} else {
			$('#firstPlayer .default-avatar').removeClass('d-none');
			$('#firstPlayer .avatar').addClass('d-none');
			$('#firstPlayer .avatar').attr('src', '');
		}

		$('#RoomNameTitle').text(roomName);

		$('#Game').addClass('d-none');
		$('#Room').removeClass('d-none');
		$('#RoomFooter').removeClass('d-none');

		if (player.role == 2) {
			$('#Start').removeClass('d-none');
			$('#firstPlayer .crown').removeClass('d-none');
			$('#secondPlayer .crown').addClass('d-none');
		} else {
			$('#Start').addClass('d-none');
			$('#firstPlayer .crown').addClass('d-none');
		}

		let playerReadyCount = $('.playerStatus.text-bg-success').length;
		if (
			playerReadyCount === 2 &&
			!$('#firstPlayer').hasClass('d-none') &&
			!$('#secondPlayer').hasClass('d-none') &&
			!$('#Start').hasClass('d-none')
		) {
			$('#Start').attr('disabled', false);
		} else {
			$('#Start').attr('disabled', true);
		}

		$('#RoomModal').modal('show');
	};

	// Автоматическое открытие комнаты
	const autoOpenRoom = async () => {
		if (!session.isAuth()) {
			return;
		}

		if (session.roomName === undefined) {
			return;
		}

		let roomInfo = await roomService.getInfo(session.roomName);

		if (roomInfo === null) {
			return;
		}

		let player = roomInfo.players.find((p) => p.nickname == session.nickname);
		let opponent = roomInfo.players.find((p) => p.nickname != session.nickname);

		// SignalR (Приемник)
		let roomName = session.roomName; //Замыкание -->
		roomHub.on('ChangeStateRoom' + roomName, function (players) {
			if (session.roomName != roomName) {
				return;
			}
			let player = players.find((p) => p.nickname == session.nickname);
			let opponent = players.find((p) => p.nickname != session.nickname);

			initRoom(session.roomName, player, opponent);
		}); //Замыкание <--

		// SignalR (Приемник)
		roomHub.on('StartGame' + roomName, async function (nickname) {
			$('#CoinFlip').removeClass('d-none');
			$('#CoinContent').addClass('d-none');

			let isMyTurn = session.nickname == nickname; //кто первый ходит (для монетки)
			$('#RoomModal').modal('hide');
			$('#CoinModal').modal('show');

			setTimeout(() => {
				$('#CoinFlip').addClass('d-none');
				$('#CoinContent').removeClass('d-none');

				if (isMyTurn) {
					$('#CoinImg').attr('src', '/img/win-coin.png');
					$('#CoinText').text('Вы ходите первым!');
				} else {
					$('#CoinImg').attr('src', '/img/lose-coin.png');
					$('#CoinText').text('Вы ходите вторым!');
				}

				setTimeout(() => {
					$('#CoinModal').modal('hide');
					$('#RoomModal').modal('show');

					startGame();
					session.isGameStarted = true;
				}, 2000);
			}, 700);
		});

		initRoom(session.roomName, player, opponent);

		if (roomInfo.isGameStarted) {
			startGame();
		}
	};

	autoOpenRoom();

	// Открытие комнаты
	const openRoom = async (roomName, isDoEnter = true, isHavePassword = false) => {
		let nickname = session.nickname;

		if (isDoEnter) {
			let password = null;
			if (isHavePassword) {
				const { value: psw } = await Swal.fire({
					title: 'Комната с паролем',
					input: 'password',
					inputLabel: 'Пароль',
					inputPlaceholder: 'Введите пароль',
					inputAttributes: {
						maxlength: 10,
						autocapitalize: 'off',
						autocorrect: 'off',
					},
				});

				if (psw) {
					password = psw;
				}
			}

			let players = await roomService.enter(nickname, roomName.toString(), password);

			if (players == null) {
				return;
			}

			session.figureType = players.player.figureType; //потом убрать
			initRoom(roomName, players.player, players.opponent);
		} else {
			initRoom(roomName, { nickname: session.nickname, isReady: false, role: 2 }, null);
		}

		session.roomName = roomName.toString();

		// SignalR (Приемник)
		roomHub.off('ChangeStateRoom' + roomName);
		roomHub.on('ChangeStateRoom' + roomName, function (players) {
			if (session.roomName != roomName) {
				return;
			}
			let player = players.find((p) => p.nickname == session.nickname);
			let opponent = players.find((p) => p.nickname != session.nickname);

			initRoom(session.roomName, player, opponent);
		});

		// Старт SignalR (Приемник)
		roomHub.off('StartGame' + roomName);
		roomHub.on('StartGame' + roomName, async function (nickname) {
			$('#CoinFlip').removeClass('d-none');
			$('#CoinContent').addClass('d-none');

			let isMyTurn = session.nickname == nickname; //кто первый ходит (для монетки)
			$('#RoomModal').modal('hide');
			$('#CoinModal').modal('show');

			setTimeout(() => {
				$('#CoinFlip').addClass('d-none');
				$('#CoinContent').removeClass('d-none');

				if (isMyTurn) {
					$('#CoinImg').attr('src', '/img/win-coin.png');
					$('#CoinText').text('Вы ходите первым!');
				} else {
					$('#CoinImg').attr('src', '/img/lose-coin.png');
					$('#CoinText').text('Вы ходите вторым!');
				}

				setTimeout(() => {
					$('#CoinModal').modal('hide');
					$('#RoomModal').modal('show');

					startGame();
					session.isGameStarted = true;
				}, 2000);
			}, 700);
		});

		// SignalR (Отправка сигнала)
		await roomHub.invoke('ChangeStateRoom', session.roomName);
	};

	// Открытие комнаты (клик по комнате)
	$(document).on('click', '.room', async function () {
		let roomName = $(this).data('name');
		let isHavePassword = $(this).data('isHavePassword');
		await openRoom(roomName, true, isHavePassword);
	});

	// Создание комнаты
	$('#CreateRoom').click(async function () {
		try {
			let roomName = $('#RoomName').val();

			if (roomName == '') {
				toastr.warning('Введите название комнаты!');
				return;
			}

			let password = $('#RoomPassword').val();

			if ($('#SwitchPassword').is(':checked') && password == '') {
				toastr.warning('Пароль не введен!');
				return;
			}

			await roomService.createRoom(roomName, session.nickname, password);
			await roomHub.invoke('CreateRoom', roomName);

			$('#CreateRoomModal').modal('hide');
			await openRoom(roomName, false);

			$('#RoomName').val('');
			$('#SwitchPassword').prop('checked', false);
			$('#RoomPassword').attr('disabled', true);
			$('#RoomPassword').val('');
		} catch {}
	});

	//Когда происходит создание комнаты, мы обновляем список комнат
	roomHub.on('CreateRoom', function () {
		init();
	});

	//Покинуть комнату
	$('.exit-room').click(async function () {
		try {
			await roomService.exit(session.nickname);

			roomHub.off('ChangeStateRoom' + session.roomName);
			await roomHub.invoke('ChangeStateRoom', session.roomName);

			session.exitRoom();
			init();
		} catch {}
	});

	//Когда происходит удаление комнат, мы обновляем список комнат
	roomHub.on('DeleteRoom', function () {
		init();
	});

	//Изменить статус готовности в комнате
	$('#ReadyBtn').click(async function () {
		let nickname = session.nickname;
		let isReady = await playerService.changeReady(nickname);

		if (isReady == null) return;

		if (isReady === true) {
			$('#firstPlayer .playerStatus').text('Готов');
			$('#firstPlayer .playerStatus').removeClass('text-bg-danger');
			$('#firstPlayer .playerStatus').addClass('text-bg-success');
			$('#firstPlayer .playerStatus').removeClass('d-nonde');
			$('#ReadyBtn').text('Не готов');
		} else {
			$('#firstPlayer .playerStatus').text('Не готов');
			$('#firstPlayer .playerStatus').removeClass('text-bg-success');
			$('#firstPlayer .playerStatus').addClass('text-bg-danger');
			$('#firstPlayer .playerStatus').removeClass('d-nonde');
			$('#ReadyBtn').text('Готов');
		}

		await roomHub.invoke('ChangeStateRoom', session.roomName);
	});

	//Обновить список комнат
	$('#RefreshRooms').click(function () {
		init();
	});

	// SignalR (Отправка сигнала)
	$('#Start').click(async function () {
		await gameService.startGame(session.roomName);
		roomHub.invoke('StartGame', session.roomName);
	});

	$('#SwitchPassword').click(function () {
		$('#RoomPassword').attr('disabled', !this.checked);
	});
});
