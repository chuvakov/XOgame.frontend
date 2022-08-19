import APP_CONSTS from '../common/appConsts.js';

class AccountService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Account';
	}

	async login(nickname, password) {
		let result = null;
		await axios
			.post(this.url + '/Login', {
				nickname: nickname,
				password: password,
			})
			.then(function (response) {
				result = response.data;
				toastr.success('Авторизация прошла успешно!');
			})
			.catch(function (error) {
				toastr.error('Не удалось авторизоваться!');
				throw new Error();
			});
		return result;
	}

	async register(nickname, password) {
		await axios
			.post(this.url + '/Register', {
				nickname: nickname,
				password: password,
			})
			.then(function () {
				toastr.success('Регистрация прошла успешно!');
			})
			.catch(function (error) {
				toastr.error('Не удалось зарегестрироваться!');
				throw new Error();
			});
	}
}

export default new AccountService();
