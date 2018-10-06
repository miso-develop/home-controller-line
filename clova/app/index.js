"use strict"
const log = (...v) => console.log(...v)

const clova = require("@line/clova-cek-sdk-nodejs")
const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")

// firebase config
const firebaseConfig = require("./config")



//////// message ////////////////////////////////////////////////////////////////

const REPROMPT_MESSAGE = "操作したい内容をおっしゃってください"
const START_MESSAGE = `${REPROMPT_MESSAGE}`
const HELP_MESSAGE = `操作したい家電と動作を教えて下さい。`
const STOP_MESSAGE = "さようなら！"
const FALLBACK_MESSAGE = "ごめん、よくわかんなかった。"



//////// functions ////////////////////////////////////////////////////////////////

// speech
const speech = (responseHelper, message, reprompt) => {
    responseHelper.setSimpleSpeech(
        clova.SpeechBuilder.createSpeechText(message)
    )
    
    if (!reprompt) return
    responseHelper.setSimpleSpeech(
        clova.SpeechBuilder.createSpeechText(reprompt), true
    )
}

// 
const slotTable = {"action":{"play":"再生","prev":"前","next":"次","yellow":"黄色","green":"緑","red":"赤","blue":"青","humidify":"加湿","dry":"除湿","cool":"冷房","heat":"暖房","auto":"自動","right":"右","left":"左","bottom":"下","top":"上","option":"オプション","back":"バック","enter":"決定","menu":"メニュー","home":"ホーム","standby":"スタンバイ","d":"D","c":"C","b":"B","a":"A","off":"停止","on":"起動"},"target":{"projector":"プロジェクター","pc":"PC","ps":"PS4","aircon":"エアコン","tv":"テレビ","light":"照明","excel":"エクセル","torne":"トルネ"},"particle":{"particle":"助詞"},"channel":{"channel":"チャンネル"},"updown":{"down":"ダウン","up":"アップ"},"state":{"humidity":"湿度","volume":"音量","temp":"温度"},"oneAction":{"goodMorning":"おはよう","goodNight":"おやすみ","bath":"お風呂","handspinner":"ハンドスピナー"}}

// 
const putFirebase = async command => {
    await new Promise(resolve => {
        https.request({
            host: firebaseConfig.host,
            path: firebaseConfig.path,
            method: "PUT",
        }, () => resolve())
        .end(JSON.stringify(command))
    })
}

//////// handlers ////////////////////////////////////////////////////////////////

const controllHandler = async responseHelper => {
    console.log("controllHandler!")
    
    // get slot
    const slots = responseHelper.getSlots()
    let target = slots.target
    const action = slots.action
    const state = slots.state
    const oneAction = slots.oneAction
    const updown = slots.updown
    const channel = slots.channel
    const number = slots.number
    
    // 個別変換
    if (channel) target = "tv"
    
    const targetName = target && slotTable.target[target].replace("PS4", "プレステフォー")
    const actionName = slotTable.action[action]
    const stateName = slotTable.state[state]
    const oneActionName = slotTable.oneAction[oneAction]
    const updownName = slotTable.updown[updown]
    const updownMessage = updownName === "アップ" ? "上げます" : "下げます"
    
    // 個別変換
    if (target === "excel") target = `pc Excel`
    if (target === "torne") target = `ps トルネ`
    
    // default
    let command = `${target} ${actionName}`
    let message = `${targetName}を操作します`
    
    if (false) {
    // おはよう or おやすみ
    } else if (oneAction !== "" && oneAction) {
        log("oneAction")
        command = `general ${oneActionName}`
        if (oneAction === "bath" || oneAction === "handspinner") command = `esp8266 ${oneAction}`
        message = oneActionName
        
    // 状態、数字あり
    } else if ((state !== "" && state) && number > -1) {
        log("state && number")
        command = `${target} ${stateName} ${number} 回 ${updownName}`
        message = `${targetName}の${stateName}を${number}${updownMessage}`
        
    // 状態のみ
    } else if (state !== "" && state) {
        log("state")
        command = `${target} ${stateName} ${updownName}`
        message = `${targetName}の${stateName}を${updownMessage}`
        
    // チャンネル
    } else if (number > -1 && channel) {
        log("number")
        command = `tv ${number}`
        message = `テレビで${number}チャンネルを映します`
        
    // 数字のみ
    } else if (number > -1) {
        log("number")
        command = `${target} ${number}`
    }
    
    // error
    if (command.indexOf("undefined") > -1) return fallbackHandler(responseHelper)
    if (message.indexOf("undefined") > -1) return fallbackHandler(responseHelper)
    
    // firebaes書き込み
    log(command)
    if (command) await putFirebase(command)
    
    // 
    log(message)
    speech(responseHelper, message)
    // responseHelper.endSession()
}



// 
const launchHandler = responseHelper => {
    console.log("launchHandler!")
    speech(responseHelper, START_MESSAGE, REPROMPT_MESSAGE)
}

// 
const sessionEndedHandler = responseHelper => {
    console.log("sessionEndedHandler!")
    speech(responseHelper, STOP_MESSAGE)
    responseHelper.endSession()
}

const endHandler = async responseHelper => {
    console.log("endHandler!")
    sessionEndedHandler(responseHelper)
}

// 
const cancelHandler = async responseHelper => {
    console.log('cancelHandler!')
    sessionEndedHandler(responseHelper)
}

// 
const guideHandler = async responseHelper => {
    console.log('guideHandler!')
    speech(responseHelper, HELP_MESSAGE, REPROMPT_MESSAGE)
}

// 
const yesHandler = async responseHelper => {
    console.log('yesHandler!')
    fallbackHandler(responseHelper)
}

// 
const noHandler = async responseHelper => {
    console.log('noHandler!')
    fallbackHandler(responseHelper)
}

const fallbackHandler = async responseHelper => {
    console.log("fallbackHandler!")
    speech(responseHelper, FALLBACK_MESSAGE)
}



//////// export ////////////////////////////////////////////////////////////////

const intentHandler = async responseHelper => {
    switch (responseHelper.getIntentName()) {
        case "ControllIntent": return controllHandler(responseHelper)
        case "EndIntent": return endHandler(responseHelper)
        case 'Clova.CancelIntent': return cancelHandler(responseHelper)
        case 'Clova.GuideIntent': return guideHandler(responseHelper)
        case 'Clova.YesIntent': return yesHandler(responseHelper)
        case 'Clova.NoIntent': return noHandler(responseHelper)
        default: return fallbackHandler(responseHelper)
    }
}

const clovaSkillHandler = clova.Client
    .configureSkill()
    .onLaunchRequest(launchHandler)
    .onIntentRequest(intentHandler)
    .onSessionEndedRequest(sessionEndedHandler)
    .handle()

const app = new express()
app.listen(3000)
app.post("/home-controller-clova", bodyParser.json(), clovaSkillHandler)

const awsServerlessExpress = require('aws-serverless-express')
const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)