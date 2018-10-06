"use strict"
// const log = (...v) => console.log(...v)
const log = (...v) => {}

const line = require("@line/bot-sdk")
const express = require("express")
const https = require("https")

// config
const config = require("./config")

// bot
const botConfig = {
    channelSecret: config.bot.secret, 
    channelAccessToken: config.bot.accessToken, 
}
const bot = new line.Client(botConfig)



//////// const ////////////////////////////////////////////////////////

const remoconTable = [{"values":["リモコン","りもこん"],"id":"remocon"}]
const targetTable = [{"values":["プロジェクター","プロジェクタ","ぷろじぇくたー","ぷろじぇくた"],"id":"projector"},{"values":["PC","パソコン","ぱそこん"],"id":"pc"},{"values":["PS4","プレステ4","プレステフォー","プレステ","ps","ぷれすて"],"id":"ps"},{"values":["エアコン","えあこん"],"id":"aircon"},{"values":["テレビ","てれび"],"id":"tv"},{"values":["照明","ライト","電気","でんき"],"id":"light"},{"values":[],"id":""}]
const actionTable = [{"values":["再生","プレイ"],"id":"play"},{"values":["エクセル"],"id":"excel"},{"values":["前"],"id":"prev"},{"values":["次"],"id":"next"},{"values":["黄色","イエロー"],"id":"yellow"},{"values":["緑","グリーン"],"id":"green"},{"values":["赤","レッド"],"id":"red"},{"values":["青","ブルー"],"id":"blue"},{"values":["加湿"],"id":"humidify"},{"values":["除湿","ドライ"],"id":"dry"},{"values":["冷房"],"id":"cool"},{"values":["暖房"],"id":"heat"},{"values":["自動","じどう"],"id":"auto"},{"values":["トルネ"],"id":"torne"},{"values":["右","みぎ"],"id":"right"},{"values":["左","ひだり"],"id":"left"},{"values":["下","した"],"id":"bottom"},{"values":["上","笛","うえ"],"id":"top"},{"values":["オプション"],"id":"option"},{"values":["バック","戻って","モデル","戻る"],"id":"back"},{"values":["決定","設定","決定","エンター","選択","センター"],"id":"enter"},{"values":["メニュー"],"id":"menu"},{"values":["ホーム","フォーム"],"id":"home"},{"values":["スタンバイ","スリープ"],"id":"standby"},{"values":["D","デー","ディー"],"id":"d"},{"values":["C","シー"],"id":"c"},{"values":["B","ビー"],"id":"b"},{"values":["A","エイ","エー"],"id":"a"},{"values":["停止","シャットダウン","特典","止めて","消して","オフ","けして","とめて","おふ"],"id":"off"},{"values":["起動","機動","軌道","つけて","オン","おん"],"id":"on"},{"values":[],"id":""}]
const oneActionTable = [{"values":["おはよう","おはよ"],"id":"goodMorning"},{"values":["おやすみ", "おやすみなさい"],"id":"goodNight"},{"values":[],"id":""}]
const channelTable = [{"values":["チャンネル","ちゃん","チャン","ちゃんねる"],"id":"channel"},{"values":[],"id":""}]
const updownTable = [{"values":["ダウン","さげて","下げて"],"id":"down"},{"values":["アップ","あげて","上げて"],"id":"up"},{"values":[],"id":""}]
const stateTable = [{"values":["湿度","しつど"],"id":"humidity"},{"values":["音量","ボリューム","ぼりゅーむ","おんりょう","音","おと"],"id":"volume"},{"values":["温度","おんど"],"id":"temp"},{"values":[],"id":""}]



//////// function ////////////////////////////////////////////////////////

const replyText = (event, text) => 
    bot.replyMessage(event.replyToken, {type: "text", text: text})

const replyUrl = (event, url, label) => 
    bot.replyMessage(event.replyToken, {type: "uri", uri: url, label: label})

const searchTable = (table, text) => {
    let result = undefined
    table.some(obj => {
        if (obj.values.some(value => {
            if (text.indexOf(value) > -1) {
                return value
            }
        })) {
            result = {
                id: obj.id,
                name: obj.values[0]
            }
        }
    })
    return result
}

const getStateTarget = state => {
    if (!state) return state
    let stateTarget = {id: "aircon", name: "エアコン"}
    if (state.id === "volume") stateTarget = {id: "tv", name: "テレビ"}
    return stateTarget
}

const getUpdownMessage = updown => {
    if (!updown) return updown
    return updown.name === "アップ" ? "上げるね！" : "下げるね！"
}

const getNumber = text => {
    const match = text.replace(/PS4|ps4|プレステ4|ぷれすて4/, "").match(/\d+/)
    return match ? match[0] : undefined
}

const putFirebase = command => {
    https.request({
        host: config.firebase.host,
        path: config.firebase.path,
        method: "PUT",
    }).end(JSON.stringify(command))
}



//////// handler ////////////////////////////////////////////////////////

const handleEvent = event => {
    if (event.type !== "message" || event.message.type !== "text") return Promise.resolve(null)
    const text = event.message.text
    
    // 
    const remocon = searchTable(remoconTable, text)
    if (remocon) return replyText(event, `リンクをおすとリモコン画面になるよ！\n${config.liffUri}`)
    
    // slots
    const target = searchTable(targetTable, text)
    const action = searchTable(actionTable, text)
    const oneAction = searchTable(oneActionTable, text)
    const channel = searchTable(channelTable, text)
    const state = searchTable(stateTable, text)
    const stateTarget = getStateTarget(state)
    const updown = searchTable(updownTable, text)
    const updownMessage = getUpdownMessage(updown)
    const number = getNumber(text)
    log(target, action, oneAction, channel, state, stateTarget, updown, updownMessage, number)
    
    // 
    let message = false
    let command = false
    
    // 
    if (false) {
    // おはよう or おやすみ
    } else if (oneAction) {
        log("oneAction!")
        message = `${oneAction.name}！`
        command = `general ${oneAction.name}`
        
    // 状態、上下、数字あり
    } else if (state && updown && number > -1) {
        log("state && number!")
        command = `${stateTarget.id} ${state.name} ${number} 回 ${updown.name}`
        message = `${stateTarget.name}の${state.name}を${number}${updownMessage}`
        
    // 状態、上下のみ
    } else if (state && updown) {
        log("state!")
        command = `${stateTarget.id} ${state.name} ${updown.name}`
        message = `${stateTarget.name}の${state.name}を${updownMessage}`
        
    // チャンネル
    } else if (channel && (number > 0 && number <= 12)) {
        log("channel!")
        message = `${number}チャンネルを映すね！`
        command = `tv ${number}`
        
    // 数字のみ
    } else if (number > -1) {
        log("number")
        command = `tv ${number}`
        message = `${number}チャンネルを映すね！`
        
    // 基本形
    } else if (target && action) {
        log("target && action!")
        message = `${target.name}を操作するね！`
        command = `${target.id} ${action.name}`
        
    // error
    } else {
        log("error!")
        message = "ごめん！よくわかんなかった！"
    }
    
    // firebaes書き込み
    log(command)
    if (command) putFirebase(command)
    
    // reply
    replyText(event, message)
    
    return resolve()
}



//////// express ////////////////////////////////////////////////////////

const app = express()
app.listen(3000)
app.post('/home-controller-bot', line.middleware(botConfig), async (req, res) => 
    Promise.all(req.body.events.map(handleEvent)).then(result => res.json(result)))

const awsServerlessExpress = require('aws-serverless-express')
const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)