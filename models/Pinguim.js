export class Obj {
    constructor(posicaoX, posicaoY, largura, altura, sprite) {
        this.posicaoX = posicaoX;
        this.posicaoY = posicaoY;
        this.largura = largura;
        this.altura = altura;
        this.sprite = new Image();
        this.sprite.src = sprite;
    }

    colide(objeto) {
        if (this.posicaoX < objeto.posicaoX + objeto.largura && this.posicaoX + this.largura > objeto.posicaoX && this.posicaoY < objeto.posicaoY + objeto.altura && this.posicaoY + this.altura > objeto.posicaoY) {
            return true;
        } else {
            return false;
        }
    }

    saiuDaTela() {
        return this.posicaoX <= -this.largura;
    }

    desenha(canvas) {
        canvas.drawImage(this.sprite, this.posicaoX, this.posicaoY, this.largura, this.altura);
    }
}

export class Inimigo extends Obj {
    velocidade = 5;

    reseta() {
        this.posicaoX = 1280 + this.largura;
        this.posicaoY = Math.floor(Math.random() * (720 - this.largura));
    }

    atualiza() {
        if (this.posicaoX <= -this.largura) {
            this.reseta();
        }
        this.posicaoX -= this.velocidade;
    }
}

export class Coracao extends Obj {
    velocidade = 5;

    reseta() {
        this.posicaoX = 1280 + this.largura;
        this.posicaoY = Math.floor(Math.random() * (720 - this.largura));
    }

    atualiza() {
        if (this.posicaoX <= -this.largura) {
            this.reseta();
        }
        this.posicaoX -= this.velocidade;
    }
}

export default class Pinguim extends Obj {
    vida = 5;
    direcao = 0;
    velocidade = 5;
    frame = 1;
    tempo = 0;

    anima() {
        this.tempo += 1;
        if (this.tempo > 12) {
            this.tempo = 0;
            this.frame += 1;

            if (this.frame > 4) {
                this.frame = 1;
            }

            const prefixo = this.sprite.src.includes("pinguim2") ? "pinguim2_" : "pinguim_";
            this.sprite.src = "./img/" + prefixo + this.frame + ".png";
        }
    }

    atualiza() {
        this.posicaoY += this.direcao * this.velocidade;

        if (this.posicaoY < 0) {
            this.posicaoY = 0;
        }

        if (this.posicaoY > 720 - this.altura) {
            this.posicaoY = 720 - this.altura;
        }

        if (this.vida > 0 && this.direcao !== 0) {
            if (this.sprite.src.includes("pinguim2")) {
                this.anima("pinguim2");
            } else {
                this.anima("pinguim");
            }
        }
    }

    desenha(canvas) {
        canvas.drawImage(this.sprite, this.posicaoX, this.posicaoY, this.largura, this.altura);
    }
}
