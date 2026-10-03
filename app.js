// Contenuti fittizi per i tab del diario
const diaryData = {
    lucy: {
        left: `
            <h3>Lucy's Stuff</h3>
            <p>Welcome to my personal section! Here are some polaroids of my setup.</p>
            <div class="polaroid">
                <div style="width: 100%; height: 120px; background: #333; color: white; display:flex; align-items:center; justify-content:center;">IMG: Cyberdeck Setup</div>
                <p style="text-align:center; margin: 5px 0 0 0;">My DIY Build</p>
            </div>
        `,
        right: `
            <p>Building this Bratz cyberdeck was an amazing experience. It's essentially a Raspberry Pi disguised as a 2000s toy.</p>
            <ul>
                <li>Component 1: Screen</li>
                <li>Component 2: Mechanical Keyboard</li>
                <li>Component 3: Bratz Box</li>
            </ul>
        `
    },
    diary: {
        left: `
            <h3>Dev Diary</h3>
            <p>Day 1: Started cutting the plastic box...</p>
            <p>Day 2: Wiring the LCD screen. Broke a connector :'(</p>
            <p>Day 3: It's ALIVE!!</p>
        `,
        right: `
            <p>Some more notes about the process.</p>
            <div class="polaroid">
                <div style="width: 100%; height: 120px; background: #555; color: white; display:flex; align-items:center; justify-content:center;">IMG: Wiring</div>
                <p style="text-align:center; margin: 5px 0 0 0;">Messy cables</p>
            </div>
        `
    },
    tips: {
        left: `
            <h3>Y2K Web Tips</h3>
            <p>Want to build a site like this?</p>
            <ul>
                <li>Use lots of pink</li>
                <li>Add pixel fonts (like VT323)</li>
                <li>MS Paint UI elements</li>
                <li>Glitter backgrounds!</li>
            </ul>
        `,
        right: `
            <p>Don't forget to break some layout rules intentionally for that raw, authentic feel!</p>
        `
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Gestione Tabs del Diario
    const markers = document.querySelectorAll('.marker');
    const leftContent = document.getElementById('diary-left-content');
    const rightContent = document.getElementById('diary-right-content');

    // Funzione per aggiornare il contenuto
    function updateDiary(tabId) {
        if (diaryData[tabId]) {
            leftContent.innerHTML = diaryData[tabId].left;
            rightContent.innerHTML = diaryData[tabId].right;
        }
    }

    // Inizializza con il primo tab
    updateDiary('lucy');

    markers.forEach(marker => {
        marker.addEventListener('click', (e) => {
            // Rimuovi classe active da tutti
            markers.forEach(m => m.classList.remove('active'));
            // Aggiungi classe active al cliccato
            e.target.classList.add('active');

            // Aggiorna contenuto
            const tabId = e.target.getAttribute('data-tab');
            updateDiary(tabId);
        });
    });

    // 2. Gestione form Guestbook
    const guestbookForm = document.getElementById('guestbook-form');
    const entriesContainer = document.getElementById('guestbook-entries');

    // Load from local storage
    let guestbookData = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
    guestbookData.forEach(entry => {
        const li = document.createElement('li');
        li.className = 'gb-entry';
        li.innerHTML = `<strong>${entry.name}</strong> <em>(${entry.country})</em> at ${entry.time}: <br> ${entry.message}`;
        entriesContainer.appendChild(li);
    });

    guestbookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('gb-name');
        const countryInput = document.getElementById('gb-country');
        const messageInput = document.getElementById('gb-message');

        const name = nameInput.value.trim();
        const country = countryInput.value.trim();
        const message = messageInput.value.trim();

        if (name && message) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const entry = { name, country: country || 'Unknown', time: timeString, message };
            guestbookData.unshift(entry);
            localStorage.setItem('guestbookEntries', JSON.stringify(guestbookData));

            const li = document.createElement('li');
            li.className = 'gb-entry';
            li.innerHTML = `<strong>${entry.name}</strong> <em>(${entry.country})</em> at ${entry.time}: <br> ${entry.message}`;

            entriesContainer.prepend(li);
            messageInput.value = '';
        }
    });
});
// --- Calendar Logic ---
(function () {
    const calendarContainer = document.getElementById('calendar-container');
    if (!calendarContainer) return;

    // Mese iniziale: Novembre 2026
    let currentDate = new Date(2026, 10, 1);

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthNames = [
            "Gennaio",
            "Febbraio",
            "Marzo",
            "Aprile",
            "Maggio",
            "Giugno",
            "Luglio",
            "Agosto",
            "Settembre",
            "Ottobre",
            "Novembre",
            "Dicembre"
        ];

        // Giorno della settimana del primo giorno del mese
        const firstDay = new Date(year, month, 1).getDay();

        // Numero di giorni nel mese
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Data di oggi
        const today = new Date();

        let html = `
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:5px;
            ">
                <button
                    id="prev-month"
                    style="
                        cursor:pointer;
                        background:none;
                        border:none;
                        font-size:16px;
                    "
                >&lt;</button>

                <span class="pink-text">
                    ${monthNames[month]} ${year}
                </span>

                <button
                    id="next-month"
                    style="
                        cursor:pointer;
                        background:none;
                        border:none;
                        font-size:16px;
                    "
                >&gt;</button>
            </div>

            <table class="calendar-table">
                <tr>
                    <th>S</th>
                    <th>M</th>
                    <th>T</th>
                    <th>W</th>
                    <th>T</th>
                    <th>F</th>
                    <th>S</th>
                </tr>
                <tr>
        `;

        let dayCount = 1;

        // 42 celle = 6 settimane
        for (let i = 0; i < 42; i++) {

            // Celle vuote prima dell'inizio del mese
            if (i < firstDay || dayCount > daysInMonth) {
                html += `<td></td>`;

            } else {

                // OGGI
                const isToday =
                    year === today.getFullYear() &&
                    month === today.getMonth() &&
                    dayCount === today.getDate();

                // D-DAY: 25 Novembre 2026
                const isDDay =
                    year === 2026 &&
                    month === 10 &&
                    dayCount === 25;

                let classes = 'class="pink-text"';
                let content = dayCount;

                // Il D-Day ha la precedenza visiva
                if (isDDay) {
                    classes = 'class="pink-text d-day"';

                    content = `
                        <span class="d-day-number" title="D-Day!!!">
                            ${dayCount}
                        </span>
                        <span class="d-day-label">
                            D-DAY!!!
                        </span>
                    `;


                } else if (isToday) {
                    classes = 'class="current-day"';
                }

                html += `
                    <td ${classes}>
                        ${content}
                    </td>
                `;

                dayCount++;
            }

            // Nuova riga ogni 7 giorni
            if ((i + 1) % 7 === 0) {
                html += `</tr><tr>`;
            }
        }

        html += `
                </tr>
            </table>
        `;

        calendarContainer.innerHTML = html;

        // Mese precedente
        document
            .getElementById('prev-month')
            .addEventListener('click', () => {
                renderCalendar(new Date(year, month - 1, 1));
            });

        // Mese successivo
        document
            .getElementById('next-month')
            .addEventListener('click', () => {
                renderCalendar(new Date(year, month + 1, 1));
            });
    }

    renderCalendar(currentDate);
})();


// --- Navigation Logic ---
(function () {
    const colMiddle = document.querySelector('.main-box');
    if (!colMiddle) return;

    // Save initial content (HOME)
    const initialHomeContent = colMiddle.innerHTML;

    const navHome = document.getElementById('nav-home');
    const navAbout = document.getElementById('nav-about');
    const navBlueprint = document.getElementById('nav-blueprint');

    if (navHome) {
        navHome.addEventListener('click', (e) => {
            e.preventDefault();
            colMiddle.innerHTML = initialHomeContent;
        });
    }

    if (navAbout) {
        navAbout.addEventListener('click', (e) => {
            e.preventDefault();
            colMiddle.innerHTML = `
                    <div class="box-header">ABOUT</div>
                    <div class="box-content center-text">
                        <p class="pink-text" style="text-align: left;">Hello there!</p>
                        <img style="width: 278px;height: 157px" src="gif/hello_there.gif" class="gif" alt="obi one">
                        <p>This section is dedicated to me!!!<img src="img/slay.png" style="width: 40px;height: 40px; top:13px; position:relative;></p>
                        <p><br> <br>I'm a little <span  class="pink-text">gremlin</span> from 2004 who loves too much things.
                         Recently I passed from studying tarots, to crocheting, to trying building very cool things 
                         like the totally spies compowder, because duh! Who doesn't want to do it?! So, the whole cyberdeck project, 
                         as well as this website, are the product of my current <span class="pink-text">hyperfixation</span>!</p>
                        <div style="display: flex; flex-direction: row;">
                            <div style="padding-right: 10px;">
                                <p>I love cats and I'm Daenerys Targaryen twin, 
                                the only difference is that my dragons throw 
                                up balls of fur instead of breathing fire.
                                </p>
                                <img src="img/black_cat.png" class="black_cat" alt="gattino nero">
                                <p style="text-align: right; font-style:italic;">miaomiaomiaomiaomiaomiaomiaomiaomiaomiao</p>
                            </div>
                            <img style="width: 157px;height: 157px; margin-top: 0px;" src="img/daeni.png" class="gif" alt="Daeneris">
                        </div>
                        <p>
                            I love the <span class="pink-text">old internet</span>, I’ve grown up playing
                            on site like girl.go.games, watching series on yt and researching on wikipedia. This is my tribute to it!</p>
                    </div>`;
        });
    }

    if (navBlueprint) {
        navBlueprint.addEventListener('click', (e) => {
            e.preventDefault();
            colMiddle.innerHTML = `
                    <div class="box-header">BLUEPRINT</div>
                    <div class="box-content center-text">
                        <div style="display: flex; flex-direction: row;">
                            <div style="padding-right: 10px;">
                                <p>Do you know <span class="pink-text">the muffin man? </span></p>
                                <p>If you don’t...well, I don’t know.</p> 
                                <p>Anyway, check out Ube Boobey,(<a
                                href="https://www.youtube.com/@UbeBoobey" class="pink-text">click here</a>), she’s my muse.</p>
                            </div> 
                             <img style="width: 260px;height: 153px; margin-top: 0px;" src="img/farquaad.jfif" class="gif" alt="Lord Farquad">
                        </div>
                        <p>The idea behind this site starts with <span class="pink-text">checking facts</span>.
                        We live in Varoufakis’s technofeudalism,a system where we are the <span class="pink-text">serfs of Big Techs</span> that drain our time and emotions. 
                        The fix? <span class="pink-text">Use the tech to hack the tech.</span></p>
                       <div class="katniss-text">   
                            <p style="margin-bottom:0px;">
                                Quincho and Walsh (they’re very cool, google them!) explain that online
                                we are forced to be a <span class="pink-text">‘Girl’</span>.
                                Naive and mischievous, without responsibilities. But we can use this
                                stereotype as a
                            </p>

                            <img src="gif/katniss.gif" alt="Katniss">

                            <p>
                                <span class="pink-text">Trojan horse</span> to sabotage the system.
                                It’s not about gender, it’s a critical posture.
                                We can be the Katniss Everdeen of the web and set fire to the platform
                                morass through self-design.
                            </p>

                        </div>
                        <p>BE A GIRL. HACK THE STACK.<span class='pink-text'> BRING BACK THE OLD INTERNET.</span></p>
                    </div>`;
        });
    }
})();


// --- Music Player Logic ---
(function () {
    const playBtn = document.getElementById('play-music-btn');
    const audio = document.getElementById('bg-music');
    const cdDisc = document.getElementById('cd-disc');

    if (playBtn && audio && cdDisc) {
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                cdDisc.classList.add('playing');
                playBtn.innerText = 'pause';
            } else {
                audio.pause();
                cdDisc.classList.remove('playing');
                playBtn.innerText = 'here';
            }
        });
    }
})();

