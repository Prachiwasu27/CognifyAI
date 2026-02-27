const BASE_URL = "https://cognifyai-nnc1.onrender.com";
// =============================
// INTRO TRANSITION
// =============================
const enterBtn = document.getElementById("enterBtn");
const introScreen = document.getElementById("introScreen");
const mainApp = document.getElementById("mainApp");

enterBtn.addEventListener("click", () => {
    introScreen.style.display = "none";
    mainApp.classList.remove("hidden");
});

// =============================
// AI ELEMENTS
// =============================
const generateBtn = document.getElementById("generateBtn");
const userInput = document.getElementById("userInput");
const outputBox = document.getElementById("outputBox");
const loader = document.getElementById("loader");

let currentMode = "explain"; // Default mode


// =============================
// 🔥 ADVANCED SMART FORMAT FUNCTION
// =============================
function formatAIResponse(text) {

    // ================= QUIZ UI =================
    if (currentMode === "quiz") {

        // Split by numbered questions (1. 2. 3. etc)
        const questions = text.split(/\n?\d+\.\s/g).filter(q => q.trim() !== "");

        let html = `<div class="quiz-container">`;

        questions.forEach((q, index) => {

            // Skip intro text
            if (q.toLowerCase().includes("quiz questions")) return;

            html += `
                <div class="quiz-card">
                    <div class="quiz-number">Question ${index + 1}</div>
                    <div class="quiz-text">
                        ${q.trim().replace(/\n/g, "<br>")}
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        return html;
    }

    // ================= FLASHCARD UI =================
    if (currentMode === "flashcards") {

        // Split by numbered format for flashcards too
        const cards = text.split(/\n?\d+\.\s/g).filter(c => c.trim() !== "");

        let html = `<div class="flashcard-container">`;

        cards.forEach(card => {

            const lines = card.split("\n");

            const question = lines[0];
            const answer = lines.slice(1).join("<br>");

            html += `
                <div class="flashcard" onclick="this.classList.toggle('flip')">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            ${question}
                        </div>
                        <div class="flashcard-back">
                            ${answer}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        return html;
    }

    // ================= SUMMARY =================
    if (currentMode === "summarize") {
        return `
            <div class="summary-box">
                ${text.replace(/\n/g, "<br>")}
            </div>
        `;
    }

    // ================= EXPLAIN =================
    return `
        <div class="explain-box">
            ${text.replace(/\n/g, "<br>")}
        </div>
    `;
}

// =============================
// REAL AI CONNECTION
// =============================
generateBtn.addEventListener("click", async () => {

    if (!userInput.value.trim()) {
        alert("Please enter some content!");
        return;
    }

    loader.style.display = "block";
    outputBox.innerHTML = "";

    try {

        const response = await fetch("/api/ai/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: userInput.value,
                mode: currentMode
            })
        });

        const data = await response.json();

        loader.style.display = "none";

        outputBox.innerHTML = formatAIResponse(data.reply);

    } catch (error) {

        loader.style.display = "none";
        outputBox.innerHTML = "Server error. Make sure backend is running.";
        console.error(error);
    }
});


// =============================
// PARTICLE BACKGROUND
// =============================
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = "#00f7ff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 150; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// =============================
// Sidebar Feature Buttons
// =============================
const featureButtons = document.querySelectorAll(".feature-btn");

featureButtons.forEach(button => {
    button.addEventListener("click", () => {

        featureButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const text = button.innerText;

        if (text.includes("Explain")) {
            currentMode = "explain";
            userInput.placeholder = "Enter topic to explain...";
        }
        else if (text.includes("Summarize")) {
            currentMode = "summarize";
            userInput.placeholder = "Paste notes to summarize...";
        }
        else if (text.includes("Quiz")) {
            currentMode = "quiz";
            userInput.placeholder = "Enter topic to generate quiz...";
        }
        else if (text.includes("Flashcards")) {
            currentMode = "flashcards";
            userInput.placeholder = "Enter content for flashcards...";
        }

    });
});

const textarea = document.getElementById("userInput");

textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});

