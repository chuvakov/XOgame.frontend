const DEFAULT_EXPIRES = 10;

class Session {
	#nickname;
	#roomName;
	#figureType;

	constructor() {
		this.#nickname = $.cookie('nickname');
		this.#roomName = $.cookie('roomName');
		this.#figureType = $.cookie('figureType');
	}

	get nickname() {
		return this.#nickname;
	}

	set nickname(nickname) {
		this.#nickname = nickname;
		$.cookie('nickname', nickname, { expires: DEFAULT_EXPIRES });
	}

	get roomName() {
		return this.#roomName;
	}

	set roomName(roomName) {
		this.#roomName = roomName;
		$.cookie('roomName', roomName, { expires: DEFAULT_EXPIRES });
	}

	get figureType() {
		return this.#figureType;
	}

	set figureType(value) {
		this.#figureType = value;
		$.cookie('figureType', value, { expires: DEFAULT_EXPIRES });
	}

	isAuth() {
		return this.nickname != undefined;
	}

	logout() {
		$.removeCookie('nickname');
		this.#nickname = undefined;
	}

	exitRoom() {
		$.removeCookie('roomName');
		this.#roomName = undefined;
	}
}

export default new Session('roomName');
