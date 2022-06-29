import roomService from './../api/roomService.js';
import session from './../common/session.js';
import playerService from './../api/playerService.js';
import APP_CONSTS from '../common/appConsts.js';

// Обработка замка комнаты
const initLocks = () => {
	if (session.isAuth()) {
		$('.lock').addClass('d-none');
	} else {
		$('.lock').removeClass('d-none');
	}
};

// SignalR (Соединение)
const hubConnection = new signalR.HubConnectionBuilder()
	.withUrl(APP_CONSTS.SERVER_URL + 'hubs/room', {
		skipNegotiation: true,
		transport: signalR.HttpTransportType.WebSockets,
	})
	.build();

hubConnection.start();

$(function () {

	//Отображение таблицы комнат на главной
	const init = async () => {
		let rooms = await roomService.getAll();

		if (rooms === null) return;

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
		} else {
			$('#firstPlayer .playerStatus').text('Не готов');
			$('#firstPlayer .playerStatus').removeClass('text-bg-success');
			$('#firstPlayer .playerStatus').addClass('text-bg-danger');
			$('#firstPlayer .playerStatus').removeClass('d-nonde');
		}
		$('#RoomNameTitle').text(roomName);

		$('#RoomModal').modal('show');
	};

	// Автоматическое открытие комнаты
	const openRoom = async () => {
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
		hubConnection.on('ChangeStateRoom' + roomName, function (players) {
			if (session.roomName != roomName) {
				return;
			}
			let player = players.find((p) => p.nickname == session.nickname);
			let opponent = players.find((p) => p.nickname != session.nickname);

			initRoom(session.roomName, player, opponent);
		}); //Замыкание <--

		initRoom(session.roomName, player, opponent);
	};

	init();
	openRoom();

	// Открытие комнаты
	$(document).on('click', '.room', async function () {
		let roomName = $(this).data('name');
		let nickname = session.nickname;

		let players = await roomService.enter(nickname, roomName);

		if (players == null) {
			return;
		}

		session.figureType = players.player.figureType;

		session.roomName = roomName;
		initRoom(roomName, players.player, players.opponent);
		console.log(session.roomName);

		// SignalR (Приемник)
		hubConnection.on('ChangeStateRoom' + roomName, function (players) {
			console.log('ChangeStateRoom' + roomName);
			if (session.roomName != roomName) {
				return;
			}
			let player = players.find((p) => p.nickname == session.nickname);
			let opponent = players.find((p) => p.nickname != session.nickname);

			initRoom(session.roomName, player, opponent);
		});

		// SignalR (Отправка сигнала)
		await hubConnection.invoke('ChangeStateRoom', roomName);
	});

	$('#CreateRoom').click(async function () {
		let roomName = $('#RoomName').val();

		if (roomName == '') {
			toastr.warning('Введите название комнаты!');
			return;
		}

		await roomService.createRoom(roomName);
		await hubConnection.invoke('CreateRoom', roomName);
		$('#CreateRoomModal').modal('hide');
	});

	//Создать комнату
	hubConnection.on('CreateRoom', function () {
		init();
	});

	//Покинуть комнату
	$('.exit-room').click(async function () {
		try {
			await roomService.exit(session.nickname);
			await hubConnection.invoke('ChangeStateRoom', session.roomName);

			session.exitRoom();
			init();
		} catch {}
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

		await hubConnection.invoke('ChangeStateRoom', session.roomName);
	});

	$('#RefreshRooms').click(function () {
		init();
	});
});

export default initLocks;
