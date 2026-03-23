let des = document.getElementById('des').getContext('2d');

let img = new Image();
img.src = './img/fundo1.png';

let x = 0;
let y = 0;
let w = 1200;
let h = 700;

// Criação dos inimigos
let ursoPolar = new Inimigo(500, 325, 300, 100, './img/inimigo1.png', 2);
let yeti = new Inimigo(1000, 200, 250, 120, './img/inimigo2.png', 3);
let foca = new Inimigo(1500, 400, 150, 50, './img/inimigo3.png', 1);

// Criação dos Jogadores (Nasem em posições Y diferentes para não ficarem colados)
let pinguin = new Pinguin(100, 250, 80, 50, './img/pinguim.png');     // Jogador 1
let pinguin2 = new Pinguin(100, 450, 80, 50, './img/pinguim02.png'); // Jogador 2

let jogar = true;
let fase = 1;

// CONTROLES SEPARADOS
document.addEventListener('keydown', (e) => {
    // Controles do Jogador 1 (W / S)
    if (e.key === 'w' || e.key === 'W') {
        pinguin.dir = -8;
    } else if (e.key === 's' || e.key === 'S') {
        pinguin.dir = 8;
    }
    
    // Controles do Jogador 2 (Setas)
    if (e.key === 'ArrowUp') {
        pinguin2.dir = -8;
    } else if (e.key === 'ArrowDown') {
        pinguin2.dir = 8;
    }
});

document.addEventListener('keyup', (e) => {
    // Parar Jogador 1
    if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
        pinguin.dir = 0;
    } 
    // Parar Jogador 2
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        pinguin2.dir = 0;
    }
});

function game_over() {
    // O jogo só acaba se a vida dos DOIS chegar a zero
    if (pinguin.vida <= 0 && pinguin2.vida <= 0) {
        jogar = false;
    }
}

function ver_fase() { 
    // Usa a pontuação do Pinguin 1 que funciona como "Pontuação da Equipe"
    if (fase === 1 && pinguin.pontos === 0 && yeti.x > -400) {
        yeti.esconde();
    }

    if (pinguin.pontos > 20 && fase === 1) {
        fase = 2;

        ursoPolar.vel = 6;
        yeti.vel = 6;
        foca.vel = 6;

        yeti.recomeca(); 

        img.src = './img/fundo1.png'; 
    } 
    else if (pinguin.pontos > 40 && fase === 2) {
        fase = 3;

        ursoPolar.vel = 8;
        yeti.vel = 8;
        foca.vel = 8;

        if(yeti.x < 0) yeti.recomeca(); 

        img.src = './img/fundo2.png';
    }
}

function colisao() {
    // Colisões do Jogador 1 (Só toma dano se estiver vivo)
    if (pinguin.vida > 0) {
        if (pinguin.colid(ursoPolar)) { ursoPolar.recomeca(); pinguin.vida -= ursoPolar.dano; }
        if (fase >= 2 && pinguin.colid(yeti)) { yeti.recomeca(); pinguin.vida -= yeti.dano; }
        if (pinguin.colid(foca)) { foca.recomeca(); pinguin.vida -= foca.dano; }
    }
    
    // Colisões do Jogador 2 (Só toma dano se estiver vivo)
    if (pinguin2.vida > 0) {
        if (pinguin2.colid(ursoPolar)) { ursoPolar.recomeca(); pinguin2.vida -= ursoPolar.dano; }
        if (fase >= 2 && pinguin2.colid(yeti)) { yeti.recomeca(); pinguin2.vida -= yeti.dano; }
        if (pinguin2.colid(foca)) { foca.recomeca(); pinguin2.vida -= foca.dano; }
    }
}

function pontuacao() {
    // Usamos o pinguin 1 só para checar a passagem, a pontuação é da equipe!
    if (pinguin.point(ursoPolar)) {
        pinguin.pontos += 5;
        ursoPolar.recomeca();
    }
    if (fase >= 2 && pinguin.point(yeti)) {
        pinguin.pontos += 5;
        yeti.recomeca();
    }
    if (pinguin.point(foca)) {
        pinguin.pontos += 5;
        foca.recomeca();
    }
}

function desenha() {
    if (jogar) {
        if (img.complete && img.naturalWidth !== 0) {
            des.drawImage(img, x, y, w, h);
        } else {
            des.fillStyle = '#2c3e50';
            des.fillRect(x, y, w, h);
        }

        ursoPolar.des_pinguin();
        if (fase >= 2) yeti.des_pinguin();
        foca.des_pinguin();
        
        // Só desenha o jogador se ele estiver vivo
        if (pinguin.vida > 0) pinguin.des_pinguin();
        if (pinguin2.vida > 0) pinguin2.des_pinguin();

        // HUD - Interface
        des.font = '26px Arial';
        
        // Vidas Jogador 1
        des.fillStyle = '#ff4d4d'; // Vermelho
        des.fillText('Vidas P1: ' + Math.max(0, pinguin.vida), 40, 40);
        
        // Vidas Jogador 2
        des.fillStyle = '#4da6ff'; // Azul
        des.fillText('Vidas P2: ' + Math.max(0, pinguin2.vida), 200, 40);

        des.fillStyle = 'white';
        des.fillText('Fase: ' + fase, 550, 40);

        des.fillStyle = 'yellow';
        des.fillText('Pontos: ' + pinguin.pontos, 1000, 40);

    } else {
        des.fillStyle = 'black';
        des.fillRect(x, y, w, h); 

        des.font = '60px Arial';
        des.fillStyle = 'yellow';
        des.fillText('GAME OVER', 400, 350);

        des.font = '25px Arial';
        des.fillStyle = 'white';
        des.fillText('Pontuação Final: ' + pinguin.pontos, 480, 400);
    }
}

function atualiza() {
    if (jogar) {
        // Só movimenta se estiver vivo
        if (pinguin.vida > 0) pinguin.mov_pinguin();
        if (pinguin2.vida > 0) pinguin2.mov_pinguin();

        ursoPolar.mov_pinguin();
        if (fase >= 2) yeti.mov_pinguin();
        foca.mov_pinguin();

        colisao();
        pontuacao();
        ver_fase();
        game_over();
    }
}

function main() {
    des.clearRect(0, 0, 1200, 700);
    desenha();
    atualiza();
    requestAnimationFrame(main);
}

main();