import roomService from './../api/roomService.js';
import session from './../common/session.js';
import playerService from './../api/playerService.js';
import APP_CONSTS from '../common/appConsts.js';
import { startGame } from './game.js';
import gameService from '../api/gameService.js';

// Обработка замка комнаты
const initLocks = () => {
	if (session.isAuth()) {
		$('.lock').addClass('d-none');
	} else {
		$('.lock').removeClass('d-none');
	}
};

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

$(function () {
	//Отображение таблицы комнат на главной
	const init = async () => {
		let rooms = await roomService.getAll();

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
                    <li class="room list-group-item d-flex align-items-center justify-content-between" data-name="${room.name}">
                        ${room.name}
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
                            <i                                  
                                class="lock fa-solid fa-lock ms-5"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Авторизуйтесь"
                            ></i>
                        </div>
                    </li>
                `
			);
		}

		initLocks();
	};

	//Обновление модального окна комнаты
	const initRoom = (roomName, player, opponent) => {
		if (opponent != null) {
			$('#secondPlayer .playerName').text(opponent.nickname);

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
		$('#RoomNameTitle').text(roomName);

		$('#Game').addClass('d-none');
		$('#Room').removeClass('d-none');
		$('#RoomFooter').removeClass('d-none');

		if (player.role == 2) {
			$('#Start').removeClass('d-none');
		} else {
			$('#Start').addClass('d-none');
		}

		let playerReadyCount = $('.playerStatus.text-bg-success').length;
		if (
			playerReadyCount === 2 &&
			!$('#firstPlayer').hasClass('d-none') &&
			!$('#secondPlayer').hasClass('d-none') &&
			!$('#Start').hasClass('d-none')
		) {
			console.log(1);
			$('#Start').attr('disabled', false);
		} else {
			console.log(2);
			$('#Start').attr('disabled', true);
		}

		$('#RoomModal').modal('show');
	};

	// Автоматическое открытие комнаты
	const autoOpenRoom = async () => {
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
		roomHub.on('StartGame' + roomName, async function () {
			await gameService.startGame(roomName);
			startGame();
			session.isGameStarted = true;
		});

		initRoom(session.roomName, player, opponent);

		if (roomInfo.isGameStarted) {
			startGame();
		}
	};

	init();
	autoOpenRoom();

	// Открытие комнаты
	const openRoom = async (roomName, isDoEnter = true) => {
		let nickname = session.nickname;

		if (isDoEnter) {
			let players = await roomService.enter(nickname, roomName);

			if (players == null) {
				return;
			}

			session.figureType = players.player.figureType; //потом убрать
			initRoom(roomName, players.player, players.opponent);
		} else {
			initRoom(roomName, { nickname: session.nickname, isReady: false, role: 2 }, null);
		}

		session.roomName = roomName;

		// SignalR (Приемник)
		roomHub.on('ChangeStateRoom' + roomName, function (players) {
			if (session.roomName != roomName) {
				return;
			}
			let player = players.find((p) => p.nickname == session.nickname);
			let opponent = players.find((p) => p.nickname != session.nickname);

			initRoom(session.roomName, player, opponent);
		});

		// SignalR (Приемник)
		roomHub.on('StartGame' + roomName, async function () {
			await gameService.startGame(roomName);
			startGame();
			session.isGameStarted = true;
		});

		// SignalR (Отправка сигнала)
		await roomHub.invoke('ChangeStateRoom', roomName);
	};

	// Открытие комнаты (клик по комнате)
	$(document).on('click', '.room', async function () {
		let roomName = $(this).data('name');
		await openRoom(roomName);
	});

	// Создание комнаты
	$('#CreateRoom').click(async function () {
		try {
			let roomName = $('#RoomName').val();

			if (roomName == '') {
				toastr.warning('Введите название комнаты!');
				return;
			}

			await roomService.createRoom(roomName, session.nickname);
			await roomHub.invoke('CreateRoom', roomName);

			$('#CreateRoomModal').modal('hide');
			await openRoom(roomName, false);

			$('#RoomName').val('');
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

	$('#RefreshRooms').click(function () {
		init();
	});

	// SignalR (Отправка сигнала)
	$('#Start').click(function () {
		roomHub.invoke('StartGame', session.roomName);
	});
});

export default initLocks;
