// Suas credenciais
const MY_SID = "OSO8O"; 
const gameGrid = document.getElementById('game-grid');
const modal = document.getElementById('game-modal');
const gameContainer = document.getElementById('game-container');
const closeModal = document.getElementById('closeModal');

// 1. Buscar jogos da GamePix usando seu SID
async function fetchGames() {
    try {
        // Buscando jogos populares associados ao seu SID
        const response = await fetch(`https://games.gamepix.com/games?sid=${MY_SID}&order=popular`);
        const data = await response.json();
        
        if(data.data) {
            displayGames(data.data);
        }
    } catch (error) {
        console.error("Erro na API GamePix:", error);
        gameGrid.innerHTML = "Ops! O Universo está fora de órbita. Tente recarregar.";
    }
}

// 2. Exibir os jogos na grade
function displayGames(games) {
    gameGrid.innerHTML = '';
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${game.thumbnailUrl}" alt="${game.title}" loading="lazy">
            <div class="game-info">
                <p>${game.title}</p>
            </div>
        `;
        // Quando clicar, chama a função de anúncio antes do jogo
        card.onclick = () => showAdBeforeGame(game.url);
        gameGrid.appendChild(card);
    });
}

// 3. Lógica do Google H5 Ads (Mostrar anúncio antes de abrir o jogo)
function showAdBeforeGame(gameUrl) {
    console.log("Chamando anúncio...");
    
    adBreak({
        type: 'next', // Indica que o usuário está indo para o jogo
        name: 'load_game',
        beforeAd: () => { console.log("O anúncio vai começar."); },
        afterAd: () => { 
            console.log("Anúncio terminado. Abrindo jogo...");
            openGame(gameUrl); 
        },
        adBreakDone: (placementInfo) => {
            // Se não houver anúncio disponível, abre o jogo direto
            if (placementInfo.breakStatus === 'notReady' || placementInfo.breakStatus === 'error') {
                openGame(gameUrl);
            }
        }
    });
}

// 4. Abrir o Iframe do Jogo
function openGame(url) {
    // Adiciona o seu SID na URL do jogo para garantir o rastreio da GamePix
    const finalUrl = `${url}&sid=${MY_SID}`;
    gameContainer.innerHTML = `<iframe src="${finalUrl}" allowfullscreen></iframe>`;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Trava o scroll do site ao jogar
}

// Fechar Modal
closeModal.onclick = () => {
    modal.style.display = 'none';
    gameContainer.innerHTML = ''; 
    document.body.style.overflow = 'auto';
};

// Iniciar busca
fetchGames();
