import APP_CONSTS from '../common/appConsts.js';

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

	async createRoom(name) {
		await axios
			.post(this.url + '/Create', {
				name: name,
			})
			.then(function (response) {
				toastr.success('Комната создана успешно!');
			})
			.catch(function (error) {
				toastr.error('Не удалось создать комнату!');
			});
	}

	async enter(nickname, roomName) {
		let result = null;
		await axios
			.post(this.url + '/Enter', {
				nickname: nickname,
				roomName: roomName,
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
