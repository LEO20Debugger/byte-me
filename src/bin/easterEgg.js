#!/usr/bin/env node
import readline from "readline";
import { rainbow as rainbowGradient } from "gradient-string";
import chalk from "chalk";

// --- Helper for typing effect ---
function typeWriter(text, delay = 50) {
  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      process.stdout.write(text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        process.stdout.write("\n");
        resolve();
      }
    }, delay);
  });
}

// --- Fake progress bar ---
async function fakeProgressBar(task = "Processing", length = 30) {
  process.stdout.write(`${task}: [`);
  for (let i = 0; i <= length; i++) {
    process.stdout.write("#");
    await new Promise((r) => setTimeout(r, Math.random() * 80 + 50));
  }
  process.stdout.write("] ✅\n");
}

// --- Fake hack / install animation ---
async function fakeHack() {
  const logs = [
    "[INFO] Connecting to secure repository 192.168.1.42…",
    "[INFO] Authenticating credentials…",
    "[DEBUG] Fetching byte-me modules v2.4.1",
    "[INFO] Decrypting payload…",
    "[WARN] Experimental features detected",
    "[DEBUG] Injecting hidden easter eggs",
    "[INFO] Compiling terminal assets",
    "[INFO] Executing scripts",
    "[INFO] Finalizing installation",
  ];

  for (const log of logs) {
    await typeWriter(log, 40);
    const delay = Math.random() * 400 + 200;
    await new Promise((r) => setTimeout(r, delay));

    // Randomly show a fake progress bar for realism
    if (Math.random() < 0.4) {
      await fakeProgressBar("Progress", 20 + Math.floor(Math.random() * 20));
    }
  }

  console.log(
    "\n[SUCCESS] Hack simulation complete. Ready for the challenge.\n"
  );
}

// --- Number guessing mini-game ---
async function miniGame() {
  console.log(
    "\n🎮 Mini-game: Guess the secret number (1-10) to unlock the treasure!"
  );

  const secretNumber = Math.floor(Math.random() * 10) + 1;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = () =>
    new Promise((resolve) => {
      rl.question(chalk.cyan("Enter your guess: "), (answer) => {
        const guess = parseInt(answer, 10);
        if (guess === secretNumber) {
          console.log(
            chalk.green(`🎉 Correct! The secret number was ${secretNumber}!`)
          );
          rl.close();
          resolve(true);
        } else if (guess < secretNumber) {
          console.log(chalk.yellow("Too low! Try again."));
          resolve(false);
        } else if (guess > secretNumber) {
          console.log(chalk.yellow("Too high! Try again."));
          resolve(false);
        } else {
          console.log(chalk.red("Not a valid number. Try again."));
          resolve(false);
        }
      });
    });

  let solved = false;
  while (!solved) {
    solved = await ask();
  }

  console.log(
    rainbowGradient.multiline(
      "\n🏆 Congratulations! You unlocked the secret easter egg!"
    )
  );
  console.log(
    "💡 Pro tip: Keep exploring your terminal, surprises await! 🚀\n"
  );
}

// --- Main function to run the hack + game ---
export async function runFakeHackGame() {
  console.clear();
  console.log(chalk.magentaBright("🚀 Initiating secret byte-me hack...\n"));
  await fakeHack();
  await miniGame();
}
