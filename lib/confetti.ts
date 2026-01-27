// Simple confetti animation
export default function confetti() {
  if (typeof window === 'undefined') return

  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  const confettiCount = 150

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      opacity: 1;
      transform: rotate(${Math.random() * 360}deg);
      pointer-events: none;
      z-index: 9999;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    `

    document.body.appendChild(confetti)

    const animation = confetti.animate([
      {
        transform: `translateY(0) rotate(0deg)`,
        opacity: 1,
      },
      {
        transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`,
        opacity: 0,
      },
    ], {
      duration: 2000 + Math.random() * 2000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      delay: Math.random() * 500,
    })

    animation.onfinish = () => {
      confetti.remove()
    }
  }
}

