const DEFAULT_EXPIRES = 10;

class Session {
	#nickname;
	#roomName;
	#figureType;
	#isGameStarted;

	constructor() {
		this.#nickname = $.cookie('nickname');
		this.#roomName = $.cookie('roomName');
		this.#figureType = $.cookie('figureType');
		this.#isGameStarted = $.cookie('isGameStarted');
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

	get isGameStarted() {
		return this.#isGameStarted;
	}

	set isGameStarted(value) {
		this.#isGameStarted = value;
		$.cookie('isGameStarted', value, { expires: DEFAULT_EXPIRES });
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
