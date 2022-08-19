import APP_CONSTS from '../common/appConsts.js';
import session from '../common/session.js';
import redirectToAuth from '../components/auth.js';

class RoomService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Rooms';
	}

	async getAll(keyword = null) {
		let result = null;
		await axios
			.get(this.url + '/GetAll', {
				params: {
					keyword: keyword,
				},
				headers: {
					Authorization: 'Bearer ' + session.token,
				},
			})
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				if (error.response.status == 401) {
					redirectToAuth();
				}
				toastr.error('Не удалось загрузить список комнат!');
			});

		return result;
	}

	async createRoom(name, nickname, password) {
		await axios
			.post(
				this.url + '/Create',
				{
					name: name,
					managerNickname: nickname,
					password: password,
				},
				{
					headers: {
						Authorization: 'Bearer ' + session.token,
					},
				}
			)
			.then(function (response) {
				toastr.success('Комната создана успешно!');
			})
			.catch(function (error) {
				if (error.response.status == 401) {
					redirectToAuth();
				}
				toastr.error('Не удалось создать комнату!');
				throw new Error();
			});
	}

	async enter(nickname, roomName, password) {
		let result = null;
		await axios
			.post(
				this.url + '/Enter',
				{
					nickname: nickname,
					roomName: roomName,
					password: password,
				},
				{
					headers: {
						Authorization: 'Bearer ' + session.token,
					},
				}
			)
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				if (error.response.status == 401) {
					redirectToAuth();
				}
				toastr.error('Не удалось войти в комнату!');
			});
		return result;
	}

	async exit(nickname) {
		await axios
			.post(
				this.url + `/Exit?nickname=${nickname}`,
				{},
				{
					headers: {
						Authorization: 'Bearer ' + session.token,
					},
				}
			)
			.catch(function (error) {
				if (error.response.status == 401) {
					redirectToAuth();
				}
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
				headers: {
					Authorization: 'Bearer ' + session.token,
				},
			})
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				if (error.response.status == 401) {
					redirectToAuth();
				}
				toastr.error('Не удалось получить информацию о комнате!');
			});

		return result;
	}
}

export default new RoomService();
