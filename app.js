document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.querySelector('.content');
    const navLinks = document.querySelectorAll('.nav-link');

    // --- MOCK DATA & STATE MANAGEMENT ---
    
    let userCGPA = 8.5; // Your CGPA, can be changed from the dashboard

    const progressData = {
        contestsJoined: 2
    };

    let attendanceData = {
        'ADC(TM)': { attended: 1, total: 2 },
        'DSP(SRC)': { attended: 1, total: 4 },
        'EIM(SB)': { attended: 0, total: 1 },
        'IM(ABC)': { attended: 1, total: 2 },
        'LAB': { attended: 2, total: 2 },
        'MPMC': { attended: 1, total: 3 },
    };

    let assignments = [
        { id: 1, title: 'DSP Lab Report', deadline: '2025-10-05' },
        { id: 2, title: 'MPMC Project Phase 1', deadline: '2025-10-10' },
        { id: 3, title: 'EIM Presentation', deadline: '2025-09-30' }
    ];

    let leetCodeStats = {
        easy: 120,
        medium: 250,
        hard: 55,
        contestRating: 1850,
        streak: 11
    };
    let streakDates = ['2025-09-28', '2025-09-29', '2025-09-30'];
    
    // --- HELPER FUNCTIONS FOR DYNAMIC DATA ---
    const calculateOverallAttendance = () => {
        const totalAttended = Object.values(attendanceData).reduce((sum, subject) => sum + subject.attended, 0);
        const totalClasses = Object.values(attendanceData).reduce((sum, subject) => sum + subject.total, 0);
        if (totalClasses === 0) return { percentage: 0, attended: 0, total: 0 };
        return {
            percentage: Math.round((totalAttended / totalClasses) * 100),
            attended: totalAttended,
            total: totalClasses
        };
    };

    const getTotalProblemsSolved = () => leetCodeStats.easy + leetCodeStats.medium + leetCodeStats.hard;

    // --- PAGE TEMPLATES (NOW WITH A FUNCTION FOR THE DASHBOARD) ---

    const pages = {
        getDashboard: () => `
            <div class="page-title">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=raj" alt="Profile Picture">
                <span>Hi, raj</span>
            </div>
            <div class="dashboard-grid">
                <div class="card stat-card stat-card-blue">
                    <i class="fas fa-user-check"></i>
                    <h3>${calculateOverallAttendance().percentage}%</h3>
                    <p>Overall Attendance</p>
                </div>
                <div class="card stat-card stat-card-green">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>${userCGPA.toFixed(2)}</h3>
                    <p>Current CGPA</p>
                </div>
                <div class="card stat-card stat-card-yellow">
                    <i class="fas fa-check-circle"></i>
                    <h3>${getTotalProblemsSolved()}</h3>
                    <p>Problems Solved</p>
                </div>
            </div>
            <h2 class="section-title">Lifetime Progress</h2>
            <div class="dashboard-bottom-grid">
                <div class="card chart-container">
                    <canvas id="performanceChart"></canvas>
                </div>
                <div class="card reference-card">
                    <h3>Reference</h3>
                    <ul>
                        <li><strong>Overall Attendance:</strong><span>${calculateOverallAttendance().percentage}%</span></li>
                        <li><strong>CGPA:</strong><span>${userCGPA.toFixed(2)} / 10.0</span></li>
                        <li><strong>Problems Solved:</strong><span>${getTotalProblemsSolved()}</span></li>
                    </ul>
                    <hr class="ref-divider">
                    <div class="cgpa-input-group">
                        <label for="cgpa-input">Update CGPA:</label>
                        <input type="number" id="cgpa-input" step="0.01" placeholder="${userCGPA.toFixed(2)}">
                        <button id="save-cgpa-btn">Save</button>
                    </div>
                </div>
            </div>
        `,
        schedule: `
            <h1 class="page-title">Schedule</h1>
            <div class="card overflow-x-auto">
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Monday</th>
                            <th>Tuesday</th>
                            <th>Wednesday</th>
                            <th>Thursday</th>
                            <th>Friday</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td data-label="Time">9:00-10</td><td data-label="Monday"><span class="subject-eim">EIM(SB)</span></td><td data-label="Tuesday"><span class="subject-dsp">DSP(SRC)</span></td><td data-label="Wednesday"><span class="subject-eim">EIM(SB)</span></td><td data-label="Thursday"><span class="subject-adc">ADC(TM)</span></td><td data-label="Friday"><span class="subject-mpmc">MPMC</span></td></tr>
                        <tr><td data-label="Time">10:00-11</td><td data-label="Monday"><span class="subject-dsp">DSP(SRC)</span></td><td data-label="Tuesday"><span class="subject-eim">EIM(SB)</span></td><td data-label="Wednesday"><span class="subject-im">IM(BI)</span></td><td data-label="Thursday"><span class="subject-mpmc">MPMC</span></td><td data-label="Friday"><span class="subject-adc">ADC(TM)</span></td></tr>
                        <tr><td data-label="Time">11:00-12</td><td data-label="Monday"><span class="subject-adc">ADC(TM)</span></td><td data-label="Tuesday"><span class="subject-im">IM(ABC)</span></td><td data-label="Wednesday"><span class="subject-mpmc-lab">MPMC LAB</span></td><td data-label="Thursday"><span class="subject-dsp">DSP</span></td><td data-label="Friday"><span class="subject-eim-lab">EIM LAB</span></td></tr>
                        <tr><td data-label="Time">12:00-1</td><td data-label="Monday"><span class="subject-im">IM(ABC)</span></td><td data-label="Tuesday"><span class="subject-mpmc">MPMC</span></td><td data-label="Wednesday"><span class="subject-mpmc-lab">MPMC LAB</span></td><td data-label="Thursday"><span class="subject-break">BREAK</span></td><td data-label="Friday"><span class="subject-eim-lab">EIM LAB</span></td></tr>
                        <tr><td data-label="Time">1:00-2</td><td data-label="Monday"><span class="subject-break">BREAK</span></td><td data-label="Tuesday"><span class="subject-break">BREAK</span></td><td data-label="Wednesday"><span class="subject-break">BREAK</span></td><td data-label="Thursday"><span class="subject-break">BREAK</span></td><td data-label="Friday"><span class="subject-break">BREAK</span></td></tr>
                        <tr><td data-label="Time">2:00-3</td><td data-label="Monday"><span class="subject-mpmc">MPMC</span></td><td data-label="Tuesday"><span class="subject-dsp-lab">DSP LAB</span></td><td data-label="Wednesday"><span class="subject-dsp">DSP(SRC)</span></td><td data-label="Thursday"><span class="subject-adc-lab">ADC LAB</span></td><td data-label="Friday"><span class="subject-eim">EIM(SB)</span></td></tr>
                        <tr><td data-label="Time">3:00-4</td><td data-label="Monday"><span class="subject-mini-project">Mini Project</span></td><td data-label="Tuesday"><span class="subject-dsp-lab">DSP LAB</span></td><td data-label="Wednesday"><span class="subject-adc">ADC(TM)</span></td><td data-label="Thursday"><span class="subject-adc-lab">ADC LAB</span></td><td data-label="Friday"><span class="subject-break">BREAK</span></td></tr>
                        <tr><td data-label="Time">4:00-5</td><td data-label="Monday"><span class="subject-mini-project">Mini Project</span></td><td data-label="Tuesday"><span class="subject-break">BREAK</span></td><td data-label="Wednesday"><span class="subject-break">BREAK</span></td><td data-label="Thursday"><span class="subject-break">BREAK</span></td><td data-label="Friday"><span class="subject-break">BREAK</span></td></tr>
                    </tbody>
                </table>
            </div>
        `,
        attendance: `
            <h1 class="page-title">Attendance Tracker</h1>
            <div class="card add-subject-card">
                <h3 class="section-title" style="margin-top: 0; margin-bottom: 1rem;">Add New Subject</h3>
                <div class="add-subject-form">
                    <input type="text" id="new-subject-name" placeholder="Enter subject name..." style="margin-bottom: 0;">
                    <button id="add-subject-btn"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="attendance-grid" id="attendance-grid-container"></div>
            <div id="attendance-summary-container"></div>
        `,
        assignments: `
            <h1 class="page-title">Assignment Tracker</h1>
            <div class="card add-assignment-card">
                <h3 class="section-title" style="margin-top: 0; margin-bottom: 1rem;">Add New Assignment</h3>
                <div class="add-assignment-form">
                    <input type="text" id="new-assignment-title" placeholder="Assignment Title...">
                    <input type="date" id="new-assignment-deadline">
                    <button id="add-assignment-btn"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <div class="assignment-list" id="assignment-list-container"></div>
        `,
        'leetcode-stats': `
            <h1 class="page-title">LeetCode Stats</h1>
            <div class="leetcode-grid">
                <div class="card">
                    <h2 class="section-title">Your Profile</h2>
                    <div class="stat-input-group">
                        <div class="stat-input">
                            <label for="lc-easy">Easy Problems</label>
                            <input type="number" id="lc-easy" value="${leetCodeStats.easy}">
                        </div>
                        <div class="stat-input">
                            <label for="lc-medium">Medium Problems</label>
                            <input type="number" id="lc-medium" value="${leetCodeStats.medium}">
                        </div>
                        <div class="stat-input">
                            <label for="lc-hard">Hard Problems</label>
                            <input type="number" id="lc-hard" value="${leetCodeStats.hard}">
                        </div>
                        <div class="stat-input">
                            <label for="lc-rating">Contest Rating</label>
                            <input type="number" id="lc-rating" value="${leetCodeStats.contestRating}">
                        </div>
                    </div>
                </div>
                <div class="card streak-calendar-container">
                     <h3>Coding Streak</h3>
                     <div id="streak-calendar"></div>
                     <p class="streak-info">Current Streak: <span id="streak-count">${leetCodeStats.streak}</span> days</p>
                </div>
            </div>
            <div class="leetcode-charts">
                <div class="card leetcode-chart-container">
                    <canvas id="lcPieChart"></canvas>
                </div>
                <div class="card leetcode-chart-container">
                    <canvas id="lcRadarChart"></canvas>
                </div>
            </div>
        `,
        feedback: `
            <h1 class="page-title">Submit Feedback</h1>
            <div class="card">
                <form id="feedback-form" class="feedback-form">
                    <div class="form-group">
                        <label for="feedback-name">Your Name</label>
                        <input type="text" id="feedback-name" required>
                    </div>
                    <div class="form-group">
                        <label for="feedback-email">Your Email</label>
                        <input type="email" id="feedback-email" required>
                    </div>
                    <div class="form-group">
                        <label for="feedback-type">Feedback Type</label>
                        <select id="feedback-type" required>
                            <option value="">--Please choose an option--</option>
                            <option value="bug">Bug Report</option>
                            <option value="suggestion">Suggestion</option>
                            <option value="compliment">Compliment</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="feedback-message">Message</label>
                        <textarea id="feedback-message" rows="5" required></textarea>
                    </div>
                    <button type="submit">Submit Feedback</button>
                </form>
            </div>
        `
    };

    // --- Chart instances need to be tracked to destroy them before re-rendering ---
    let performanceChartInstance = null;
    let lcPieChartInstance = null;
    let lcRadarChartInstance = null;
    
    // --- GENERAL PAGE RENDERER ---
    function renderPage(pageName) {
        if (!pages[pageName] && pageName !== 'dashboard') {
            console.error(`Page "${pageName}" not found.`);
            return;
        }

        if (pageName === 'dashboard') {
            contentArea.innerHTML = pages.getDashboard();
        } else {
            contentArea.innerHTML = pages[pageName];
        }

        // Attach event listeners for the specific page
        if (pageName === 'dashboard') {
            renderPerformanceChart();
            setupDashboardListeners();
        }
        if (pageName === 'attendance') {
            renderAttendanceTracker();
            setupAttendanceListeners();
        }
        if (pageName === 'assignments') {
            renderAssignments();
            setupAssignmentListeners();
        }
        if (pageName === 'leetcode-stats') {
            renderLeetCodeStatsPage();
        }
        if (pageName === 'feedback') {
            setupFeedbackListeners();
        }
    }
    
    // --- DASHBOARD LISTENERS ---
    function setupDashboardListeners() {
        const saveCgpaBtn = document.getElementById('save-cgpa-btn');
        const cgpaInput = document.getElementById('cgpa-input');

        if (saveCgpaBtn && cgpaInput) {
            saveCgpaBtn.addEventListener('click', () => {
                const newCgpa = parseFloat(cgpaInput.value);
                if (!isNaN(newCgpa) && newCgpa >= 0 && newCgpa <= 10) {
                    userCGPA = newCgpa;
                    renderPage('dashboard');
                } else {
                    openModal({
                        title: 'Invalid Input',
                        body: 'Please enter a valid CGPA between 0 and 10.',
                        onConfirm: closeModal,
                        confirmText: 'OK'
                    });
                }
            });
        }
    }

    // --- FEEDBACK PAGE LISTENERS ---
    function setupFeedbackListeners() {
        const feedbackForm = document.getElementById('feedback-form');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                openModal({
                    title: 'Feedback Submitted',
                    body: 'Thank you for your valuable feedback!',
                    onConfirm: () => {
                        feedbackForm.reset();
                        closeModal();
                    },
                    confirmText: 'OK'
                });
            });
        }
    }

    // --- LEETCODE STATS PAGE ---
    function renderLeetCodeStatsPage() {
        renderLcCharts();
        renderStreakCalendar();
        setupLeetCodeListeners();
    }

    function renderLcCharts() {
        if (lcPieChartInstance) lcPieChartInstance.destroy();
        if (lcRadarChartInstance) lcRadarChartInstance.destroy();

        const pieCtx = document.getElementById('lcPieChart');
        const radarCtx = document.getElementById('lcRadarChart');
        if (!pieCtx || !radarCtx) return;

        const total = getTotalProblemsSolved();
        const totalCard = document.getElementById('total-questions-card');
        
        if (!totalCard) {
            document.querySelector('.page-title').insertAdjacentHTML('afterend', 
                `<div class="card" id="total-questions-card"><h2 class="section-title" style="margin: 0;">Total Questions Solved: ${total}</h2></div>`
            );
        } else {
             totalCard.querySelector('h2').textContent = `Total Questions Solved: ${total}`;
        }
        
        lcPieChartInstance = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    data: [leetCodeStats.easy, leetCodeStats.medium, leetCodeStats.hard],
                    backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                    borderColor: 'var(--card-color)',
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { color: 'var(--primary-text)', font: { size: 14, family: 'Poppins' } } } }
            }
        });

        lcRadarChartInstance = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Easy', 'Medium', 'Hard', 'Streak', 'Rating'],
                datasets: [{
                    label: 'LeetCode Stats',
                    data: [
                        (leetCodeStats.easy / total) * 100,
                        (leetCodeStats.medium / total) * 100,
                        (leetCodeStats.hard / total) * 100,
                        (leetCodeStats.streak / 30) * 100,
                        ((leetCodeStats.contestRating - 1500) / 1000) * 100
                    ],
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    pointBackgroundColor: '#fff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { r: { suggestedMin: 0, suggestedMax: 100, grid: { color: 'rgba(255,255,255,0.2)' }, pointLabels: { color: '#e2e8f0' }, ticks: { backdropColor: 'transparent', color: '#94a3b8' } } },
                plugins: { legend: { display: false } }
            }
        });
    }

    function renderStreakCalendar() {
        const container = document.getElementById('streak-calendar');
        if (!container) return;
        
        let currentMonth = new Date();
        
        function drawCalendar() {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const firstDay = new Date(year, month, 1);
            const startDate = new Date(year, month, 1 - firstDay.getDay());

            let calendarHTML = `<div class="streak-calendar-grid">
                ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => `<div class="streak-calendar-header">${day}</div>`).join('')}`;

            for (let i = 0; i < 42; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                const dateString = date.toISOString().split('T')[0];

                let dayClasses = 'streak-calendar-day';
                if (date.getMonth() !== month) dayClasses += ' other-month';
                if (date.toDateString() === new Date().toDateString()) dayClasses += ' today';
                if (streakDates.includes(dateString)) dayClasses += ' marked';
                
                calendarHTML += `<div class="${dayClasses}" data-date="${dateString}">${date.getDate()}</div>`;
            }
            calendarHTML += '</div>';
            container.innerHTML = calendarHTML;
        }
        drawCalendar();
    }
    
    function setupLeetCodeListeners() {
        const inputs = ['lc-easy', 'lc-medium', 'lc-hard', 'lc-rating'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                const key = id.split('-')[1];
                leetCodeStats[key] = Number(e.target.value);
                renderLcCharts();
            });
        });

        document.getElementById('streak-calendar').addEventListener('click', e => {
            if (e.target.classList.contains('streak-calendar-day') && !e.target.classList.contains('other-month')) {
                const date = e.target.dataset.date;
                if (streakDates.includes(date)) {
                    streakDates = streakDates.filter(d => d !== date);
                } else {
                    streakDates.push(date);
                }
                leetCodeStats.streak = calculateStreak();
                document.getElementById('streak-count').textContent = leetCodeStats.streak;
                renderStreakCalendar();
                renderLcCharts();
            }
        });
    }

    function calculateStreak() {
        if (streakDates.length === 0) return 0;
        const markedTimestamps = new Set(streakDates.map(d => new Date(d).getTime()));
        const sortedDates = streakDates.map(d => new Date(d)).sort((a, b) => b - a);
        let longestStreak = 0;
        for (const date of sortedDates) {
            let currentStreak = 0;
            let currentDate = new Date(date);
            while (markedTimestamps.has(currentDate.getTime())) {
                currentStreak++;
                currentDate.setDate(currentDate.getDate() - 1);
            }
            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }
        }
        return longestStreak;
    }
    
    // --- Modal Functions ---
    let onConfirmCallback = null;

    function openModal({ title, body, onConfirm, confirmText = 'Confirm' }) {
        const overlay = document.getElementById('custom-modal-overlay');
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = body;
        const confirmBtn = document.getElementById('modal-confirm-btn');
        confirmBtn.textContent = confirmText;
        onConfirmCallback = onConfirm;
        overlay.style.display = 'flex';
    }

    function closeModal() {
        const overlay = document.getElementById('custom-modal-overlay');
        overlay.style.display = 'none';
        onConfirmCallback = null;
    }

    // --- Performance Chart Function ---
    function renderPerformanceChart() {
        if (performanceChartInstance) performanceChartInstance.destroy();
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;
        
        const performanceData = {
            'Attendance %': calculateOverallAttendance().percentage,
            'CGPA': (userCGPA / 10) * 100,
            'Problems Solved': Math.min((getTotalProblemsSolved() / 500) * 100, 100)
        };

        performanceChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: Object.keys(performanceData),
                datasets: [{
                    label: 'Lifetime Performance',
                    data: Object.values(performanceData),
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(96, 165, 250, 1)',
                    pointBackgroundColor: '#fff',
                    pointBorderColor: 'rgba(96, 165, 250, 1)',
                    pointHoverBackgroundColor: 'rgba(96, 165, 250, 1)',
                    pointHoverBorderColor: '#fff',
                    borderWidth: 3,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(226, 232, 240, 0.2)' },
                        grid: { color: 'rgba(226, 232, 240, 0.2)' },
                        pointLabels: { color: '#e2e8f0', font: { size: 16, family: 'Poppins', weight: '600' } },
                        ticks: {
                            backdropColor: 'rgba(15, 23, 42, 0.8)',
                            color: '#94a3b8',
                            stepSize: 20,
                            callback: function(value) { return value + '%' }
                        },
                         suggestedMin: 0,
                         suggestedMax: 100
                    }
                },
                plugins: { legend: { display: false }, tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.r !== null) {
                                if (context.label === 'CGPA') {
                                    label += ((context.parsed.r / 100) * 10).toFixed(2);
                                } else {
                                    label += context.parsed.r.toFixed(0) + '%';
                                }
                            }
                            return label;
                        }
                    }
                } }
            }
        });
    }

    // --- Attendance Tracker Functions ---
    function renderAttendanceTracker() {
        const container = document.getElementById('attendance-grid-container');
        if (!container) return;
        
        container.innerHTML = Object.entries(attendanceData).map(([subject, data]) => {
            const percentage = data.total > 0 ? Math.round((data.attended / data.total) * 100) : 0;
            const progressColor = percentage < 75 ? 'red' : percentage < 85 ? 'yellow' : 'green';
            return `
                <div class="card subject-card" data-subject="${subject}">
                    <div class="subject-header">
                        <h3 class="subject-title">${subject}</h3>
                        <div class="subject-percentage percentage-${progressColor}">${percentage}%</div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill progress-bar-${progressColor}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="attendance-details">${data.attended} / ${data.total} classes attended</div>
                    <div class="attendance-controls">
                        <div class="attendance-actions" style="display: flex; gap: 0.75rem;">
                            <button class="present-btn" data-action="present" title="Mark Present"><i class="fas fa-check"></i></button>
                            <button class="absent-btn" data-action="absent" title="Mark Absent"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="subject-utils" style="display: flex; gap: 0.5rem;">
                             <button data-action="delete" title="Delete Subject"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const overall = calculateOverallAttendance();
        const progressColor = overall.percentage < 75 ? 'red' : overall.percentage < 85 ? 'yellow' : 'green';
        const summaryHTML = `
            <div class="card attendance-summary-card">
                <h3 class="section-title">Overall Summary</h3>
                <div class="summary-percentage percentage-${progressColor}">${overall.percentage}%</div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill progress-bar-${progressColor}" style="width: ${overall.percentage}%"></div>
                </div>
                <div class="attendance-details">${overall.attended} / ${overall.total} total classes attended</div>
            </div>
        `;
        
        const summaryContainer = document.getElementById('attendance-summary-container');
        if(summaryContainer) {
            summaryContainer.innerHTML = summaryHTML;
        }
    }
    
    function setupAttendanceListeners() {
        const container = document.getElementById('attendance-grid-container');
        const addButton = document.getElementById('add-subject-btn');
        const newSubjectInput = document.getElementById('new-subject-name');

        if (addButton) {
            addButton.addEventListener('click', () => {
                const subjectName = newSubjectInput.value.trim();
                if (subjectName && !attendanceData[subjectName]) {
                    attendanceData[subjectName] = { attended: 0, total: 0 };
                    newSubjectInput.value = '';
                    renderAttendanceTracker();
                }
            });
        }

        if (container) {
            container.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;

                const card = button.closest('.subject-card');
                const subject = card.dataset.subject;
                const action = button.dataset.action;

                if (action === 'present') {
                    attendanceData[subject].attended++;
                    attendanceData[subject].total++;
                    renderAttendanceTracker();
                } else if (action === 'absent') {
                    attendanceData[subject].total++;
                    renderAttendanceTracker();
                } else if (action === 'delete') {
                    openModal({
                        title: 'Delete Subject',
                        body: `<p>Are you sure you want to delete the subject: "<strong>${subject}</strong>"?</p>`,
                        onConfirm: () => {
                            delete attendanceData[subject];
                            renderAttendanceTracker();
                            closeModal();
                        },
                        confirmText: 'Delete'
                    });
                }
            });
        }
    }
    
    function renderAssignments() {
        const container = document.getElementById('assignment-list-container');
        if (!container) return;

        const getDaysLeft = (deadline) => {
            if (!deadline) return { text: 'No deadline', color: 'gray' };
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const deadlineDate = new Date(deadline);
            deadlineDate.setMinutes(deadlineDate.getMinutes() + deadlineDate.getTimezoneOffset());
            deadlineDate.setHours(0, 0, 0, 0);

            const diffTime = deadlineDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) return { text: `Past Due`, color: 'red' };
            if (diffDays === 0) return { text: 'Due Today', color: 'red' };
            if (diffDays === 1) return { text: 'Due Tomorrow', color: 'yellow' };
            if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'yellow' };
            return { text: `${diffDays} days left`, color: 'green' };
        };

        if (assignments.length === 0) {
            container.innerHTML = `<div class="card no-assignments-card">
                <i class="fas fa-check-circle"></i>
                <p>No pending assignments!</p>
            </div>`;
            return;
        }

        const sortedAssignments = [...assignments].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        container.innerHTML = sortedAssignments.map(assignment => {
            const deadlineInfo = getDaysLeft(assignment.deadline);
            return `
                <div class="card assignment-card" data-id="${assignment.id}">
                    <div class="assignment-info">
                        <h3 class="assignment-title">${assignment.title}</h3>
                        <p class="assignment-deadline deadline-${deadlineInfo.color}">
                            <i class="fas fa-clock"></i> ${deadlineInfo.text}
                        </p>
                    </div>
                    <button class="delete-assignment-btn" data-action="delete" title="Delete Assignment">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    function setupAssignmentListeners() {
        const container = document.getElementById('assignment-list-container');
        const addButton = document.getElementById('add-assignment-btn');
        const titleInput = document.getElementById('new-assignment-title');
        const deadlineInput = document.getElementById('new-assignment-deadline');

        if (addButton) {
            addButton.addEventListener('click', () => {
                const title = titleInput.value.trim();
                const deadline = deadlineInput.value;
                if (title && deadline) {
                    assignments.push({ id: Date.now(), title, deadline });
                    titleInput.value = '';
                    deadlineInput.value = '';
                    renderAssignments();
                } else {
                     openModal({
                        title: 'Missing Information',
                        body: 'Please provide both a title and a deadline for the assignment.',
                        onConfirm: closeModal,
                        confirmText: 'OK'
                    });
                }
            });
        }
        
        if (container) {
            container.addEventListener('click', (e) => {
                const deleteButton = e.target.closest('.delete-assignment-btn');
                if (deleteButton) {
                    const card = deleteButton.closest('.assignment-card');
                    const id = Number(card.dataset.id);
                    const assignmentToDelete = assignments.find(a => a.id === id);

                    openModal({
                        title: 'Delete Assignment',
                        body: `<p>Are you sure you want to delete the assignment: "<strong>${assignmentToDelete.title}</strong>"?</p>`,
                        onConfirm: () => {
                            assignments = assignments.filter(assignment => assignment.id !== id);
                            renderAssignments();
                            closeModal();
                        },
                        confirmText: 'Delete'
                    });
                }
            });
        }
    }

    // --- Page Navigation and Initialization ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            renderPage(page);
        });
    });

    function initializeApp() {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="custom-modal-overlay" class="modal-overlay">
                <div class="modal-content">
                    <h2 id="modal-title"></h2>
                    <div id="modal-body"></div>
                    <div class="modal-actions">
                        <button id="modal-cancel-btn">Cancel</button>
                        <button id="modal-confirm-btn">Confirm</button>
                    </div>
                </div>
            </div>
        `);
        document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
        document.getElementById('modal-confirm-btn').addEventListener('click', () => {
            if (onConfirmCallback) onConfirmCallback();
        });

        const defaultLink = document.querySelector('.nav-link[data-page="dashboard"]');
        if (defaultLink) {
            defaultLink.classList.add('active');
            renderPage('dashboard');
        } else {
            console.error("Default page link not found. Cannot initialize app.");
        }
        
        // --- MOBILE NAVIGATION ---
        const menuToggleBtn = document.getElementById('menu-toggle-btn');
        const sidebar = document.querySelector('.sidebar');
        if (menuToggleBtn && sidebar) {
            menuToggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
            // Close sidebar when a nav link is clicked on mobile
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (sidebar.classList.contains('active')) {
                        sidebar.classList.remove('active');
                    }
                });
            });
            // Close sidebar when clicking on the content area
            contentArea.addEventListener('click', () => {
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            });
        }
    }

    initializeApp();
});