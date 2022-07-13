import APP_CONSTS from '../common/appConsts.js';
import session from '../common/session.js';

class RoomService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Rooms';
	}

	async getAll() {
		let result = null;
		await axios
			.get(this.url + '/GetAll')
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				toastr.error('Не удалось загрузить список комнат!');
			});

		return result;
	}

	async createRoom(name, nickname, password) {
		await axios
			.post(this.url + '/Create', {
				name: name,
				managerNickname: nickname,
				password: password,
			})
			.then(function (response) {
				toastr.success('Комната создана успешно!');
			})
			.catch(function (error) {
				toastr.error('Не удалось создать комнату!');
				throw new Error();
			});
	}

	async enter(nickname, roomName, password) {
		let result = null;
		await axios
			.post(this.url + '/Enter', {
				nickname: nickname,
				roomName: roomName,
				password: password,
			})
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				toastr.error('Не удалось войти в комнату!');
			});
		return result;
	}

	async exit(nickname) {
		await axios.post(this.url + `/Exit?nickname=${nickname}`).catch(function (error) {
			toastr.error('Не удалось покинуть комнату!');
			throw new Error();
		});
	}

	async getInfo(roomName) {
		let result = null;
		await axios
			.get(this.url + '/GetInfo', {
				params: {
					name: roomName,
				},
			})
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				toastr.error('Не удалось получить информацию о комнате!');
			});

		return result;
	}
}

export default new RoomService();
