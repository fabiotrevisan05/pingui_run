class Obj {
    constructor(x, y, w, h, a, dano = 1) { 
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.a = a;
        this.dano = dano; 
        
        this.img = new Image();
        this.img.src = this.a;
    }

    des_pinguin() {
        if (this.img.complete && this.img.naturalWidth !== 0) {
            des.drawImage(this.img, this.x, this.y, this.w, this.h);
        } else {
            des.fillStyle = 'red';
            des.fillRect(this.x, this.y, this.w, this.h);
        }
    }

    des_quad() {
        des.fillStyle = this.a;
        des.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Pinguin extends Obj {
    dir = 0;
    vida = 5;
    pontos = 0;

    mov_pinguin() {
        this.y += this.dir;
        if (this.y < 62) {
            this.y = 62;
        } else if (this.y > 692) {
            this.y = 692;
        }
    }

    colid(objeto) {
        if ((this.x < objeto.x + objeto.w) &&
            (this.x + this.w > objeto.x) &&
            (this.y < objeto.y + objeto.h) &&
            (this.y + this.h > objeto.y)) {
            return true;
        } else {
            return false;
        }
    }

    point(objeto) {
        if (objeto.x <= -100) {
            return true;
        } else {
            return false;
        }
    }
}

class Inimigo extends Obj {
    vel = 4; // Dobramos a velocidade inicial da Fase 1 (era 2, agora é 4)

    recomeca() {
        let minX = 1300;
        let maxX = 1800;

        // Diminui o espaço entre os inimigos gradualmente conforme a fase avança
        // Isso aumenta brutalmente a frequência de Spawn (nascimento)
        if (typeof fase !== 'undefined') {
            if (fase === 1) {
                minX = 1200; maxX = 1600; 
            } else if (fase === 2) {
                minX = 1200; maxX = 1450; // Eles nascem mais espremidos na fase 2
            } else if (fase >= 3) {
                minX = 1200; maxX = 1350; // Quase sem intervalo na fase 3
            }
        }

        this.x = Math.floor(Math.random() * (maxX - minX) + minX); 
        this.y = Math.floor(Math.random() * (638 - 62) + 62);
    }

    esconde() {
        this.x = -500;
    }

    mov_pinguin() {
        this.x -= this.vel;
        // Evita que inimigos escondidos (yeti na fase 1) renasçam sozinhos
        if (this.x <= -200 && this.x > -400) {
            this.recomeca();
        }
    }
}