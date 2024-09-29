const swiper = document.querySelector(".swiper"); // Swiper container
const SWIPE_THRESHOLD = 200; // Minimum swipe distance
const ROTATION_FACTOR = 0.05; // Rotation factor based on drag

const images = [
  'https://i.imgur.com/zpCBadA.jpeg',
  'https://i.imgur.com/tr1ZTGn.jpeg',
  'https://i.imgur.com/9IpzU2P.png',
  'https://i.imgur.com/TMIpP7E.jpeg',
  'https://i.imgur.com/If8eKns.jpeg',
  'https://i.imgur.com/cetI02z.jpeg'  
];

// Create and append 5 cards to the swiper
for (let i = 0; i < 5; i++) {
  const newCard = createCard(i);
  swiper.appendChild(newCard);
}

// Function to create a card element
function createCard(index) {
  const newCard = document.createElement('div');
  newCard.className = 'card';

  const newImage = document.createElement('img');
  newImage.src = images[Math.floor(Math.random() * images.length)];
  newImage.alt = 'alt';

  newCard.appendChild(newImage);
  
  return newCard;
}

const cards = Array.from(document.querySelectorAll(".card"));
let startX, startY, dx, dy;
let currentCardIndex = 0;

// Initialize cards with styles and event listeners
cards.forEach((element, index) => initializeCard(element, index));

function setCardStyle(element, index) {
  element.style.zIndex = cards.length - index;
  element.style.transform = `rotate(${index * -2}deg)`;
}

function initializeCard(element, index) {
  setCardStyle(element, index);
  element.addEventListener('pointerdown', startDrag);
}

// Reset transition after a delay
function resetTransition(element) {
  setTimeout(() => element.style.transition = '', 300);
}

// Start drag operation
function startDrag(e) {
  startX = e.clientX;
  startY = e.clientY;

  document.addEventListener('pointermove', drag);
  document.addEventListener('pointerup', endDrag);
}

// Handle dragging
function drag(e) {
  const currentX = e.clientX;
  dx = currentX - startX;
  cards[currentCardIndex].style.transform = `translate(${dx}px) rotate(${dx * ROTATION_FACTOR}deg)`;
}

// End drag operation
function endDrag() {
  const currentCard = cards[currentCardIndex];
  currentCard.style.transition = 'transform .3s ease';

  if (Math.abs(dx) > SWIPE_THRESHOLD) {
    const direction = dx > 0 ? '100vw' : '-100vw';
    currentCard.style.transform = `translate(${direction}) rotate(${dx * ROTATION_FACTOR}deg)`;
    setTimeout(() => shiftingCards(cards), 300);
    resetTransition(currentCard);
  } else {
    currentCard.style.transform = ''; // Reset if not swiped
  }

  document.removeEventListener('pointermove', drag);
  document.removeEventListener('pointerup', endDrag);
}

// Shift cards after a swipe
function shiftingCards(cards) {
  const currentCard = cards.shift();
  currentCard.remove();

  const newCardIndex = cards.length;
  const newCard = createCard(newCardIndex);

  cards.push(newCard);
  swiper.appendChild(newCard);
  initializeCard(newCard, newCardIndex);

  // Update styles for all cards
  cards.forEach((card, i) => {
    card.style.zIndex = cards.length - i;
    card.style.transition = 'transform .3s ease';
    setTimeout(() => {
      card.style.transform = `rotate(${i * -2}deg)`;
      resetTransition(card);
    }, i * 100);
  });
}