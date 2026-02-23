const gameGrid = document.getElementById('game-grid');
const modal = document.getElementById('game-modal');
const gameContainer = document.getElementById('game-container');
const closeBtn = document.querySelector('.close-btn');

// Função para buscar jogos da GamePix
async function fetchGames() {
    try {
        // Usando a API gratuita da GamePix para demonstração
        const response = await fetch('https://games.gamepix.com/games?category=1');
        const data = await response.json();
        
        displayGames(data.data);
    } catch (error) {
        console.error("Erro ao carregar jogos:", error);
        gameGrid.innerHTML = "Erro ao carregar jogos. Tente novamente.";
    }
}

function displayGames(games) {
    gameGrid.innerHTML = '';
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${game.thumbnailUrl}" alt="${game.title}">
            <p>${game.title}</p>
        `;
        card.onclick = () => openGame(game.url);
        gameGrid.appendChild(card);
    });
}

function openGame(url) {
    // Aqui você dispararia o anúncio do Google H5 antes de carregar o iframe
    gameContainer.innerHTML = `<iframe src="${url}" allowfullscreen></iframe>`;
    modal.style.display = 'block';
}

closeBtn.onclick = () => {
    modal.style.display = 'none';
    gameContainer.innerHTML = ''; // Para o jogo parar de rodar ao fechar
};

window.onclick = (event) => {
    if (event.target == modal) closeBtn.onclick();
};

fetchGames();
