/*--------------------------------------------- SCROLL ANIMATIONS (WITH REPEAT SUPPORT) --------------------------------------------------*/
const animations = [
    { class: 'add-text-animation', animation: 'text-animation' },
    { class: 'add-x-toRight-animation', animation: 'x-toRight-animation' },
    { class: 'add-x-toLeft-animation', animation: 'x-toLeft-animation' },
    { class: 'add-scale-animation', animation: 'scale-animation' },
    { class: 'add-opacity-animation', animation: 'opacity-animation' }
    // Add more animations here (With usings css)
];

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        animations.forEach(({ class: animationClass, animation }) => {
            if (entry.target.classList.contains(animationClass)) {
                if (entry.isIntersecting) {

                    // If the element has repeat-animation class, remove and add the animation class to repeat the animation
                    if (entry.target.classList.contains("repeat-animation")) {
                        entry.target.classList.remove(animation);

                        setTimeout(() => {
                            entry.target.classList.add(animation);
                        }, 50); // Delay to remove and add the animation class
                    } else {
                        entry.target.classList.add(animation);
                    }
                } else {
                    if (entry.target.classList.contains("repeat-animation")) {
                        entry.target.classList.remove(animation);
                    }
                }
            }
        });
    });
}, { threshold: 0.3 });

animations.forEach(({ class: animationClass }) => {
    document.querySelectorAll(`.${animationClass}`).forEach(el => observer.observe(el));
});


/*--------------------------------------------- INCREASED NUM ANIMATION (SCROLL) --------------------------------------------------*/
function counterAnimation(counters, duration) {
    const startTime = performance.now(); 

    function updateCounter(timestamp) {
        const elapsed = timestamp - startTime;
        let isRunning = false;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target'); // Get the target value (Write it on html)
            if (elapsed < duration) {
                counter.innerText = Math.ceil((elapsed / duration) * target);
                isRunning = true;
            } else {
                counter.innerText = target; 
            }
        });

        if (isRunning) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const visibleCounters = Array.from(counters);

            visibleCounters.forEach(counter => {
                if (counter.classList.contains("repeat-animation")) { // Add this class to repeat the animation every time its visible
                    counter.innerText = "0"; // Sayacı sıfırla
                }
            });

            setTimeout(() => {
                counterAnimation(visibleCounters, 500); // Set the duration of the animation
            }, 50);

            visibleCounters.forEach(counter => {
                if (!counter.classList.contains("repeat-animation")) {
                    counterObserver.unobserve(counter);
                }
            });
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

/* HTML CODE

        <div class="flex gap-100">
          <div class="flex"><h2 class="counter" data-target="100">1</h2></div> <!-- Write your target number to "data-target", add "repeat-animation" class to repeat the animation everytime its visible  -->
          <p>Text Here</p>
        </div>
              
*/