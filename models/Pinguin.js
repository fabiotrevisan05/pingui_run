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
    constructor(x, y, w, h, a) {
        // O "super" chama o constructor da classe Obj para inicializar o x, y, w, h, etc.
        super(x, y, w, h, a); 
        
        this.dir = 0;
        this.vida = 5;
        this.pontos = 0;
        
        // --- LÓGICA DE ANIMAÇÃO ---
        this.frames = [];
        this.frameAtual = 0;
        this.tick = 0;
        this.velocidadeAnimacao = 6; // Troca de frame a cada 6 "ticks"
        
        // Se a imagem base que o index.js passou tiver "02", sabemos que é o Jogador 2
        let prefixoSprite = this.a.includes('02') ? 'pinguim2_anima' : 'pinguim_anima';
        
        // Carrega as 4 imagens da animação
        for (let i = 1; i <= 4; i++) {
            let imgAnim = new Image();
            imgAnim.src = `./img/${prefixoSprite}${i}.png`;
            this.frames.push(imgAnim);
        }
    }

    mov_pinguin() {
        this.y += this.dir;
        
        // Limites da tela
        if (this.y < 62) {
            this.y = 62;
        } else if (this.y > 692) {
            this.y = 692;
        }

        // --- ATUALIZA A ANIMAÇÃO ---
        // Se this.dir não for 0, significa que o pinguim está andando para cima ou para baixo
        if (this.dir !== 0) {
            if (this.tick % this.velocidadeAnimacao === 0) {
                this.frameAtual = (this.frameAtual + 1) % this.frames.length;
            }
        } else {
            this.frameAtual = 0; // Se parou, volta para o frame 0 (parado)
        }
        
        this.tick++;
    }

    // Sobrescrevemos o des_pinguin() exclusivo para o Pinguin desenhar a animação
    des_pinguin() {
        let imgAtual = this.frames[this.frameAtual];
        
        if (imgAtual.complete && imgAtual.naturalWidth !== 0) {
            des.drawImage(imgAtual, this.x, this.y, this.w, this.h);
        } else {
            des.fillStyle = 'blue'; // Coloquei azul para você saber se o erro for na animação
            des.fillRect(this.x, this.y, this.w, this.h);
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
    vel = 4;

    recomeca() {
        let minX = 1300;
        let maxX = 1800;

        if (typeof fase !== 'undefined') {
            if (fase === 1) {
                minX = 1200; maxX = 1600; 
            } else if (fase === 2) {
                minX = 1200; maxX = 1450; 
            } else if (fase >= 3) {
                minX = 1200; maxX = 1350; 
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
        if (this.x <= -200 && this.x > -400) {
            this.recomeca();
        }
    }
}

class Coracao extends Obj {
    vel = 5; 

    recomeca() {
        // Nasce uma vez a cada fase
        this.x = Math.floor(Math.random() * (2500 - 1500) + 1500); 
        this.y = Math.floor(Math.random() * (638 - 62) + 62);
    }

    esconde() {
        // Joga pra fora do mapa até a próxima fase
        this.x = -1000;
    }

    mov_coracao() {
        this.x -= this.vel;
        if (this.x <= -200 && this.x > -900) {
            this.esconde();
        }
    }
}