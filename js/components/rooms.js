import roomService from './../api/roomService.js';
import session from './../common/session.js';

const initLocks = () => {
	if (session.isAuth()) {
		$('.lock').addClass('d-none');
	} else {
		$('.lock').removeClass('d-none');
	}
};

$(function () {
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

	$('#CreateRoom').click(async function () {
		let roomName = $('#RoomName').val();

		if (roomName == '') {
			toastr.warning('Введите название комнаты!');
			return;
		}

		await roomService.createRoom(roomName);
		init();
		$('#CreateRoomModal').modal('hide');
	});

	init();

	$(document).on('click', '.room', async function () {
		let roomName = $(this).data('name');
		let nickname = session.nickname;

		let players = await roomService.enter(nickname, roomName);

		if (players == null) {
			return;
		}

		if (players.opponent != null) {
			$('#secondPlayer .playerName').text(players.opponent.nickname);

			if (players.opponent.isReady) {
				$('#secondPlayer .playerStatus').text('Готов');
				$('#secondPlayer .playerStatus').removeClass('text-bg-danger');
				$('#secondPlayer .playerStatus').addClass('text-bg-success');
				$('#secondPlayer .playerStatus').removeClass('d-nonde');
			}

			$('#secondPlayer').removeClass('d-none');
		}

		$('#firstPlayer .playerName').text(players.player.nickname);
		$('#RoomNameTitle').text(roomName);

		$('#RoomModal').modal('show');
	});

	$('.exit-room').click(async function () {
		await roomService.exit(session.nickname);
		init();
	});
});

export default initLocks;
