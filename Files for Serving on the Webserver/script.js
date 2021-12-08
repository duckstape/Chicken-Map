var mcBasePosX = -909;  //set the ingame coordinate X for where the map sould open when the website is loaded
var mcBasePosZ = -197;  //for Z too
var initalZoomFac = 15; //how far should the map be zoomed in when the website is loaded (1 = one pixel is one block, 10 = ten pixels are one block)

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var pause = false;

async function prg(){
    var response = await fetch("chickens.json");
    var chickenData = await response.json();

    var mapWidth = mapImage.width;
    var mapHeight = mapImage.height;
    
    var canvas = document.getElementById("world");
    var canvasCtx = canvas.getContext("2d");
    var canvasStyle = window.getComputedStyle(canvas);
    var map = document.getElementById("map");
    var mapStyle = window.getComputedStyle(map);
    var zoomInBtn = document.getElementById("zoomIn");
    var zoomOutBtn = document.getElementById("zoomOut");
    var focusPlayerBtn = document.getElementById("focusPlayer");

    

    canvas.width = mapWidth;
    canvas.height = mapHeight;
    map.style.width = mapWidth * initalZoomFac + "px";
    map.style.height = mapHeight * initalZoomFac + "px";
    canvasCtx.imageSmoothingEnabled = true;

    canvasCtx.drawImage(mapImage, 0, 0);

    var scrollableMap = new SpryMap({id : "map",
                         startX: 200,
                         startY: 200,
                         cssClass: "scrollableMap"});

    var resolution = parseInt(canvasStyle.width, 10) / canvas.width;

    let startX = (-resolution * (mcBasePosX - chickenData.bounds.xMin)) + (window.innerWidth/2);
    let startY = (-resolution * (mcBasePosZ - chickenData.bounds.zMin)) + (window.innerHeight/2);

    map.style.left = startX + "px";
    map.style.top = startY + "px";

    function zoomMap(scale){ //scale 1 = 100%; 1.5 = 150%

        if(scale > 1 | parseInt(mapStyle.width, 10) > window.innerWidth){    
            if(parseInt(mapStyle.width, 10) * scale > window.innerWidth){

                var createdOffsetX = ((window.innerWidth/2 - parseInt(map.style.left)) * scale) - (window.innerWidth/2 - parseInt(map.style.left));
                var createdOffsetY = ((window.innerHeight/2 - parseInt(map.style.top)) * scale) - (window.innerHeight/2 - parseInt(map.style.top));

                map.style.width = parseInt(mapStyle.width, 10) * scale + "px";
                map.style.height = parseInt(mapStyle.height, 10) * scale + "px";

                if(parseFloat(map.style.left) < 0){
                    if( parseFloat(map.style.left) - createdOffsetX <= 0){
                        map.style.left = parseFloat(map.style.left) - createdOffsetX + "px";
                    }else{
                        map.style.left = "0px";
                    }
                    
                }
                if(parseFloat(map.style.top) < 0){
                    if (parseFloat(map.style.top) - createdOffsetY <= 0) {
                        map.style.top = parseFloat(map.style.top) - createdOffsetY + "px";
                    } else {
                        map.style.top = "0px";
                    }
                }
            }else{
                map.style.left = "0px";
                map.style.top = "0px";
                map.style.width = window.innerWidth;
            }
        }
    }

    let zoomFac = 0.1;
    zoomInBtn.onclick = () => {
        zoomMap(1 + zoomFac);
    }

    zoomOutBtn.onclick = () => {
        zoomMap(1 - zoomFac);
    }

    var playerIndex = 0;
    focusPlayerBtn.onclick = () => {
        if(chickenData.players.length > 0){
            playerIndex++;
            resolution = parseInt(canvasStyle.width, 10) / canvas.width;

            if (playerIndex > chickenData.players.length - 1) {
                playerIndex = 0;
            }


            let playerX = chickenData.players[playerIndex].x - chickenData.bounds.xMin;
            let playerY = chickenData.players[playerIndex].z - chickenData.bounds.zMin;

            map.style.transitionProperty = "top, left";

            let calcTop = (resolution * -playerY) + (window.innerHeight/2);
            if(calcTop <= 0){
                if(parseInt(mapStyle.height, 10) + calcTop <= window.innerHeight){
                    map.style.top = window.innerHeight - parseInt(mapStyle.height, 10) + "px";
                }else{
                    map.style.top = calcTop + "px";
                }
            }else{
                map.style.top = "0px";
            }
        
            let calcLeft = (resolution * -playerX) + (window.innerWidth/2);
            if(calcLeft <= 0){    
                if(parseInt(mapStyle.width, 10) + calcLeft <= window.innerWidth){
                    map.style.left = window.innerWidth - parseInt(mapStyle.width, 10) + "px";
                }else{
                    map.style.left = calcLeft + "px";
                }
            }else{
                map.style.left = "0px";
            }

            setTimeout(() => {
                map.style.transitionProperty = "none";
            }, 1000);
        }
    }


    var touchStartX;
    var touchStartY;
    var mapStartX;
    var mapStartY;

    map.ontouchmove = (e) => {
        var touchobj = e.changedTouches[0] // reference first touch point for this event
        map.style.left = mapStartX + (parseInt(touchobj.clientX) - touchStartX) + "px";
        map.style.top = mapStartY + (parseInt(touchobj.clientY) - touchStartY) + "px";
        e.preventDefault();
    }

    map.ontouchstart = (e) => {
        var touchobj = e.changedTouches[0];
        touchStartX = parseInt(touchobj.clientX);
        touchStartY = parseInt(touchobj.clientY);
        mapStartX = parseInt(map.style.left);
        mapStartY = parseInt(map.style.top);
    }

    document.onwheel = (e) =>{
        var scale = e.deltaY * -0.0004 + 1;

        if(scale > 1 | parseInt(mapStyle.width, 10) > window.innerWidth){    
            if(parseInt(mapStyle.width, 10) * scale > window.innerWidth){

                var createdOffsetX = ((window.innerWidth/2 - parseInt(map.style.left)) * scale) - (window.innerWidth/2 - parseInt(map.style.left));
                var createdOffsetY = ((window.innerHeight/2 - parseInt(map.style.top)) * scale) - (window.innerHeight/2 - parseInt(map.style.top));

                map.style.width = parseInt(mapStyle.width, 10) * scale + "px";
                map.style.height = parseInt(mapStyle.height, 10) * scale + "px";

                if(parseFloat(map.style.left) < 0){
                    if( parseFloat(map.style.left) - createdOffsetX <= 0){
                        map.style.left = parseFloat(map.style.left) - createdOffsetX + "px";
                    }else{
                        map.style.left = "0px";
                    }
                    
                }
                if(parseFloat(map.style.top) < 0){
                    if (parseFloat(map.style.top) - createdOffsetY <= 0) {
                        map.style.top = parseFloat(map.style.top) - createdOffsetY + "px";
                    } else {
                        map.style.top = "0px";
                    }
                }
            }else{
                map.style.left = "0px";
                map.style.top = "0px";
                map.style.width = window.innerWidth;
            }
        }

    }

    async function updateMap(){
        if(!pause){
            fetch("chickens.json").then(async (response) =>{
                response.json().then((chickenData) => {
                    if(chickenData.updatedMap){
                        chickenData.updateMap = false;
                        window.location.reload();
                    }
            
                    var resolution = parseInt(canvasStyle.width, 10) / canvas.width;
            
                    var chickenDivs = map.getElementsByClassName("chicken");
                    while(chickenDivs[0]) {
                        chickenDivs[0].parentNode.removeChild(chickenDivs[0]);
                    }
            
                    var playerDivs = map.getElementsByClassName("player");
                    while(playerDivs[0]) {
                        playerDivs[0].parentNode.removeChild(playerDivs[0]);
                    }
            
                    chickenData.chickens.forEach(element => {
                        var chick = document.createElement("div");
                        var color = (element.chickens - 0) * (255 - 0) / (chickenData.highestChickenCount - 0) + 0
            
                        chick.style.width = 100/mapWidth + "%";
                        chick.style.height = 100/mapHeight + "%";
                        chick.style.backgroundColor = `rgb(${color}, 0, ${255-color})`;
                        chick.style.top = 100/mapHeight * (element.z - chickenData.bounds.zMin) + "%";
                        chick.style.left = 100/mapWidth * (element.x - chickenData.bounds.xMin) + "%";
                        if(element.chickens === chickenData.highestChickenCount){
                            chick.className = "chicken mostChicken";
                            chick.innerHTML = `<span class="tooltip">Most chicken with ${element.chickens} on one block.</span>`;
                        }else{
                            chick.className = "chicken";
                            chick.innerHTML = `<span class="tooltip">${element.chickens} chicken</span>`; 
                        }
                        
            
                        insertAfter(chick, canvas);
                    });
            
                    chickenData.players.forEach(element => {
                        var player = document.createElement("div");
            
                        player.style.width = 100/mapWidth + "%";
                        player.style.height = 100/mapHeight + "%";
                        player.style.backgroundColor = `rgb(0, 255, 0)`;
                        player.style.top = 100/mapHeight * (element.z - chickenData.bounds.zMin) + "%";
                        player.style.left = 100/mapWidth * (element.x - chickenData.bounds.xMin) + "%"
                        player.className = "player";
                        player.innerHTML = `<span class="pTooltip">${element.name}</span>`;
            
                        insertAfter(player, canvas);
                    });
            
                    if(chickenData.players.length > 0){
                        focusPlayerBtn.disabled = false;
                    }else{
                        focusPlayerBtn.disabled = true;
                        playerIndex = 0;
                    }
    
                    document.getElementById("baroMax").innerText = chickenData.highestChickenCount;
    
                    setTimeout(updateMap, 1000);
                }, () => {
                    setTimeout(updateMap, 1000);
                })}, (e) => {
                    console.log("Parsing chickens.json didn't work, so it'll be ignored.");
                });
        }
    }

    updateMap();
}

var mapImage = new Image();
mapImage.src = "map.png"
mapImage.onload = prg;