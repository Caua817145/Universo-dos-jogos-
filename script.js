const MY_SID = "OSO8O"; 
const gameGrid = document.getElementById('game-grid');
const modal = document.getElementById('game-modal');
const gameContainer = document.getElementById('game-container');
const closeModal = document.getElementById('closeModal');

async function fetchGames() {
    try {
        const response = await fetch(`https://games.gamepix.com/games?sid=${MY_SID}&order=popular&num=40`);
        const data = await response.json();
        if(data && data.data) displayGames(data.data);
    } catch (error) {
        gameGrid.innerHTML = "Erro ao carregar o Universo.";
    }
}

function displayGames(games) {
    gameGrid.innerHTML = '';
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${game.thumbnailUrl}" alt="${game.title}" loading="lazy">
            <div class="game-info"><p>${game.title}</p></div>
        `;
        // Chamada corrigida
        card.onclick = () => showAdBeforeGame(game.url);
        gameGrid.appendChild(card);
    });
}

function showAdBeforeGame(gameUrl) {
    let adFinished = false;

    // Fallback: Se o anúncio não carregar em 3 segundos, abre o jogo direto
    const adTimeout = setTimeout(() => {
        if (!adFinished) {
            adFinished = true;
            openGame(gameUrl);
        }
    }, 3000);

    adBreak({
        type: 'next',
        name: 'load_game',
        beforeAd: () => { console.log("Anúncio iniciado"); },
        afterAd: () => { 
            if (!adFinished) {
                adFinished = true;
                clearTimeout(adTimeout);
                openGame(gameUrl);
            }
        },
        adBreakDone: (info) => {
            if (!adFinished && (info.breakStatus === 'notReady' || info.breakStatus === 'error')) {
                adFinished = true;
                clearTimeout(adTimeout);
                openGame(gameUrl);
            }
        }
    });
}

function openGame(url) {
    const finalUrl = url.includes('?') ? `${url}&sid=${MY_SID}` : `${url}?sid=${MY_SID}`;
    
    gameContainer.innerHTML = `
        <iframe 
            src="${finalUrl}" 
            allowfullscreen="true" 
            style="width:100%; height:100%; border:none;">
        </iframe>`;

    modal.style.display = 'flex'; // Usamos flex para centralizar
    document.body.style.overflow = 'hidden';
}

closeModal.onclick = () => {
    modal.style.display = 'none';
    gameContainer.innerHTML = ''; 
    document.body.style.overflow = 'auto';
};

fetchGames();
