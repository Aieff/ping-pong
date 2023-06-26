 // Cria duas constantes
 const canvasEl = document.querySelector("canvas"),
 canvasCtx = canvasEl.getContext("2d"),
 gapX = 10

 const mouse  = {x: 0, y: 0}

 // Cria o objeto campo e passa um Metodo
 const field = {
     w: window.innerWidth,
     h: window.innerHeight,
     draw: function() {
         // Campo verde
         // define o estilo que será utilizado
         canvasCtx.fillStyle = "#286047"
         // Tamanho desejado do objeto
         canvasCtx.fillRect(0, 0, this.w, this.h)
     },
 }

 const line = {
     w: 15,
     h: field.h,
     draw: function() {
         canvasCtx.fillStyle = "#ffffff"
         canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
     },
 }

 const leftPaddle = {
     x: gapX,
     y: 0,
     w: line.w,
     h: 200,

    _move: function() {
         this.y = mouse.y - this.h / 2
     },
     draw: function() {
         // Desenha raquete esquerda
         canvasCtx.fillStyle = "#ffffff"
         canvasCtx.fillRect(this.x, this.y, this.w, this.h)

         this._move()
     },
 }

 const rightPaddle = {
     x: field.w - line.w - gapX,
     y: 400,
     w: line.w,
     h: 200,
     speed: 5,

     _move: function() {
         if(this.y + this.h / 2 < ball.y + ball.r) {
             this.y += this.speed
         } else {
             this.y -= this.speed
         }
     },
     _speedUp: function() {
         this.speed += 1
     },
     draw: function() {
         // Desenha raquete direita
         canvasCtx.fillStyle = "#ffffff"
         canvasCtx.fillRect(this.x, this.y, this.w, this.h)

         this._move()
     },
 }

 const score = {
     human: 0,
     computer: 0,

     increseHuman: function() {
         this.human++
     },
     increseComputer: function() {
         this.computer++
     },
     draw: function() {
         // Desenha o Placar
         // Estilos atribuidos
         canvasCtx.font= "bold 72px Arial"
         canvasCtx.textAlign = "center"
         canvasCtx.textBaseline = "top"
         canvasCtx.fillStyle= "#01341D"

         // Texto, X, Y
         canvasCtx.fillText(this.human, field.w / 4, 50)
         canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50)
     }
 }

 const ball = {
     x: 100,
     y: 100,
     r: 20,
     speed: 6,
     directionX: 1,
     directionY: 1,

     // Calcula posição da bola para ser rebatida pela parede
     // Se algum dos dois parametros acontecer ele executar a função reverse
     _calcPosition: function() {
         // Verifica se o jogador 1 pontuou (X > largura do campo)
         if(this.x > field.w - this.r - rightPaddle.w - gapX) {
             // Verifica se a raquete direita está na posição Y da bola
             if(
             this.y + this.r > rightPaddle.y &&
             this.y - this.r < rightPaddle.y + rightPaddle.h
             ) {
                 // Rebate a bola (Inverte o sinal de X)
                 this._reverseX()
             } else {
                 // Pontuar o jogador 1
                 score.increseHuman()
                 this._pointUp()
             }
         }

         // Verifica se o jogador 2 pontuou
         if(this.x < this.r + leftPaddle.w + gapX) {
             // Verifica se a raquete esquerta está na psoção Y da bola
             if(this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h) {
                 // Rebate a bola (Inverte o sinal de X)
                 this._reverseX()
             } else {
                 // Pontuar o jogador 2
                 score.increseComputer()
                 this._pointUp()
             }
         }

         if(
         (this.y - this.r < 0 && this.directionY < 0) ||          
         (this.y > field.h - this.r && this.directionY > 0) 
         ) {
             // Inverte o sinal do eixo Y
             this._reverseY()
         }
     },
     _reverseX: function() {
         this.directionX *= -1
     },
     _reverseY: function() {
         this.directionY *= -1
     },
     _speedUp: function() {
         this.speed += 1
     },
     _pointUp: function() {
         this._speedUp()
         rightPaddle._speedUp()
         this.x = field.w / 2
         this.y = field.h / 2
     },
     // Incrementar X, Y
     _move: function() {
         this.x += this.directionX * this.speed
         this.y += this.directionY * this.speed
     },
     draw: function() {
         canvasCtx.fillStyle = "#ffffff"
         // Desenha a bola // X, Y, RAIO, InicioArc, VoltaArc, Sentido
         canvasCtx.beginPath()
         canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
         canvasCtx.fill()

         this._calcPosition()
         this._move()
     }
 }

 function setup() {
     // Pega altura e largura dos elementos
     canvasEl.width = canvasCtx.width = field.w
     canvasEl.height = canvasCtx.height = field.h
 }

 function draw() {
     // Chama o objeto e o metodo (POO)
     field.draw()
     line.draw()

     leftPaddle.draw()
     rightPaddle.draw()

     score.draw()
     ball.draw()
 }

     // API Nativa do navegador RequestAnimationFrame() Suavizar a animação
     window.animateFrame = (function () {
     return (
       window.requestAnimationFrame ||
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       window.oRequestAnimationFrame ||
       window.msRequestAnimationFrame ||
       function (callback) {
         return window.setTimeout(callback, 1000 / 60)
       }
     )
   })()

   function main() {
     animateFrame(main)
     draw()
   }

   setup()
   main()

   canvasEl.addEventListener('mousemove', function(e) {
     mouse.x = e.pageX
     mouse.y = e.pageY

   })