fx_version 'cerulean'
game 'gta5'

author '⸸♱♥IDK_FORCE♥♱⸸#7611'---- Original Author = Akkariin

description 'fs-fh4speed' 

ui_page "html/hud.html"

files {
	"html/hud.html",
	"html/js/gauge.min.js",
	"html/js/hud.js",
	"html/css/hud.css",
	"html/fonts/Oswald-Light.eot",
	"html/fonts/Oswald-Light.svg",
	"html/fonts/Oswald-Light.ttf",
	"html/fonts/Oswald-Light.woff",
	"html/fonts/Oswald-Light.woff2",
	"html/fonts/Oswald-Regular.eot",
	"html/fonts/Oswald-Regular.svg",
	"html/fonts/Oswald-Regular.ttf",
	"html/fonts/Oswald-Regular.woff",
	"html/fonts/Oswald-Regular.woff2",
	"html/images/speedcircle.png",
}

server_script {
	'server.lua'
}

client_script "client.lua"
