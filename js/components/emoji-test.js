$(function () {
	$(document).click(function (e) {
		if (
			$(e.target).attr('class') != '.intercom-composer-emoji-popover' &&
			$(e.target).parents('.intercom-composer-emoji-popover').length == 0
		) {
			$('.intercom-composer-emoji-popover').removeClass('active');
		}
	});

	const emojiPicker = (options) => {
		let $selector = $(options.selector);
		let $input = $(options.input);

		$selector.wrap('<div class="emoji-picker"></div>');

		$selector.after(`
        <div class="intercom-composer-popover intercom-composer-emoji-popover" data-emoji-picker="${options.selector}">
			<div class="intercom-emoji-picker">
				<div class="intercom-composer-popover-header">
					<input class="intercom-composer-popover-input" placeholder="Поиск" value="" />
				</div>
				<div class="intercom-composer-popover-body-container">
					<div class="intercom-composer-popover-body">
						<div class="intercom-emoji-picker-groups">
							
						</div>
					</div>
				</div>
			</div>
			<div class="intercom-composer-popover-caret"></div>
		</div>
        `);

		let $popover = $selector.siblings('.intercom-composer-emoji-popover').find('.intercom-emoji-picker-groups');

		let emojies = [];

		if (options.emojies != undefined) {
			emojies = options.emojies;
		} else {
			//колл бэк с сервера
			emojies = options.ajax();
		}

		emojies.forEach((group) => {
			$popover.append(
				`
					<div class="intercom-emoji-picker-group">
								<div class="intercom-emoji-picker-group-title">${group.title}</div>
								${group.emojies
									.map(
										(emoji) =>
											`<span class="intercom-emoji-picker-emoji" title="${emoji.title}">${emoji.text}</span>`
									)
									.join('')}				
					</div>
				`
			);
		});

		$selector.click(function (e) {
			e.stopPropagation();
			$(`.intercom-composer-emoji-popover[data-emoji-picker="${options.selector}"]`).toggleClass('active');
		});

		$(`.intercom-composer-emoji-popover[data-emoji-picker="${options.selector}"]`)
			.find('.intercom-emoji-picker-emoji')
			.click(function (e) {
				let text = $input.val();
				$input.val(text + $(this).html());
			});

		//поиск
		$(`.intercom-composer-emoji-popover[data-emoji-picker="${options.selector}"]`)
			.find('.intercom-composer-popover-input')
			.on('input', function () {
				var query = this.value;
				if (query != '') {
					$popover.find(".intercom-emoji-picker-emoji:not([title*='" + query + "'])").hide();
				} else {
					$popover.find('.intercom-emoji-picker-emoji').show();
				}
			});
	};

	let emojies = [
		{
			title: 'Часто используемый',
			emojies: [
				{
					title: 'thumbs_up',
					text: '👍',
				},
				{
					title: '-1',
					text: '👎',
				},
				{
					title: 'sob',
					text: '😭',
				},
				{
					title: 'confused',
					text: '😕',
				},
				{
					title: 'neutral_face',
					text: '😐',
				},
				{
					title: 'blush',
					text: '😊',
				},
				{
					title: 'heart_eyes',
					text: '😍',
				},
			],
		},
		{
			title: 'Люди',
			emojies: [
				{
					title: 'smile',
					text: '😄',
				},
				{
					title: 'smiley',
					text: '😃',
				},
				{
					title: 'grinning',
					text: '😀',
				},
				{
					title: 'blush',
					text: '😊',
				},
				{
					title: 'wink',
					text: '😉',
				},
				{
					title: 'heart_eyes',
					text: '😍',
				},
				{
					title: 'kissing_heart',
					text: '😘',
				},
				{
					title: 'kissing_closed_eyes',
					text: '😚',
				},
				{
					title: 'kissing',
					text: '😗',
				},
				{
					title: 'kissing_smiling_eyes',
					text: '😙',
				},
				{
					title: 'stuck_out_tongue_winking_eye',
					text: '😜',
				},
				{
					title: 'stuck_out_tongue_closed_eyes',
					text: '😝',
				},
				{
					title: 'stuck_out_tongue',
					text: '😛',
				},
				{
					title: 'flushed',
					text: '😳',
				},
				{
					title: 'grin',
					text: '😁',
				},
				{
					title: 'pensive',
					text: '😔',
				},
				{
					title: 'relieved',
					text: '😌',
				},
				{
					title: 'unamused',
					text: '😒',
				},
				{
					title: 'disappointed',
					text: '😞',
				},
				{
					title: 'persevere',
					text: '😣',
				},
				{
					title: 'cry',
					text: '😢',
				},
				{
					title: 'joy',
					text: '😂',
				},
				{
					title: 'sob',
					text: '😭',
				},
				{
					title: 'sleepy',
					text: '😪',
				},
				{
					title: 'disappointed_relieved',
					text: '😥',
				},
				{
					title: 'cold_sweat',
					text: '😰',
				},
				{
					title: 'sweat_smile',
					text: '😅',
				},
				{
					title: 'sweat',
					text: '😓',
				},
				{
					title: 'weary',
					text: '😩',
				},
				{
					title: 'tired_face',
					text: '😫',
				},
				{
					title: 'fearful',
					text: '😨',
				},
				{
					title: 'scream',
					text: '😱',
				},
				{
					title: 'angry',
					text: '😠',
				},
				{
					title: 'rage',
					text: '😡',
				},
				{
					title: 'triumph',
					text: '😤',
				},
				{
					title: 'confounded',
					text: '😖',
				},
				{
					title: 'laughing',
					text: '😆',
				},
				{
					title: 'yum',
					text: '😋',
				},
				{
					title: 'mask',
					text: '😷',
				},
				{
					title: 'sunglasses',
					text: '😎',
				},
				{
					title: 'sleeping',
					text: '😴',
				},
				{
					title: 'dizzy_face',
					text: '😵',
				},
				{
					title: 'astonished',
					text: '😲',
				},
				{
					title: 'worried',
					text: '😟',
				},
				{
					title: 'frowning',
					text: '😦',
				},
				{
					title: 'anguished',
					text: '😧',
				},
				{
					title: 'imp',
					text: '👿',
				},
				{
					title: 'open_mouth',
					text: '😮',
				},
				{
					title: 'grimacing',
					text: '😬',
				},
				{
					title: 'neutral_face',
					text: '😐',
				},
				{
					title: 'confused',
					text: '😕',
				},
				{
					title: 'hushed',
					text: '😯',
				},
				{
					title: 'smirk',
					text: '😏',
				},
				{
					title: 'expressionless',
					text: '😑',
				},
				{
					title: 'man_with_gua_pi_mao',
					text: '👲',
				},
				{
					title: 'man_with_turban',
					text: '👳',
				},
				{
					title: 'cop',
					text: '👮',
				},
				{
					title: 'construction_worker',
					text: '👷',
				},
				{
					title: 'guardsman',
					text: '💂',
				},
				{
					title: 'baby',
					text: '👶',
				},
				{
					title: 'boy',
					text: '👦',
				},
				{
					title: 'girl',
					text: '👧',
				},
				{
					title: 'man',
					text: '👨',
				},
				{
					title: 'woman',
					text: '👩',
				},
				{
					title: 'older_man',
					text: '👴',
				},
				{
					title: 'older_woman',
					text: '👵',
				},
				{
					title: 'person_with_blond_hair',
					text: '👱',
				},
				{
					title: 'angel',
					text: '👼',
				},
				{
					title: 'princess',
					text: '👸',
				},
				{
					title: 'smiley_cat',
					text: '😺',
				},
				{
					title: 'smile_cat',
					text: '😸',
				},
				{
					title: 'heart_eyes_cat',
					text: '😻',
				},
				{
					title: 'kissing_cat',
					text: '😽',
				},
				{
					title: 'smirk_cat',
					text: '😼',
				},
				{
					title: 'scream_cat',
					text: '🙀',
				},
				{
					title: 'crying_cat_face',
					text: '😿',
				},
				{
					title: 'joy_cat',
					text: '😹',
				},
				{
					title: 'pouting_cat',
					text: '😾',
				},
				{
					title: 'japanese_ogre',
					text: '👹',
				},
				{
					title: 'japanese_goblin',
					text: '👺',
				},
				{
					title: 'see_no_evil',
					text: '🙈',
				},
				{
					title: 'hear_no_evil',
					text: '🙉',
				},
				{
					title: 'speak_no_evil',
					text: '🙊',
				},
				{
					title: 'skull',
					text: '💀',
				},
				{
					title: 'alien',
					text: '👽',
				},
				{
					title: 'hankey',
					text: '💩',
				},
				{
					title: 'fire',
					text: '🔥',
				},
				{
					title: 'sparkles',
					text: '✨',
				},
				{
					title: 'star2',
					text: '🌟',
				},
				{
					title: 'dizzy',
					text: '💫',
				},
				{
					title: 'boom',
					text: '💥',
				},
				{
					title: 'anger',
					text: '💢',
				},
				{
					title: 'sweat_drops',
					text: '💦',
				},
				{
					title: 'droplet',
					text: '💧',
				},
				{
					title: 'zzz',
					text: '💤',
				},
				{
					title: 'dash',
					text: '💨',
				},
				{
					title: 'ear',
					text: '👂',
				},
				{
					title: 'eyes',
					text: '👀',
				},
				{
					title: 'nose',
					text: '👃',
				},
				{
					title: 'tongue',
					text: '👅',
				},
				{
					title: 'lips',
					text: '👄',
				},
				{
					title: 'thumbs_up',
					text: '👍',
				},
				{
					title: '-1',
					text: '👎',
				},
				{
					title: 'ok_hand',
					text: '👌',
				},
				{
					title: 'facepunch',
					text: '👊',
				},
				{
					title: 'fist',
					text: '✊',
				},
				{
					title: 'wave',
					text: '👋',
				},
				{
					title: 'hand',
					text: '✋',
				},
				{
					title: 'open_hands',
					text: '👐',
				},
				{
					title: 'point_up_2',
					text: '👆',
				},
				{
					title: 'point_down',
					text: '👇',
				},
				{
					title: 'point_right',
					text: '👉',
				},
				{
					title: 'point_left',
					text: '👈',
				},
				{
					title: 'raised_hands',
					text: '🙌',
				},
				{
					title: 'pray',
					text: '🙏',
				},
				{
					title: 'clap',
					text: '👏',
				},
				{
					title: 'muscle',
					text: '💪',
				},
				{
					title: 'walking',
					text: '🚶',
				},
				{
					title: 'runner',
					text: '🏃',
				},
				{
					title: 'dancer',
					text: '💃',
				},
				{
					title: 'couple',
					text: '👫',
				},
				{
					title: 'family',
					text: '👪',
				},
				{
					title: 'couplekiss',
					text: '💏',
				},
				{
					title: 'couple_with_heart',
					text: '💑',
				},
				{
					title: 'dancers',
					text: '👯',
				},
				{
					title: 'ok_woman',
					text: '🙆',
				},
				{
					title: 'no_good',
					text: '🙅',
				},
				{
					title: 'information_desk_person',
					text: '💁',
				},
				{
					title: 'raising_hand',
					text: '🙋',
				},
				{
					title: 'massage',
					text: '💆',
				},
				{
					title: 'haircut',
					text: '💇',
				},
				{
					title: 'nail_care',
					text: '💅',
				},
				{
					title: 'bride_with_veil',
					text: '👰',
				},
				{
					title: 'person_with_pouting_face',
					text: '🙎',
				},
				{
					title: 'person_frowning',
					text: '🙍',
				},
				{
					title: 'bow',
					text: '🙇',
				},
				{
					title: 'tophat',
					text: '🎩',
				},
				{
					title: 'crown',
					text: '👑',
				},
				{
					title: 'womans_hat',
					text: '👒',
				},
				{
					title: 'athletic_shoe',
					text: '👟',
				},
				{
					title: 'mans_shoe',
					text: '👞',
				},
				{
					title: 'sandal',
					text: '👡',
				},
				{
					title: 'high_heel',
					text: '👠',
				},
				{
					title: 'boot',
					text: '👢',
				},
				{
					title: 'shirt',
					text: '👕',
				},
				{
					title: 'necktie',
					text: '👔',
				},
				{
					title: 'womans_clothes',
					text: '👚',
				},
				{
					title: 'dress',
					text: '👗',
				},
				{
					title: 'running_shirt_with_sash',
					text: '🎽',
				},
				{
					title: 'jeans',
					text: '👖',
				},
				{
					title: 'kimono',
					text: '👘',
				},
				{
					title: 'bikini',
					text: '👙',
				},
				{
					title: 'briefcase',
					text: '💼',
				},
				{
					title: 'handbag',
					text: '👜',
				},
				{
					title: 'pouch',
					text: '👝',
				},
				{
					title: 'purse',
					text: '👛',
				},
				{
					title: 'eyeglasses',
					text: '👓',
				},
				{
					title: 'ribbon',
					text: '🎀',
				},
				{
					title: 'closed_umbrella',
					text: '🌂',
				},
				{
					title: 'lipstick',
					text: '💄',
				},
				{
					title: 'yellow_heart',
					text: '💛',
				},
				{
					title: 'blue_heart',
					text: '💙',
				},
				{
					title: 'purple_heart',
					text: '💜',
				},
				{
					title: 'green_heart',
					text: '💚',
				},
				{
					title: 'broken_heart',
					text: '💔',
				},
				{
					title: 'heartpulse',
					text: '💗',
				},
				{
					title: 'heartbeat',
					text: '💓',
				},
				{
					title: 'two_hearts',
					text: '💕',
				},
				{
					title: 'sparkling_heart',
					text: '💖',
				},
				{
					title: 'revolving_hearts',
					text: '💞',
				},
				{
					title: 'cupid',
					text: '💘',
				},
				{
					title: 'love_letter',
					text: '💌',
				},
				{
					title: 'kiss',
					text: '💋',
				},
				{
					title: 'ring',
					text: '💍',
				},
				{
					title: 'gem',
					text: '💎',
				},
				{
					title: 'bust_in_silhouette',
					text: '👤',
				},
				{
					title: 'speech_balloon',
					text: '💬',
				},
				{
					title: 'footprints',
					text: '👣',
				},
			],
		},
		{
			title: 'Природа',
			emojies: [
				{
					title: 'dog',
					text: '🐶',
				},
				{
					title: 'wolf',
					text: '🐺',
				},
				{
					title: 'cat',
					text: '🐱',
				},
				{
					title: 'mouse',
					text: '🐭',
				},
				{
					title: 'hamster',
					text: '🐹',
				},
				{
					title: 'rabbit',
					text: '🐰',
				},
				{
					title: 'frog',
					text: '🐸',
				},
				{
					title: 'tiger',
					text: '🐯',
				},
				{
					title: 'koala',
					text: '🐨',
				},
				{
					title: 'bear',
					text: '🐻',
				},
				{
					title: 'pig',
					text: '🐷',
				},
				{
					title: 'pig_nose',
					text: '🐽',
				},
				{
					title: 'cow',
					text: '🐮',
				},
				{
					title: 'boar',
					text: '🐗',
				},
				{
					title: 'monkey_face',
					text: '🐵',
				},
				{
					title: 'monkey',
					text: '🐒',
				},
				{
					title: 'horse',
					text: '🐴',
				},
				{
					title: 'sheep',
					text: '🐑',
				},
				{
					title: 'elephant',
					text: '🐘',
				},
				{
					title: 'panda_face',
					text: '🐼',
				},
				{
					title: 'penguin',
					text: '🐧',
				},
				{
					title: 'bird',
					text: '🐦',
				},
				{
					title: 'baby_chick',
					text: '🐤',
				},
				{
					title: 'hatched_chick',
					text: '🐥',
				},
				{
					title: 'hatching_chick',
					text: '🐣',
				},
				{
					title: 'chicken',
					text: '🐔',
				},
				{
					title: 'snake',
					text: '🐍',
				},
				{
					title: 'turtle',
					text: '🐢',
				},
				{
					title: 'bug',
					text: '🐛',
				},
				{
					title: 'bee',
					text: '🐝',
				},
				{
					title: 'ant',
					text: '🐜',
				},
				{
					title: 'beetle',
					text: '🐞',
				},
				{
					title: 'snail',
					text: '🐌',
				},
				{
					title: 'octopus',
					text: '🐙',
				},
				{
					title: 'shell',
					text: '🐚',
				},
				{
					title: 'tropical_fish',
					text: '🐠',
				},
				{
					title: 'fish',
					text: '🐟',
				},
				{
					title: 'dolphin',
					text: '🐬',
				},
				{
					title: 'whale',
					text: '🐳',
				},
				{
					title: 'racehorse',
					text: '🐎',
				},
				{
					title: 'dragon_face',
					text: '🐲',
				},
				{
					title: 'blowfish',
					text: '🐡',
				},
				{
					title: 'camel',
					text: '🐫',
				},
				{
					title: 'poodle',
					text: '🐩',
				},
				{
					title: 'feet',
					text: '🐾',
				},
				{
					title: 'bouquet',
					text: '💐',
				},
				{
					title: 'cherry_blossom',
					text: '🌸',
				},
				{
					title: 'tulip',
					text: '🌷',
				},
				{
					title: 'four_leaf_clover',
					text: '🍀',
				},
				{
					title: 'rose',
					text: '🌹',
				},
				{
					title: 'sunflower',
					text: '🌻',
				},
				{
					title: 'hibiscus',
					text: '🌺',
				},
				{
					title: 'maple_leaf',
					text: '🍁',
				},
				{
					title: 'leaves',
					text: '🍃',
				},
				{
					title: 'fallen_leaf',
					text: '🍂',
				},
				{
					title: 'herb',
					text: '🌿',
				},
				{
					title: 'ear_of_rice',
					text: '🌾',
				},
				{
					title: 'mushroom',
					text: '🍄',
				},
				{
					title: 'cactus',
					text: '🌵',
				},
				{
					title: 'palm_tree',
					text: '🌴',
				},
				{
					title: 'chestnut',
					text: '🌰',
				},
				{
					title: 'seedling',
					text: '🌱',
				},
				{
					title: 'blossom',
					text: '🌼',
				},
				{
					title: 'new_moon',
					text: '🌑',
				},
				{
					title: 'first_quarter_moon',
					text: '🌓',
				},
				{
					title: 'moon',
					text: '🌔',
				},
				{
					title: 'full_moon',
					text: '🌕',
				},
				{
					title: 'first_quarter_moon_with_face',
					text: '🌛',
				},
				{
					title: 'crescent_moon',
					text: '🌙',
				},
				{
					title: 'earth_asia',
					text: '🌏',
				},
				{
					title: 'volcano',
					text: '🌋',
				},
				{
					title: 'milky_way',
					text: '🌌',
				},
				{
					title: 'stars',
					text: '🌠',
				},
				{
					title: 'partly_sunny',
					text: '⛅',
				},
				{
					title: 'snowman',
					text: '⛄',
				},
				{
					title: 'cyclone',
					text: '🌀',
				},
				{
					title: 'foggy',
					text: '🌁',
				},
				{
					title: 'rainbow',
					text: '🌈',
				},
				{
					title: 'ocean',
					text: '🌊',
				},
			],
		},
		{
			title: 'Объекты',
			emojies: [
				{
					title: 'bamboo',
					text: '🎍',
				},
				{
					title: 'gift_heart',
					text: '💝',
				},
				{
					title: 'dolls',
					text: '🎎',
				},
				{
					title: 'school_satchel',
					text: '🎒',
				},
				{
					title: 'mortar_board',
					text: '🎓',
				},
				{
					title: 'flags',
					text: '🎏',
				},
				{
					title: 'fireworks',
					text: '🎆',
				},
				{
					title: 'sparkler',
					text: '🎇',
				},
				{
					title: 'wind_chime',
					text: '🎐',
				},
				{
					title: 'rice_scene',
					text: '🎑',
				},
				{
					title: 'jack_o_lantern',
					text: '🎃',
				},
				{
					title: 'ghost',
					text: '👻',
				},
				{
					title: 'santa',
					text: '🎅',
				},
				{
					title: 'christmas_tree',
					text: '🎄',
				},
				{
					title: 'gift',
					text: '🎁',
				},
				{
					title: 'tanabata_tree',
					text: '🎋',
				},
				{
					title: 'tada',
					text: '🎉',
				},
				{
					title: 'confetti_ball',
					text: '🎊',
				},
				{
					title: 'balloon',
					text: '🎈',
				},
				{
					title: 'crossed_flags',
					text: '🎌',
				},
				{
					title: 'crystal_ball',
					text: '🔮',
				},
				{
					title: 'movie_camera',
					text: '🎥',
				},
				{
					title: 'camera',
					text: '📷',
				},
				{
					title: 'video_camera',
					text: '📹',
				},
				{
					title: 'vhs',
					text: '📼',
				},
				{
					title: 'cd',
					text: '💿',
				},
				{
					title: 'dvd',
					text: '📀',
				},
				{
					title: 'minidisc',
					text: '💽',
				},
				{
					title: 'floppy_disk',
					text: '💾',
				},
				{
					title: 'computer',
					text: '💻',
				},
				{
					title: 'iphone',
					text: '📱',
				},
				{
					title: 'telephone_receiver',
					text: '📞',
				},
				{
					title: 'pager',
					text: '📟',
				},
				{
					title: 'fax',
					text: '📠',
				},
				{
					title: 'satellite',
					text: '📡',
				},
				{
					title: 'tv',
					text: '📺',
				},
				{
					title: 'radio',
					text: '📻',
				},
				{
					title: 'loud_sound',
					text: '🔊',
				},
				{
					title: 'bell',
					text: '🔔',
				},
				{
					title: 'loudspeaker',
					text: '📢',
				},
				{
					title: 'mega',
					text: '📣',
				},
				{
					title: 'hourglass_flowing_sand',
					text: '⏳',
				},
				{
					title: 'hourglass',
					text: '⌛',
				},
				{
					title: 'alarm_clock',
					text: '⏰',
				},
				{
					title: 'watch',
					text: '⌚',
				},
				{
					title: 'unlock',
					text: '🔓',
				},
				{
					title: 'lock',
					text: '🔒',
				},
				{
					title: 'lock_with_ink_pen',
					text: '🔏',
				},
				{
					title: 'closed_lock_with_key',
					text: '🔐',
				},
				{
					title: 'key',
					text: '🔑',
				},
				{
					title: 'mag_right',
					text: '🔎',
				},
				{
					title: 'bulb',
					text: '💡',
				},
				{
					title: 'flashlight',
					text: '🔦',
				},
				{
					title: 'electric_plug',
					text: '🔌',
				},
				{
					title: 'battery',
					text: '🔋',
				},
				{
					title: 'mag',
					text: '🔍',
				},
				{
					title: 'bath',
					text: '🛀',
				},
				{
					title: 'toilet',
					text: '🚽',
				},
				{
					title: 'wrench',
					text: '🔧',
				},
				{
					title: 'nut_and_bolt',
					text: '🔩',
				},
				{
					title: 'hammer',
					text: '🔨',
				},
				{
					title: 'door',
					text: '🚪',
				},
				{
					title: 'smoking',
					text: '🚬',
				},
				{
					title: 'bomb',
					text: '💣',
				},
				{
					title: 'gun',
					text: '🔫',
				},
				{
					title: 'hocho',
					text: '🔪',
				},
				{
					title: 'pill',
					text: '💊',
				},
				{
					title: 'syringe',
					text: '💉',
				},
				{
					title: 'moneybag',
					text: '💰',
				},
				{
					title: 'yen',
					text: '💴',
				},
				{
					title: 'dollar',
					text: '💵',
				},
				{
					title: 'credit_card',
					text: '💳',
				},
				{
					title: 'money_with_wings',
					text: '💸',
				},
				{
					title: 'calling',
					text: '📲',
				},
				{
					title: 'e-mail',
					text: '📧',
				},
				{
					title: 'inbox_tray',
					text: '📥',
				},
				{
					title: 'outbox_tray',
					text: '📤',
				},
				{
					title: 'envelope_with_arrow',
					text: '📩',
				},
				{
					title: 'incoming_envelope',
					text: '📨',
				},
				{
					title: 'mailbox',
					text: '📫',
				},
				{
					title: 'mailbox_closed',
					text: '📪',
				},
				{
					title: 'postbox',
					text: '📮',
				},
				{
					title: 'package',
					text: '📦',
				},
				{
					title: 'memo',
					text: '📝',
				},
				{
					title: 'page_facing_up',
					text: '📄',
				},
				{
					title: 'page_with_curl',
					text: '📃',
				},
				{
					title: 'bookmark_tabs',
					text: '📑',
				},
				{
					title: 'bar_chart',
					text: '📊',
				},
				{
					title: 'chart_with_upwards_trend',
					text: '📈',
				},
				{
					title: 'chart_with_downwards_trend',
					text: '📉',
				},
				{
					title: 'scroll',
					text: '📜',
				},
				{
					title: 'clipboard',
					text: '📋',
				},
				{
					title: 'date',
					text: '📅',
				},
				{
					title: 'calendar',
					text: '📆',
				},
				{
					title: 'card_index',
					text: '📇',
				},
				{
					title: 'file_folder',
					text: '📁',
				},
				{
					title: 'open_file_folder',
					text: '📂',
				},
				{
					title: 'pushpin',
					text: '📌',
				},
				{
					title: 'paperclip',
					text: '📎',
				},
				{
					title: 'straight_ruler',
					text: '📏',
				},
				{
					title: 'triangular_ruler',
					text: '📐',
				},
				{
					title: 'closed_book',
					text: '📕',
				},
				{
					title: 'green_book',
					text: '📗',
				},
				{
					title: 'blue_book',
					text: '📘',
				},
				{
					title: 'orange_book',
					text: '📙',
				},
				{
					title: 'notebook',
					text: '📓',
				},
				{
					title: 'notebook_with_decorative_cover',
					text: '📔',
				},
				{
					title: 'ledger',
					text: '📒',
				},
				{
					title: 'books',
					text: '📚',
				},
				{
					title: 'book',
					text: '📖',
				},
				{
					title: 'bookmark',
					text: '🔖',
				},
				{
					title: 'name_badge',
					text: '📛',
				},
				{
					title: 'newspaper',
					text: '📰',
				},
				{
					title: 'art',
					text: '🎨',
				},
				{
					title: 'clapper',
					text: '🎬',
				},
				{
					title: 'microphone',
					text: '🎤',
				},
				{
					title: 'headphones',
					text: '🎧',
				},
				{
					title: 'musical_score',
					text: '🎼',
				},
				{
					title: 'musical_note',
					text: '🎵',
				},
				{
					title: 'notes',
					text: '🎶',
				},
				{
					title: 'musical_keyboard',
					text: '🎹',
				},
				{
					title: 'violin',
					text: '🎻',
				},
				{
					title: 'trumpet',
					text: '🎺',
				},
				{
					title: 'saxophone',
					text: '🎷',
				},
				{
					title: 'guitar',
					text: '🎸',
				},
				{
					title: 'space_invader',
					text: '👾',
				},
				{
					title: 'video_game',
					text: '🎮',
				},
				{
					title: 'black_joker',
					text: '🃏',
				},
				{
					title: 'flower_playing_cards',
					text: '🎴',
				},
				{
					title: 'mahjong',
					text: '🀄',
				},
				{
					title: 'game_die',
					text: '🎲',
				},
				{
					title: 'dart',
					text: '🎯',
				},
				{
					title: 'football',
					text: '🏈',
				},
				{
					title: 'basketball',
					text: '🏀',
				},
				{
					title: 'soccer',
					text: '⚽',
				},
				{
					title: 'baseball',
					text: '⚾',
				},
				{
					title: 'tennis',
					text: '🎾',
				},
				{
					title: '8ball',
					text: '🎱',
				},
				{
					title: 'bowling',
					text: '🎳',
				},
				{
					title: 'golf',
					text: '⛳',
				},
				{
					title: 'checkered_flag',
					text: '🏁',
				},
				{
					title: 'trophy',
					text: '🏆',
				},
				{
					title: 'ski',
					text: '🎿',
				},
				{
					title: 'snowboarder',
					text: '🏂',
				},
				{
					title: 'swimmer',
					text: '🏊',
				},
				{
					title: 'surfer',
					text: '🏄',
				},
				{
					title: 'fishing_pole_and_fish',
					text: '🎣',
				},
				{
					title: 'tea',
					text: '🍵',
				},
				{
					title: 'sake',
					text: '🍶',
				},
				{
					title: 'beer',
					text: '🍺',
				},
				{
					title: 'beers',
					text: '🍻',
				},
				{
					title: 'cocktail',
					text: '🍸',
				},
				{
					title: 'tropical_drink',
					text: '🍹',
				},
				{
					title: 'wine_glass',
					text: '🍷',
				},
				{
					title: 'fork_and_knife',
					text: '🍴',
				},
				{
					title: 'pizza',
					text: '🍕',
				},
				{
					title: 'hamburger',
					text: '🍔',
				},
				{
					title: 'fries',
					text: '🍟',
				},
				{
					title: 'poultry_leg',
					text: '🍗',
				},
				{
					title: 'meat_on_bone',
					text: '🍖',
				},
				{
					title: 'spaghetti',
					text: '🍝',
				},
				{
					title: 'curry',
					text: '🍛',
				},
				{
					title: 'fried_shrimp',
					text: '🍤',
				},
				{
					title: 'bento',
					text: '🍱',
				},
				{
					title: 'sushi',
					text: '🍣',
				},
				{
					title: 'fish_cake',
					text: '🍥',
				},
				{
					title: 'rice_ball',
					text: '🍙',
				},
				{
					title: 'rice_cracker',
					text: '🍘',
				},
				{
					title: 'rice',
					text: '🍚',
				},
				{
					title: 'ramen',
					text: '🍜',
				},
				{
					title: 'stew',
					text: '🍲',
				},
				{
					title: 'oden',
					text: '🍢',
				},
				{
					title: 'dango',
					text: '🍡',
				},
				{
					title: 'egg',
					text: '🍳',
				},
				{
					title: 'bread',
					text: '🍞',
				},
				{
					title: 'doughnut',
					text: '🍩',
				},
				{
					title: 'custard',
					text: '🍮',
				},
				{
					title: 'icecream',
					text: '🍦',
				},
				{
					title: 'ice_cream',
					text: '🍨',
				},
				{
					title: 'shaved_ice',
					text: '🍧',
				},
				{
					title: 'birthday',
					text: '🎂',
				},
				{
					title: 'cake',
					text: '🍰',
				},
				{
					title: 'cookie',
					text: '🍪',
				},
				{
					title: 'chocolate_bar',
					text: '🍫',
				},
				{
					title: 'candy',
					text: '🍬',
				},
				{
					title: 'lollipop',
					text: '🍭',
				},
				{
					title: 'honey_pot',
					text: '🍯',
				},
				{
					title: 'apple',
					text: '🍎',
				},
				{
					title: 'green_apple',
					text: '🍏',
				},
				{
					title: 'tangerine',
					text: '🍊',
				},
				{
					title: 'cherries',
					text: '🍒',
				},
				{
					title: 'grapes',
					text: '🍇',
				},
				{
					title: 'watermelon',
					text: '🍉',
				},
				{
					title: 'strawberry',
					text: '🍓',
				},
				{
					title: 'peach',
					text: '🍑',
				},
				{
					title: 'melon',
					text: '🍈',
				},
				{
					title: 'banana',
					text: '🍌',
				},
				{
					title: 'pineapple',
					text: '🍍',
				},
				{
					title: 'sweet_potato',
					text: '🍠',
				},
				{
					title: 'eggplant',
					text: '🍆',
				},
				{
					title: 'tomato',
					text: '🍅',
				},
				{
					title: 'corn',
					text: '🌽',
				},
			],
		},
		{
			title: 'Места',
			emojies: [
				{
					title: 'house',
					text: '🏠',
				},
				{
					title: 'house_with_garden',
					text: '🏡',
				},
				{
					title: 'school',
					text: '🏫',
				},
				{
					title: 'office',
					text: '🏢',
				},
				{
					title: 'post_office',
					text: '🏣',
				},
				{
					title: 'hospital',
					text: '🏥',
				},
				{
					title: 'bank',
					text: '🏦',
				},
				{
					title: 'convenience_store',
					text: '🏪',
				},
				{
					title: 'love_hotel',
					text: '🏩',
				},
				{
					title: 'hotel',
					text: '🏨',
				},
				{
					title: 'wedding',
					text: '💒',
				},
				{
					title: 'church',
					text: '⛪',
				},
				{
					title: 'department_store',
					text: '🏬',
				},
				{
					title: 'city_sunrise',
					text: '🌇',
				},
				{
					title: 'city_sunset',
					text: '🌆',
				},
				{
					title: 'japanese_castle',
					text: '🏯',
				},
				{
					title: 'european_castle',
					text: '🏰',
				},
				{
					title: 'tent',
					text: '⛺',
				},
				{
					title: 'factory',
					text: '🏭',
				},
				{
					title: 'tokyo_tower',
					text: '🗼',
				},
				{
					title: 'japan',
					text: '🗾',
				},
				{
					title: 'mount_fuji',
					text: '🗻',
				},
				{
					title: 'sunrise_over_mountains',
					text: '🌄',
				},
				{
					title: 'sunrise',
					text: '🌅',
				},
				{
					title: 'night_with_stars',
					text: '🌃',
				},
				{
					title: 'statue_of_liberty',
					text: '🗽',
				},
				{
					title: 'bridge_at_night',
					text: '🌉',
				},
				{
					title: 'carousel_horse',
					text: '🎠',
				},
				{
					title: 'ferris_wheel',
					text: '🎡',
				},
				{
					title: 'fountain',
					text: '⛲',
				},
				{
					title: 'roller_coaster',
					text: '🎢',
				},
				{
					title: 'ship',
					text: '🚢',
				},
				{
					title: 'boat',
					text: '⛵',
				},
				{
					title: 'speedboat',
					text: '🚤',
				},
				{
					title: 'rocket',
					text: '🚀',
				},
				{
					title: 'seat',
					text: '💺',
				},
				{
					title: 'station',
					text: '🚉',
				},
				{
					title: 'bullettrain_side',
					text: '🚄',
				},
				{
					title: 'bullettrain_front',
					text: '🚅',
				},
				{
					title: 'metro',
					text: '🚇',
				},
				{
					title: 'railway_car',
					text: '🚃',
				},
				{
					title: 'bus',
					text: '🚌',
				},
				{
					title: 'blue_car',
					text: '🚙',
				},
				{
					title: 'car',
					text: '🚗',
				},
				{
					title: 'taxi',
					text: '🚕',
				},
				{
					title: 'truck',
					text: '🚚',
				},
				{
					title: 'rotating_light',
					text: '🚨',
				},
				{
					title: 'police_car',
					text: '🚓',
				},
				{
					title: 'fire_engine',
					text: '🚒',
				},
				{
					title: 'ambulance',
					text: '🚑',
				},
				{
					title: 'bike',
					text: '🚲',
				},
				{
					title: 'barber',
					text: '💈',
				},
				{
					title: 'busstop',
					text: '🚏',
				},
				{
					title: 'ticket',
					text: '🎫',
				},
				{
					title: 'traffic_light',
					text: '🚥',
				},
				{
					title: 'construction',
					text: '🚧',
				},
				{
					title: 'beginner',
					text: '🔰',
				},
				{
					title: 'fuelpump',
					text: '⛽',
				},
				{
					title: 'izakaya_lantern',
					text: '🏮',
				},
				{
					title: 'slot_machine',
					text: '🎰',
				},
				{
					title: 'moyai',
					text: '🗿',
				},
				{
					title: 'circus_tent',
					text: '🎪',
				},
				{
					title: 'performing_arts',
					text: '🎭',
				},
				{
					title: 'round_pushpin',
					text: '📍',
				},
				{
					title: 'triangular_flag_on_post',
					text: '🚩',
				},
			],
		},
		{
			title: 'Символы',
			emojies: [
				{
					title: 'keycap_ten',
					text: '🔟',
				},
				{
					title: '1234',
					text: '🔢',
				},
				{
					title: 'symbols',
					text: '🔣',
				},
				{
					title: 'capital_abcd',
					text: '🔠',
				},
				{
					title: 'abcd',
					text: '🔡',
				},
				{
					title: 'abc',
					text: '🔤',
				},
				{
					title: 'arrow_up_small',
					text: '🔼',
				},
				{
					title: 'arrow_down_small',
					text: '🔽',
				},
				{
					title: 'rewind',
					text: '⏪',
				},
				{
					title: 'fast_forward',
					text: '⏩',
				},
				{
					title: 'arrow_double_up',
					text: '⏫',
				},
				{
					title: 'arrow_double_down',
					text: '⏬',
				},
				{
					title: 'ok',
					text: '🆗',
				},
				{
					title: 'new',
					text: '🆕',
				},
				{
					title: 'up',
					text: '🆙',
				},
				{
					title: 'cool',
					text: '🆒',
				},
				{
					title: 'free',
					text: '🆓',
				},
				{
					title: 'ng',
					text: '🆖',
				},
				{
					title: 'signal_strength',
					text: '📶',
				},
				{
					title: 'cinema',
					text: '🎦',
				},
				{
					title: 'koko',
					text: '🈁',
				},
				{
					title: 'u6307',
					text: '🈯',
				},
				{
					title: 'u7a7a',
					text: '🈳',
				},
				{
					title: 'u6e80',
					text: '🈵',
				},
				{
					title: 'u5408',
					text: '🈴',
				},
				{
					title: 'u7981',
					text: '🈲',
				},
				{
					title: 'ideograph_advantage',
					text: '🉐',
				},
				{
					title: 'u5272',
					text: '🈹',
				},
				{
					title: 'u55b6',
					text: '🈺',
				},
				{
					title: 'u6709',
					text: '🈶',
				},
				{
					title: 'u7121',
					text: '🈚',
				},
				{
					title: 'restroom',
					text: '🚻',
				},
				{
					title: 'mens',
					text: '🚹',
				},
				{
					title: 'womens',
					text: '🚺',
				},
				{
					title: 'baby_symbol',
					text: '🚼',
				},
				{
					title: 'wc',
					text: '🚾',
				},
				{
					title: 'no_smoking',
					text: '🚭',
				},
				{
					title: 'u7533',
					text: '🈸',
				},
				{
					title: 'accept',
					text: '🉑',
				},
				{
					title: 'cl',
					text: '🆑',
				},
				{
					title: 'sos',
					text: '🆘',
				},
				{
					title: 'id',
					text: '🆔',
				},
				{
					title: 'no_entry_sign',
					text: '🚫',
				},
				{
					title: 'underage',
					text: '🔞',
				},
				{
					title: 'no_entry',
					text: '⛔',
				},
				{
					title: 'negative_squared_cross_mark',
					text: '❎',
				},
				{
					title: 'white_check_mark',
					text: '✅',
				},
				{
					title: 'heart_decoration',
					text: '💟',
				},
				{
					title: 'vs',
					text: '🆚',
				},
				{
					title: 'vibration_mode',
					text: '📳',
				},
				{
					title: 'mobile_phone_off',
					text: '📴',
				},
				{
					title: 'ab',
					text: '🆎',
				},
				{
					title: 'diamond_shape_with_a_dot_inside',
					text: '💠',
				},
				{
					title: 'ophiuchus',
					text: '⛎',
				},
				{
					title: 'six_pointed_star',
					text: '🔯',
				},
				{
					title: 'atm',
					text: '🏧',
				},
				{
					title: 'chart',
					text: '💹',
				},
				{
					title: 'heavy_dollar_sign',
					text: '💲',
				},
				{
					title: 'currency_exchange',
					text: '💱',
				},
				{
					title: 'x',
					text: '❌',
				},
				{
					title: 'exclamation',
					text: '❗',
				},
				{
					title: 'question',
					text: '❓',
				},
				{
					title: 'grey_exclamation',
					text: '❕',
				},
				{
					title: 'grey_question',
					text: '❔',
				},
				{
					title: 'o',
					text: '⭕',
				},
				{
					title: 'top',
					text: '🔝',
				},
				{
					title: 'end',
					text: '🔚',
				},
				{
					title: 'back',
					text: '🔙',
				},
				{
					title: 'on',
					text: '🔛',
				},
				{
					title: 'soon',
					text: '🔜',
				},
				{
					title: 'arrows_clockwise',
					text: '🔃',
				},
				{
					title: 'clock12',
					text: '🕛',
				},
				{
					title: 'clock1',
					text: '🕐',
				},
				{
					title: 'clock2',
					text: '🕑',
				},
				{
					title: 'clock3',
					text: '🕒',
				},
				{
					title: 'clock4',
					text: '🕓',
				},
				{
					title: 'clock5',
					text: '🕔',
				},
				{
					title: 'clock6',
					text: '🕕',
				},
				{
					title: 'clock7',
					text: '🕖',
				},
				{
					title: 'clock8',
					text: '🕗',
				},
				{
					title: 'clock9',
					text: '🕘',
				},
				{
					title: 'clock10',
					text: '🕙',
				},
				{
					title: 'clock11',
					text: '🕚',
				},
				{
					title: 'heavy_plus_sign',
					text: '➕',
				},
				{
					title: 'heavy_minus_sign',
					text: '➖',
				},
				{
					title: 'heavy_division_sign',
					text: '➗',
				},
				{
					title: 'white_flower',
					text: '💮',
				},
				{
					title: '100',
					text: '💯',
				},
				{
					title: 'radio_button',
					text: '🔘',
				},
				{
					title: 'link',
					text: '🔗',
				},
				{
					title: 'curly_loop',
					text: '➰',
				},
				{
					title: 'trident',
					text: '🔱',
				},
				{
					title: 'small_red_triangle',
					text: '🔺',
				},
				{
					title: 'black_square_button',
					text: '🔲',
				},
				{
					title: 'white_square_button',
					text: '🔳',
				},
				{
					title: 'red_circle',
					text: '🔴',
				},
				{
					title: 'large_blue_circle',
					text: '🔵',
				},
				{
					title: 'small_red_triangle_down',
					text: '🔻',
				},
				{
					title: 'white_large_square',
					text: '⬜',
				},
				{
					title: 'black_large_square',
					text: '⬛',
				},
				{
					title: 'large_orange_diamond',
					text: '🔶',
				},
				{
					title: 'large_blue_diamond',
					text: '🔷',
				},
				{
					title: 'small_orange_diamond',
					text: '🔸',
				},
				{
					title: 'small_blue_diamond',
					text: '🔹',
				},
			],
		},
	];

	emojiPicker({ selector: '#emoji-picker', input: '#Input1', emojies: emojies });
	emojiPicker({ selector: '#emoji-picker2', input: '#Input2', emojies: emojies });
});
