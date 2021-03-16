var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

// Taille du canvas indéxé sur la fenetre 
var CANVAS_WIDTH = window.innerWidth;
var CANVAS_HEIGHT = window.innerHeight;

canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

// Objet ballon 
const ballon = {
    coeffRestitution : 0.8,     // perte energie lors du choc ( = 20% de perte)
    coeffAcceleration : 0.75,   // equivalent a la gravité
    friction:0.98,              // friction entre la balle et le sol
    position : {                // Coordonnes X et Y du ballon
        x:CANVAS_WIDTH/2,
        y:0
    },
    speed : {                   // Vitesse du ballon
        x:10,
        y:10
    },
    ballRadius : 20,            // rayon du ballon
    InvertXSpeed: function(){this.speed.x *= -1;}, // Inverse la velocité selon l'axe X
    InvertYSpeed: function(){this.speed.y *= -1;}, // Inverse la velocité selon l'axe y
    // Fonction de mise à jour de la balle
    update :function(){
        // Acceleration / deceleration
        this.speed.y += this.coeffAcceleration;
    
        // MAJ position
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        // rebond Bas
        if((this.position.y + this.ballRadius >= CANVAS_HEIGHT)){
            this.position.y = CANVAS_HEIGHT-this.ballRadius;
            this.InvertYSpeed();
            this.speed.y *= this.coeffRestitution;
            this.speed.x *= this.friction;
        }
        // rebond Haut
        if((this.position.y - this.ballRadius <= 0)){
            this.position.y = 0 + this.ballRadius;
            this.InvertYSpeed();
        }
        // rebond droite
        if(this.position.x + this.ballRadius >= CANVAS_WIDTH){
            this.position.x = CANVAS_WIDTH - this.ballRadius;
            this.InvertXSpeed();
            this.speed.x *= this.coeffRestitution;
        }
        // rebond gauche
        if(this.position.x - this.ballRadius <= 0){
            this.position.x = this.ballRadius;
            this.InvertXSpeed();
            this.speed.x *= this.coeffRestitution;
        }
    },
    // Fonction d'affichage de la balle sur le canvas
    draw: function(){
        ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.beginPath();
        ctx.arc(ballon.position.x,ballon.position.y , ballon.ballRadius, 0, Math.PI*2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}


/*
    Fonctions de MAJ / Affichage de la balle
*/
function animateBall(){
    draw();
    update();
    requestAnimationFrame(animateBall); 
}
function update(){
    ballon.update();
}
function draw(){
   ballon.draw();
}


// Lors de chaque redimenssionnement de la fenetre
window.addEventListener('resize',() => {

    // position en % du ballon sur les axes x et y
    var width_pourcentage = ballon.position.x/CANVAS_WIDTH;
    var height_pourcentage = ballon.position.y/CANVAS_HEIGHT;

    CANVAS_HEIGHT = window.innerHeight;
    CANVAS_WIDTH = window.innerWidth;

    // MAJ des dimensions du canvas
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;

    // MAJ de la position en fonction des proportions de l'ancienne position pour aspect responsibe
    ballon.position.x = CANVAS_WIDTH*width_pourcentage;
    ballon.position.y = CANVAS_HEIGHT*height_pourcentage;
})

// lancement de l'animation quand les ressources sont chargés
window.addEventListener('load', () => {
    animateBall();
});





