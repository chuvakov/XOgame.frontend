import APP_CONSTS from '../common/appConsts.js';

class SettingService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Settings';
	}

	async getAll(nickname) {
		let result = null;
		await axios
			.get(this.url + '/GetAll', {
				params: {
					nickname: nickname,
				},
			})
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				toastr.error('Не удалось загрузить настройки!');
			});

		return result;
	}

	async update(nickname, settings) {
		await axios
			.post(this.url + '/Update', {
				nickname: nickname,
				settings: settings,
			})
			.then(function () {
				toastr.success('Настройки сохранены!');
			})
			.catch(function (error) {
				toastr.error('Не удалось сохранить настройки!');
			});
	}

	async loadAvatar(nickname, avatar) {
		console.log(avatar)
		await axios
			.post(this.url + '/LoadAvatar?nickname=' + nickname, avatar, {
				headers: {
					'Content-type': 'multipart/form-data',
				},
			})
			.then(function () {
				toastr.success('Настройки сохранены!');
			})
			.catch(function (error) {
				toastr.error('Не удалось сохранить настройки!');
			});
	}
}

export default new SettingService();
