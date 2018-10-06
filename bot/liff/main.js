"use strict"
const log = (...v) => console.log(...v)



// firebase
let ref; if (typeof firebase !== "undefined") ref = firebase.database().ref(config.firebasePath)

// sp max width(16x36)
const spMaxWidth = 576
const device = window.innerWidth <= spMaxWidth ? "sp" : "pc"



// create dom
const createDom = () => {
	// document fragment
	let tabs = document.createDocumentFragment()
	let buttons = document.createDocumentFragment()
	
	// category loop
	data.some(category => {
		log(category.name)
		
		// create tab box
		let tabBox = document.createElement("div")
		tabs.appendChild(tabBox)
		tabBox.className = "tab-box"
		// create tab
		let tab = document.createElement("button")
		tabBox.appendChild(tab)
		tab.className = "tab"
		tab.innerHTML = category.name
		tab.addEventListener("click", function() {selectTab(this)})
		
		// create button group
		let buttonGroup = document.createElement("div")
		buttons.appendChild(buttonGroup)
		buttonGroup.className = "button-group"
		buttonGroup.setAttribute("data-group", category.name)
		
		// button data loop
		for (let buttonData of category.buttons) {
			// create button box
			let buttonBox = document.createElement("div")
			buttonGroup.appendChild(buttonBox)
			buttonBox.className = "button-box"
			buttonBox.style.width = 100 / buttonData.column + "%"
			
			// check blank
			if (buttonData.name) {
				// create button
				let button = document.createElement("button")
				buttonBox.appendChild(button)
				button.className = "button"
				button.innerHTML = buttonData.name
				button.addEventListener("click", () => run(buttonData))
			}
		}
	})
	
	// Notifierにtextbox追加
	const notifierGroup = buttons.querySelector(`.button-group[data-group="Notifier"]`)
	if (notifierGroup) {
		const textBox = document.createElement("div")
		notifierGroup.insertBefore(textBox, notifierGroup.firstChild)
		textBox.className = "text-box"
		//
		const text = document.createElement("input")
		textBox.appendChild(text)
		text.type = "text"
		text.placeholder = "enter the free words!"
		//
		const button = document.createElement("button")
		textBox.appendChild(button)
		button.className = "button"
		button.innerHTML = "Notice"
		button.addEventListener("click", () => {
			run({"name": "Notice", "command": `notifier ${text.value}`})
			text.value = ""
		})
	}
	
	// 最初の要素選択
	tabs.querySelector(".tab").classList.toggle("tab-selected")
	buttons.querySelector(".button-group").classList.toggle("button-group-selected")
	
	// dom反映
	document.getElementById("tabs").appendChild(tabs)
	document.getElementById("buttons").appendChild(buttons)
}

// button click
const run = buttonData => {
	//firebase command
	log(buttonData.command)
	if (typeof ref !== "undefined") ref.set(buttonData.command)
	//toast
	toast(buttonData.name)
}

// tab click
const selectTab = tab => {
	// .tab-selected付け替え
	document.getElementsByClassName("tab-selected")[0].classList.toggle("tab-selected")
	tab.classList.toggle("tab-selected")
	// button group表示切り替え
	document.getElementsByClassName("button-group-selected")[0]
		.classList.toggle("button-group-selected")
	document.querySelector(`.button-group[data-group="${tab.innerHTML}"]`)
		.classList.toggle("button-group-selected")
	// fadein
	fadein(document.querySelector(`.button-group[data-group="${tab.innerHTML}"]`), 250)
}

// fadein
const fadein = (elem, fadeTime) => {
	elem.style.opacity = 0
	elem.style.zindex = 0
	const begin = new Date();
	var id = setInterval(function() {
		var current = new Date() - begin
		if (current > fadeTime){
			clearInterval(id)
			current = fadeTime
		}
		elem.style.opacity = current / fadeTime
	}, 10);
}
// fadeout
const fadeout = (elem, fadeTime) => {
	elem.style.opacity = 100
	elem.style.zindex = 0
	const begin = new Date()
	var id = setInterval(function() {
		var current = fadeTime - (new Date() - begin)
		if (current <= 0){
			clearInterval(id)
			current = 0
		}
		elem.style.opacity = current / fadeTime
	}, 10);
}

//toast
const toast = message => {
	const toast = document.getElementById("toast")
	const toastMessage = document.createElement("div")
	toastMessage.innerHTML = message
	toast.innerHTML = ""
	toast.appendChild(toastMessage)
	toast.style.width = message.length + 2.25 + "rem"
	// fade
	fadein(toastMessage, 250)
	setTimeout(() => {
		fadeout(toastMessage, 500)
		setTimeout(()=> {try {toast.removeChild(toastMessage)} catch(e) {}}, 500)
	}, 1500)
}



// スワイプでタブ切替
const setSwipeEvent = () => {
	// set
	const set = (eventData) => {
		// start event
		document.addEventListener(eventData.startEvent, event => {
			if (exclusionArea(event)) return
			this.startX = eventData.startX(event)
		})
		
		// end event
		document.addEventListener(eventData.endEvent, event => {
			if (exclusionArea(event)) return
			this.endX = eventData.endX(event)
			swipe()
		})
		
		// タブ領域を除外
		const exclusionArea = event => event.target.offsetParent && (
			(event.target.id || event.target.offsetParent.id) === "tabs" || 
			(event.target.className || event.target.offsetParent.className) === "text-box" 
		)
		
		// スワイプ動作実装
		const swipe = () => {
			// scroll size(16*6)
			const scrollSize = 96
			const margin = 50
			
			// swipe left
			if (this.startX > (this.endX + margin)) {
				// tab scroll right
				document.getElementById("tabs").scrollBy(scrollSize, 0)
				// tab right shift
				let flag = false
				for (const tab of document.getElementsByClassName("tab")) {
					if (flag) return selectTab(tab)
					if (tab.classList.contains("tab-selected")) flag = true
				}
			
			// swipe right
			} else if ((this.startX + margin) < this.endX) {
				// tab scroll left
				document.getElementById("tabs").scrollBy(scrollSize * -1, 0)
				// tab left shift
				let prevTab = document.getElementsByClassName("tab-selected")[0]
				for (const tab of document.getElementsByClassName("tab")) {
					if (tab.classList.contains("tab-selected")) selectTab(prevTab)
					prevTab = tab
				}
				
			}
		}
	}
	// touch event
	set({
		"startEvent" : "touchstart",
		"startX": event => event.touches[0].pageX,
		"endEvent": "touchend",
		"endX": event => event.changedTouches[0].pageX,
	})
	// mouse event
	set({
		"startEvent" : "mousedown", 
		"startX": event => event.screenX,
		"endEvent": "mouseup",
		"endX": event => event.screenX,
	})
}



// content loaded
document.addEventListener("DOMContentLoaded", event => {
	// dom生成
	createDom()
	// スワイプでタブ切替
	setSwipeEvent()
})
