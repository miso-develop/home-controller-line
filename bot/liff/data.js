const data = [
	{
		"name": "TV",
		"buttons": [
			{"name": "起動", "command": "tv 起動", "column": "3"}, 
			{"name": "停止", "command": "tv 停止", "column": "3"}, 
			{"name": "入力切替", "command": "tv 入力切替", "column": "3"}, 
			
			{"name": "音量アップ", "command": "tv 音量 アップ", "column": "2"}, 
			{"name": "音量ダウン", "command": "tv 音量 ダウン", "column": "2"}, 
			
			{"column": "1"}, {"column": "1"},
			
			{"column": "3"},
			{"name": "↑", "command": "tv 上", "column": "3"}, 
			{"column": "3"},
			
			{"name": "←", "command": "tv 左", "column": "3"}, 
			{"name": "↓", "command": "tv 下", "column": "3"}, 
			{"name": "→", "command": "tv 右", "column": "3"}, 
			
			{"name": "決定", "command": "tv 決定", "column": "2"}, 
			{"name": "戻る", "command": "tv 戻る", "column": "2"}, 
			
			{"column": "1"}, {"column": "1"},
			
			{"name": "1", "command": "tv 1", "column": "3"}, 
			{"name": "2", "command": "tv 2", "column": "3"}, 
			{"name": "3", "command": "tv 3", "column": "3"}, 
			
			{"name": "4", "command": "tv 4", "column": "3"}, 
			{"name": "5", "command": "tv 5", "column": "3"}, 
			{"name": "6", "command": "tv 6", "column": "3"}, 
			
			{"name": "7", "command": "tv 7", "column": "3"}, 
			{"name": "8", "command": "tv 8", "column": "3"}, 
			{"name": "9", "command": "tv 9", "column": "3"}, 
			
			{"name": "10", "command": "tv 10", "column": "3"}, 
			{"name": "11", "command": "tv 11", "column": "3"}, 
			{"name": "12", "command": "tv 12", "column": "3"}, 
		],
	},
	
	{
		"name": "PS4",
		"buttons": [
			{"name": "起動", "command": "ps 起動", "column": "2"}, 
			{"name": "停止", "command": "ps 停止", "column": "2"}, 
			
			{"name": "ホーム", "command": "ps ホーム", "column": "2"}, 
			{"name": "オプション", "command": "ps オプション", "column": "2"}, 
			
			{"column": "1"}, {"column": "1"},
			
			{"column": "3"},
			{"name": "↑", "command": "ps 上", "column": "3"}, 
			{"column": "3"},
			
			{"name": "←", "command": "ps 左", "column": "3"}, 
			{"name": "↓", "command": "ps 下", "column": "3"}, 
			{"name": "→", "command": "ps 右", "column": "3"}, 
			
			{"name": "決定", "command": "ps enter", "column": "2"}, 
			{"name": "戻る", "command": "ps 戻る", "column": "2"}, 
			
			{"column": "1"}, {"column": "1"},
			
			{"name": "torne", "command": "ps トルネ", "column": "2"}, 
			{"name": "メディア", "command": "ps メディア", "column": "2"}, 
		],
	},
	
	{
		"name": "PC",
		"buttons": [
			{"name": "起動", "command": "pc 起動", "column": "1"}, 
			{"name": "スタンバイ", "command": "pc スタンバイ", "column": "1"}, 
			{"name": "モニタオフ", "command": "pc 画面 オフ", "column": "1"}, 
			{"name": "Excel", "command": "pc Excel", "column": "1"}, 
		],
	},
	
	{
		"name": "エアコン",
		"buttons": [
			{"name": "自動", "command": "aircon 自動", "column": "2"}, 
			{"name": "停止", "command": "aircon 停止", "column": "2"}, 
			
			{"name": "暖房", "command": "aircon 暖房", "column": "4"}, 
			{"name": "冷房", "command": "aircon 冷房", "column": "4"}, 
			{"name": "除湿", "command": "aircon 除湿", "column": "4"}, 
			{"name": "加湿", "command": "aircon 加湿", "column": "4"}, 
			
			{"column": "1"}, {"column": "1"},
			
			{"name": "温度アップ", "command": "aircon 温度アップ", "column": "2"}, 
			{"name": "温度ダウン", "command": "aircon 温度ダウン", "column": "2"}, 
			
			{"name": "湿度アップ", "command": "aircon 湿度アップ", "column": "2"}, 
			{"name": "湿度ダウン", "command": "aircon 湿度ダウン", "column": "2"}, 
			
			{"column": "1"}, {"column": "1"},
			
			{"name": "風速", "command": "aircon 風速", "column": "2"}, 
			{"name": "送風", "command": "aircon 送風", "column": "2"}, 
		],
	},
	
	{
		"name": "照明",
		"buttons": [
			{"name": "A", "command": "light a", "column": "2"}, 
			{"name": "B", "command": "light b", "column": "2"}, 
			
			{"name": "C", "command": "light c", "column": "2"}, 
			{"name": "D", "command": "light d", "column": "2"}, 
			
			{"column": "1"}, {"column": "1"},
			
			{"name": "全灯", "command": "light 起動", "column": "1"}, 
			
			{"name": "保安灯", "command": "light 保安灯", "column": "1"}, 
			
			{"name": "消灯", "command": "light 停止", "column": "1"}, 
		]
	},
	
	{
		"name": "プロジェクタ",
		"buttons": [
			{"name": "OK", "command": "projector OK", "column": "2"}, 
			{"name": "menu", "command": "projector メニュー", "column": "2"}, 
			{"column": "3"},
			{"name": "↑", "command": "projector 上", "column": "3"}, 
			{"column": "3"},
			{"name": "←", "command": "projector 左", "column": "3"}, 
			{"name": "↓", "command": "projector 下", "column": "3"}, 
			{"name": "→", "command": "projector 右", "column": "3"}, 
		],
	},
	
	{
		"name": "スイッチ", 
		"buttons": [
			{"name": "お風呂沸かし", "command": "esp8266 bath", "column": "1"},
			{"name": "ハンドスピナー", "command": "esp8266 handspinner", "column": "1"},
		],
	},
	
	{
		"name": "まとめて", 
		"buttons": [
			{"name": "おやすみ", "command": "general おやすみ", "column": "1"},
			{"name": "おはよう", "command": "general ただいま", "column": "1"},
		],
	},
	
]
