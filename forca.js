const teclaSom = new Audio('audio/tecla.mp3');
const somAcerto = new Audio('audio/acerto.mp3');  
const somErro = new Audio('audio/erro.mp3');  

const palavras = [
  { texto: 'frigideira', dica: 'Ela usa para bater no ladrão.' },
  { texto: 'pascal', dica: 'Nome do camaleão de Rapunzel' },
  { texto: 'torre', dica: 'Lugar onde a Rapunzel mora.' },
  { texto: 'lanterna', dica: 'Elas flutuam no céu no aniversário dela.' },
  { texto: 'cabelo', dica: 'Brilha quando ela canta.' },
  { texto: 'flynn', dica: 'O aventureiro que Rapunzel conhece' }
];

let palavraAtual = {};
let letrasCorretas = [];
let tentativasRestantes = 6;  
let erros = 0;
let dicasUsadas = 0;
let palavrasUsadas = [];
let jogoFinalizado = false;

const palavraEl = document.getElementById('palavra');
const letrasEl = document.getElementById('letras');
const dicaEl = document.getElementById('dica');
const errosEl = document.getElementById('erros');
const tentativasEl = document.getElementById('tentativas');
const imgStatus = document.getElementById('imgStatus');
const feedback = document.getElementById('feedback');
const btnContinuar = document.getElementById('continuar');
const btnRecomecar = document.getElementById('recomecar');
const btnDica = document.getElementById('btnDica');
const bannerVitoria = document.getElementById('vitoria-banner');

function iniciarJogo() {
  if (palavrasUsadas.length === palavras.length) {
    mostrarMensagemFinal();
    return;
  }

  let disponiveis = palavras.filter(p => !palavrasUsadas.includes(p.texto));
  palavraAtual = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  palavrasUsadas.push(palavraAtual.texto);

  letrasCorretas = [];
  tentativasRestantes = 6;  
  erros = 0;
  dicasUsadas = 0;
  jogoFinalizado = false;

  atualizarJogo();
  criarBotoes();
  feedback.textContent = '';
  bannerVitoria.style.display = 'none';
  btnContinuar.style.display = 'none';
  btnRecomecar.style.display = 'none';  
  btnDica.disabled = false;
  imgStatus.src = 'img/Rfeliz.png';
}

function atualizarJogo() {
  dicaEl.textContent = palavraAtual.dica;
  errosEl.textContent = erros;
  tentativasEl.textContent = tentativasRestantes;

  palavraEl.textContent = palavraAtual.texto.split('').map(letra =>
    letrasCorretas.includes(letra) ? letra.toUpperCase() : '_'
  ).join(' ');
}

function criarBotoes() {
  letrasEl.innerHTML = '';
  for (let i = 65; i <= 90; i++) {
    const letra = String.fromCharCode(i);
    const btn = document.createElement('button');
    btn.textContent = letra;
    btn.addEventListener('click', () => {
      if (!jogoFinalizado) {
        teclaSom.play();
        verificarLetra(letra);
      }
    });
    letrasEl.appendChild(btn);
  }
}

function verificarLetra(letra) {
  const letraMin = letra.toLowerCase();
  const botoes = letrasEl.querySelectorAll('button');
  botoes.forEach(btn => {
    if (btn.textContent === letra) btn.disabled = true;
  });

  if (palavraAtual.texto.includes(letraMin)) {
    if (!letrasCorretas.includes(letraMin)) {
      letrasCorretas.push(letraMin);
    }
    feedback.textContent = `Acertou a letra ${letra}! 🌼`;
    feedback.className = 'feedback acerto';
    imgStatus.src = 'img/Rfeliz.png';
  } else {
    tentativasRestantes--;  
    erros++;
    feedback.textContent = `Ops! A letra ${letra} não está na palavra. 😕`;
    feedback.className = 'feedback erro';
    imgStatus.src = 'img/Rtriste.png';
  }

  atualizarJogo();
  checarFimDeJogo();
}

function checarFimDeJogo() {
  const palavraCompleta = palavraAtual.texto.split('').every(letra => letrasCorretas.includes(letra));
  
  if (palavraCompleta) {
    if (palavrasUsadas.length === palavras.length) {
      setTimeout(mostrarMensagemFinal, 1200);
    } else {
      bannerVitoria.style.display = 'block';
      btnContinuar.style.display = 'block';  
      btnRecomecar.style.display = 'none';  
      btnDica.disabled = true;
      somAcerto.play();  
      const botoes = letrasEl.querySelectorAll('button');
      botoes.forEach(btn => {
        btn.disabled = true;
      });
      jogoFinalizado = true;
    }
  } else if (erros === 6) {  
    feedback.textContent = 'Você perdeu! Cometeu 6 erros. Tente novamente! 💔';
    feedback.className = 'feedback erro';
    btnRecomecar.style.display = 'block';  
    jogoFinalizado = true;
    const botoes = letrasEl.querySelectorAll('button');
    botoes.forEach(btn => {
      btn.disabled = true;
    });
    somErro.play();  
  }
}


function usarDica() {
  if (dicasUsadas < 2) {
    const letrasNaoReveladas = palavraAtual.texto.split('').filter(letra => !letrasCorretas.includes(letra));
    const letraAleatoria = letrasNaoReveladas[Math.floor(Math.random() * letrasNaoReveladas.length)];
    letrasCorretas.push(letraAleatoria);
    dicasUsadas++;
    atualizarJogo();
  } else {
    feedback.textContent = 'Você já usou todas as dicas disponíveis! 😅';
    feedback.className = 'feedback erro';
  }
}

function mostrarMensagemFinal() {
  document.body.innerHTML = `
    <div class="final-msg">
      🎉 Parabéns! Você completou todos os desafios da torre da Rapunzel! 🌸<br><br>
      Obrigado por jogar!
    </div>
  `;
}

btnDica.addEventListener('click', usarDica);
btnRecomecar.addEventListener('click', () => {
  if (jogoFinalizado) {
    
    letrasCorretas = [];
    tentativasRestantes = 6;  
    erros = 0;
    dicasUsadas = 0;
    jogoFinalizado = false;
    feedback.textContent = '';
    bannerVitoria.style.display = 'none';
    btnContinuar.style.display = 'none';
    btnRecomecar.style.display = 'none';
    btnDica.disabled = false;
    imgStatus.src = 'img/Rfeliz.png';
    atualizarJogo();
    criarBotoes();
  }
});
btnContinuar.addEventListener('click', iniciarJogo);

iniciarJogo();

document.addEventListener('keydown', function(event) {
  const tecla = event.key.toUpperCase();
  if (tecla.match(/[A-Z]/)) {
    if (!jogoFinalizado) {
      teclaSom.play();
      verificarLetra(tecla);
    }
  }
});
