// Starting CO2 savings number
let co2Saved = 300;

// Update the number every 2 seconds
setInterval(() => {
    co2Saved += Math.floor(Math.random() * 3);
    document.getElementById("realtimeFeedback").textContent =
        "The community has saved " + co2Saved + " kg of CO₂ so far.";
}, 2000);

// Goal saving feedback
let btn = document.getElementById("saveGoalBtn");
console.log(btn);

btn.addEventListener("click", () => {
    const goal = document.getElementById("goalInput").value;

    if (!goal || goal <= 0) {
        document.getElementById("goalStatus").textContent =
            "Please enter a valid goal.";
        return;
    }

    document.getElementById("goalStatus").textContent =
        "Your weekly goal of " + goal + " kg CO₂ has been saved.";
});
