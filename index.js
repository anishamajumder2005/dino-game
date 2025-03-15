let board;
let boardWidth=950;
let boardHeight=350;
let context;
let dinoWidth=82;
let dinoHeight=88;
let dinoX=50;
let dinoY=boardHeight-dinoHeight;
let dinoImg;
// dinosaur
let dino={
    x:dinoX,
    y:dinoY,
    width:dinoWidth,
    height:dinoHeight
}
// cactus
let cactusArray=[];
let cactus1Width=34;
let cactus2Width=69;
let cactus3Width=102;
let cactusHeight=70;
let cactusX=700;
let cactusY=boardHeight-cactusHeight;
let cactus1Img;
let cactus2Img;     
let cactus3Img;

// Bird Obstacles
let birdArray = [];
let birdWidth = 46;
let birdHeight = 40;
let birdY = boardHeight - 140; // Birds fly at a fixed height
let birdImg;

let reset;
let velocityX=-10;
let velocityY=0;
let gravity=0.4;
let gameover=false;
let score=0; 
let highscore=0;
window.onload=function(){
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");
    //context.fillStyle="green";
    //context.fillRect(dino.x,dino.y,dino.width,dino.height);
    dinoImg=new Image();
    dinoImg.src="./dino.png";
    dinoImg.onload=function(){
        context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
    }    
    cactus1Img=new Image();
    cactus1Img.src="./cactus1.png";
    cactus2Img=new Image();
    cactus2Img.src="./cactus2.png";
    cactus3Img=new Image();
    cactus3Img.src="./cactus3.png";

    birdImg = new Image();
    birdImg.src = "./bird1.png";
    reset = new Image();
    reset.src = "./reset.png";
    backgroundMusic = new Audio("./i-love-my-8-bit-game-console-301272.mp3");  
    backgroundMusic.loop = true; // Keep playing in a loop
    backgroundMusic.volume = 0.5; // Adjust volume (0.0 to 1.0)
    document.addEventListener("click", playMusic);
    document.addEventListener("keydown", playMusic);
    requestAnimationFrame(update);
    setInterval(placeCactus,1000);
    //setInterval(placeBird, 2000);
    document.addEventListener("keydown",jump);
    document.addEventListener("click", function (e) {
        if (!gameover) return;
    
        let rect = board.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        let clickY = e.clientY - rect.top;
    
        if (clickX >= boardWidth / 2 - 50 && clickX <= boardWidth / 2 + 50 &&
            clickY >= boardHeight / 2 - 50 && clickY <= boardHeight / 2 + 50) {
            restartGame();
        }
    });
    
}
function playMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
    }
}
function update(){
    requestAnimationFrame(update);
    if(gameover)return;
    context.clearRect(0,0,boardWidth,boardHeight);
    velocityY+=gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
    //cactus
    for(let i=0;i<cactusArray.length;i++){
        let cactus=cactusArray[i];
        cactus.x+=velocityX; 
        context.drawImage(cactus.img,cactus.x,cactus.y,cactus.width,cactus.height);
        if(detectCollision(dino,cactus)){
            gameover=true;
            dinoImg.src="./dino-dead.png";
            dinoImg.onload=function(){
                context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
            }
            context.fillStyle="black";
            context.font="30px Arial";
            context.drawImage(reset, boardWidth / 2 - 50, boardHeight / 2 - 50, 100, 100);  
            return;
        }
    }
    for(let i=0;i<birdArray.length;i++){
        let bird=birdArray[i];
        bird.x+=velocityX;
        context.drawImage(bird.img,bird.x,bird.y,bird.width,bird.height);
        if(detectCollision(dino,bird)){
            gameover=true;
            dinoImg.src="./dino-dead.png";
            dinoImg.onload=function(){
                context.drawImage(dinoImg,dino.x,dino.y,dino.width,dino.height);
            }
            context.fillStyle="black";
            context.font="30px Arial";
            context.drawImage(reset, boardWidth / 2 - 50, boardHeight / 2 - 50, 100, 100);  
            return;
        }
    }
    context.fillStyle="black";
    context.font="20px Arial bold";
    score++;
    if(score>highscore){
        highscore=score;
    }
    context.fillText("Score: "+score,10,30);
    context.fillText("Highscore: "+highscore,10,60);
}
function jump(e){
    if(gameover)return;
    if((e.code=="Space"||e.code=="ArrowUp")&&dino.y==dinoY){
        // jump
        velocityY=-10;

    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        // Duck
        dinoImg.src = "./dino-duck.png";
        dino.height = 60;
        dino.y = boardHeight - dino.height;
    }
}
document.addEventListener("keyup", function(e) {
    if (e.code == "ArrowDown") {
        dinoImg.src = "./dino.png"; // Restore original image
        dino.height = dinoHeight;   // Restore original height
        dino.y = boardHeight - dino.height;
    }
});
function placeCactus(){
    
    let cactus={
        img:null,
        x:cactusX,
        y:cactusY,
        width:null,
        height:cactusHeight
    }
    let placeCactusChance=Math.random();
    if(placeCactusChance>0.90){
        cactus.img=cactus3Img;
        cactus.width=cactus3Width;
        cactusArray.push(cactus);
    }else if(placeCactusChance>0.70){
        cactus.img=cactus2Img;
        cactus.width=cactus2Width;
        cactusArray.push(cactus);
    }else if(placeCactusChance>0.50){
        cactus.img=cactus1Img;
        cactus.width=cactus1Width;
        cactusArray.push(cactus);
    }
    if(cactusArray.length>5){
        cactusArray.shift();
    }
}
function placeBird(){
    let bird = {
        img: birdImg,
        x: birdWidth,
        y: birdY,
        width: birdWidth,
        height: birdHeight
    }
    birdArray.push(bird);
    if (birdArray.length > 3) {
        birdArray.shift();
    }
}
function detectCollision(a,b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height && 
    a.y + a.height > b.y;
}
function restartGame() {
    gameover = false;
    score = 0;
    cactusArray = [];
    dino.y = dinoY;
    velocityY = 0;  // Reset velocity to ensure smooth jump
    dinoImg.src = "./dino.png";

}
