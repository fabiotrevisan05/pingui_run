import Pinguim, { Inimigo, Coracao } from './models/Pinguim.js';

const canvas = document.getElementById('canvas').getContext('2d');
const musicaFundo = new Audio('./musica.mp3');
const background = new Image();

musicaFundo.loop = true;
musicaFundo.volume = 0.5;

let estado = 'inicio';
let fase = 1;
let pontos = 0;

const ursoPolar = new Inimigo(1250, 325, 200, 100, './img/inimigo1.png');
const yeti = new Inimigo(1000, 200, 200, 120, './img/inimigo2.png');
const foca = new Inimigo(1500, 400, 100, 50, './img/inimigo3.png');
const coalaMoto = new Inimigo(1250, 475, 300, 175, './img/coalamoto.png', true);
const coracao = new Coracao(2000, 300, 50, 50, './img/coracao.png');

const pinguim = new Pinguim(75, 250, 50, 75, './img/pinguim_1.png');
const pinguim2 = new Pinguim(125, 450, 50, 75, './img/pinguim2_1.png');

function gerenciarMusica() {
    if (estado === 'jogando') {
        if (musicaFundo.paused) {
            musicaFundo.play();
        }
    } else {
        musicaFundo.pause();
    }
}

function resetarJogo() {
    fase = 1;
    pontos = 0;
    estado = 'jogando';

    pinguim.vida = 5;
    pinguim2.vida = 5;
    pinguim.posicaoY = 250;
    pinguim2.posicaoY = 450;
    pinguim.direcao = 0;
    pinguim2.direcao = 0;

    ursoPolar.reseta();
    yeti.reseta();
    foca.reseta();
    coalaMoto.reseta();
    coalaMoto.posicaoY = 475;
    coracao.reseta();
}

function colisao() {
    if (pinguim.vida > 0) {
        if (pinguim.colide(ursoPolar)) {
            ursoPolar.reseta();
            pinguim.vida--;
        }

        if (pinguim.colide(foca)) {
            foca.reseta();
            pinguim.vida--;
        }

        if (fase >= 2 && pinguim.colide(yeti)) {
            yeti.reseta();
            pinguim.vida--;
        }

        if (fase >= 3 && pinguim.colide(coalaMoto)) {
            coalaMoto.reseta();
            coalaMoto.posicaoY = 475;
            pinguim.vida--;
        }

        if (pinguim.colide(coracao)) {
            coracao.reseta();
            pinguim.vida++;
        }
    }

    if (pinguim2.vida > 0) {
        if (pinguim2.colide(ursoPolar)) {
            ursoPolar.reseta();
            pinguim2.vida--;
        }

        if (pinguim2.colide(foca)) {
            foca.reseta();
            pinguim2.vida--;
        }

        if (fase >= 2 && pinguim2.colide(yeti)) {
            yeti.reseta();
            pinguim2.vida--;
        }

        if (fase >= 3 && pinguim2.colide(coalaMoto)) {
            coalaMoto.reseta();
            coalaMoto.posicaoY = 475;
            pinguim2.vida--;
        }

        if (pinguim2.colide(coracao)) {
            coracao.reseta();
            pinguim2.vida++;
        }
    }
}

function pontuacao() {
    if (ursoPolar.saiuDaTela()) {
        ursoPolar.reseta();
        pontos += 5;
    }

    if (foca.saiuDaTela()) {
        foca.reseta();
        pontos += 5;
    }

    if (fase >= 2 && yeti.saiuDaTela()) {
        yeti.reseta();
        pontos += 5;
    }

    if (fase >= 3 && coalaMoto.saiuDaTela()) {
        coalaMoto.reseta();
        coalaMoto.posicaoY = 475;
        pontos += 5;
    }

    if (coracao.saiuDaTela()) {
        coracao.reseta();
        pontos += 5;
    }
}

function verificaFase() {
    if (fase === 1 && pontos >= 50) {
        fase = 2;
    } else if (fase === 2 && pontos >= 100) {
        fase = 3;
    }
}

function verificaGameOver() {
    if (pinguim.vida <= 0 && pinguim2.vida <= 0) {
        estado = 'gameOver';
    }
}

function verificaVitoria() {
    if (fase === 3 && pontos >= 150) {
        estado = 'vitoria';
    }
}

function desenhaTela(titulo, linhas, corFundo, corTitulo) {
    canvas.fillStyle = corFundo;
    canvas.fillRect(0, 0, 1280, 720);
    canvas.font = '50px Metamorphous';
    canvas.fillStyle = corTitulo;
    canvas.fillText(titulo, 400, 200);
    canvas.font = '20px Metamorphous';
    canvas.fillStyle = 'white';
    linhas.forEach((linha, i) => {
        canvas.fillText(linha, 400, 300 + i * 40);
    });
}

function desenhaJogo() {
    background.src = `./img/fundo${fase}.png`;
    canvas.drawImage(background, 0, 0, 1280, 720);

    ursoPolar.desenha(canvas);
    foca.desenha(canvas);
    coracao.desenha(canvas);

    if (fase >= 2) {
        yeti.desenha(canvas);
    }

    if (fase >= 3) {
        coalaMoto.desenha(canvas);
    }

    if (pinguim.vida > 0) {
        pinguim.desenha(canvas);
    }

    if (pinguim2.vida > 0) {
        pinguim2.desenha(canvas);
    }

    canvas.font = '27px Metamorphous';
    canvas.fillStyle = '#ff4d4d';
    canvas.fillText(`Vidas P1: ${Math.max(0, pinguim.vida)}`, 40, 40);
    canvas.fillStyle = '#4da6ff';
    canvas.fillText(`Vidas P2: ${Math.max(0, pinguim2.vida)}`, 200, 40);
    canvas.fillStyle = 'black';
    canvas.fillText(`Fase: ${fase}`, 550, 40);
    canvas.fillText(`Pontos: ${pontos}`, 1000, 40);
}

function desenha() {
    if (estado === 'inicio') {
        desenhaTela('Pingui Run', [
            'Pinguim 1: W (cima) e S (baixo)',
            'Pinguim 2: Setas Cima e Baixo',
            '',
            'Sobreviva, pegue corações congelados',
            'e desvie dos seus inimigos da neve!',
            '',
            'Pressione ESPAÇO para começar'
        ], '#003366', '#ffffff');
    }

    if (estado === 'jogando') {
        desenhaJogo();
    }

    if (estado === 'gameOver') {
        desenhaTela('Game Over', [`Pontos: ${pontos}`, 'Pressione ESPACO para reiniciar'], '#1a0000', '#ff4d4d');
    }

    if (estado === 'vitoria') {
        desenhaTela('Você Venceu!', [`Pontos: ${pontos}`, 'Pressione ESPACO para reiniciar'], '#001a00', '#66ff66');
    }
}

function atualiza() {
    gerenciarMusica();

    if (estado === 'jogando') {
        if (fase >= 2) {
            ursoPolar.velocidade = 6;
            yeti.velocidade = 6;
            foca.velocidade = 6;
            coracao.velocidade = 6;
        }

        if (fase === 3) {
            ursoPolar.velocidade = 7;
            yeti.velocidade = 7;
            foca.velocidade = 7;
            coracao.velocidade = 7;
            coalaMoto.velocidade = 14;
        }

        ursoPolar.atualiza();
        foca.atualiza();
        coracao.atualiza();

        if (fase >= 2) {
            yeti.atualiza();
        }

        if (fase >= 3) {
            coalaMoto.atualiza();
        }

        if (pinguim.vida > 0) {
            pinguim.atualiza();
        } else {
            pinguim.direcao = 0;
        }

        if (pinguim2.vida > 0) {
            pinguim2.atualiza();
        } else {
            pinguim2.direcao = 0;
        }

        colisao();
        pontuacao();
        verificaFase();
        verificaGameOver();
        verificaVitoria();
    }
}

function main() {
    canvas.clearRect(0, 0, 1280, 720);
    desenha();
    atualiza();
    requestAnimationFrame(main);
}

document.addEventListener('keydown', (evento) => {
    if (estado === 'inicio' && evento.code === 'Space') {
        estado = 'jogando';
    }

    if (estado === 'jogando') {
        if (evento.key === 'w' || evento.key === 'W') {
            pinguim.direcao = -1;
        }

        if (evento.key === 's' || evento.key === 'S') {
            pinguim.direcao = 1;
        }

        if (evento.key === 'ArrowUp') {
            pinguim2.direcao = -1;
        }

        if (evento.key === 'ArrowDown') {
            pinguim2.direcao = 1;
        }
    }

    if (evento.code === 'Space' && (estado === 'gameOver' || estado === 'vitoria')) {
        resetarJogo();
    }
});

document.addEventListener('keyup', (evento) => {
    if (evento.key === 'w' || evento.key === 's' || evento.key === 'W' || evento.key === 'S') {
        pinguim.direcao = 0;
    }

    if (evento.key === 'ArrowUp' || evento.key === 'ArrowDown') {
        pinguim2.direcao = 0;
    }
});

main();
