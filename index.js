let des = document.getElementById('des').getContext('2d');

let img = new Image();
img.src = './img/fundo1.png';

let x = 0;
let y = 0;
let w = 1200;
let h = 700;

// Criação dos inimigos
let ursoPolar = new Inimigo(1250, 325, 200, 100, './img/inimigo1.png', 2);
let yeti = new Inimigo(1000, 200, 200, 120, './img/inimigo2.png', 3);
let foca = new Inimigo(1500, 400, 100, 50, './img/inimigo3.png', 1);
let coalaMoto = new Inimigo(1250, 475, 300, 175, './img/coalamoto.png');

// Criação do Coração (Já nasce na Fase 1)
let coracao = new Coracao(2000, 300, 90, 60, './img/coracao.png');

// Criação dos Jogadores
let pinguin = new Pinguin(100, 250, 60, 60, './img/pinguim.png');     // Jogador 1
let pinguin2 = new Pinguin(100, 450, 60, 60, './img/pinguim02.png'); // Jogador 2

let jogar = true;
let fase = 1;

document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') pinguin.dir = -8;
    else if (e.key === 's' || e.key === 'S') pinguin.dir = 8;

    if (e.key === 'ArrowUp') pinguin2.dir = -8;
    else if (e.key === 'ArrowDown') pinguin2.dir = 8;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') pinguin.dir = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') pinguin2.dir = 0;
});

function game_over() {
    if (pinguin.vida <= 0 && pinguin2.vida <= 0) jogar = false;
}

function ver_fase() {
    if (fase === 1 && pinguin.pontos === 0 && yeti.x > -400) yeti.esconde();

    if (pinguin.pontos > 100 && fase === 1) {
        fase = 2;
        ursoPolar.vel = 7;
        yeti.vel = 7;
        foca.vel = 7;
        coracao.vel = 7;

        yeti.recomeca();
        coracao.recomeca(); 

        img.src = './img/fundo1.png';
    }
    else if (pinguin.pontos > 200 && fase === 2) {
        fase = 3;
        ursoPolar.vel = 8;
        yeti.vel = 8;
        foca.vel = 8;
        coracao.vel = 8;
        coalaMoto.vel = 18;
        
        if (yeti.x < 0) yeti.recomeca();
        coracao.recomeca(); 

        img.src = './img/fundo2.png';
    } 
}

function colisao() {
    // Colisões do Jogador 1
    if (pinguin.vida > 0) {
        if (pinguin.colid(ursoPolar)) { ursoPolar.recomeca(); pinguin.vida -= ursoPolar.dano; }
        if (fase >= 2 && pinguin.colid(yeti)) { yeti.recomeca(); pinguin.vida -= yeti.dano; }
        if (pinguin.colid(foca)) { foca.recomeca(); pinguin.vida -= foca.dano; }
        
        if (pinguin.colid(coracao)) { coracao.esconde(); pinguin.vida += 1; }
    }

    // Colisões do Jogador 2
    if (pinguin2.vida > 0) {
        if (pinguin2.colid(ursoPolar)) { ursoPolar.recomeca(); pinguin2.vida -= ursoPolar.dano; }
        if (pinguin2.colid(coalaMoto)) { coalaMoto.x = 1750; pinguin2.vida = 0; }
        if (fase >= 2 && pinguin2.colid(yeti)) { yeti.recomeca(); pinguin2.vida -= yeti.dano; }
        if (pinguin2.colid(foca)) { foca.recomeca(); pinguin2.vida -= foca.dano; }
        
        if (pinguin2.colid(coracao)) { coracao.esconde(); pinguin2.vida += 1; }
    }
}

function pontuacao() {
    if (pinguin.point(ursoPolar)) { pinguin.pontos += 5; ursoPolar.recomeca(); }
    if (fase >= 2 && pinguin.point(yeti)) { pinguin.pontos += 5; yeti.recomeca(); }
    if (fase >= 3 && pinguin.point(coalaMoto)) { pinguin.pontos += 5; coalaMoto.x = 1750; }
    if (pinguin.point(foca)) { pinguin.pontos += 5; foca.recomeca(); }
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
        coalaMoto.des_pinguin();
        if (fase >= 2) yeti.des_pinguin();
        foca.des_pinguin();
        coracao.des_pinguin();

        if (pinguin.vida > 0) pinguin.des_pinguin();
        if (pinguin2.vida > 0) pinguin2.des_pinguin();

        des.font = '26px Arial';

        des.fillStyle = '#ff4d4d'; 
        des.fillText('Vidas P1: ' + Math.max(0, pinguin.vida), 40, 40);

        des.fillStyle = '#4da6ff'; 
        des.fillText('Vidas P2: ' + Math.max(0, pinguin2.vida), 200, 40);

        des.fillStyle = 'black';
        des.fillText('Fase: ' + fase, 550, 40);
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
        if (pinguin.vida > 0) pinguin.mov_pinguin();
        if (pinguin2.vida > 0) pinguin2.mov_pinguin();

        ursoPolar.mov_pinguin();
        if (fase >= 2) yeti.mov_pinguin();
        if (fase >= 3) coalaMoto.mov_pinguin();
        foca.mov_pinguin();
        coracao.mov_coracao();

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

// Quando o botão de jogar for clicado, esconde a tela inicial e chama o main()
document.getElementById('btn-jogar').addEventListener('click', () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('des').style.display = 'block';
    main();
});