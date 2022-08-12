import APP_CONSTS from '../common/appConsts.js';

class EmojiService {
	constructor() {
		this.url = APP_CONSTS.SERVER_URL + 'api/Emoji';
	}

	async getAllGroups() {
		let result = null;
		await axios
			.get(this.url + '/GetAllGroups')
			.then(function (response) {
				result = response.data;
			})
			.catch(function (error) {
				toastr.error('Не удалось получить эмоджи');
				throw new Error();
			});
		return result;
	}
}

export default new EmojiService();
